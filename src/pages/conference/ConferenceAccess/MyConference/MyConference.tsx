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
import Header from '../../../../components/Header';
import { CardRightArrowIcon, CloseIcon, YellowRibbonIcon } from '../../../../components/icons';
import globalStyles, { colors, spacing, borderRadius, Fonts } from '../../../../styles/globalStyles';

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
                { id: '1', hall: 'Hall 1', eventType: 'Workshop-1', title:'Robotics in Endometriosis', isClickable: true },               
              ],
            },
            
            {
              id: '3',
              timeRange: '13.30 pm to 18.00 pm',
              events: [
                { id: '5', hall: 'Hall 1', eventType: 'Workshop-4', title: 'Hands on Robotic Simulator', isClickable: true },
               
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
                { id: '1', hall: 'Main Hall', eventType: '', title: 'Opening Ceremony', isClickable: true },
               
              ],
            },
            
            {
              id: '3',
              timeRange: '11.00 am to 12.30 pm',
              events: [
                { id: '4', hall: 'Main Hall', eventType: 'Session 1',  title: 'Advanced Laparoscopic Techniques', isClickable: true },
               
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
                { id: '1', hall: 'Main Hall', eventType: 'Session 3', title: 'Robotic Surgery Innovations', isClickable: true },
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
        {currentSchedule.sections.map((section, sectionIndex) => (
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
                            {event.hall} -{' '} {event.eventType}{' '}
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
        ))}
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

