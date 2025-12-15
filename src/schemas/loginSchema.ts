import * as yup from 'yup';

// Yup validation schema for login form
export const loginSchema = (captcha: string) =>
  yup.object().shape({
    email: yup
      .string()
      .required('Email is required')
      .email('Please enter a valid email address')
      .trim()
      .lowercase(),
    
    password: yup
      .string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters')
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)/,
        'Password must contain at least one letter and one number',
      ),
    
    captcha: yup
      .string()
      .required('CAPTCHA is required')
      .length(6, 'CAPTCHA must be exactly 6 characters')
      .test('captcha-match', 'Invalid CAPTCHA. Please try again.', function(value) {
        return value?.trim() === captcha;
      }),
    
    device_id: yup.string().optional(),
    app_version: yup.string().optional(),
    app_name: yup.string().optional(),
  });

