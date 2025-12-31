import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ImageBackground,
  Dimensions,
  ActivityIndicator,
  Switch,
} from 'react-native';
import Header from '../../../../components/Header';
import {
  CalendarIconYellow,
  MapWIcon,
  TimeWIcon,
  WorkshopIcon,
  CardRightArrowIcon,
  MyQuestionsIcon,
} from '../../../../components/icons';
import globalStyles, {
  colors,
  spacing,
  borderRadius,
  Fonts,
} from '../../../../styles/globalStyles';
import GradientButton from '../../../../components/GradientButton';
import { askSessionQuestion } from '../../../../services/conferenceService';
import { getSessionDetailsBySessionId } from '../../../../services/staticService';
import { ToastService } from '../../../../utils/service-handlers';

interface SessionData {
  id: string;
  date: string;
  time: string;
  location: string;
  workshopNumber?: string;
  title: string;
  subtitle?: string;
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
  session_type: number;
  session_pdf_url: string | null;
  session_pdf_image?: string | null;
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
    workshop_image_url: string | null;
  } | null;
}

interface LiveQAProps {
  onBack: () => void;
  onNavigateToHome: () => void;
  sessionData?: SessionData;
  sessionId?: number | string;
  onSubmitQuestion?: (question: string) => void;
  onMyQuestionsPress?: () => void;
  onRecentQuestionsPress?: () => void;
}

