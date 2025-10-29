import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  Image,
  Touchable,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { globalStyles, colors, spacing, borderRadius, typography, Fonts } from '../../styles/globalStyles';
import { ActionButton, Card, } from '.';
import { NotificationBadge } from '../../components/NotificationBadge';
import SlideOutMenu from '../../components/SlideOutMenu';
import LanguageSelector from '../../components/LanguageSelector';  

import { 
AbstractIcon,
ArrowRightIcon,
MyCardsIcon,
MembershipIcon,
TrainingIcon,
CongressIcon,
FundraisingIcon,
JoinCauseIcon,
PartnershipsIcon,
UserIcon,
MenuIcon,
NotificationIcon,
WhiteMyCardsIcon,
ArrowLeftIconYellow }
 from '../../components/icons';
import EfiBoard from '../../components/EfiBoard';
import GradientButton from '../../components/GradientButton';
import { transparent } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';
const { width: screenWidth } = Dimensions.get('window');

interface HomePageProps {
  onNavigateToConference?: () => void;
  onLogout?: () => void;
  onNavigateToLogin?: () => void;
  onNavigateToMyConference?: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigateToConference, onLogout, onNavigateToLogin, onNavigateToMyConference }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const actionButtons = [
    { title: 'Membership Registration', icon: MembershipIcon, onPress: () => console.log('Membership') },
    { title: 'Training\nSession', icon: TrainingIcon, onPress: () => console.log('Training') },
    { title: 'Conference Registration', icon: CongressIcon, onPress: () => onNavigateToConference?.() || console.log('Conference') },
    { title: 'Donations And Fundraising', icon: FundraisingIcon, onPress: () => console.log('Donations') },
    { title: 'Join\nThe Cause', icon: JoinCauseIcon, onPress: () => console.log('Join Cause') },
    { title: 'Explore Corporate Partnerships', icon: PartnershipsIcon, onPress: () => console.log('Partnerships') },
  ];
  


  const handleMenuItemPress = (itemId: string) => {
    console.log('Menu item pressed:', itemId);
    // Handle navigation here
    if (itemId === 'conference') {
      // Navigate to My Conference page when "My Conference" is clicked from Conference Access menu
      if (onNavigateToMyConference) {
        onNavigateToMyConference();
        setIsMenuVisible(false);
      }
    }
  };

  return (
    // <SafeAreaView style={globalStyles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          {/* <View style={styles.headerLeft}>
            <View style={styles.userIconContainer}>
              <UserIcon size={22} color={colors.white} />
            </View> 
            <Text style={styles.greetingText}>Hello, Hitesh...</Text> 
          </View> */}

          <View style={styles.headerLeft}>
          <Image source={require('../../assets/images/logo-w.png')} style={styles.logoHome} />
          </View>
          
          <View style={styles.headerRight}>
                <NotificationBadge count={0} />
            
            <LanguageSelector 
              onLanguageChange={(language) => console.log('Language changed to:', language)}
              initialLanguage="en"
            />

            <TouchableOpacity onPress={() => setIsMenuVisible(true)}>
              <MenuIcon size={32} color={colors.white} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={globalStyles.scrollViewContent} showsVerticalScrollIndicator={true}>
        <View style={globalStyles.spaceBottom}>


            {/* Action Grid */}
            <View style={styles.actionGridContent}>
            <ImageBackground
      source={require('../../assets/images/wave-img.png')  }
      style={styles.waveBgColor}
      imageStyle={styles.waveBgImage}
    >
      <View style={styles.actionGrid}>
              {actionButtons.map((button, index) => (
                <ActionButton
                  key={index}
                  title={button.title}
                  icon={button.icon}
                  onPress={button.onPress}
                  style={styles.actionButton}
                  iconStyle={styles.iconStyle}
                  textStyle={styles.actionButtonText}
                  iconContainer={styles.iconContainer}
                />
              ))}
              </View>
            </ImageBackground>  
            </View>


            {/* Congress Banner */}
            <Card style={styles.congressCard}>
                <Image source={require('../../assets/images/conference-banner.jpg')} style={styles.conferenceImage} />
            </Card>

            <View style={styles.horizontalMargin}>
              <EfiBoard />

                {/* Submit Abstract Card */}
                <TouchableOpacity style={styles.submitAbstractCard}>
                  <View style={styles.abstractContent}>                
                      <AbstractIcon size={40} color={colors.white} />              
                    
                    <View style={styles.abstractTextContainer}>
                      <View style={styles.abstractArrowContainer}>
                          <Text style={styles.abstractTitle}>Submit Abstract</Text>
                          <View style={styles.arrowRounded}>
                            <ArrowRightIcon size={13} color={colors.primaryLight}  />
                          </View>
                      </View>
                    
                      <Text style={styles.abstractSubtitle}>Your Research Deserves A Global Platform</Text>
                    </View>
                  </View>
                </TouchableOpacity>

                {/* Training Session Card */}
                <Card style={styles.trainingSessionCard}>
                  <View style={styles.trainingContent}>
                    <View style={styles.trainingTextContainer}>
                      <Text style={styles.trainingTitle}>Training Session</Text>
                      <Text style={styles.trainingTopic}>Topic: Advances in Diabetes Management</Text>
                      <TouchableOpacity style={styles.trainingButton}>
                        <Text style={styles.trainingButtonText}>More Details</Text>
                        <ArrowLeftIconYellow size={13} style={{transform: [{ rotate: '180deg' }],}}  />
                      </TouchableOpacity>
                    </View>                
                  
                  </View>
                </Card>
            </View>
          </View>
        </ScrollView>

            {/* Bottom Navigation */}

      <View style={globalStyles.footerBtContainer}>
        <GradientButton
          title="MY CARDS"
          onPress={() => console.log('Submit')}
       icon={<WhiteMyCardsIcon size={26} color={colors.white} style={globalStyles.footerBtIcon} />}
        />
      </View>
      
            {/* <View style={globalStyles.footerContainer}>
              <View style={globalStyles.bottomNav}>
            <LinearGradient
              colors={[colors.blue, colors.primaryLight]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={globalStyles.bottomNav}
            >
              <TouchableOpacity style={globalStyles.bottomNavButton}>
                <WhiteMyCardsIcon size={24} color={colors.white} />
                <Text style={globalStyles.bottomNavText}>MY CARDS</Text>
              </TouchableOpacity>
            </LinearGradient>
            </View>
          </View> */}

          {/* Slide Out Menu - moved outside footer container */}
      <SlideOutMenu
        isVisible={isMenuVisible}
        onClose={() => setIsMenuVisible(false)}
        onMenuItemPress={handleMenuItemPress}
        onLogout={onLogout}
        onLoginPress={onNavigateToLogin}
      />
      </View>

      
    // </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,

  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primary,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  logoHome: {
    width: Dimensions.get('window').width * 0.34,
    height: Dimensions.get('window').width * 0.1,
    resizeMode: 'contain',
  },

  userIconContainer: {
    width:38,
    height:38,
    borderRadius: 40,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,

  },
  greetingText: {
    color: colors.white,
    fontSize:Dimensions.get('window').width * 0.04,
    fontWeight: '500',
   
  },

  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
 
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  languageButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  languageText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },

  waveBgColor: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  waveBgImage: {   
    width: Dimensions.get('window').width * 1,
    height: Dimensions.get('window').height * 0.34,
    resizeMode: 'cover',
    opacity:0.3,
  },

  actionGridContent: {
    backgroundColor: colors.primary,

    paddingTop: 20,
    paddingBottom:90,
    borderBottomEndRadius:25,
    borderBottomStartRadius:25,
    overflow: 'hidden',
  },

  actionGrid: {
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  actionButton: {
    alignItems: 'center',
    marginBottom: spacing.md,
    width: Dimensions.get('window').width * 0.29,
  },
  iconContainer: {    
    backgroundColor: 'rgba(249, 222, 71, 0.2)',
    width: 70,
    height:70,
    borderRadius: 100,
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

  iconStyle:{
    width: 60,
    height:60,
    borderRadius: 100,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },

  actionButtonText: {
    color: colors.white,
    fontSize:Dimensions.get('window').width * 0.031,
    textAlign: 'center',
    fontWeight: '400',
    paddingHorizontal: spacing.xs,
    marginTop: spacing.xs,
    lineHeight: Dimensions.get('window').width * 0.04,
  },

  congressCard: {
    backgroundColor: colors.primaryLight,
    marginHorizontal: spacing.md,
    marginTop: -87,
    overflow: 'hidden',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding:0,
    borderRadius: borderRadius.sm,
  },
  conferenceImage: {
    width: Dimensions.get('window').width * 0.93,
    height: Dimensions.get('window').height * 0.17,
  
   
  },

  horizontalMargin:{
    paddingHorizontal: spacing.md,
    width: Dimensions.get('window').width * 0.99,
  
  },
  // Submit Abstract Card Styles
  submitAbstractCard: {
    backgroundColor: colors.primary,  
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
    borderRadius: 100,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    marginHorizontal:0,
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  abstractContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  abstractTextContainer: {
    marginLeft: spacing.sm,
  },
  abstractArrowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
   
  },
  abstractTitle: {
    color: colors.white,
    fontSize: Dimensions.get('window').width * 0.038,  
    fontWeight:700, 
    marginBottom: spacing.xs,
  },
  abstractSubtitle: {
    color: colors.white,
    fontSize: Dimensions.get('window').width * 0.032,  
    opacity: 0.9,
    fontWeight:600, 
  },

  
  arrowRounded:{
    backgroundColor: colors.primaryLight,
    borderRadius: 100,
    width:20,
    height:20,
    justifyContent: 'center',
    alignItems: 'center',
    padding:2,
    marginLeft: spacing.sm,
  },

  // Training Session Card Styles
  trainingSessionCard: {
    marginHorizontal:0,
    width:'100%',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    position: 'relative',
    overflow: 'hidden',
  },
  trainingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    zIndex: 2,
  },
  trainingTextContainer: {
    flex: 1,
  },
  trainingTitle: {
    color: colors.white,
    fontSize: Dimensions.get('window').width * 0.038,  
   fontFamily: Fonts.Bold,
    marginBottom:0,
  },
  trainingTopic: {
    color: colors.white,
    fontSize: Dimensions.get('window').width * 0.032,  
    fontFamily: Fonts.Medium, 
    marginBottom:0,
  },
  trainingButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  trainingButtonText: {
    color: colors.primaryLight,
    fontSize: Dimensions.get('window').width * 0.032, 
    fontFamily: Fonts.Medium, 
  },
  trainingDecorations: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  topDecoration: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 30,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
  },
  bottomDecoration: {
    position: 'absolute',
    bottom: -10,
    right: -20,
    width: 80,
    height: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 40,
    transform: [{ rotate: '15deg' }],
  },

});

export default HomePage;
