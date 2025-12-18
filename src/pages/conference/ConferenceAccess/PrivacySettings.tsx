import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import Header from '../../../components/Header';
import { SuccessIcon } from '../../../components/icons';
import globalStyles, {
  colors,
  spacing,
  borderRadius,
  Fonts,
} from '../../../styles/globalStyles';
import { useAuth } from '../../../contexts/AuthContext';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface PrivacySettingsProps {
  onBack: () => void;
  onNavigateToHome: () => void;
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
}) => {
  const { user } = useAuth();

  // Static user data (can be replaced with actual user data from context)
  const userData = {
    name: user?.first_name && user?.last_name
      ? `${user.first_name} ${user.last_name}`
      : user?.first_name
      ? user.first_name
      : user?.name || 'Vimee Bindra',
    title: user?.title || 'Consultant gynaecologist, Robotic and Laparoscopic Surgeon, Endometriosis Excision Surgeon, Apollo Hospital',
    address: user?.address || 'Apollo Hospital, Filmnagar, Hyderabad, Telangana, India 500096',
    email: user?.email_id || user?.email || 'vimee.bindra@gmail.com',
    phone: user?.mobile_no || user?.phone || '+91 7893999924',
    photo: user?.profile_image || undefined,
  };

  // Contact details with sharing preferences
  const [contactDetails, setContactDetails] = useState<ContactDetail[]>([
    { id: '1', label: userData.name, value: userData.name, isShared: true },
    { id: '2', label: userData.title, value: userData.title, isShared: false },
    { id: '3', label: userData.address, value: userData.address, isShared: false },
    { id: '4', label: userData.email, value: userData.email, isShared: false },
    { id: '5', label: userData.phone, value: userData.phone, isShared: false },
    { id: '6', label: 'My Photo (Update in profile)', value: 'photo', isShared: true },
  ]);

  const toggleSharing = (id: string) => {
    setContactDetails(prev =>
      prev.map(detail =>
        detail.id === id ? { ...detail, isShared: !detail.isShared } : detail
      )
    );
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
        <View style={styles.promptContainer}>
          <Text style={styles.promptText}>
            How would you like to present yourself to other attendees?
          </Text>
        </View>

        {/* Virtual Name Badge Section */}
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeTitle}>Virtual Name Badge</Text>
          <View style={styles.badgeContent}>
            {/* Profile Picture */}
            <View style={styles.profileImageContainer}>
              {userData.photo ? (
                <Image
                  source={{ uri: userData.photo }}
                  style={styles.profileImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.profilePlaceholder}>
                  <Text style={styles.profilePlaceholderText}>
                    {userData.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
            </View>

            {/* Name and Title */}
            <View style={styles.badgeInfo}>
              <Text style={styles.badgeName}>{userData.name}</Text>
              <Text style={styles.badgeTitleText}>{userData.title}</Text>
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
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,   
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
    marginBottom: spacing.xs,
  },
  badgeTitleText: {
    fontSize: screenWidth * 0.034,
    fontFamily: Fonts.Regular,
    color: colors.primary,
    lineHeight: screenWidth * 0.048,
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
});

export default PrivacySettings;

