import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../../../components/Header';
import { SuccessIcon, WhiteMyCardsIcon, UserIcon, EmailIcon, PhoneIcon, MapIcon } from '../../../components/icons';
import globalStyles, {
  colors,
  spacing,
  borderRadius,
  Fonts,
} from '../../../styles/globalStyles';
import { useAuth } from '../../../contexts/AuthContext';
import GradientButton from '../../../components/GradientButton';
import { getProfilePicture, updatePrivacySettings } from '../../../services/commonService';
import { ToastService } from '../../../utils/service-handlers';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface PrivacySettingsProps {
  onBack: () => void;
  onNavigateToHome: () => void;
  onNavigateToEditProfile?: () => void;
}

interface ContactDetail {
  id: string;
  label: string;
  value: string;
  isShared: boolean;
}

const PrivacySettings: React.FC<PrivacySettingsProps> = ({
  onBack,
  onNavigateToHome,
  onNavigateToEditProfile,
}) => {
  const { user } = useAuth();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const hasLoadedPrivacySettings = useRef(false);

  const userId = user?.id || user?.user_id;

  // Load profile image when component mounts or user changes
  useEffect(() => {
    if (userId) {
      loadProfileImage();
    }
  }, [userId]);

  // Log component mount
  useEffect(() => {
    console.log('PrivacySettings - Component mounted');
    console.log('PrivacySettings - User data:', JSON.stringify(user, null, 2));
  }, []);

  const loadProfileImage = async () => {
    if (!userId) {
      setProfileImage(null);
      return;
    }
    
    setLoadingImage(true);
    try {
      const payload = { user_id: userId };
      console.log('PrivacySettings - loadProfileImage - Payload:', JSON.stringify(payload, null, 2));
      const res = await getProfilePicture(userId);
      console.log('PrivacySettings - loadProfileImage - Response:', JSON.stringify(res, null, 2));
      
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
        console.log('PrivacySettings - Profile image loaded successfully');
      } else {
        // No valid image data - show placeholder
        setProfileImage(null);
        console.log('PrivacySettings - No valid profile image found');
      }
    } catch (e: any) {
      console.log('PrivacySettings - Error loading profile image:', e);
      setProfileImage(null);
    } finally {
      setLoadingImage(false);
    }
  };

  // Default message for empty fields
  const defaultMessage = 'Please click on Edit Profile Button and update it';

  // Static user data (can be replaced with actual user data from context)
  const userData = {
    name: user?.first_name && user?.last_name
      ? `${user.first_name} ${user.last_name}`
      : user?.first_name
      ? user.first_name
      : user?.name,
    title: user?.title || user?.affiliation || '',
    address: user?.address || '',
    email: user?.email_id || user?.email,
    phone: user?.mobile_no || user?.phone,
    affiliation: user?.title || user?.affiliation || '',
  };

  // Contact details with sharing preferences
  const [contactDetails, setContactDetails] = useState<ContactDetail[]>([]);
  const [initialContactDetails, setInitialContactDetails] = useState<ContactDetail[]>([]);

  // Update contact details when user data changes
  useEffect(() => {
    const name = user?.first_name && user?.last_name
      ? `${user.first_name} ${user.last_name}`
      : user?.first_name
      ? user.first_name
      : user?.name || '';
    const affiliation = user?.title || user?.affiliation || '';
    const address = user?.address || '';
    const email = user?.email_id || user?.email || '';
    const phone = user?.mobile_no || user?.phone || '';

    const newContactDetails = [
      { id: '1', label: name, value: name, isShared: true },
      { 
        id: '2', 
        label: affiliation || defaultMessage, 
        value: affiliation || defaultMessage, 
        isShared: true 
      },
      { 
        id: '3', 
        label: address || defaultMessage, 
        value: address || defaultMessage, 
        isShared: false 
      },
      { id: '4', label: email, value: email, isShared: true },
      { id: '5', label: phone, value: phone, isShared: false },
      { id: '6', label: 'My Photo (Update in profile)', value: 'photo', isShared: true },
    ];

    setContactDetails(newContactDetails);
    // Set initial state only if it's empty (first load)
    if (initialContactDetails.length === 0) {
      setInitialContactDetails(newContactDetails);
    }
    
    // Reset the flag when user changes
    hasLoadedPrivacySettings.current = false;
  }, [user]);

  // Load privacy settings from AsyncStorage and apply to contact details
  useEffect(() => {
    if (!userId || contactDetails.length === 0 || hasLoadedPrivacySettings.current) return;

    const loadPrivacySettings = async () => {
      try {
        const storageKey = `privacy_settings_${userId}`;
        const savedSettingsJson = await AsyncStorage.getItem(storageKey);
        
        if (savedSettingsJson) {
          const savedSettings = JSON.parse(savedSettingsJson);
          console.log('PrivacySettings - Load Privacy Settings from Storage:', JSON.stringify(savedSettings, null, 2));

          // Update contact details with saved privacy settings
          setContactDetails(prev => {
            const updated = prev.map(detail => {
              let isShared = false;
              // Map contact detail IDs to API privacy settings keys
              if (detail.id === '1') {
                isShared = savedSettings.name === 1;
              } else if (detail.id === '2') {
                isShared = savedSettings.affiliation === 1;
              } else if (detail.id === '3') {
                isShared = savedSettings.address === 1;
              } else if (detail.id === '4') {
                isShared = savedSettings.email === 1;
              } else if (detail.id === '5') {
                isShared = savedSettings.mobile === 1;
              } else if (detail.id === '6') {
                isShared = savedSettings.profile_pic === 1;
              }
              return { ...detail, isShared };
            });
            
            // Update initial state as well
            setInitialContactDetails([...updated]);
            hasLoadedPrivacySettings.current = true;
            return updated;
          });
        } else {
          // No saved settings, use defaults
          hasLoadedPrivacySettings.current = true;
        }
      } catch (error: any) {
        console.log('PrivacySettings - Error loading privacy settings from storage:', error);
        // If storage fails, continue with default values
        hasLoadedPrivacySettings.current = true;
      }
    };

    loadPrivacySettings();
  }, [userId, contactDetails.length]);

  const toggleSharing = (id: string) => {
    console.log('PrivacySettings - Toggle sharing for ID:', id);
    setContactDetails(prev => {
      const updated = prev.map(detail =>
        detail.id === id ? { ...detail, isShared: !detail.isShared } : detail
      );
      console.log('PrivacySettings - Updated contact details:', JSON.stringify(updated, null, 2));
      return updated;
    });
  };

  // Check if contact details have changed
  const hasChanges = () => {
    if (initialContactDetails.length === 0 || contactDetails.length === 0) {
      return false;
    }
    
    return contactDetails.some((detail, index) => {
      const initialDetail = initialContactDetails[index];
      return initialDetail && initialDetail.isShared !== detail.isShared;
    });
  };

  const handleUpdatePrivacySettings = async () => {
    if (!userId) {
      ToastService.error('Error', 'User ID is required');
      return;
    }

    // Map contactDetails to API format
    // id: '1' = name, '2' = affiliation, '3' = address, '4' = email, '5' = mobile, '6' = profile_pic
    const privacySettingsMap: { [key: string]: string } = {
      '1': 'name',
      '2': 'affiliation',
      '3': 'address',
      '4': 'email',
      '5': 'mobile',
      '6': 'profile_pic',
    };

    const privacy_settings: {
      name: number;
      affiliation: number;
      address: number;
      email: number;
      mobile: number;
      profile_pic: number;
    } = {
      name: 1,
      affiliation: 1,
      address: 0,
      email: 1,
      mobile: 0,
      profile_pic:1,
    };

    // Convert contactDetails to API format
    contactDetails.forEach(detail => {
      const apiKey = privacySettingsMap[detail.id];
      if (apiKey) {
        privacy_settings[apiKey as keyof typeof privacy_settings] = detail.isShared ? 1 : 0;
      }
    });

    const payload = {
      user_id: userId,
      privacy_settings,
    };

    console.log('PrivacySettings - Update Privacy Settings - Payload:', JSON.stringify(payload, null, 2));

    setIsUpdating(true);
    try {
      const response = await updatePrivacySettings(payload);
      console.log('PrivacySettings - Update Privacy Settings - Response:', JSON.stringify(response, null, 2));

      if (response?.success) {
        // Save privacy settings to AsyncStorage
        try {
          const storageKey = `privacy_settings_${userId}`;
          await AsyncStorage.setItem(storageKey, JSON.stringify(privacy_settings));
          console.log('PrivacySettings - Saved privacy settings to storage');
        } catch (storageError) {
          console.log('PrivacySettings - Error saving to storage:', storageError);
        }

        // Update initial state to current state after successful update
        setInitialContactDetails([...contactDetails]);
        ToastService.success('Success', response?.message || 'Privacy settings updated successfully');
      } else {
        ToastService.error('Error', response?.message || 'Failed to update privacy settings');
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update privacy settings';
      ToastService.error('Error', errorMessage);
      console.log('PrivacySettings - Update Privacy Settings - Error:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Privacy Settings"
        onBack={onBack}
        onNavigateToHome={onNavigateToHome}
        onMenuItemPress={(id: any) => console.log('Menu:', id)}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Yellow Prompt Text */}
        <View style={styles.containerBottomSpace}>
        <View style={styles.promptContainer}>
          <Text style={styles.promptText}>
            How would you like to present yourself to other attendees?
          </Text>
        </View>

        {/* Virtual Name Badge Section */}
        <View style={styles.badgeContainer}>
          <View style={styles.badgeTitleEditContainer}>
            <Text style={styles.badgeTitle}>Virtual Name Badge</Text>
            <TouchableOpacity 
              style={styles.badgeTitleEditButton}
              onPress={onNavigateToEditProfile}    
            >
              <Text style={styles.badgeTitleEditButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.badgeContent}>
            {/* Profile Picture */}
            <View style={styles.profileImageContainer}>
              {(() => {
                // Check if "My Photo" (id: '6') is shared
                const photoDetail = contactDetails.find(detail => detail.id === '6');
                const isPhotoShared = photoDetail?.isShared ?? true;

                // If photo is not shared, always show UserIcon
                if (!isPhotoShared) {
                  return (
                    <View style={styles.profilePlaceholder}>
                      <UserIcon size={35} color={colors.primary} />
                    </View>
                  );
                }

                // If photo is shared, show image if available, otherwise show UserIcon
                if (loadingImage) {
                  return (
                    <View style={styles.profilePlaceholder}>
                      <ActivityIndicator size="small" color={colors.primary} />
                    </View>
                  );
                } else if (profileImage) {
                  return (
                    <Image
                      source={{ uri: profileImage }}
                      style={styles.profileImage}
                      resizeMode="cover"
                    />
                  );
                } else {
                  return (
                    <View style={styles.profilePlaceholder}>
                      <UserIcon size={35} color={colors.primary} />
                    </View>
                  );
                }
              })()}
            </View>

            {/* badgeInfo */}
            <View style={styles.badgeInfo}>
              {/* Name - always show first if shared */}
              {contactDetails.find(detail => detail.id === '1')?.isShared && (
                <Text style={styles.badgeName}>
                  {contactDetails.find(detail => detail.id === '1')?.value || 
                   contactDetails.find(detail => detail.id === '1')?.label || ''}
                </Text>
              )}
              
              {/* Other fields - show in order if shared (affiliation, address, email, phone) */}
              {contactDetails
                .filter(detail => {
                  // Only show if shared, not name/photo, and has a valid value (not default message)
                  return detail.isShared && 
                         detail.id !== '1' && 
                         detail.id !== '6' &&
                         detail.value &&
                         detail.value !== defaultMessage &&
                         detail.value.trim() !== '';
                })
                .sort((a, b) => parseInt(a.id) - parseInt(b.id)) // Sort by ID to maintain order
                .map((detail) => {
                  // Map icons based on field ID
                  let IconComponent = null;
                  if (detail.id === '2') {
                    // Affiliation - no icon
                    IconComponent = null;
                  } else if (detail.id === '3') {
                    // Address
                    IconComponent = MapIcon;
                  } else if (detail.id === '4') {
                    // Email
                    IconComponent = EmailIcon;
                  } else if (detail.id === '5') {
                    // Mobile/Phone
                    IconComponent = PhoneIcon;
                  }

                  return (
                    <View key={detail.id} style={styles.badgeInfoRow}>
                      {IconComponent && (
                        <IconComponent 
                          size={16} 
                          color={colors.primary} 
                          style={styles.badgeInfoIcon}
                        />
                      )}
                      <Text style={styles.badgeTitleText}>
                        {detail.value}
                      </Text>
                    </View>
                  );
                })}
            </View>
          </View>

        </View>

        {/* Contact Details Sharing Section */}
        <View style={styles.sharingContainer}>
          {/* Information Banner */}
          <View style={styles.infoBanner}>
            <Text style={styles.infoBannerText}>
              The contact details selected below will be shared when you connect with other attendees. A green check mark shows which details will be shared.
            </Text>
          </View>

          {/* Contact Details List */}
          <View style={styles.contactDetailsList}>
            {contactDetails.map((detail, index) => (
              <TouchableOpacity
                key={detail.id}
                style={[
                  styles.contactDetailItem,
                  index === contactDetails.length - 1 && styles.lastItem,
                ]}
                onPress={() => toggleSharing(detail.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.contactDetailText}>{detail.label}</Text>
                <View
                  style={[
                    styles.checkmarkContainer,
                    detail.isShared && styles.checkmarkContainerActive,
                  ]}
                >
                  {detail.isShared && (
                    <SuccessIcon size={20} color={colors.white} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        </View>
      </ScrollView>

      {hasChanges() && (
        <TouchableOpacity style={globalStyles.footerBtContainer}>
          <GradientButton
            title={isUpdating ? 'UPDATING...' : 'Update'}
            onPress={handleUpdatePrivacySettings}
            disabled={isUpdating}
          />
        </TouchableOpacity>
      )}
      
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
  promptContainer: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  promptText: {
    fontSize: screenWidth * 0.036,
    fontFamily: Fonts.Medium,
    color: colors.primaryLight,
  },
  badgeContainer: {
    backgroundColor: colors.lightBlue,   
  },
  badgeTitle: {
    fontSize: screenWidth * 0.042,
    fontFamily: Fonts.Bold,
    color: colors.primary,
    marginBottom: spacing.md,
  },
  badgeContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',   
    paddingHorizontal: spacing.md,
    paddingBottom:screenWidth * 0.02,
  },
  profileImageContainer: {
    marginRight: spacing.md,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: colors.white,
  },
  profilePlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  profilePlaceholderText: {
    fontSize: screenWidth * 0.05,
    fontFamily: Fonts.Bold,
    color: colors.primary,
  },
  badgeInfo: {
    flex: 1,
  },
  badgeName: {
    fontSize: screenWidth * 0.042,
    fontFamily: Fonts.Bold,
    color: colors.primary,   
  },
  badgeInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  badgeInfoIcon: {
    marginRight: spacing.xs,
  },
  badgeTitleText: {
    fontSize: screenWidth * 0.034,
    fontFamily: Fonts.Regular,
    color: colors.primary,
    lineHeight: screenWidth * 0.048,
    flex: 1,
    paddingBottom: spacing.xs,
  },
  sharingContainer: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  infoBanner: {
    backgroundColor:colors.lightYellow,
    padding: spacing.md,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.lg,
    borderLeftWidth: 6,
    borderLeftColor: '#FFA800',
  },
  infoBannerText: {
    fontSize: screenWidth * 0.034,
    fontFamily: Fonts.Medium,
    color: colors.primary,
    lineHeight: screenWidth * 0.048,
  },
  contactDetailsList: {
    backgroundColor: colors.white,
  },
  contactDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
    
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  contactDetailText: {
    flex: 1,
    fontSize: screenWidth * 0.036,
    fontFamily: Fonts.Regular,
    color: colors.primary,
    marginRight: spacing.md,
  },
  checkmarkContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D0D0D0',
    backgroundColor:'#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkContainerActive: {
    backgroundColor: '#DEFFE7',
    borderColor: '#DEFFE7',
  },
  badgeTitleEditContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom:0,
    paddingHorizontal: spacing.md,   
    paddingTop: screenHeight * 0.015,
  
  },
  badgeTitleEditButton: {
    paddingHorizontal: spacing.md,
    paddingVertical:3,
    borderWidth: 1,
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    borderRadius: borderRadius.sm,
    margin:0,
  },
  badgeTitleEditButtonText: {
    fontSize: screenWidth * 0.034,
    fontFamily: Fonts.Medium,
    color: colors.white,
  },
  containerBottomSpace: {
    paddingBottom: screenHeight * 0.06,
  },
});

export default PrivacySettings;

