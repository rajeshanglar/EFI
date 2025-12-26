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
} from 'react-native';
import Header from '../../../../components/Header';
import { CardRightArrowIcon, CloseIcon, YellowRibbonIcon } from '../../../../components/icons';
import globalStyles, { colors, spacing, borderRadius, Fonts } from '../../../../styles/globalStyles';
import { getSpeakerSessions, getSessionWorkshops } from '../../../../services/commonService';
import { useAuth } from '../../../../contexts/AuthContext';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface MyConferenceProps {
  onBack: () => void;
  onNavigateToHome: () => void;
  onEventPress?: (event: EventItem, fromMyConference?: boolean) => void;
  myConferenceSessions?: string[]; // Array of session IDs that are added to "My Conference"
  onRemoveSession?: (eventId: string) => void;
}

interface EventItem {
  id: string;
  hall?: string;
  title: string;
  description?: string;
  eventType: string;
  isClickable?: boolean;
}

interface TimeSlot {
  id: string;
  timeRange: string;
  events: EventItem[];
}

interface DaySchedule {
  date: string;
  dateLabel: string;
  sections: {
    title?: string;
    timeSlots: TimeSlot[];
  }[];
}

const MyConference: React.FC<MyConferenceProps> = ({
  onBack,
  onNavigateToHome,
  onEventPress,
  myConferenceSessions = [],
  onRemoveSession,
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allSessions, setAllSessions] = useState<Record<string, DaySchedule>>({});
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');

  // Check if user is a speaker
  const isSpeaker = user?.linked_registrations?.speaker && 
    Array.isArray(user.linked_registrations.speaker) && 
    user.linked_registrations.speaker.length > 0;

  // Check if user has conference registration
  const hasConference = user?.linked_registrations?.conference && 
    Array.isArray(user.linked_registrations.conference) && 
    user.linked_registrations.conference.length > 0;

  // Transform API response to match our data structure
  const transformResponseData = (responseData: any): { transformedData: Record<string, DaySchedule>, dates: string[] } => {
    const transformedData: Record<string, DaySchedule> = {};
    const dates: string[] = [];

    Object.keys(responseData).forEach((dateKey) => {
      const dayData = responseData[dateKey];
      if (!dayData || !dayData.sections || !Array.isArray(dayData.sections)) {
        console.warn(`Invalid data structure for date key: ${dateKey}`, dayData);
        return;
      }

      transformedData[dateKey] = {
        date: dayData.date || '',
        dateLabel: dayData.dateLabel || '',
        sections: dayData.sections.map((section: any) => ({
          title: section.title || '',
          timeSlots: (section.timeSlots || []).map((timeSlot: any) => ({
            id: timeSlot.id || '',
            timeRange: timeSlot.timeRange || '',
            events: (timeSlot.events || []).map((event: any) => ({
              id: event.id || '',
              title: event.title || '',
              hall: event.hall || undefined,
              eventType: event.eventType || '',
              isClickable: event.isClickable !== undefined ? event.isClickable : true,
            })),
          })),
        })),
      };
      dates.push(dateKey);
    });

    return { transformedData, dates };
  };

  // Fetch sessions data from API (speaker or conference user wishlist)
  useEffect(() => {
    const fetchSessions = async () => {
      // If not speaker, require conference registration
      if (!isSpeaker && !hasConference) {
        setError('Conference registration is required to view wishlist sessions');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        let response;
        if (isSpeaker) {
          console.log('Fetching speaker sessions');
          response = await getSpeakerSessions();
          console.log('Speaker Sessions API Response:', JSON.stringify(response, null, 2));
        } else if (hasConference) {
          console.log('Fetching conference user wishlist sessions');
          response = await getSessionWorkshops();
          console.log('User Wishlist API Response:', JSON.stringify(response, null, 2));
        }
        
        if (response?.success && response?.data) {
          // Check if data is empty or has no keys
          const dataKeys = Object.keys(response.data);
          if (dataKeys.length === 0) {
            setError(isSpeaker 
              ? 'No speaker sessions available for this event.' 
              : 'No sessions in your wishlist.');
            setLoading(false);
            return;
          }

          // Transform API response to match our data structure
          const { transformedData, dates } = transformResponseData(response.data);

          if (dates.length === 0) {
            setError(isSpeaker 
              ? 'No valid speaker session data found in the response.' 
              : 'No valid wishlist data found in the response.');
            setLoading(false);
            return;
          }

          setAllSessions(transformedData);
          setAvailableDates(dates);
          
          // Set first available date as selected
          if (dates.length > 0) {
            setSelectedDate(dates[0]);
          }
        } else {
          const errorMsg = response?.message || (isSpeaker 
            ? 'Failed to load speaker sessions data' 
            : 'Failed to load wishlist data');
          console.error('API response indicates failure:', response);
          setError(errorMsg);
        }
      } catch (err: any) {
        console.error(`Error fetching ${isSpeaker ? 'speaker sessions' : 'wishlist'}:`, err);
        console.error('Error details:', {
          message: err?.message,
          response: err?.response?.data,
          status: err?.response?.status,
          statusText: err?.response?.statusText,
        });
        
        // Extract more detailed error message
        let errorMessage = isSpeaker 
          ? 'Failed to load speaker sessions. Please try again.' 
          : 'Failed to load wishlist. Please try again.';
        if (err?.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err?.message) {
          errorMessage = err.message;
        } else if (err?.response?.status === 404) {
          errorMessage = isSpeaker 
            ? 'Event not found. Please check the event ID.' 
            : 'Wishlist not found.';
        } else if (err?.response?.status === 401) {
          errorMessage = 'Authentication failed. Please try again.';
        } else if (err?.response?.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [user, isSpeaker, hasConference]);

  // Helper function to extract date parts from dateLabel (e.g., "MAR 06 FRI" -> { month: "MAR", day: "06", dayName: "FRI" })
  const parseDateLabel = (dateLabel: string) => {
    const parts = dateLabel.split(' ');
    return {
      month: parts[0] || '',
      day: parts[1] || '',
      dayName: parts[2] || '',
    };
  };

  // Filter to show only sessions that are in "My Conference"
  // For UI purposes, if myConferenceSessions is empty, show all sessions
  const getFilteredSchedule = () => {
    if (!selectedDate || !allSessions[selectedDate]) {
      return { date: '', dateLabel: '', sections: [] };
    }
    
    const schedule = allSessions[selectedDate];
    
    // If no sessions are selected, show all sessions for UI demonstration
    if (myConferenceSessions.length === 0) {
      return schedule;
    }
    
    const filteredSections = schedule.sections.map((section) => ({
      ...section,
      timeSlots: section.timeSlots
        .map((timeSlot) => ({
          ...timeSlot,
          events: timeSlot.events.filter((event) =>
            myConferenceSessions.includes(event.id)
          ),
        }))
        .filter((timeSlot) => timeSlot.events.length > 0),
    })).filter((section) => section.timeSlots.length > 0);

    return {
      ...schedule,
      sections: filteredSections,
    };
  };

  const currentSchedule = getFilteredSchedule();

  const handleEventPress = (event: EventItem, timeRange: string) => {
    if (event.isClickable && onEventPress) {
      const eventData = {
        ...event,
        date: currentSchedule.date,
        dateLabel: currentSchedule.dateLabel,
        timeRange: timeRange,
        parsedDate: getFormattedDate(currentSchedule.date),
        isFromMyConference: true,
      };
      console.log('eventData', eventData);
      onEventPress(eventData as any, true);
    }
  };

  const handleRemoveSession = (eventId: string) => {
    if (onRemoveSession) {
      onRemoveSession(eventId);
    }
  };

  const getFormattedDate = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header
        title="My Conference"
        onBack={onBack}
        onNavigateToHome={onNavigateToHome}
        onMenuItemPress={(id: any) => console.log('Menu:', id)}
      />

      {/* Date Selection Tabs */}
      <ImageBackground
        source={require('../../../../assets/images/wave-img.png')}
        style={globalStyles.imgBgContainerWave}
        imageStyle={globalStyles.imgBgWave}
      >
        <View style={globalStyles.dateTabsContainer}>
          {availableDates.map((dateKey) => {
            const daySchedule = allSessions[dateKey];
            if (!daySchedule) return null;
            
            const dateParts = parseDateLabel(daySchedule.dateLabel);
            const isActive = selectedDate === dateKey;
            
            return (
              <TouchableOpacity
                key={dateKey}
                style={[
                  globalStyles.dateTab,
                  isActive && globalStyles.dateTabActive,
                ]}
                onPress={() => setSelectedDate(dateKey)}
              >
                <Text style={[globalStyles.dateTabMonth, isActive && globalStyles.dateTabMonthActive]}>
                  {dateParts.month}
                </Text>
                <Text style={[globalStyles.dateTabDay, isActive && globalStyles.dateTabDayActive]}>
                  {dateParts.day}
                </Text>
                <Text style={[globalStyles.dateTabDayName, isActive && globalStyles.dateTabDayNameActive]}>
                  {dateParts.dayName}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ImageBackground>

      {/* Content Area */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>
              {isSpeaker ? 'Loading speaker sessions...' : 'Loading wishlist...'}
            </Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => {
                setError(null);
                setLoading(true);
                // Retry fetch
                let fetchPromise: Promise<any>;
                if (isSpeaker) {
                  fetchPromise = getSpeakerSessions();
                } else if (hasConference) {
                  fetchPromise = getSessionWorkshops();
                } else {
                  setError('Conference registration is required to view wishlist sessions');
                  setLoading(false);
                  return;
                }
                
                fetchPromise
                  .then((response) => {
                    if (response?.success && response?.data) {
                      const { transformedData, dates } = transformResponseData(response.data);
                      setAllSessions(transformedData);
                      setAvailableDates(dates);
                      if (dates.length > 0) {
                        setSelectedDate(dates[0]);
                      }
                    }
                  })
                  .catch((err) => {
                    setError(err?.message || (isSpeaker 
                      ? 'Failed to load speaker sessions. Please try again.' 
                      : 'Failed to load wishlist. Please try again.'));
                  })
                  .finally(() => setLoading(false));
              }}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : currentSchedule.sections.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {isSpeaker 
                ? 'No speaker sessions available for this date.' 
                : 'No wishlist sessions available for this date.'}
            </Text>
          </View>
        ) : (
          currentSchedule.sections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={globalStyles.section}>
            {section.title && (
              <Text style={globalStyles.sectionTitle}>{section.title}</Text>
            )}

            {section.timeSlots.map((timeSlot) => {       
              const timeParts = timeSlot.timeRange.split(' to ');
              const startTime = timeParts[0] || '';
              const endTime = timeParts[1] || timeSlot.timeRange;
              
              return (
              <View key={timeSlot.id} style={globalStyles.timeSlotContainer}>
                {/* Time Block */}
                <View style={globalStyles.timeBlock}>
                  {timeParts.length > 1 ? (
                    <View style={globalStyles.timeBlockContent}>
                      <Text style={globalStyles.timeBlockText}>{startTime}</Text>
                      <Text style={globalStyles.timeBlockSeparator}>to</Text>
                      <Text style={globalStyles.timeBlockText}>{endTime}</Text>
                    </View>
                  ) : (
                    <Text style={globalStyles.timeBlockText}>{timeSlot.timeRange}</Text>
                  )}
                </View>

                {/* Events List */}
                <View style={globalStyles.eventsContainer}>
                  {timeSlot.events.map((event, eventIndex) => (
                    <TouchableOpacity
                      key={event.id}
                      style={[
                        globalStyles.eventItem,
                        eventIndex !== timeSlot.events.length - 1 &&
                        globalStyles.eventItemBorder,
                      ]}
                      onPress={() => handleEventPress(event, timeSlot.timeRange)}
                      disabled={!event.isClickable}
                      activeOpacity={event.isClickable ? 0.7 : 1}
                    >
                      <View style={globalStyles.eventContent}>
                        {event.hall && (
                          <Text style={globalStyles.eventHall}>
                            {event.hall}
                          </Text>
                        )}
                       
                        <Text
                          style={[
                            globalStyles.eventTitle,
                            !event.hall && globalStyles.eventTitleNoHall,
                          ]}
                        >
                          {event.title}
                        </Text>
                      </View>
                      {event.isClickable && (
                        <View style={globalStyles.eventArrow}>
                         <CardRightArrowIcon size={16} color={colors.darkGray} />
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )})}
          </View>
        ))
        )}
      </ScrollView>

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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl * 2,
    paddingHorizontal: spacing.lg,
  },
  errorText: {
    fontSize: screenWidth * 0.04,
    fontFamily: Fonts.Regular,
    color: colors.red,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.sm,
    marginTop: spacing.md,
  },
  retryButtonText: {
    fontSize: screenWidth * 0.038,
    fontFamily: Fonts.Medium,
    color: colors.white,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl * 2,
  },
  emptyText: {
    fontSize: screenWidth * 0.04,
    fontFamily: Fonts.Regular,
    color: colors.darkGray,
    textAlign: 'center',
  },
  emptyState: {
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: screenWidth * 0.04,
    fontFamily: Fonts.Medium,
    color: colors.darkGray,
  },
  section: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: screenWidth * 0.042,
    fontFamily: Fonts.Bold,
    color: colors.black,
    marginBottom: spacing.md,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  sessionCard: {
    width: (screenWidth - spacing.md * 3) / 2,
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  deleteButton: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    zIndex: 10,
  },
  deleteIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.red,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  cardContent: {
    flex: 1,
  },
  timeBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
  },
  timeBadgeText: {
    fontSize: screenWidth * 0.026,
    fontFamily: Fonts.Medium,
    color: colors.black,
  },
  cardDetails: {
    flex: 1,
    marginBottom: spacing.sm,
  },
  cardHall: {
    fontSize: screenWidth * 0.028,
    fontFamily: Fonts.Regular,
    color: colors.darkGray,
    marginBottom: spacing.xs,
  },
  cardTitle: {
    fontSize: screenWidth * 0.034,
    fontFamily: Fonts.Bold,
    color: colors.primary,
    marginBottom: spacing.xs,
    lineHeight: screenWidth * 0.045,
  },
  cardDescription: {
    fontSize: screenWidth * 0.029,
    fontFamily: Fonts.Regular,
    color: colors.darkGray,
    lineHeight: screenWidth * 0.04,
    marginTop: spacing.xs,
  },
  cardArrow: {
    alignSelf: 'flex-end',
    marginTop: spacing.xs,
  },
  ribbonContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    opacity: 0.3,
    overflow: 'hidden',
  },
  ribbonIcon: {
    width: screenWidth * 0.3,
    height: screenWidth * 0.3,
  },
});

export default MyConference;

