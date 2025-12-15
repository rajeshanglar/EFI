import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Animated,
  ImageBackground,
  Linking,
  Alert,
} from 'react-native';
import { colors, spacing, borderRadius, Fonts } from '../styles/globalStyles';
import {
  HomeIcon,
  AboutUsIcon,
  BoardIcon,
  TrainingIcon,
  OutreachIcon,
  SurgeryIcon,
  CongressIcon,
  RunIcon,
  MembershipIcon,
  BlogIcon,
  MediaIcon,
  DonationsIcon,
  ContactIcon,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  YoutubeIcon,
  AbstractIcon,
  WhiteUserIcon,
  WhiteLoginIcon,
  WhiteCloseIcon,
  PrivacySettingsIcon,
  MyConferenceIcon,
  DigitalPostersIcon,
  KeynoteSpeakersIcon,
  DelegateListIcon,
  MyAbstractsIcon,
  FundraisingIcon,
  ProfileIcon,
} from '../components/icons';
import { ConferenceAccess } from './conference-access-items';
import { Screen } from 'react-native-screens';
import { useAuth } from '../contexts/AuthContext';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface MenuItem {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
}

interface SocialIconConfig {
  id: string;
  icon: React.ComponentType<any>;
  url: string;
}

interface SlideOutMenuProps {
  isVisible: boolean;
  onClose: () => void;
  onMenuItemPress: (itemId: string) => void;
  onLogout?: () => void;
  onLoginPress?: () => void;
  onProfilePress?: () => void;
  isAuthenticated?: boolean; // Add auth status
  socialIcons?: SocialIconConfig[]; // Optional: override default social icons
}

const conferenceAccessItems = [
  { id: 'privacy', title: 'Privacy Settings', icon: PrivacySettingsIcon },
  { id: 'myConference', title: 'My\nConference', icon: MyConferenceIcon },
  { id: 'posters', title: 'Digital\nPosters', icon: DigitalPostersIcon },
  { id: 'speakers', title: 'Keynote\nSpeakers', icon: KeynoteSpeakersIcon },
  { id: 'delegates', title: 'Delegate\nList', icon: DelegateListIcon },
  { id: 'abstracts', title: 'My\nAbstracts', icon: MyAbstractsIcon },
];

const menuItems: MenuItem[] = [
  // { id: 'home', title: 'Home', icon: HomeIcon },
  // { id: 'profile', title: 'Profile', icon: ProfileIcon },
  { id: 'about', title: 'About us', icon: AboutUsIcon },
  { id: 'board', title: 'Board', icon: BoardIcon },
  { id: 'information', title: 'Information', icon: AboutUsIcon },
  { id: 'training', title: 'EFI Training\nPrograms', icon: TrainingIcon },
  { id: 'outreach', title: 'EFI Outreach\nPrograms', icon: OutreachIcon },
  { id: 'surgery', title: 'Free Surgery Program', icon: SurgeryIcon },
  { id: 'sponsorPatient', title: 'Sponsor Patient', icon: FundraisingIcon },
  { id: 'congress', title: 'Endo Congress', icon: CongressIcon },
  { id: 'run', title: 'Yellow Ribbon Run', icon: RunIcon },
  { id: 'membership', title: 'Membership', icon: MembershipIcon },
  { id: 'blogs', title: 'Blogs', icon: BlogIcon },
  { id: 'media', title: 'Media', icon: MediaIcon },
  { id: 'donations', title: 'Donations and Fundraising', icon: DonationsIcon },
  { id: 'contact', title: 'Contact Us', icon: ContactIcon },
];

