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
  Dimensions,
  ImageBackground,
  Modal,
} from 'react-native';
import { Formik } from 'formik';
import globalStyles, { colors, spacing, borderRadius, Fonts } from '../../styles/globalStyles';
import { Header } from '../../components/Header';
import { Dropdown } from '../../components/Dropdown';
import { GradientButton } from '../../components/GradientButton';
import { RefreshIcon, InformationIcon } from '../../components/icons';
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import {
  membershipRegistrationSchema,
  generateCaptcha,
  membershipFormOptions,
} from '../../schemas/membershipRegistrationSchema';
import { MembershipRegistrationFormValues } from '../../types/membershipRegistration';

const { width: screenWidth } = Dimensions.get('window');

interface Props {
  onBack: () => void;
  onNavigateToHome: () => void;
  onNavigateToMembershipPayment?: () => void;
  onNavigateToLogin?: () => void;
  onSubmit?: (formData: MembershipRegistrationFormValues) => void;
}

const MembershipRegistrationForm: React.FC<Props> = ({
  onBack,
  onNavigateToHome,
  onNavigateToMembershipPayment,
  onSubmit,
}) => {
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [couponApplied, setCouponApplied] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      setSelectedDate(selectedDate);  
    }
  };
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2000, 0, 1));
  const initialValues: MembershipRegistrationFormValues = {
    firstName: 'Hitesh',
    lastName: 'Bharadwaj',
    email: 'hiteshb755@gmail.com',
    phone: '9848923344',
    dateOfBirth: '01/01/1990',
    address1: 'Flt-123, Main Street, madhapur, Hyderabad, Telangana, India',
    city: 'Hyderabad',
    country: 'India',
    hearAboutEFI: 'Website',
    patientsPerYear: '10',
    surgeriesPerYear: '10',
    paymentMode: 'Online Payment',
    couponCode: '123456',
    captcha: 'ASASD',
  };

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
  };

  const handleCouponApply = (couponCode: string, setFieldValue: any) => {
    // Placeholder for coupon validation logic
    if (couponCode.trim()) {
      setCouponApplied(true);
      // You can add coupon validation logic here
    }
  };

  const handleSubmit = (values: MembershipRegistrationFormValues) => {
    // Call onSubmit if provided (for data handling)
    onSubmit?.(values);
    // Navigate to payment details page
    onNavigateToMembershipPayment?.();
  };


  return (
    <View style={styles.container}>
        <Header
          title="Membership Registration"
          onBack={onBack}
          onNavigateToHome={onNavigateToHome}
        />

        <Formik
        initialValues={initialValues}
        validationSchema={membershipRegistrationSchema(captcha)}
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
                    label: 'First Name',
                    field: 'firstName' as keyof typeof initialValues,
                    placeholder: 'Enter your first name',
                  },
                  {
                    label: 'Last Name',
                    field: 'lastName' as keyof typeof initialValues,
                    placeholder: 'Enter your last name',
                  },
                  {
                    label: 'Email',
                    field: 'email' as keyof typeof initialValues,
                    placeholder: 'Enter your email',
                    keyboardType: 'email-address' as const,
                  },
                  {
                    label: 'Phone',
                    field: 'phone' as keyof typeof initialValues,
                    placeholder: 'Enter your phone number',
                    keyboardType: 'phone-pad' as const,
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

                {/** Date of Birth Picker */}
                <View style={globalStyles.fieldContainer}>
                  <Text style={globalStyles.fieldLabel}>Date of Birth</Text>
      <TouchableOpacity
          style={globalStyles.dateInput}
        onPress={() => setShowPicker(true)}
      >
        <Text style={[globalStyles.fieldInput, !selectedDate && { color: "#999" }]}>
          {selectedDate
            ? selectedDate.toLocaleDateString("en-GB")
            : "Select Date of Birth"}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={selectedDate || new Date(2000, 0, 1)}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "calendar"}
          onChange={onChange}
          maximumDate={new Date()} // prevent selecting future dates
        />
      )}
                </View>

                {/** Address Field */}
                <View style={globalStyles.fieldContainer}>
                  <Text style={globalStyles.fieldLabel}>Address 1</Text>
                  <TextInput
                    style={[
                      globalStyles.fieldInput,
                      touched.address1 &&
                        formikErrors.address1 &&
                        globalStyles.fieldInputError,
                    ]}
                    placeholder="Enter your address"
                    placeholderTextColor={colors.gray}
                    value={values.address1}
                    onChangeText={handleChange('address1')}
                    onBlur={handleBlur('address1')}
                    multiline
                  />
                  {touched.address1 && formikErrors.address1 && (
                    <Text style={globalStyles.fieldErrorText}>
                      {formikErrors.address1}
                    </Text>
                  )}
                </View>

                {/** City Field */}
                <View style={globalStyles.fieldContainer}>
                  <Text style={globalStyles.fieldLabel}>City</Text>
                  <TextInput
                    style={[
                      globalStyles.fieldInput,
                      touched.city &&
                        formikErrors.city &&
                        globalStyles.fieldInputError,
                    ]}
                    placeholder="Enter your city"
                    placeholderTextColor={colors.gray}
                    value={values.city}
                    onChangeText={handleChange('city')}
                    onBlur={handleBlur('city')}
                  />
                  {touched.city && formikErrors.city && (
                    <Text style={globalStyles.fieldErrorText}>
                      {formikErrors.city}
                    </Text>
                  )}
                </View>

                {/** Dropdowns */}
                {[
                  {
                    label: 'Country',
                    field: 'country' as keyof typeof initialValues,
                    options: 'countries',
                  },
                  {
                    label: 'How did you hear about EFI?',
                    field: 'hearAboutEFI' as keyof typeof initialValues,
                    options: 'hearAboutEFI',
                  },
                ].map(({ label, field, options }) => (
                  <Dropdown
                    key={field}
                    label={label}
                    value={values[field]}
                    options={
                      membershipFormOptions[
                        options as keyof typeof membershipFormOptions
                      ]
                    }
                    onSelect={(v) => setFieldValue(field, v)}
                    error={
                      touched[field] && formikErrors[field]
                        ? formikErrors[field]
                        : undefined
                    }
                  />
                ))}

                {/** Numeric Fields */}
                {[
                  {
                    label: 'How many patients with endometriosis do you see per year?',
                    field: 'patientsPerYear' as keyof typeof initialValues,
                    placeholder: 'Enter number',
                  },
                  {
                    label: 'How many surgeries do you perform yearly?',
                    field: 'surgeriesPerYear' as keyof typeof initialValues,
                    placeholder: 'Enter number',
                  },
                ].map(({ label, field, placeholder }) => (
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
                      keyboardType="number-pad"
                    />
                    {touched[field] && formikErrors[field] && (
                      <Text style={globalStyles.fieldErrorText}>
                        {formikErrors[field]}
                      </Text>
                    )}
                  </View>
                ))}

                {/** Payment Mode Dropdown */}
                <Dropdown
                  label="Payment Mode"
                  value={values.paymentMode}
                  options={membershipFormOptions.paymentModes}
                  onSelect={(v) => setFieldValue('paymentMode', v)}
                  error={
                    touched.paymentMode && formikErrors.paymentMode
                      ? formikErrors.paymentMode
                      : undefined
                  }
                />

                {/** Professionals Section */}
                <View style={styles.professionalsSection}>
                  <Text style={styles.professionalsTitle}>Professionals</Text>
                  <Text style={styles.professionalsDescription}>
                    Access to exclusive content such as video recordings of
                    conferences and masterclasses
                  </Text>
                  <Text style={styles.professionalsPrice}>11,800.00 ₹</Text>
                </View>

                {/** Coupon Code Section */}
                <View style={styles.couponSection}>
                  <Text style={styles.couponLabel}>
                    If you have a coupon code, please apply it below
                  </Text>
                  <View style={styles.couponInputContainer}>
                    <TextInput
                      style={styles.couponInput}
                      placeholder="Enter Coupon Code"
                      placeholderTextColor={colors.gray}
                      value={values.couponCode}
                      onChangeText={handleChange('couponCode')}
                    />
                    <TouchableOpacity
                      style={styles.applyButton}
                      onPress={() =>
                        handleCouponApply(values.couponCode, setFieldValue)
                      }
                    >
                      <Text style={styles.applyButtonText}>APPLY</Text>
                    </TouchableOpacity>
                  </View>
                  {couponApplied && (
                    <Text style={styles.couponSuccess}>
                      Coupon applied successfully!
                    </Text>
                  )}
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
                      onChangeText={(v) =>
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

       {/* Floating Info Button */}
       <TouchableOpacity
        style={globalStyles.floatingInfoButton}
        onPress={() => setIsModalVisible(true)}
      >
        <View style={globalStyles.floatingInfoButtonInner}>
          <InformationIcon size={50} />
        </View>
      </TouchableOpacity>

         {/* Information Modal */}
         <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={globalStyles.modalInfoOverlay}>
          <View style={globalStyles.modalInfoContainer}>
            <View style={globalStyles.modalInfoHeader}>
                <View>
              <Text style={globalStyles.modalInfoTitle}>MEMBERSHIP</Text>
              <Text style={globalStyles.modalInfoSubtitle}>Endometriosis Foundation of India</Text>
              </View>
              <TouchableOpacity
                style={globalStyles.modalInfoCloseButton}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={globalStyles.modalInfoCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={globalStyles.modalInfoContent}>
              {/* Important Section */}
              <View style={globalStyles.modalInfoSection}>
                <Text style={globalStyles.modalInfoRegularText}>
                Everyone who is interested in supporting us and the aims of 
                our foundation can join. Whether you are an expert,
                 a patient or a peers, we are happy to welcome you to our 
                 national and international network.
                </Text>

                <Text style={globalStyles.modalInfoSectionTitle}>Member benefits for professionals</Text>
                <Text style={globalStyles.modalInfoListItem}>
                    Access to exclusive content such as video recordings of conferences and masterclasses 
                </Text>
               
              </View>

      
            </ScrollView>
          </View>
        </View>
      </Modal>


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  professionalsSection: {

    marginVertical: spacing.md,
   
  },
  professionalsTitle: {
    fontSize: screenWidth * 0.04,
    fontFamily: Fonts.Bold,
    color: colors.black,
    marginBottom: spacing.xs,
  },
  professionalsDescription: {
    fontSize: screenWidth * 0.035,
    fontFamily: Fonts.Regular,
    color: colors.darkGray,
    marginBottom: spacing.sm,
    lineHeight: screenWidth * 0.05,
  },
  professionalsPrice: {
    fontSize: screenWidth * 0.045,
    fontFamily: Fonts.Bold,
    color: colors.primary,
  },
  couponSection: {
    backgroundColor: colors.lightGray,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginVertical: spacing.md,
    marginHorizontal: spacing.sm,

  },
  couponLabel: {
    fontSize: screenWidth * 0.035,
    fontFamily: Fonts.Medium,
    color: colors.black,
    marginBottom: spacing.sm,
  },
  couponInputContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  couponInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: screenWidth * 0.038,
    fontFamily: Fonts.Regular,
    color: colors.black,
    backgroundColor: colors.white,
  },
  applyButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius:100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: screenWidth * 0.038,
    fontFamily: Fonts.Bold,
    color: colors.white,
  },
  couponSuccess: {
    fontSize: screenWidth * 0.032,
    fontFamily: Fonts.Medium,
    color: '#4CAF50',
    marginTop: spacing.xs,
  },
});

export default MembershipRegistrationForm;

