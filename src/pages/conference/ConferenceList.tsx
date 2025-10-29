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
import { ArrowRightIcon, CardRightArrowIcon } from '../../components/icons';
import globalStyles, { colors, spacing, borderRadius, Fonts } from '../../styles/globalStyles';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface ConferenceListProps {
  onBack: () => void;
  onNavigateToHome: () => void;
  onEventPress?: (event: EventItem) => void;
}

interface EventItem {
  id: string;
  hall?: string;
  title: string;
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
}) => {
  const [selectedDate, setSelectedDate] = useState<'mar06' | 'mar07' | 'mar08'>('mar06');

  // Conference schedule data for each date
  const scheduleData: Record<string, DaySchedule> = {
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

  const currentSchedule = scheduleData[selectedDate];

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

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header
        title="Conference List"
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
            <Text
              style={[
                styles.dateTabText,
                selectedDate === 'mar06' && styles.dateTabTextActive,
              ]}
            >
              MAR 06 Mon
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.dateTab,
              selectedDate === 'mar07' && styles.dateTabActive,
            ]}
            onPress={() => setSelectedDate('mar07')}
          >
            <Text
              style={[
                styles.dateTabText,
                selectedDate === 'mar07' && styles.dateTabTextActive,
              ]}
            >
              MAR 07 TUE
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.dateTab,
              selectedDate === 'mar08' && styles.dateTabActive,
            ]}
            onPress={() => setSelectedDate('mar08')}
          >
            <Text
              style={[
                styles.dateTabText,
                selectedDate === 'mar08' && styles.dateTabTextActive,
              ]}
            >
              MAR 08 WED
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>

      {/* Content Area */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {currentSchedule.sections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            {section.title && (
              <Text style={styles.sectionTitle}>{section.title}</Text>
            )}

            {section.timeSlots.map((timeSlot) => (
              <View key={timeSlot.id} style={styles.timeSlotContainer}>
                {/* Time Block */}
                <View style={styles.timeBlock}>
                  <Text style={styles.timeBlockText}>{timeSlot.timeRange}</Text>
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
  dateTabsBackground: {
    backgroundColor: colors.primary,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dateTabsWaveImage: {
    opacity: 0.2,
    resizeMode: 'cover',
  },
  dateTabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  dateTab: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.round,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.gray,
  },
  dateTabActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primaryLight,
  },
  dateTabText: {
    fontSize: screenWidth * 0.032,
    fontFamily: Fonts.Medium,
    color: colors.black,
  },
  dateTabTextActive: {
    fontFamily: Fonts.Bold,
    color: colors.black,
  },
  scrollView: {
    flex: 1,
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
  timeBlock: {
    width: screenWidth * 0.25,
    backgroundColor: colors.primaryLight,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm,
    marginRight: spacing.md,
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
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  eventHall: {
    fontSize: screenWidth * 0.035,
    fontFamily: Fonts.Regular,
    color: colors.black,
  },
  eventTitle: {
    fontSize: screenWidth * 0.035,
    fontFamily: Fonts.Bold,
    color: colors.black,
    flex: 1,
  },
  eventTitleNoHall: {
    fontSize: screenWidth * 0.035,
    fontFamily: Fonts.Bold,
    color: colors.black,
  },
  eventArrow: {
    marginLeft: spacing.sm,
  },
});

export default ConferenceList;

