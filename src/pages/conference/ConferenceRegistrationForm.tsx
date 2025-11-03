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
import { Formik } from 'formik';
import globalStyles, { colors } from '../../styles/globalStyles';
import { Header } from '../../components/Header';
import { Dropdown } from '../../components/Dropdown';
import { GradientButton } from '../../components/GradientButton';
import { RefreshIcon } from '../../components/icons';
import {
  conferenceRegistrationSchema,
  generateCaptcha,
  conferenceFormOptions,
} from '../../schemas/conferenceRegistrationSchema';
import { ConferenceRegistrationFormValues } from '../../types/conferenceRegistration';

interface Props {
  registrationTier: 'Early Bird' | 'Regular' | 'On Spot';
  onBack: () => void;
  onNavigateToHome: () => void;
  onNavigateToConferencePayment?: (formData: ConferenceRegistrationFormValues) => void;
}

const ConferenceRegistrationForm: React.FC<Props> = ({
  registrationTier,
  onBack,
  onNavigateToHome,
  onNavigateToConferencePayment,
}) => {
  const [captcha, setCaptcha] = useState(generateCaptcha());

  const initialValues = {
    fullName: 'Hitesh Bharadwaj ',
    email: 'hiteshb755@gmail.com',
    mobileNo: '9848923344',
    institute: 'EFI',
    specialization: 'Endometriosis',
    address: '123, Main Street, Anytown, USA',
    city: 'Hyderabad',
    pinCode: '500001',
    state: 'Telangana',
    country: 'India',
    category: 'National - Standard',
    morningWorkshop: 'Workshop 1: Advanced Techniques',
    afternoonWorkshop: 'Workshop 2: Case Studies',
    paymentMode: 'Online Payment',
    captcha: 'ASASD',
  };

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
  };

  const handleSubmit = (values: ConferenceRegistrationFormValues) => {
    onNavigateToConferencePayment?.(values);
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

      <Formik
        initialValues={initialValues}
        validationSchema={conferenceRegistrationSchema(captcha)}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({
          values,
          errors: formikErrors,
          touched,
          handleChange,
          handleBlur,
          setFieldValue,
          handleSubmit: formikHandleSubmit,
          isValid,
        }) => (
          <>
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
                    field: 'fullName' as keyof typeof initialValues,
                    placeholder: 'Enter your full name',
                  },
                  {
                    label: 'Email Id',
                    field: 'email' as keyof typeof initialValues,
                    placeholder: 'Enter your email',
                    keyboardType: 'email-address' as const,
                  },
                  {
                    label: 'Mobile No.',
                    field: 'mobileNo' as keyof typeof initialValues,
                    placeholder: 'Enter your mobile number',
                    keyboardType: 'phone-pad' as const,
                  },
                  {
                    label: 'Institute',
                    field: 'institute' as keyof typeof initialValues,
                    placeholder: 'Enter your institute name',
                  },
                  {
                    label: 'Specialization',
                    field: 'specialization' as keyof typeof initialValues,
                    placeholder: 'Enter your specialization',
                  },
                  {
                    label: 'Address',
                    field: 'address' as keyof typeof initialValues,
                    placeholder: 'Enter your address',
                    multiline: true,
                  },
                  {
                    label: 'City',
                    field: 'city' as keyof typeof initialValues,
                    placeholder: 'Enter your city',
                  },
                  {
                    label: 'Pin Code',
                    field: 'pinCode' as keyof typeof initialValues,
                    placeholder: 'Enter pin code',
                    keyboardType: 'number-pad' as const,
                  },
                ].map(({ label, field, placeholder, ...rest }) => (
                  <View key={field} style={globalStyles.fieldContainer}>
                    <Text style={globalStyles.fieldLabel}>{label}</Text>
                    <TextInput
                      style={[
                        globalStyles.fieldInput,
                        touched[field] &&
                          formikErrors[field] &&
                          globalStyles.fieldInputError,
                      ]}
                      placeholder={placeholder}
                      placeholderTextColor={colors.gray}
                      value={values[field]}
                      onChangeText={handleChange(field)}
                      onBlur={handleBlur(field)}
                      {...rest}
                    />
                    {touched[field] && formikErrors[field] && (
                      <Text style={globalStyles.fieldErrorText}>
                        {formikErrors[field]}
                      </Text>
                    )}
                  </View>
                ))}

                {/** Dropdowns */}
                {[
                  {
                    label: 'State',
                    field: 'state' as keyof typeof initialValues,
                    options: 'states',
                  },
                  {
                    label: 'Country',
                    field: 'country' as keyof typeof initialValues,
                    options: 'countries',
                  },
                  {
                    label: 'Category',
                    field: 'category' as keyof typeof initialValues,
                    options: 'categories',
                  },
                  {
                    label: 'Morning Workshop',
                    field: 'morningWorkshop' as keyof typeof initialValues,
                    options: 'workshops',
                  },
                  {
                    label: 'Afternoon Workshop',
                    field: 'afternoonWorkshop' as keyof typeof initialValues,
                    options: 'workshops',
                  },
                  {
                    label: 'Payment Mode',
                    field: 'paymentMode' as keyof typeof initialValues,
                    options: 'paymentModes',
                  },
                ].map(({ label, field, options }) => (
                  <Dropdown
                    key={field}
                    label={label}
                    value={values[field]}
                    options={
                      conferenceFormOptions[
                        options as keyof typeof conferenceFormOptions
                      ]
                    }
                    onSelect={v => setFieldValue(field, v)}
                    error={
                      touched[field] && formikErrors[field]
                        ? formikErrors[field]
                        : undefined
                    }
                  />
                ))}

                {/** Amount Display */}
                <View style={globalStyles.fieldContainer}>
                  <Text style={globalStyles.fieldLabel}>Amount</Text>
                  <Text style={globalStyles.fieldAmountText}>₹11000</Text>
                </View>

                {/** CAPTCHA */}
                {/* <View style={globalStyles.fieldContainer}>
                  <Text style={globalStyles.fieldLabel}>CAPTCHA</Text>
                  <View style={globalStyles.formCaptchaContainer}>
                    <View style={globalStyles.formCaptchaCodeContainer}>
                      <Text style={globalStyles.formCaptchaCode}>
                        {captcha}
                      </Text>
                    </View>
                    <TextInput
                      style={[
                        globalStyles.formCaptchaInput,
                        touched.captcha &&
                          formikErrors.captcha &&
                          globalStyles.fieldInputError,
                      ]}
                      placeholder="Enter CAPTCHA"
                      placeholderTextColor={colors.gray}
                      value={values.captcha}
                      onChangeText={v =>
                        setFieldValue('captcha', v.toUpperCase())
                      }
                      onBlur={handleBlur('captcha')}
                      maxLength={6}
                      autoCapitalize="characters"
                    />
                    <TouchableOpacity
                      onPress={() => {
                        refreshCaptcha();
                        setFieldValue('captcha', '');
                      }}
                      style={globalStyles.formRefreshButton}
                    >
                      <RefreshIcon size={20} color={colors.primary} />
                    </TouchableOpacity>
                  </View>
                  {touched.captcha && formikErrors.captcha && (
                    <Text style={globalStyles.fieldErrorText}>
                      {formikErrors.captcha}
                    </Text>
                  )}
                </View> */}
              </ScrollView>
            </KeyboardAvoidingView>

            <View style={globalStyles.footerBtContainer}>
              <GradientButton
                title="SUBMIT"
                onPress={() => formikHandleSubmit()}
              />
            </View>
          </>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
});

export default React.memo(ConferenceRegistrationForm);
