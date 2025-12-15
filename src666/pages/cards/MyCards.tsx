import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Platform,
  Alert,
  Linking,
} from 'react-native';
import { PERMISSIONS, request, check, RESULTS } from 'react-native-permissions';
import Pdf from 'react-native-pdf';
import ReactNativeBlobUtil from 'react-native-blob-util';
import Header from '../../components/Header';
import globalStyles, { colors, spacing, borderRadius, Fonts } from '../../styles/globalStyles';
import { DownloadConferenceQRCode } from '../../services/staticService';
import { useAuth } from '../../contexts/AuthContext';
import { ToastService } from '../../utils/service-handlers';
import { CloseIcon, DownloadWhiteIcon } from '../../components/icons';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface MyCardsProps {
  onBack: () => void;
  onNavigateToHome: () => void;
}

interface CardData {
  id: string;
  registration_id: number;
  serial_number: string;
  pdf_base64: string;
  filename: string;
}

const MyCards: React.FC<MyCardsProps> = ({
  onBack,
  onNavigateToHome,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsData, setCardsData] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const flatListRef = useRef<FlatList>(null);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      setError('Please login to view your cards');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get conference registrations from user context
      const conferenceRegistrations = user?.linked_registrations?.conference || [];
      
      if (!Array.isArray(conferenceRegistrations) || conferenceRegistrations.length === 0) {
        setError('No conference registrations found');
        setCardsData([]);
        setLoading(false);
        return;
      }

      // Fetch QR code for each conference registration
      const cardPromises = conferenceRegistrations.map(async (registration: any) => {
        try {
          const registrationId = registration.id || registration.registration_id;
          const result = await DownloadConferenceQRCode({ registration_id: registrationId });
          
          if (result?.success === true && result?.data?.pdf_base64) {
            return {
              id: String(registrationId),
              registration_id: result.data.registration_id || registrationId,
              serial_number: result.data.serial_number || registration.serial_number || '',
              filename: result.data.filename || '',
              pdf_base64: result.data.pdf_base64,
            };
          }
          return null;
        } catch (err) {
          console.error('Error fetching QR code for registration:', registration.id, err);
          return null;
        }
      });

      const fetchedCards = await Promise.all(cardPromises);
      const validCards = fetchedCards.filter(
        (card): card is CardData => card !== null && card.pdf_base64 && card.filename
      );

      if (validCards.length === 0) {
        setError('No QR codes found for your registrations');
        setCardsData([]);
      } else {
        setCardsData(validCards);
      }
    } catch (err: any) {
      console.error('Error fetching cards:', err);
      setError(err?.message || 'Failed to load cards. Please try again.');
      setCardsData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const cardWidth = screenWidth - spacing.md * 2 - spacing.lg * 2;
    setCurrentIndex(Math.round(contentOffsetX / cardWidth));
  };

  const handleViewCard = (card: CardData) => {
    setSelectedCard(card);
    setViewerVisible(true);
  };

  const handleCloseViewer = () => {
    setViewerVisible(false);
    setSelectedCard(null);
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

      // Clean base64 data
      let base64Data = pdf_base64;
      if (base64Data.includes(',')) {
        base64Data = base64Data.split(',')[1];
      }
      base64Data = base64Data.trim();

      // Request storage permission for Android 9 and below
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

      // Determine file path
      const getFilePath = async (): Promise<string> => {
        if (Platform.OS === 'ios') {
          return `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/${filename}`;
        }

        // Android
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

      // Write file
      await ReactNativeBlobUtil.fs.writeFile(filePath, base64Data, 'base64');

      ToastService.success('Success', 'QR code downloaded successfully!');

      // Show Android notification
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

  const renderCard = ({ item }: { item: CardData }) => (
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

  const renderPaginationDots = () => (
    <View style={styles.paginationContainer}>
      {cardsData.map((_, index) => (
        <View
          key={index}
          style={[
            styles.paginationDot,
            index === currentIndex && styles.paginationDotActive,
          ]}
        />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <Header
        title="My Cards"
        onBack={onBack}
        onNavigateToHome={onNavigateToHome}
        onMenuItemPress={() => {}}
      />
      <View style={styles.contentContainer}>
        <ImageBackground
          source={require('../../assets/images/ribbon-color-img.png')}
          style={globalStyles.bgBottomRibbon}
          imageStyle={globalStyles.bgBottomRibbonImage}
        />
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
        ) : cardsData.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No cards found</Text>
          </View>
        ) : (
          <>
            <FlatList
              ref={flatListRef}
              data={cardsData}
              renderItem={renderCard}
              keyExtractor={(item) => item.id}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              contentContainerStyle={styles.flatListContent}
              snapToInterval={screenWidth - spacing.md * 2 - spacing.lg * 2}
              decelerationRate="fast"
            />
            {renderPaginationDots()}
          </>
        )}
      </View>


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  contentContainer: {
    flex: 1,
    position: 'relative',
  },

  flatListContent: {
    paddingHorizontal: screenWidth * 0.04,
    paddingVertical: screenWidth * 0.08,
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
  viewButton: {
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  viewButtonText: {
    fontSize: screenWidth * 0.035,
    fontFamily: Fonts.SemiBold,
    color: colors.primary,
  },
  downloadButton: {
    backgroundColor: colors.primary,
  },
  downloadButtonText: {
    fontSize: screenWidth * 0.035,
    fontFamily: Fonts.SemiBold,
    color: colors.white,
  },
  viewerContainer: {
    flex: 1,
    backgroundColor: colors.black,
  },
  viewerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    paddingTop: Platform.OS === 'android' ? spacing.xl : spacing.md,
    backgroundColor: colors.black,
    borderBottomWidth: 1,
    borderBottomColor: colors.darkGray,
  },
  viewerTitle: {
    flex: 1,
    fontSize: screenWidth * 0.04,
    fontFamily: Fonts.SemiBold,
    color: colors.white,
    marginRight: spacing.md,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.darkGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pdf: {
    flex: 1,
    width: screenWidth,
    height: screenHeight,
  },
  viewerFooter: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.black,
    borderTopWidth: 1,
    borderTopColor: colors.darkGray,
    justifyContent: 'center',
  },
  viewerActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
  },
  viewerDownloadButton: {
    backgroundColor: colors.primary,
  },
  viewerActionButtonText: {
    fontSize: screenWidth * 0.038,
    fontFamily: Fonts.SemiBold,
    color: colors.white,
  },
});

export default MyCards;
