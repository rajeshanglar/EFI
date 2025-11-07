import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { Header } from '../../components/Header';
import globalStyles, { colors, spacing, borderRadius, Fonts } from '../../styles/globalStyles';
import {
  UserIcon,
  EmailIcon,
  CardRightArrowIcon,
  ProfileEditIcon,
  MyPaymentsIcon,
  MyTrainingSessionIcon,
  MyCertificatesIcon,
  EditProfileIcon,
  PhoneIcon,
  } from '../../components/icons';

const { width: screenWidth } = Dimensions.get('window');

interface ProfileProps {
  onBack: () => void;
  onNavigateToHome: () => void;
  onNavigateToMyPayments?: () => void;
  onNavigateToEditProfile?: () => void;
  onNavigateToChangePassword?: () => void;
}

const Profile: React.FC<ProfileProps> = ({
  onBack,
  onNavigateToHome,
  onNavigateToMyPayments,
  onNavigateToEditProfile,
  onNavigateToChangePassword,
}) => {
  // Mock user data - Replace with actual user data from context/store
  const userData = {
    name: 'Mr. Hitesh Bharadwaj',
    email: 'hiteshb755@gmail.com',
    phone: '9848923344',
  };

  return (
    <View style={styles.container}>
      <Header
        title="Profile"
        onBack={onBack}
        onNavigateToHome={onNavigateToHome}
      />
<View style={styles.containerFullWidth}>
      <ImageBackground
          source={require('../../assets/images/ribbon-color-img.png')}
          style={globalStyles.bgBottomRibbon}
          imageStyle={globalStyles.bgBottomRibbonImage}
        />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
      
      <View style={styles.containerFullWidth}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          {/* Profile Picture Section */}
          <View style={styles.profilePictureContainer}>
            <View style={styles.profileIconContainer}>
              <UserIcon size={60} color={colors.primary} />
            </View>
            <TouchableOpacity
              style={styles.editProfileIconButton}
              onPress={onNavigateToEditProfile}
            >
              <View style={styles.editProfileIconCircle}>
                <ProfileEditIcon size={35} color={colors.primaryLight} />
              </View>
            </TouchableOpacity>
          </View>

          {/* Edit Profile Link */}
          <TouchableOpacity
            style={styles.editProfileLink}
            onPress={onNavigateToEditProfile}
            activeOpacity={0.7}
          >
            <EditProfileIcon size={22} color={colors.primary} />
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>

          {/* User Name */}
          <Text style={styles.userName}>{userData.name}</Text>

          {/* Contact Information */}
          <View style={styles.contactInfo}>
            <View style={styles.contactRow}>
              <EmailIcon size={20} color={colors.primary} />
              <Text style={styles.contactText}>{userData.email}</Text>
            </View>
            <View style={styles.contactRow}>
              <PhoneIcon size={20} color={colors.primary} />
              <Text style={styles.contactText}>{userData.phone}</Text>
            </View>
          </View>

          {/* Change Password Button */}
          <TouchableOpacity
            style={styles.changePasswordButton}
            onPress={onNavigateToChangePassword}
            activeOpacity={0.7}
          >
            <Text style={styles.changePasswordText}>Change Password</Text>
          </TouchableOpacity>
        </View>

        {/* Navigation Items */}
        <View style={styles.navigationItems}>
          {/* My Cards */}
          <TouchableOpacity
            style={styles.navItem}          
            activeOpacity={0.7}
          >
            <View style={styles.navItemLeft}>
              <MyCertificatesIcon size={24} color={colors.primary} />
              <Text style={styles.navItemText}>My Certificates</Text>
            </View>
            <CardRightArrowIcon size={20} color={colors.primary} />
          </TouchableOpacity>

          {/* My Payments */}
          <TouchableOpacity
            style={styles.navItem}
            onPress={onNavigateToMyPayments}
            activeOpacity={0.7}
          >
            <View style={styles.navItemLeft}>
              <MyPaymentsIcon size={24} color={colors.primary} />
              <Text style={styles.navItemText}>My Payments</Text>
            </View>
            <CardRightArrowIcon size={20} color={colors.primary} />
          </TouchableOpacity>

          {/* Training Session */}
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => console.log('Training Session')}
            activeOpacity={0.7}
          >
            <View style={styles.navItemLeft}>
              <MyTrainingSessionIcon size={24} color={colors.primary} />
              <Text style={styles.navItemText}>Training Session</Text>
            </View>
            <CardRightArrowIcon size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
        </View>
      </ScrollView>
     
    </View>
    </View>
  );
};

const styles = StyleSheet.create({


  
  containerFullWidth:{
    width: '100%',
    flex: 1,
    position: 'relative',
  },

  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
  
    zIndex: 1,
  },
  scrollContent: {
   
  },
  profileCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginHorizontal: spacing.md,
    marginTop:70,
    marginBottom: spacing.md,
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profilePictureContainer: {
    position: 'relative',
    marginBottom: spacing.md,
    marginTop:-60,
  },
  profileIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: colors.primaryLight,
    backgroundColor: colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editProfileIconButton: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  editProfileIconCircle: {  
    width:32,
    height: 32,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  editProfileLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    position: 'absolute',
    top:10,
    left:10, 
    padding: spacing.sm,
  },
  editProfileText: {
    fontSize: screenWidth * 0.035,
    fontFamily: Fonts.Medium,
    color: colors.primary,
    marginLeft: spacing.xs,
  },
  userName: {
    fontSize: screenWidth * 0.045,
    fontFamily: Fonts.Bold,
    color: colors.primary,
    marginBottom:0,
    textAlign: 'center',
  },
  contactInfo: {
    width: '100%',
    marginBottom: spacing.sm,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    justifyContent: 'center',
  },
  contactText: {
    fontSize: screenWidth * 0.036,
    fontFamily: Fonts.Regular,
    color: colors.black,
    marginLeft: spacing.sm,
  },
  changePasswordButton: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: borderRadius.round,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    minWidth: 150,
  },
  changePasswordText: {
    fontSize: screenWidth * 0.035,
    fontFamily: Fonts.Medium,
    color: colors.primary,
    textAlign: 'center',
  },
  navigationItems: {
    paddingHorizontal: spacing.md,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  navItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navItemText: {
    fontSize: screenWidth * 0.038,
    fontFamily: Fonts.Medium,
    color: colors.black,
    marginLeft: spacing.md,
  },
});

export default Profile;