// Default social icons configuration
// You can override these by passing socialIcons prop to SlideOutMenu
const defaultSocialIcons: SocialIconConfig[] = [
  { 
    id: 'facebook', 
    icon: FacebookIcon, 
    url: 'https://www.facebook.com/endofoundindia#' // Replace with your Facebook page URL
  },
  { 
    id: 'instagram', 
    icon: TwitterIcon, 
    url: 'https://www.instagram.com/endofoundindia/?igshid=YmMyMTA2M2Y%3D' // Replace with your Twitter handle URL
  },
  { 
    id: 'linkedin', 
    icon: LinkedinIcon, 
    url: 'https://www.linkedin.com/uas/login?session_redirect=https%3A%2F%2Fwww.linkedin.com%2Fcompany%2Fendometriosis-foundation-india%2Fabout%2F' // Replace with your LinkedIn page URL
  },
  { 
    id: 'youtube', 
    icon: YoutubeIcon, 
    url: 'https://www.youtube.com/@EndometriosisFoundationofIndia' // Replace with your YouTube channel URL
  },
];

const SlideOutMenu: React.FC<SlideOutMenuProps> = ({
  isVisible,
  onClose,
  onMenuItemPress,
  onLogout,
  onLoginPress,
  onProfilePress,
  isAuthenticated = false, // Default to false if not provided
  socialIcons = defaultSocialIcons, // Use provided social icons or default
}) => {
  const { user } = useAuth();
  const translateX = useRef(new Animated.Value(screenWidth)).current; // start off-screen right

  // Check if user has conference registrations
  const hasConference = isAuthenticated && user?.linked_registrations?.conference && 
    Array.isArray(user.linked_registrations.conference) && 
    user.linked_registrations.conference.length > 0;

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: isVisible ? 0 : screenWidth, // slide in/out from right
      duration: 300,
      easing: undefined,
      useNativeDriver: true,
    }).start();
  }, [isVisible]);

  const animatedStyle = {
    transform: [{ translateX }],
  };

  const handleMenuItemPress = (itemId: string) => {
    onMenuItemPress(itemId);
  };

  const handleSocialIconPress = async (url: string, platform: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', `Cannot open ${platform} link. Please check the URL.`);
      }
    } catch (error) {
      console.error(`Error opening ${platform} link:`, error);
      Alert.alert('Error', `Failed to open ${platform} link.`);
    }
  };

  const renderMenuItem = (item: MenuItem) => {
    const IconComponent = item.icon;
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.menuItem}
        onPress={() => handleMenuItemPress(item.id)}
      >
        <View style={styles.menuIconContainer}>
          <View style={styles.menuIconStyle}>
            <IconComponent size={28} color={colors.primary} />
          </View>
        </View>
        <Text style={styles.menuItemText}>{item.title}</Text>
      </TouchableOpacity>
    );
  };

  const renderConferenceItem = (item: any) => {
    const IconComponent = item.icon;
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.conferenceItem}
        onPress={() => handleMenuItemPress(item.id)}
      >
        <View style={styles.conferenceIconStyle}>
          <View style={styles.conferenceIconContainer}>
            <IconComponent size={25} color={colors.primaryLight} />
          </View>
        </View>
        <Text style={styles.conferenceItemText}>{item.title}</Text>
      </TouchableOpacity>
    );
  };

  const openLink = (url: string) => {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={styles.sidebar}>

        <View style={styles.leftSectionContainer}>
          {isAuthenticated && (
            <TouchableOpacity 
              style={styles.leftSection}
              onPress={() => {
                onProfilePress?.();
                onClose();
              }}>
              <View style={styles.leftIcon}>
                <WhiteUserIcon size={22} color={colors.white} />
              </View>
              <Text style={styles.leftIconText}>PROFILE</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={styles.leftSection}
            onPress={() => {
              if (isAuthenticated && onLogout) {
                // User is logged in, call logout
                onLogout();
                onClose();
              } else {
                // User is not logged in, go to login page
                onLoginPress?.();
                onClose();
              }
            }}
          >
            <View style={styles.leftIcon}>
              <WhiteLoginIcon size={20} color={colors.white} />
            </View>
            <Text style={styles.leftIconText}>{isAuthenticated ? 'LOGOUT' : 'LOGIN'}</Text>
          </TouchableOpacity>
        </View>

        {/* <View style={styles.socialSection}>
          {socialIcons.map(({ id, icon: Icon, url }) => (
            <TouchableOpacity 
              key={id} 
              style={styles.socialIcon}
              onPress={() => handleSocialIconPress(url, id)}
            >
              <Icon size={20} color={colors.white} />
            </TouchableOpacity>
          ))}
        </View> */}
        <View style={styles.socialSection}>
  {defaultSocialIcons.map(({ id, icon: Icon, url }) => (
    <TouchableOpacity key={id} onPress={() => openLink(url)} style={styles.socialIcon}>
      <Icon size={22} color="white" />
    </TouchableOpacity>
  ))}
</View>
      </View>

      <View style={styles.mainContent}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <WhiteCloseIcon size={12} color="white" />
        </TouchableOpacity>

        <ImageBackground
          source={require('../assets/images/ribbon-color-img.png')}
          style={styles.bgColor}
          imageStyle={styles.bgImage}
        >
          <ScrollView
            style={styles.menuContainer}
            showsVerticalScrollIndicator={false}
          >
           {hasConference && (
             <ConferenceAccess
                styles={styles}
                conferenceAccessItems={conferenceAccessItems}
                renderConferenceItem={renderConferenceItem}
              />
           )}
            <View style={styles.menuGrid}>{menuItems.map(renderMenuItem)}</View>
          </ScrollView>
        </ImageBackground>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0, // ✅ positioned on the right
    width: '100%',
    flexDirection: 'row', // ✅ sidebar stays on the right edge
    zIndex: 10000,
  },
  sidebar: {
    width: 60,
    backgroundColor: '#184DAA',
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mainContent: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.md,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 8, // ✅ moved to left since menu slides from right
    width: 26,
    height: 26,
    borderRadius: 20,
    backgroundColor: '#6C7FA2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bgColor: { flex: 1 },
  bgImage: {
    marginTop: '25%',
    width: Dimensions.get('window').width * 1.2,
    height: Dimensions.get('window').height * 0.48,
    resizeMode: 'cover',
    opacity: 0.15,
  },
  leftSectionContainer: { alignItems: 'center', gap: spacing.sm },
  leftSection: { alignItems: 'center', marginBottom: spacing.lg },
  leftIcon: {
    width: 40,
    height: 40,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  leftIconText: { color: colors.white, fontSize: 10, fontWeight: 'bold' },
  socialSection: { alignItems: 'center', gap: spacing.md },
  socialIcon: { padding: spacing.sm },
  menuContainer: { flex: 1 },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Dimensions.get('window').width * 0.05,
    paddingTop: 20,
    paddingBottom: 90,
  },
  menuItem: {
    alignItems: 'center',
    marginBottom: spacing.sm,
    width: Dimensions.get('window').width * 0.20,
  },
  menuIconContainer: {
    backgroundColor: 'rgba(249,222,71,0.2)',
    width:screenWidth * 0.16,
    height: screenWidth * 0.16,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIconStyle: {
    width: screenWidth * 0.14,
    height: screenWidth * 0.14,
    borderRadius: 100,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemText: {
    color: colors.white,
    fontSize: Dimensions.get('window').width * 0.03,
    textAlign: 'center',
    fontFamily: Fonts.Medium,
  },
  conferenceItem: {
    alignItems: 'center',
    marginBottom: spacing.sm,
    width: Dimensions.get('window').width * 0.22,
  },

  conferenceIconStyle: {
    backgroundColor: 'rgba(93, 92, 91, 0.36)',
    width: screenWidth * 0.15,
    height: screenWidth * 0.15,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Dimensions.get('window').width * 0.012,
  },

  conferenceIconContainer: {
    width: screenWidth * 0.14,
    height: screenWidth * 0.14,
    borderRadius: 100,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  conferenceItemText: {
    color: colors.primary,
    fontSize: Dimensions.get('window').width * 0.028,
    textAlign: 'center',
    fontFamily: Fonts.Medium,
  },
});

export default SlideOutMenu;
