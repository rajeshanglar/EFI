import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, ImageBackground } from 'react-native';
import globalStyles, { colors, spacing, borderRadius, Fonts } from '../../styles/globalStyles';
import { Header } from '../../components/Header';
import { GradientButton } from '../../components/GradientButton';
import { SuccessModal } from '../../components/SuccessModal';

const { width: screenWidth } = Dimensions.get('window');

  interface MembershipPaymentDetailsProps {
  onBack: () => void;
  onNavigateToHome: () => void;
  onNavigateToLogin?: () => void;
  onNavigateToMembershipPaymentDetails?: () => void;
  userData?: {
    name?: string;
    email?: string;
    phone?: string;
    country?: string;
  };
  paymentData?: {
    totalAmount?: number;
    coupon?: number;
    subTotal?: number;
    grandTotal?: number;
  };
}

const MembershipPaymentDetails: React.FC<MembershipPaymentDetailsProps> = ({
  onBack,
  onNavigateToHome,
  onNavigateToLogin,
  userData = {
    name: 'Hitesh Bharadwaj',
    email: 'hiteshb755@gmail.com',
    phone: '+91 9848923344',
    country: 'India',
  },
  paymentData = {
    totalAmount: 11000,
    coupon: 0,
    subTotal: 11000,
    grandTotal: 11800,
  },
}) => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleRegister = () => {
    console.log('Register button pressed');
    setShowSuccessModal(true);
  };

  const handleDownloadReceipt = () => {
    console.log('Downloading receipt...');
    // Implement download logic here
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header
        title="Membership Payment Details"
        onBack={onBack}
        onNavigateToHome={onNavigateToHome}
      />

      {/* User Information Section */}
      <ImageBackground
        source={require('../../assets/images/wave-img.png')}
        style={globalStyles.imgBgContainerWave}
        imageStyle={globalStyles.imgBgWave}
      >
        <View style={styles.userInfoContainer}>
          {/* Name */}
          <View style={styles.userInfoRow}>
            <Text style={styles.userLabel}>Name</Text>
            <Text style={styles.userValue}>{userData.name}</Text>
          </View>

          {/* Email */}
          <View style={styles.userInfoRow}>
            <Text style={styles.userLabel}>Email</Text>
            <Text style={styles.userValue}>{userData.email}</Text>
          </View>

          {/* Phone */}
          <View style={styles.userInfoRow}>
            <Text style={styles.userLabel}>Phone</Text>
            <Text style={styles.userValue}>{userData.phone}</Text>
          </View>

          {/* Country */}
          <View style={styles.userInfoRow}>
            <Text style={styles.userLabel}>Country</Text>
            <Text style={styles.userValue}>{userData.country}</Text>
          </View>
        </View>
      </ImageBackground>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Payment Information Section */}
        <View style={styles.paymentSection}>
          <Text style={styles.paymentTitle}>Payment Information</Text>

          {/* Total Amount */}
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Total Amount</Text>
            <Text style={styles.paymentValue}>₹{paymentData.totalAmount?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
          </View>

          {/* Coupon */}
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Coupon</Text>
            <Text style={styles.paymentValue}>₹{paymentData.coupon?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Sub Total */}
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Sub Total</Text>
            <Text style={styles.paymentValue}>₹{paymentData.subTotal?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
          </View>

          {/* Grand Total */}
          <View style={styles.paymentRow}>
            <Text style={styles.grandTotalLabel}>Grand Total</Text>
            <Text style={styles.grandTotalValue}>₹{paymentData.grandTotal?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Register Now Button */}
      <View style={[globalStyles.footerBtContainer, styles.footerButtonContainer]}>
        <GradientButton title="REGISTER NOW" onPress={handleRegister} />
      </View>

      {/* Success Modal */}
      <SuccessModal
        visible={showSuccessModal}
        message="The payment has been completed successfully."
        instructionText="Please check your registered email for your username and password to proceed with login."
        onClose={() => {
          setShowSuccessModal(false);
          // Navigate to login page
          if (onNavigateToLogin) {
            setTimeout(() => {
              onNavigateToLogin();
            }, 200);
          } else {
            onNavigateToHome?.();
          }
        }}
        onDownload={handleDownloadReceipt}
        />
        
      </View>
    );
  };

  const styles = StyleSheet.create({

    container: {
      flex: 1,
      backgroundColor: colors.white,
    },
  
    userInfoContainer: {
      paddingHorizontal: spacing.md,
      gap: spacing.sm,
    },
    userInfoRow: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
  
      paddingBottom: spacing.sm,
    },
    userLabel: {
      fontSize: screenWidth * 0.036,
      fontFamily: Fonts.Medium,
      color: colors.primaryLight,
      width:Dimensions.get('window').width * 0.25,
      
    },
    userValue: {
      fontSize: screenWidth * 0.036,
      fontFamily: Fonts.SemiBold,
      color: colors.primaryLight,
     
      textAlign: 'left',
    },
    scrollView: {
      flex: 1,
      marginBottom: 80,
    },
    scrollViewContent: {
      paddingBottom: 20,
    },
    paymentSection: {
      padding: spacing.lg,
      backgroundColor: colors.white,
    },
    paymentTitle: {
      fontSize: screenWidth * 0.045,
      fontFamily: Fonts.Bold,
      color: colors.black,
      marginBottom: spacing.lg,
    },
    paymentRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    paymentLabel: {
      fontSize: screenWidth * 0.038,
      fontFamily: Fonts.Regular,
      color: colors.black,
    },
    paymentValue: {
      fontSize: screenWidth * 0.038,
      fontFamily: Fonts.Regular,
      color: colors.black,
    },
    divider: {
      height: 1,
      backgroundColor: colors.gray,
      marginVertical: spacing.md,
    },
    grandTotalLabel: {
      fontSize: screenWidth * 0.042,
      fontFamily: Fonts.Bold,
      color: colors.black,
    },
    grandTotalValue: {
      fontSize: screenWidth * 0.042,
      fontFamily: Fonts.Bold,
      color: colors.black,
    },
    footerButtonContainer: {
      zIndex: 1000,
      elevation: 20,
    },
  });



export default MembershipPaymentDetails;

