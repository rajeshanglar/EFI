import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { Formik } from 'formik';
import authService, { LoginCredentials } from '../../services/authService';
import { colors } from '../../styles/globalStyles';
import styles from './styles';
import LoginHeader from './components/login-header';
import LoginForm from './components/login-form';
import CaptchaInput from './components/captcha-input';
import LoginButton from './components/login-button';
import { Image } from 'react-native';
import { loginSchema } from '../../schemas/loginSchema';
import { LoginFormValues } from '../../types/login';
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

  const generateCaptcha = useCallback(async () => {
    const newCaptcha = authService.generateCaptcha();
    setCaptchaCode(newCaptcha);
    await authService.storeCaptcha(newCaptcha);
  }, []);

  useEffect(() => {
    generateCaptcha();
  }, [generateCaptcha]);

  const initialValues: LoginFormValues = {
    email: '',
    password: '',
    loginType: 'conference',
    captcha: '',
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
          loginType: values.loginType,
          captcha: values.captcha,
        };

        const result = await authService.login(credentials);
        if (result.success) {
          Alert.alert('Success', 'Login successful!', [
            { text: 'OK', onPress: onLoginSuccess },
          ]);
          resetForm();
        } else {
          Alert.alert('Error', result.error || 'Login failed.');
          if (result.error?.includes('CAPTCHA')) {
            await generateCaptcha();
            setFieldError('captcha', result.error);
          }
        }
      } catch {
        Alert.alert('Error', 'An unexpected error occurred.');
      } finally {
        setIsLoading(false);
      }
    },
    [generateCaptcha, onLoginSuccess],
  );

  return (
    <View style={styles.container}>
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
                    loginType={values.loginType}
                    onLoginTypeChange={(type) =>
                      setFieldValue('loginType', type)
                    }
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
                    onPress={() => formikHandleSubmit()}
                    loading={isLoading}
                  />
                </>
              )}
            </Formik>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default LoginPage;
