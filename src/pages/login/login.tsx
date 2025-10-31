import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import authService, { LoginCredentials } from '../../services/authService';
import { colors } from '../../styles/globalStyles';
import styles from './styles';
import LoginHeader from './components/login-header';
import LoginForm from './components/login-form';
import CaptchaInput from './components/captcha-input';
import LoginButton from './components/login-button';

interface LoginPageProps {
  onLoginSuccess: () => void;
  onBackToHome: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onBackToHome,
}) => {
  const [loginType, setLoginType] = useState<'member' | 'conference'>(
    'conference',
  );
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [captchaCode, setCaptchaCode] = useState('');
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    captcha?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  const generateCaptcha = useCallback(async () => {
    const newCaptcha = authService.generateCaptcha();
    setCaptchaCode(newCaptcha);
    setCaptcha('');
    await authService.storeCaptcha(newCaptcha);
  }, []);

  useEffect(() => {
    generateCaptcha();
  }, [generateCaptcha]);

  const handleLogin = useCallback(async () => {
    setErrors({});
    const credentials: LoginCredentials = {
      email,
      password,
      loginType,
      captcha,
    };

    const validation = authService.validateLogin(credentials);
    if (!validation.isValid) return setErrors(validation.errors);

    setIsLoading(true);
    try {
      const result = await authService.login(credentials);
      if (result.success) {
        Alert.alert('Success', 'Login successful!', [
          { text: 'OK', onPress: onLoginSuccess },
        ]);
      } else {
        Alert.alert('Error', result.error || 'Login failed.');
        if (result.error?.includes('CAPTCHA')) generateCaptcha();
      }
    } catch {
      Alert.alert('Error', 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [email, password, loginType, captcha, generateCaptcha, onLoginSuccess]);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LoginHeader onBackToHome={onBackToHome} />
        <LoginForm
          loginType={loginType}
          onLoginTypeChange={setLoginType}
          email={email}
          password={password}
          setEmail={setEmail}
          setPassword={setPassword}
          errors={errors}
        />
        <CaptchaInput
          captcha={captcha}
          setCaptcha={setCaptcha}
          captchaCode={captchaCode}
          onRefresh={generateCaptcha}
          error={errors.captcha}
        />
        <LoginButton onPress={handleLogin} loading={isLoading} />
      </ScrollView>
    </View>
  );
};

export default LoginPage;
