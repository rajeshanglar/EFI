import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { Formik } from 'formik';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authService, { LoginCredentials } from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';
import { ToastService } from '../../utils/service-handlers';
import { colors } from '../../styles/globalStyles';
import styles from './styles';
import LoginHeader from './components/login-header';
import LoginForm from './components/login-form';
import ForgotPasswordForm from './components/forgot-password-form';
import ChangePasswordForm from './components/change-password-form';
import CaptchaInput from './components/captcha-input';
import LoginButton from './components/login-button';
import { Image } from 'react-native';
import { loginSchema } from '../../schemas/loginSchema';
import { LoginFormValues } from '../../types/login';

const DEVICE_ID_KEY = 'device_id';
const APP_VERSION_KEY = 'app_version';
const APP_NAME_KEY = 'app_name';
interface LoginPageProps {
  onLoginSuccess: () => void;
  onBackToHome: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onBackToHome,
}) => {
  const [captchaCode, setCaptchaCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [deviceId, setDeviceId] = useState<string>('');
  const [appVersion, setAppVersion] = useState<string>('1.0.0');
  const [appName, setAppName] = useState<string>('EFI App');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordError, setForgotPasswordError] = useState<string | undefined>(undefined);
  const [isForgotPasswordLoading, setIsForgotPasswordLoading] = useState(false);
  
  // Change password form state
  const [changePasswordEmail, setChangePasswordEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changePasswordErrors, setChangePasswordErrors] = useState<{
    email_id?: string;
    otp_code?: string;
    new_password?: string;
    new_password_confirmation?: string;
  }>({});
  const [isChangePasswordLoading, setIsChangePasswordLoading] = useState(false);
  const [prefillEmail, setPrefillEmail] = useState<string>('');
  
  const { refreshAuthStatus } = useAuth();

  // Retrieve device_id, app_version, and app_name from AsyncStorage (set by API)
  const loadAppData = useCallback(async () => {
    try {
      // Try to get device_id from storage (set by API response)
      let storedDeviceId = await AsyncStorage.getItem(DEVICE_ID_KEY);
      if (!storedDeviceId) {
        // Generate a unique device ID if not stored
        storedDeviceId = `${Platform.OS}_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
        await AsyncStorage.setItem(DEVICE_ID_KEY, storedDeviceId);
      }
      setDeviceId(storedDeviceId);

      // Get app_version from storage (set by API response)
      const storedAppVersion = await AsyncStorage.getItem(APP_VERSION_KEY);
      if (storedAppVersion) {
        setAppVersion(storedAppVersion);
      }

      // Get app_name from storage (set by API response)
      const storedAppName = await AsyncStorage.getItem(APP_NAME_KEY);
      if (storedAppName) {
        setAppName(storedAppName);
      }
    } catch (error) {
      console.error('Error loading app data:', error);
      // Fallback values
      setDeviceId(`device_${Date.now()}`);
    }
  }, []);

  const generateCaptcha = useCallback(async () => {
    const newCaptcha = authService.generateCaptcha();
    setCaptchaCode(newCaptcha);
    await authService.storeCaptcha(newCaptcha);
  }, []);

  useEffect(() => {
    generateCaptcha();
    loadAppData();
  }, [generateCaptcha, loadAppData]);

  // Set email field when returning to login form after password change
  useEffect(() => {
    if (!showChangePassword && !showForgotPassword && prefillEmail) {
      // The email will be set via initialValues since enableReinitialize is true
      // Clear prefillEmail after Formik has had a chance to initialize
      const timer = setTimeout(() => {
        setPrefillEmail('');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showChangePassword, showForgotPassword, prefillEmail]);

  const initialValues: LoginFormValues = {
    email: prefillEmail,
    password: '',
    captcha: '',
    device_id: deviceId || 'device123',
    app_version: appVersion,
    app_name: appName,
  };

  const handleSubmit = useCallback(
    async (
      values: LoginFormValues,
      {
        setFieldError,
        resetForm,
      }: {
        setFieldError: (field: string, message: string) => void;
        resetForm: () => void;
      },
    ) => {
      setIsLoading(true);
      try {
        const credentials: LoginCredentials = {
          email_id: values.email,
          password: values.password,
          captcha: values.captcha,
          device_id: deviceId || values.device_id || 'device123',
          app_version: appVersion || values.app_version || '1.0.0',
          app_name: appName || values.app_name || 'EFI App',
        };

        const result = await authService.login(credentials);
        
        console.log('=== LOGIN RESULT IN LOGIN PAGE ===');
        console.log('Success:', result.success);
        console.log('User:', JSON.stringify(result.user, null, 2));
        console.log('Error:', result.error);
        console.log('===================================');
        
        if (result.success) {
          // Refresh auth status in context so menu shows LOGOUT
          await refreshAuthStatus();
          
          // Show success toast message
          ToastService.success('Login successful!', 'Welcome back!');
          
          // Navigate to home after a short delay to show the toast
          setTimeout(() => {
            onLoginSuccess();
          }, 500);
          
          resetForm();
        } else {
          // Remove alert - errors will be shown via form validation or console only
          if (result.error?.includes('CAPTCHA')) {
            await generateCaptcha();
            setFieldError('captcha', result.error);
          } else if (result.error) {
            // Set error on email or password field if it's a credential error
            if (result.error.toLowerCase().includes('email') || result.error.toLowerCase().includes('password')) {
              setFieldError('email', result.error);
            } else {
              setFieldError('captcha', result.error);
            }
          }
        }
      } catch (error) {
        // Remove alert - only log error to console
        console.error('Login error:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [generateCaptcha, onLoginSuccess, deviceId, appVersion, appName, refreshAuthStatus],
  );

  const handleForgotPasswordSubmit = useCallback(async () => {
    // Clear previous error
    setForgotPasswordError(undefined);

    // Client-side validation
    if (!forgotPasswordEmail.trim()) {
      setForgotPasswordError('Email is required');
      return;
    }

    if (!authService.validateEmail(forgotPasswordEmail)) {
      setForgotPasswordError('Please enter a valid email address');
      return;
    }

    setIsForgotPasswordLoading(true);

    try {
      const result = await authService.forgotPassword(forgotPasswordEmail);
      
      console.log('=== FORGOT PASSWORD RESULT ===');
      console.log('Success:', result.success);
      console.log('Message:', result.message);
      console.log('Error:', result.error);
      console.log('==============================');

      if (result.success) {
        ToastService.success(result.message || 'OTP sent to your email!', 'Please check your email for the OTP code.');
        // Redirect to change password screen
        setChangePasswordEmail(forgotPasswordEmail);
        setShowForgotPassword(false);
        setShowChangePassword(true);
        setForgotPasswordError(undefined);
      } else {
        setForgotPasswordError(result.error || 'Failed to send reset instructions');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      const errorMessage = 'An error occurred. Please try again.';
      setForgotPasswordError(errorMessage);
    } finally {
      setIsForgotPasswordLoading(false);
    }
  }, [forgotPasswordEmail]);

  const handleChangePasswordSubmit = useCallback(async () => {
    // Clear previous errors
    setChangePasswordErrors({});

    // Client-side validation
    const validationErrors: {
      email_id?: string;
      otp_code?: string;
      new_password?: string;
      new_password_confirmation?: string;
    } = {};

    if (!changePasswordEmail.trim()) {
      validationErrors.email_id = 'Email is required';
    } 

    if (!otpCode.trim()) {
      validationErrors.otp_code = 'OTP code is required';
    }

    if (!newPassword.trim()) {
      validationErrors.new_password = 'New password is required';
    } else if (!authService.validatePassword(newPassword)) {
      validationErrors.new_password = 'Password must be at least 6 characters with letters and numbers';
    }

    if (!confirmPassword.trim()) {
      validationErrors.new_password_confirmation = 'Please confirm your password';
    } else if (newPassword !== confirmPassword) {
      validationErrors.new_password_confirmation = 'Passwords do not match';
    }

    // If there are validation errors, show them and stop
    if (Object.keys(validationErrors).length > 0) {
      setChangePasswordErrors(validationErrors);
      setIsChangePasswordLoading(false);
      return;
    }

    setIsChangePasswordLoading(true);

    try {
      const result = await authService.resetPassword(
        changePasswordEmail,
        otpCode,
        newPassword,
        confirmPassword
      );

      console.log('=== CHANGE PASSWORD RESULT ===');
      console.log('Success:', result.success);
      console.log('Message:', result.message);
      console.log('Error:', result.error);
      console.log('API Token:', result.api_token ? result.api_token.substring(0, 20) + '...' : 'Not provided');
      console.log('==============================');

      if (result.success && result.api_token) {
        // Store email for pre-filling login form
        const emailForLogin = changePasswordEmail;
        
        // Clear auth token (logout) - user needs to login with new password
        await authService.logout();
        
        // Clear all change password form data
        setChangePasswordEmail('');
        setOtpCode('');
        setNewPassword('');
        setConfirmPassword('');
        setChangePasswordErrors({});
        
        // Refresh auth status in context
        await refreshAuthStatus();
        
        ToastService.success(result.message || 'Password reset successfully!', 'You can now login with your new password.');
        
        // Pre-fill email and redirect to login page
        setPrefillEmail(emailForLogin);
        setShowChangePassword(false);
        
        // Clear prefill email after Formik has initialized
        setTimeout(() => {
          setPrefillEmail('');
        }, 500);
      } else {
        // Set field-specific errors if available
        if (result.error) {
          const apiErrors: {
            email_id?: string;
            otp_code?: string;
            new_password?: string;
            new_password_confirmation?: string;
          } = {};

          if (result.error.toLowerCase().includes('email')) {
            apiErrors.email_id = result.error;
          } else if (result.error.toLowerCase().includes('otp')) {
            apiErrors.otp_code = result.error;
          } else if (result.error.toLowerCase().includes('password') || result.error.toLowerCase().includes('match')) {
            apiErrors.new_password_confirmation = result.error;
          } else {
            apiErrors.email_id = result.error;
          }
          setChangePasswordErrors(apiErrors);
        }
      }
    } catch (error) {
      console.error('Change password error:', error);
      const errorMessage = 'An error occurred. Please try again.';
      setChangePasswordErrors({ email_id: errorMessage });
    } finally {
      setIsChangePasswordLoading(false);
    }
  }, [changePasswordEmail, otpCode, newPassword, confirmPassword, refreshAuthStatus, onLoginSuccess]);

  return (
    <View style={styles.container}>
        <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 30}
              style={{ flex: 1 }}
            >
      <ScrollView showsVerticalScrollIndicator={false}>
        <LoginHeader onBackToHome={onBackToHome} />
        <View style={styles.loginCardContainer}>
          <View style={styles.loginCard}>
            <View style={styles.ribbonContainer}>
              <Image
                source={require('../../assets/images/ribbon-color-img.png')}
                style={styles.ribbonImage}
              />
            </View>
          
            {showChangePassword ? (
              <ChangePasswordForm
                email_id={changePasswordEmail}
                otp_code={otpCode}
                new_password={newPassword}
                new_password_confirmation={confirmPassword}
                setEmail_id={setChangePasswordEmail}
                setOtp_code={setOtpCode}
                setNew_password={setNewPassword}
                setNew_password_confirmation={setConfirmPassword}
                onSubmit={handleChangePasswordSubmit}
                onBack={() => {
                  setShowChangePassword(false);
                  setChangePasswordEmail('');
                  setOtpCode('');
                  setNewPassword('');
                  setConfirmPassword('');
                  setChangePasswordErrors({});
                }}
                errors={changePasswordErrors}
                isLoading={isChangePasswordLoading}
              />
            ) : showForgotPassword ? (
              <ForgotPasswordForm
                email_id={forgotPasswordEmail}
                setEmail_id={setForgotPasswordEmail}
                onSubmit={handleForgotPasswordSubmit}
                onBack={() => {
                  setShowForgotPassword(false);
                  setForgotPasswordEmail('');
                  setForgotPasswordError(undefined);
                }}
                error={forgotPasswordError}
                isLoading={isForgotPasswordLoading}
              />
            ) : (
              <Formik
                initialValues={initialValues}
                validationSchema={loginSchema(captchaCode)}
                onSubmit={handleSubmit}
                enableReinitialize
                key={`${deviceId}-${prefillEmail}`}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  setFieldValue,
                  handleSubmit: formikHandleSubmit,
                }) => (
                  <>
                    <LoginForm                              
                      email={values.email}
                      password={values.password}
                      setEmail={(text) => setFieldValue('email', text)}
                      setPassword={(text) => setFieldValue('password', text)}
                      errors={{
                        email: touched.email && errors.email ? errors.email : undefined,
                        password:
                          touched.password && errors.password
                            ? errors.password
                            : undefined,
                      }}
                      onForgotPress={() => {
                        setForgotPasswordEmail(values.email);
                        setShowForgotPassword(true);
                      }}
                    />
                    <CaptchaInput
                      captcha={values.captcha}
                      setCaptcha={(value) => setFieldValue('captcha', value)}
                      captchaCode={captchaCode}
                      onRefresh={async () => {
                        await generateCaptcha();
                        setFieldValue('captcha', '');
                      }}
                      error={errors.captcha ? errors.captcha : undefined}
                    />
                    <LoginButton
                      onPress={() => {
                        console.log('=== LOGIN BUTTON PRESSED ===');
                        console.log('Form Values:', JSON.stringify(values, null, 2));
                        console.log('Form Errors:', JSON.stringify(errors, null, 2));
                        console.log('Form Touched:', JSON.stringify(touched, null, 2));
                        formikHandleSubmit();
                      }}
                      loading={isLoading}
                    />
                  </>
                )}
              </Formik>
            )}
           
          </View>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginPage;
