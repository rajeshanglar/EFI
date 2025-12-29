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
  Linking,
  Alert,
  Modal,
} from 'react-native';
import Header from '../../components/Header';
import { SuccessIcon, ArrowRightIcon, CalendarIconYellow,
  MapWIcon, TimeWIcon, WorkshopIcon, InformationIcon, DownloadIcon, CardRightArrowIcon, UserIcon, CloseIcon } from '../../components/icons';
import globalStyles, { colors, spacing, borderRadius, Fonts } from '../../styles/globalStyles';
import { getSessionWishlist, removeSessionWishlist } from '../../services/commonService';
import { getSessionDetailsBySessionId } from '../../services/staticService';
import { ToastService } from '../../utils/service-handlers';
import { useAuth } from '../../contexts/AuthContext';
import { stripHtml } from '../../utils/stripHtml';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface ConferenceSessionDetailsProps {
  onBack: () => void;
  onNavigateToHome: () => void;
  sessionId: number | string; // Session ID to fetch details from API (required)
  onAddToMyConference?: (sessionId: string) => void;
  onRemoveFromMyConference?: (sessionId: string) => void;
  isInMyConference?: boolean;
  isFromMyConference?: boolean;
  onLiveQA?: () => void;
  onSessionNotes?: () => void;
  onHandouts?: () => void;
}

// API Response Data Structure
interface ApiSessionData {
  session_id: number;
  session_title: string;
  description: string;
  event_id: number;
  event_name: string;
  module_id: number;
  module_name: string;
  session_date: string;
  formatted_date: string;
  start_time: string;
  end_time: string;
  time_range: string;
  session_type: string;
  session_pdf_url: string | null;
  session_pdf_image: string | null;
  hall: {
    hall_id: number;
    hall_name: string;
    capacity: number;
    virtual_meeting_link: string;
  };
  speakers: Array<{
    speaker_id: number;
    first_name: string;
    last_name: string;
    full_name: string;
    email: string;
    phone: string;
    bio: string | null;
    qualification: string | null;
    specialization: string | null;
    profile_image: string | null;
  }>;
  topics: Array<{
    topic_id: number;
    topic_title: string;
  }>;
  workshop: {
    id: number;
    name: string;
    description: string;
    status: number;
    is_morning_workshop: number;
    is_afternoon_workshop: number;
    workshop_image: string | null;
    workshop_pdf: string | null;
    created_by: number;
    updated_by: number | null;
    created_on: string;
    updated_on: string | null;
    workshop_pdf_url: string | null;
    workshop_image_url: string | null;
  } | null;
}

