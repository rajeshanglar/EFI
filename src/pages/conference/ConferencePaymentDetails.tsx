import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, ImageBackground, Modal, ActivityIndicator, Alert, Platform, Linking } from 'react-native';
import { PERMISSIONS, request, check, RESULTS } from 'react-native-permissions';
import globalStyles, { colors, spacing, borderRadius, Fonts } from '../../styles/globalStyles';
import Header from '../../components/Header';
import { GradientButton } from '../../components/GradientButton';
import { SuccessModal } from '../../components/SuccessModal';
import { FailureModal } from '../../components/FailureModal';
import { formatPrice } from '../../utils/currencyFormatter';
import { CreateConferenceOrder, ConferenceRegistration, DownloadConferenceInvoice } from '../../services/staticService';
import { ToastService } from '../../utils/service-handlers';
import { ConferenceRegPayload } from '../../utils/types';
import RazorpayCheckout from "react-native-razorpay";
import ReactNativeBlobUtil from 'react-native-blob-util';
const { width: screenWidth } = Dimensions.get('window');

interface ConferencePaymentDetailsProps {
  onBack: () => void;
  onNavigateToHome: () => void;
  onNavigateToQRCode?: (registrationId?: number) => void;
  ticketInfo?: {
    module_name?: string;
    categoryName?: string;
    ticketName?: string;
    membershipType?: string;
  };
  userData?: {
    full_name?: string;
    email?: string;
    mobile?: string;
  };
  paymentData?: {
    ticket_amount?: number;
    workshop_amount?: number;
    sub_total?: number;
    gst_amount?: number;
    grand_total?: number;
    currency?: string;
    tax?: number;
  };
  registrationPayload?: ConferenceRegPayload;
}

