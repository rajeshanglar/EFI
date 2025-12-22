import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  Image,
  ActivityIndicator,
} from 'react-native';
import Header from '../../components/Header';
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
  MembershipIcon,
  CongressIcon,
  MapIcon,
  } from '../../components/icons';
import { useAuth } from '../../contexts/AuthContext';
import ImagePickerCropper, { Image as PickerImage } from 'react-native-image-crop-picker';
import { getProfilePicture, updateProfilePicture } from '../../services/commonService';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface ProfileProps {
  onBack: () => void;
  onNavigateToHome: () => void;
  onNavigateToMyPayments?: () => void;
  onNavigateToEditProfile?: () => void;
  onNavigateToChangePassword?: () => void;
  onNavigateToMyCertificates?: () => void;
  onNavigateToConferenceDetails?: () => void;
}

const Profile: React.FC<ProfileProps> = ({  
  onBack,
  onNavigateToHome,
  onNavigateToMyPayments,
  onNavigateToEditProfile,
  onNavigateToChangePassword,
  onNavigateToMyCertificates,
  onNavigateToConferenceDetails,
}) => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const { user } = useAuth();
  
  // Get membership, conference, and speaker registrations from linked_registrations
  const membershipRegistrations = user?.linked_registrations?.membership || [];
  const conferenceRegistrations = user?.linked_registrations?.conference || [];
  const speakerRegistrations = user?.linked_registrations?.speaker || [];
  
  const hasMembership = Array.isArray(membershipRegistrations) && membershipRegistrations.length > 0;
  const hasConference = Array.isArray(conferenceRegistrations) && conferenceRegistrations.length > 0;
  const hasSpeaker = Array.isArray(speakerRegistrations) && speakerRegistrations.length > 0;

  // Get serial number: prioritize membership, then speaker (exclude conference)
  const membershipSerialNumber = hasMembership && membershipRegistrations[0]?.serial_number 
    ? membershipRegistrations[0].serial_number 
    : '';
  const speakerSerialNumber = hasSpeaker && speakerRegistrations[0]?.serial_number 
    ? speakerRegistrations[0].serial_number 
    : '';
  
  const displaySerialNumber = membershipSerialNumber || speakerSerialNumber || '';

  // Get user data from context or use fallback values
  const userData = {
    name: user?.first_name && user?.last_name 
      ? `${user.first_name} ${user.last_name}` 
      : user?.first_name 
      ? user.first_name 
      : user?.name || 'User',
    email: user?.email_id || user?.email || '',
    phone: user?.mobile_no || user?.phone || '',
    serialNumber: displaySerialNumber,
  };

  const userId = user?.id || user?.user_id;

  // Load profile image when component mounts or user changes
  useEffect(() => {
    if (userId) {
      loadProfileImage();
    }
  }, [userId]);

  const loadProfileImage = async () => {
    if (!userId) {
      setProfileImage(null);
      return;
    }
    
    setLoadingImage(true);
    try {
      const payload = { user_id: userId };
      console.log('loadProfileImage - Payload:', JSON.stringify(payload, null, 2));
      const res = await getProfilePicture(userId);
      console.log('loadProfileImage - Response:', JSON.stringify(res, null, 2));
      
      // Check if profile image exists and is not null
      const profileBase64 = res?.data?.profile_base64;
      const mimeType = res?.data?.mime_type;
      
      // Check if we have valid base64 data (not empty string, not null, and has actual image data)
      if (profileBase64 && 
          mimeType && 
          profileBase64 !== null && 
          mimeType !== null &&
          profileBase64.trim() !== '' &&
          profileBase64.length > 100) { // Real images have substantial base64 data
        // Construct data URI and set the image
        // Remove data URI prefix if already present
        const base64Data = profileBase64.startsWith('data:') 
          ? profileBase64 
          : `data:${mimeType};base64,${profileBase64}`;
        setProfileImage(base64Data);
      } else {
        // No valid image data - show UserIcon
        setProfileImage(null);
      }
    } catch (e: any) {
      setProfileImage(null);
    } finally {
      setLoadingImage(false);
    }
  };

  const onEditProfileImage = async () => {
    try {
      const image = await ImagePickerCropper.openPicker({
        width: 400,
        height: 400,
        cropping: true,
        includeBase64: true,
        compressImageQuality: 0.8,
      }) as PickerImage;

      const base64WithPrefix = `data:${image.mime};base64,${image.data}`;
      setProfileImage(base64WithPrefix);
      setLoadingImage(true);

      const payload = { user_id: userId, profile_image: base64WithPrefix };
      console.log('updateProfilePicture - Payload:', JSON.stringify(payload, null, 2));
      const res = await updateProfilePicture(userId, base64WithPrefix);
      console.log('updateProfilePicture - Response:', JSON.stringify(res, null, 2));

      if (res?.success && res?.data?.profile_base64 && res?.data?.mime_type) {
        setProfileImage(`data:${res.data.mime_type};base64,${res.data.profile_base64}`);
      } else {
        await loadProfileImage();
      }
    } catch (e: any) {
      const errorMessage = e?.message || '';
      const isCancelled = 
        errorMessage.includes('cancel') || 
        errorMessage.includes('User cancelled') ||
        errorMessage.includes('cancelled image selection') ||
        errorMessage === 'User cancelled image picker';
      
      if (!isCancelled) {
        await loadProfileImage();
      }
    } finally {
      setLoadingImage(false);
    }
  };


  return (
    <View style={styles.container}>
      <Header
        title="Profile"
        onBack={onBack}
        onNavigateToHome={onNavigateToHome}
        onMenuItemPress={(id: string) => {}}
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
                {loadingImage ? (
                  <ActivityIndicator size="large" color={colors.primary} />
                ) : profileImage ? (
                  <Image source={{ uri: profileImage }} style={styles.profileImage} />
                ) : (
                  <UserIcon size={screenWidth * 0.12} color={colors.primary} />
                )}
              </View>

            <TouchableOpacity
              style={styles.editProfileIconButton}
              onPress={onEditProfileImage}
            >
              <View style={styles.editProfileIconCircle}>
                <ProfileEditIcon size={screenWidth * 0.08} color={colors.primaryLight} />
              </View>
            </TouchableOpacity>
          </View>

          {/* Edit Profile Link */}
          {/* <TouchableOpacity
            style={styles.editProfileLink}
            onPress={onNavigateToEditProfile}
            activeOpacity={0.7}
          >
            <EditProfileIcon size={screenWidth * 0.055} color={colors.primary} />
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity> */}

          {/* User Name */}
          <Text style={styles.userName}>{userData.name}</Text>
<Text style={styles.contactText}>{user?.title || user?.affiliation || ''}</Text>


          {/* Membership ID or Speaker ID */}
          {userData.serialNumber ? (
              <View style={styles.contactRow}>
                <Text style={styles.serialNumberLabel}>
                  {membershipSerialNumber ? 'Membership ID:' : 'Speaker ID:'}
                </Text>
                <Text style={styles.serialNumberText}>{userData.serialNumber}</Text>
              </View>
            ) : null}

          {/* Contact Information */}
          <View style={styles.contactInfo}>
            <View style={styles.contactRow}>
              <EmailIcon size={screenWidth * 0.05} color={colors.primary} />
              <Text style={styles.contactText}>{userData.email}</Text>
            </View>
            <View style={styles.contactRow}>
              <PhoneIcon size={screenWidth * 0.047} color={colors.primary} />
              <Text style={styles.contactText}>{userData.phone}</Text>
            </View>

            <View style={styles.contactRow}>
              <MapIcon size={screenWidth * 0.047} color={colors.primary} />
              <Text style={styles.contactText}>{user?.title || user?.address || ''}</Text>
            </View>

            
    
          </View>

          {/* Change Password Button */}
          <View style={styles.changeEditButtonContainer}>

           <TouchableOpacity
            style={styles.changePasswordButton}
            onPress={onNavigateToEditProfile}
            activeOpacity={0.7}
          >
            <Text style={styles.changePasswordText}>Edit Profile</Text>
          </TouchableOpacity> 


          <TouchableOpacity
            style={styles.changePasswordButton}
            onPress={onNavigateToChangePassword}
            activeOpacity={0.7}
          >
            <Text style={styles.changePasswordText}>Change Password</Text>
          </TouchableOpacity>

          </View>
    
        </View>
   
        {/* Navigation Items */}
        <View style={styles.navigationItems}>
          {/* My Certificates */}

          {hasConference && (
          <TouchableOpacity
            style={styles.navItem}
            onPress={onNavigateToConferenceDetails}
            activeOpacity={0.7}
          >
            <View style={styles.navItemLeft}>
              <CongressIcon size={24} color={colors.primary} />
              <Text style={styles.navItemText}>Conference Details</Text>
            </View>
            <CardRightArrowIcon size={20} color={colors.primary} />
          </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={styles.navItem}
            onPress={onNavigateToMyCertificates}
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
          {/* <TouchableOpacity
            style={styles.navItem}
            onPress={() => console.log('Training Session')}
            activeOpacity={0.7}
          >
            <View style={styles.navItemLeft}>
              <MyTrainingSessionIcon size={24} color={colors.primary} />
              <Text style={styles.navItemText}>Training Session</Text>
            </View>
            <CardRightArrowIcon size={20} color={colors.primary} />
          </TouchableOpacity> */}
        </View>
        </View>
      </ScrollView>
     
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: screenWidth * 0.21 / 2,
    resizeMode: 'cover',
  },
  
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

  changeEditButtonContainer:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.sm,

  },

  profileCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.sm,
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
    width: screenWidth * 0.21,
    height: screenWidth * 0.21,
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
    right:0,
  },
  editProfileIconCircle: {  
    width:screenWidth * 0.058,
    height: screenWidth * 0.058,
    borderRadius: screenWidth * 0.078 / 2,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',    
    borderColor: colors.white,
  },
  editProfileLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    position: 'absolute',
    top:screenHeight * 0.010,
    left:screenWidth * 0.010, 
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
  serialNumberLabel: {
    fontSize: screenWidth * 0.036,
    fontFamily: Fonts.Medium,
    color: colors.primary,
    marginRight: spacing.xs,
  },
  serialNumberText: {
    fontSize: screenWidth * 0.034,
    fontFamily: Fonts.SemiBold,
    color: colors.primary,
  },
  changePasswordButton: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: borderRadius.round,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,   
    backgroundColor: colors.primary,
  },
  changePasswordText: {
    fontSize: screenWidth * 0.037,
    fontFamily: Fonts.Medium,
    color: colors.white,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
  },
  navigationItems: {
    paddingHorizontal: spacing.md,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: borderRadius.sm,
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
  registrationSection: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: screenWidth * 0.042,
    fontFamily: Fonts.Bold,
    color: colors.primary,
  },
  registrationCard: {
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
  registrationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  registrationLabel: {
    fontSize: screenWidth * 0.035,
    fontFamily: Fonts.Medium,
    color: colors.black,
    flex: 1,
  },
  registrationValue: {
    fontSize: screenWidth * 0.035,
    fontFamily: Fonts.Regular,
    color: colors.primary,
    flex: 1,
    textAlign: 'right',
  },
  statusText: {
    fontFamily: Fonts.SemiBold,
  },
  statusActive: {
    color: '#4CAF50',
  },
  statusInactive: {
    color: '#F44336',
  },
});

export default Profile;

