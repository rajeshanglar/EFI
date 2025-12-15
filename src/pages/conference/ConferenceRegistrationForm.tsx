import React, { useState, useRef, useMemo } from 'react';
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
  Modal,
  Animated,
  Keyboard,
} from 'react-native';
import { Formik } from 'formik';
import globalStyles, {Fonts, colors, spacing } from '../../styles/globalStyles';
import Header from '../../components/Header';
import { Dropdown } from '../../components/Dropdown';
import { GradientButton } from '../../components/GradientButton';
import { InformationIcon, RefreshIcon } from '../../components/icons';
import {
  conferenceRegistrationSchema,
  generateCaptcha,
} from '../../schemas/conferenceRegistrationSchema';
import {
  Country,
  State, 
  getCountries,
   getStates,
   CouponValidation,
   CheckConferenceExists,
   CheckMembershipExists,
   GetMorningWorkshops,
   GetAfternoonWorkshops,
   GetConferenceCategories,
   SendEfiMemberVerificationOtp,
   VerifyEfiMemberOtp,
   CalculateConferencePrice,
  } from '../../services/staticService';

  import { ToastService } from '../../utils/service-handlers';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ConferenceRegPayload, CheckConferenceExistsPayload, CheckMembershipExistsPayload, CouponPayload } from '../../utils/types';
import { formatPrice } from '../../utils/currencyFormatter';
import { FailureModal } from '../../components/FailureModal';
import { EfiMemberOtpModal } from '../../components/EfiMemberOtpModal';
const { width: screenWidth } = Dimensions.get('window');

// Form values type that includes UI-only fields (captcha, coupon_code, category for validation)
interface ConferenceFormValues extends ConferenceRegPayload {
  coupon_code?: string;
  captcha?: string;
  category?: number | string; // For validation only, not sent in API payload
}

interface Props {
  registrationTier: string;
  selectedTicket?: {
    module_name?: string;
    categoryName?: string;
    ticket?: any;
    is_residential?: number;
    membershipType?: string;
    event_id?: number;
    module_id?: number;
    category_id?: number;
  } | null;
  onBack: () => void;
  onNavigateToHome: () => void;
  onNavigateToConferencePayment?: (
    formData: ConferenceRegPayload,
    paymentDetails?: {
      ticketInfo?: {
        module_name?: string;
        categoryName?: string;
        ticketName?: string;
        membershipType?: string;
      };
      userData?: {
        full_name?: string;
        email?: string;
        mobile?: string;
      };
      paymentData?: {
        ticket_amount?: number;
        workshop_amount?: number;
        sub_total?: number;
        gst_amount?: number;
        tax?: number;
        tax_amount?: number;
        grand_total?: number;
        currency?: string;
      };
      registrationPayload?: ConferenceRegPayload;
    }
  ) => void;
}

