import React, { useState, useEffect, useRef } from 'react';
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
  Animated,
} from 'react-native';
import { Formik } from 'formik';
import globalStyles, { colors, spacing, borderRadius, Fonts } from '../../styles/globalStyles';
import Header from '../../components/Header';
import { Dropdown } from '../../components/Dropdown';
import { GradientButton } from '../../components/GradientButton';
import { RefreshIcon, InformationIcon } from '../../components/icons';
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";

import {
  membershipRegistrationSchema,
  generateCaptcha,

} from '../../schemas/membershipRegistrationSchema';
import { MembershipRegistrationFormValues } from '../../utils/types';
import {
  getCountries,
  CheckMembershipExists,
  CouponValidation,
  Country,
} from '../../services/membershipService';
import { ToastService } from '../../utils/service-handlers';
import { MembershipRegPayload, CouponPayload, CheckMembershipExistsPayload } from '../../utils/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const { width: screenWidth } = Dimensions.get('window');

interface Props {
  onBack: () => void;
  onNavigateToHome: () => void;
  onNavigateToMembershipPayment?: (data?: {
    userData?: {
      name?: string;
      email?: string;
      phone?: string;
      country?: string;
    };
    paymentData?: {
      subTotal?: number;
      coupon?: number;
      grandTotal?: number;
    };
  }) => void;
  onNavigateToLogin?: () => void;
  onSubmit?: (formData: MembershipRegistrationFormValues) => void;
}

