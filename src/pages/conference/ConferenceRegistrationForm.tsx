import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import globalStyles, { colors, spacing, borderRadius, Fonts } from '../../styles/globalStyles';
import { Header } from '../../components/Header';
import { Dropdown } from '../../components/Dropdown';
import { GradientButton } from '../../components/GradientButton';
import { RefreshIcon } from '../../components/icons';

const { width: screenWidth } = Dimensions.get('window');

interface ConferenceRegistrationFormProps {
  registrationTier: 'Early Bird' | 'Regular' | 'On Spot';
  onBack: () => void;
  onNavigateToHome: () => void;
  onSubmit?: (formData: any) => void;
  onNavigateToPayment?: (formData: any) => void;
}

const ConferenceRegistrationForm: React.FC<ConferenceRegistrationFormProps> = ({ 
  registrationTier, 
  onBack, 
  onNavigateToHome,
  onSubmit,
  onNavigateToPayment
}) => {
  // Generate CAPTCHA
  const generateCaptcha = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let captcha = '';
    for (let i = 0; i < 6; i++) {
      captcha += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return captcha;
  };

  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobileNo: '',
    institute: '',
    specialization: '',
    address: '',
    city: '',
    pinCode: '',
    state: '',
    country: '',
    category: '',
    morningWorkshop: '',
    afternoonWorkshop: '',
    paymentMode: '',
    captcha: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Dropdown options
  const countryOptions = [
    { label: 'India', value: 'india' },
    { label: 'USA', value: 'usa' },
    { label: 'UK', value: 'uk' },
    { label: 'Canada', value: 'canada' },
  ];

  const stateOptions = [
    { label: 'Maharashtra', value: 'maharashtra' },
    { label: 'Delhi', value: 'delhi' },
    { label: 'Karnataka', value: 'karnataka' },
    { label: 'Tamil Nadu', value: 'tamil_nadu' },
    { label: 'Gujarat', value: 'gujarat' },
  ];

  const categoryOptions = [
    { label: 'EFI Member - Standard (National)', value: 'efi_member_national' },
    { label: 'EFI Member - PGs/Fellows (National)', value: 'efi_member_pg_national' },
    { label: 'Non-EFI Member - Standard (National)', value: 'non_efi_national' },
    { label: 'Non-EFI Member - PGs/Fellows (National)', value: 'non_efi_pg_national' },
    { label: 'International - Standard', value: 'international_standard' },
    { label: 'International - PGs/Fellows', value: 'international_pg' },
  ];

  const workshopOptions = [
    { label: 'Workshop 1: Advanced Techniques', value: 'workshop_1' },
    { label: 'Workshop 2: Case Studies', value: 'workshop_2' },
    { label: 'Workshop 3: Hands-on Training', value: 'workshop_3' },
    { label: 'None', value: 'none' },
  ];

  const paymentModeOptions = [
    { label: 'Online Payment', value: 'online' },
    { label: 'Bank Transfer', value: 'bank_transfer' },
    { label: 'UPI', value: 'upi' },
    { label: 'Cheque', value: 'cheque' },
  ];

  // Amount calculation based on category
  const amount = 11000;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.mobileNo.trim()) {
      newErrors.mobileNo = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobileNo.replace(/\D/g, ''))) {
      newErrors.mobileNo = 'Invalid mobile number';
    }
    if (!formData.institute.trim()) {
      newErrors.institute = 'Institute is required';
    }
    if (!formData.specialization.trim()) {
      newErrors.specialization = 'Specialization is required';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!formData.pinCode.trim()) {
      newErrors.pinCode = 'Pin code is required';
    } else if (!/^\d{6}$/.test(formData.pinCode)) {
      newErrors.pinCode = 'Invalid pin code';
    }
    if (!formData.state) {
      newErrors.state = 'State is required';
    }
    if (!formData.country) {
      newErrors.country = 'Country is required';
    }
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    if (!formData.paymentMode) {
      newErrors.paymentMode = 'Payment mode is required';
    }
    if (!formData.captcha.trim()) {
      newErrors.captcha = 'CAPTCHA is required';
    } else if (formData.captcha.toUpperCase() !== captcha) {
      newErrors.captcha = 'Invalid CAPTCHA';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setFormData(prev => ({ ...prev, captcha: '' }));
  };

  const handleSubmit = () => {
    // TODO: Uncomment when API is ready
    // if (validateForm()) {
    //   onSubmit?.(formData);
    // }
    
    // Navigate to payment details (bypassing validation for UI testing)
    onNavigateToPayment?.(formData);
  };

  return (
    <View style={styles.container}>
      <Header 
        title="Conference Registration Form"
        onBack={onBack}
        onNavigateToHome={onNavigateToHome}
      />

      <View style={globalStyles.headerBottomContainer}>
        <Text style={globalStyles.HeaderBottomHeading}>{registrationTier}</Text>
      </View>
      <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={globalStyles.formContainer}>
            {/* Full Name */}
            <View style={globalStyles.fieldContainer}>
                <Text style={globalStyles.fieldLabel}>
                Full Name <Text style={globalStyles.fieldSubLabel}>(Appear in Certificate)</Text>
                </Text>
                <TextInput
                style={[globalStyles.fieldInput, errors.fullName && globalStyles.fieldInputError]}
                placeholder="Enter your full name"
                placeholderTextColor={colors.gray}
                value={formData.fullName}
                onChangeText={(value) => handleInputChange('fullName', value)}
                />
                {errors.fullName && <Text style={globalStyles.fieldErrorText}>{errors.fullName}</Text>}
            </View>

            {/* Email Id */}
            <View style={globalStyles.fieldContainer}>
                <Text style={globalStyles.fieldLabel}>Email Id</Text>
                <TextInput
                style={[globalStyles.fieldInput, errors.email && globalStyles.fieldInputError]}
                placeholder="Enter your email"
                placeholderTextColor={colors.gray}
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                />
                {errors.email && <Text style={globalStyles.fieldErrorText}>{errors.email}</Text>}
            </View>

            {/* Mobile No. */}
            <View style={globalStyles.fieldContainer}>
                <Text style={globalStyles.fieldLabel}>Mobile No.</Text>
                <TextInput
                style={[globalStyles.fieldInput, errors.mobileNo && globalStyles.fieldInputError]}
                placeholder="Enter your mobile number"
                placeholderTextColor={colors.gray}
                value={formData.mobileNo}
                onChangeText={(value) => handleInputChange('mobileNo', value)}
                keyboardType="phone-pad"
                maxLength={10}
                />
                {errors.mobileNo && <Text style={globalStyles.fieldErrorText}>{errors.mobileNo}</Text>}
            </View>

            {/* Institute */}
            <View style={globalStyles.fieldContainer}>
                <Text style={globalStyles.fieldLabel}>Institute</Text>
                <TextInput
                style={[globalStyles.fieldInput, errors.institute && globalStyles.fieldInputError]}
                placeholder="Enter your institute name"
                placeholderTextColor={colors.gray}
                value={formData.institute}
                onChangeText={(value) => handleInputChange('institute', value)}
                />
                {errors.institute && <Text style={globalStyles.fieldErrorText}>{errors.institute}</Text>}
            </View>

            {/* Specialization */}
            <View style={globalStyles.fieldContainer}>
                <Text style={globalStyles.fieldLabel}>Specialization</Text>
                <TextInput
                style={[globalStyles.fieldInput, errors.specialization && globalStyles.fieldInputError]}
                placeholder="Enter your specialization"
                placeholderTextColor={colors.gray}
                value={formData.specialization}
                onChangeText={(value) => handleInputChange('specialization', value)}
                />
                {errors.specialization && <Text style={globalStyles.fieldErrorText}>{errors.specialization}</Text>}
            </View>

            {/* Address */}
            <View style={globalStyles.fieldContainer}>
                <Text style={globalStyles.fieldLabel}>Address</Text>
                <TextInput
                style={[globalStyles.fieldInput, errors.address && globalStyles.fieldInputError]}
                placeholder="Enter your address"
                placeholderTextColor={colors.gray}
                value={formData.address}
                onChangeText={(value) => handleInputChange('address', value)}
                multiline
                />
                {errors.address && <Text style={globalStyles.fieldErrorText}>{errors.address}</Text>}
            </View>

            {/* City */}
            <View style={globalStyles.fieldContainer}>
                <Text style={globalStyles.fieldLabel}>City</Text>
                <TextInput
                style={[globalStyles.fieldInput, errors.city && globalStyles.fieldInputError]}
                placeholder="Enter your city"
                placeholderTextColor={colors.gray}
                value={formData.city}
                onChangeText={(value) => handleInputChange('city', value)}
                />
                {errors.city && <Text style={globalStyles.fieldErrorText}>{errors.city}</Text>}
            </View>

            {/* Pin Code */}
            <View style={globalStyles.fieldContainer}>
                <Text style={globalStyles.fieldLabel}>Pin Code</Text>
                <TextInput
                style={[globalStyles.fieldInput, errors.pinCode && globalStyles.fieldInputError]}
                placeholder="Enter pin code"
                placeholderTextColor={colors.gray}
                value={formData.pinCode}
                onChangeText={(value) => handleInputChange('pinCode', value)}
                keyboardType="number-pad"
                maxLength={6}
                />
                {errors.pinCode && <Text style={globalStyles.fieldErrorText}>{errors.pinCode}</Text>}
            </View>

            {/* State Dropdown */}
            <Dropdown
                label="State"
                value={formData.state}
                options={stateOptions}
                onSelect={(value) => handleInputChange('state', value)}
                error={errors.state}
            />

            {/* Country Dropdown */}
            <Dropdown
                label="Country"
                value={formData.country}
                options={countryOptions}
                onSelect={(value) => handleInputChange('country', value)}
                error={errors.country}
            />

            {/* Category Dropdown */}
            <Dropdown
                label="Category"
                value={formData.category}
                options={categoryOptions}
                onSelect={(value) => handleInputChange('category', value)}
                error={errors.category}
            />

            {/* Morning Session Workshop */}
            <Dropdown
                label="Morning Session Workshop"
                value={formData.morningWorkshop}
                options={workshopOptions}
                onSelect={(value) => handleInputChange('morningWorkshop', value)}
            />

            {/* Afternoon Session Workshop */}
            <Dropdown
                label="Afternoon Session Workshop"
                value={formData.afternoonWorkshop}
                options={workshopOptions}
                onSelect={(value) => handleInputChange('afternoonWorkshop', value)}
            />

            {/* Payment Mode */}
            <Dropdown
                label="Payment Mode"
                value={formData.paymentMode}
                options={paymentModeOptions}
                onSelect={(value) => handleInputChange('paymentMode', value)}
                error={errors.paymentMode}
            />

            {/* Amount */}
            <View style={globalStyles.fieldContainer}>
                <Text style={globalStyles.fieldLabel}>Amount</Text>
                <View style={globalStyles.fieldAmountContainer}>
                <Text style={globalStyles.  fieldAmountText}>₹{amount}</Text>
                </View>
            </View>

            {/* CAPTCHA */}
            <View style={globalStyles.fieldContainer}>
                <Text style={globalStyles.fieldLabel}>CAPTCHA</Text>
                <View style={globalStyles.formCaptchaContainer}>
                <View style={globalStyles.formCaptchaCodeContainer}>
                    <Text style={globalStyles.formCaptchaCode}>{captcha}</Text>
                </View>
                <TextInput
                    style={[globalStyles.formCaptchaInput, errors.captcha && globalStyles.fieldInputError]}
                    placeholder="Enter CAPTCHA"
                    placeholderTextColor={colors.gray}
                    value={formData.captcha}
                    onChangeText={(value) => handleInputChange('captcha', value.toUpperCase())}
                    maxLength={6}
                    autoCapitalize="characters"
                />
                <TouchableOpacity onPress={refreshCaptcha} style={globalStyles.formRefreshButton}>
                    <RefreshIcon size={20} color={colors.primary} style={globalStyles.formRefreshIcon} />
                </TouchableOpacity>
                </View>
                {errors.captcha && <Text style={globalStyles.fieldErrorText}>{errors.captcha}</Text>}
            </View>
            </View>
        </ScrollView>
      </KeyboardAvoidingView>
      {/* Submit Button */}
      <View style={globalStyles.footerBtContainer}>
        <GradientButton
          title="SUBMIT"
          onPress={handleSubmit}
        //   icon={<RefreshIcon size={20} color={colors.white} style={globalStyles.formRefreshIcon} />}
        />
      </View>
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

  
});

export default ConferenceRegistrationForm;

