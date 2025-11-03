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
  MapWIcon, TimeWIcon, WorkshopIcon, InformationIcon, DownloadIcon, CardRightArrowIcon } from '../../components/icons';
import globalStyles, { colors, spacing, borderRadius, Fonts } from '../../styles/globalStyles';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface ConferenceSessionDetailsProps {
  onBack: () => void;
  onNavigateToHome: () => void;
  sessionData?: SessionData;
  onAddToMyConference?: (sessionId: string) => void;
  onRemoveFromMyConference?: (sessionId: string) => void;
  isInMyConference?: boolean;
  isFromMyConference?: boolean; // New prop to indicate if accessed from MyConference
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
  subtitle: string;
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
  isFromMyConference = false,
  onLiveQA,
  onSessionNotes,
  onHandouts,
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
        title={isFromMyConference ? "My Conference Session" : "Session Details"}
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
          <View style={globalStyles.metadataCard}>
          {/* Date */}
          <View style={globalStyles.metadataRow}>
            <View style={globalStyles.iconContainer}>
            <CalendarIconYellow size={20} color={colors.primaryLight} />
            </View>
            <Text style={globalStyles.dateText}>{session.date}</Text>
          </View>

          {/* Location, Time, and Workshop */}
          <View style={globalStyles.metadataInfoRow}>
            <View style={globalStyles.metadataInfoItem}>
              <MapWIcon size={20} color={colors.primaryLight} />
              <Text style={globalStyles.metadataText}>{session.location}</Text>
            </View>
            <View style={globalStyles.metadataInfoItem}>
              <TimeWIcon size={20} color={colors.primaryLight} />
              <Text style={globalStyles.metadataText}>{session.time}</Text>
            </View>
            {session.workshopNumber && (
              <View style={globalStyles.metadataInfoItem}>
                <WorkshopIcon size={20} color={colors.primaryLight} />
                <Text style={globalStyles.metadataText}>{session.workshopNumber}</Text>
              </View>
            )}
          </View>
        </View>
        </ImageBackground>

        {/* Session Content */}
        <View style={globalStyles.contentContainer}>
          {/* Title */}
          <Text style={globalStyles.sessionTitle}>{session.title}</Text>
          <Text style={globalStyles.sessionSubtitle}>{session.subtitle}</Text>
        

          {/* Workshop Theme */}
          <View style={globalStyles.themeContainer}>
            <Text style={globalStyles.sectionLabel}>Workshop Theme</Text>
            <Text style={globalStyles.themeText}>{session.theme}</Text>
          </View>

          {/* Brief Overview */}
          <View style={globalStyles.overviewContainer}>
            <Text style={globalStyles.sectionLabel}>Brief Overview:</Text>
            <Text style={globalStyles.overviewText}>{session.overview}</Text>
          </View>

          {/* Embedded Preview Image */}
          <TouchableOpacity
            style={globalStyles.imageContainer}
            onPress={handleMoreDetails}
            activeOpacity={0.7}
          >
            <Image source={require('../../assets/images/pdfscreen.jpg')} style={globalStyles.previewImage} />
         
            <Text style={globalStyles.moreDetailsText}>Click this for more details</Text>
          </TouchableOpacity>

          {/* My Actions Section - Only show when accessed from MyConference */}
          {isFromMyConference && (
            <View style={globalStyles.actionsSection}>
              <Text style={globalStyles.actionsSectionTitle}>My Actions</Text>
              
              {/* Live Q&A Button */}
              <TouchableOpacity
                style={globalStyles.actionButton}
                onPress={onLiveQA || (() => console.log('Live Q&A'))}
                activeOpacity={0.8}
              >
                <View style={globalStyles.actionButtonContent}>
                  <View style={globalStyles.actionIconContainer}>
                    <InformationIcon size={24} />
                  </View>
                  <Text style={globalStyles.actionButtonText}>Live Q&A</Text>
                  <CardRightArrowIcon size={20} color={colors.black} />
                </View>
              </TouchableOpacity>

              {/* My Session Notes Button */}
              <TouchableOpacity
                style={globalStyles.actionButton}
                onPress={onSessionNotes || (() => console.log('Session Notes'))}
                activeOpacity={0.8}
              >
                <View style={globalStyles.actionButtonContent}>
                  <View style={globalStyles.actionIconContainer}>
                    <DownloadIcon size={24} color={colors.black} />
                  </View>
                  <Text style={globalStyles.actionButtonText}>My Session Notes</Text>
                  <CardRightArrowIcon size={20} color={colors.black} />
                </View>
              </TouchableOpacity>

              {/* Handouts Button */}
              <TouchableOpacity
                style={globalStyles.actionButton}
                onPress={onHandouts || (() => console.log('Handouts'))}
                activeOpacity={0.8}
              >
                <View style={globalStyles.actionButtonContent}>
                  <View style={globalStyles.actionIconContainer}>
                    <DownloadIcon size={24} color={colors.black} />
                  </View>
                  <Text style={globalStyles.actionButtonText}>Handouts</Text>
                  <CardRightArrowIcon size={20} color={colors.black} />
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={globalStyles.bottomActionBar}>
        {isFromMyConference ? (
          // When from MyConference, show Remove button
          <TouchableOpacity
            style={globalStyles.removeButton}
            onPress={handleRemoveFromConference}
          >
            <Text style={globalStyles.removeButtonText}>Remove from My Conference</Text>
          </TouchableOpacity>
        ) : (
          // When from ConferenceList, show Add/Remove toggle
          <>
            <TouchableOpacity
              style={globalStyles.addButtonContainer}
              onPress={!isAdded ? handleAddToConference : undefined}
              disabled={isAdded}
            >
              <Text style={globalStyles.addButtonText}>Add to my Conference</Text>
            </TouchableOpacity>
            {isAdded && (
              <View style={globalStyles.statusContainer}>
                <View style={globalStyles.checkmarkIcon}>
                  <SuccessIcon size={20} color={colors.white} />
                </View>
                <TouchableOpacity onPress={handleRemoveFromConference}>
                  <Text style={globalStyles.removeText}>X Remove</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
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
 
});

export default ConferenceSessionDetails;

