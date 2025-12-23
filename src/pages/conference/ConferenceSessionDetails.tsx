import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ImageBackground,
  Image,
  ActivityIndicator,
} from 'react-native';
import Header from '../../components/Header';
import { SuccessIcon, ArrowRightIcon, CalendarIconYellow,
  MapWIcon, TimeWIcon, WorkshopIcon, InformationIcon, DownloadIcon, CardRightArrowIcon } from '../../components/icons';
import globalStyles, { colors, spacing, borderRadius, Fonts } from '../../styles/globalStyles';
import { getSessionWishlist, removeSessionWishlist } from '../../services/commonService';
import { ToastService } from '../../utils/service-handlers';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface ConferenceSessionDetailsProps {
  onBack: () => void;
  onNavigateToHome: () => void;
  sessionData?: SessionData;
  onAddToMyConference?: (sessionId: string) => void;
  onRemoveFromMyConference?: (sessionId: string) => void;
  isInMyConference?: boolean;
  isFromMyConference?: boolean; // New prop to indicate if accessed from MyConference
  onLiveQA?: () => void;
  onSessionNotes?: () => void;
  onHandouts?: () => void;
}

interface SessionData {
  id: string;
  date: string;
  time: string;
  location: string;
  workshopNumber?: string;
  title: string;
  subtitle: string;
  theme: string;
  overview: string;
  imageUrl?: string;
}

