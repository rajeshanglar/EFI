import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  ImageBackground,
  FlatList,
} from 'react-native';
import {
  globalStyles,
  colors,
  spacing,
  borderRadius,
  Fonts,
} from '../../styles/globalStyles';
import { ActionButton, Card } from '.';
import { NotificationBadge } from '../../components/NotificationBadge';
import { SharedMenu } from '../../components/SharedMenu';
import LanguageSelector from '../../components/LanguageSelector';
import Header from '../../components/Header';
import { useMenu } from '../../contexts/MenuContext';
import { useAuth } from '../../contexts/AuthContext';
import {
  AbstractIcon,
  ArrowRightIcon,
  MembershipIcon,
  TrainingIcon,
  CongressIcon,
  FundraisingIcon,
  JoinCauseIcon,
  PartnershipsIcon,
  MenuIcon,
  WhiteMyCardsIcon,
  ArrowLeftIconYellow,
  UserIcon,
} from '../../components/icons';
import EfiBoard from '../../components/EfiBoard';
import GradientButton from '../../components/GradientButton';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
interface HomePageProps {
  onNavigateToConference?: () => void;
  onLogout?: () => void;
  onNavigateToLogin?: () => void;
  onNavigateToMyConference?: () => void;
  onNavigateToTrainingPrograms?: () => void;
  onNavigateToMembership?: () => void;
  onNavigateToMembershipInfo?: () => void;
  onNavigateToMembershipExclusiveAccess?: () => void;
  onNavigateToBoard?: () => void;
  onNavigateToProfile?: () => void;
  onNavigateToMyCards?: () => void;
  onNavigateToConferenceDetails?: () => void;
  onNavigateToOutreachPrograms?: () => void;
  onNavigateToYellowRibbonRun?: () => void;
  onNavigateToAboutUs?: () => void;
  onNavigateToEndoCongress?: () => void;
  onNavigateToFreeSurgeryProgram?: () => void;
  onNavigateToContactUs?: () => void;
  onNavigateToInformation?: () => void;
  onNavigateToSubmitAbstract?: () => void;
  onNavigateToDonationsAndFundraising?: () => void;
}

// Conference Banner Data
interface ConferenceBanner {
  id: string;
  image: any;
  title?: string;
  subtitle?: string;
}

const conferenceBanners: ConferenceBanner[] = [
  {
    id: '1',
    image: require('../../assets/images/conference-banner.jpg'),
    
  },
  {
    id: '2',
    image: require('../../assets/images/conference-banner.jpg'),
   
  },
  {
    id: '3',
    image: require('../../assets/images/conference-banner.jpg'),
  
  },
];