const ConferenceSessionDetails: React.FC<ConferenceSessionDetailsProps> = ({
  onBack,
  onNavigateToHome,
  sessionId,
  onAddToMyConference,
  onRemoveFromMyConference,
  isInMyConference = false,
  isFromMyConference = false,
  onLiveQA,
  onSessionNotes,
  onHandouts,
}) => {
  const { user } = useAuth();
  const [isAdded, setIsAdded] = useState(isInMyConference);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionData, setSessionData] = useState<ApiSessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSpeakerBio, setSelectedSpeakerBio] = useState<{ name: string; bio: string } | null>(null);

  // Check if user is a speaker
  const isSpeaker = user?.linked_registrations?.speaker && 
    Array.isArray(user.linked_registrations.speaker) && 
    user.linked_registrations.speaker.length > 0;

  // Fetch session details from API
  useEffect(() => {
    const fetchSessionDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching session details for sessionId:', sessionId);
        const response = await getSessionDetailsBySessionId(sessionId);
        console.log('Session Details API Response:', JSON.stringify(response, null, 2));
        
        if (response?.success && response?.data) {
          console.log('Session Details Data:', JSON.stringify(response.data, null, 2));
          setSessionData(response.data);
        } else {
          console.error('API response indicates failure:', response);
          setError(response?.message || 'Failed to load session details');
        }
      } catch (err: any) {
        console.error('Error fetching session details:', err);
        console.error('Error details:', {
          message: err?.message,
          response: err?.response?.data,
          status: err?.response?.status,
          statusText: err?.response?.statusText,
        });
        setError(err?.response?.data?.message || err?.message || 'Failed to load session details');
      } finally {
        setLoading(false);
      }
    };

    fetchSessionDetails();
  }, [sessionId]);

  // Update isAdded when isInMyConference changes
  useEffect(() => {
    setIsAdded(isInMyConference);
  }, [isInMyConference]);

  // Determine header title
  const headerTitle = isFromMyConference ? "My Conference Session" : "Conference Session Details";

  const handleAddToConference = async () => {
    try {
      setIsLoading(true);
      const id = typeof sessionId === 'number' ? sessionId : Number(sessionId);
      
      const response = await getSessionWishlist(sessionId);
      
      if (response?.success) {
        setIsAdded(true);
        if (onAddToMyConference) {
          onAddToMyConference(String(sessionId));
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
    try {
      setIsLoading(true);
      const id = typeof sessionId === 'number' ? sessionId : Number(sessionId);
      
      const response = await removeSessionWishlist(sessionId);
      
      if (response?.success) {
        setIsAdded(false);
        if (onRemoveFromMyConference) {
          onRemoveFromMyConference(String(sessionId));
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

  const handleMoreDetails = async () => {
    if (sessionData?.session_pdf_url) {
      try {
        const canOpen = await Linking.canOpenURL(sessionData.session_pdf_url);
        if (canOpen) {
          await Linking.openURL(sessionData.session_pdf_url);
        } else {
          Alert.alert('Error', 'Unable to open PDF. Please check the URL.');
        }
      } catch (error) {
        console.error('Error opening PDF:', error);
        Alert.alert('Error', 'Failed to open PDF. Please try again.');
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header
        title={headerTitle}
        onBack={onBack}
        onNavigateToHome={onNavigateToHome}
        onMenuItemPress={(id: any) => console.log('Menu:', id)}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading sessions...</Text>
          </View>
        ) : error || !sessionData ? (
          <View style={styles.emptyContainer}>
            {error && <Text style={styles.emptyText}>{error}</Text>}
          </View>
        ) : (
        <>
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
            <Text style={globalStyles.dateText}>{sessionData.formatted_date}</Text>
          </View>

          {/* Location, Time, and Workshop */}
          <View style={[globalStyles.metadataInfoRow, { gap:spacing.md}]}>
            <View style={globalStyles.metadataInfoItem}>
              <MapWIcon size={20} color={colors.primaryLight} />
              <Text style={globalStyles.metadataText}>{sessionData.hall?.hall_name}</Text>
            </View>
            <View style={globalStyles.metadataInfoItem}>
              <TimeWIcon size={20} color={colors.primaryLight} />
              <Text style={globalStyles.metadataText}>{sessionData.time_range}</Text>
            </View>
            {sessionData.workshop?.name && (
              <View style={globalStyles.metadataInfoItem}>
                <WorkshopIcon size={20} color={colors.primaryLight} />
                <Text style={globalStyles.metadataText}>Workshop</Text>
              </View>
            )} 
          </View>
        </View>
        </ImageBackground>

{/* Speaker Section */}
<View style={globalStyles.detailSpeakerContainer}>
    {/* Speakers Section */}
    {sessionData.speakers && sessionData.speakers.length > 0 && (
            <View style={globalStyles.overviewContainer}>  
            
              {sessionData.speakers.map((speaker, index) => (
                <View key={speaker.speaker_id || index} style={globalStyles.speakerSessionDetailsCard}>
                  {/* Profile Image */}
                  <View style={globalStyles.speakerSessionDetailsImageContainer}>
                    {speaker.profile_image ? (
                      <Image
                        source={{ uri: speaker.profile_image }}
                        style={globalStyles.speakersessionDetailsImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={globalStyles.speakerSessionDetailsImagePlaceholder}>
                        <UserIcon size={35} color={colors.primary} />
                      </View>
                    )}
                  </View>
                  
                  {/* Name and Qualifications */}
                  <View style={globalStyles.speakerInfoSessionDetails}>
                  <Text style={styles.speakerLabel}>Speaker</Text>
                    <Text style={globalStyles.speakerSessionDetailsFullName}>{speaker.full_name}</Text>
                    {speaker.qualification && (
                      <Text style={globalStyles.speakerSessionDetailsInfoMText}>{speaker.qualification}</Text>
                    )}
                    {speaker.specialization && (
                      <Text style={globalStyles.speakerSessionDetailsInfoMText}>{speaker.specialization}</Text>
                    )}

                    {speaker.bio && (
                      <View>
                        <Text 
                          style={globalStyles.speakerSessionDetailsInfoText}
                          numberOfLines={3}
                          ellipsizeMode="tail"
                        >
                          {stripHtml(speaker.bio)}
                        </Text>
                        <TouchableOpacity
                          onPress={() => {
                            console.log('Opening bio modal for:', speaker.full_name);
                            console.log('Bio content:', speaker.bio);
                            setSelectedSpeakerBio({ name: speaker.full_name, bio: speaker.bio || '' });
                          }}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.readMoreText}>Read more...</Text>
                        </TouchableOpacity>
                      </View>
                    )}


                  </View>
                </View>
              ))}
            </View>
          )}

</View>


        {/* Session Content */}
        <View style={globalStyles.contentContainer}>
          {/* Title */}
          <Text style={globalStyles.sessionTitle}>{sessionData.session_title}</Text>
          <Text style={globalStyles.sessionSubtitle}>{sessionData.module_name}</Text>
        

          {/* Workshop Theme */}
          <View style={globalStyles.themeContainer}>
            <Text style={globalStyles.sectionLabel}>Workshop Theme</Text>
            <Text style={globalStyles.themeText}>
              {sessionData.workshop?.name || sessionData.session_type}
            </Text>
          </View>

          {/* Brief Overview */}
          <View style={globalStyles.overviewContainer}>
            <Text style={globalStyles.sectionLabel}>Brief Overview:</Text>
            <Text style={globalStyles.overviewText}>
              {sessionData.workshop?.description || sessionData.description}
            </Text>
          </View>

      

          {/* Topics Section */}
          {sessionData.topics && sessionData.topics.length > 0 && (
            <View style={globalStyles.overviewContainer}>
              <Text style={globalStyles.sectionLabel}>Topics:</Text>
              {sessionData.topics.map((topic, index) => (
                <View key={topic.topic_id || index} style={{ marginBottom: spacing.sm }}>
                  <Text style={[globalStyles.overviewText, { fontFamily: Fonts.Regular }]}>
                    • {topic.topic_title}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Virtual Meeting Link */}
          {/* {sessionData.hall?.virtual_meeting_link && (
            <View style={globalStyles.overviewContainer}>
              <Text style={globalStyles.sectionLabel}>Virtual Meeting Link:</Text>
              <TouchableOpacity
                onPress={() => {                
                  console.log('Open virtual meeting:', sessionData.hall.virtual_meeting_link);
                }}
                activeOpacity={0.7}
              >
                <Text style={[globalStyles.overviewText, { color: colors.primary, textDecorationLine: 'underline' }]}>
                  {sessionData.hall.virtual_meeting_link}
                </Text>
              </TouchableOpacity>
            </View>
          )} */}

          {/* Session PDF */}
          {sessionData.session_pdf_url && (
            <TouchableOpacity
              style={globalStyles.imageContainer}
              onPress={handleMoreDetails}
              activeOpacity={0.7}
            >
              <Image 
              //  source={{ uri: sessionData.session_pdf_image || require('../../assets/images/default-pdf-screen.jpg') }} 
                source={require('../../assets/images/default-pdf-screen.jpg')} 
                style={globalStyles.previewImage}
              />
              <Text style={globalStyles.moreDetailsText}>Click this for more details</Text>
            </TouchableOpacity>
          )} 


          

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
        </>
        )}
      </ScrollView>

      {/* Bottom Action Bar - Hide if speaker is logged in */}
      {!loading && sessionData && !isSpeaker && (
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
      )}

      {/* Speaker Bio Modal */}
      <Modal
        visible={selectedSpeakerBio !== null}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSelectedSpeakerBio(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedSpeakerBio?.name || 'Speaker Bio'}</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setSelectedSpeakerBio(null)}
                activeOpacity={0.7}
              >
                <CloseIcon size={15} color={colors.white} />
              </TouchableOpacity>


         
            </View>

            {/* Body */}
            <ScrollView
              style={styles.modalBody}
              contentContainerStyle={styles.modalBodyContent}
              showsVerticalScrollIndicator={true}
            >
              {selectedSpeakerBio?.bio && stripHtml(selectedSpeakerBio.bio) ? (
                <Text style={styles.modalBioText}>
                  {stripHtml(selectedSpeakerBio.bio)}
                </Text>
              ) : (
                <Text style={styles.modalBioText}>No biography available.</Text>
              )}
            </ScrollView>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl * 2,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: screenWidth * 0.04,
    fontFamily: Fonts.Regular,
    color: colors.darkGray,
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
  readMoreText: {
    fontSize: screenWidth * 0.035,
    fontFamily: Fonts.Medium,
    color: colors.primary,
    marginTop: spacing.xs,
    textDecorationLine: 'underline',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContainer: {
    width:'100%',
    maxHeight: screenHeight * 0.8,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  modalHeader: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: screenWidth * 0.042,
    fontFamily: Fonts.Bold,
    color: colors.white,
    flex: 1,
    marginRight: spacing.md,
  },
  modalCloseButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xs,
  },
  modalBody: {
    maxHeight: screenHeight * 0.8,
    backgroundColor: colors.white,
    minHeight: 200,
  },
  modalBodyContent: {
    padding: spacing.md,
    flexGrow: 1,
  },
  modalBioText: {
    fontSize: screenWidth * 0.038,
    fontFamily: Fonts.Regular,
    color: colors.black,
    lineHeight: screenWidth * 0.055,
  },
  speakerLabel:{
    fontSize: screenWidth * 0.038,
    fontFamily: Fonts.Regular,
    color: colors.black,  
  }
});

export default ConferenceSessionDetails;

