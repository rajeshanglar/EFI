import React from 'react';
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
import { SuccessIcon, CardRightArrowIcon, InformationIcon, DownloadIcon } from '../../components/icons';
import { colors, spacing, borderRadius, Fonts } from '../../styles/globalStyles';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface MyConferenceSessionProps {
  onBack: () => void;
  onNavigateToHome: () => void;
  sessionData?: SessionData;
  onRemoveFromConference?: () => void;
  onLiveQA?: () => void;
  onSessionNotes?: () => void;
  onHandouts?: () => void;
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

const MyConferenceSession: React.FC<MyConferenceSessionProps> = ({
  onBack,
  onNavigateToHome,
  sessionData,
  onRemoveFromConference,
  onLiveQA,
  onSessionNotes,
  onHandouts,
}) => {
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
      'This hands-on workshop focuses on robotic-assisted surgery for endometriosis. It features console-based simulator training, step-by-step case videos, and real-time guidance from India\'s and the world\'s top robotic endometriosis surgeons.',
    imageUrl: undefined,
  };

  const session = sessionData || defaultSession;

  const handleMoreDetails = () => {
    // Handle click on embedded image for more details
    console.log('View more details');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header
        title="My Conference Session"
        onBack={onBack}
        onNavigateToHome={onNavigateToHome}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Session Metadata Card */}
        <ImageBackground
          source={require('../../assets/images/wave-img.png')}
          style={styles.metadataBackground}
          imageStyle={styles.metadataWaveImage}
        >
          <View style={styles.metadataCard}>
            {/* Date */}
            <View style={styles.metadataRow}>
              <View style={styles.iconContainer}>
                <View style={styles.calendarIcon}>
                  <SuccessIcon size={20} color={colors.white} />
                </View>
              </View>
              <Text style={styles.dateText}>{session.date}</Text>
            </View>

            {/* Location, Time, and Workshop */}
            <View style={styles.metadataInfoRow}>
              <View style={styles.metadataInfoItem}>
                <Text style={styles.iconText}>📍</Text>
                <Text style={styles.metadataText}>{session.location}</Text>
              </View>
              <View style={styles.metadataInfoItem}>
                <Text style={styles.iconText}>🕒</Text>
                <Text style={styles.metadataText}>{session.time}</Text>
              </View>
              {session.workshopNumber && (
                <View style={styles.metadataInfoItem}>
                  <Text style={styles.iconText}>↗️</Text>
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
            <View style={styles.previewImage}>
              <Text style={styles.previewTitle}>{session.title}</Text>
              {session.subtitle && (
                <Text style={styles.previewSubtitle}>{session.subtitle}</Text>
              )}
              <Text style={styles.previewThemeLabel}>Workshop Theme</Text>
              <Text style={styles.previewTheme} numberOfLines={1}>
                {session.theme}
              </Text>
              <Text style={styles.previewOverviewLabel}>Brief Overview</Text>
              <Text style={styles.previewOverviewText} numberOfLines={3}>
                {session.overview}
              </Text>
              <Text style={styles.previewHighlightLabel}>Key Highlights</Text>
            </View>
            <Text style={styles.moreDetailsText}>Click this for more details</Text>
          </TouchableOpacity>

          {/* My Actions Section */}
          <View style={styles.actionsSection}>
            <Text style={styles.actionsSectionTitle}>My Actions</Text>
            
            {/* Live Q&A Button */}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={onLiveQA}
              activeOpacity={0.8}
            >
              <View style={styles.actionButtonContent}>
                <View style={styles.actionIconContainer}>
                  <InformationIcon size={24} color={colors.black} />
                </View>
                <Text style={styles.actionButtonText}>Live Q&A</Text>
                <CardRightArrowIcon size={20} color={colors.black} />
              </View>
            </TouchableOpacity>

            {/* My Session Notes Button */}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={onSessionNotes}
              activeOpacity={0.8}
            >
              <View style={styles.actionButtonContent}>
                <View style={styles.actionIconContainer}>
                  <DownloadIcon size={24} color={colors.black} />
                </View>
                <Text style={styles.actionButtonText}>My Session Notes</Text>
                <CardRightArrowIcon size={20} color={colors.black} />
              </View>
            </TouchableOpacity>

            {/* Handouts Button */}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={onHandouts}
              activeOpacity={0.8}
            >
              <View style={styles.actionButtonContent}>
                <View style={styles.actionIconContainer}>
                  <DownloadIcon size={24} color={colors.black} />
                </View>
                <Text style={styles.actionButtonText}>Handouts</Text>
                <CardRightArrowIcon size={20} color={colors.black} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar - Remove from My Conference */}
      <View style={styles.bottomActionBar}>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={onRemoveFromConference}
        >
          <Text style={styles.removeButtonText}>Remove from My Conference</Text>
        </TouchableOpacity>
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
    paddingBottom: 100,
  },
  metadataBackground: {
    backgroundColor: colors.primary,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    overflow: 'hidden',
  },
  metadataWaveImage: {
    opacity: 0.2,
    resizeMode: 'cover',
  },
  metadataCard: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    borderRadius: borderRadius.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    gap: spacing.md,
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
    color: colors.black,
  },
  contentContainer: {
    padding: spacing.lg,
  },
  sessionTitle: {
    fontSize: screenWidth * 0.055,
    fontFamily: Fonts.Bold,
    color: colors.black,
    marginBottom: spacing.xs,
  },
  sessionSubtitle: {
    fontSize: screenWidth * 0.04,
    fontFamily: Fonts.Regular,
    color: colors.black,
    marginBottom: spacing.lg,
  },
  themeContainer: {
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    fontSize: screenWidth * 0.04,
    fontFamily: Fonts.Bold,
    color: colors.black,
    marginBottom: spacing.sm,
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
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  previewImage: {
    backgroundColor: colors.lightGray,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.gray,
  },
  previewTitle: {
    fontSize: screenWidth * 0.035,
    fontFamily: Fonts.Bold,
    color: colors.black,
    marginBottom: spacing.xs,
  },
  previewSubtitle: {
    fontSize: screenWidth * 0.028,
    fontFamily: Fonts.Regular,
    color: colors.black,
    marginBottom: spacing.sm,
  },
  previewThemeLabel: {
    fontSize: screenWidth * 0.03,
    fontFamily: Fonts.Bold,
    color: colors.black,
    marginTop: spacing.sm,
  },
  previewTheme: {
    fontSize: screenWidth * 0.028,
    fontFamily: Fonts.Regular,
    color: colors.black,
    marginBottom: spacing.sm,
  },
  previewOverviewLabel: {
    fontSize: screenWidth * 0.03,
    fontFamily: Fonts.Bold,
    color: colors.black,
    marginTop: spacing.sm,
  },
  previewOverviewText: {
    fontSize: screenWidth * 0.026,
    fontFamily: Fonts.Regular,
    color: colors.black,
    marginTop: spacing.xs,
  },
  previewHighlightLabel: {
    fontSize: screenWidth * 0.03,
    fontFamily: Fonts.Bold,
    color: colors.black,
    marginTop: spacing.sm,
  },
  moreDetailsText: {
    fontSize: screenWidth * 0.033,
    fontFamily: Fonts.Regular,
    color: colors.blue,
    textAlign: 'center',
    marginTop: spacing.sm,
    textDecorationLine: 'underline',
  },
  actionsSection: {
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  actionsSectionTitle: {
    fontSize: screenWidth * 0.042,
    fontFamily: Fonts.Bold,
    color: colors.black,
    marginBottom: spacing.md,
  },
  actionButton: {
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  actionButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionIconContainer: {
    marginRight: spacing.md,
  },
  actionButtonText: {
    flex: 1,
    fontSize: screenWidth * 0.04,
    fontFamily: Fonts.Medium,
    color: colors.black,
  },
  bottomActionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.primaryLight,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  removeButton: {
    width: '100%',
  },
  removeButtonText: {
    fontSize: screenWidth * 0.04,
    fontFamily: Fonts.Bold,
    color: colors.red,
    textAlign: 'center',
  },
});

export default MyConferenceSession;

