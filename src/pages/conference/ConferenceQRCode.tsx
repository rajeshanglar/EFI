import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import globalStyles, { colors, spacing, borderRadius, Fonts } from '../../styles/globalStyles';
import { GradientButton } from '../../components/GradientButton';
import { SuccessModal } from '../../components/SuccessModal';
import { DownloadIcon, ArrowRightIcon } from '../../components/icons';

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
        <View style={styles.profileCard}>
        <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <Image source={require('../../assets/images/logo-w.png')} style={styles.logo} />
          </View>
          <View style={styles.divider} />
          <View style={styles.conferenceInfo}>
            <Text style={styles.conferenceTitle}>3rd Edition of Endometriosis Congress</Text>
            <Text style={styles.conferenceDetails}>6, 7 & 8 MARCH 2026, Park Hyatt, Hyderabad</Text>
          </View>
        </View>
      </View>
          {/* Reference Number */}
          <Text style={styles.referenceNumber}>EFON2243</Text>

          {/* Profile Image */}
          <View style={styles.imageContainer}>
            <Image
              source={require('../../assets/images/qrcode-img.png')}
              style={styles.profileImage}
              resizeMode="cover"
            />
          </View>

          {/* Name */}
          <Text style={styles.speakerName}>Hitesh Bharadwaj</Text>

          {/* Affiliation */}
          <Text style={styles.affiliation}>Max Super Speciality Hospital</Text>

          {/* Download Button */}
          <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
            <DownloadIcon size={16} color={colors.primary} />
            <Text style={styles.downloadText}>Download</Text>
          </TouchableOpacity>
        </View>

        {/* Login Prompt */}
        <View style={styles.loginPrompt}>
          <Text style={styles.promptText}>
            Please check your registered email for your username and password to proceed with login.
          </Text>
        </View>

              {/* Proceed To Login Button */}
      <View style={styles.proceedToLoginButton}>
        <GradientButton
          title="Proceed To Login"
          icon={<ArrowRightIcon size={20} style={styles.proceedLoginArrow} />}
          iconPosition="right"
          onPress={handleProceedToLogin}     
              
        />
      </View>
      </ScrollView>



      {/* Success Modal */}
      <SuccessModal
        visible={showModal}
        message="Your registration has been completed successfully. Please proceed to login."
        onClose={handleModalOkay}
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
    width: '100%',
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  headerContent: {
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: spacing.md,
  },
  logo: {
    width: screenWidth * 0.6,
    height: screenWidth * 0.2,
    resizeMode: 'contain',
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: colors.white,
    marginBottom: spacing.sm,
  },
  conferenceInfo: {
    alignItems: 'center',
  },
  conferenceTitle: {
    fontSize: screenWidth * 0.039,
    fontFamily: Fonts.Bold,
    color: colors.primaryLight,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  conferenceDetails: {
    fontSize: screenWidth * 0.033,
    fontFamily: Fonts.Regular,
    color: colors.white,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  profileCard: {
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
  referenceNumber: {
    fontSize: screenWidth * 0.044,
    fontFamily: Fonts.Medium,
    color: colors.black,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  imageContainer: {
    width: 170,
    height: 170, 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  speakerName: {
    fontSize: screenWidth * 0.046,
    fontFamily: Fonts.Bold,
    color: colors.blue,
 
    textAlign: 'center',
  },
  affiliation: {
    fontSize: screenWidth * 0.036,
    fontFamily: Fonts.Medium,
    color: colors.black,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.blue,
    borderRadius:100,
    gap: spacing.xs,
  },
  downloadText: {
    fontSize: screenWidth * 0.037,
    fontFamily: Fonts.Medium,
    color: colors.blue,
  },
  loginPrompt: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  promptText: {
    fontSize: screenWidth * 0.037,
    fontFamily: Fonts.Regular,
    color: colors.darkGray,
    textAlign: 'center',
    lineHeight: 24,
  },
  proceedToLoginButton: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },

  proceedLoginArrow: {
    backgroundColor: colors.primaryLight,

  
  },  
});

export default ConferenceQRCode;
