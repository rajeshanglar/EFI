import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Image,
  Dimensions,
} from 'react-native';
import Header from '../../../../components/Header';
import {
  CalendarIconYellow,
  MapWIcon,
  TimeWIcon,
  WorkshopIcon,
} from '../../../../components/icons';
import globalStyles, {
  colors,
  spacing,
  borderRadius,
  Fonts,
} from '../../../../styles/globalStyles';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface SpeakerDetails {
  id: string;
  name: string;
  titles: string[];
  biography: string;
  sessionTitle: string;
  sessionSubtitle?: string;
  date: string;
  location: string;
  time: string;
  workshopNumber?: string;
  theme: string;
  overview: string;
  image?: any;
}

interface KeynoteSpeakersDetailsProps {
  onBack: () => void;
  onNavigateToHome: () => void;
  speakerData?: SpeakerDetails;
}

const KeynoteSpeakersDetails: React.FC<KeynoteSpeakersDetailsProps> = ({
  onBack,
  onNavigateToHome,
  speakerData,
}) => {
  // Default speaker data if not provided
  const defaultSpeaker: SpeakerDetails = {
    id: '1',
    name: 'Gajbhiye, Rahul',
    titles: [
      'SRC Accredited Master Surgeon Multidisciplinary',
      'Endometriosis Care (MSMEC).',
      'Consultant Gynaecologist, Robotic and',
      'Laparoscopic Surgeon, Endometriosis Excision',
      'Surgeon',
    ],
    biography:
      'Dr. Bindra is a leading Endometriosis surgeon, specializing in minimally invasive gynecological surgeries and advanced excision procedures. With over 15 years of experience, he has been at the forefront of national-level initiatives including public awareness campaigns, international congresses, and specialized cadaveric dissection courses.',
    sessionTitle: 'Robotics in Endometriosis',
    sessionSubtitle: 'Simulation to Strategy',
    date: 'Monday, March 06, 2025',
    location: 'Hall 1',
    time: '08.00 am - 12:30pm',
    workshopNumber: 'Workshop 1',
    theme: '"The Robotic Edge: Precision, Depth & Dexterity"',
    overview:
      'This hands-on workshop focuses on robotic-assisted surgery for endometriosis. It features console-based simulator training, step-by-step case videos, and real-time guidance from India\'s and the world\'s top robotic endometriosis surgeons.',
    image: undefined,
  };

  const speaker = speakerData || defaultSpeaker;

  return (
    <View style={styles.container}>
      <Header
        title="Keynote Speaker Details"
        onBack={onBack}
        onNavigateToHome={onNavigateToHome}
        onMenuItemPress={(id: any) => console.log('Menu:', id)}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header Section with Profile */}
        <ImageBackground
          source={require('../../../../assets/images/wave-img.png')}
          style={styles.headerBackground}
          imageStyle={styles.headerBackgroundImage}
        >
          <View style={styles.headerContent}>
            {/* Profile Picture */}
            <View style={styles.profileImageContainer}>
              {speaker.image ? (
                <Image
                  source={speaker.image}
                  style={styles.profileImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.profilePlaceholder}>
                  <Text style={styles.profilePlaceholderText}>
                    {speaker.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
            </View>

            {/* Name and Titles */}
            <View style={styles.speakerInfoContainer}>
              <Text style={styles.speakerName}>{speaker.name}</Text>
              {speaker.titles.map((title, index) => (
                <Text key={index} style={styles.speakerTitle}>
                  {title}
                </Text>
              ))}
            </View>
          </View>
        </ImageBackground>

        {/* Content Sections */}
        <View style={styles.contentContainer}>
          {/* Biography Section */}
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>Biography</Text>
            <Text style={styles.sectionText}>{speaker.biography}</Text>
          </View>

          {/* Session Section */}
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>Session</Text>
            <Text style={styles.sessionTitle}>{speaker.sessionTitle}</Text>
            {speaker.sessionSubtitle && (
              <Text style={styles.sessionSubtitle}>{speaker.sessionSubtitle}</Text>
            )}

            {/* Session Metadata */}
            <View style={styles.sessionMetadata}>
              <View style={styles.metadataItem}>
                <CalendarIconYellow size={20} color={colors.primary} />
                <Text style={styles.metadataText}>{speaker.date}</Text>
              </View>
              <View style={styles.metadataItem}>
                <MapWIcon size={20} color={colors.primary} />
                <Text style={styles.metadataText}>{speaker.location}</Text>
              </View>
              <View style={styles.metadataItem}>
                <TimeWIcon size={20} color={colors.primary} />
                <Text style={styles.metadataText}>{speaker.time}</Text>
              </View>
              {speaker.workshopNumber && (
                <View style={styles.metadataItem}>
                  <WorkshopIcon size={20} color={colors.primary} />
                  <Text style={styles.metadataText}>{speaker.workshopNumber}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Workshop Theme Section */}
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>Workshop Theme</Text>
            <Text style={styles.themeText}>{speaker.theme}</Text>
          </View>

          {/* Brief Overview Section */}
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>Brief Overview:</Text>
            <Text style={styles.sectionText}>{speaker.overview}</Text>
          </View>
        </View>
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
  headerBackground: {
    backgroundColor: colors.primary,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  headerBackgroundImage: {
    opacity: 0.15,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  profileImageContainer: {
    marginRight: spacing.md,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: colors.primaryLight,
  },
  profilePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primaryLight,
  },
  profilePlaceholderText: {
    fontSize: screenWidth * 0.06,
    fontFamily: Fonts.Bold,
    color: colors.primary,
  },
  speakerInfoContainer: {
    flex: 1,
  },
  speakerName: {
    fontSize: screenWidth * 0.045,
    fontFamily: Fonts.Bold,
    color: colors.primaryLight,
    marginBottom: spacing.sm,
  },
  speakerTitle: {
    fontSize: screenWidth * 0.033,
    fontFamily: Fonts.Regular,
    color: colors.primaryLight,
    marginBottom: spacing.xs,
    lineHeight: screenWidth * 0.045,
  },
  contentContainer: {
    padding: spacing.md,
    paddingTop: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeading: {
    fontSize: screenWidth * 0.042,
    fontFamily: Fonts.Bold,
    color: colors.primary,
    marginBottom: spacing.md,
  },
  sectionText: {
    fontSize: screenWidth * 0.036,
    fontFamily: Fonts.Regular,
    color: colors.primary,
    lineHeight: screenWidth * 0.052,
  },
  sessionTitle: {
    fontSize: screenWidth * 0.042,
    fontFamily: Fonts.Bold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  sessionSubtitle: {
    fontSize: screenWidth * 0.036,
    fontFamily: Fonts.Regular,
    color: colors.primary,
    fontStyle: 'italic',
    marginBottom: spacing.md,
  },
  sessionMetadata: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  metadataText: {
    fontSize: screenWidth * 0.036,
    fontFamily: Fonts.Regular,
    color: colors.primary,
    marginLeft: spacing.sm,
  },
  themeText: {
    fontSize: screenWidth * 0.036,
    fontFamily: Fonts.Regular,
    color: colors.primary,
    lineHeight: screenWidth * 0.052,
  },
});

export default KeynoteSpeakersDetails;

