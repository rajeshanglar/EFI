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
} from '../components/icons';
import { ConferenceAccess } from './conference-access-items';

const { width: screenWidth } = Dimensions.get('window');

interface MenuItem {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
}

interface SlideOutMenuProps {
  isVisible: boolean;
  onClose: () => void;
  onMenuItemPress: (itemId: string) => void;
  onLogout?: () => void;
  onLoginPress?: () => void;
}

const conferenceAccessItems = [
  { id: 'privacy', title: 'Privacy Settings', icon: PrivacySettingsIcon },
  { id: 'conference', title: 'My\nConference', icon: MyConferenceIcon },
  { id: 'posters', title: 'Digital\nPosters', icon: DigitalPostersIcon },
  { id: 'speakers', title: 'Keynote\nSpeakers', icon: KeynoteSpeakersIcon },
  { id: 'delegates', title: 'Delegate\nList', icon: DelegateListIcon },
  { id: 'abstracts', title: 'My\nAbstracts', icon: MyAbstractsIcon },
];

const menuItems: MenuItem[] = [
  { id: 'home', title: 'Home', icon: HomeIcon },
  { id: 'about', title: 'About us', icon: AboutUsIcon },
  { id: 'board', title: 'Board', icon: BoardIcon },
  { id: 'information', title: 'Information', icon: AboutUsIcon },
  { id: 'training', title: 'EFI Training\nPrograms', icon: TrainingIcon },
  { id: 'outreach', title: 'EFI Outreach\nPrograms', icon: OutreachIcon },
  { id: 'surgery', title: 'Free Surgery Program', icon: SurgeryIcon },
  { id: 'congress', title: 'Endo Congress', icon: CongressIcon },
  { id: 'run', title: 'Yellow Ribbon Run', icon: RunIcon },
  { id: 'membership', title: 'Membership', icon: MembershipIcon },
  { id: 'blogs', title: 'Blogs', icon: BlogIcon },
  { id: 'media', title: 'Media', icon: MediaIcon },
  { id: 'donations', title: 'Donations and Fundraising', icon: DonationsIcon },
  { id: 'contact', title: 'Contact Us', icon: ContactIcon },
];

const socialIcons = [
  { id: 'facebook', icon: FacebookIcon },
  { id: 'twitter', icon: TwitterIcon },
  { id: 'linkedin', icon: LinkedinIcon },
  { id: 'youtube', icon: YoutubeIcon },
];

const SlideOutMenu: React.FC<SlideOutMenuProps> = ({
  isVisible,
  onClose,
  onMenuItemPress,
  onLogout,
  onLoginPress,
}) => {
  const translateX = useRef(new Animated.Value(screenWidth)).current; // start off-screen right

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

  if (!isVisible && translateX === screenWidth) {
    return null;
  }

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
            <IconComponent size={26} color={colors.primary} />
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
            <IconComponent size={20} color={colors.primaryLight} />
          </View>
        </View>
        <Text style={styles.conferenceItemText}>{item.title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={styles.sidebar}>
        <View style={styles.leftSectionContainer}>
          <View style={styles.leftSection}>
            <View style={styles.leftIcon}>
              <WhiteUserIcon size={20} color={colors.white} />
            </View>
            <Text style={styles.leftIconText}>PROFILE</Text>
          </View>

          <TouchableOpacity
            style={styles.leftSection}
            onPress={() => {
              onLoginPress?.();
              onClose();
            }}
          >
            <View style={styles.leftIcon}>
              <WhiteLoginIcon size={20} color={colors.white} />
            </View>
            <Text style={styles.leftIconText}>LOGIN</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.socialSection}>
          {socialIcons.map(({ id, icon: Icon }) => (
            <TouchableOpacity key={id} style={styles.socialIcon}>
              <Icon size={20} color={colors.white} />
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
            <ConferenceAccess
              styles={styles}
              conferenceAccessItems={conferenceAccessItems}
              renderConferenceItem={renderConferenceItem}
            />
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
    zIndex: 1000,
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
    gap: Dimensions.get('window').width * 0.03,
    paddingTop: 20,
    paddingBottom: 90,
  },
  menuItem: {
    alignItems: 'center',
    marginBottom: spacing.md,
    width: Dimensions.get('window').width * 0.22,
  },
  menuIconContainer: {
    backgroundColor: 'rgba(249,222,71,0.2)',
    width: 60,
    height: 60,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIconStyle: {
    width: 50,
    height: 50,
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
    marginBottom: spacing.md,
    width: Dimensions.get('window').width * 0.22,
  },

  conferenceIconStyle: {
    backgroundColor: 'rgba(93, 92, 91, 0.36)',

    width: 60,
    height: 60,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Dimensions.get('window').width * 0.012,
  },

  conferenceIconContainer: {
    width: 50,
    height: 50,
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
