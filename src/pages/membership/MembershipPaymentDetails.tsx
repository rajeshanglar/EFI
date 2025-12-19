import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, Alert, Dimensions, Platform, Linking, Modal, ActivityIndicator, InteractionManager } from 'react-native';
import { PERMISSIONS, request, check, RESULTS } from 'react-native-permissions';
import globalStyles, { colors, spacing, Fonts, borderRadius } from '../../styles/globalStyles';
import Header from '../../components/Header';
import { GradientButton } from '../../components/GradientButton';
import { SuccessModal } from '../../components/SuccessModal';
import { FailureModal } from '../../components/FailureModal';
import {
  MembershipRegistration,
  CouponValidation,
  DownloadMembershipInvoice,
  CreateOrderPayment
} from '../../services/staticService';
import { MembershipRegPayload, CouponPayload } from '../../utils/types';
import { ToastService } from '../../utils/service-handlers';
import ReactNativeBlobUtil from 'react-native-blob-util';
// Razorpay

import RazorpayCheckout from "react-native-razorpay";


const { width: screenWidth } = Dimensions.get('window');

interface MembershipPaymentDetailsProps {
  onBack: () => void;
  onNavigateToHome: () => void;
  onNavigateToLogin?: () => void;
  onNavigateToMembershipPaymentDetails?: () => void;
  formData?: MembershipRegPayload;
  userData?: {
    name?: string;
    email?: string;
    phone?: string;
    country?: string;
  };
  paymentData?: {
    totalAmount?: number;
    coupon?: number;
    subTotal?: number;
    grandTotal?: number;
  };
}

