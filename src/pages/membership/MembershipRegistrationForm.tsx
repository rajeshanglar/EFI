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
  Keyboard,
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

import { 
  Country,
  State,
  getCountries,
   getStates,
   getHearAboutSources,
   CheckMembershipExists,
   CouponValidation,
   getMembershipPrice,
  } from '../../services/staticService';
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
  onSubmit?: (formData: MembershipRegPayload) => void;
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
  const [states, setStates] = useState<State[]>([]);
  const [statesLoading, setStatesLoading] = useState(false);
  const [hearAboutSources, setHearAboutSources] = useState<Array<{ id: number; name: string; description: string; sort_order: number }>>([]);
  const [hearAboutSourcesLoading, setHearAboutSourcesLoading] = useState(false);
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
  const [membershipPrice, setMembershipPrice] = useState<number>(0);
  const [membershipPriceLoading, setMembershipPriceLoading] = useState(false);
  const [showCouponSuccessModal, setShowCouponSuccessModal] = useState(false);
  
  // Animation values for coupon success modal
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;


  React.useEffect(() => {
    // Load countries on component mount
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

   // Load hear about sources on component mount
    const loadHearAboutSources = async () => {
      setHearAboutSourcesLoading(true);
      try {
        const response = await getHearAboutSources();
        if (response?.success && response?.data) {
          setHearAboutSources(response.data);
        } else {
          console.error('Failed to load hear about sources:', response?.message);
        }
      } catch (error: any) {
        console.error('Failed to load hear about sources:', error);
      } finally {
        setHearAboutSourcesLoading(false);
      }
      };
     loadHearAboutSources();

       // Load membership price on component mount
       const loadMembershipPrice = async () => {
        setMembershipPriceLoading(true);
        try {
          const response = await getMembershipPrice();
          if (response?.success && response?.data?.value) {
            const price = parseFloat(response.data.value);
            if (!isNaN(price) && price > 0) {
              setMembershipPrice(price);
            }
          } else {
            console.error('Failed to load membership price:', response?.message);
          }
        } catch (error: any) {
          console.error('Failed to load membership price:', error);
        } finally {
          setMembershipPriceLoading(false);
        }
      };
      loadMembershipPrice();
  }, []);


  // Function to load states for a given country
  const loadStates = React.useCallback(async (countryId: number | string) => {
    const id = typeof countryId === 'string' ? parseInt(countryId, 10) : countryId;
    
    if (!id || id === 0) {
      setStates([]);
      return;
    }

    setStatesLoading(true);
    try {
      const response = await getStates(id);
      if (response?.success && response?.data) {
        setStates(response.data);
      } else {
        console.error('Failed to load states:', response?.message);
        setStates([]);
      }
    } catch (error: any) {
      console.error('Failed to load states:', error);
      setStates([]);
    } finally {
      setStatesLoading(false);
    }
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

  // Format states for dropdown
  const stateOptions = React.useMemo(() => {
    if (!states || states.length === 0) {
      return [];
    }
    return states.map(state => ({
      label: state.state_name,
      value: state.id.toString(),
    }));
  }, [states]);

  // Format hear about EFI options for dropdown
  const hearAboutEfiOptions = React.useMemo(() => {
    if (!hearAboutSources || hearAboutSources.length === 0) {
      return [];
    }
    // Sort by sort_order and map to dropdown format
    return hearAboutSources
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((source) => ({
        label: source.name,
        value: source.name,
      }));
  }, [hearAboutSources]);

  
  const initialValues: MembershipRegPayload & { state?: number; pin_code?: string } = {
    first_name: '',
    last_name: '',
    email_id: '',
    phone_number: '',
    dob: '',
    grand_total: 0,
    city: '',
    country: 0,
    state: 0,
    pin_code: '',
    hear_about_efi: '',
    patient_count: 0,
    surgery_count: 0,
    address: '',
    coupon_code: '',
    sub_total: 0,
    coupon_value: 0,
    source_type: '',
    payment_gateway: '',
    payment_method: '',
    payment_status: '',
    gateway_transaction_id: '',
    gateway_order_id: '',
    currency: '',
    payment_date: '',
    gateway_response: '',
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
        
        Keyboard.dismiss();
        console.log('=== COUPON DATA EXTRACTION ===');
        console.log('Coupon Type:', couponType);
        console.log('Coupon Amount:', couponAmount);
        console.log('Full Coupon Data:', JSON.stringify(couponData, null, 2));
        
        // Get current membership price to calculate discount for percentage type
        if (!membershipPrice || membershipPrice <= 0) {
          setCouponError('Membership price not available. Please refresh the page.');
          return;
        }
        
        console.log('Membership Price:', membershipPrice);
        
        let discountValue = 0;
        
        // Calculate discount based on coupon type
        if (couponType.toLowerCase() === 'percentage' || couponType.toLowerCase() === 'percent') {
          // Percentage discount: calculate from membership price
          const couponPercentage = typeof couponAmount === 'string' 
            ? parseFloat(couponAmount) 
            : couponAmount;
          console.log('Coupon Percentage:', couponPercentage);
          if (!isNaN(couponPercentage) && couponPercentage > 0) {
            discountValue = (membershipPrice * couponPercentage) / 100;
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

  const handleSubmit = async (values: MembershipRegPayload) => {
    if (isSubmitting) return;

    // Note: Formik validation happens automatically before onSubmit is called
    // If validation fails, onSubmit won't be called and errors will show below inputs
    setIsSubmitting(true);
    
    // Log form submission start
    console.log('\n');
    console.log('===============================================================');
    console.log('=== MEMBERSHIP REGISTRATION FORM SUBMIT STARTED ===');
    console.log('===============================================================');
    
    // Log complete form values (payload)
    console.log('=== FORM VALUES (PAYLOAD) ===');
    console.log(JSON.stringify(values, null, 2));
    console.log('===========================================');
    
    // Log individual field values for easy reading
    console.log('=== FORM FIELD VALUES ===');
    console.log('First Name:', values.first_name);
    console.log('Last Name:', values.last_name);
    console.log('Email ID:', values.email_id);
    console.log('Phone Number:', values.phone_number);
    console.log('Date of Birth:', values.dob);
    console.log('Address:', values.address);
    console.log('City:', values.city);
    console.log('Country:', values.country);
    console.log('Hear About EFI:', values.hear_about_efi);
    console.log('Patient Count:', values.patient_count);
    console.log('Surgery Count:', values.surgery_count);
      console.log('Coupon Code:', values.coupon_code || 'None');
      console.log('===========================================');
    try {
      if (!membershipPrice || membershipPrice <= 0) {
        ToastService.error('Error', 'Membership price not available. Please refresh the page.');
        setIsSubmitting(false);
        return;
      }
      
      const SUB_TOTAL = membershipPrice;
      const discount = couponApplied ? couponDiscount : 0;
      const grandTotal = SUB_TOTAL - discount;

      console.log('=== PAYMENT CALCULATION ===');
      console.log('Sub Total:', SUB_TOTAL);
      console.log('Coupon Applied:', couponApplied);
      console.log('Discount:', discount);
      console.log('Grand Total:', grandTotal);
      console.log('Coupon Code:', values.coupon_code || 'None');
      console.log('============================');

      // Prepare CheckMembershipExists API payload
      const checkPayload: CheckMembershipExistsPayload = {
        email_id: values.email_id,
        phone_number: values.phone_number,
      };

      // Log API payload being sent
      console.log('\n');
      console.log('===============================================================');
      console.log('=== CHECK MEMBERSHIP EXISTS - API REQUEST ===');
      console.log('===============================================================');
      console.log('=== API PAYLOAD ===');
      console.log(JSON.stringify(checkPayload, null, 2));
      console.log('Email ID:', checkPayload.email_id);
      console.log('Phone Number:', checkPayload.phone_number);
      console.log('==============================================');

      // Call CheckMembershipExists API
      const result = await CheckMembershipExists(checkPayload);

      // Log API response
      console.log('\n');
      console.log('===============================================================');
      console.log('=== CHECK MEMBERSHIP EXISTS - API RESPONSE ===');
      console.log('===============================================================');
      console.log('=== FULL API RESPONSE ===');
      console.log(JSON.stringify(result, null, 2));
      console.log('=== RESPONSE DETAILS ===');
      console.log('Success:', result?.success);
      console.log('Status Code:', result?.status);
      console.log('Message:', result?.message);
      console.log('Email Exists:', result?.data?.email_exists);
      console.log('Phone Exists:', result?.data?.phone_exists);
      console.log('=== RESPONSE DATA ===');
      console.log(JSON.stringify(result?.data, null, 2));
      console.log('===============================================================');

      // Check for email_exists and phone_exists flags first (even if success is true)
      const emailExists = result?.data?.email_exists === true;
      const phoneExists = result?.data?.phone_exists === true;
      const hasExistsError = emailExists || phoneExists;



      // Handle success response (only if no exists errors)
      if (result?.success === true && !hasExistsError) {
        console.log('\n');
        console.log('✅ ENTERING SUCCESS BLOCK');
        console.log('result?.data:', JSON.stringify(result?.data, null, 2));
        console.log('========================');
        // Clear API errors on success
        setApiErrors({});
        
        // Get country name from country value
        const selectedCountry = countries.find(
          c => c.id.toString() === values.country.toString() || c.country_name === values.country.toString(),
        );
        const countryName = selectedCountry?.country_name || values.country || '';

        // Prepare form data to pass to payment details page
        const paymentDetailsData = {
          formData: values, // Pass entire form data
          userData: {
            name: `${values.first_name} ${values.last_name}`.trim(),
            email: values.email_id,
            phone: values.phone_number,
            country: countryName.toString(),
          },
          paymentData: {
            subTotal: SUB_TOTAL,
            coupon: discount,
            grandTotal: grandTotal,
          },
        };

        // Log success result and payment details data
        console.log('\n');
        console.log('===============================================================');
        console.log('=== ✅ SUCCESS - Navigate to Payment Details ===');
        console.log('===============================================================');
        console.log('=== PAYMENT DETAILS PAYLOAD ===');
        console.log(JSON.stringify(paymentDetailsData, null, 2));
        console.log('\n=== Form Data ===');
        console.log(JSON.stringify(paymentDetailsData.formData, null, 2));
        console.log('\n=== User Data ===');
        console.log(JSON.stringify(paymentDetailsData.userData, null, 2));
        console.log('\n=== Payment Data ===');
        console.log(JSON.stringify(paymentDetailsData.paymentData, null, 2));
        console.log('\n=== Payment Calculation Details ===');
        console.log('Sub Total:', SUB_TOTAL);
        console.log('Coupon Discount:', discount);
        console.log('Grand Total:', grandTotal);
        console.log('===============================================================');
        console.log('✅ About to navigate to payment details page...');
        console.log('===============================================================');
        
        // Add a small delay to ensure logs are visible before navigation
        await new Promise<void>(resolve => setTimeout(() => resolve(), 100));
        
        // Call onSubmit if provided (for data handling)
        onSubmit?.(values);
        // Navigate to payment details page with data
        onNavigateToMembershipPayment?.(paymentDetailsData);
        
        console.log('✅ Navigation triggered');
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
        
        console.log('\n');
        console.log('===============================================================');
        console.log('=== CHECK MEMBERSHIP EXISTS - ERROR RESPONSE ===');
        console.log('===============================================================');
        console.log('=== FULL ERROR RESPONSE ===');
        console.log(JSON.stringify(result, null, 2));
        console.log('=== PARSED ERRORS ===');
        console.log('Email Error:', emailError);
        console.log('Phone Error:', phoneError);
        console.log('Email Exists:', emailExists);
        console.log('Phone Exists:', phoneExists);
        console.log('===============================================================\n');
        
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
      console.log('\n');
      console.log('===============================================================');
      console.log('=== CHECK MEMBERSHIP EXISTS - API ERROR (CATCH BLOCK) ===');
      console.log('===============================================================');
      console.error('=== ERROR OBJECT ===');
      console.error(JSON.stringify(error, null, 2));
      console.error('=== ERROR RESPONSE ===');
      console.error(JSON.stringify(error?.response, null, 2));
      
      const errorResponse = error?.response?.data || {};
      const errorMessage =
        errorResponse?.message ||
        errorResponse?.error ||
        error?.message ||
        'An unexpected error occurred. Please try again.';
      
      const errorData = errorResponse?.data || errorResponse?.errors || {};
      
      console.error('=== ERROR DETAILS ===');
      console.error('Error Message:', errorMessage);
      console.error('Error Status:', error?.response?.status);
      console.error('Error Data:', JSON.stringify(errorData, null, 2));
      
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
      console.log('===============================================================');
      console.log('=== FORM SUBMISSION FINISHED ===');
      console.log('===============================================================\n');
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
        {({
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
              setFieldTouched('email_id', true);
            }
            if (apiErrors.phone) {
              setFieldTouched('phone_number', true);
            }
          }, [apiErrors.email, apiErrors.phone, setFieldTouched]);

          // Set India as default country when countries are loaded
          React.useEffect(() => {
            if (countries.length > 0 && values.country === 0) {
              const india = countries.find(
                country => country.country_name.toLowerCase() === 'india'
              );
              if (india) {
                setFieldValue('country', india.id.toString());
                loadStates(india.id);
              }
            }
          }, [countries, values.country, setFieldValue, loadStates]);

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
                  {membershipPriceLoading ? (
                    <Text style={styles.professionalsPrice}>Loading...</Text>
                  ) : membershipPrice > 0 ? (
                    <Text style={styles.professionalsPrice}>
                      {`${membershipPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₹`}
                    </Text>
                  ) : (
                    <Text style={styles.professionalsPrice}>Price not available</Text>
                  )}
                </View>

                {/** Basic Info Fields */}
                {[
                  {
                    label: 'First Name *',
                    field: 'first_name' as keyof typeof initialValues,
                    placeholder: 'Enter your first name',
                  },
                  {
                    label: 'Last Name *',
                    field: 'last_name' as keyof typeof initialValues,
                    placeholder: 'Enter your last name',
                  },
                  {
                    label: 'Email *',
                    field: 'email_id' as keyof typeof initialValues,
                    placeholder: 'Enter your email',
                    keyboardType: 'email-address' as const,   
                    autoCapitalize: 'none' as const,
                    autoCorrect: false as const,               
                  },
                  {
                    label: 'Phone *',
                    field: 'phone_number' as keyof typeof initialValues,
                    placeholder: 'Enter your phone number',
                    keyboardType: 'phone-pad' as const,
                  },
                ].map(({ label, field, placeholder, ...rest }) => {
                  // Check if this is email or phone field for API errors
                  const isEmail = field === 'email_id';
                  const isPhone = field === 'phone_number';
                  const apiError = isEmail ? apiErrors.email : isPhone ? apiErrors.phone : undefined;
                  const hasError = (touched[field] && formikErrors[field]) || apiError;
                  
                  return (                  
                    <View key={field} style={globalStyles.fieldContainer}>
                      {/** RequiredAsterisk */}
                      <View style={{ flexDirection: 'row' }}>
                        {label.includes('*') ? (
                          <>
                            <Text style={globalStyles.fieldLabel}>
                              {label.replace(/\s*\*$/, '')}
                            </Text>
                            <Text style={[globalStyles.fieldLabel, { color: colors.red }]}>
                              {' *'}
                            </Text>
                          </>
                        ) : (
                          <Text style={globalStyles.fieldLabel}>{label}</Text>
                        )}
                      </View>
                      {/** RequiredAsterisk */}

                      <TextInput
                        style={[
                          globalStyles.fieldInput,
                          hasError && globalStyles.fieldInputError,
                        ]}
                        placeholder={placeholder}
                        placeholderTextColor={colors.gray}
                        value={values[field] as string}
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
                  <Text style={globalStyles.fieldLabel}>Date of Birth <Text style={{ color: colors.red }}>*</Text></Text>
                  <TouchableOpacity
                    style={[
                      globalStyles.dateInput,
                      touched.dob &&
                        formikErrors.dob &&
                        globalStyles.fieldInputError,
                    ]}
                    onPress={() => setShowPicker(true)}
                  >
                    <Text
                      style={[
                        globalStyles.fieldInput,
                        !values.dob && { color: '#000' },
                        touched.dob &&
                          formikErrors.dob && {
                            color: colors.red,
                          },
                      ]}
                    >
                      {values.dob ||
                        (selectedDate
                          ? selectedDate.toLocaleDateString('en-GB')
                          : 'Select Date of Birth')}
                    </Text>
                  </TouchableOpacity>

                  {showPicker && (
                    <DateTimePicker
                      value={selectedDate || new Date(2000, 0, 1)}
                      mode="date"
                      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                      onChange={(event: DateTimePickerEvent, date?: Date) => {
                        if (Platform.OS === 'android') {
                          setShowPicker(false);
                        }
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
                          setFieldValue('dob', formattedDate);
                        }
                      }}
                      maximumDate={new Date()} // prevent selecting future dates
                    />
                  )}
                  {touched.dob && formikErrors.dob && (
                    <Text style={globalStyles.fieldErrorText}>
                      {formikErrors.dob}
                    </Text>
                  )}
                </View>

         
                {/** Country Dropdown */}                
                <Dropdown
                  label="Select Country *"
                  value={values.country.toString()}
                  options={countryOptions || []}
                  onSelect={(v) => {
                    setFieldValue('country', v);
                    // Clear state when country changes
                    setFieldValue('state', 0);
                    // Load states for the selected country
                    loadStates(v);
                  }}
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

                {/** State Dropdown */}
                {values.country && values.country !== 0 && (
                  <Dropdown
                    label="Select State"
                    value={values.state ? values.state.toString() : ''}
                    options={stateOptions || []}
                    onSelect={(v) => setFieldValue('state', v)}
                    placeholder={
                      statesLoading
                        ? 'Loading states...'
                        : stateOptions.length === 0
                        ? 'No states available'
                        : 'Select State'
                    }
                    searchable={true}
                    searchPlaceholder="Search state..."
                  />
                )}

                       {/** City Field */}
                <View style={globalStyles.fieldContainer}>
                  <Text style={globalStyles.fieldLabel}>City <Text style={{ color: colors.red }}>*</Text></Text>
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

                {/** Address Field */}
               <View style={globalStyles.fieldContainer}>
                  <Text style={globalStyles.fieldLabel}>Postal Address <Text style={{ color: colors.red }}>*</Text></Text>
                  <TextInput
                    style={[
                      globalStyles.fieldInput,
                      touched.address &&
                        formikErrors.address &&
                        globalStyles.fieldInputError,
                    ]}
                    placeholder="Enter your postal address"
                    placeholderTextColor={colors.gray}
                    value={values.address}
                    onChangeText={handleChange('address')}
                    onBlur={handleBlur('address')}
                    multiline
                  />
                  {touched.address && formikErrors.address && (
                    <Text style={globalStyles.fieldErrorText}>
                      {formikErrors.address}
                    </Text>
                  )}
                </View>

                     {/** Pin Code Field */}
                <View style={globalStyles.fieldContainer}>
                  <Text style={globalStyles.fieldLabel}>Pin Code <Text style={{ color: colors.red }}>*</Text></Text>
                  <TextInput
                    style={[
                      globalStyles.fieldInput,
                      touched.pin_code &&
                        (formikErrors as any).pin_code &&
                        globalStyles.fieldInputError,
                    ]}
                    placeholder="Enter pin code"
                    placeholderTextColor={colors.gray}
                    value={values.pin_code || ''}
                    onChangeText={handleChange('pin_code')}
                    onBlur={handleBlur('pin_code')}
                    keyboardType="number-pad"                   
                  />
                  {touched.pin_code && (formikErrors as any).pin_code && (
                    <Text style={globalStyles.fieldErrorText}>
                      {(formikErrors as any).pin_code}
                    </Text>
                  )}
                </View>

                {/** How did you hear about EFI? - Dropdown */}
                <Dropdown
                  label="How did you hear about EFI?"
                  value={values.hear_about_efi}
                  options={hearAboutEfiOptions}
                  onSelect={(v) => setFieldValue('hear_about_efi', v)}
                  error={
                    touched.hear_about_efi && formikErrors.hear_about_efi
                      ? formikErrors.hear_about_efi
                      : undefined
                  }
                  placeholder={
                    hearAboutSourcesLoading 
                      ? 'Loading options...' 
                      : hearAboutEfiOptions.length === 0
                      ? 'No options available'
                      : 'Select how you heard about EFI'
                  }
                />

                {/** Numeric Fields */}
                {[
                  {
                    label: 'How many patients with endometriosis do you see per year?',
                    field: 'patient_count' as keyof typeof initialValues,
                    placeholder: 'Enter number',
                  },
                  {
                    label: 'How many surgeries do you perform yearly?',
                    field: 'surgery_count' as keyof typeof initialValues,
                    placeholder: 'Enter number',
                  },
                ].map(({ label, field, placeholder }) => (
                  <View key={field} style={globalStyles.fieldContainer}>
                    <Text style={globalStyles.fieldLabel}>{label} </Text>
                    <TextInput
                      style={[
                        globalStyles.fieldInput,
                        touched[field] &&
                          formikErrors[field] &&
                          globalStyles.fieldInputError,
                      ]}
                      placeholder={placeholder}
                      placeholderTextColor={colors.gray}
                      value={String(values[field] || '')}
                      onChangeText={(text) => {
                        const numValue = text === '' ? 0 : parseInt(text, 10) || 0;
                        setFieldValue(field, numValue);
                      }}
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
                      value={values.coupon_code}
                      autoCapitalize="characters"
                      onChangeText={(text) => {
                        handleChange('coupon_code')(text);
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
                        handleCouponApply(values.coupon_code, values.email_id, setFieldValue)
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
                      Coupon applied successfully!
                      {couponDiscount > 0 && (
                        <Text> Discount: ₹{couponDiscount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
                      )}
                    </Text>
                  )}
                  {couponError && (
                    <Text style={styles.couponError}>
                      {couponError}
                    </Text>
                  )}
                </View>

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
    marginHorizontal:0,

  },
  couponLabel: {
    fontSize: screenWidth * 0.033,
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

