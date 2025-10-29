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
} from 'react-native';
import { Header } from '../../components/Header';
import { SuccessIcon, ArrowRightIcon, CalendarIconYellow,
  MapWIcon, TimeWIcon, WorkshopIcon } from '../../components/icons';
import globalStyles, { colors, spacing, borderRadius, Fonts } from '../../styles/globalStyles';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface ConferenceSessionDetailsProps {
  onBack: () => void;
  onNavigateToHome: () => void;
  sessionData?: SessionData;
  onAddToMyConference?: (sessionId: string) => void;
  onRemoveFromMyConference?: (sessionId: string) => void;
  isInMyConference?: boolean;
}

interface SessionData {
  id: string;
  date: string;
  time: string;
  location: string;
  workshopNumber?: string;
  title: string;
  subtitle?: string;
  theme: string;
  overview: string;
  imageUrl?: string;
}

const ConferenceSessionDetails: React.FC<ConferenceSessionDetailsProps> = ({
  onBack,
  onNavigateToHome,
  sessionData,
  onAddToMyConference,
  onRemoveFromMyConference,
  isInMyConference = false,
}) => {
  const [isAdded, setIsAdded] = useState(isInMyConference);

  // Default session data if not provided
  const defaultSession: SessionData = {
    id: '1',
    date: 'Monday, March 06, 2025',
    time: '08.00 am - 12:30pm',
    location: 'Hall 1',
    workshopNumber: 'Workshop 1',
    title: 'Robotics in Endometriosis',
    subtitle: 'Simulation to Strategy',
    theme: '"The Robotic Edge: Precision, Depth & Dexterity"',
    overview:
      'This hands-on workshop focuses on robotic-assisted surgery for endometriosis. It features console-based simulator training, step-by-step case videos, and real-time guidance from India\'s and the world\'s top robotic endometriosis surgeons Suitable for beginners to advanced surgeons, this workshop provides comprehensive insight into robotic techniques. Participants will gain hands-on experience with the latest robotic systems and learn from world-renowned experts in the field.',
    imageUrl: undefined,
  };

  const session = sessionData || defaultSession;

  useEffect(() => {
    setIsAdded(isInMyConference);
  }, [isInMyConference]);

  const handleAddToConference = () => {
    if (session.id && onAddToMyConference) {
      onAddToMyConference(session.id);
    }
    setIsAdded(true);
  };

  const handleRemoveFromConference = () => {
    if (session.id && onRemoveFromMyConference) {
      onRemoveFromMyConference(session.id);
    }
    setIsAdded(false);
  };

  const handleMoreDetails = () => {
    // Handle click on embedded image for more details
    console.log('View more details');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header
        title="Session Details"
        onBack={onBack}
        onNavigateToHome={onNavigateToHome}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Session Metadata Card */}
        <ImageBackground
        source={require('../../assets/images/wave-img.png')}
        style={globalStyles.imgBgContainerWave}
        imageStyle={globalStyles.imgBgWave}
      >
          <View style={styles.metadataCard}>
          {/* Date */}
          <View style={styles.metadataRow}>
            <View style={styles.iconContainer}>
            <CalendarIconYellow size={20} color={colors.primaryLight} />
            </View>
            <Text style={styles.dateText}>{session.date}</Text>
          </View>

          {/* Location, Time, and Workshop */}
          <View style={styles.metadataInfoRow}>
            <View style={styles.metadataInfoItem}>
              <MapWIcon size={20} color={colors.primaryLight} />
              <Text style={styles.metadataText}>{session.location}</Text>
            </View>
            <View style={styles.metadataInfoItem}>
              <TimeWIcon size={20} color={colors.primaryLight} />
              <Text style={styles.metadataText}>{session.time}</Text>
            </View>
            {session.workshopNumber && (
              <View style={styles.metadataInfoItem}>
                <WorkshopIcon size={20} color={colors.primaryLight} />
                <Text style={styles.metadataText}>{session.workshopNumber}</Text>
              </View>
            )}
          </View>
        </View>
        </ImageBackground>

        {/* Session Content */}
        <View style={styles.contentContainer}>
          {/* Title */}
          <Text style={styles.sessionTitle}>{session.title}</Text>
          {session.subtitle && (
            <Text style={styles.sessionSubtitle}>{session.subtitle}</Text>
          )}

          {/* Workshop Theme */}
          <View style={styles.themeContainer}>
            <Text style={styles.sectionLabel}>Workshop Theme</Text>
            <Text style={styles.themeText}>{session.theme}</Text>
          </View>

          {/* Brief Overview */}
          <View style={styles.overviewContainer}>
            <Text style={styles.sectionLabel}>Brief Overview:</Text>
            <Text style={styles.overviewText}>{session.overview}</Text>
          </View>

          {/* Embedded Preview Image */}
          <TouchableOpacity
            style={styles.imageContainer}
            onPress={handleMoreDetails}
            activeOpacity={0.7}
          >
            <Image source={require('../../assets/images/pdfscreen.jpg')} style={styles.previewImage} />
         
            <Text style={styles.moreDetailsText}>Click this for more details</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomActionBar}>
        <TouchableOpacity
          style={styles.addButtonContainer}
          onPress={!isAdded ? handleAddToConference : undefined}
          disabled={isAdded}
        >
          <Text style={styles.addButtonText}>Add to my Conference</Text>
        </TouchableOpacity>
        {isAdded && (
          <View style={styles.statusContainer}>
            <View style={styles.checkmarkIcon}>
              <SuccessIcon size={20} color={colors.white} />
            </View>
            <TouchableOpacity onPress={handleRemoveFromConference}>
              <Text style={styles.removeText}>X Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
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
  metadataCard: {
    marginHorizontal: spacing.md,
    marginTop: spacing.md, 
  },
  metadataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  iconContainer: {
    marginRight: spacing.sm,
  },
  calendarIcon: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateText: {
    fontSize: screenWidth * 0.04,
    fontFamily: Fonts.Bold,
    color: colors.primaryLight,
  },
  metadataInfoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  metadataInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  iconText: {
    fontSize: screenWidth * 0.04,
  },
  metadataText: {
    fontSize: screenWidth * 0.035,
    fontFamily: Fonts.Medium,
    color: colors.white,
  },
  contentContainer: {
    padding: spacing.lg,
    paddingBottom: 100,
  },
  sessionTitle: {
    fontSize: screenWidth * 0.044,
    fontFamily: Fonts.Bold,
    color: colors.black,

  },
  sessionSubtitle: {
    fontSize: screenWidth * 0.04,
    fontFamily: Fonts.Regular,
    color: colors.black,
    marginBottom: spacing.md,
  },
  themeContainer: {
    marginBottom: spacing.md,
  },
  sectionLabel: {
    fontSize: screenWidth * 0.04,
    fontFamily: Fonts.Bold,
    color: colors.black,
    marginBottom: 0,
  },
  themeText: {
    fontSize: screenWidth * 0.038,
    fontFamily: Fonts.Regular,
    color: colors.black,
    lineHeight: screenWidth * 0.055,
  },
  overviewContainer: {
    marginBottom: spacing.lg,
  },
  overviewText: {
    fontSize: screenWidth * 0.037,
    fontFamily: Fonts.Regular,
    color: colors.black,
    lineHeight: screenWidth * 0.055,
    marginTop: spacing.sm,
  },
  imageContainer: {
    marginTop: spacing.sm,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  previewImage: {
    width: Dimensions.get('window').width * 0.7,
    height: Dimensions.get('window').height * 0.2,
    resizeMode: 'cover',
  },
 
  moreDetailsText: {
    fontSize: screenWidth * 0.04,
    fontFamily: Fonts.Medium,
    color: colors.blue,
    textAlign: 'center',
    marginTop: spacing.sm,
    textDecorationLine: 'underline',
  },
  bottomActionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.primaryLight,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  addButtonContainer: {
    flex: 1,
  },
  addButtonText: {
    fontSize: screenWidth * 0.04,
    fontFamily: Fonts.Bold,
    color: colors.black,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  checkmarkIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.blue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeText: {
    fontSize: screenWidth * 0.037,
    fontFamily: Fonts.Medium,
    color: colors.red,
  },
});

export default ConferenceSessionDetails;