const LiveQA: React.FC<LiveQAProps> = ({
  onBack,
  onNavigateToHome,
  sessionData,
  sessionId,
  onSubmitQuestion,
  onMyQuestionsPress,
  onRecentQuestionsPress,
}) => {
  const [question, setQuestion] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [apiSessionData, setApiSessionData] = useState<ApiSessionData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch session details from API - sessionId is required
  useEffect(() => {
    const fetchSessionDetails = async () => {
      const idToFetch = sessionId || sessionData?.id;
      if (!idToFetch) {
        setError('Session ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log('Fetching session details for sessionId:', idToFetch);
        const response = await getSessionDetailsBySessionId(idToFetch);
        console.log('Session Details API Response:', JSON.stringify(response, null, 2));
        
        if (response?.success && response?.data) {
          console.log('Session Details Data:', JSON.stringify(response.data, null, 2));
          setApiSessionData(response.data);
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
        ToastService.error('Error', err?.response?.data?.message || err?.message || 'Failed to load session details');
      } finally {
        setLoading(false);
      }
    };

    fetchSessionDetails();
  }, [sessionId, sessionData?.id]);

  // Only use API session data - no fallback to static data
  const session = apiSessionData ? {
    id: String(apiSessionData.session_id),
    date: apiSessionData.formatted_date || apiSessionData.session_date,
    time: apiSessionData.time_range || `${apiSessionData.start_time} - ${apiSessionData.end_time}`,
    location: apiSessionData.hall?.hall_name || 'TBD',
    workshopNumber: apiSessionData.workshop?.name,
    title: apiSessionData.session_title,
    subtitle: apiSessionData.description ? apiSessionData.description.substring(0, 50) + '...' : undefined,
  } : null;

  // Only create metadata items if session data is available
  const metadataItems = session ? [
    {
      icon: <MapWIcon size={20} color={colors.primaryLight} />,
      label: session.location,
    },
    {
      icon: <TimeWIcon size={20} color={colors.primaryLight} />,
      label: session.time,
    },
  ] : [];

  const handleSubmit = async () => {
    const trimmed = question.trim();
    if (!trimmed) {
      ToastService.error('Error', 'Please enter a question');
      return;
    }

    const idToUse = apiSessionData?.session_id || sessionId;
    if (!idToUse) {
      ToastService.error('Error', 'Session ID is required');
      return;
    }

    try {
      setSubmitting(true);
      console.log('Submitting question:', {
        session_id: idToUse,
        question: trimmed,
        is_anonymous: isAnonymous ? 1 : 0,
      });

      const response = await askSessionQuestion(
        Number(idToUse),
        trimmed,
        isAnonymous ? 1 : 0
      );

      console.log('Ask Question API Response:', JSON.stringify(response, null, 2));

      if (response?.success) {
        ToastService.success(
          'Success',
          response?.message || 'Question submitted successfully. It will be reviewed by a moderator.'
        );
        setQuestion('');
        setIsAnonymous(false);
        onSubmitQuestion?.(trimmed);
      } else {
        ToastService.error('Error', response?.message || 'Failed to submit question');
      }
    } catch (err: any) {
      console.error('Error submitting question:', err);
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to submit question';
      ToastService.error('Error', errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Live Q&A"
       onBack={onBack}
        onNavigateToHome={onNavigateToHome}
         onMenuItemPress={(id: any) => console.log('Menu:', id)} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading session details...</Text>
          </View>
        ) : error || !apiSessionData || !session ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error || 'Failed to load session details'}</Text>
          </View>
        ) : (
          <>
            <ImageBackground
              source={require('../../../../assets/images/wave-img.png')}
              style={globalStyles.imgBgContainerWave}
              imageStyle={globalStyles.imgBgWave}
            >
              <View style={globalStyles.metadataCard}>
                <View style={globalStyles.metadataRow}>
                  <View style={globalStyles.iconContainer}>
                    <CalendarIconYellow size={20} color={colors.primaryLight} />
                  </View>
                  <Text style={globalStyles.dateText}>{session.date}</Text>
                </View>

                <View style={globalStyles.metadataInfoRow}>
                  {metadataItems.map(item => (
                    <View style={globalStyles.metadataInfoItem} key={item.label}>
                      {item.icon}
                      <Text style={globalStyles.metadataText}>{item.label}</Text>
                    </View>
                  ))}
                  
                </View>
              </View>
            </ImageBackground>

            <View style={styles.contentContainer}>
              <Text style={globalStyles.sessionTitle}>{session.title}</Text>
             

              <TextInput
                style={styles.questionInput}
                placeholder="Enter Question"
                placeholderTextColor={colors.darkGray}
                multiline
                value={question}
                onChangeText={setQuestion}
                editable={!submitting}
              />
{/* 
              <View style={styles.anonymousContainer}>
                <Text style={styles.anonymousLabel}>Submit as anonymous</Text>
                <Switch
                  value={isAnonymous}
                  onValueChange={setIsAnonymous}
                  trackColor={{ false: colors.lightGray, true: colors.primary }}
                  thumbColor={colors.white}
                  disabled={submitting}
                />
              </View> */}

              <View style={styles.submitButtonContainer}>
                <View style={styles.submitButtonContent}>
                  <GradientButton
                    title={submitting ? 'Submitting...' : 'Submit'}
                    textStyle={styles.submitButtonText}
                    onPress={handleSubmit}
                    disabled={submitting || !question.trim()}
                  />
                </View>
              </View>
              <View style={globalStyles.actionsSection}>
                <TouchableOpacity
                  style={globalStyles.actionButton}
                  activeOpacity={0.8}
                  onPress={onMyQuestionsPress}
                >
                  <View style={globalStyles.actionButtonContent}>
                    <View style={styles.actionIconWrapper}>
                      <MyQuestionsIcon size={24} color={colors.black} />
                    </View>
                    <Text style={globalStyles.actionButtonText}>My Questions</Text>
                    <CardRightArrowIcon size={18} color={colors.black} />
                  </View>
                </TouchableOpacity>

                {/* <TouchableOpacity
                  style={globalStyles.actionButton}
                  activeOpacity={0.8}
                  onPress={onRecentQuestionsPress}
                >
                  <View style={globalStyles.actionButtonContent}>
                    <View style={styles.actionIconWrapper}>
                      <CardRightArrowIcon size={18} color={colors.black} />
                    </View>
                    <Text style={globalStyles.actionButtonText}>Recent Questions</Text>
                    <CardRightArrowIcon size={18} color={colors.black} />
                  </View>
                </TouchableOpacity> */}
              </View>
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
  },
  contentContainer: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    gap: spacing.lg,
  },
  questionInput: {
    minHeight: 160,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.lightGray,
    padding: spacing.md,
    fontSize: spacing.md,
    fontFamily: Fonts.Regular,
    color: colors.black,
    textAlignVertical: 'top',
    backgroundColor: colors.lightGray,
  },
  submitButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  submitButtonContent: {
    width: Dimensions.get('window').width * 0.5,
  },
  submitButtonText: {
    fontSize: Dimensions.get('window').width * 0.04,
  },
  actionIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },

  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl * 2,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: spacing.md,
    fontFamily: Fonts.Regular,
    color: colors.darkGray,
  },
  errorContainer: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  errorText: {
    fontSize: spacing.md,
    fontFamily: Fonts.Regular,
    color: colors.red,
    textAlign: 'center',
  },
  anonymousContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    marginTop: spacing.sm,
  },
  anonymousLabel: {
    fontSize: spacing.md,
    fontFamily: Fonts.Regular,
    color: colors.black,
  },
});

export default LiveQA;
