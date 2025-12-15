import * as yup from 'yup';

// Generate CAPTCHA helper
export const generateCaptcha = () => {
  const chars = '0123456789';
  return Array.from(
    { length: 6 },
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join('');
};

// Yup validation schema for conference registration
export const conferenceRegistrationSchema = (captcha: string) =>
  yup.object().shape({
    full_name: yup
      .string()
      .required('Full name is required')
      .min(2, 'Full name must be at least 2 characters')
      .max(50, 'Full name must not exceed 50 characters')
      .trim(),
    
    email: yup
      .string()
      .required('Email is required')
      .email('Invalid email format')
      .trim()
      .lowercase(),
    
    mobile: yup
      .string()
      .required('Mobile number is required')
      .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/, 'Invalid phone number format')
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
      .min(10, 'Address must be at least 4 characters')
      .trim(),
    
    city: yup
      .string()
      .required('City is required')
      .min(2, 'City must be at least 2 characters')
      .trim(),
    
    pincode: yup
      .string()
      .required('Pin code is required')
      // .matches(/^\d{6}$/, 'Pin code must be exactly 6 digits')
      .trim(),
    
    state: yup
      .mixed()
      .optional()
      .nullable(),
    
      country: yup
      .mixed()
      .required('Country is required')
      .test('is-valid-country', 'Please select a country', function(value) {
        return value !== 0 && value !== '' && value != null;
      }),
    
   
    category: yup
      .mixed()
      .test('is-valid-category', 'Please select a category', function(value) {
        return value !== 0 && value !== '' && value != null && value !== '0';
      }),
    
    morning_workshop: yup
      .mixed()
      .required('Morning Workshop is required')
      .test('is-valid-workshop', 'Please select a morning workshop', function(value) {
        return value !== 0 && value !== '' && value != null && value !== '0';
      }),
    
    afternoon_workshop: yup
      .mixed()
      .required('Afternoon Workshop is required')
      .test('is-valid-workshop', 'Please select a afternoon workshop', function(value) {
        return value !== 0 && value !== '' && value != null && value !== '0';
      }),
        
    captcha: yup
      .string()     
      .test('captcha-match', 'Invalid CAPTCHA', function(value) {
        return value?.trim() === captcha;
      }),
  });