const MembershipPaymentDetails: React.FC<MembershipPaymentDetailsProps> = ({
  onBack,
  onNavigateToHome,
  onNavigateToLogin,
  formData,
  userData,
  paymentData,
}) => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailureModal, setShowFailureModal] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [failureMessage, setFailureMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationId, setRegistrationId] = useState<number | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showRazorpay, setShowRazorpay] = useState(false);
  const [downloadAlert, setDownloadAlert] = useState<{ visible: boolean; message: string; type: 'success' | 'error' }>({
    visible: false,
    message: '',
    type: 'success',
  });
  const isClosingRef = useRef(false);

  // Auto-dismiss alert after 3 seconds
  useEffect(() => {
    if (downloadAlert.visible) {
      const timer = setTimeout(() => {
        setDownloadAlert(prev => ({ ...prev, visible: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [downloadAlert.visible]);
  const [paymentInfo, setPaymentInfo] = useState<any>([]);

  const getCountryId = (countryValue: string): number => {
    if (!countryValue) return 0;
    const numValue = parseInt(countryValue, 10);
    return isNaN(numValue) ? 0 : numValue;
  };

  const formatDateForAPI = (dateString: string): string => {
    if (!dateString || !dateString.trim()) return '';

    try {
      const separator = dateString.includes('-') ? '-' : dateString.includes('/') ? '/' : null;
      if (!separator) return '';

      const parts = dateString.split(separator);
      if (parts.length !== 3) return '';

      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      let year = parseInt(parts[2], 10);

      // Convert 1-2 digit year to 4 digits
      if (year < 100) {
        year = year < 10 ? 1900 + year : (year <= 30 ? 2000 + year : 1900 + year);
      }

      // Format as DD-MM-YYYY
      const formattedDay = String(day).padStart(2, '0');
      const formattedMonth = String(month).padStart(2, '0');
      const formattedYear = String(year);

      return `${formattedDay}-${formattedMonth}-${formattedYear}`;
    } catch (error) {
      console.error('Error formatting date:', dateString, error);
      return '';
    }
  };

  const calculateDiscount = (couponData: any, subTotal: number): number => {
    const couponType = couponData?.coupon_type?.toLowerCase() || '';
    const couponAmount = couponData?.coupon_amount || 0;

    if (couponType === 'percentage' || couponType === 'percent') {
      const percentage = typeof couponAmount === 'string' ? parseFloat(couponAmount) : couponAmount;
      return !isNaN(percentage) && percentage > 0 ? (subTotal * percentage) / 100 : 0;
    }

    return typeof couponAmount === 'string' ? parseFloat(couponAmount) : couponAmount;
  };

  const handleRegisterAfterSuccess = async (response: any) => {
    console.log("Razorpay Success:", response);

    // Show loading modal first
    setShowLoadingModal(true);

    // Validate email address before sending
    const emailId = formData?.email_id || '';
    if (!emailId || !emailId.trim()) {
      console.error('❌ ERROR: Email ID is missing or empty!');
      console.error('Form Data:', JSON.stringify(formData, null, 2));
      setShowLoadingModal(false);
      setFailureMessage('Email address is required for registration. Please contact support.');
      setShowFailureModal(true);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailId.trim())) {
      console.error('❌ ERROR: Invalid email format!', emailId);
      setShowLoadingModal(false);
      setFailureMessage('Invalid email address format. Please contact support.');
      setShowFailureModal(true);
      return;
    }

    console.log('✅ Email validation passed:', emailId);

    const payload: any = {
      // Required Registration Fields
      "first_name": formData?.first_name || '',
      "last_name": formData?.last_name || '',
      "email_id": emailId.trim(), // Use validated and trimmed email
      "phone_number": formData?.phone_number || '',
      "dob": formatDateForAPI(formData?.dob || '') || '',
      "grand_total": paymentData?.grandTotal,

      // Optional Registration Fields
      "city": formData?.city || '',
      "country": getCountryId(formData?.country.toString() || '') || 0,
      "hear_about_efi": formData?.hear_about_efi || '',
      "patient_count": parseInt(formData?.patient_count.toString() || '0', 10) || 0,
      "surgery_count": parseInt(formData?.surgery_count.toString() || '0', 10) || 0,
      "address": formData?.address || '',
      "coupon_code": formData?.coupon_code || '',
      "sub_total": paymentData?.subTotal,
      "coupon_value": paymentData?.coupon || 0,
      "source_type":"Mobile",

      // Payment Details (Success)
      "payment_gateway": "Razorpay",
      "payment_method": "",
      "payment_status": "success",
      "gateway_transaction_id": response.razorpay_payment_id || '',
      "gateway_order_id": response.razorpay_order_id || '',
      "currency": paymentInfo?.currency || "INR",
      "payment_date": new Date().toISOString(),
      // Optional: Full gateway response (JSON string)
      "gateway_response": JSON.stringify(response)
    };

    // Call registration API - modals will be shown after API response
    try {
      await handleRegister(payload);
    } catch (error) {
      console.error('Error in handleRegisterAfterSuccess:', error);
    } finally {
      // Hide loading modal after API call completes
      setShowLoadingModal(false);
    }

    console.log("=== RAZORPAY SUCCESS RESPONSE ===");
    console.log("Payload:", JSON.stringify(payload, null, 2));
    console.log("Payment Info:", JSON.stringify(paymentInfo, null, 2));
    console.log("Response:", JSON.stringify(response, null, 2));
    console.log("===================================");
  };


  const handleRegisterAfterFailure = async (response: any) => {
    console.log("=== RAZORPAY FAILURE RESPONSE ===");
    console.log("Response:", JSON.stringify(response, null, 2));
    console.log("Payment Info:", JSON.stringify(paymentInfo, null, 2));
    console.log("===================================");

    // Show loading modal first
    setShowLoadingModal(true);

    // Extract error details from Razorpay failure response
    // Razorpay error structure: { error: { code, description, source, step, reason } }
    const errorObj = response?.error || response;
    const errorDescription = errorObj?.description || response?.description || 'Card declined';
    const errorCode = errorObj?.code || response?.code || 'BAD_REQUEST_ERROR';
    const errorSource = errorObj?.source || response?.source || 'gateway';
    const errorStep = errorObj?.step || response?.step || 'payment_authorization';
    const errorReason = errorObj?.reason || response?.reason || 'payment_failed';

    // Format failure reason - use error description directly (API will format the message)
    // Don't add "Payment failed: " prefix here to avoid duplication
    const failureReason = errorDescription || 'Card declined';

    // Get order_id from paymentInfo (stored when order was created)
    // Get payment_id from response metadata or error object
    const gatewayOrderId = paymentInfo?.order_id || '';
    const gatewayTransactionId = response?.metadata?.payment_id || response?.payment_id || errorObj?.metadata?.payment_id || '';

    // Build error response object matching the expected format
    const errorResponseObj = {
      error: {
        code: errorCode,
        description: errorDescription,
        source: errorSource,
        step: errorStep,
        reason: errorReason
      }
    };

    const payload: any = {
      // Required Registration Fields (for form data capture in failed transaction)
      "first_name": formData?.first_name || '',
      "last_name": formData?.last_name || '',
      "email_id": formData?.email_id || '',
      "phone_number": formData?.phone_number || '',
      "dob": formatDateForAPI(formData?.dob || '') || '',
      "grand_total": paymentData?.grandTotal || 11800 || 0,

      // Optional Registration Fields (for form data capture)
      "city": formData?.city || '',
      "country": getCountryId(formData?.country.toString() || '') || 0,
      "hear_about_efi": formData?.hear_about_efi || '',
      "patient_count": parseInt(formData?.patient_count.toString() || '0', 10) || 0,
      "surgery_count": parseInt(formData?.surgery_count.toString() || '0', 10) || 0,
      "address": formData?.address || '',
      "coupon_code": formData?.coupon_code || '',
      "sub_total": paymentData?.subTotal || 11800,
      "coupon_value": paymentData?.coupon || 0,
      "source_type":"Mobile",

      // Payment Details (Failure) - REQUIRED for failed payments
      "payment_gateway": "Razorpay",
      "payment_method": "",
      "payment_status": "failed",
      "gateway_order_id": gatewayOrderId,
      "gateway_transaction_id": gatewayTransactionId,
      "currency": paymentInfo?.currency || "INR",
      "payment_date": new Date().toISOString(),
      "failure_reason": failureReason,
      // Optional: Full error details (JSON string)
      "gateway_response": JSON.stringify(errorResponseObj)
    };

    console.log('=== FAILURE REGISTRATION PAYLOAD ===');
    console.log('Payload:', JSON.stringify(payload, null, 2));
    console.log('=====================================');

    // Call registration API with failure payload
    // Note: API will return success: false for failed payments, which is expected
    // The handleRegister function will show the failure modal with API response message
    // Loading modal will be hidden in handleRegister before showing result modal
    try {
      await handleRegister(payload);
    } catch (error: any) {
      console.error('=== ERROR REGISTERING FAILED PAYMENT ===');
      console.error('Error:', error);
      console.error('Error Response:', error?.response);
      console.error('Error Status:', error?.response?.status);
      console.error('Error Data:', JSON.stringify(error?.response?.data, null, 2));

      // Hide loading modal if error occurs
      setShowLoadingModal(false);

      // Extract error message from API response
      let errorMessage = errorDescription || 'Payment failed. Please try again.';

      // Try to get error message from API response
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      // Show failure modal with extracted error message
      setFailureMessage(errorMessage);
      setShowFailureModal(true);
    }
  };
  const handleRegister = async (payload: any) => {
    console.log('================================');
    setIsSubmitting(true);
    try {

      console.log('=== MEMBERSHIP REGISTRATION PAYLOAD ===');
      console.log('Payload:', JSON.stringify(payload, null, 2));
      console.log('Email ID in Payload:', payload?.email_id);
      console.log('Email ID Type:', typeof payload?.email_id);
      console.log('Email ID Length:', payload?.email_id?.length);
      console.log('======================================');

      const result = await MembershipRegistration(payload);

      console.log('=== MEMBERSHIP REGISTRATION RESPONSE ===');
      console.log(JSON.stringify(result, null, 2));
      console.log('========================================');

      console.log('=== CHECKING API RESPONSE ===');
      console.log('Full Result:', JSON.stringify(result, null, 2));
      console.log('Result Status:', result?.status);
      console.log('Result Success:', result?.success);
      console.log('Result Message:', result?.message);
      console.log('Result Data:', JSON.stringify(result?.data, null, 2));
      console.log('Payment Status:', payload?.payment_status);

      // Check for email-related information in response
      console.log('\n=== EMAIL STATUS CHECK ===');
      console.log('Email Sent Flag:', result?.data?.email_sent);
      console.log('Email Sent Status:', result?.data?.email_status);
      console.log('Email Message:', result?.data?.email_message);
      console.log('Registration Email:', result?.data?.email || payload?.email_id);
      console.log('==============================');

      const paymentStatus = payload?.payment_status;

      // Check if registration was successful
      // If payment was successful, check if API response indicates success or failure
      // API can return: success: true OR status: 200/201 OR has registration_id in data
      // Only treat as failure if explicitly indicated: success: false OR status: 400
      const hasSuccessStatus = result?.status === 200 || result?.status === 201;
      const hasSuccessFlag = result?.success === true;
      const hasExplicitFailure = result?.success === false || result?.status === 400;
      const hasRegistrationId = !!(result?.data?.registration_id || result?.data?.id || result?.registration_id);

      // If payment succeeded, treat as success unless explicitly failed
      // Success if: payment was successful AND not explicitly failed by API
      // Default to success if payment succeeded unless API says otherwise
      const isSuccess = paymentStatus === 'success' && !hasExplicitFailure;

      console.log('=== SUCCESS CHECK ===');
      console.log('Payment Status:', paymentStatus);
      console.log('Has Success Flag:', hasSuccessFlag);
      console.log('Has Success Status:', hasSuccessStatus);
      console.log('Has Registration ID:', hasRegistrationId);
      console.log('Has Explicit Failure:', hasExplicitFailure);
      console.log('Is Success:', isSuccess);
      console.log('=======================');

      // If payment was successful and API call was successful, show success modal
      if (isSuccess) {
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

        // Hide loading modal before showing success modal
        setShowLoadingModal(false);

        // Build success message with email information
        let successMsg = result?.message || 'Membership registration successful!';

        // Add email information if available
        const emailAddress = payload?.email_id || formData?.email_id || userData?.email;
        if (emailAddress) {
          console.log('\n=== EMAIL INFORMATION ===');
          console.log('Email Address:', emailAddress);
          console.log('Email will be sent to:', emailAddress);
          console.log('==========================');

          // Check if API response indicates email status
          const emailSent = result?.data?.email_sent;
          const emailStatus = result?.data?.email_status;

          if (emailSent === false || emailStatus === 'failed') {
            console.warn('⚠️ Email sending may have failed according to API response');
            successMsg += `\n\n⚠️ Note: Email may not have been sent. Please contact support if you don't receive it.`;
          } else if (emailSent === true || emailStatus === 'sent') {
            console.log('✅ Email sent successfully according to API response');
          } else {
            console.log('ℹ️ Email status not explicitly mentioned in API response');
          }
        } else {
          console.warn('⚠️ No email address found in payload or form data');
        }

        // Store success message for display
        setSuccessMessage(successMsg);
        setShowSuccessModal(true);
      } else {
        // Registration failed or payment failed
        // Hide loading modal before showing failure modal
        setShowLoadingModal(false);

        // Show failure modal with API response message
        if (paymentStatus === 'failed') {
          setFailureMessage(result?.message || 'Payment failed. Please try again.');
        } else {
          setFailureMessage(result?.message || 'Registration failed. Please try again.');
        }
        setShowFailureModal(true);
      }
    } catch (error: any) {
      console.error('=== MEMBERSHIP REGISTRATION ERROR (CATCH BLOCK) ===');
      console.error('Error:', error);
      console.error('Error Response:', error?.response);

      // Handle 422 validation errors
      if (error?.response?.status === 422) {
        const errorData = error.response?.data;
        let errorMessage = 'Validation failed. Please check your input.';

        // Try to extract validation error messages
        if (errorData?.errors) {
          // Laravel-style validation errors: { errors: { field: ["message"] } }
          const validationErrors: string[] = [];
          Object.keys(errorData.errors).forEach(field => {
            const fieldErrors = errorData.errors[field];
            if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
              validationErrors.push(`${field}: ${fieldErrors[0]}`);
            }
          });

          if (validationErrors.length > 0) {
            errorMessage = validationErrors.join(', ');
          }
        } else if (errorData?.message) {
          errorMessage = errorData.message;
        }

        console.error('=== VALIDATION ERROR DETAILS ===');
        console.error('Status:', error.response?.status);
        console.error('Error Data:', JSON.stringify(errorData, null, 2));
        console.error('Error Message:', errorMessage);
        console.error('================================');

        // Hide loading modal before showing failure modal
        setShowLoadingModal(false);
        // Show failure modal with API error message
        setFailureMessage(errorMessage);
        setShowFailureModal(true);
      } else {
        // Handle other errors - show API response message
        const errorMessage = error?.response?.data?.message || error?.message || 'Registration failed. Please try again.';
        console.error('=== GENERAL ERROR ===');
        console.error('Error Message:', errorMessage);
        console.error('========================');

        // Hide loading modal before showing failure modal
        setShowLoadingModal(false);
        // Show failure modal with API error message
        setFailureMessage(errorMessage);
        setShowFailureModal(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };



  const handlePayment = async () => {
    if (isSubmitting || !formData) return;
    setIsSubmitting(true);
    const SUB_TOTAL = paymentData?.subTotal || 11800;
    let discount = paymentData?.coupon || 0;
    const grandTotal = paymentData?.grandTotal || SUB_TOTAL;

    try {
      const result = await CreateOrderPayment({
        amount: grandTotal,
        currency:formData?.currency,
        first_name: formData.first_name,
        last_name: formData.last_name,
        email_id: formData.email_id,
        phone_number: formData.phone_number,
      });

      console.log("CREATE ORDER :", result);
      if (result?.success === true) {
        console.log("CREATE ORDER SUCCESS:", result);
        const orderData = result.data;
        console.log("ORDER DATA:", orderData);
        setPaymentInfo(orderData);
        const options = {
          description: "Membership Payment",
          image: require("../../assets/images/logo-efi.png"),
          currency: orderData.currency,
          key: orderData.key, // Razorpay key from backend API response
          amount: orderData.amount, // From backend
          order_id: orderData.order_id,   // From backend
          name: "EFI",
          prefill: {
            email: formData.email_id,
            contact: formData.phone_number,
            name: formData.first_name + " " + formData.last_name,
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
        //setShowRazorpay(true);
      } else {
        ToastService.error("Error", result?.message || "Order creation failed");
        return;
      }

      //setShowRazorpay(true);
    } catch (e) {
      ToastService.error("Error", "Something went wrong!");
    } finally {
      setIsSubmitting(false);
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
      const result = await DownloadMembershipInvoice(payload);

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
          // For iOS, use Document directory
          filePath = `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/${filename}`;
        }

        console.log('\n');
        console.log('=== SAVING PDF FILE ===');
        console.log('File Path:', filePath);
        console.log('Base64 Data Length:', base64Data.length);
        console.log('===============================================================');

        // Write file using react-native-blob-util
        await ReactNativeBlobUtil.fs.writeFile(filePath, base64Data, 'base64');

        // Show success alert immediately after file write
        const successMessage = `Payment receipt Downloaded successfully!`;

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
              description: 'Membership receipt PDF downloaded successfully',
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
        if (!isPublicDownloads && Platform.OS === 'android') {
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
        title="Membership Payment Details"
        onBack={onBack}
        onNavigateToHome={onNavigateToHome}
        onMenuItemPress={() => { }}
      />

      {/* User Information Section */}
      <ImageBackground
        source={require('../../assets/images/wave-img.png')}
        style={globalStyles.imgBgContainerWave}
        imageStyle={globalStyles.imgBgWave}
      >
        <View style={styles.userInfoContainer}>
          {/* Name */}
          {userData?.name && (
            <View style={styles.userInfoRow}>
              <Text style={styles.userLabel}>Name</Text>
              <Text style={styles.userValue}>{userData.name}</Text>
            </View>
          )}

          {/* Email */}
          {userData?.email && (
            <View style={styles.userInfoRow}>
              <Text style={styles.userLabel}>Email</Text>
              <Text style={styles.userValue}>{userData.email}</Text>
            </View>
          )}

          {/* Phone */}
          {userData?.phone && (
            <View style={styles.userInfoRow}>
              <Text style={styles.userLabel}>Phone</Text>
              <Text style={styles.userValue}>{userData.phone}</Text>
            </View>
          )}

          {/* Country */}
          {userData?.country && (
            <View style={styles.userInfoRow}>
              <Text style={styles.userLabel}>Country</Text>
              <Text style={styles.userValue}>{userData.country}</Text>
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

          {/* Sub Total Amount */}
          {paymentData?.subTotal !== undefined && (
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Sub Amount</Text>
              <Text style={styles.paymentValue}>₹{paymentData.subTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
            </View>
          )}

          {/* Coupon Amount */}
          {paymentData?.coupon !== undefined && paymentData.coupon > 0 && (
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Coupon Amount</Text>
              <Text style={styles.paymentValue}>- ₹{paymentData.coupon.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
            </View>
          )}

          {/* Divider */}
          {(paymentData?.subTotal !== undefined || paymentData?.grandTotal !== undefined) && (
            <View style={styles.divider} />
          )}

          {/* Grand Total */}
          {paymentData?.grandTotal !== undefined && (
            <View style={styles.paymentRow}>
              <Text style={styles.grandTotalLabel}>Grand Total</Text>
              <Text style={styles.grandTotalValue}>₹{paymentData.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Register Now Button */}
      <View style={[globalStyles.footerBtContainer, styles.footerButtonContainer]}>
        <GradientButton
          title={isSubmitting ? 'REGISTERING...' : 'REGISTER NOW'}
          onPress={handlePayment}
          disabled={!formData}
        />
      </View>

      {/* Success Modal */}
      <SuccessModal
        visible={showSuccessModal}
        message={successMessage || "The payment has been completed successfully."}
        instructionText={`Please check your registered email (${userData?.email || formData?.email_id || 'your email'}) for your username and password to proceed with login.`}
        onClose={() => {
          setShowSuccessModal(false);
          setSuccessMessage('');
          if (onNavigateToLogin) {
            setTimeout(() => onNavigateToLogin(), 200);
          } else {
            onNavigateToHome?.();
          }
        }}
        onDownload={handleDownloadReceipt}
      />

      {/* Failure Modal */}
      <FailureModal
        visible={showFailureModal}
        message={failureMessage || "Payment Failed"}
        onClose={() => {
          setShowFailureModal(false);
          setFailureMessage('');
        }}
      />



      {/* Loading Modal */}
      <Modal
        visible={showLoadingModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => { }} // Prevent closing during loading
      >
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Processing...</Text>
          </View>
        </View>
      </Modal>

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
    paddingBottom: spacing.sm,
  },
  userLabel: {
    fontSize: screenWidth * 0.036,
    fontFamily: Fonts.Medium,
    color: colors.primaryLight,
    width: screenWidth * 0.25,
  },
  userValue: {
    fontSize: screenWidth * 0.036,
    fontFamily: Fonts.SemiBold,
    color: colors.primaryLight,
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
  loadingOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    minWidth: screenWidth * 0.6,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: screenWidth * 0.04,
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



export default MembershipPaymentDetails;