const ConferencePaymentDetails: React.FC<ConferencePaymentDetailsProps> = ({
  onBack,
  onNavigateToHome,
  onNavigateToQRCode,
  ticketInfo,
  userData,
  paymentData,
  registrationPayload,
}) => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailureModal, setShowFailureModal] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [failureMessage, setFailureMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState<any>([]);
  const [registrationId, setRegistrationId] = useState<number | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadAlert, setDownloadAlert] = useState<{ visible: boolean; message: string; type: 'success' | 'error' }>({
    visible: false,
    message: '',
    type: 'success',
  });

  // Auto-dismiss alert after 3 seconds
  useEffect(() => {
    if (downloadAlert.visible) {
      const timer = setTimeout(() => {
        setDownloadAlert(prev => ({ ...prev, visible: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [downloadAlert.visible]);

  const handlePayment = async () => {
    if (isSubmitting || !userData || !paymentData) return;
    
    setIsSubmitting(true);
    const grandTotal = paymentData.grand_total || 0;
    const currency = paymentData.currency || '';

    try {
      console.log('=== CREATE CONFERENCE ORDER API CALL ===');
      const payload = {
        amount: grandTotal,
        currency: currency,
        full_name: userData.full_name || '',
        email: userData.email || '',
        mobile: userData.mobile || '',
      };
      
      console.log('CreateConferenceOrder Payload:', JSON.stringify(payload, null, 2));

      const result = await CreateConferenceOrder(payload);

      console.log('=== CREATE CONFERENCE ORDER RESPONSE ===');
      console.log('Full Response:', JSON.stringify(result, null, 2));
      console.log('Success:', result?.success);
      console.log('Message:', result?.message);
      console.log('Data:', JSON.stringify(result?.data, null, 2));

      if (result?.success === true) {
        console.log('Order created successfully');
        const orderData = result.data;
        console.log("ORDER DATA:", orderData);
        setPaymentInfo(orderData);
        const options = {
          description: "Conference Payment",
          image: require("../../assets/images/logo-efi.png"),
          currency: orderData.currency,
          key: orderData.key, // Replace with Razorpay Key
          amount: orderData.amount, // From backend
          order_id: orderData.order_id,   // From backend
          name: "EFI",
          prefill: {
            email: userData.email,
            contact: userData.mobile,
            name: userData.full_name,
          },
          theme: { color: "#0086ff" },
        };

        RazorpayCheckout.open(options)
          .then((data) => {
            handleRegisterAfterSuccess(data);
          })
          .catch((error) => {
            handleRegisterAfterFailure(error);
          });
      } else {
        ToastService.error("Error", result?.message || "Order creation failed");
        return;
      }
    } catch (error: any) {
      console.error('=== CREATE CONFERENCE ORDER ERROR ===');
      console.error('Error:', JSON.stringify(error, null, 2));
      const errorMessage = error?.response?.data?.message || error?.message || 'Something went wrong!';
      ToastService.error('Error', errorMessage);
      setFailureMessage(errorMessage);
      setShowFailureModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterAfterSuccess = async (response: any) => {
    console.log('=== RAZORPAY SUCCESS ===');
    console.log('Response:', JSON.stringify(response, null, 2));
    
    setShowLoadingModal(true);
    
    if (!registrationPayload) {
      console.error('Registration payload is missing');
      setShowLoadingModal(false);
      setFailureMessage('Registration data is missing. Please try again.');
      setShowFailureModal(true);
      return;
    }

    // Update registration payload with payment details
    // Using any type since ConferenceRegPayload doesn't include payment gateway fields
    const updatedPayload: any = {
      ...registrationPayload,
      payment_status: 'success',
      payment_gateway: 'Razorpay',
      payment_method: '',
      gateway_transaction_id: response.razorpay_payment_id || '',
      gateway_order_id: response.razorpay_order_id || '',
      currency: paymentData?.currency || '',
      payment_date: new Date().toISOString(),
      source_type: 'Mobile',
      gateway_response: JSON.stringify(response),
    };

    console.log('=== UPDATING REGISTRATION WITH PAYMENT ===');
    console.log('Updated Payload:', JSON.stringify(updatedPayload, null, 2));

    try {
      const result = await ConferenceRegistration(updatedPayload);
      
      console.log('=== CONFERENCE REGISTRATION UPDATE RESPONSE ===');
      console.log('Full Response:', JSON.stringify(result, null, 2));
      console.log('Success:', result?.success);
      console.log('Message:', result?.message);

      setShowLoadingModal(false);

      if (result?.success === true) {
        console.log('=== PAYMENT SUCCESS - SHOWING SUCCESS MODAL ===');
        console.log('Result message:', result?.message);
        
        // Store registration_id from response for receipt download
        const regId = result?.data?.registration_id || result?.data?.id || result?.registration_id;
        if (regId) {
          const parsedId = typeof regId === 'number' ? regId : parseInt(String(regId), 10);
          if (!isNaN(parsedId)) {
            setRegistrationId(parsedId);
            console.log('=== REGISTRATION ID STORED ===');
            console.log('Registration ID:', parsedId);
            console.log('================================');
          }
        }
        
        setSuccessMessage(result?.message || 'Payment completed successfully.');
        setShowSuccessModal(true);
      } else {
        setFailureMessage(result?.message || 'Registration update failed. Please contact support.');
        setShowFailureModal(true);
      }
    } catch (error: any) {
      console.error('=== REGISTRATION UPDATE ERROR ===');
      console.error('Error:', JSON.stringify(error, null, 2));
      setShowLoadingModal(false);
      const errorMessage = error?.response?.data?.message || error?.message || 'Registration update failed. Please contact support.';
      setFailureMessage(errorMessage);
      setShowFailureModal(true);
    }
  };

  const handleRegisterAfterFailure = async (response: any) => {
    console.log('=== RAZORPAY FAILURE ===');
    console.log('Response:', JSON.stringify(response, null, 2));
    
    setShowLoadingModal(true);
    
    if (!registrationPayload) {
      console.error('Registration payload is missing');
      setShowLoadingModal(false);
      setFailureMessage('Payment failed. Please try again.');
      setShowFailureModal(true);
      return;
    }

    const errorObj = response?.error || response;
    const errorDescription = errorObj?.description || response?.description || 'Payment failed';
    
    // Update registration payload with failure details
    // Using any type since ConferenceRegPayload doesn't include payment gateway fields
    const updatedPayload: any = {
      ...registrationPayload,
      payment_status: 'failed',
      payment_gateway: 'Razorpay',
      payment_method: '',
      gateway_order_id: paymentInfo?.order_id || '',
      gateway_transaction_id: response?.razorpay_payment_id || '',
      currency: paymentData?.currency || '',
      payment_date: new Date().toISOString(),
      source_type: 'Mobile',
      failure_reason: errorDescription,
      gateway_response: JSON.stringify(response),
    };

    console.log('=== UPDATING REGISTRATION WITH FAILURE ===');
    console.log('Updated Payload:', JSON.stringify(updatedPayload, null, 2));

    try {
      const result = await ConferenceRegistration(updatedPayload);
      
      console.log('=== CONFERENCE REGISTRATION UPDATE RESPONSE (FAILURE) ===');
      console.log('Full Response:', JSON.stringify(result, null, 2));

      setShowLoadingModal(false);
      setFailureMessage(result?.message || errorDescription || 'Payment failed. Please try again.');
      setShowFailureModal(true);
    } catch (error: any) {
      console.error('=== REGISTRATION UPDATE ERROR (FAILURE) ===');
      console.error('Error:', JSON.stringify(error, null, 2));
      setShowLoadingModal(false);
      const errorMessage = error?.response?.data?.message || error?.message || errorDescription || 'Payment failed. Please try again.';
      setFailureMessage(errorMessage);
      setShowFailureModal(true);
    }
  };

  const handleDownloadReceipt = async () => {
    if (!registrationId) {
      ToastService.error('Error', 'Registration ID not found. Please try again.');
      console.error('Download Receipt Error: Registration ID is missing');
      return;
    }

    if (isDownloading) {
      console.log('Download already in progress');
      return;
    }

    setIsDownloading(true);

    try {
      console.log('\n');
      console.log('===============================================================');
      console.log('=== DOWNLOAD RECEIPT API CALL ===');
      console.log('===============================================================');
      console.log('Registration ID:', registrationId);

      const payload = {
        registration_id: registrationId,
      };

      console.log('API Payload:', JSON.stringify(payload, null, 2));
      console.log('===============================================================');

      // Make API call
      const result = await DownloadConferenceInvoice(payload);

      console.log('\n');
      console.log('===============================================================');
      console.log('=== DOWNLOAD RECEIPT API RESPONSE ===');
      console.log('===============================================================');
      console.log('Full Response:', JSON.stringify(result, null, 2));
      console.log('Success:', result?.success);
      console.log('Status:', result?.status);
      console.log('Message:', result?.message);
      console.log('Has Data:', !!result?.data);
      console.log('Has PDF Base64:', !!result?.data?.pdf_base64);
      console.log('Filename:', result?.data?.filename);
      console.log('PDF Base64 Length:', result?.data?.pdf_base64?.length || 0);
      console.log('===============================================================');

      // Check if API call was successful
      if (result?.success === true) {
        // Check if PDF data exists
        if (!result?.data?.pdf_base64) {
          const errorMsg = result?.message || 'PDF data not found in response.';
          console.error('PDF Data Missing:', errorMsg);
          console.error('Response Data Keys:', Object.keys(result?.data || {}));
          throw new Error(errorMsg);
        }

        const { pdf_base64, filename } = result.data;

        // Clean base64 data - remove data URI prefix if present
        let base64Data = pdf_base64;
        if (base64Data.includes(',')) {
          base64Data = base64Data.split(',')[1];
        }
        // Remove any whitespace
        base64Data = base64Data.trim();

        console.log('\n');
        console.log('=== PROCESSING PDF FILE ===');
        console.log('Original Base64 Length:', pdf_base64.length);
        console.log('Cleaned Base64 Length:', base64Data.length);
        console.log('Filename:', filename);
        console.log('Platform:', Platform.OS);
        console.log('Android Version:', Platform.OS === 'android' ? Platform.Version : 'N/A');
        console.log('===============================================================');

        // Request storage permission for Android 9 and below
        if (Platform.OS === 'android' && Platform.Version < 29) {
          try {
            const permission = PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE;
            const checkResult = await check(permission);

            if (checkResult !== RESULTS.GRANTED) {
              const requestResult = await request(permission);
              if (requestResult !== RESULTS.GRANTED) {
                Alert.alert(
                  'Storage Permission Required',
                  'Please grant storage permission to download the receipt.',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Open Settings',
                      onPress: () => Linking.openSettings()
                    }
                  ]
                );
                setIsDownloading(false);
                return;
              }
            }
          } catch (error) {
            console.error('Permission request error:', error);
            // Continue anyway - react-native-blob-util might still work
          }
        }

        // Determine file path based on platform
        let filePath: string;
        let isPublicDownloads = false;

        if (Platform.OS === 'android') {
          // For Android 10+ (API 29+), try to use the public Downloads directory
          if (Platform.Version >= 29) {
            // Android 10+ - Try to use public Downloads folder
            // Public Downloads is at /storage/emulated/0/Download (note: capital D)
            const publicDownloadsPath = '/storage/emulated/0/Download';

            try {
              // Check if we can write to public Downloads
              // First check if directory exists
              const publicDownloadsExists = await ReactNativeBlobUtil.fs.exists(publicDownloadsPath);

              if (publicDownloadsExists) {
                // Try to write a test to see if we have write permission
                const testFilePath = `${publicDownloadsPath}/.test_write_${Date.now()}`;
                try {
                  await ReactNativeBlobUtil.fs.writeFile(testFilePath, 'test', 'utf8');
                  await ReactNativeBlobUtil.fs.unlink(testFilePath); // Clean up test file

                  // We can write to public Downloads!
                  filePath = `${publicDownloadsPath}/${filename}`;
                  isPublicDownloads = true;
                  console.log('✅ Using public Downloads directory:', filePath);
                } catch (writeError) {
                  // Can't write to public Downloads, use app directory
                  console.warn('Cannot write to public Downloads, using app directory:', writeError);
                  filePath = `${ReactNativeBlobUtil.fs.dirs.DownloadDir}/${filename}`;
                }
              } else {
                // Public Downloads doesn't exist, use app directory
                console.warn('Public Downloads directory not found, using app directory');
                filePath = `${ReactNativeBlobUtil.fs.dirs.DownloadDir}/${filename}`;
              }
            } catch (error) {
              console.warn('Error checking public Downloads, using app directory:', error);
              // Fallback to app's DownloadDir
              filePath = `${ReactNativeBlobUtil.fs.dirs.DownloadDir}/${filename}`;
            }
          } else {
            // Android 9 and below - DownloadDir is public
            filePath = `${ReactNativeBlobUtil.fs.dirs.DownloadDir}/${filename}`;
            isPublicDownloads = true;
          }
        } else {
          // For iOS, create EFI folder in Document directory and save there
          const efiFolderPath = `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/EFI`;
          
          // Check if EFI folder exists, create if it doesn't
          const efiFolderExists = await ReactNativeBlobUtil.fs.exists(efiFolderPath);
          if (!efiFolderExists) {
            await ReactNativeBlobUtil.fs.mkdir(efiFolderPath);
            console.log('✅ Created EFI folder:', efiFolderPath);
          }
          
          filePath = `${efiFolderPath}/${filename}`;
          console.log('📁 iOS File Path:', filePath);
        }

        console.log('\n');
        console.log('=== SAVING PDF FILE ===');
        console.log('File Path:', filePath);
        console.log('Base64 Data Length:', base64Data.length);
        console.log('===============================================================');

        // Write file using react-native-blob-util
        await ReactNativeBlobUtil.fs.writeFile(filePath, base64Data, 'base64');

        // Show success alert immediately after file write
        let successMessage = `Payment receipt downloaded successfully!`;
        if (Platform.OS === 'ios') {
          successMessage = `Invoice saved to EFI folder!\n\nTo access: Files app > On My iPhone > Efi > EFI`;
        }

        // Set alert state directly - React will handle the render
        console.log('Setting download alert - visible: true, message:', successMessage);
        setDownloadAlert({
          visible: true,
          message: successMessage,
          type: 'success',
        });

        // Continue with verification and notification in background
        // Verify file was written
        const fileExists = await ReactNativeBlobUtil.fs.exists(filePath);
        if (!fileExists) {
          console.warn('File verification failed, but download may have succeeded');
        }

        // Get file stats to verify
        const fileStats = await ReactNativeBlobUtil.fs.stat(filePath);
        const fileSize = fileStats.size || 0;

        console.log('\n');
        console.log('=== PDF FILE SAVED SUCCESSFULLY ===');
        console.log('File Path:', filePath);
        console.log('File Exists:', fileExists);
        console.log('File Size:', fileSize, 'bytes');
        console.log('===============================================================');

        // Show Android notification in notification bar
        if (Platform.OS === 'android') {
          try {
            await ReactNativeBlobUtil.android.addCompleteDownload({
              title: filename,
              description: 'Conference receipt PDF downloaded successfully',
              mime: 'application/pdf',
              path: filePath,
              showNotification: true,
            });
            console.log('✅ Android notification added successfully');
          } catch (notificationError) {
            console.warn('⚠️ Failed to add Android notification:', notificationError);
            // Continue even if notification fails
          }
        }

        // Log the exact path for debugging
        console.log('\n');
        console.log('=== FILE SAVED SUCCESSFULLY ===');
        console.log('Full Path:', filePath);
        console.log('Is Public Downloads:', isPublicDownloads);
        console.log('Platform:', Platform.OS);
        console.log('Android Version:', Platform.OS === 'android' ? Platform.Version : 'N/A');
        if (Platform.OS === 'ios') {
          console.log('\n📱 iOS File Location:');
          console.log('Files app > On My iPhone > Efi > EFI >', filename);
        } else if (!isPublicDownloads && Platform.OS === 'android') {
          console.log('\n📱 To access the file:');
          console.log('1. Open Files app (or any file manager)');
          console.log('2. Navigate to: Internal storage > Android > data > com.efi > files > Download');
          console.log('3. Look for:', filename);
        }
        console.log('===============================================================');

      } else {
        // API returned success: false
        const errorMsg = result?.message || 'Failed to download receipt.';
        console.error('API Returned Success: False');
        console.error('Error Message:', errorMsg);
        console.error('Full Response:', JSON.stringify(result, null, 2));
        throw new Error(errorMsg);
      }
    } catch (error: any) {
      console.error('\n');
      console.error('===============================================================');
      console.error('=== DOWNLOAD RECEIPT ERROR ===');
      console.error('===============================================================');
      console.error('Error Type:', error?.constructor?.name);
      console.error('Error Message:', error?.message);
      console.error('Error Stack:', error?.stack);
      console.error('Error Response:', error?.response);
      console.error('Error Response Data:', error?.response?.data);
      console.error('Error Response Status:', error?.response?.status);
      console.error('Full Error Object:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
      console.error('===============================================================');

      let errorMessage = 'Failed to download receipt. Please try again.';

      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (error?.response?.status) {
        errorMessage = `Server error (${error.response.status}). Please try again.`;
      }

      // Show auto-dismissing error alert
      setDownloadAlert({
        visible: true,
        message: errorMessage,
        type: 'error',
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header
        title="Conference Payment Details"
        onBack={onBack}
        onNavigateToHome={onNavigateToHome}
        onMenuItemPress={(id: any) => console.log('Menu:', id)}
      />

      {/* Ticket and User Information Section */}
      <ImageBackground
        source={require('../../assets/images/wave-img.png')}
        style={globalStyles.imgBgContainerWave}
        imageStyle={globalStyles.imgBgWave}
      >
        <View style={styles.userInfoContainer}>
          {/* Ticket Information */}
          {ticketInfo?.membershipType && (
            <View style={styles.userInfoRow}>
              <Text style={styles.userLabel}>Membership</Text>
              <Text style={styles.userValue}>{ticketInfo.membershipType}</Text>
            </View>
          )}

          {ticketInfo?.module_name && (
            <View style={styles.userInfoRow}>
              <Text style={styles.userLabel}>Module</Text>
              <Text style={styles.userValue}>{ticketInfo.module_name}</Text>
            </View>
          )}

          {ticketInfo?.categoryName && (
            <View style={styles.userInfoRow}>
              <Text style={styles.userLabel}>Category</Text>
              <Text style={styles.userValue}>{ticketInfo.categoryName}</Text>
            </View>
          )}

          {ticketInfo?.ticketName && (
            <View style={styles.userInfoRow}>
              <Text style={styles.userLabel}>Ticket</Text>
              <Text style={styles.userValue}>{ticketInfo.ticketName}</Text>
            </View>
          )}

          {/* User Information */}
          {userData?.full_name && (
            <View style={styles.userInfoRow}>
              <Text style={styles.userLabel}>Name</Text>
              <Text style={styles.userValue}>{userData.full_name}</Text>
            </View>
          )}

          {userData?.email && (
            <View style={styles.userInfoRow}>
              <Text style={styles.userLabel}>Email</Text>
              <Text style={styles.userValue}>{userData.email}</Text>
            </View>
          )}

          {userData?.mobile && (
            <View style={styles.userInfoRow}>
              <Text style={styles.userLabel}>Phone</Text>
              <Text style={styles.userValue}>{userData.mobile}</Text>
            </View>
          )}
        </View>
      </ImageBackground>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Payment Information Section */}
        <View style={styles.paymentSection}>
          <Text style={styles.paymentTitle}>Payment Information</Text>

          {/* Ticket Price */}
          {paymentData?.ticket_amount !== undefined && (
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Ticket Price</Text>
              <Text style={styles.paymentValue}>
                {formatPrice(paymentData.ticket_amount, paymentData.currency || '')}
              </Text>
            </View>
          )}

          {/* Workshop Price */}
          {paymentData?.workshop_amount !== undefined && paymentData.workshop_amount > 0 && (
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Workshop Price</Text>
              <Text style={styles.paymentValue}>
                {formatPrice(paymentData.workshop_amount, paymentData.currency || '')}
              </Text>
            </View>
          )}

          {/* Sub Total */}
          {paymentData?.sub_total !== undefined && (
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Sub Total</Text>
              <Text style={styles.paymentValue}>
                {formatPrice(paymentData.sub_total, paymentData.currency || '')}
              </Text>
            </View>
          )}

          {/* GST Amount */}
          {paymentData?.gst_amount !== undefined && paymentData.gst_amount > 0 && (
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>
                GST{paymentData?.tax !== undefined && paymentData.tax > 0 ? ` ${paymentData.tax}%` : ''}
              </Text>
              <Text style={styles.paymentValue}>
                {formatPrice(paymentData.gst_amount, paymentData.currency || '')}
              </Text>
            </View>
          )}

          {/* Divider */}
          <View style={styles.divider} />

          {/* Grand Total */}
          {paymentData?.grand_total !== undefined && (
            <View style={styles.paymentRow}>
              <Text style={styles.grandTotalLabel}>Grand Total</Text>
              <Text style={styles.grandTotalValue}>
                {formatPrice(paymentData.grand_total, paymentData.currency || '')}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Register Now Button */}
      <View style={[globalStyles.footerBtContainer, styles.footerButtonContainer]}>
        <GradientButton 
          title="REGISTER NOW" 
          onPress={handlePayment}
          disabled={isSubmitting}
        />
      </View>

      {/* Loading Modal */}
      <Modal
        visible={showLoadingModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.loadingModalContainer}>
          <View style={styles.loadingModalContent}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingModalText}>Processing...</Text>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <SuccessModal
        visible={showSuccessModal}
        message={successMessage || 'The payment has been completed successfully.'}
        onClose={() => {
          setShowSuccessModal(false);
          setSuccessMessage('');
          onNavigateToQRCode?.(registrationId || undefined);
        }}
        onDownload={handleDownloadReceipt}
        downloadText="Download Invoice"
      />

      {/* Failure Modal */}
      <FailureModal
        visible={showFailureModal}
        message={failureMessage || 'Payment Failed'}
        onClose={() => {
          setShowFailureModal(false);
          setFailureMessage('');
        }}
      />

      {/* Auto-dismissing Download Alert */}
      <Modal
        visible={downloadAlert.visible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDownloadAlert(prev => ({ ...prev, visible: false }))}
        statusBarTranslucent={true}
      >
        <View style={styles.alertOverlay}>
          <View style={[
            styles.alertContainer,
            downloadAlert.type === 'success' ? styles.alertSuccess : styles.alertError
          ]}>
            <View style={styles.alertIcon}>
              {downloadAlert.type === 'success' ? (
                <Text style={styles.alertSuccessIcon}>✓</Text>
              ) : (
                <Text style={styles.alertErrorIcon}>✕</Text>
              )}
            </View>
            <Text style={styles.alertMessage}>{downloadAlert.message}</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: colors.white,
  },

  userInfoContainer: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  userInfoRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingBottom:0,
  },
  userLabel: {
    fontSize: screenWidth * 0.036,
    fontFamily: Fonts.Medium,
    color: colors.primaryLight,
    width:Dimensions.get('window').width * 0.28,
    
  },
  userValue: {
    fontSize: screenWidth * 0.036,
    fontFamily: Fonts.SemiBold,
    color: colors.primaryLight,
    textTransform: 'capitalize',
   
    textAlign: 'left',
  },
  scrollView: {
    flex: 1,
    marginBottom: 80,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  paymentSection: {
    padding: spacing.lg,
    backgroundColor: colors.white,
  },
  paymentTitle: {
    fontSize: screenWidth * 0.045,
    fontFamily: Fonts.Bold,
    color: colors.black,
    marginBottom: spacing.lg,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  paymentLabel: {
    fontSize: screenWidth * 0.038,
    fontFamily: Fonts.Regular,
    color: colors.black,
  },
  paymentValue: {
    fontSize: screenWidth * 0.038,
    fontFamily: Fonts.Regular,
    color: colors.black,
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray,
    marginVertical: spacing.md,
  },
  grandTotalLabel: {
    fontSize: screenWidth * 0.042,
    fontFamily: Fonts.Bold,
    color: colors.black,
  },
  grandTotalValue: {
    fontSize: screenWidth * 0.042,
    fontFamily: Fonts.Bold,
    color: colors.black,
  },
  footerButtonContainer: {
    zIndex: 1000,
    elevation: 20,
  },
  loadingModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingModalContent: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.xl,
    alignItems: 'center',
    minWidth: 150,
  },
  loadingModalText: {
    marginTop: spacing.md,
    fontSize: screenWidth * 0.038,
    fontFamily: Fonts.Medium,
    color: colors.black,
  },
  alertOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  alertContainer: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.xl,
    minWidth: screenWidth * 0.7,
    maxWidth: screenWidth * 0.9,
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  alertSuccess: {
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  alertError: {
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  alertIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  alertSuccessIcon: {
    fontSize: 30,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  alertErrorIcon: {
    fontSize: 30,
    color: '#F44336',
    fontWeight: 'bold',
  },
  alertMessage: {
    fontSize: screenWidth * 0.04,
    fontFamily: Fonts.Medium,
    color: colors.black,
    textAlign: 'center',
    lineHeight: screenWidth * 0.06,
  },
});

export default ConferencePaymentDetails;

