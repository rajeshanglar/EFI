import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { Header } from '../../components/Header';
import { CardRightArrowIcon, CloseIcon, YellowRibbonIcon } from '../../components/icons';
import globalStyles, { colors, spacing, borderRadius, Fonts } from '../../styles/globalStyles';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface MyConferenceProps {
  onBack: () => void;
  onNavigateToHome: () => void;
  onEventPress?: (event: EventItem) => void;
  myConferenceSessions?: string[]; // Array of session IDs that are added to "My Conference"
  onRemoveSession?: (eventId: string) => void;
}

interface EventItem {
  id: string;
  hall?: string;
  title: string;
  description?: string;
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
  const [selectedDate, setSelectedDate] = useState<'mar06' | 'mar07' | 'mar08'>('mar06');

  // Mock data - In real app, this would come from API/state management
  // For demo, we'll use some of the sessions from ConferenceList
  const allSessions: Record<string, DaySchedule> = {
    mar06: {
      date: '2026-03-06',
      dateLabel: 'MAR 06 Mon',
      sections: [
        {
          title: 'Pre Congress Workshops',
          timeSlots: [
            {
              id: '1',
              timeRange: '08.00 am to 12.30 pm',
              events: [
                { 
                  id: '1', 
                  hall: 'Hall 1', 
                  title: 'Robotics in Endometriosis',
                  description: 'Learn advanced robotic techniques for endometriosis surgery',
                  isClickable: true 
                },
              ],
            },
            {
              id: '3',
              timeRange: '13.30 pm to 18.00 pm',
              events: [
                { 
                  id: '6', 
                  hall: 'Hall 2', 
                  title: 'MRI in Endometriosis',
                  description: 'Advanced MRI interpretation for endometriosis',
                  isClickable: true 
                },
              ],
            },
          ],
        },
      ],
    },
    mar07: {
      date: '2026-03-07',
      dateLabel: 'MAR 07 TUE',
      sections: [],
    },
    mar08: {
      date: '2026-03-08',
      dateLabel: 'MAR 08 WED',
      sections: [],
    },
  };

  // Filter to show only sessions that are in "My Conference"
  const getFilteredSchedule = () => {
    const schedule = allSessions[selectedDate];
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
      };
      onEventPress(eventData as any);
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
      />

