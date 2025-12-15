import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginFormValues } from '../types/login';
import api from './api';
export interface LoginCredentials {
  email_id: string;
  password: string;
  captcha: string;
  device_id: string;
  app_version: string;
  app_name: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: {
    email_id?: string;
    password?: string;
    captcha?: string;
  };
}

class AuthService {
  private readonly AUTH_TOKEN_KEY = 'auth_token';
  private readonly USER_DATA_KEY = 'user_data';
  private readonly CAPTCHA_KEY = 'captcha_key';

  /**
   * Validates email format
   */
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validates password requirements
   * Minimum 6 characters, at least one letter and one number
   */
  validatePassword(password: string): boolean {
    return password.length >= 6 && /[A-Za-z]/.test(password) && /[0-9]/.test(password);
  }

  /**
   * Validates login credentials
   */
  validateLogin(credentials: LoginCredentials): ValidationResult {
    const errors: { email?: string; password?: string; captcha?: string } = {};

    // Email validation
    if (!credentials.email_id.trim()) {
      errors.email = 'Email is required';
    } else if (!this.validateEmail(credentials.email_id)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!credentials.password) {
      errors.password = 'Password is required';
    } else if (!this.validatePassword(credentials.password)) {
      errors.password = 'Password must be at least 6 characters with letters and numbers';
    }

    // Captcha validation
    const storedCaptcha = AsyncStorage.getItem(this.CAPTCHA_KEY);
    if (!credentials.captcha.trim()) {
      errors.captcha = 'Please enter the CAPTCHA';
    } else if (credentials.captcha.length !== 6) {
      errors.captcha = 'CAPTCHA must be 6 characters';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  /**
   * Generates a random CAPTCHA
   */
  generateCaptcha(): string {
    const chars = '0123456789';
    let captcha = '';
    for (let i = 0; i < 6; i++) {
      captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return captcha;
  }

  /**
   * Store CAPTCHA for validation
   */
  async storeCaptcha(captcha: string): Promise<void> {
    try {
      await AsyncStorage.setItem(this.CAPTCHA_KEY, captcha);
    } catch (error) {
      console.error('Error storing CAPTCHA:', error);
    }
  }

  /**
   * Get stored CAPTCHA
   */
  async getCaptcha(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(this.CAPTCHA_KEY);
    } catch (error) {
      console.error('Error getting CAPTCHA:', error);
      return null;
    }
  }

  /**
   * Validates the entered CAPTCHA
   */
  async validateCaptcha(enteredCaptcha: string): Promise<boolean> {
    try {
      const storedCaptcha = await AsyncStorage.getItem(this.CAPTCHA_KEY);
      return storedCaptcha?.toUpperCase() === enteredCaptcha.toUpperCase();
    } catch (error) {
      console.error('Error validating CAPTCHA:', error);
      return false;
    }
  }

  /**
   * Attempts to login with credentials
   * Calls the Login API and stores the api_token and user data
   */
  async login(credentials: LoginCredentials): Promise<{ success: boolean; error?: string; user?: any }> {
    try {
      // Validate credentials
      const validation = this.validateLogin(credentials);
      if (!validation.isValid) {
        return { success: false, error: 'Validation failed' };
      }

      // Validate CAPTCHA
      const isCaptchaValid = await this.validateCaptcha(credentials.captcha);
      if (!isCaptchaValid) {
        return { success: false, error: 'Invalid CAPTCHA. Please try again.' };
      }

      // Call Login API
      const loginPayload = {
        email_id: credentials.email_id,
        password: credentials.password,
        device_id: credentials.device_id || 'device123',
        app_version: credentials.app_version || '1.0.0',
        app_name: credentials.app_name || 'EFI App',
      };

      console.log('=== LOGIN API CALL ===');
      console.log('Payload:', JSON.stringify(loginPayload, null, 2));

      let result;
      try {
        result = await Login(loginPayload);
      } catch (apiError: any) {
        // Handle API errors (401, 403, etc.) that might be thrown by axios
        console.error('Login API call failed:', apiError);
        
        // If API returns error response with data, extract it
        if (apiError?.response?.data) {
          const errorData = apiError.response.data;
          const errorMessage = errorData?.message || 'Login failed. Please try again.';
          
          console.error('=== LOGIN API ERROR RESPONSE ===');
          console.error('Error Data:', JSON.stringify(errorData, null, 2));
          console.error('Error Message:', errorMessage);
          console.error('Error Status:', apiError.response?.status);
          console.error('================================');
          
          return { success: false, error: errorMessage };
        }
        
        // Re-throw if it's not an API error response
        throw apiError;
      }

      console.log('=== LOGIN API RESPONSE ===');
      console.log('Full Response:', JSON.stringify(result, null, 2));
      console.log('Response Success:', result?.success);
      console.log('Response Message:', result?.message);
      console.log('Response Status:', result?.status);
      console.log('Response Data:', JSON.stringify(result?.data, null, 2));
      if (result?.data) {
        console.log('User ID:', result.data.user_id);
        console.log('Email:', result.data.email_id);
        console.log('Name:', result.data.first_name, result.data.last_name);
        console.log('Role:', result.data.role_name);
        console.log('API Token:', result.data.api_token ? result.data.api_token.substring(0, 20) + '...' : 'Not provided');
      }
      console.log('========================');

      // Handle API response with success: false
      if (result?.success === false) {
        const errorMessage = result?.message || 'Login failed. Please try again.';
        return { success: false, error: errorMessage };
      }

      if (result?.success === true && result?.data) {
        const userData = result.data;
        const apiToken = userData.api_token;

        if (!apiToken) {
          return { success: false, error: 'API token not received from server' };
        }

        // Store api_token as accessToken (for API interceptor)
        await AsyncStorage.setItem('accessToken', apiToken);
        
        // Also store in auth_token key for backward compatibility
        await AsyncStorage.setItem(this.AUTH_TOKEN_KEY, apiToken);
        
        // Store user data
        await AsyncStorage.setItem(this.USER_DATA_KEY, JSON.stringify(userData));

        // Store device_id, app_version, and app_name from API response (or use request payload as fallback)
        const deviceId = userData.device_id || loginPayload.device_id;
        const appVersion = userData.app_version || loginPayload.app_version;
        const appName = userData.app_name || loginPayload.app_name;

        if (deviceId) {
          await AsyncStorage.setItem('device_id', deviceId);
        }
        if (appVersion) {
          await AsyncStorage.setItem('app_version', appVersion);
        }
        if (appName) {
          await AsyncStorage.setItem('app_name', appName);
        }

        console.log('=== TOKEN STORED ===');
        console.log('accessToken stored:', apiToken.substring(0, 20) + '...');
        console.log('device_id stored:', deviceId);
        console.log('app_version stored:', appVersion);
        console.log('app_name stored:', appName);
        console.log('===================');

        return { success: true, user: userData };
      } else {
        const errorMessage = result?.message || 'Login failed. Please try again.';
        return { success: false, error: errorMessage };
      }
    } catch (error: any) {
      console.error('Login error:', error);
      console.error('Error response:', error?.response);
      console.error('Error response data:', error?.response?.data);
      console.error('Error status:', error?.response?.status);
      console.error('Error config:', error?.config);
      
      // Extract error message from API response
      const errorData = error?.response?.data;
      let errorMessage = 'An error occurred during login';
      
      if (errorData?.message) {
        errorMessage = errorData.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      // Handle specific error cases
      if (errorMessage.includes('Mobile app access is not enabled')) {
        errorMessage = 'Mobile app access is not enabled for this account. Please contact administrator.';
      }
      
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Generates a mock auth token
   */
  private generateAuthToken(): string {
    return 'token_' + Math.random().toString(36).substring(7) + '_' + Date.now();
  }

  /**
   * Sends forgot password request
   */
  async forgotPassword(email: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      if (!email.trim()) {
        return { success: false, error: 'Email is required' };
      }

      if (!this.validateEmail(email)) {
        return { success: false, error: 'Please enter a valid email address' };
      }

      console.log('=== FORGOT PASSWORD API CALL ===');
      console.log('Email:', email);

      const payload = {
        email_id: email,
      };

      const result = await ForgotPassword(payload);

      console.log('=== FORGOT PASSWORD API RESPONSE ===');
      console.log('Response:', JSON.stringify(result, null, 2));
      console.log('===================================');

      if (result?.success === true) {
        return { success: true, message: result?.message || 'Password reset instructions sent to your email' };
      } else {
        return { success: false, error: result?.message || 'Failed to send password reset instructions' };
      }
    } catch (error: any) {
      console.error('Forgot password error:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'An error occurred. Please try again.';
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Resets password using OTP code
   */
  async resetPassword(email_id: string, otp_code: string, new_password: string, new_password_confirmation: string): Promise<{ success: boolean; message?: string; error?: string; api_token?: string }> {
    try {
      if (!email_id.trim()) {
        return { success: false, error: 'Email is required' };
      }

      if (!this.validateEmail(email_id)) {
        return { success: false, error: 'Please enter a valid email address' };
      }

      if (!otp_code.trim()) {
        return { success: false, error: 'OTP code is required' };
      }

      if (!new_password.trim()) {
        return { success: false, error: 'New password is required' };
      }

      if (!this.validatePassword(new_password)) {
        return { success: false, error: 'Password must be at least 6 characters with letters and numbers' };
      }

      if (new_password !== new_password_confirmation) {
        return { success: false, error: 'Passwords do not match' };
      }

      console.log('=== RESET PASSWORD API CALL ===');
      console.log('Email:', email_id);
      console.log('OTP Code:', otp_code);

      const payload = {
        email_id: email_id,
        otp_code: otp_code,
        new_password: new_password,
        new_password_confirmation: new_password_confirmation,
      };

      const result = await ResetPassword(payload);

      console.log('=== RESET PASSWORD API RESPONSE ===');
      console.log('Response:', JSON.stringify(result, null, 2));
      console.log('===================================');

      if (result?.success === true && result?.data?.api_token) {
        const apiToken = result.data.api_token;

        // Store api_token as accessToken (for API interceptor)
        await AsyncStorage.setItem('accessToken', apiToken);
        
        // Also store in auth_token key for backward compatibility
        await AsyncStorage.setItem(this.AUTH_TOKEN_KEY, apiToken);

        // Store user data if available
        if (result.data) {
          await AsyncStorage.setItem(this.USER_DATA_KEY, JSON.stringify(result.data));
        }

        console.log('=== RESET PASSWORD: STORED API TOKEN ===');
        console.log('Token:', apiToken.substring(0, 20) + '...');

        return { 
          success: true, 
          message: result?.message || 'Password reset successfully',
          api_token: apiToken
        };
      } else {
        return { success: false, error: result?.message || 'Failed to reset password' };
      }
    } catch (error: any) {
      console.error('Reset password error:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'An error occurred. Please try again.';
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Logs out the user
   */
  async logout(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.AUTH_TOKEN_KEY);
      await AsyncStorage.removeItem(this.USER_DATA_KEY);
      await AsyncStorage.removeItem(this.CAPTCHA_KEY);
      // Remove accessToken so static token will be used after logout
      await AsyncStorage.removeItem('accessToken');
      console.log('=== LOGGED OUT: REMOVED ACCESS TOKEN ===');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  /**
   * Checks if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      // Check accessToken (used by API interceptor) first, then fallback to AUTH_TOKEN_KEY
      const accessToken = await AsyncStorage.getItem('accessToken');
      const authToken = await AsyncStorage.getItem(this.AUTH_TOKEN_KEY);
      return !!(accessToken || authToken);
    } catch (error) {
      console.error('Auth check error:', error);
      return false;
    }
  }

  /**
   * Gets the current user data
   */
  async getCurrentUser(): Promise<any | null> {
    try {
      const userData = await AsyncStorage.getItem(this.USER_DATA_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  }
}

export const Login = async (payload: {
  email_id: string;
  password: string;
  device_id: string;
  app_version: string;
  app_name: string;
}) => {
  const response = await api.post('v1/login', payload);
  return response.data;
};

export const ForgotPassword = async (payload: {
  email_id: string;
}) => {
  const response = await api.post('v1/forgot-password', payload);
  return response.data;
};

export const ResetPassword = async (payload: {
  email_id: string;
  otp_code: string;
  new_password: string;
  new_password_confirmation: string;
}) => {
  const response = await api.post('v1/reset-password', payload);
  return response.data;
};

export const ChangePassword = async (payload: {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}) => {
  const response = await api.post('v1/change-password', payload);
  return response.data;
};



export default new AuthService();
