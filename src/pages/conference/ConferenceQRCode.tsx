import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import globalStyles, { colors, spacing, borderRadius, Fonts } from '../../styles/globalStyles';
import { GradientButton } from '../../components/GradientButton';
import { SuccessModal } from '../../components/SuccessModal';
import { DownloadIcon, ArrowRightIcon, BackArrowIcon, EmailModalIcon } from '../../components/icons';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface ConferenceQRCodeProps {
  onBack: () => void;
  onNavigateToHome: () => void;
  onNavigateToLogin: () => void;
}

const ConferenceQRCode: React.FC<ConferenceQRCodeProps> = ({
  onBack,
  onNavigateToHome,
  onNavigateToLogin,
}) => {
  const [showModal, setShowModal] = useState(false);

  const handleProceedToLogin = () => {
    setShowModal(true);
  };

  const handleModalOkay = () => {
    setShowModal(false);
    onNavigateToLogin();
  };

  const handleDownload = () => {
    console.log('Downloading profile...');
  };

  return (
    <View style={styles.container}>
    


      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={globalStyles.qrCard}>
        <View style={globalStyles.qrHeader}>
        <View style={globalStyles.qrHeaderContent}>
          <View style={globalStyles.qrLogoContainer}>
            <Image source={require('../../assets/images/logo-w.png')} style={globalStyles.qrLogo} />
          </View>
          <View style={globalStyles.qrDivider} />
          <View style={globalStyles.qrConferenceInfo}>
            <Text style={globalStyles.qrConferenceTitle}>3rd Edition of Endometriosis Congress</Text>
            <Text style={globalStyles.qrConferenceDetails}>6, 7 & 8 MARCH 2026, Park Hyatt, Hyderabad</Text>
          </View>
        </View>
      </View>
          {/* Reference Number */}
          <Text style={globalStyles.qrReferenceNumber}>EFON2243</Text>

          {/* Profile Image */}
          <View style={globalStyles.qrImageContainer}>
            <Image
              source={require('../../assets/images/qrcode-img.png')}
              style={globalStyles.qrProfileImage}
              resizeMode="cover"
            />
          </View>

          {/* Name */}
          <Text style={globalStyles.qrSpeakerName}>Hitesh Bharadwaj</Text>

          {/* Affiliation */}
          <Text style={globalStyles.qrAffiliation}>Max Super Speciality Hospital</Text>

          {/* Download Button */}
          <TouchableOpacity style={globalStyles.qrDownloadButton} onPress={handleDownload}>
            <DownloadIcon size={16} color={colors.primary} />
            <Text style={globalStyles.qrDownloadText}>Download</Text>
          </TouchableOpacity>
        </View>

        {/* Login Prompt */}
        <View style={globalStyles.qrLoginPrompt}>
          <Text style={globalStyles.qrPromptText}>
            Please check your registered email for your username and password to proceed with login.
          </Text>
        </View>

              {/* Proceed To Login Button */}
      <View style={globalStyles.qrProceedToLoginButton}>
        <View style={globalStyles.qrProceedLoginArrow} pointerEvents="none">
           <BackArrowIcon size={20} style={styles.qrProceedLoginArrowIcon} />
        </View>
     
        <GradientButton
          title="Proceed To Login"        
          onPress={handleProceedToLogin} 
        />
      </View>
      </ScrollView>



      {/* Success Modal */}
      <SuccessModal
        visible={showModal}
        message="Please check your registered email for your username and password to proceed with login."
        onClose={handleModalOkay}
        icon={<EmailModalIcon size={90} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    flex: 1,
  },
 
  qrDivider: {
    width: '100%',
    height: 1,
    backgroundColor: colors.white,
    marginBottom: spacing.sm,
  },
  qrConferenceInfo: {
    alignItems: 'center',
  },
  qrConferenceTitle: {
    fontSize: screenWidth * 0.039,
    fontFamily: Fonts.Bold,
    color: colors.primaryLight,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  qrConferenceDetails: {
    fontSize: screenWidth * 0.033,
    fontFamily: Fonts.Regular,
    color: colors.white,
    textAlign: 'center',
  },

  qrCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    margin: spacing.lg,
    paddingBottom: spacing.xl,
  
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  qrReferenceNumber: {
    fontSize: screenWidth * 0.044,
    fontFamily: Fonts.Medium,
    color: colors.black,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  qrImageContainer: {
    width: 170,
    height: 170, 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    
  },
  qrProfileImage: {
    width: '100%',
    height: '100%',
  },
  qrSpeakerName: {
    fontSize: screenWidth * 0.046,
    fontFamily: Fonts.Bold,
    color: colors.blue,
 
    textAlign: 'center',
  },
  qrAffiliation: {
    fontSize: screenWidth * 0.036,
    fontFamily: Fonts.Medium,
    color: colors.black,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  qrDownloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.blue,
    borderRadius:100,
    gap: spacing.xs,
  },
  qrDownloadText: {
    fontSize: screenWidth * 0.037,
    fontFamily: Fonts.Medium,
    color: colors.blue,
  },
  qrLoginPrompt: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  qrPromptText: {
    fontSize: screenWidth * 0.037,
    fontFamily: Fonts.Regular,
    color: colors.darkGray,
    textAlign: 'center',
    lineHeight: 24,
  },
  qrProceedToLoginButton: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.lg,
    position: 'relative',
    
  },

    qrProceedLoginArrow: {
    position: 'absolute',
    right: '10%',
    top: '50%',
    transform: [{ translateY: '-50%' }],
    borderRadius: 100,
    padding: spacing.sm,
    backgroundColor: colors.primary,
    zIndex: 1,  
  },    
  qrProceedLoginArrowIcon: {
    transform: [{ rotate: '180deg' }],
  },


});

export default ConferenceQRCode;
