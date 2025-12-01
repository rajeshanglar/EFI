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
    first_name: yup
      .string()
      .required('First name is required')
      .min(2, 'First name must be at least 2 characters')
      .max(50, 'First name must not exceed 50 characters')
      .trim(),
    
    last_name: yup
      .string()
      .required('Last name is required')
      .min(2, 'Last name must be at least 2 characters')
      .max(50, 'Last name must not exceed 50 characters')
      .trim(),
    
    email_id: yup
      .string()
      .required('Email is required')
      .email('Please enter a valid email address')
      .trim()
      .lowercase(),
    
    phone_number: yup
      .string()
      .required('Phone number is required')
      .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/, 'Invalid phone number format')
      .trim(),
    
    dob: yup
      .string()
      .required('Date of birth is required')
      .test('is-valid-date', 'Please enter a valid date of birth', function(value) {
        if (!value) return false;
        
        // Handle DD-MM-YY format (used by the form)
        const dashParts = value.split('-');
        if (dashParts.length === 3) {
          const day = parseInt(dashParts[0], 10);
          const month = parseInt(dashParts[1], 10) - 1; // Month is 0-indexed
          let year = parseInt(dashParts[2], 10);
          
          // Handle 2-digit year (YY) - assume 1900-2099 range
          if (year < 100) {
            year = year < 50 ? 2000 + year : 1900 + year;
          }
          
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
        
        // Handle DD/MM/YYYY format
        const slashParts = value.split('/');
        if (slashParts.length === 3) {
          const day = parseInt(slashParts[0], 10);
          const month = parseInt(slashParts[1], 10) - 1; // Month is 0-indexed
          const year = parseInt(slashParts[2], 10);
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
    
    address: yup
      .string()
      .required('Postal address is required')
      .min(5, 'Address must be at least 5 characters')
      .trim(),
    
    city: yup
      .string()
      .optional()
      .trim(),
    
    pin_code: yup
      .string()
      .required('Pin code is required')
      .matches(/^\d{6}$/, 'Pin code must be exactly 6 digits')
      .trim(),
    
    country: yup
      .mixed()
      .required('Country is required')
      .test('is-valid-country', 'Please select a valid country', function(value) {
        return value !== 0 && value !== '' && value != null;
      }),
    
    hear_about_efi: yup
      .string()
      .optional()
      .trim(),
    
    patient_count: yup
      .number()
      .optional()
      .test('is-number', 'Must be a valid number', function(value) {
        if (value === undefined || value === null) return true; // Optional field
        return !isNaN(Number(value)) && Number(value) >= 0;
      }),
    
    surgery_count: yup
      .number()
      .optional()
      .test('is-number', 'Must be a valid number', function(value) {
        if (value === undefined || value === null) return true; // Optional field
        return !isNaN(Number(value)) && Number(value) >= 0;
      }),
    

    coupon_code: yup
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
  // countries: [
  //   { label: 'India', value: 'india' },
  //   { label: 'USA', value: 'usa' },
  //   { label: 'UK', value: 'uk' },
  //   { label: 'Canada', value: 'canada' },
  //   { label: 'Australia', value: 'australia' },
  //   { label: 'Germany', value: 'germany' },
  //   { label: 'France', value: 'france' },
  // ],
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

