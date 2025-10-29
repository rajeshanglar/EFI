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
                { id: '1', hall: 'Hall 1', title: 'Workshop 1: Robotics in Endometriosis', isClickable: true },
                { id: '2', hall: 'Hall 2', title: 'Workshop 2: USG in Endometriosis', isClickable: true },
                { id: '3', hall: 'Hall 3', title: 'Workshop 3: Infertility in Endometriosis', isClickable: true },
              ],
            },
            {
              id: '2',
              timeRange: '12.30 pm to 13.30 pm',
              events: [
                { id: '4', title: 'Lunch Break', isClickable: false },
              ],
            },
            {
              id: '3',
              timeRange: '13.30 pm to 18.00 pm',
              events: [
                { id: '5', hall: 'Hall 1', title: 'Workshop 4: Hands on Robotic Simulator', isClickable: true },
                { id: '6', hall: 'Hall 2', title: 'Workshop 5: MRI in Endometriosis', isClickable: true },
                { id: '7', hall: 'Hall 3', title: 'Workshop 6: Deep Endometriosis Surgical Workshop', isClickable: true },
              ],
            },
            {
              id: '4',
              timeRange: '18.30 pm to 20.30 pm',
              events: [
                { id: '8', title: 'Public Awareness Programme followed by dinner', isClickable: false },
              ],
            },
          ],
        },
      ],
    },
    mar07: {
      date: '2026-03-07',
      dateLabel: 'MAR 07 TUE',
      sections: [
        {
          title: 'Main Congress Day 1',
          timeSlots: [
            {
              id: '1',
              timeRange: '09.00 am to 10.30 am',
              events: [
                { id: '1', hall: 'Main Hall', title: 'Opening Ceremony', isClickable: true },
                { id: '2', hall: 'Main Hall', title: 'Keynote Address', isClickable: true },
              ],
            },
            {
              id: '2',
              timeRange: '10.30 am to 11.00 am',
              events: [
                { id: '3', title: 'Tea Break', isClickable: false },
              ],
            },
            {
              id: '3',
              timeRange: '11.00 am to 12.30 pm',
              events: [
                { id: '4', hall: 'Main Hall', title: 'Session 1: Advanced Laparoscopic Techniques', isClickable: true },
                { id: '5', hall: 'Hall 2', title: 'Session 2: Fertility Preservation', isClickable: true },
              ],
            },
          ],
        },
      ],
    },
    mar08: {
      date: '2026-03-08',
      dateLabel: 'MAR 08 WED',
      sections: [
        {
          title: 'Main Congress Day 2',
          timeSlots: [
            {
              id: '1',
              timeRange: '09.00 am to 10.30 am',
              events: [
                { id: '1', hall: 'Main Hall', title: 'Session 3: Robotic Surgery Innovations', isClickable: true },
              ],
            },
            {
              id: '2',
              timeRange: '10.30 am to 11.00 am',
              events: [
                { id: '2', title: 'Coffee Break', isClickable: false },
              ],
            },
            {
              id: '3',
              timeRange: '11.00 am to 12.30 pm',
              events: [
                { id: '3', hall: 'Main Hall', title: 'Session 4: Case Presentations', isClickable: true },
                { id: '4', hall: 'Hall 2', title: 'Session 5: Panel Discussion', isClickable: true },
              ],
            },
            {
              id: '4',
              timeRange: '12.30 pm to 13.30 pm',
              events: [
                { id: '5', title: 'Lunch Break', isClickable: false },
              ],
            },
            {
              id: '5',
              timeRange: '13.30 pm to 15.00 pm',
              events: [
                { id: '6', hall: 'Main Hall', title: 'Closing Ceremony', isClickable: true },
              ],
            },
          ],
        },
      ],
    },
  };

  // Filter to show only sessions that are in "My Conference"
  // For UI purposes, if myConferenceSessions is empty, show all sessions
  const getFilteredSchedule = () => {
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
        <View style={globalStyles.dateTabsContainer}>
          <TouchableOpacity
            style={[
              globalStyles.dateTab,
              selectedDate === 'mar06' && globalStyles.dateTabActive,
            ]}
            onPress={() => setSelectedDate('mar06')}
          >
            <Text style={[globalStyles.dateTabMonth, selectedDate === 'mar06' && globalStyles.dateTabMonthActive]}>
              MAR
            </Text>
            <Text style={[globalStyles.dateTabDay, selectedDate === 'mar06' && globalStyles.dateTabDayActive]}>
              06
            </Text>
            <Text style={[globalStyles.dateTabDayName, selectedDate === 'mar06' && globalStyles.dateTabDayNameActive]}>
              Mon
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              globalStyles.dateTab,
              selectedDate === 'mar07' && globalStyles.dateTabActive,
            ]}
            onPress={() => setSelectedDate('mar07')}
          >
            <Text style={[globalStyles.dateTabMonth, selectedDate === 'mar07' && globalStyles.dateTabMonthActive]}>
              MAR
            </Text>
            <Text style={[globalStyles.dateTabDay, selectedDate === 'mar07' && globalStyles.dateTabDayActive]}>
              07
            </Text>
            <Text style={[globalStyles.dateTabDayName, selectedDate === 'mar07' && globalStyles.dateTabDayNameActive]}>
              TUE
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              globalStyles.dateTab,
              selectedDate === 'mar08' && globalStyles.dateTabActive,
            ]}
            onPress={() => setSelectedDate('mar08')}
          >
            <Text style={[globalStyles.dateTabMonth, selectedDate === 'mar08' && globalStyles.dateTabMonthActive]}>
              MAR
            </Text>
            <Text style={[globalStyles.dateTabDay, selectedDate === 'mar08' && globalStyles.dateTabDayActive]}>
              08
            </Text>
            <Text style={[globalStyles.dateTabDayName, selectedDate === 'mar08' && globalStyles.dateTabDayNameActive]}>
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

              {/* Cards Grid */}
              <View style={styles.cardsContainer}>
                {section.timeSlots.map((timeSlot) =>
                  timeSlot.events.map((event) => (
                    <TouchableOpacity
                      key={event.id}
                      style={styles.sessionCard}
                      onPress={() => handleEventPress(event, timeSlot.timeRange)}
                      activeOpacity={0.7}
                      disabled={!event.isClickable}
                    >
                      {/* Delete Button */}
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleRemoveSession(event.id)}
                        activeOpacity={0.8}
                      >
                        <View style={styles.deleteIcon}>
                          <CloseIcon size={12} color={colors.white} />
                        </View>
                      </TouchableOpacity>

                      {/* Card Content */}
                      <View style={styles.cardContent}>
                        {/* Time Badge */}
                        <View style={styles.timeBadge}>
                          <Text style={styles.timeBadgeText}>{timeSlot.timeRange}</Text>
                        </View>

                        {/* Event Details */}
                        <View style={styles.cardDetails}>
                          {event.hall && (
                            <Text style={styles.cardHall}>{event.hall}</Text>
                          )}
                          <Text style={styles.cardTitle} numberOfLines={2}>
                            {event.title}
                          </Text>
                          {event.description && (
                            <Text style={styles.cardDescription} numberOfLines={3}>
                              {event.description}
                            </Text>
                          )}
                        </View>

                        {/* Arrow Icon */}
                        {event.isClickable && (
                          <View style={styles.cardArrow}>
                            <CardRightArrowIcon size={18} color={colors.primary} />
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                  ))
                )}
              </View>
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

