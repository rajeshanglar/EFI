import * as yup from 'yup';

// Generate CAPTCHA helper
export const generateCaptcha = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from(
    { length: 6 },
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join('');
};

// Yup validation schema for conference registration
export const conferenceRegistrationSchema = (captcha: string) =>
  yup.object().shape({
    fullName: yup
      .string()
      .required('Full name is required')
      .min(3, 'Full name must be at least 3 characters')
      .max(100, 'Full name must not exceed 100 characters')
      .trim(),
    
    email: yup
      .string()
      .required('Email is required')
      .email('Invalid email format')
      .trim()
      .lowercase(),
    
    mobileNo: yup
      .string()
      .required('Mobile number is required')
      .matches(/^\d{10}$/, 'Mobile number must be exactly 10 digits')
      .trim(),
    
    institute: yup
      .string()
      .required('Institute is required')
      .min(2, 'Institute name must be at least 2 characters')
      .trim(),
    
    specialization: yup
      .string()
      .required('Specialization is required')
      .min(2, 'Specialization must be at least 2 characters')
      .trim(),
    
    address: yup
      .string()
      .required('Address is required')
      .min(10, 'Address must be at least 10 characters')
      .trim(),
    
    city: yup
      .string()
      .required('City is required')
      .min(2, 'City must be at least 2 characters')
      .trim(),
    
    pinCode: yup
      .string()
      .required('Pin code is required')
      .matches(/^\d{6}$/, 'Pin code must be exactly 6 digits')
      .trim(),
    
    state: yup
      .string()
      .required('State is required'),
    
    country: yup
      .string()
      .required('Country is required'),
    
    category: yup
      .string()
      .required('Category is required'),
    
    morningWorkshop: yup
      .string()
      .optional(),
    
    afternoonWorkshop: yup
      .string()
      .optional(),
    
    paymentMode: yup
      .string()
      .required('Payment mode is required'),
    
    // captcha: yup
    //   .string()
    //   .required('CAPTCHA is required')
    //   .test('captcha-match', 'Invalid CAPTCHA', function(value) {
    //     return value?.toUpperCase().trim() === captcha.toUpperCase();
    //   }),
  });

// Export dropdown options
export const conferenceFormOptions = {
  countries: [
    { label: 'India', value: 'india' },
    { label: 'USA', value: 'usa' },
    { label: 'UK', value: 'uk' },
    { label: 'Canada', value: 'canada' },
  ],
  states: [
    { label: 'Maharashtra', value: 'maharashtra' },
    { label: 'Delhi', value: 'delhi' },
    { label: 'Karnataka', value: 'karnataka' },
    { label: 'Tamil Nadu', value: 'tamil_nadu' },
    { label: 'Gujarat', value: 'gujarat' },
  ],
  categories: [
    { label: 'EFI Member - Standard (National)', value: 'efi_member_national' },
    {
      label: 'EFI Member - PGs/Fellows (National)',
      value: 'efi_member_pg_national',
    },
    {
      label: 'Non-EFI Member - Standard (National)',
      value: 'non_efi_national',
    },
    {
      label: 'Non-EFI Member - PGs/Fellows (National)',
      value: 'non_efi_pg_national',
    },
    { label: 'International - Standard', value: 'international_standard' },
    { label: 'International - PGs/Fellows', value: 'international_pg' },
  ],
  workshops: [
    { label: 'Workshop 1: Advanced Techniques', value: 'workshop_1' },
    { label: 'Workshop 2: Case Studies', value: 'workshop_2' },
    { label: 'Workshop 3: Hands-on Training', value: 'workshop_3' },
    { label: 'None', value: 'none' },
  ],
  paymentModes: [
    { label: 'Online Payment', value: 'online' },
    { label: 'UPI', value: 'upi' },
  ],
};

