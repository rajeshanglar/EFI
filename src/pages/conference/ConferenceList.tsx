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
import Header from '../../components/Header';
import { ArrowRightIcon, CardRightArrowIcon } from '../../components/icons';
import globalStyles, { colors, spacing, borderRadius, Fonts } from '../../styles/globalStyles';
import { getSessionsByEventId } from '../../services/staticService';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface ConferenceListProps {
  onBack: () => void;
  onNavigateToHome: () => void;
  onEventPress?: (event: EventItem) => void;
  eventId?: number | string;
}

interface EventItem {
  id: string;
  hall?: string;
  title: string;
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

const ConferenceList: React.FC<ConferenceListProps> = ({
  onBack,
  onNavigateToHome,
  onEventPress,
  eventId = 1, // Default event_id, can be passed as prop
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scheduleData, setScheduleData] = useState<Record<string, DaySchedule>>({});
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');

  // Fetch sessions data from API
  useEffect(() => {
    const fetchSessions = async () => {
      if (!eventId) {
        setError('Event ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log('Fetching sessions for eventId:', eventId);
        const response = await getSessionsByEventId(eventId);
        console.log('API Response:', JSON.stringify(response, null, 2));
        
        if (response?.success && response?.data) {
          // Check if data is empty or has no keys
          const dataKeys = Object.keys(response.data);
          if (dataKeys.length === 0) {
            setError('No sessions available for this event.');
            setLoading(false);
            return;
          }

          // Transform API response to match our data structure
          const transformedData: Record<string, DaySchedule> = {};
          const dates: string[] = [];

          Object.keys(response.data).forEach((dateKey) => {
            const dayData = response.data[dateKey];
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

          if (dates.length === 0) {
            setError('No valid session data found in the response.');
            setLoading(false);
            return;
          }

          setScheduleData(transformedData);
          setAvailableDates(dates);
          
          // Set first available date as selected
          if (dates.length > 0) {
            setSelectedDate(dates[0]);
          }
        } else {
          const errorMsg = response?.message || 'Failed to load sessions data';
          console.error('API response indicates failure:', response);
          setError(errorMsg);
        }
      } catch (err: any) {
        console.error('Error fetching sessions:', err);
        console.error('Error details:', {
          message: err?.message,
          response: err?.response?.data,
          status: err?.response?.status,
          statusText: err?.response?.statusText,
        });
        
        // Extract more detailed error message
        let errorMessage = 'Failed to load sessions. Please try again.';
        if (err?.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err?.message) {
          errorMessage = err.message;
        } else if (err?.response?.status === 404) {
          errorMessage = 'Event not found. Please check the event ID.';
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
  }, [eventId]);

  const currentSchedule = scheduleData[selectedDate] || { date: '', dateLabel: '', sections: [] };

  const handleEventPress = (event: EventItem, timeRange: string) => {
    if (event.isClickable && onEventPress) {
      // Pass event data along with date and time information
      const eventData = {
        ...event,
        date: currentSchedule.date,
        dateLabel: currentSchedule.dateLabel,
        timeRange: timeRange,
        parsedDate: getFormattedDate(currentSchedule.date),
      };
      onEventPress(eventData as any);
    }
  };

  // Helper function to format date
  const getFormattedDate = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  };

  // Helper function to extract date parts from dateLabel (e.g., "MAR 06 FRI" -> { month: "MAR", day: "06", dayName: "FRI" })
  const parseDateLabel = (dateLabel: string) => {
    const parts = dateLabel.split(' ');
    return {
      month: parts[0] || '',
      day: parts[1] || '',
      dayName: parts[2] || '',
    };
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header
        title="Conference List"
        onBack={onBack}
        onNavigateToHome={onNavigateToHome}
        onMenuItemPress={(id: any) => console.log('Menu:', id)}
      />

      {/* Date Selection Tabs */}
      <ImageBackground
        source={require('../../assets/images/wave-img.png')}
        style={globalStyles.imgBgContainerWave}
        imageStyle={globalStyles.imgBgWave}
      >
      <View style={globalStyles.dateTabsContainer}>
          {availableDates.map((dateKey) => {
            const daySchedule = scheduleData[dateKey];
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
            <Text style={styles.loadingText}>Loading sessions...</Text>
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
                getSessionsByEventId(eventId)
                  .then((response) => {
                    if (response?.success && response?.data) {
                      const transformedData: Record<string, DaySchedule> = {};
                      const dates: string[] = [];

                      Object.keys(response.data).forEach((dateKey) => {
                        const dayData = response.data[dateKey];
                        transformedData[dateKey] = {
                          date: dayData.date,
                          dateLabel: dayData.dateLabel,
                          sections: dayData.sections.map((section: any) => ({
                            title: section.title,
                            timeSlots: section.timeSlots.map((timeSlot: any) => ({
                              id: timeSlot.id,
                              timeRange: timeSlot.timeRange,
                              events: timeSlot.events.map((event: any) => ({
                                id: event.id,
                                title: event.title,
                                hall: event.hall || undefined,
                                eventType: event.eventType || '',
                                isClickable: event.isClickable !== undefined ? event.isClickable : true,
                              })),
                            })),
                          })),
                        };
                        dates.push(dateKey);
                      });

                      setScheduleData(transformedData);
                      setAvailableDates(dates);
                      if (dates.length > 0) {
                        setSelectedDate(dates[0]);
                      }
                    }
                  })
                  .catch((err) => {
                    setError(err?.message || 'Failed to load sessions. Please try again.');
                  })
                  .finally(() => setLoading(false));
              }}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : currentSchedule.sections.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No sessions available for this date.</Text>
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
});

export default ConferenceList;

