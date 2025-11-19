import * as yup from 'yup';

// Generate CAPTCHA helper
export const generateCaptcha = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from(
    { length: 6 },
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join('');
};

// Yup validation schema for membership registration
export const membershipRegistrationSchema = (captcha: string) =>
  yup.object().shape({
    firstName: yup
      .string()
      .required('First name is required')
      .min(2, 'First name must be at least 2 characters')
      .max(50, 'First name must not exceed 50 characters')
      .trim(),
    
    lastName: yup
      .string()
      .required('Last name is required')
      .min(2, 'Last name must be at least 2 characters')
      .max(50, 'Last name must not exceed 50 characters')
      .trim(),
    
    email: yup
      .string()
      .required('Email is required')
      .email('Please enter a valid email address')
      .trim()
      .lowercase(),
    
    phone: yup
      .string()
      .required('Phone number is required')
      .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/, 'Invalid phone number format')
      .trim(),
    
    dateOfBirth: yup
      .string()
      .required('Date of birth is required')
      .test('is-valid-date', 'Please enter a valid date', function(value) {
        if (!value) return false;
        // Handle DD/MM/YYYY format
        const parts = value.split('/');
        if (parts.length === 3) {
          const day = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
          const year = parseInt(parts[2], 10);
          const date = new Date(year, month, day);
          if (
            date.getDate() !== day ||
            date.getMonth() !== month ||
            date.getFullYear() !== year
          ) {
            return false; // Invalid date
          }
          return date < new Date(); // Must be in the past
        }
        // Try standard date format
        const date = new Date(value);
        return !isNaN(date.getTime()) && date < new Date();
      }),
    
    address1: yup
      .string()
      .required('Address is required')
      .min(10, 'Address must be at least 10 characters')
      .trim(),
    
    city: yup
      .string()
      .required('City is required')
      .min(2, 'City must be at least 2 characters')
      .trim(),
    
    country: yup
      .string()
      .required('Country is required'),
    
    hearAboutEFI: yup
      .string()
      .required('Please enter how you heard about EFI'),
    
    patientsPerYear: yup
      .string()
      .optional()
      .test('is-number', 'Must be a valid number', function(value) {
        if (!value) return true; // Optional field
        return !isNaN(Number(value)) && Number(value) >= 0;
      }),
    
    surgeriesPerYear: yup
      .string()
      .optional()
      .test('is-number', 'Must be a valid number', function(value) {
        if (!value) return true; // Optional field
        return !isNaN(Number(value)) && Number(value) >= 0;
      }),
    
    paymentMode: yup
      .string()
      .required('Payment mode is required'),
    
    couponCode: yup
      .string()
      .optional()
      .trim(),
    
    // captcha: yup
    //   .string()
    //   .required('CAPTCHA is required')
    //   .test('captcha-match', 'Invalid CAPTCHA', function(value) {
    //     return value?.toUpperCase().trim() === captcha.toUpperCase();
    //   }),
  });

// Export dropdown options
export const membershipFormOptions = {
  countries: [
    { label: 'India', value: 'india' },
    { label: 'USA', value: 'usa' },
    { label: 'UK', value: 'uk' },
    { label: 'Canada', value: 'canada' },
    { label: 'Australia', value: 'australia' },
    { label: 'Germany', value: 'germany' },
    { label: 'France', value: 'france' },
  ],
  hearAboutEFI: [
    { label: 'Website', value: 'website' },
    { label: 'Social Media', value: 'social_media' },
    { label: 'Colleague Referral', value: 'colleague_referral' },
    { label: 'Conference/Event', value: 'conference_event' },
    { label: 'Newsletter', value: 'newsletter' },
    { label: 'Other', value: 'other' },
  ],
  paymentModes: [
    { label: 'Online Payment', value: 'online' },
    { label: 'UPI', value: 'upi' },
  ],
};