const HomePage: React.FC<HomePageProps> = ({
  onNavigateToConference,
  onLogout,
  onNavigateToLogin,
  onNavigateToMyConference,
  onNavigateToTrainingPrograms,
  onNavigateToMembership,
  onNavigateToMembershipInfo,
  onNavigateToMembershipExclusiveAccess,
  onNavigateToBoard,
  onNavigateToProfile,
  onNavigateToMyCards,
  onNavigateToConferenceDetails,
  onNavigateToOutreachPrograms,
  onNavigateToYellowRibbonRun,
  onNavigateToAboutUs,
  onNavigateToEndoCongress,
  onNavigateToFreeSurgeryProgram,
  onNavigateToContactUs,
  onNavigateToInformation,
  onNavigateToSubmitAbstract,
  onNavigateToDonationsAndFundraising,
}) => {
  const { openMenu } = useMenu();
  const { user, isAuthenticated } = useAuth();
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const bannerFlatListRef = useRef<FlatList>(null);

  // Get registration_type from user data
  const registrationType = user?.registration_type || '';

  // Determine button titles and styles based on registration_type
  const membershipTitle = isAuthenticated && registrationType === 'membership' 
    ? 'Membership\nExclusive Access' 
    : 'Membership Registration';
  
  const conferenceTitle = isAuthenticated && (registrationType === 'conference' || registrationType === 'Conference')
    ? 'Conference'
    : 'Conference Registration';

  const actionButtons = [
    {
      title: membershipTitle,
      icon: MembershipIcon,
      // onPress: () => console.log('Membership'),
      onPress: () => {
        // If user has membership registration_type, navigate to Exclusive Access page
        if (isAuthenticated && registrationType === 'membership') {
          onNavigateToMembershipExclusiveAccess?.() || console.log('Membership Exclusive Access');
        } else {
          // Otherwise, navigate to membership registration form
          onNavigateToMembership?.() || console.log('Membership Registration');
        }
      },
      isSpecial: isAuthenticated && registrationType === 'membership', // Special styling only for membership users
    },
    {
      title: 'Training\nSession',
      icon: TrainingIcon,
      onPress: () => console.log('Training'),
      isSpecial: false,
    },
    {
      title: conferenceTitle,
      icon: CongressIcon,
      onPress: () => onNavigateToConference?.() || console.log('Conference'),
      isSpecial: isAuthenticated && (registrationType === 'conference' || registrationType === 'Conference'), // Special styling only for conference users
    },
    {
      title: 'Donations And Fundraising',
      icon: FundraisingIcon,
      onPress: () =>
        onNavigateToDonationsAndFundraising?.() || console.log('Donations'),
      isSpecial: false,
    },
    {
      title: 'Join\nThe Cause',
      icon: JoinCauseIcon,
      onPress: () => console.log('Join Cause'),
      isSpecial: false,
    },
    {
      title: 'Explore Corporate Partnerships',
      icon: PartnershipsIcon,
      onPress: () => console.log('Partnerships'),
      isSpecial: false,
    },
  ];


  return (
    
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {isAuthenticated && user ? (
            <TouchableOpacity style={styles.userIconDashHeader} onPress={() => onNavigateToProfile?.() || console.log('Profile')}>
              <View style={styles.userIconContainer}>
                <UserIcon size={24} color={colors.primary} />
              </View>
              <Text style={styles.greetingText}>
                Hello, {user?.first_name || user?.name || 'User'}
              </Text>
            </TouchableOpacity>
          ) : (
            <Image
              source={require('../../assets/images/logo-w.png')}
              style={styles.logoHome}
            />
          )}
        </View>
        <View style={styles.headerRight}>
          <NotificationBadge count={0} />
          <LanguageSelector
            onLanguageChange={language =>
              console.log('Language changed to:', language)
            }
            initialLanguage="en"
          />
          <TouchableOpacity onPress={openMenu}>
            <MenuIcon size={25} color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView
        style={globalStyles.scrollViewContent}
        showsVerticalScrollIndicator={true}
      >
        <View style={globalStyles.spaceBottom}>
          {/* Action Grid */}
          <View style={styles.actionGridContent}>
            <ImageBackground
              source={require('../../assets/images/wave-img.png')}
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
                    iconStyle={button.isSpecial ? styles.iconStyleSpecial : styles.iconStyle}
                    textStyle={styles.actionButtonText}
                    iconContainer={button.isSpecial ? styles.iconContainerSpecial : styles.iconContainer}
                    isSpecial={button.isSpecial}
                  />
                ))}
              </View>
            </ImageBackground>
          </View>

          {/* Conference Banner Swiper */}
          <View style={styles.congressCardContainer}>
            <FlatList
              ref={bannerFlatListRef}
              data={conferenceBanners}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.congressCard}
                  onPress={() => onNavigateToConferenceDetails?.() || console.log('Conference Details')}
                  activeOpacity={0.9}
                >
                  <Image
                    source={item.image}
                    style={styles.conferenceImage}
                    resizeMode="cover"
                  />
                  {/* {(item.title || item.subtitle) && (
                    <View style={styles.bannerOverlay}>
                      {item.title && (
                        <Text style={styles.bannerTitle}>{item.title}</Text>
                      )}
                      {item.subtitle && (
                        <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
                      )}
                    </View>
                  )} */}
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={(event) => {
                const contentOffsetX = event.nativeEvent.contentOffset.x;
                const cardWidth = screenWidth - spacing.md * 2;
                const index = Math.round(contentOffsetX / cardWidth);
                setCurrentBannerIndex(index);
              }}
              scrollEventThrottle={16}
              snapToInterval={screenWidth - spacing.md * 2}
              decelerationRate="fast"
            />
            {/* Pagination Dots */}
            {conferenceBanners.length > 1 && (
              <View style={styles.paginationContainer}>
                {conferenceBanners.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.paginationDot,
                      index === currentBannerIndex && styles.paginationDotActive,
                    ]}
                  />
                ))}
              </View>
            )}
          </View>
          
          <View style={styles.horizontalMargin}>
            <EfiBoard onViewAll={onNavigateToBoard} />
            <TouchableOpacity
              style={styles.submitAbstractCard}
              onPress={() =>
                onNavigateToSubmitAbstract?.() ||
                console.log('Submit Abstract')
              }
            >
              <View style={styles.abstractContent}>
                <AbstractIcon size={40} color={colors.white} />
                <View style={styles.abstractTextContainer}>
                  <View style={styles.abstractArrowContainer}>
                    <Text style={styles.abstractTitle}>Submit Abstract</Text>
                    <View style={styles.arrowRounded}>
                      <ArrowRightIcon size={12} color={colors.primaryLight} />
                    </View>
                  </View>

                  <Text style={styles.abstractSubtitle}>
                    Your Research Deserves A Global Platform
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
            <Card style={styles.trainingSessionCard}>
              <View style={styles.trainingContent}>
                <View style={styles.trainingTextContainer}>
                  <Text style={styles.trainingTitle}>Training Session</Text>
                  <Text style={styles.trainingTopic}>
                    Topic: Advances in Diabetes Management
                  </Text>
                  <TouchableOpacity style={styles.trainingButton}>
                    <Text style={styles.trainingButtonText}>More Details</Text>
                    <ArrowLeftIconYellow
                      size={13}
                      style={{ transform: [{ rotate: '180deg' }] }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </Card>
          </View>
        </View>
      </ScrollView>
      <View style={globalStyles.footerBtContainer}>
        <GradientButton
          title="MY CARDS"
          onPress={() => onNavigateToMyCards?.() || console.log('My Cards')}
          icon={
            <WhiteMyCardsIcon
              size={26}
              color={colors.white}
              style={globalStyles.footerBtIcon}
            />
          }
        />
      </View>
      <SharedMenu
        onLogout={onLogout}
        onLoginPress={onNavigateToLogin}
        onProfilePress={onNavigateToProfile}
      />
    </View>
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

  userIconDashHeader:{
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },

  logoHome: {
    width: Dimensions.get('window').width * 0.34,
    height: Dimensions.get('window').width * 0.1,
    resizeMode: 'contain',
  },

  userIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 40,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  greetingText: {
    color: colors.white,
    fontSize: Dimensions.get('window').width * 0.038,
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
    opacity: 0.3,
  },

  actionGridContent: {
    backgroundColor: colors.primary,
    paddingTop: 20,
    paddingBottom: 90,
    borderBottomEndRadius: 25,
    borderBottomStartRadius: 25,
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
    position: 'relative',
    backgroundColor: 'rgba(249, 222, 71, 0.2)',
    width: 70,
    height: 70,
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

  iconContainerSpecial: {
    position: 'relative',
    backgroundColor:colors.white,
    width:70,
    height:70,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,  
  },

  iconStyle: {
    width: 60,
    height: 60,
    borderRadius: 100,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },

  iconStyleSpecial: {
    width: 60,
    height: 60,
    borderRadius: 100,
    backgroundColor:colors.primaryLight, // Dark blue for card icon background
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  actionButtonText: {
    color: colors.white,
    fontSize: Dimensions.get('window').width * 0.031,
    textAlign: 'center',
    fontWeight: '400',
    paddingHorizontal: spacing.xs,
    marginTop: spacing.xs,
    lineHeight: Dimensions.get('window').width * 0.04,
  },

  congressCardContainer: {
    marginHorizontal: spacing.md,
    marginTop: -87,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
  },
  congressCard: {
    backgroundColor: colors.primary,
    width: screenWidth - spacing.md * 2,
    overflow: 'hidden',
    borderRadius: borderRadius.sm,
    position: 'relative',
  },
  conferenceImage: {
    width: screenWidth - spacing.md * 2,
    height: screenHeight * 0.17,
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: spacing.md,
    borderBottomLeftRadius: borderRadius.sm,
    borderBottomRightRadius: borderRadius.sm,
  },
  bannerTitle: {
    color: colors.white,
    fontSize: screenWidth * 0.042,
    fontFamily: Fonts.Bold,
    marginBottom: spacing.xs,
  },
  bannerSubtitle: {
    color: colors.white,
    fontSize: screenWidth * 0.035,
    fontFamily: Fonts.Medium,
    opacity: 0.9,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    opacity: 0.4,
  },
  paginationDotActive: {
    opacity: 1,
    width: 20,
    backgroundColor: colors.primary,
  },

  horizontalMargin: {
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
    marginHorizontal: 0,
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
    fontWeight: 700,
    marginBottom: spacing.xs,
  },
  abstractSubtitle: {
    color: colors.white,
    fontSize: Dimensions.get('window').width * 0.032,
    opacity: 0.9,
    fontWeight: 600,
  },

  arrowRounded: {
    backgroundColor: colors.primaryLight,
    borderRadius: 100,
    width: Dimensions.get('window').width * 0.055,
    height: Dimensions.get('window').width * 0.055,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
    marginLeft: spacing.sm,
  },

  // Training Session Card Styles
  trainingSessionCard: {
    marginHorizontal: 0,
    width: '100%',
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
    marginBottom: 0,
  },
  trainingTopic: {
    color: colors.white,
    fontSize: Dimensions.get('window').width * 0.032,
    fontFamily: Fonts.Medium,
    marginBottom: 0,
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