const ConferenceRegistrationForm: React.FC<Props> = ({
  registrationTier,
  selectedTicket,
  onBack,
  onNavigateToHome,
  onNavigateToConferencePayment,
}) => {
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [countries, setCountries] = useState<Country[]>([]);
  const [countriesLoading, setCountriesLoading] = useState(false);
  const [states, setStates] = useState<State[]>([]);
  const [statesLoading, setStatesLoading] = useState(false);
  const [apiErrors, setApiErrors] = useState<{
    email?: string;
    phone?: string;
    general?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [morningWorkshops, setMorningWorkshops] = useState<Array<{ id: number; name: string; description: string }>>([]);
  const [morningWorkshopsLoading, setMorningWorkshopsLoading] = useState(false);
  const [afternoonWorkshops, setAfternoonWorkshops] = useState<Array<{ id: number; name: string; description: string }>>([]);
  const [afternoonWorkshopsLoading, setAfternoonWorkshopsLoading] = useState(false);
  const [categories, setCategories] = useState<Array<{ id: number; name: string; description: string; is_residential: number }>>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [couponError, setCouponError] = useState<string | undefined>(undefined);
  const [conferencePrice, setConferencePrice] = useState<number>(0); // Will be updated from selectedTicket
  const [actualMembershipType, setActualMembershipType] = useState<string | undefined>(selectedTicket?.membershipType); // Track actual membership type (may change if user is not a member)
  const [calculatedPrice, setCalculatedPrice] = useState<{
    grand_total: number;
    currency: string;
    sub_total?: number;
    gst_amount?: number;
    gst_percentage?: number;
    ticket_amount?: number;
    workshop_amount?: number;
  } | null>(null);
  const [isCalculatingPrice, setIsCalculatingPrice] = useState(false);
  const [showCouponSuccessModal, setShowCouponSuccessModal] = useState(false);
  const [showMembershipAlert, setShowMembershipAlert] = useState(false);
  const [showEfiMemberOtpModal, setShowEfiMemberOtpModal] = useState(false);
  const [otpExpiryMinutes, setOtpExpiryMinutes] = useState<number>(15);
  const pendingFormValuesRef = useRef<ConferenceFormValues | null>(null);
  const skipMembershipCheckRef = useRef<boolean>(false);
  const efiMemberEmailRef = useRef<string>('');
  
  // Animation values for coupon success modal
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  
  // Function to calculate conference price
  const calculatePrice = React.useCallback(async (
    mappingId: number,
    memberType: string,
    morningWorkshopId: number = 0,
    afternoonWorkshopId: number = 0
  ) => {
    if (!mappingId || mappingId === 0) {
      console.log('Cannot calculate price: mapping_id is missing or 0');
      return;
    }

    setIsCalculatingPrice(true);
    try {
      const payload = {
        mapping_id: mappingId,
        member_type: memberType,
        morning_workshop_id: morningWorkshopId,
        afternoon_workshop_id: afternoonWorkshopId,
      };

      console.log('=== CALCULATE CONFERENCE PRICE API CALL ===');
      console.log('Payload:', JSON.stringify(payload, null, 2));

      const response = await CalculateConferencePrice(payload);

      console.log('=== CALCULATE CONFERENCE PRICE RESPONSE ===');
      console.log('Response:', JSON.stringify(response, null, 2));

      if (response?.success && response?.grand_total !== undefined) {
        setCalculatedPrice({
          grand_total: response.grand_total,
          currency: response.currency || 'INR',
          sub_total: response.sub_total,
          gst_amount: response.gst_amount,
          gst_percentage: response.gst_percentage,
          ticket_amount: response.ticket_amount,
          workshop_amount: response.workshop_amount,
        });
        setConferencePrice(response.grand_total);
        console.log('Price calculated successfully:', response.grand_total);
      } else {
        console.error('Failed to calculate price:', response?.message);
        ToastService.error('Error', response?.message || 'Failed to calculate price');
      }
    } catch (error: any) {
      console.error('Failed to calculate price:', error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to calculate price';
      ToastService.error('Error', errorMessage);
    } finally {
      setIsCalculatingPrice(false);
    }
  }, []);

  // Update actualMembershipType when selectedTicket changes
  React.useEffect(() => {
    if (selectedTicket?.ticket) {
      setActualMembershipType(selectedTicket.membershipType);
      // Price calculation will be handled by the workshops useEffect
      // Fallback to ticket price if mapping_id is not available
      const mappingId = selectedTicket.ticket?.mapping_id;
      if (!mappingId || mappingId === 0) {
        const ticketPrice = selectedTicket.membershipType === 'member' 
          ? selectedTicket.ticket.member_price 
          : selectedTicket.ticket.non_member_price;
        
        if (ticketPrice && ticketPrice > 0) {
          console.log('Updating conferencePrice from selectedTicket (fallback):', ticketPrice);
          setConferencePrice(ticketPrice);
        }
      }
    }
  }, [selectedTicket]);

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

    // Load workshops on component mount
    const loadWorkshops = async () => {
      // Load morning workshops
      setMorningWorkshopsLoading(true);
      try {
        const morningResponse = await GetMorningWorkshops();
        if (morningResponse?.success && morningResponse?.data) {
          setMorningWorkshops(morningResponse.data);
        } else {
          console.error('Failed to load morning workshops:', morningResponse?.message);
          ToastService.error('Error', morningResponse?.message || 'Failed to fetch morning workshops');
        }
      } catch (error: any) {
        console.error('Failed to load morning workshops:', error);
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          'Failed to fetch morning workshops';
        ToastService.error('Error', errorMessage);
      } finally {
        setMorningWorkshopsLoading(false);
      }

      // Load afternoon workshops
      setAfternoonWorkshopsLoading(true);
      try {
        const afternoonResponse = await GetAfternoonWorkshops();
        if (afternoonResponse?.success && afternoonResponse?.data) {
          setAfternoonWorkshops(afternoonResponse.data);
        } else {
          console.error('Failed to load afternoon workshops:', afternoonResponse?.message);
          ToastService.error('Error', afternoonResponse?.message || 'Failed to fetch afternoon workshops');
        }
      } catch (error: any) {
        console.error('Failed to load afternoon workshops:', error);
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          'Failed to fetch afternoon workshops';
        ToastService.error('Error', errorMessage);
      } finally {
        setAfternoonWorkshopsLoading(false);
      }
    };

    loadWorkshops();

    // Load categories on component mount
    const loadCategories = async () => {
      setCategoriesLoading(true);
      try {
        const response = await GetConferenceCategories();
        if (response?.success && response?.data) {
          setCategories(response.data);
        } else {
          console.error('Failed to load categories:', response?.message);
        }
      } catch (error: any) {
        console.error('Failed to load categories:', error);
      } finally {
        setCategoriesLoading(false);
      }
    };
    loadCategories();
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

    // Format morning workshops for dropdown
    const morningWorkshopOptions = React.useMemo(() => {
      if (!morningWorkshops || morningWorkshops.length === 0) {
        return [];
      }
      return morningWorkshops.map(workshop => ({
        label: workshop.name,
        value: workshop.id.toString(),
      }));
    }, [morningWorkshops]);

    // Format afternoon workshops for dropdown
    const afternoonWorkshopOptions = React.useMemo(() => {
      if (!afternoonWorkshops || afternoonWorkshops.length === 0) {
        return [];
      }
      return afternoonWorkshops.map(workshop => ({
        label: workshop.name,
        value: workshop.id.toString(),
      }));
    }, [afternoonWorkshops]);

    // Format categories for dropdown
    const categoryOptions = React.useMemo(() => {
      if (!categories || categories.length === 0) {
        return [];
      }
      return categories.map(category => ({
        label: category.name,
        value: category.id.toString(),
      }));
    }, [categories]);

  // Get initial efi_type from selectedTicket and create initialValues with useMemo
  const initialValues: ConferenceFormValues = useMemo(() => {
    const getInitialEfiType = () => {
      if (selectedTicket?.membershipType) {
        return selectedTicket.membershipType === 'member' ? 'member' : 'non-member';
      }
      return '';
    };

    return {
      full_name: '',
      email: '',
      mobile: '',
      institute: '',
      specialization: '',
      address: '',
      city: '',
      state: 0,
      pincode: '',
      country: 0,
      event_id: 0,
      mapping_id: 0,
      module_id: 0,
      category_id: 0,
      ticket_id: 0,
      efi_type: getInitialEfiType(),
      morning_workshop: 0,
      afternoon_workshop: 0,
      currency: '',
      source_type: '',
      ticket_amount: 0,
      workshop_amount: 0,
      sub_total: 0,
      tax: 0,
      tax_amount: 0,
      grand_total: 0,
      payment_status: '',
      gateway_transaction_id: '',
      gateway_order_id: '',
      payment_date: '',
      gateway_response: '',
      captcha: '',
      payment_gateway: '',
      payment_method: '',
    };
  }, [selectedTicket?.membershipType]);



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
        
        // Get current conference price to calculate discount for percentage type
        if (!conferencePrice || conferencePrice <= 0) {
          setCouponError('Conference price not available. Please refresh the page.');
          return;
        }
        
        console.log('Conference Price:', conferencePrice);
        
        let discountValue = 0;
        
        // Calculate discount based on coupon type
        if (couponType.toLowerCase() === 'percentage' || couponType.toLowerCase() === 'percent') {
          // Percentage discount: calculate from conference price
          const couponPercentage = typeof couponAmount === 'string' 
            ? parseFloat(couponAmount) 
            : couponAmount;
          console.log('Coupon Percentage:', couponPercentage);
          if (!isNaN(couponPercentage) && couponPercentage > 0) {
            discountValue = (conferencePrice * couponPercentage) / 100;
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
        
        // Update form values with coupon data
        setFieldValue('coupon_code', couponCode.trim());
        setFieldValue('coupon_amount', discountValue);
        setFieldValue('coupon_type', couponType);
        setFieldValue('sub_total', conferencePrice);
        setFieldValue('grand_total', conferencePrice - discountValue);
        
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

  const handleSubmit = async (values: ConferenceFormValues) => {
    if (isSubmitting) return;
    
    console.log('=== CONFERENCE REGISTRATION FORM SUBMIT STARTED ===');
    console.log('Form Values:', JSON.stringify(values, null, 2));
    console.log('Selected Ticket:', JSON.stringify(selectedTicket, null, 2));
    console.log('Conference Price:', conferencePrice);
    console.log('Coupon Applied:', couponApplied);
    console.log('Coupon Discount:', couponDiscount);
    console.log('Skip Membership Check:', skipMembershipCheckRef.current);
    
    // Validate selectedTicket exists
    if (!selectedTicket || !selectedTicket.ticket) {
      const errorMsg = 'Ticket information is missing. Please go back and select a ticket again.';
      console.error('=== VALIDATION ERROR ===');
      console.error('Selected Ticket Missing:', selectedTicket);
      ToastService.error('Error', errorMsg);
      setApiErrors({ general: errorMsg });
      return;
    }

    // Validate required IDs
    if (!selectedTicket.event_id || !selectedTicket.module_id || !selectedTicket.category_id || !selectedTicket.ticket.id) {
      const errorMsg = 'Ticket details are incomplete. Please go back and select a ticket again.';
      console.error('=== VALIDATION ERROR ===');
      console.error('Missing IDs:', {
        event_id: selectedTicket.event_id,
        module_id: selectedTicket.module_id,
        category_id: selectedTicket.category_id,
        ticket_id: selectedTicket.ticket.id,
      });
      ToastService.error('Error', errorMsg);
      setApiErrors({ general: errorMsg });
      return;
    }
    
    setIsSubmitting(true);
    setApiErrors({});

    try {
      // Check membership if EFI Member is selected (only for Non-Residential Packages)
      // Skip check if we're continuing after user acknowledged the membership alert
      // or if membership type is already set to non-member
      let currentMembershipType = actualMembershipType || selectedTicket.membershipType;
      const shouldSkipCheck = skipMembershipCheckRef.current;
      skipMembershipCheckRef.current = false; // Reset flag after use
      
      // Skip membership check if:
      // 1. Flag is set (continuing after OK click)
      // 2. Membership type is already non-member (user already changed it)
      const isAlreadyNonMember = actualMembershipType === 'non-member' || currentMembershipType === 'non-member';
      
      if (!shouldSkipCheck && !isAlreadyNonMember && selectedTicket.is_residential === 0 && currentMembershipType === 'member') {
        console.log('=== CHECK MEMBERSHIP EXISTS API CALL ===');
        // Only check email, not phone number for conference registration
        const membershipPayload: CheckMembershipExistsPayload = {
          email_id: values.email,
          phone_number: '', // Not used for conference registration check
        };
        console.log('Membership Check Payload:', JSON.stringify(membershipPayload, null, 2));

        let isMember = false;
        try {
          const membershipResult = await CheckMembershipExists(membershipPayload);
          
          console.log('=== CHECK MEMBERSHIP EXISTS RESPONSE ===');
          console.log('Full Response:', JSON.stringify(membershipResult, null, 2));
          console.log('Email Exists:', membershipResult?.data?.email_exists);
          console.log('Status:', membershipResult?.status);
          console.log('Success:', membershipResult?.success);
          console.log('Message:', membershipResult?.message);

          // Check if user IS a member (only check email_exists, not phone_exists)
          // First check explicit flag in response data
          isMember = membershipResult?.data?.email_exists === true || 
                          membershipResult?.data?.email_exists === 1;
          
          // If no explicit flag, check for 409 status with "email already exists" message
          // This indicates the user IS a member (their email exists in membership system)
          if (!isMember && membershipResult?.status === 409) {
            const message = (membershipResult?.message || '').toLowerCase();
            if (message.includes('email already exists')) {
              isMember = true;
              console.log('=== MEMBERSHIP DETECTED FROM 409 STATUS WITH "EMAIL ALREADY EXISTS" MESSAGE ===');
            }
          }
          
          console.log('Is Member (from success response):', isMember);
        } catch (error: any) {
          // Handle error response
          console.log('=== CHECK MEMBERSHIP EXISTS ERROR RESPONSE ===');
          console.log('Error Status:', error?.response?.status);
          console.log('Error Response Data:', JSON.stringify(error?.response?.data, null, 2));
          
          const errorResponse = error?.response?.data || {};
          const errorStatus = error?.response?.status || errorResponse?.status;
          const errorMessage = (errorResponse?.message || error?.message || '').toLowerCase();
          
          // First check for explicit email_exists flag in error response (only email, not phone)
          isMember = errorResponse?.data?.email_exists === true || 
                      errorResponse?.data?.email_exists === 1 ||
                      errorResponse?.email_exists === true ||
                      errorResponse?.email_exists === 1;
          
          // If no explicit flag, check for 409 status with "email already exists" message
          // This indicates the user IS a member (their email exists in membership system)
          if (!isMember && errorStatus === 409) {
            if (errorMessage.includes('email already exists')) {
              isMember = true;
              console.log('=== MEMBERSHIP DETECTED FROM 409 ERROR WITH "EMAIL ALREADY EXISTS" MESSAGE ===');
            }
          }
                
        }

        if (!isMember) {
          // User is not an EFI Member, show alert and stop submission
          pendingFormValuesRef.current = values; // Store form values to continue later
          setShowMembershipAlert(true);
          setIsSubmitting(false);
          console.log('=== NON EFI MEMBER - STOPPING SUBMISSION ===');
          return; // Stop form submission
        } else {
          // User IS an EFI Member, show OTP verification screen
          console.log('=== EFI MEMBER - SHOWING OTP VERIFICATION ===');
          efiMemberEmailRef.current = values.email;
          pendingFormValuesRef.current = values; // Store form values to continue after OTP verification
          setShowEfiMemberOtpModal(true);
          setIsSubmitting(false);
          return; // Stop form submission until OTP is verified
        }
      }

      // Prepare CheckConferenceExists API payload
      const checkPayload: CheckConferenceExistsPayload = {
        email: values.email,
        mobile: values.mobile,
        event_id: selectedTicket?.event_id,
        mapping_id: selectedTicket?.ticket?.mapping_id,
      };

      console.log('=== CHECK CONFERENCE EXISTS API CALL (Second Call) ===');
      console.log('Check Payload:', JSON.stringify(checkPayload, null, 2));

      // Call CheckConferenceExists API
      let result: any;
      let emailExists = false;
      let mobileExists = false;
      
      try {
        result = await CheckConferenceExists(checkPayload);
        
        console.log('=== CHECK CONFERENCE EXISTS RESPONSE (Second Call) ===');
        console.log('Full Response:', JSON.stringify(result, null, 2));
        console.log('Success:', result?.success);
        console.log('Status:', result?.status);
        console.log('Message:', result?.message);
        
        // Check if response indicates failure (success: false with status 409)
        if (result?.success === false && result?.status === 409) {
          const responseMessage = result?.message || '';
          // Check if message indicates email exists
          if (responseMessage.toLowerCase().includes('email already exists')) {
            emailExists = true;
          }
          if (responseMessage.toLowerCase().includes('mobile number already exists') || 
              responseMessage.toLowerCase().includes('mobile already exists')) {
            mobileExists = true;
          }
        }
        
        // Check for email_exists and mobile_exists flags (check both possible response formats)
        if (!emailExists) {
          emailExists = result?.data?.email_exists === true || result?.data?.emailExists === true || result?.data?.email_exists === 1;
        }
        if (!mobileExists) {
          mobileExists = result?.data?.mobile_exists === true || result?.data?.mobileExists === true || result?.data?.mobile_exists === 1;
        }
        
        console.log('Email Exists:', emailExists);
        console.log('Mobile Exists:', mobileExists);
        console.log('Response Data:', JSON.stringify(result?.data, null, 2));
      } catch (error: any) {
        // Handle error response (409 status, etc.)
        console.log('=== CHECK CONFERENCE EXISTS ERROR RESPONSE (Second Call) ===');
        console.log('Error Status:', error?.response?.status);
        console.log('Error Response Data:', JSON.stringify(error?.response?.data, null, 2));
        
        const errorResponse = error?.response?.data || {};
        const errorMessage = errorResponse?.message || error?.message || '';
        const errorStatus = error?.response?.status || errorResponse?.status;
        
        console.log('Error Message:', errorMessage);
        console.log('Error Status:', errorStatus);
        
        // Check if status is 409
        if (errorStatus === 409) {
          // Check message for email/mobile exists
          const lowerMessage = errorMessage.toLowerCase();
          if (lowerMessage.includes('email already exists')) {
            emailExists = true;
            console.log('Email exists detected from 409 error message');
          }
          if (lowerMessage.includes('mobile number already exists') || 
              lowerMessage.includes('mobile already exists')) {
            mobileExists = true;
            console.log('Mobile exists detected from 409 error message');
          }
        }
        
        // Also check response data structure
        if (!emailExists) {
          emailExists = errorResponse?.data?.email_exists === true || 
                       errorResponse?.data?.emailExists === true || 
                       errorResponse?.data?.email_exists === 1 ||
                       errorResponse?.email_exists === true ||
                       errorResponse?.email_exists === 1;
        }
        if (!mobileExists) {
          mobileExists = errorResponse?.data?.mobile_exists === true || 
                        errorResponse?.data?.mobileExists === true || 
                        errorResponse?.data?.mobile_exists === 1 ||
                        errorResponse?.mobile_exists === true ||
                        errorResponse?.mobile_exists === 1;
        }
        
        // Set result to error response for further processing
        result = errorResponse;
        console.log('Final Email Exists (from error):', emailExists);
        console.log('Final Mobile Exists (from error):', mobileExists);
      }
      
      const hasExistsError = emailExists || mobileExists;
      console.log('Has Exists Error:', hasExistsError);

      // Always check for email_exists/mobile_exists first, regardless of success flag
      if (hasExistsError) {
        // Handle duplicate email/mobile error
        const errorMessage = result?.message || 'Check failed. Please try again.';
        const errorData = result?.data || {};

        let emailError: string | undefined;
        let phoneError: string | undefined;

        if (emailExists || errorData.email_exists === true || errorData.email_exists === 1) {
          emailError = 'Email already exists';
        }
        if (mobileExists || errorData.mobile_exists === true || errorData.mobile_exists === 1) {
          phoneError = 'Mobile number already exists';
        }

        // Check if errors are in structured format
        if (!emailError && errorData.email) {
          emailError = Array.isArray(errorData.email) ? errorData.email[0] : String(errorData.email);
        }
        if (!phoneError && (errorData.mobile || errorData.phone_number)) {
          const phoneErr = errorData.mobile || errorData.phone_number;
          phoneError = Array.isArray(phoneErr) ? phoneErr[0] : String(phoneErr);
        }

        // Show toast messages for errors
        if (emailError && phoneError) {
          ToastService.error('Validation Error', 'Email and mobile number already exist');
        } else if (emailError) {
          ToastService.error('Validation Error', emailError);
        } else if (phoneError) {
          ToastService.error('Validation Error', phoneError);
        } else {
          ToastService.error('Validation Error', errorMessage);
        }

        setApiErrors({
          email: emailError,
          phone: phoneError,
          general: !emailError && !phoneError ? errorMessage : undefined,
        });
      } else if (result?.success === true) {
        // Clear API errors on success
        setApiErrors({});
        
        // Use calculated price from API if available, otherwise calculate locally
        let TICKET_AMOUNT = 0;
        let WORKSHOP_AMOUNT = 0;
        let SUB_TOTAL = 0;
        let TAX_PERCENTAGE = 0;
        let TAX_AMOUNT = 0;
        let GRAND_TOTAL = 0;
        
        if (calculatedPrice && calculatedPrice.sub_total !== undefined) {
          // Use API calculated values
          TICKET_AMOUNT = calculatedPrice.ticket_amount || 0;
          WORKSHOP_AMOUNT = calculatedPrice.workshop_amount || 0;
          SUB_TOTAL = calculatedPrice.sub_total || 0;
          TAX_PERCENTAGE = calculatedPrice.gst_percentage || 0;
          TAX_AMOUNT = calculatedPrice.gst_amount || 0;
          GRAND_TOTAL = calculatedPrice.grand_total || 0;
          
          console.log('=== USING API CALCULATED PRICE ===');
          console.log('Ticket Amount (API):', TICKET_AMOUNT);
          console.log('Workshop Amount (API):', WORKSHOP_AMOUNT);
          console.log('Sub Total (API):', SUB_TOTAL);
          console.log('Tax Percentage (API):', TAX_PERCENTAGE);
          console.log('Tax Amount (API):', TAX_AMOUNT);
          console.log('Grand Total (API):', GRAND_TOTAL);
        } else {
          // Fallback to local calculation
          const ticketPrice = currentMembershipType === 'member' 
            ? selectedTicket.ticket?.member_price 
            : selectedTicket.ticket?.non_member_price;
          TICKET_AMOUNT = (ticketPrice && ticketPrice > 0) ? ticketPrice : 0;
          WORKSHOP_AMOUNT = 0;
          SUB_TOTAL = TICKET_AMOUNT;
          TAX_PERCENTAGE = 0;
          TAX_AMOUNT = 0;
          const discount = couponApplied ? couponDiscount : 0;
          GRAND_TOTAL = SUB_TOTAL - discount;
          
          console.log('=== USING LOCAL CALCULATED PRICE ===');
          console.log('Conference Price:', conferencePrice);
          console.log('Ticket Price:', ticketPrice);
          console.log('Sub Total:', SUB_TOTAL);
          console.log('Discount:', discount);
          console.log('Grand Total:', GRAND_TOTAL);
        }

        // Prepare ConferenceRegistration API payload - Updated structure
        const registrationPayload: ConferenceRegPayload = {
          full_name: values.full_name || '',
          email: values.email || '',
          mobile: values.mobile || '',
          institute: values.institute || '',
          specialization: values.specialization || '',
          address: values.address || '',
          city: values.city || '',
          state: typeof values.state === 'string' ? parseInt(values.state, 10) : (values.state || 0),
          pincode: values.pincode || '',
          country: typeof values.country === 'string' ? parseInt(values.country, 10) : (values.country || 0),
          event_id: selectedTicket?.event_id || 0,
          mapping_id: selectedTicket?.ticket?.mapping_id || 0,
          module_id: selectedTicket?.module_id || 0,
          category_id: selectedTicket?.category_id || 0,
          ticket_id: selectedTicket?.ticket?.id || 0,
          efi_type: currentMembershipType === 'member' ? 'member' : 'non-member',
          morning_workshop: typeof values.morning_workshop === 'string' ? parseInt(values.morning_workshop, 10) : (values.morning_workshop || 0),
          afternoon_workshop: typeof values.afternoon_workshop === 'string' ? parseInt(values.afternoon_workshop, 10) : (values.afternoon_workshop || 0),
          currency: calculatedPrice?.currency || selectedTicket?.ticket?.currency || 'INR',
          source_type: '',
          ticket_amount: TICKET_AMOUNT,
          workshop_amount: WORKSHOP_AMOUNT,
          sub_total: SUB_TOTAL,
          tax: TAX_PERCENTAGE,
          tax_amount: TAX_AMOUNT,
          grand_total: GRAND_TOTAL,
          payment_status: '',
          payment_gateway: '',
          payment_method: '',
          gateway_transaction_id: '',
          gateway_order_id: '',
          payment_date: '',
          gateway_response: '',
        };

        console.log('=== NAVIGATING TO PAYMENT PAGE ===');
        console.log('Calculated Values:');
        console.log('  - Sub Total:', SUB_TOTAL);
        console.log('  - Tax Amount:', TAX_AMOUNT);
        console.log('  - Grand Total:', GRAND_TOTAL);
        console.log('  - Currency:', calculatedPrice?.currency || selectedTicket?.ticket?.currency);
        console.log('Registration Payload:', JSON.stringify(registrationPayload, null, 2));
        console.log('Payload Breakdown:');
        console.log('  - Event ID:', registrationPayload.event_id);
        console.log('  - Module ID:', registrationPayload.module_id);
        console.log('  - Category ID:', registrationPayload.category_id);
        console.log('  - Ticket ID:', registrationPayload.ticket_id);
        console.log('  - Mapping ID:', registrationPayload.mapping_id);
        console.log('  - EFI Type:', registrationPayload.efi_type);
        console.log('  - Morning Workshop:', registrationPayload.morning_workshop);
        console.log('  - Afternoon Workshop:', registrationPayload.afternoon_workshop);

        // Navigate to payment page - Registration API will be called after payment success
        console.log('Navigating to payment page...');
        onNavigateToConferencePayment?.(registrationPayload, {
          ticketInfo: {
            membershipType: currentMembershipType,
            module_name: selectedTicket?.module_name,
            categoryName: selectedTicket?.categoryName,
            ticketName: selectedTicket?.ticket?.name,                 
          },
          userData: {
            full_name: values.full_name,
            email: values.email,
            mobile: values.mobile,
          },
          paymentData: {
            ticket_amount: TICKET_AMOUNT,
            workshop_amount: WORKSHOP_AMOUNT,
            sub_total: SUB_TOTAL,
            gst_amount: TAX_AMOUNT,
            tax: TAX_PERCENTAGE,
            grand_total: GRAND_TOTAL,
            currency: calculatedPrice?.currency || selectedTicket?.ticket?.currency || 'INR',
          },
          registrationPayload: registrationPayload,
        });
      } else if (result?.success === false) {
        // Handle error response from API (when success is explicitly false)
        const errorMessage = result?.message || 'Check failed. Please try again.';
        const errorData = result?.data || {};

        let emailError: string | undefined;
        let phoneError: string | undefined;

        // Check if errors are in structured format
        if (errorData.email) {
          emailError = Array.isArray(errorData.email) ? errorData.email[0] : String(errorData.email);
        }
        if (errorData.mobile || errorData.phone_number) {
          const phoneErr = errorData.mobile || errorData.phone_number;
          phoneError = Array.isArray(phoneErr) ? phoneErr[0] : String(phoneErr);
        }

        // Show toast messages for errors
        if (emailError && phoneError) {
          ToastService.error('Validation Error', 'Email and mobile number already exist');
        } else if (emailError) {
          ToastService.error('Validation Error', emailError);
        } else if (phoneError) {
          ToastService.error('Validation Error', phoneError);
        } else {
          ToastService.error('Validation Error', errorMessage);
        }

        setApiErrors({
          email: emailError,
          phone: phoneError,
          general: !emailError && !phoneError ? errorMessage : undefined,
        });
      }
    } catch (error: any) {
      console.error('=== CHECK CONFERENCE EXISTS ERROR ===');
      console.error('Error Type:', error?.constructor?.name);
      console.error('Error Message:', error?.message);
      console.error('Error Stack:', error?.stack);
      console.error('Full Error Object:', JSON.stringify(error, null, 2));
      if (error?.response) {
        console.error('Response Status:', error?.response?.status);
        console.error('Response Data:', JSON.stringify(error?.response?.data, null, 2));
      }
      
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'An error occurred while checking email and mobile. Please try again.';
      
      console.error('Final Error Message:', errorMessage);
      ToastService.error('Error', errorMessage);
      setApiErrors({ general: errorMessage });
    } finally {
      console.log('=== FORM SUBMISSION COMPLETED ===');
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Conference Registration Form"
        onBack={onBack}
        onNavigateToHome={onNavigateToHome}
        onMenuItemPress={(id: any) => console.log('Menu:', id)}
      />

      {/* Ticket Details Header */}
      {selectedTicket && selectedTicket.ticket && (
        <View style={styles.headerBottomConferenceDetails}>
          <View style={{ paddingBottom:20 }}>
          {selectedTicket.is_residential === 0 && (
              <Text style={styles.conferenHeaderNonResidential}>
                Non Residential Package
              </Text>
            )}

          <View style={styles.membershipTypeContainer}>
            {/* Display Membership Type (EFI Member or Non EFI Member) - Only for Non-Residential Packages */}
            {selectedTicket.is_residential === 0 && actualMembershipType && (
              <Text style={styles.membershipTypeText}>
                {actualMembershipType === 'member' ? 'EFI Member' : 'Non EFI Member'}, 
              </Text>
            )}


            {selectedTicket.module_name && (
              <Text style={styles.moduleName}>
                {selectedTicket.module_name}
              </Text>
            )}
          </View>

            <View style={styles.conferenHeaderTextContainer}>
              {selectedTicket.categoryName && (
                 <Text style={styles.conferenHeaderText}>
                  {selectedTicket.categoryName}
                </Text>
              )}
              {selectedTicket.ticket.name && (
                <>
                  <Text style={styles.conferenHeaderDot }>| </Text>
                  <Text style={styles.conferenHeaderText}>
                    {selectedTicket.ticket.name}
                  </Text>
                </>
              )}              
            </View>
            <View style={styles.conferenHeaderPriceContainer}>
            <Text style={styles.conferenHeaderPrice}>
            {isCalculatingPrice 
              ? 'Calculating...' 
              : calculatedPrice 
                ? formatPrice(calculatedPrice.grand_total, calculatedPrice.currency)
                : formatPrice(
                    actualMembershipType === 'member' 
                      ? selectedTicket.ticket.member_price 
                      : selectedTicket.ticket.non_member_price,
                    selectedTicket.ticket.currency
                  )
            }                
            </Text>
            <Text style={styles.withGSTText}> (With GST)</Text>
            </View>
          </View>
        </View>
      )}
      {!selectedTicket && (
      <View style={globalStyles.headerBottomContainer}>
        <Text style={globalStyles.HeaderBottomHeading}>{registrationTier}</Text>
      </View>
      )}
      <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 2}
              style={{ flex: 1 }}
            >
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
          setFieldTouched,
          setFieldError,
          handleSubmit: formikHandleSubmit,
          isValid,
        }) => {
          // Set category automatically from selectedTicket (since dropdown is commented out)
          React.useEffect(() => {
            if (selectedTicket?.category_id && !values.category) {
              setFieldValue('category', selectedTicket.category_id);
            }
          }, [selectedTicket?.category_id, setFieldValue]);

          // Set efi_type automatically from selectedTicket (always sync with ticket selection)
          React.useEffect(() => {
            if (selectedTicket?.membershipType) {
              const memberType = selectedTicket.membershipType === 'member' ? 'member' : 'non-member';
              setFieldValue('efi_type', memberType);
            }
          }, [selectedTicket?.membershipType, setFieldValue]);

          // Set field touched when API errors occur
          React.useEffect(() => {
            if (apiErrors.email) {
              setFieldTouched('email', true);
            }
            if (apiErrors.phone) {
              setFieldTouched('mobile', true);
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
                // Load states for India
                loadStates(india.id);
              }
            }
          }, [countries, values.country, setFieldValue]);

          // Recalculate price when workshops change
          React.useEffect(() => {
            if (selectedTicket?.ticket?.mapping_id && actualMembershipType) {
              const mappingId = selectedTicket.ticket.mapping_id;
              const memberType = actualMembershipType === 'member' ? 'member' : 'non-member';
              const morningWorkshopId = typeof values.morning_workshop === 'string' 
                ? parseInt(values.morning_workshop, 10) 
                : (values.morning_workshop || 0);
              const afternoonWorkshopId = typeof values.afternoon_workshop === 'string' 
                ? parseInt(values.afternoon_workshop, 10) 
                : (values.afternoon_workshop || 0);
              
              // Only calculate if at least one workshop is selected (or both are 0 for initial load)
              calculatePrice(mappingId, memberType, morningWorkshopId, afternoonWorkshopId);
            }
          }, [values.morning_workshop, values.afternoon_workshop, selectedTicket?.ticket?.mapping_id, actualMembershipType, calculatePrice]);

          return (
          <>
           
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={globalStyles.formContainer}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
              >            
                {apiErrors.general && (
                  <View style={globalStyles.fieldContainer}>
                    <Text style={globalStyles.fieldErrorText}>
                      {apiErrors.general}
                    </Text>
                  </View>
                )}

                {/** Basic Info Fields */}
                {[
                  {
                    label: 'Full Name',
                    field: 'full_name' as keyof typeof initialValues,
                    placeholder: 'Enter your full name',
                    required: true,
                  },
                  {
                    label: 'Email Id',
                    field: 'email' as keyof typeof initialValues,
                    placeholder: 'Enter your email',
                    keyboardType: 'email-address' as const,
                    required: true,
                  },
                  {
                    label: 'Phone Number',
                    field: 'mobile' as keyof typeof initialValues,
                    placeholder: 'Enter your phone number',
                    keyboardType: 'phone-pad' as const,
                    required: true,
                  },
                  {
                    label: 'Institute',
                    field: 'institute' as keyof typeof initialValues,
                    placeholder: 'Enter your institute name',
                    required: true,
                  },
                  {
                    label: 'Specialization',
                    field: 'specialization' as keyof typeof initialValues,
                    placeholder: 'Enter your specialization',
                    required: true,
                  },
                  {
                    label: 'Postal Address',
                    field: 'address' as keyof typeof initialValues,
                    placeholder: 'Enter your address',
                    multiline: true,
                    required: true,
                  },
                  
                  {
                    label: 'Pin Code',
                    field: 'pincode' as keyof typeof initialValues,
                    placeholder: 'Enter pin code',
                    keyboardType: 'number-pad' as const,
                    required: true,
                  },
                ].map(({ label, field, placeholder, required, ...rest }) => {
                  // Check if this is email or phone field for API errors
                  const isEmail = field === 'email';
                  const isPhone = field === 'mobile';
                  const apiError = isEmail ? apiErrors.email : isPhone ? apiErrors.phone : undefined;
                  const hasError = (touched[field] && formikErrors[field]) || apiError;

                  return (
                  <View key={field} style={globalStyles.fieldContainer}>
                      <Text style={globalStyles.fieldLabel}>
                        {label}
                        {required && <Text style={{ color: colors.red }}>*</Text>}                        
                      </Text>
                    <TextInput
                      style={[
                        globalStyles.fieldInput,
                          hasError && globalStyles.fieldInputError,
                      ]}
                      placeholder={placeholder}
                      placeholderTextColor={colors.gray}
                      autoCapitalize={isEmail ? 'none' : 'sentences'}
                      value={String(values[field] || '')}
                        onChangeText={(text) => {
                          // Convert email to lowercase
                          const processedText = isEmail ? text.toLowerCase() : text;
                          handleChange(field)(processedText);
                          // Clear Formik error when user starts typing
                          if (formikErrors[field]) {
                            setFieldError(field, undefined);
                          }
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
                        touched[field] && formikErrors[field] ? (
                      <Text style={globalStyles.fieldErrorText}>
                        {formikErrors[field]}
                      </Text>
                        ) : null
                    )}
                  </View>
                  );
                })}

                {/** Dropdowns */}

                        {/** Country Dropdown */}                
                        <Dropdown
                  label="Select Country *"
                  value={values.country.toString()}
                  options={countryOptions || []}
                  onSelect={(v) => {
                    setFieldValue('country', v);
                    // Clear error when user selects
                    if (formikErrors.country) {
                      setFieldError('country', undefined);
                    }
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
                    onSelect={(v) => {
                      setFieldValue('state', v);
                      // Clear error when user selects
                      if (formikErrors.state) {
                        setFieldError('state', undefined);
                      }
                    }}
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
                  <Text style={globalStyles.fieldLabel}>
                    City <Text style={{ color: colors.red }}>*</Text>
                  </Text>
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
                    onChangeText={(text) => {
                      handleChange('city')(text);
                      // Clear error when user starts typing
                      if (formikErrors.city) {
                        setFieldError('city', undefined);
                      }
                    }}
                    onBlur={handleBlur('city')}
                  />
                  {touched.city && formikErrors.city ? (
                    <Text style={globalStyles.fieldErrorText}>
                      {formikErrors.city}
                    </Text>
                  ) : null}
                </View>

      

                {/** Category Dropdown */}
                  {/* <Dropdown
                  label="Category *"
                  value={String(values.category || '')}
                  options={categoryOptions}
                  onSelect={v => {
                    // Convert to integer for API
                    const categoryId = typeof v === 'string' ? parseInt(v, 10) : v;
                    setFieldValue('category', categoryId);
                    setFieldTouched('category', true);
                    // Clear error when user selects
                    if (formikErrors.category) {
                      setFieldError('category', undefined);
                    }
                  }}
                    error={
                    touched.category && formikErrors.category
                      ? formikErrors.category
                        : undefined
                    }
                  placeholder={
                    categoriesLoading
                      ? 'Loading categories...'
                      : categoryOptions.length === 0
                      ? 'No categories available'
                      : 'Select Category'
                  }
                  searchable={true}
                  searchPlaceholder="Search category..."
                /> */}

                {/** Morning Workshop Dropdown */}
                  <Dropdown
                  label="Morning Workshop *"
                  value={String(values.morning_workshop || '')}
                  options={morningWorkshopOptions}
                  onSelect={v => {
                    setFieldValue('morning_workshop', v);
                    setFieldTouched('morning_workshop', true);
                    // Clear error when user selects
                    if (formikErrors.morning_workshop) {
                      setFieldError('morning_workshop', undefined);
                    }
                  }}
                    error={
                    touched.morning_workshop && formikErrors.morning_workshop
                      ? formikErrors.morning_workshop
                        : undefined
                    }
                  placeholder={
                    morningWorkshopsLoading
                      ? 'Loading morning workshops...'
                      : morningWorkshopOptions.length === 0
                      ? 'No workshops available'
                      : 'Select Morning Workshop'
                  }
                  searchable={true}
                  searchPlaceholder="Search morning workshop..."
                />

                {/** Afternoon Workshop Dropdown */}
                <Dropdown
                  label="Afternoon Workshop *"
                  value={String(values.afternoon_workshop || '')}
                  options={afternoonWorkshopOptions}
                  onSelect={v => {
                    setFieldValue('afternoon_workshop', v);
                    setFieldTouched('afternoon_workshop', true);
                    // Clear error when user selects
                    if (formikErrors.afternoon_workshop) {
                      setFieldError('afternoon_workshop', undefined);
                    }
                  }}
                  error={
                    touched.afternoon_workshop && formikErrors.afternoon_workshop
                      ? formikErrors.afternoon_workshop
                      : undefined
                  }
                  placeholder={
                    afternoonWorkshopsLoading
                      ? 'Loading afternoon workshops...'
                      : afternoonWorkshopOptions.length === 0
                      ? 'No workshops available'
                      : 'Select Afternoon Workshop'
                  }
                  searchable={true}
                  searchPlaceholder="Search afternoon workshop..."
                />

                {/** Amount Display */}
                {/* <View style={globalStyles.fieldContainer}>
                  <Text style={globalStyles.fieldLabel}>Amount</Text>
                  <Text style={globalStyles.fieldAmountText}>
                    ₹{conferencePrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Text>
                  {couponApplied && couponDiscount > 0 && (
                    <View style={{ marginTop: spacing.xs }}>
                      <Text style={styles.discountText}>
                        Discount: -₹{couponDiscount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </Text>
                      <Text style={styles.grandTotalText}>
                        Grand Total: ₹{(conferencePrice - couponDiscount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </Text>
                </View>
                  )}
                </View> */}

                {/** Coupon Code Section */}
                {/* <View style={styles.couponSection}>
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
                          setFieldValue('coupon_amount', 0);
                          setFieldValue('coupon_type', '');
                          setFieldValue('grand_total', conferencePrice);
                        }
                      }}
                    />
                    <TouchableOpacity
                      style={[
                        styles.applyButton,
                        isValidatingCoupon && styles.applyButtonDisabled,
                      ]}
                      onPress={() =>
                        handleCouponApply(values.coupon_code || '', values.email, setFieldValue)
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
                </View> */}

      

                {/** CAPTCHA */}
            <View style={globalStyles.fieldContainer}>
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
                      onChangeText={v => {
                        setFieldValue('captcha', v);
                        // Clear error when user starts typing
                        if (formikErrors.captcha) {
                          setFieldError('captcha', undefined);
                        }
                      }}
                      onBlur={handleBlur('captcha')}
                      maxLength={6}
                      keyboardType="numeric"
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
                  {touched.captcha && formikErrors.captcha ? (
                    <Text style={globalStyles.fieldErrorText}>
                      {formikErrors.captcha}
                    </Text>
                  ) : null}
                </View> 
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

      {/* Membership Error Alert Modal */}
      <FailureModal
        visible={showMembershipAlert}
        message="You're not an EFI member. Continuing as a non-EFI member."
        onClose={() => {
          setShowMembershipAlert(false);
          // Change to Non EFI Member and update price
          if (selectedTicket?.ticket) {
            const newMembershipType = 'non-member';
            setActualMembershipType(newMembershipType);
            
            // Update conference price to non-member price
            const nonMemberPrice = selectedTicket.ticket?.non_member_price || 0;
            setConferencePrice(nonMemberPrice);
            
            console.log('=== MEMBERSHIP CHANGED TO NON MEMBER AFTER OK ===');
            console.log('Updated Membership Type:', newMembershipType);
            console.log('Updated Price:', nonMemberPrice);
            
            // Clear pending form values - user will need to click Submit again
            pendingFormValuesRef.current = null;
          }
        }}
        instructionText="Please note that you will not be eligible for any EFI member benefits."
        icon={<InformationIcon size={50} />}
        disableOverlayClose={true}
      />

      {/* EFI Member OTP Verification Modal */}
      <EfiMemberOtpModal
        visible={showEfiMemberOtpModal}
        email={efiMemberEmailRef.current}
        otpExpiryMinutes={otpExpiryMinutes}
        onSendOtp={async () => {
          try {
            const payload = { email: efiMemberEmailRef.current };
            console.log('Send OTP Payload:', JSON.stringify(payload, null, 2));
            
            const result = await SendEfiMemberVerificationOtp(payload);
            console.log('Send OTP Response:', JSON.stringify(result, null, 2));
            
            if (result?.success) {
              const expiry = result?.data?.otp_expiry_minutes || 15;
              setOtpExpiryMinutes(expiry);
              ToastService.success('Success', result?.message || 'OTP sent successfully to your email');
            } else {
              throw new Error(result?.message || 'Failed to send OTP');
            }
          } catch (error: any) {
            console.log('Send OTP Error Response:', JSON.stringify(error?.response?.data || error?.message, null, 2));
            
            // Handle different error scenarios
            let errorMessage = 'Failed to send OTP. Please try again.';
            const errorStatus = error?.response?.status || error?.response?.data?.status;
            const errorResponse = error?.response?.data || {};
            
            if (errorStatus === 401 || errorResponse?.status === 401) {
              errorMessage = 'Authentication failed. Please refresh the page and try again.';
            } else if (errorStatus === 403 || errorResponse?.status === 403) {
              errorMessage = 'Access denied. Please contact support if this issue persists.';
            } else if (errorStatus === 404 || errorResponse?.status === 404) {
              errorMessage = 'OTP service not found. Please try again later.';
            } else if (errorStatus === 500 || errorResponse?.status === 500) {
              errorMessage = 'Server error occurred. Please try again later.';
            } else if (errorResponse?.message) {
              errorMessage = errorResponse.message;
            } else if (error?.message) {
              errorMessage = error.message;
            }
            
            ToastService.error('Error', errorMessage);
            throw error;
          }
        }}
        onVerify={async (otp: string) => {
          try {
            const payload = {
              email: efiMemberEmailRef.current,
              otp_code: otp,
            };
            console.log('Verify OTP Payload:', JSON.stringify(payload, null, 2));
            
            // Validate OTP format before sending
            if (!payload.otp_code || payload.otp_code.length !== 6 || !/^\d{6}$/.test(payload.otp_code)) {
              throw new Error('Invalid OTP format. Please enter a 6-digit number.');
            }
            
            const result = await VerifyEfiMemberOtp(payload);
            console.log('Verify OTP Response:', JSON.stringify(result, null, 2));
            
            // Check if verification was successful (handle different response structures)
            const isVerified = result?.success === true && (
              result?.data?.verified === true ||
              result?.data?.verified === 1 ||
              result?.verified === true ||
              result?.verified === 1
            );
            
            if (isVerified) {
              ToastService.success('Success', result?.message || 'EFI membership verified successfully');
              setShowEfiMemberOtpModal(false);
              
              // Continue with form submission after OTP verification
              if (pendingFormValuesRef.current) {
                const formValues = pendingFormValuesRef.current;
                pendingFormValuesRef.current = null;
                skipMembershipCheckRef.current = true; // Skip membership check since already verified
                setTimeout(() => {
                  handleSubmit(formValues);
                }, 100);
              } else {
                throw new Error('Form data not available. Please try again.');
              }
            } else {
              const errorMsg = result?.message || result?.data?.message || 'OTP verification failed';
              throw new Error(errorMsg);
            }
          } catch (error: any) {
            console.log('Verify OTP Error Response:', JSON.stringify(error?.response?.data || error?.message, null, 2));
            
            // Handle different error scenarios
            let errorMessage = 'Invalid OTP. Please try again.';
            throw new Error(errorMessage);
          }
        }}
        onClose={() => {
          setShowEfiMemberOtpModal(false);
          pendingFormValuesRef.current = null;
          setIsSubmitting(false);
        }}
        isLoading={isSubmitting}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
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
  couponSection: {
    backgroundColor: colors.lightGray,
    borderRadius: 8,
    padding: spacing.md,
    marginVertical: spacing.md,
    marginHorizontal: 0,
  },
  couponLabel: {
    fontSize: screenWidth * 0.033,
    fontFamily: 'System',
    fontWeight: '500',
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
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: screenWidth * 0.038,
    fontFamily: 'System',
    color: colors.black,
    backgroundColor: colors.white,
  },
  applyButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: screenWidth * 0.038,
    fontFamily: 'System',
    fontWeight: 'bold',
    color: colors.white,
  },
  couponSuccess: {
    fontSize: screenWidth * 0.032,
    fontFamily: 'System',
    fontWeight: '500',
    color: '#4CAF50',
    marginTop: spacing.xs,
  },
  couponError: {
    fontSize: screenWidth * 0.032,
    fontFamily: 'System',
    fontWeight: '500',
    color: '#F44336',
    marginTop: spacing.xs,
  },
  applyButtonDisabled: {
    opacity: 0.6,
  },
  discountText: {
    fontSize: screenWidth * 0.035,
    fontFamily: 'System',
    fontWeight: '500',
    color: '#4CAF50',
    marginTop: spacing.xs,
  },
  grandTotalText: {
    fontSize: screenWidth * 0.04,
    fontFamily: 'System',
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: spacing.xs,
  },
  couponModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  couponModalContent: {
    backgroundColor: colors.white,
    borderRadius: 16,
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
    fontFamily: 'System',
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  couponSuccessModalMessage: {
    fontSize: screenWidth * 0.04,
    fontFamily: 'System',
    fontWeight: '600',
    color: colors.black,
    textAlign: 'center',
  },


  conferenHeaderTextContainer:{
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'flex-start',
  },
  moduleName: {
    fontSize: screenWidth * 0.038,
    fontFamily: Fonts.SemiBold,   
    color: colors.primaryLight,
    marginBottom:0,
    marginTop: 0,
  },
  headerBottomConferenceDetails:{
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
  },
  conferenHeaderText:{
    fontSize: screenWidth * 0.038,
    fontFamily: Fonts.Medium,   
    color: colors.primaryLight,
    },

  conferenHeaderDot:{
    fontSize: screenWidth * 0.08,
    lineHeight: screenWidth * 0.02,
    paddingLeft:10,
    paddingRight:5,
    color: colors.primaryLight,
    fontFamily: Fonts.Regular,
    marginBottom:0,
    marginTop:4,


   },
   conferenHeaderNonResidential:{
    fontSize: screenWidth * 0.042,
    fontFamily: Fonts.Bold,   
    color: colors.primaryLight,
  

   },

   membershipTypeContainer:{
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'flex-start',
   },
   membershipTypeText: {
    fontSize: screenWidth * 0.04,
    fontFamily: Fonts.SemiBold,
    color: colors.lightBlue,
    marginBottom: 0,
    marginTop:0,  
    marginRight: spacing.sm,  
   },
   conferenHeaderPriceContainer:{
    flexDirection: 'row',  
    alignItems: 'center', 
    justifyContent: 'flex-start',
   },

   conferenHeaderPrice:{
    fontSize: screenWidth * 0.05,
    fontFamily: Fonts.Bold,   
    color: colors.primaryLight,
    marginBottom:0,
   },

   withGSTText:{
    fontSize: screenWidth * 0.033,
    fontFamily: Fonts.Medium,
    color: colors.primaryLight,
    marginLeft:5,
  
  
   
   }
});

export default React.memo(ConferenceRegistrationForm);
