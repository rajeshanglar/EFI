import AsyncStorage from '@react-native-async-storage/async-storage';

export interface LoginCredentials {
  email: string;
  password: string;
  loginType: 'member' | 'conference';
  captcha: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: {
    email?: string;
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
    if (!credentials.email.trim()) {
      errors.email = 'Email is required';
    } else if (!this.validateEmail(credentials.email)) {
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
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
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
   * In a real app, this would make an API call
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

      // Mock API call - In a real app, replace this with actual API call
      const mockUser = {
        email: credentials.email,
        loginType: credentials.loginType,
        name: credentials.email.split('@')[0],
        token: this.generateAuthToken(),
      };

      // Store auth token
      await AsyncStorage.setItem(this.AUTH_TOKEN_KEY, mockUser.token);
      await AsyncStorage.setItem(this.USER_DATA_KEY, JSON.stringify(mockUser));

      return { success: true, user: mockUser };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'An error occurred during login' };
    }
  }

  /**
   * Generates a mock auth token
   */
  private generateAuthToken(): string {
    return 'token_' + Math.random().toString(36).substring(7) + '_' + Date.now();
  }

  /**
   * Logs out the user
   */
  async logout(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.AUTH_TOKEN_KEY);
      await AsyncStorage.removeItem(this.USER_DATA_KEY);
      await AsyncStorage.removeItem(this.CAPTCHA_KEY);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  /**
   * Checks if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem(this.AUTH_TOKEN_KEY);
      return !!token;
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

export default new AuthService();
