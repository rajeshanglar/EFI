import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Platform,
  Alert,
  Modal,
  Linking,
  Image,
} from 'react-native';
import { PERMISSIONS, request, check, RESULTS } from 'react-native-permissions';
import Pdf from 'react-native-pdf';
import Header from '../../components/Header';
import globalStyles, { colors, spacing, borderRadius, Fonts } from '../../styles/globalStyles';
import { DownloadWhiteIcon, MyCertificatesIcon, CardRightArrowIcon, CloseIcon } from '../../components/icons';
import { DownloadMembershipCertificate } from '../../services/membershipService';
import { ToastService } from '../../utils/service-handlers';
import { useAuth } from '../../contexts/AuthContext';
import ReactNativeBlobUtil from 'react-native-blob-util';

const { width: screenWidth } = Dimensions.get('window');

interface CertificateData {
  registration_id: number;
  serial_number: string;
  filename: string;
  pdf_base64: string;
  mime_type: string;
}

interface MyCertificatesProps {
  onBack: () => void;
  onNavigateToHome: () => void;
}

const MyCertificates: React.FC<MyCertificatesProps> = ({
  onBack,
  onNavigateToHome,
}) => {
  const { isAuthenticated, user } = useAuth();
  const [certificates, setCertificates] = useState<CertificateData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [downloadAlert, setDownloadAlert] = useState<{ visible: boolean; message: string; type: 'success' | 'error' }>({
    visible: false,
    message: '',
    type: 'success',
  });
  const [viewerVisible, setViewerVisible] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<CertificateData | null>(null);

  // Auto-dismiss alert after 3 seconds
  useEffect(() => {
    if (downloadAlert.visible) {
      const timer = setTimeout(() => {
        setDownloadAlert(prev => ({ ...prev, visible: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [downloadAlert.visible]);

  const fetchCertificates = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      setError('Please login to view your certificates');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get membership registrations from user context
      const membershipRegistrations = user?.linked_registrations?.membership || [];
      
      if (!Array.isArray(membershipRegistrations) || membershipRegistrations.length === 0) {
        setError('No membership registrations found');
        setCertificates([]);
        setLoading(false);
        return;
      }

      // Fetch certificate for each membership registration
      const certificatePromises = membershipRegistrations.map(async (registration: any) => {
        try {
          const registrationId = registration.id || registration.registration_id;
          const result = await DownloadMembershipCertificate(registrationId);
          
          if (result?.success === true && result?.data) {
            return {
              registration_id: result.data.registration_id || registrationId || 0,
              serial_number: result.data.serial_number || registration.serial_number || '',
              filename: result.data.filename || `Membership-Certificate-${result.data.serial_number || 'N/A'}.pdf`,
              pdf_base64: result.data.pdf_base64 || '',
              mime_type: result.data.mime_type || 'application/pdf',
            };
          }
          return null;
        } catch (err) {
          console.error('Error fetching certificate for registration:', registration.id, err);
          return null;
        }
      });

      const fetchedCertificates = await Promise.all(certificatePromises);
      const validCertificates = fetchedCertificates.filter((cert): cert is CertificateData => cert !== null);

      if (validCertificates.length === 0) {
        setError('No certificates found');
        setCertificates([]);
      } else {
        setCertificates(validCertificates);
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to fetch certificates. Please try again.';
      setError(errorMessage);
      setCertificates([]);
      ToastService.error('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, [isAuthenticated]);

  const handleViewCertificate = (certificate: CertificateData) => {
    setSelectedCertificate(certificate);
    setViewerVisible(true);
  };

  const handleCloseViewer = () => {
    setViewerVisible(false);
    setSelectedCertificate(null);
  };

  const handleDownloadCertificate = async (certificate: CertificateData) => {
    if (downloadingId === certificate.registration_id) {
      console.log('Download already in progress');
      return;
    }

    setDownloadingId(certificate.registration_id);

    try {
      console.log('\n');
      console.log('===============================================================');
      console.log('=== DOWNLOAD CERTIFICATE ===');
      console.log('===============================================================');
      console.log('Registration ID:', certificate.registration_id);
      console.log('Filename:', certificate.filename);

      if (!certificate.pdf_base64) {
        throw new Error('PDF data not found in certificate.');
      }

      const { pdf_base64, filename } = certificate;

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
                'Please grant storage permission to download the certificate.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Open Settings',
                    onPress: () => Linking.openSettings()
                  }
                ]
              );
              setDownloadingId(null);
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
          const publicDownloadsPath = '/storage/emulated/0/Download';

          try {
            // Check if we can write to public Downloads
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
      const successMessage = `Certificate downloaded successfully!`;

      // Set alert state directly
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
            description: 'Membership certificate PDF downloaded successfully',
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

    } catch (error: any) {
      console.error('\n');
      console.error('===============================================================');
      console.error('=== DOWNLOAD CERTIFICATE ERROR ===');
      console.error('===============================================================');
      console.error('Error Type:', error?.constructor?.name);
      console.error('Error Message:', error?.message);
      console.error('Error Stack:', error?.stack);
      console.error('Error Response:', error?.response);
      console.error('Error Response Data:', error?.response?.data);
      console.error('Error Response Status:', error?.response?.status);
      console.error('Full Error Object:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
      console.error('===============================================================');

      let errorMessage = 'Failed to download certificate. Please try again.';

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
      setDownloadingId(null);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="My Certificates"
        onBack={onBack}
        onNavigateToHome={onNavigateToHome}
        onMenuItemPress={(id: any) => console.log('Menu:', id)}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.emptyContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.emptyText, { marginTop: spacing.md }]}>
              Loading certificates...
            </Text>
          </View>
        ) : error ? (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.red }]}>
              {error}
            </Text>
          </View>
        ) : certificates.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MyCertificatesIcon size={64} color={colors.gray} />
            <Text style={styles.emptyText}>No certificates found</Text>
          </View>
        ) : (
          certificates.map((certificate) => (
            <TouchableOpacity
              key={certificate.registration_id}
              style={styles.certificateCard}
              onPress={() => handleViewCertificate(certificate)}
              activeOpacity={0.9}
            >
              {/* Certificate Info */}
              <View style={styles.certificateInfo}>               
                
                    <Text style={styles.certificateLabel}>Certificate</Text>
                   
                
                  <View style={styles.certificateDetails}>
                  <Text style={styles.serialLabel}>Serial Number</Text>
                  <Text style={styles.serialNumber}>{certificate.serial_number}</Text>

                  <Text style={styles.certificateTitle} numberOfLines={1}>
                      {certificate.filename}
                    </Text>
                  
                </View>
               

               

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.viewButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleViewCertificate(certificate);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.viewButtonText}>View</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.downloadButton,
                      downloadingId === certificate.registration_id && styles.downloadButtonDisabled
                    ]}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleDownloadCertificate(certificate);
                    }}
                    activeOpacity={0.7}
                    disabled={downloadingId === certificate.registration_id}
                  >
                    {downloadingId === certificate.registration_id ? (
                      <ActivityIndicator size="small" color={colors.white} />
                    ) : (
                      <>
                        <DownloadWhiteIcon size={16} color={colors.white} />
                        <Text style={styles.downloadButtonText}>Download</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Full-Screen PDF Viewer Modal */}
      <Modal
        visible={viewerVisible}
        animationType="slide"
        onRequestClose={handleCloseViewer}
        statusBarTranslucent={true}
      >
        <View style={styles.viewerContainer}>
          <View style={styles.viewerHeader}>
            <Text style={styles.viewerTitle} numberOfLines={1}>
              {selectedCertificate?.filename || 'Certificate'}
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCloseViewer}
              activeOpacity={0.7}
            >
              <CloseIcon size={15} color={colors.white} />
            </TouchableOpacity>
          </View>

          {selectedCertificate && (
            <Pdf
              source={{
                uri: `data:application/pdf;base64,${selectedCertificate.pdf_base64}`,
                cache: true,
              }}
              style={styles.pdf}
              onLoadComplete={(numberOfPages) => {
                console.log(`Number of pages: ${numberOfPages}`);
              }}
              onPageChanged={(page, numberOfPages) => {
                console.log(`Current page: ${page}`);
              }}
              onError={(error) => {
                console.error('PDF Error:', error);
                Alert.alert('Error', 'Failed to load PDF. Please try again.');
                handleCloseViewer();
              }}
              enablePaging={true}
              horizontal={false}
            />
          )}

          {/* Viewer Footer Actions */}
          <View style={styles.viewerFooter}>
            <TouchableOpacity
              style={styles.viewerDownloadButton}
              onPress={() => {
                if (selectedCertificate) {
                  handleCloseViewer();
                  setTimeout(() => {
                    handleDownloadCertificate(selectedCertificate);
                  }, 300);
                }
              }}
              activeOpacity={0.7}
            >
              <DownloadWhiteIcon size={20} color={colors.white} />
              <Text style={styles.viewerDownloadButtonText}>Download</Text>
            </TouchableOpacity>
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
    backgroundColor: colors.primary,
  },
  scrollView: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl,
    minHeight: 300,
  },
  emptyText: {
    fontSize: screenWidth * 0.038,
    fontFamily: Fonts.Medium,
    color: colors.darkGray,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  certificateCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    overflow: 'hidden',
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  thumbnailContainer: {
    width: '100%',
    height: screenWidth * 0.4,
    position: 'relative',
    backgroundColor: colors.lightGray,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  thumbnailOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pdfIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pdfIconText: {
    fontSize: 18,
    fontFamily: Fonts.Bold,
    color: colors.white,
  },
  certificateInfo: {
    padding: spacing.md,
  },
  certificateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  certificateTitleContainer: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  certificateLabel: {
    fontSize: screenWidth * 0.028,
    fontFamily: Fonts.Regular,
    color: colors.gray,
    marginBottom: spacing.xs,
  },
  certificateTitle: {
    fontSize: screenWidth * 0.036,
    fontFamily: Fonts.Regular,
    color: colors.darkGray,
    lineHeight: screenWidth * 0.048,
  },
  certificateDetails: {
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  serialLabel: {
    fontSize: screenWidth * 0.03,
    fontFamily: Fonts.Regular,
    color: colors.darkGray,
   
  },
  serialNumber: {
    fontSize: screenWidth * 0.043,
    fontFamily: Fonts.SemiBold,
    color: colors.primary,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  viewButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewButtonText: {
    fontSize: screenWidth * 0.035,
    fontFamily: Fonts.Medium,
    color: colors.primary,
  },
  downloadButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xs,
  },
  downloadButtonDisabled: {
    opacity: 0.6,
  },
  downloadButtonText: {
    fontSize: screenWidth * 0.035,
    fontFamily: Fonts.Medium,
    color: colors.white,
  },
  downloadIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewerContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  viewerHeader: {
   
    paddingBottom: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primary,
    paddingTop: Platform.OS === 'android' ? spacing.xxl : spacing.xl,
  },
  viewerTitle: {
    flex: 1,
    fontSize: screenWidth * 0.04,
    fontFamily: Fonts.Bold,
    color: colors.white,
    marginRight: spacing.md,
    paddingTop: spacing.lg,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.sm,
  },

  pdf: {
    flex: 1,
    width: screenWidth,
    backgroundColor: colors.lightGray,
  },
  viewerFooter: {
    padding: spacing.md,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  viewerDownloadButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
  },
  viewerDownloadButtonText: {
    fontSize: screenWidth * 0.038,
    fontFamily: Fonts.Medium,
    color: colors.white,
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

export default MyCertificates;

