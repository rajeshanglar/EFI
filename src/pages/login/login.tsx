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

  const initialValues: LoginFormValues = {
    email: '',
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
          email: values.email,
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
    [generateCaptcha, onLoginSuccess, deviceId, appVersion, appName],
  );

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
          
            <Formik
              initialValues={initialValues}
              validationSchema={loginSchema(captchaCode)}
              onSubmit={handleSubmit}
              enableReinitialize
              key={`${deviceId}-${captchaCode}`}
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
                  />
                  <CaptchaInput
                    captcha={values.captcha}
                    setCaptcha={(value) => setFieldValue('captcha', value)}
                    captchaCode={captchaCode}
                    onRefresh={async () => {
                      await generateCaptcha();
                      setFieldValue('captcha', '');
                    }}
                    error={
                      touched.captcha && errors.captcha ? errors.captcha : undefined
                    }
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
           
          </View>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginPage;
