import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Alert,
  Linking,
} from 'react-native';
import { PERMISSIONS, request, check, RESULTS } from 'react-native-permissions';
import Pdf from 'react-native-pdf';
import ReactNativeBlobUtil from 'react-native-blob-util';
import Header from '../../../components/Header';
import globalStyles, { colors, spacing, borderRadius, Fonts } from '../../../styles/globalStyles';
import { GradientButton } from '../../../components/GradientButton';
import { SuccessModal } from '../../../components/SuccessModal';
import { BackArrowIcon, EmailModalIcon } from '../../../components/icons';
import { DownloadConferenceQRCode } from '../../../services/staticService';
import { ToastService } from '../../../utils/service-handlers';
import { DownloadWhiteIcon } from '../../../components/icons';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface ConferenceQRCodeProps {
  onBack: () => void;
  onNavigateToHome: () => void;
  onNavigateToLogin: () => void;
  registrationId?: number;
}

interface CardData {
  id: string;
  registration_id: number;
  serial_number: string;
  pdf_base64: string;
  filename: string;
}

const ConferenceQRCode: React.FC<ConferenceQRCodeProps> = ({
  onBack,
  onNavigateToHome,
  onNavigateToLogin,
  registrationId,
}) => {
  const [cardData, setCardData] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchCard();
  }, [registrationId]);

  const fetchCard = async () => {
    if (!registrationId) {
      setLoading(false);
      setError('Registration ID not found');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await DownloadConferenceQRCode({ registration_id: registrationId });
      
      if (result?.success === true && result?.data?.pdf_base64) {
        setCardData({
          id: String(registrationId),
          registration_id: result.data.registration_id || registrationId,
          serial_number: result.data.serial_number || '',
          filename: result.data.filename || '',
          pdf_base64: result.data.pdf_base64,
        });
      } else {
        setError(result?.message || 'Failed to load QR code');
        setCardData(null);
      }
    } catch (err: any) {
      console.error('Error fetching QR code:', err);
      setError(err?.message || 'Failed to load QR code. Please try again.');
      setCardData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToLogin = () => {
    setShowModal(true);
  };

  const handleModalOkay = () => {
    setShowModal(false);
    onNavigateToLogin();
  };

  const handleDownloadCard = async (card: CardData) => {
    if (!card.pdf_base64) {
      ToastService.error('Error', 'PDF data not available');
      return;
    }

    if (downloadingId === card.registration_id) {
      return;
    }

    setDownloadingId(card.registration_id);

    try {
      const { pdf_base64, filename } = card;

      let base64Data = pdf_base64;
      if (base64Data.includes(',')) {
        base64Data = base64Data.split(',')[1];
      }
      base64Data = base64Data.trim();

      if (Platform.OS === 'android' && Number(Platform.Version) < 29) {
        try {
          const permission = PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE;
          const checkResult = await check(permission);

          if (checkResult !== RESULTS.GRANTED) {
            const requestResult = await request(permission);
            if (requestResult !== RESULTS.GRANTED) {
              Alert.alert(
                'Storage Permission Required',
                'Please grant storage permission to download the QR code.',
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
        }
      }

      if (!filename) {
        throw new Error('Filename not available');
      }

      const getFilePath = async (): Promise<string> => {
        if (Platform.OS === 'ios') {
          return `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/${filename}`;
        }

        if (Number(Platform.Version) >= 29) {
          const publicDownloadsPath = '/storage/emulated/0/Download';
          try {
            if (await ReactNativeBlobUtil.fs.exists(publicDownloadsPath)) {
              const testFilePath = `${publicDownloadsPath}/.test_write_${Date.now()}`;
              try {
                await ReactNativeBlobUtil.fs.writeFile(testFilePath, 'test', 'utf8');
                await ReactNativeBlobUtil.fs.unlink(testFilePath);
                return `${publicDownloadsPath}/${filename}`;
              } catch {
                return `${ReactNativeBlobUtil.fs.dirs.DownloadDir}/${filename}`;
              }
            }
          } catch {
            // Fall through to default
          }
        }
        return `${ReactNativeBlobUtil.fs.dirs.DownloadDir}/${filename}`;
      };

      const filePath = await getFilePath();
      await ReactNativeBlobUtil.fs.writeFile(filePath, base64Data, 'base64');

      ToastService.success('Success', 'QR code downloaded successfully!');

      if (Platform.OS === 'android') {
        try {
          await ReactNativeBlobUtil.android.addCompleteDownload({
            title: filename,
            description: filename,
            mime: 'application/pdf',
            path: filePath,
            showNotification: true,
          });
        } catch (notificationError) {
          console.warn('Failed to add Android notification:', notificationError);
        }
      }

    } catch (error: any) {
      console.error('Download error:', error);
      const errorMessage = error?.message || 'Failed to download QR code. Please try again.';
      ToastService.error('Error', errorMessage);
    } finally {
      setDownloadingId(null);
    }
  };

  const renderCard = (item: CardData) => (
    <View style={styles.cardContainer}>
      <View style={styles.card}>
        <View style={styles.cardBody}>
          {item.pdf_base64 ? (
            <View style={styles.cardPdfContainer}>
              <Pdf
                source={{
                  uri: `data:application/pdf;base64,${item.pdf_base64}`,
                  cache: true,
                }}
                style={styles.cardPdf}
                onError={(error) => {
                  console.error('PDF Error:', error);
                  ToastService.error('Error', 'Failed to load PDF. Please try again.');
                }}
                enablePaging={true}
                horizontal={false}
                spacing={0}
                fitPolicy={2}
                scale={1.0}
              />
            </View>
          ) : (
            <View style={styles.cardPdfContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>Loading QR code...</Text>
            </View>
          )}

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.downloadButton]}
              onPress={() => handleDownloadCard(item)}
              activeOpacity={0.7}
              disabled={downloadingId === item.registration_id}
            >
              {downloadingId === item.registration_id ? (
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
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Conference QR Code"
        onBack={onBack}
        onNavigateToHome={onNavigateToHome}
        onMenuItemPress={() => {}}
      />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.emptyContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.emptyText, { marginTop: spacing.md }]}>
              Loading cards...
            </Text>
          </View>
        ) : error ? (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.red }]}>
              {error}
            </Text>
          </View>
        ) : !cardData ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No QR code found</Text>
          </View>
        ) : (
          <View style={styles.cardContent}>
            {renderCard(cardData)}
          </View>
        )}

        {/* Login Prompt */}
        <View style={globalStyles.qrLoginPrompt}>
          <Text style={globalStyles.qrPromptText}>
            Please check your registered email for your username and password to proceed with login.
          </Text>
        </View>

        {/* Proceed To Login Button */}
        <View style={globalStyles.qrProceedToLoginButton}>
          <View style={globalStyles.qrProceedLoginArrow} pointerEvents="none">
            <BackArrowIcon size={20} style={styles.qrProceedLoginArrowIcon} />
          </View>
          <GradientButton
            title="Proceed To Login"
            onPress={handleProceedToLogin}
          />
        </View>
      </ScrollView>

      {/* Success Modal */}
      <SuccessModal
        visible={showModal}
        message="Please check your registered email for your username and password to proceed with login."
        onClose={handleModalOkay}
        icon={<EmailModalIcon size={90} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    flex: 1,
  },
  cardContent: {
    paddingHorizontal: screenWidth * 0.04,
    paddingVertical: screenWidth * 0.08,
    alignItems: 'center',
  },
  cardContainer: {
    width: screenWidth - screenWidth * 0.04 - screenWidth * 0.1,
    marginRight: screenWidth * 0.02,
    paddingTop: screenWidth * 0.02,
  },
  card: {
    backgroundColor: colors.white,
    overflow: 'hidden',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  cardBody: {
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  cardPdfContainer: {
    width: '100%',
    height: screenWidth * 1.15,
    backgroundColor: colors.lightGray,
    overflow: 'hidden',
    marginBottom: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardPdf: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.white,
  },
  loadingText: {
    fontSize: screenWidth * 0.032,
    fontFamily: Fonts.Medium,
    color: colors.darkGray,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
  },
  paginationDot: {
    width: screenWidth * 0.04,
    height: screenWidth * 0.04,
    borderRadius: 100,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.gray,
    marginHorizontal: spacing.xs,
  },
  paginationDotActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl * 2,
    minHeight: 200,
  },
  emptyText: {
    fontSize: screenWidth * 0.04,
    fontFamily: Fonts.Medium,
    color: colors.darkGray,
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    gap: spacing.sm,
    width: '90%',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.sm,
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  downloadButton: {
    backgroundColor: colors.primary,
  },
  downloadButtonText: {
    fontSize: screenWidth * 0.035,
    fontFamily: Fonts.SemiBold,
    color: colors.white,
  },
  qrProceedLoginArrowIcon: {
    transform: [{ rotate: '180deg' }],
  },
});

export default ConferenceQRCode;
