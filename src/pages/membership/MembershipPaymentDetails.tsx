import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, Dimensions } from 'react-native';
import globalStyles, { colors, spacing, Fonts } from '../../styles/globalStyles';
import Header from '../../components/Header';
import { GradientButton } from '../../components/GradientButton';
import { SuccessModal } from '../../components/SuccessModal';
import { MembershipRegistration, CouponValidation } from '../../services/membershipService';
import { MembershipRegPayload, MembershipRegistrationFormValues, CouponPayload } from '../../utils/types';
import { ToastService } from '../../utils/service-handlers';

const { width: screenWidth } = Dimensions.get('window');

  interface MembershipPaymentDetailsProps {
  onBack: () => void;
  onNavigateToHome: () => void;
  onNavigateToLogin?: () => void;
  onNavigateToMembershipPaymentDetails?: () => void;
  formData?: MembershipRegistrationFormValues;
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
  formData,
  userData,
  paymentData,
}) => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getCountryId = (countryValue: string): number => {
    if (!countryValue) return 0;
    const numValue = parseInt(countryValue, 10);
    return isNaN(numValue) ? 0 : numValue;
  };

  const formatDateForAPI = (dateString: string): string => {
    if (!dateString) return '';
    if (dateString.includes('-') && dateString.length <= 8) {
      return dateString;
    }
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = String(date.getFullYear()).slice(-2);
      return `${day}-${month}-${year}`;
    } catch {
      return dateString;
    }
  };

  const calculateDiscount = (couponData: any, subTotal: number): number => {
    const couponType = couponData?.coupon_type?.toLowerCase() || '';
    const couponAmount = couponData?.coupon_amount || 0;
    
    if (couponType === 'percentage' || couponType === 'percent') {
      const percentage = typeof couponAmount === 'string' ? parseFloat(couponAmount) : couponAmount;
      return !isNaN(percentage) && percentage > 0 ? (subTotal * percentage) / 100 : 0;
    }
    
    return typeof couponAmount === 'string' ? parseFloat(couponAmount) : couponAmount;
  };

  const handleRegister = async () => {
    if (isSubmitting || !formData) return;

    console.log('=== REGISTER NOW CLICKED ===');
    console.log('Form Data:', JSON.stringify(formData, null, 2));
    console.log('User Data:', JSON.stringify(userData, null, 2));
    console.log('Payment Data:', JSON.stringify(paymentData, null, 2));
    console.log('================================');

    setIsSubmitting(true);

    try {
      const SUB_TOTAL = paymentData?.subTotal || 11800.0;
      let discount = paymentData?.coupon || 0;
      let grandTotal = paymentData?.grandTotal || SUB_TOTAL;

      if (formData.couponCode?.trim() && formData.email) {
        try {
          const couponResult = await CouponValidation({
            email_id: formData.email.trim(),
            coupon_code: formData.couponCode.trim(),
          });

          if (couponResult?.success === true) {
            const calculatedDiscount = calculateDiscount(couponResult.data, SUB_TOTAL);
            discount = calculatedDiscount || discount;
            grandTotal = SUB_TOTAL - discount;
          } else {
            discount = 0;
            grandTotal = SUB_TOTAL;
          }
        } catch {
          // Continue with original discount on validation error
        }
      }

      const payload: MembershipRegPayload = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email_id: formData.email,
        phone_number: formData.phone,
        dob: formatDateForAPI(formData.dateOfBirth || ''),
        city: formData.city || '',
        country: getCountryId(formData.country),
        hear_about_efi: formData.hearAboutEFI || '',
        patient_count: parseInt(formData.patientsPerYear, 10) || 0,
        surgery_count: parseInt(formData.surgeriesPerYear, 10) || 0,
        address: formData.address1 || '',
        coupon_code: formData.couponCode || '',
        sub_total: SUB_TOTAL,
        grand_total: grandTotal,
        coupon_value: discount > 0 ? discount.toString() : '0',
        payment_gateway: '',
        payment_method: '',
        transaction_id: '',
        gateway_transaction_id: '',
        gateway_order_id: '',
        payment_status: '',
        currency: '',
        gateway_response: '',
        failure_reason: '',
        payment_date: '',
        source_type: '',
      };

      const result = await MembershipRegistration(payload);

      console.log('=== MEMBERSHIP REGISTRATION RESPONSE ===');
      console.log(JSON.stringify(result, null, 2));
      console.log('========================================');

      if (result?.success === true) {
        ToastService.success('Success', result.message || 'Membership registration successful!');
        setShowSuccessModal(true);
      } else {
        console.log('Registration Failed - Message:', result?.message);
      }
    } catch (error: any) {
      console.error('Membership registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadReceipt = () => {
    // TODO: Implement download logic
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header
        title="Membership Payment Details"
        onBack={onBack}
        onNavigateToHome={onNavigateToHome}
        onMenuItemPress={() => {}}
      />

      {/* User Information Section */}
      <ImageBackground
        source={require('../../assets/images/wave-img.png')}
        style={globalStyles.imgBgContainerWave}
        imageStyle={globalStyles.imgBgWave}
      >
        <View style={styles.userInfoContainer}>
          {/* Name */}
          {userData?.name && (
            <View style={styles.userInfoRow}>
              <Text style={styles.userLabel}>Name</Text>
              <Text style={styles.userValue}>{userData.name}</Text>
            </View>
          )}

          {/* Email */}
          {userData?.email && (
            <View style={styles.userInfoRow}>
              <Text style={styles.userLabel}>Email</Text>
              <Text style={styles.userValue}>{userData.email}</Text>
            </View>
          )}

          {/* Phone */}
          {userData?.phone && (
            <View style={styles.userInfoRow}>
              <Text style={styles.userLabel}>Phone</Text>
              <Text style={styles.userValue}>{userData.phone}</Text>
            </View>
          )}

          {/* Country */}
          {userData?.country && (
            <View style={styles.userInfoRow}>
              <Text style={styles.userLabel}>Country</Text>
              <Text style={styles.userValue}>{userData.country}</Text>
            </View>
          )}
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

          {/* Sub Total Amount */}
          {paymentData?.subTotal !== undefined && (
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Sub Amount</Text>
              <Text style={styles.paymentValue}>₹{paymentData.subTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
            </View>
          )}

          {/* Coupon Amount */}
          {paymentData?.coupon !== undefined && paymentData.coupon > 0 && (
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Coupon Amount</Text>
              <Text style={styles.paymentValue}>- ₹{paymentData.coupon.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
            </View>
          )}

          {/* Divider */}
          {(paymentData?.subTotal !== undefined || paymentData?.grandTotal !== undefined) && (
            <View style={styles.divider} />
          )}

          {/* Grand Total */}
          {paymentData?.grandTotal !== undefined && (
            <View style={styles.paymentRow}>
              <Text style={styles.grandTotalLabel}>Grand Total</Text>
              <Text style={styles.grandTotalValue}>₹{paymentData.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Register Now Button */}
      <View style={[globalStyles.footerBtContainer, styles.footerButtonContainer]}>
        <GradientButton 
          title={isSubmitting ? 'REGISTERING...' : 'REGISTER NOW'} 
          onPress={handleRegister}
          disabled={isSubmitting || !formData}
        />
      </View>

      {/* Success Modal */}
      <SuccessModal
        visible={showSuccessModal}
        message="The payment has been completed successfully."
        instructionText="Please check your registered email for your username and password to proceed with login."
        onClose={() => {
          setShowSuccessModal(false);
          if (onNavigateToLogin) {
            setTimeout(() => onNavigateToLogin(), 200);
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
      width: screenWidth * 0.25,
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