      {/* Date Selection Tabs */}
      <ImageBackground
        source={require('../../assets/images/wave-img.png')}
        style={globalStyles.imgBgContainerWave}
        imageStyle={globalStyles.imgBgWave}
      >
        <View style={styles.dateTabsContainer}>
          <TouchableOpacity
            style={[
              styles.dateTab,
              selectedDate === 'mar06' && styles.dateTabActive,
            ]}
            onPress={() => setSelectedDate('mar06')}
          >
            <Text style={[styles.dateTabMonth, selectedDate === 'mar06' && styles.dateTabMonthActive]}>
              MAR
            </Text>
            <Text style={[styles.dateTabDay, selectedDate === 'mar06' && styles.dateTabDayActive]}>
              06
            </Text>
            <Text style={[styles.dateTabDayName, selectedDate === 'mar06' && styles.dateTabDayNameActive]}>
              Mon
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.dateTab,
              selectedDate === 'mar07' && styles.dateTabActive,
            ]}
            onPress={() => setSelectedDate('mar07')}
          >
            <Text style={[styles.dateTabMonth, selectedDate === 'mar07' && styles.dateTabMonthActive]}>
              MAR
            </Text>
            <Text style={[styles.dateTabDay, selectedDate === 'mar07' && styles.dateTabDayActive]}>
              07
            </Text>
            <Text style={[styles.dateTabDayName, selectedDate === 'mar07' && styles.dateTabDayNameActive]}>
              TUE
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.dateTab,
              selectedDate === 'mar08' && styles.dateTabActive,
            ]}
            onPress={() => setSelectedDate('mar08')}
          >
            <Text style={[styles.dateTabMonth, selectedDate === 'mar08' && styles.dateTabMonthActive]}>
              MAR
            </Text>
            <Text style={[styles.dateTabDay, selectedDate === 'mar08' && styles.dateTabDayActive]}>
              08
            </Text>
            <Text style={[styles.dateTabDayName, selectedDate === 'mar08' && styles.dateTabDayNameActive]}>
              WED
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>

      {/* Content Area */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {currentSchedule.sections.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No sessions added for this date</Text>
          </View>
        ) : (
          currentSchedule.sections.map((section, sectionIndex) => (
            <View key={sectionIndex} style={styles.section}>
              {section.title && (
                <Text style={styles.sectionTitle}>{section.title}</Text>
              )}

              {section.timeSlots.map((timeSlot) => (
                <View key={timeSlot.id} style={styles.timeSlotContainer}>
                  {/* Time Block with Remove Icon */}
                  <View style={styles.timeBlockContainer}>
                    <View style={styles.timeBlock}>
                      <Text style={styles.timeBlockText}>{timeSlot.timeRange}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.removeIconContainer}
                      onPress={() => handleRemoveSession(timeSlot.events[0]?.id)}
                    >
                      <View style={styles.removeIcon}>
                        <CloseIcon size={14} color={colors.white} />
                      </View>
                    </TouchableOpacity>
                  </View>

                  {/* Events List */}
                  <View style={styles.eventsContainer}>
                    {timeSlot.events.map((event, eventIndex) => (
                      <TouchableOpacity
                        key={event.id}
                        style={[
                          styles.eventItem,
                          eventIndex !== timeSlot.events.length - 1 &&
                            styles.eventItemBorder,
                        ]}
                        onPress={() => handleEventPress(event, timeSlot.timeRange)}
                        disabled={!event.isClickable}
                        activeOpacity={event.isClickable ? 0.7 : 1}
                      >
                        <View style={styles.eventContent}>
                          {event.hall && (
                            <Text style={styles.eventHall}>
                              {event.hall} -{' '}
                            </Text>
                          )}
                          <Text
                            style={[
                              styles.eventTitle,
                              !event.hall && styles.eventTitleNoHall,
                            ]}
                          >
                            {event.title}
                          </Text>
                          {event.description && (
                            <Text style={styles.eventDescription}>
                              {event.description}
                            </Text>
                          )}
                        </View>
                        {event.isClickable && (
                          <View style={styles.eventArrow}>
                            <CardRightArrowIcon size={16} color={colors.darkGray} />
                          </View>
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          ))
        )}
      </ScrollView>

      {/* Yellow Ribbon Decorative Element */}
      <View style={styles.ribbonContainer} pointerEvents="none">
        <View style={styles.ribbonIcon}>
          <YellowRibbonIcon size={screenWidth * 0.3} color={colors.primaryLight} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  dateTabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  dateTab: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.round,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dateTabActive: {
    backgroundColor: colors.primaryLight,
  },
  dateTabMonth: {
    fontSize: screenWidth * 0.025,
    fontFamily: Fonts.Regular,
    color: colors.darkGray,
    marginBottom: spacing.xs,
  },
  dateTabMonthActive: {
    color: colors.darkGray,
  },
  dateTabDay: {
    fontSize: screenWidth * 0.045,
    fontFamily: Fonts.Bold,
    color: colors.darkGray,
    marginBottom: spacing.xs,
  },
  dateTabDayActive: {
    color: colors.primary,
    fontSize: screenWidth * 0.045,
  },
  dateTabDayName: {
    fontSize: screenWidth * 0.025,
    fontFamily: Fonts.Regular,
    color: colors.darkGray,
  },
  dateTabDayNameActive: {
    color: colors.darkGray,
  },
  scrollView: {
    flex: 1,
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
  timeSlotContainer: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  timeBlockContainer: {
    position: 'relative',
    width: screenWidth * 0.25,
    marginRight: spacing.md,
  },
  timeBlock: {
    width: '100%',
    backgroundColor: colors.primaryLight,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeBlockText: {
    fontSize: screenWidth * 0.028,
    fontFamily: Fonts.Medium,
    color: colors.black,
    textAlign: 'center',
    lineHeight: screenWidth * 0.04,
  },
  removeIconContainer: {
    position: 'absolute',
    top: -8,
    right: -8,
    zIndex: 1,
  },
  removeIcon: {
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
  eventsContainer: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.white,
  },
  eventItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  eventContent: {
    flex: 1,
  },
  eventHall: {
    fontSize: screenWidth * 0.033,
    fontFamily: Fonts.Regular,
    color: colors.darkGray,
    marginBottom: spacing.xs,
  },
  eventTitle: {
    fontSize: screenWidth * 0.038,
    fontFamily: Fonts.Bold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  eventTitleNoHall: {
    fontSize: screenWidth * 0.038,
    fontFamily: Fonts.Bold,
    color: colors.primary,
  },
  eventDescription: {
    fontSize: screenWidth * 0.032,
    fontFamily: Fonts.Regular,
    color: colors.darkGray,
    marginTop: spacing.xs,
    lineHeight: screenWidth * 0.045,
  },
  eventArrow: {
    marginLeft: spacing.sm,
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

