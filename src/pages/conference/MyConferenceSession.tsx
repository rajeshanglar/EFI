import React from 'react';
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
import Header from '../../components/Header';
import { SuccessIcon, CardRightArrowIcon, InformationIcon, DownloadIcon,
  LiveIcon, NotesIcon, HandoutsIcon, CalendarIconYellow, MapWIcon, TimeWIcon, WorkshopIcon } from '../../components/icons';
import globalStyles, { colors, spacing, borderRadius, Fonts } from '../../styles/globalStyles';

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
        onMenuItemPress={(id: any) => console.log('Menu:', id)}
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
          {session.subtitle && (
            <Text style={globalStyles.sessionSubtitle}>{session.subtitle}</Text>
          )}

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

          {/* My Actions Section */}
          <View style={globalStyles.actionsSection}>
            <Text style={globalStyles.actionsSectionTitle}>My Actions</Text>
            
            {/* Live Q&A Button */}
            <TouchableOpacity
              style={globalStyles.actionButton}
              onPress={onLiveQA}
              activeOpacity={0.8}
            >
              <View style={globalStyles.actionButtonContent}>
               
                  <LiveIcon size={24} color={colors.black} />
                
                <Text style={globalStyles.actionButtonText}>Live Q&A</Text>
                <CardRightArrowIcon size={20} color={colors.black} />
              </View>
            </TouchableOpacity>

            {/* My Session Notes Button */}
            <TouchableOpacity
              style={globalStyles.actionButton}
              onPress={onSessionNotes}
              activeOpacity={0.8}
            >
              <View style={globalStyles.actionButtonContent}>               
                  <NotesIcon size={24} color={colors.black} />             
                <Text style={globalStyles.actionButtonText}>My Session Notes</Text>
                <CardRightArrowIcon size={20} color={colors.black} />
              </View>
            </TouchableOpacity>

            {/* Handouts Button */}
            <TouchableOpacity
              style={globalStyles.actionButton}
              onPress={onHandouts}
              activeOpacity={0.8}
            >
              <View style={globalStyles.actionButtonContent}>              
                  <HandoutsIcon size={24} color={colors.black} />              
                <Text style={globalStyles.actionButtonText}>Handouts</Text>
                <CardRightArrowIcon size={20} color={colors.black} />
              </View>
            </TouchableOpacity>
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
    paddingBottom: 100,
  },

  
});

export default MyConferenceSession;