const ConferenceSessionDetails: React.FC<ConferenceSessionDetailsProps> = ({
  onBack,
  onNavigateToHome,
  sessionData,
  onAddToMyConference,
  onRemoveFromMyConference,
  isInMyConference = false,
  isFromMyConference = false,
  onLiveQA,
  onSessionNotes,
  onHandouts,
}) => {
  const [isAdded, setIsAdded] = useState(isInMyConference);
  const [isLoading, setIsLoading] = useState(false);

  // If no session data is provided, show empty state
  if (!sessionData) {
    return (
      <View style={styles.container}>
        <Header
          title={isFromMyConference ? "My Conference Session" : "Session Details"}
          onBack={onBack}
          onNavigateToHome={onNavigateToHome}
          onMenuItemPress={(id: any) => console.log('Menu:', id)}
        />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No session data available</Text>
        </View>
      </View>
    );
  }

  const session = sessionData;

  useEffect(() => {
    setIsAdded(isInMyConference);
  }, [isInMyConference]);

  const handleAddToConference = async () => {
    if (!session.id) return;
    
    try {
      setIsLoading(true);
      const sessionId = parseInt(session.id, 10);
      
      const response = await getSessionWishlist(sessionId);
      
      if (response?.success) {
        setIsAdded(true);
        if (onAddToMyConference) {
          onAddToMyConference(session.id);
        }
        ToastService.success('Success', response?.message || 'Session added to wishlist successfully');
      } else {
        ToastService.error('Error', response?.message || 'Failed to add session to wishlist');
      }
    } catch (error: any) {
      console.error('Error adding session to wishlist:', error);
      ToastService.error(
        'Error',
        error?.response?.data?.message || error?.message || 'Failed to add session to wishlist'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromConference = async () => {
    if (!session.id) return;
    
    try {
      setIsLoading(true);
      const sessionId = parseInt(session.id, 10);
      
      const response = await removeSessionWishlist(sessionId);
      
      if (response?.success) {
        setIsAdded(false);
        if (onRemoveFromMyConference) {
          onRemoveFromMyConference(session.id);
        }
        ToastService.success('Success', response?.message || 'Session removed from wishlist successfully');
      } else {
        ToastService.error('Error', response?.message || 'Failed to remove session from wishlist');
      }
    } catch (error: any) {
      console.error('Error removing session from wishlist:', error);
      ToastService.error(
        'Error',
        error?.response?.data?.message || error?.message || 'Failed to remove session from wishlist'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleMoreDetails = () => {
    // Handle click on embedded image for more details
    console.log('View more details');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header
        title={isFromMyConference ? "My Conference Session" : "Session Details"}
        onBack={onBack}
        onNavigateToHome={onNavigateToHome}
        onMenuItemPress={(id: any) => console.log('Menu:', id)}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Session Metadata Card */}
        <ImageBackground
        source={require('../../assets/images/wave-img.png')}
        style={globalStyles.imgBgContainerWave}
        imageStyle={globalStyles.imgBgWave}
      >
          <View style={globalStyles.metadataCard}>
          {/* Date */}
          <View style={globalStyles.metadataRow}>
            <View style={globalStyles.iconContainer}>
            <CalendarIconYellow size={20} color={colors.primaryLight} />
            </View>
            <Text style={globalStyles.dateText}>{session.date}</Text>
          </View>

          {/* Location, Time, and Workshop */}
          <View style={globalStyles.metadataInfoRow}>
            <View style={globalStyles.metadataInfoItem}>
              <MapWIcon size={20} color={colors.primaryLight} />
              <Text style={globalStyles.metadataText}>{session.location}</Text>
            </View>
            <View style={globalStyles.metadataInfoItem}>
              <TimeWIcon size={20} color={colors.primaryLight} />
              <Text style={globalStyles.metadataText}>{session.time}</Text>
            </View>
            {session.workshopNumber && (
              <View style={globalStyles.metadataInfoItem}>
                <WorkshopIcon size={20} color={colors.primaryLight} />
                <Text style={globalStyles.metadataText}>{session.workshopNumber}</Text>
              </View>
            )}
          </View>
        </View>
        </ImageBackground>

        {/* Session Content */}
        <View style={globalStyles.contentContainer}>
          {/* Title */}
          <Text style={globalStyles.sessionTitle}>{session.title}</Text>
          <Text style={globalStyles.sessionSubtitle}>{session.subtitle}</Text>
        

          {/* Workshop Theme */}
          <View style={globalStyles.themeContainer}>
            <Text style={globalStyles.sectionLabel}>Workshop Theme</Text>
            <Text style={globalStyles.themeText}>{session.theme}</Text>
          </View>

          {/* Brief Overview */}
          <View style={globalStyles.overviewContainer}>
            <Text style={globalStyles.sectionLabel}>Brief Overview:</Text>
            <Text style={globalStyles.overviewText}>{session.overview}</Text>
          </View>

          {/* Embedded Preview Image */}
          {/* <TouchableOpacity
            style={globalStyles.imageContainer}
            onPress={handleMoreDetails}
            activeOpacity={0.7}
          >
            <Image source={require('../../assets/images/pdfscreen.jpg')} style={globalStyles.previewImage} />
         
            <Text style={globalStyles.moreDetailsText}>Click this for more details</Text>
          </TouchableOpacity> */}

          {/* My Actions Section - Only show when accessed from MyConference */}
          {isFromMyConference && (
            <View style={globalStyles.actionsSection}>
              <Text style={globalStyles.actionsSectionTitle}>My Actions</Text>
              
              {/* Live Q&A Button */}
              <TouchableOpacity
                style={globalStyles.actionButton}
                onPress={onLiveQA || (() => console.log('Live Q&A'))}
                activeOpacity={0.8}
              >
                <View style={globalStyles.actionButtonContent}>
                  <View style={globalStyles.actionIconContainer}>
                    <InformationIcon size={24} />
                  </View>
                  <Text style={globalStyles.actionButtonText}>Live Q&A</Text>
                  <CardRightArrowIcon size={20} color={colors.black} />
                </View>
              </TouchableOpacity>

              {/* My Session Notes Button */}
              <TouchableOpacity
                style={globalStyles.actionButton}
                onPress={onSessionNotes || (() => console.log('Session Notes'))}
                activeOpacity={0.8}
              >
                <View style={globalStyles.actionButtonContent}>
                  <View style={globalStyles.actionIconContainer}>
                    <DownloadIcon size={24} color={colors.black} />
                  </View>
                  <Text style={globalStyles.actionButtonText}>My Session Notes</Text>
                  <CardRightArrowIcon size={20} color={colors.black} />
                </View>
              </TouchableOpacity>

              {/* Handouts Button */}
              <TouchableOpacity
                style={globalStyles.actionButton}
                onPress={onHandouts || (() => console.log('Handouts'))}
                activeOpacity={0.8}
              >
                <View style={globalStyles.actionButtonContent}>
                  <View style={globalStyles.actionIconContainer}>
                    <DownloadIcon size={24} color={colors.black} />
                  </View>
                  <Text style={globalStyles.actionButtonText}>Handouts</Text>
                  <CardRightArrowIcon size={20} color={colors.black} />
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={globalStyles.bottomActionBar}>
        {isFromMyConference ? (
          // When from MyConference, show Remove button
          <TouchableOpacity
            style={globalStyles.removeButton}
            onPress={handleRemoveFromConference}
          >
            <Text style={globalStyles.removeButtonText}>Remove from My Conference</Text>
          </TouchableOpacity>
        ) : (
          // When from ConferenceList, show Add/Remove toggle
          <>
            <View style={globalStyles.statusContainer}>
              {!isAdded ? (
                <TouchableOpacity
                  style={[globalStyles.addButtonContainer, { flexDirection: 'row', alignItems: 'center', gap: spacing.sm }]}
                  onPress={handleAddToConference}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color={colors.white} />
                  ) : (
                    <>
                      <Text style={globalStyles.addButtonText}>Add to my Conference</Text>
                      <View style={[
                        globalStyles.checkmarkIcon,
                        { backgroundColor: colors.white }
                      ]}>
                      </View>
                    </>
                  )}
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[globalStyles.addButtonContainer, { flexDirection: 'row', alignItems: 'center', gap: spacing.sm }]}
                  onPress={handleRemoveFromConference}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color={colors.white} />
                  ) : (
                    <>
                      <Text style={globalStyles.removeButtonText}>Remove from My Conference</Text>
                      <View style={[
                        globalStyles.checkmarkIcon,
                        { backgroundColor: colors.white }
                      ]}>
                        <SuccessIcon size={20} color="#4CAF50" />
                      </View>
                    </>
                  )}
                </TouchableOpacity>
              )}
            </View>
          </>
        )}
      </View>
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


  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl * 2,
    paddingHorizontal: spacing.lg,
  },
  emptyText: {
    fontSize: screenWidth * 0.04,
    fontFamily: Fonts.Regular,
    color: colors.darkGray,
    textAlign: 'center',
  },
});

export default ConferenceSessionDetails;