const MembershipRegistrationForm: React.FC<Props> = ({
  onBack,
  onNavigateToHome,
  onNavigateToMembershipPayment,
  onSubmit,
}) => {
  const insets = useSafeAreaInsets();
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [couponApplied, setCouponApplied] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [countriesLoading, setCountriesLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [couponError, setCouponError] = useState<string | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2000, 0, 1));
  const [apiErrors, setApiErrors] = useState<{
    email?: string;
    phone?: string;
    general?: string;
  }>({});
  const [membershipPrice] = useState<number>(11800.0); // Default membership price
  const [showCouponSuccessModal, setShowCouponSuccessModal] = useState(false);
  
  // Animation values for coupon success modal
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  // Load countries on component mount
  React.useEffect(() => {
    const loadCountries = async () => {
      setCountriesLoading(true);
      try {
        const response = await getCountries();
        if (response?.success && response?.data) {
          setCountries(response.data);
        } else {
          console.error('Failed to load countries:', response?.message);
          ToastService.error('Error', response?.message || 'Failed to fetch countries');
        }
      } catch (error: any) {
        console.error('Failed to load countries:', error);
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          'Failed to fetch countries';
        ToastService.error('Error', errorMessage);
      } finally {
        setCountriesLoading(false);
      }
    };
    loadCountries();
  }, []);


  // Format countries for dropdown
  const countryOptions = React.useMemo(() => {
    if (!countries || countries.length === 0) {
      return [];
    }
    return countries.map(country => ({
      label: country.country_name,
      value: country.id.toString(),
    }));
  }, [countries]);
  const initialValues: MembershipRegistrationFormValues = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address1: '',
    city: '',
    country: '',
    hearAboutEFI: '',
    patientsPerYear: '',
    surgeriesPerYear: '',
    // paymentMode: 'Online Payment',
    couponCode: '',
    // captcha: '',
  };

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
  };

  const handleCouponApply = async (
    couponCode: string,
    email: string,
    setFieldValue: any,
  ) => {
    // Clear previous errors
    setCouponError(undefined);
    setCouponApplied(false);
    setCouponDiscount(0);

    // Validate coupon code is not empty
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    // Validate email is available (required for coupon validation)
    if (!email || !email.trim()) {
      setCouponError('Email is required for coupon validation');
      return;
    }

    setIsValidatingCoupon(true);

    try {
      // Prepare coupon validation payload
      const payload: CouponPayload = {
        email_id: email.trim(),
        coupon_code: couponCode.trim(),
      };

      console.log('=== COUPON VALIDATION REQUEST ===');
      console.log('Payload:', JSON.stringify(payload, null, 2));

      // Call coupon validation API
      const result = await CouponValidation(payload);

      console.log('=== COUPON VALIDATION RESPONSE ===');
      console.log('Response:', JSON.stringify(result, null, 2));
      console.log('==================================');

      if (result?.success === true) {
        // Coupon is valid
        const couponData = result?.data || {};
        const couponType = couponData?.coupon_type || '';
        const couponAmount = couponData?.coupon_amount || 0;
        
        console.log('=== COUPON DATA EXTRACTION ===');
        console.log('Coupon Type:', couponType);
        console.log('Coupon Amount:', couponAmount);
        console.log('Full Coupon Data:', JSON.stringify(couponData, null, 2));
        
        // Get current membership price to calculate discount for percentage type
        const membershipPriceValue = membershipPrice || 11800.0;
        
        console.log('Membership Price:', membershipPriceValue);
        
        let discountValue = 0;
        
        // Calculate discount based on coupon type
        if (couponType.toLowerCase() === 'percentage' || couponType.toLowerCase() === 'percent') {
          // Percentage discount: calculate from membership price
          const couponPercentage = typeof couponAmount === 'string' 
            ? parseFloat(couponAmount) 
            : couponAmount;
          console.log('Coupon Percentage:', couponPercentage);
          if (!isNaN(couponPercentage) && couponPercentage > 0) {
            discountValue = (membershipPriceValue * couponPercentage) / 100;
            console.log('Calculated Discount (Percentage):', discountValue);
          }
        } else {
          // Fixed amount discount: use coupon_amount directly
          discountValue = typeof couponAmount === 'string' 
            ? parseFloat(couponAmount) 
            : couponAmount;
          console.log('Fixed Amount Discount:', discountValue);
        }

        // Fallback to discount_amount or discount if coupon_amount not found
        if (!discountValue || discountValue === 0) {
          const fallbackAmount = result?.data?.discount_amount || result?.data?.discount || 0;
          discountValue = typeof fallbackAmount === 'string' 
            ? parseFloat(fallbackAmount) 
            : fallbackAmount;
          console.log('Using Fallback Discount:', discountValue);
        }

        console.log('Final Discount Value:', discountValue);
        console.log('==================================');

        setCouponApplied(true);
        setCouponDiscount(discountValue);
        setCouponError(undefined);
        
        // Show fun success modal
        setShowCouponSuccessModal(true);
        
        // Reset animations
        scaleAnim.setValue(0);
        opacityAnim.setValue(0);
        rotateAnim.setValue(0);
        
        // Animate modal entrance with fun effects
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 3,
            tension: 40,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(rotateAnim, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(rotateAnim, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
          ]),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
        
        // Auto-close modal after 3 seconds with fade out
        setTimeout(() => {
          Animated.parallel([
            Animated.timing(scaleAnim, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start(() => {
            setShowCouponSuccessModal(false);
            scaleAnim.setValue(0);
            opacityAnim.setValue(0);
            rotateAnim.setValue(0);
          });
        }, 3000);
      } else {
        // Coupon is invalid
        const errorMessage = result?.message || 'Invalid coupon code. Please try again.';
        setCouponApplied(false);
        setCouponDiscount(0);
        setCouponError(errorMessage);
      }
    } catch (error: any) {
      // Handle network/request errors
      console.error('Coupon validation error:', error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Failed to validate coupon. Please try again.';

      setCouponApplied(false);
      setCouponDiscount(0);
      setCouponError(errorMessage);
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  // Convert date to DD-MM-YY format
  const formatDateForAPI = (dateString: string): string => {
    if (!dateString) return '';
    // If date is already in DD-MM-YY format, return as is
    if (dateString.includes('-') && dateString.length <= 8) {
      return dateString;
    }
    // If date is from DatePicker (selectedDate), format it
    if (selectedDate) {
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const year = String(selectedDate.getFullYear()).slice(-2);
      return `${day}-${month}-${year}`;
    }
    // Try to parse other date formats
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

  // Get country ID from country value
  const getCountryId = (countryValue: string): number => {
    if (!countryValue) return 0;
    // If countryValue is already a number (string), convert it
    const numValue = parseInt(countryValue, 10);
    if (!isNaN(numValue)) {
      return numValue;
    }
    // Find country by name or value
    const country = countries.find(
      c => c.id.toString() === countryValue || c.country_name === countryValue,
    );
    return country?.id || 0;
  };

  const handleSubmit = async (values: MembershipRegistrationFormValues) => {
    if (isSubmitting) return;

    // Log form values to see filled data
    console.log('=== FORM VALUES (Filled Data) ===');
    console.log(JSON.stringify(values, null, 2));
    console.log('================================');

    // Note: Formik validation happens automatically before onSubmit is called
    // If validation fails, onSubmit won't be called and errors will show below inputs
    setIsSubmitting(true);
    try {
      const SUB_TOTAL = membershipPrice;
      const discount = couponApplied ? couponDiscount : 0;
      const grandTotal = SUB_TOTAL - discount;

      // Prepare CheckMembershipExists API payload
      const checkPayload: CheckMembershipExistsPayload = {
        email_id: values.email,
        phone_number: values.phone,
      };

      // Log API payload being sent
      console.log('=== CHECK MEMBERSHIP EXISTS - API PAYLOAD ===');
      console.log(JSON.stringify(checkPayload, null, 2));
      console.log('=============================================');

      // Call CheckMembershipExists API
      const result = await CheckMembershipExists(checkPayload);

      // Log API response
      console.log('=== CHECK MEMBERSHIP EXISTS - API RESPONSE ===');
      console.log(JSON.stringify(result, null, 2));
      console.log('=============================================');

      // Check for email_exists and phone_exists flags first (even if success is true)
      const emailExists = result?.data?.email_exists === true;
      const phoneExists = result?.data?.phone_exists === true;
      const hasExistsError = emailExists || phoneExists;

      // Handle success response (only if no exists errors)
      if (result?.success === true && !hasExistsError) {
        // Clear API errors on success
        setApiErrors({});
        
        // Get country name from country value
        const selectedCountry = countries.find(
          c => c.id.toString() === values.country || c.country_name === values.country,
        );
        const countryName = selectedCountry?.country_name || values.country || '';

        // Prepare form data to pass to payment details page
        const paymentDetailsData = {
          formData: values, // Pass entire form data
          userData: {
            name: `${values.firstName} ${values.lastName}`.trim(),
            email: values.email,
            phone: values.phone,
            country: countryName,
          },
          paymentData: {
            subTotal: SUB_TOTAL,
            coupon: discount,
            grandTotal: grandTotal,
          },
        };

        // Log success result
        console.log('=== SUCCESS - Navigate to Payment Details ===');
        console.log('Payment Details Data:', JSON.stringify(paymentDetailsData, null, 2));
        console.log('============================================');
        
        // Call onSubmit if provided (for data handling)
        onSubmit?.(values);
        // Navigate to payment details page with data
        onNavigateToMembershipPayment?.(paymentDetailsData);
      } else if (hasExistsError || result?.success === false) {
        // Handle error response from API (including duplicate email/phone)
        const errorMessage = result?.message || result?.error || 'Check failed. Please try again.';
        const errorData = result?.data || result?.errors || {};
        
        console.log('=== API ERROR RESPONSE ===');
        console.log('Error Message:', errorMessage);
        console.log('Error Data:', JSON.stringify(errorData, null, 2));
        console.log('Full Result:', JSON.stringify(result, null, 2));
        console.log('Email Exists:', emailExists);
        console.log('Phone Exists:', phoneExists);
        
        // Check for email_exists and phone_exists flags first (priority)
        let emailError: string | undefined;
        let phoneError: string | undefined;
        
        if (emailExists || errorData.email_exists === true) {
          emailError = 'Email already exists';
        }
        if (phoneExists || errorData.phone_exists === true) {
          phoneError = 'Phone number already exists';
        }
        
        // Check if errors are in structured format (handle arrays and strings)
        if (!emailError && (errorData.email || errorData.email_id)) {
          const emailErr = errorData.email || errorData.email_id;
          emailError = Array.isArray(emailErr) ? emailErr[0] : String(emailErr);
        }
        if (!phoneError && (errorData.phone || errorData.phone_number || errorData.phoneNumber)) {
          const phoneErr = errorData.phone || errorData.phone_number || errorData.phoneNumber;
          phoneError = Array.isArray(phoneErr) ? phoneErr[0] : String(phoneErr);
        }
        
        // If no structured errors, check error message for keywords
        if (!emailError && !phoneError && errorMessage) {
          const lowerMessage = errorMessage.toLowerCase();
          
          // Check for common error patterns
          const emailKeywords = ['email', 'e-mail', 'email_id', 'email address'];
          const phoneKeywords = ['phone', 'mobile', 'phone_number', 'phone number', 'contact number', 'mobile number'];
          const duplicateKeywords = ['already exists', 'already registered', 'duplicate', 'taken', 'exists'];
          
          const hasEmailKeyword = emailKeywords.some(keyword => lowerMessage.includes(keyword));
          const hasPhoneKeyword = phoneKeywords.some(keyword => lowerMessage.includes(keyword));
          const hasDuplicateKeyword = duplicateKeywords.some(keyword => lowerMessage.includes(keyword));
          
          // If message mentions both email and phone
          if (hasEmailKeyword && hasPhoneKeyword) {
            if (hasDuplicateKeyword) {
              emailError = emailError || 'Email already exists';
              phoneError = phoneError || 'Phone number already exists';
            } else {
              // Try to split the message
              if (lowerMessage.includes(' and ') || lowerMessage.includes(',')) {
                const parts = errorMessage.split(/ and |, /i);
                const emailPart = parts.find((p: string) => emailKeywords.some(k => p.toLowerCase().includes(k)));
                const phonePart = parts.find((p: string) => phoneKeywords.some(k => p.toLowerCase().includes(k)));
                emailError = emailError || emailPart || (hasDuplicateKeyword ? 'Email already exists' : errorMessage);
                phoneError = phoneError || phonePart || (hasDuplicateKeyword ? 'Phone number already exists' : errorMessage);
              } else {
                emailError = emailError || (hasDuplicateKeyword ? 'Email already exists' : errorMessage);
                phoneError = phoneError || (hasDuplicateKeyword ? 'Phone number already exists' : errorMessage);
              }
            }
          } else if (hasEmailKeyword && !emailError) {
            // Only email error
            emailError = hasDuplicateKeyword ? 'Email already exists' : errorMessage;
          } else if (hasPhoneKeyword && !phoneError) {
            // Only phone error
            phoneError = hasDuplicateKeyword ? 'Phone number already exists' : errorMessage;
          }
        }
        
        console.log('=== PARSED ERRORS ===');
        console.log('Email Error:', emailError);
        console.log('Phone Error:', phoneError);
        
        // Show toast messages for errors
        if (emailError && phoneError) {
          ToastService.error('Validation Error', 'Email and phone number already exist');
        } else if (emailError) {
          ToastService.error('Validation Error', emailError);
        } else if (phoneError) {
          ToastService.error('Validation Error', phoneError);
        } else if (errorMessage) {
          ToastService.error('Error', errorMessage);
        }
        
        // Set API errors - show below input fields
        setApiErrors({ 
          email: emailError, 
          phone: phoneError, 
          general: (!emailError && !phoneError) ? errorMessage : undefined
        });
      }
    } catch (error: any) {
      // Handle network/request errors
      console.error('Check membership exists error:', error);
      const errorResponse = error?.response?.data || {};
      const errorMessage =
        errorResponse?.message ||
        errorResponse?.error ||
        error?.message ||
        'An unexpected error occurred. Please try again.';
      
      const errorData = errorResponse?.data || errorResponse?.errors || {};
      
      // Check for structured error data first (common in 422 validation errors)
      let emailError: string | undefined;
      let phoneError: string | undefined;
      
      if (errorData.email || errorData.email_id) {
        emailError = Array.isArray(errorData.email) 
          ? errorData.email[0] 
          : (errorData.email || errorData.email_id);
      }
      if (errorData.phone || errorData.phone_number || errorData.phoneNumber) {
        phoneError = Array.isArray(errorData.phone) 
          ? errorData.phone[0] 
          : (errorData.phone || errorData.phone_number || errorData.phoneNumber);
      }
      
      // If no structured errors, check error message for keywords (especially for 422 status)
      if (error?.response?.status === 422) {
        if (!emailError && !phoneError) {
          const lowerMessage = errorMessage.toLowerCase();
          
          // More comprehensive keyword matching
          const emailKeywords = ['email', 'e-mail', 'email_id', 'email address'];
          const phoneKeywords = ['phone', 'mobile', 'phone_number', 'phone number', 'contact number'];
          
          if (emailKeywords.some(keyword => lowerMessage.includes(keyword))) {
            emailError = errorMessage;
          } else if (phoneKeywords.some(keyword => lowerMessage.includes(keyword))) {
            phoneError = errorMessage;
          }
        }
      }
      
      // Show toast messages for errors
      if (emailError && phoneError) {
        ToastService.error('Validation Error', 'Email and phone number already exist');
      } else if (emailError) {
        ToastService.error('Validation Error', emailError);
      } else if (phoneError) {
        ToastService.error('Validation Error', phoneError);
      } else {
        ToastService.error('Error', errorMessage);
      }
      
      // Set API errors
      if (emailError || phoneError) {
        setApiErrors({ 
          email: emailError, 
          phone: phoneError, 
          general: undefined 
        });
      } else {
        setApiErrors({ 
          general: errorMessage, 
          email: undefined, 
          phone: undefined 
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <>
    <View style={styles.container}>
        <Header
          title="Membership Registration"
          onBack={onBack}
          onNavigateToHome={onNavigateToHome}
          onMenuItemPress={(id: any) => console.log('Menu:', id)}
        />
        
 <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 2}
              style={{ flex: 1 }}
            >
        <Formik
        initialValues={initialValues}
        validationSchema={membershipRegistrationSchema(captcha)}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {(        {
          values,
          errors: formikErrors,
          touched,
          handleChange,
          handleBlur,
          setFieldValue,
          setFieldTouched,
          handleSubmit: formikHandleSubmit,
        }) => {
          // Mark fields as touched when API errors occur
          React.useEffect(() => {
            if (apiErrors.email) {
              setFieldTouched('email', true);
            }
            if (apiErrors.phone) {
              setFieldTouched('phone', true);
            }
          }, [apiErrors.email, apiErrors.phone, setFieldTouched]);

          return (
            <>
           
           
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={
                  globalStyles.formContainer}
                keyboardShouldPersistTaps="handled"
              >

                {/** Professionals Section */}
                <View style={styles.professionalsSection}>
                  <Text style={styles.professionalsTitle}>Professionals</Text>
                  <Text style={styles.professionalsDescription}>
                  Get access to exclusive content
                  </Text>
                  <Text style={styles.professionalsPrice}>
                    {`${membershipPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₹`}
                  </Text>
                </View>

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
                ].map(({ label, field, placeholder, ...rest }) => {
                  // Check if this is email or phone field for API errors
                  const isEmail = field === 'email';
                  const isPhone = field === 'phone';
                  const apiError = isEmail ? apiErrors.email : isPhone ? apiErrors.phone : undefined;
                  const hasError = (touched[field] && formikErrors[field]) || apiError;
                  
                  return (
                    <View key={field} style={globalStyles.fieldContainer}>
                      <Text style={globalStyles.fieldLabel}>{label}</Text>
                      <TextInput
                        style={[
                          globalStyles.fieldInput,
                          hasError && globalStyles.fieldInputError,
                        ]}
                        placeholder={placeholder}
                        placeholderTextColor={colors.gray}
                        value={values[field]}
                        onChangeText={(text) => {
                          handleChange(field)(text);
                          // Clear API error when user starts typing
                          if (isEmail && apiErrors.email) {
                            setApiErrors(prev => ({ ...prev, email: undefined }));
                          }
                          if (isPhone && apiErrors.phone) {
                            setApiErrors(prev => ({ ...prev, phone: undefined }));
                          }
                        }}
                        onBlur={handleBlur(field)}
                        {...rest}
                      />
                      {/* Show API error first (more specific), then Formik validation error */}
                      {apiError ? (
                        <Text style={globalStyles.fieldErrorText}>
                          {apiError}
                        </Text>
                      ) : (
                        (touched[field] && formikErrors[field]) && (
                          <Text style={globalStyles.fieldErrorText}>
                            {formikErrors[field]}
                          </Text>
                        )
                      )}
                    </View>
                  );
                })}

                {/** Date of Birth Picker */}
                <View style={globalStyles.fieldContainer}>
                  <Text style={globalStyles.fieldLabel}>Date of Birth</Text>
                  <TouchableOpacity
                    style={[
                      globalStyles.dateInput,
                      touched.dateOfBirth &&
                        formikErrors.dateOfBirth &&
                        globalStyles.fieldInputError,
                    ]}
                    onPress={() => setShowPicker(true)}
                  >
                    <Text
                      style={[
                        globalStyles.fieldInput,
                        !values.dateOfBirth && { color: '#999' },
                        touched.dateOfBirth &&
                          formikErrors.dateOfBirth && {
                            color: colors.red,
                          },
                      ]}
                    >
                      {values.dateOfBirth ||
                        (selectedDate
                          ? selectedDate.toLocaleDateString('en-GB')
                          : 'Select Date of Birth')}
                    </Text>
                  </TouchableOpacity>

                  {showPicker && (
                    <DateTimePicker
                      value={selectedDate || new Date(2000, 0, 1)}
                      mode="date"
                      display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
                      onChange={(event, date) => {
                        setShowPicker(false);
                        if (date) {
                          setSelectedDate(date);
                          // Format date as DD-MM-YY and update form
                          const day = String(date.getDate()).padStart(2, '0');
                          const month = String(date.getMonth() + 1).padStart(
                            2,
                            '0',
                          );
                          const year = String(date.getFullYear());
                          const formattedDate = `${day}-${month}-${year}`;
                          setFieldValue('dateOfBirth', formattedDate);
                        }
                      }}
                      maximumDate={new Date()} // prevent selecting future dates
                    />
                  )}
                  {touched.dateOfBirth && formikErrors.dateOfBirth && (
                    <Text style={globalStyles.fieldErrorText}>
                      {formikErrors.dateOfBirth}
                    </Text>
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

                {/** Country Dropdown */}
                <Dropdown
                  label="Select Country"
                  value={values.country}
                  options={countryOptions || []}
                  onSelect={(v) => setFieldValue('country', v)}
                  error={
                    touched.country && formikErrors.country
                      ? formikErrors.country
                      : undefined
                  }
                  placeholder={
                    countriesLoading ? 'Loading countries...' : 'Select Country'
                  }
                  searchable={true}
                  searchPlaceholder="Search country..."
                />

                {/** How did you hear about EFI? - Text Input */}
                <View style={globalStyles.fieldContainer}>
                  <Text style={globalStyles.fieldLabel}>How did you hear about EFI?</Text>
                  <TextInput
                    style={[
                      globalStyles.fieldInput,
                      touched.hearAboutEFI &&
                        formikErrors.hearAboutEFI &&
                        globalStyles.fieldInputError,
                    ]}
                    placeholder="Enter how you heard about EFI"
                    placeholderTextColor={colors.gray}
                    value={values.hearAboutEFI}
                    onChangeText={handleChange('hearAboutEFI')}
                    onBlur={handleBlur('hearAboutEFI')}
                  />
                  {touched.hearAboutEFI && formikErrors.hearAboutEFI && (
                    <Text style={globalStyles.fieldErrorText}>
                      {formikErrors.hearAboutEFI}
                    </Text>
                  )}
                </View>

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

                {/** Payment Mode Dropdown 
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
                />*/}

      

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
                      onChangeText={(text) => {
                        handleChange('couponCode')(text);
                        // Clear coupon state when user types
                        if (couponApplied || couponError) {
                          setCouponApplied(false);
                          setCouponDiscount(0);
                          setCouponError(undefined);
                        }
                      }}
                    />
                    <TouchableOpacity
                      style={[
                        styles.applyButton,
                        isValidatingCoupon && styles.applyButtonDisabled,
                      ]}
                      onPress={() =>
                        handleCouponApply(values.couponCode, values.email, setFieldValue)
                      }
                      disabled={isValidatingCoupon}
                    >
                      <Text style={styles.applyButtonText}>
                        {isValidatingCoupon ? 'VALIDATING...' : 'APPLY'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {couponApplied && (
                    <Text style={styles.couponSuccess}>
                      Coupon applied successfully!{couponDiscount > 0 ? ` Discount: ₹${couponDiscount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : ''}
                    </Text>
                  )}
                  {couponError && (
                    <Text style={styles.couponError}>
                      {couponError}
                    </Text>
                  )}
                </View>
{/* 
                <View style={[styles.professionalsSection, {marginBottom:spacing.xxl} ]}>
                  <Text style={styles.professionalsTitle}>Subtotal</Text>
                  <View style={styles.subtotalContainer}>
                  <Text style={[styles.professionalsDescription, {fontSize:screenWidth * 0.045,fontFamily:Fonts.SemiBold}]}>
                 Fee
                  </Text>
                  <Text style={styles.professionalsPrice}>11,800.00 ₹</Text>
                  </View>
                </View> */}

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
                {/* General API Error Display */}
                {apiErrors.general && (
                  <View style={styles.generalErrorContainer}>
                    <Text style={styles.generalErrorText}>
                      {apiErrors.general}
                    </Text>
                  </View>
                )}




              </ScrollView>

              <View style={[styles.footerContainer]}>
                <GradientButton
                  title={isSubmitting ? 'SUBMITTING...' : 'SUBMIT'}
                  onPress={() => {
                    setApiErrors(prev => ({ ...prev, general: undefined }));
                    formikHandleSubmit();
                  }}
                  disabled={isSubmitting}
                />
              </View>
    
            </>
          );
        }}
      </Formik>
         </KeyboardAvoidingView>

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
                

         <View style={[globalStyles.bulletRowLight, globalStyles.mb20]}>
            <View style={globalStyles.bulletDot} />
            <Text style={globalStyles.bulletText}>
            Access to exclusive content such as video recordings of conferences and masterclasses 
            </Text>
          </View> 

          <View style={[globalStyles.bulletRowLight, globalStyles.mb20]}>
            <View style={globalStyles.bulletDot} />
            <Text style={globalStyles.bulletText}>
            Participation in training programmes 
            </Text>
          </View>

          <View style={[globalStyles.bulletRowLight, globalStyles.mb20]}>
            <View style={globalStyles.bulletDot} />
            <Text style={globalStyles.bulletText}>
            Reduced fees for annual conferences and paid workshops, teaching programmes and masterclasses
            </Text>
          </View>

          <View style={[globalStyles.bulletRowLight, globalStyles.mb20]}>
            <View style={globalStyles.bulletDot} />
            <Text style={globalStyles.bulletText}>
            Membership to an exclusive and dedicated endometriosis foundation 
            </Text>
          </View>

          <View style={[globalStyles.bulletRowLight, globalStyles.mb20]}>
            <View style={globalStyles.bulletDot} />
            <Text style={globalStyles.bulletText}>
            Lifetime membership certification 
            </Text>
          </View>

          <View style={[globalStyles.bulletRowLight, globalStyles.mb20]}>
            <View style={globalStyles.bulletDot} />
            <Text style={globalStyles.bulletText}>
            The opportunity to elevate your skills and empower endometriosis management 
            </Text>
          </View>

          <View style={[globalStyles.bulletRowLight, globalStyles.mb20]}>
            <View style={globalStyles.bulletDot} />
            <Text style={globalStyles.bulletText}>
            Opportunity to be a faculty in future programs
            </Text>
          </View>

          
          <Text style={[globalStyles.h2, {fontSize: screenWidth * 0.037}]}>
          Lifetime Membership Fee For Professionals :
          </Text>
          <Text style={[globalStyles.h2, globalStyles.mb20, globalStyles.bold, {fontSize: screenWidth * 0.052}]}>
          INR 11,800 (Inclusive of GST)
          </Text>
         
               
              </View>

      
            </ScrollView>
          </View>
        </View>
      </Modal>

    </View>

    {/* Coupon Success Modal */}
    <Modal
      visible={showCouponSuccessModal}
      transparent={true}
      animationType="none"
      onRequestClose={() => setShowCouponSuccessModal(false)}
    >
      <TouchableOpacity
        style={styles.couponModalOverlay}
        activeOpacity={1}
        onPress={() => {
          Animated.parallel([
            Animated.timing(scaleAnim, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start(() => {
            setShowCouponSuccessModal(false);
            scaleAnim.setValue(0);
            opacityAnim.setValue(0);
            rotateAnim.setValue(0);
          });
        }}
      >
        <Animated.View
          style={[
            styles.couponModalContent,
            {
              transform: [
                {
                  scale: scaleAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1],
                  }),
                },
                {
                  rotate: rotateAnim.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: ['0deg', '10deg', '0deg'],
                  }),
                },
              ],
              opacity: opacityAnim,
            },
          ]}
          onStartShouldSetResponder={() => true}
        >
          {/* Success Icon with Animation */}
          <Animated.View style={styles.couponSuccessIconContainer}>
            <Text style={styles.couponSuccessEmoji}>🎉</Text>
            <Text style={styles.couponSuccessCheckmark}>✓</Text>
          </Animated.View>

          {/* Success Message */}
          <Text style={styles.couponSuccessModalTitle}>Coupon Applied!</Text>
          <Text style={styles.couponSuccessModalMessage}>
            {couponDiscount > 0
              ? `You saved ₹${couponDiscount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}!`
              : 'Coupon applied successfully!'}
          </Text>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
    </>
  );
};

const styles = StyleSheet.create({



  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  professionalsSection: {
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.md,
    padding: spacing.md,
 marginBottom: spacing.md,
   
  },
  professionalsTitle: {
    fontSize: screenWidth * 0.05,
    fontFamily: Fonts.Bold,
    color: colors.black,
     },
  professionalsDescription: {
    fontSize: screenWidth * 0.039,
    fontFamily: Fonts.Medium,
    color: colors.darkGray,
    lineHeight: screenWidth * 0.04,
  },
  professionalsPrice: {
    fontSize: screenWidth * 0.048,
    fontFamily: Fonts.Bold,
    color: colors.primary,
    marginTop: spacing.sm,
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
  couponError: {
    fontSize: screenWidth * 0.032,
    fontFamily: Fonts.Medium,
    color: '#F44336',
    marginTop: spacing.xs,
  },
  applyButtonDisabled: {
    opacity: 0.6,
  },

  subtotalContainer:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerContainer: {
    backgroundColor: colors.lightGray,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  generalErrorContainer: {
    backgroundColor: '#FFEBEE',
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  generalErrorText: {
    fontSize: screenWidth * 0.035,
    fontFamily: Fonts.Medium,
    color: '#F44336',
    lineHeight: 20,
  },
  couponModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  couponModalContent: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    width: screenWidth * 0.75,
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  couponSuccessIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    position: 'relative',
  },
  couponSuccessEmoji: {
    fontSize: 50,
    position: 'absolute',
  },
  couponSuccessCheckmark: {
    fontSize: 50,
    color: '#4CAF50',
    fontWeight: 'bold',
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 40,
    height: 40,
    borderRadius: 20,
    textAlign: 'center',
    lineHeight: 40,
    top: -5,
    right: -5,
  },
  couponSuccessModalTitle: {
    fontSize: screenWidth * 0.05,
    fontFamily: Fonts.Bold,
    color: colors.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  couponSuccessModalMessage: {
    fontSize: screenWidth * 0.04,
    fontFamily: Fonts.SemiBold,
    color: colors.black,
    textAlign: 'center',
  },
});

export default MembershipRegistrationForm;

