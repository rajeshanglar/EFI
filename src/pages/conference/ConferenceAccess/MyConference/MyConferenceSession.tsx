import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ImageBackground,
  ActivityIndicator,
  Image,
} from 'react-native';
import Header from '../../../../components/Header';
import { CardRightArrowIcon, CalendarIconYellow,
  MapWIcon, TimeWIcon, WorkshopIcon,LiveIcon, NotesIcon, UserIcon } from '../../../../components/icons';
import globalStyles, { colors, spacing, borderRadius, Fonts } from '../../../../styles/globalStyles';
import { getSessionDetailsBySessionId } from '../../../../services/staticService';
import { useAuth } from '../../../../contexts/AuthContext';
import { stripHtml } from '../../../../utils/stripHtml';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface MyConferenceSessionProps {
  onBack: () => void;
  onNavigateToHome: () => void;
  sessionId: number | string; // Session ID to fetch details from API (required)
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

const MyConferenceSession: React.FC<MyConferenceSessionProps> = ({
  onBack,
  onNavigateToHome,
  sessionId,
  onLiveQA,
  onSessionNotes,
  onHandouts,
}) => {
  const { user } = useAuth();
  const [sessionData, setSessionData] = useState<ApiSessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Determine header title
  const headerTitle = "My Conference Session";

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
        source={require('../../../../assets/images/wave-img.png')}
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
              <Text style={globalStyles.metadataText}>{sessionData.hall?.hall_name || ''}</Text>
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
                    <Text style={globalStyles.speakerSessionDetailsFullName}>{speaker.full_name}</Text>
                    {speaker.qualification && (
                      <Text style={globalStyles.speakerSessionDetailsInfoMText}>{speaker.qualification}</Text>
                    )}
                    {speaker.specialization && (
                      <Text style={globalStyles.speakerSessionDetailsInfoMText}>{speaker.specialization}</Text>
                    )}

                    {speaker.bio && (
                      <Text style={globalStyles.speakerSessionDetailsInfoText}>{stripHtml(speaker.bio)}</Text>
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
          {sessionData.hall?.virtual_meeting_link && (
            <View style={globalStyles.overviewContainer}>
              <Text style={globalStyles.sectionLabel}>Virtual Meeting Link:</Text>
              <TouchableOpacity
                onPress={() => {
                  // Handle opening the virtual meeting link
                  console.log('Open virtual meeting:', sessionData.hall.virtual_meeting_link);
                }}
                activeOpacity={0.7}
              >
                <Text style={[globalStyles.overviewText, { color: colors.primary, textDecorationLine: 'underline' }]}>
                  {sessionData.hall.virtual_meeting_link}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* My Actions Section - Hide if speaker is logged in */}
          {!isSpeaker && (
          <View style={globalStyles.actionsSection}>
            <Text style={globalStyles.actionsSectionTitle}>My Actions</Text>
            
            {/* Live Q&A Button */}
            <TouchableOpacity
              style={globalStyles.actionButton}
              onPress={onLiveQA}
              activeOpacity={0.8}
            >
              <View style={globalStyles.actionButtonContent}>
               
                  <LiveIcon size={24} color={colors.black} />
                
                <Text style={globalStyles.actionButtonText}>Live Q&A</Text>
                <CardRightArrowIcon size={20} color={colors.black} />
              </View>
            </TouchableOpacity>

            {/* My Session Notes Button */}
            <TouchableOpacity
              style={globalStyles.actionButton}
              onPress={onSessionNotes}
              activeOpacity={0.8}
            >
              <View style={globalStyles.actionButtonContent}>               
                  <NotesIcon size={24} color={colors.black} />             
                <Text style={globalStyles.actionButtonText}>My Session Notes</Text>
                <CardRightArrowIcon size={20} color={colors.black} />
              </View>
            </TouchableOpacity>

            {/* Handouts Button */}
            {/* <TouchableOpacity
              style={globalStyles.actionButton}
              onPress={onHandouts}
              activeOpacity={0.8}
            >
              <View style={globalStyles.actionButtonContent}>              
                  <HandoutsIcon size={24} color={colors.black} />              
                <Text style={globalStyles.actionButtonText}>Handouts</Text>
                <CardRightArrowIcon size={20} color={colors.black} />
              </View>
            </TouchableOpacity> */}
          </View>
          )}
        </View>
        </>
        )}
      </ScrollView>
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
    paddingBottom: 100,
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
});

export default MyConferenceSession;
