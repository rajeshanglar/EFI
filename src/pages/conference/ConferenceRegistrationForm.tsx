import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import globalStyles, { colors } from '../../styles/globalStyles';
import { Header } from '../../components/Header';
import { Dropdown } from '../../components/Dropdown';
import { GradientButton } from '../../components/GradientButton';
import { RefreshIcon } from '../../components/icons';
import { useConferenceForm } from '../../hooks/use-conference-form';

interface Props {
  registrationTier: 'Early Bird' | 'Regular' | 'On Spot';
  onBack: () => void;
  onNavigateToHome: () => void;
  onNavigateToPayment?: (formData: any) => void;
}

const ConferenceRegistrationForm: React.FC<Props> = ({
  registrationTier,
  onBack,
  onNavigateToHome,
  onNavigateToPayment,
}) => {
  const {
    formData,
    errors,
    captcha,
    handleInputChange,
    refreshCaptcha,
    validateForm,
  } = useConferenceForm();

  const handleSubmit = () => {
    if (validateForm()) onNavigateToPayment?.(formData);
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
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={globalStyles.formContainer}
        >
          {/** Basic Info Fields */}
          {[
            {
              label: 'Full Name (Appear in Certificate)',
              field: 'fullName',
              placeholder: 'Enter your full name',
            },
            {
              label: 'Email Id',
              field: 'email',
              placeholder: 'Enter your email',
              keyboardType: 'email-address',
            },
            {
              label: 'Mobile No.',
              field: 'mobileNo',
              placeholder: 'Enter your mobile number',
              keyboardType: 'phone-pad',
            },
            {
              label: 'Institute',
              field: 'institute',
              placeholder: 'Enter your institute name',
            },
            {
              label: 'Specialization',
              field: 'specialization',
              placeholder: 'Enter your specialization',
            },
            {
              label: 'Address',
              field: 'address',
              placeholder: 'Enter your address',
              multiline: true,
            },
            { label: 'City', field: 'city', placeholder: 'Enter your city' },
            {
              label: 'Pin Code',
              field: 'pinCode',
              placeholder: 'Enter pin code',
              keyboardType: 'number-pad',
            },
          ].map(({ label, field, placeholder, ...rest }) => (
            <View key={field} style={globalStyles.fieldContainer}>
              <Text style={globalStyles.fieldLabel}>{label}</Text>
              <TextInput
                style={[
                  globalStyles.fieldInput,
                  errors[field] && globalStyles.fieldInputError,
                ]}
                placeholder={placeholder}
                placeholderTextColor={colors.gray}
                value={formData[field as keyof typeof formData]}
                onChangeText={v => handleInputChange(field, v)}
                {...rest}
              />
              {errors[field] && (
                <Text style={globalStyles.fieldErrorText}>{errors[field]}</Text>
              )}
            </View>
          ))}

          {/** Dropdowns */}
          {[
            { label: 'State', field: 'state', options: 'states' },
            { label: 'Country', field: 'country', options: 'countries' },
            { label: 'Category', field: 'category', options: 'categories' },
            {
              label: 'Morning Workshop',
              field: 'morningWorkshop',
              options: 'workshops',
            },
            {
              label: 'Afternoon Workshop',
              field: 'afternoonWorkshop',
              options: 'workshops',
            },
            {
              label: 'Payment Mode',
              field: 'paymentMode',
              options: 'paymentModes',
            },
          ].map(({ label, field, options }) => (
            <Dropdown
              key={field}
              label={label}
              value={formData[field as keyof typeof formData]}
              options={
                useConferenceForm.options[
                  options as keyof typeof useConferenceForm.options
                ]
              }
              onSelect={v => handleInputChange(field, v)}
              error={errors[field]}
            />
          ))}

          {/** Amount Display */}
          <View style={globalStyles.fieldContainer}>
            <Text style={globalStyles.fieldLabel}>Amount</Text>
            <Text style={globalStyles.fieldAmountText}>₹11000</Text>
          </View>

          {/** CAPTCHA */}
          <View style={globalStyles.fieldContainer}>
            <Text style={globalStyles.fieldLabel}>CAPTCHA</Text>
            <View style={globalStyles.formCaptchaContainer}>
              <View style={globalStyles.formCaptchaCodeContainer}>
                <Text style={globalStyles.formCaptchaCode}>{captcha}</Text>
              </View>
              <TextInput
                style={[
                  globalStyles.formCaptchaInput,
                  errors.captcha && globalStyles.fieldInputError,
                ]}
                placeholder="Enter CAPTCHA"
                placeholderTextColor={colors.gray}
                value={formData.captcha}
                onChangeText={v =>
                  handleInputChange('captcha', v.toUpperCase())
                }
                maxLength={6}
                autoCapitalize="characters"
              />
              <TouchableOpacity
                onPress={refreshCaptcha}
                style={globalStyles.formRefreshButton}
              >
                <RefreshIcon size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>
            {errors.captcha && (
              <Text style={globalStyles.fieldErrorText}>{errors.captcha}</Text>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={globalStyles.footerBtContainer}>
        <GradientButton title="SUBMIT" onPress={handleSubmit} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
});

export default React.memo(ConferenceRegistrationForm);
