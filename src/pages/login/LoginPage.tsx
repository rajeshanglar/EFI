import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import authService, { LoginCredentials } from '../../services/authService';
import { colors, spacing, borderRadius, Fonts } from '../../styles/globalStyles';
import { EmailIcon, PasswordIcon, YellowRibbonIcon, LoginImg, ArrowLeftIconYellow,
  RefreshIcon
 } from '../../components/icons'; 
  

const { height: screenHeight } = Dimensions.get('window');

interface LoginPageProps {
  onLoginSuccess: () => void;
  onBackToHome: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onBackToHome }) => {
  const [loginType, setLoginType] = useState<'member' | 'conference'>('conference');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [captchaCode, setCaptchaCode] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; captcha?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const generateCaptcha = async () => {
      const newCaptcha = authService.generateCaptcha();
      setCaptchaCode(newCaptcha);
      await authService.storeCaptcha(newCaptcha);
    };
    generateCaptcha();
  }, []);

  const handleLoginTypeChange = (type: 'member' | 'conference') => {
    setLoginType(type);
    setErrors({});
  };

  const handleRefreshCaptcha = async () => {
    const newCaptcha = authService.generateCaptcha();
    setCaptchaCode(newCaptcha);
    setCaptcha('');
    await authService.storeCaptcha(newCaptcha);
  };

  const handleLogin = async () => {
    setErrors({});

    const credentials: LoginCredentials = {
      email,
      password,
      loginType,
      captcha,
    };

    const validation = authService.validateLogin(credentials);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsLoading(true);

    try {
      const result = await authService.login(credentials);
      
      if (result.success) {
        Alert.alert('Success', 'Login successful!', [
          { text: 'OK', onPress: onLoginSuccess },
        ]);
      } else {
        Alert.alert('Error', result.error || 'Login failed. Please try again.');
        if (result.error?.includes('CAPTCHA')) {
          handleRefreshCaptcha();
        }
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.LoginHeader}>
          <View style={styles.LoginLogoContainer}>
            <Image 
              source={require('../../assets/images/logo-w.png')} 
              style={styles.logo}
              resizeMode="contain"
            />        
          </View>

          <View style={styles.homeBackButtonImgContainer}>
                <TouchableOpacity style={styles.homeBackButton} onPress={onBackToHome}>          
                    <ArrowLeftIconYellow size={20} />         
                  <Text style={styles.backButtonText}>BACK TO HOME</Text>
                </TouchableOpacity>

                <View style={styles.floatingIconContainer}>
                  <View style={styles.floatingImgBlock}>
                  <LoginImg size={Dimensions.get('window').width * 0.26} style={styles.floatingimg} />
                  </View>
                </View>
          </View>
        </View>

        <View style={styles.loginCardContainer}>
            <View style={styles.loginCard}>
              <View style={styles.ribbonContainer}>
                <Image source={require('../../assets/images/ribbon-color-img.png')} style={styles.ribbonImage} />
              </View>

              <Text style={styles.welcomeTitle}>WELCOME TO LOGIN</Text>

              <View style={styles.loginTypeContainer}>
                <TouchableOpacity
                  style={styles.radioOption}
                  onPress={() => handleLoginTypeChange('member')}
                >
                  <View style={[styles.radio, loginType === 'member' && styles.radioSelected]}>
                    {loginType === 'member' && <View style={styles.radioInner} />}
                  </View>
                  <Text style={styles.radioText}>Member Login</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.radioOption}
                  onPress={() => handleLoginTypeChange('conference')}
                >
                  <View style={[styles.radio, loginType === 'conference' && styles.radioSelected]}>
                    {loginType === 'conference' && <View style={styles.radioInner} />}
                  </View>
                  <Text style={styles.radioText}>Conference Login</Text>
                </TouchableOpacity>
              </View>


          <View style={styles.mainInputContainer}>
              <View style={styles.inputContainer}>
                <EmailIcon size={26} color={colors.primary} />
             
                <TextInput
                  style={styles.input}
                  placeholder="Enter Email"
                  placeholderTextColor={colors.gray}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>



          <View style={styles.mainInputContainer}>
              <View style={styles.inputContainer}>
                <PasswordIcon size={26} color={colors.primary} />              
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder="Enter Password"
                  placeholderTextColor={colors.gray}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
                <TouchableOpacity style={styles.forgotButton}>
                  <Text style={styles.forgotText}>Forgot?</Text>
                </TouchableOpacity>
              </View>
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
           </View>


              <View style={styles.mainInputContainer}>
              <View style={styles.captchaContainer}>
                <View style={styles.captchaBox}>
                  <Text style={styles.captchaText}>{captchaCode}</Text>
                </View>
                <TouchableOpacity style={styles.captchaRefresh} onPress={handleRefreshCaptcha}>
                     <RefreshIcon size={20} color={colors.primary} />
                </TouchableOpacity>
                <TextInput
                  style={styles.captchaInput}
                  placeholder="Enter CAPTCHA"
                  placeholderTextColor={colors.gray}
                  value={captcha}
                  onChangeText={setCaptcha}
                  autoCapitalize="characters"
                  maxLength={6}
                />
              </View>
              {errors.captcha && <Text style={styles.errorText}>{errors.captcha}</Text>}
            </View>

              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleLogin}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={[colors.blue, colors.primaryLight]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.loginButtonGradient}
                >
                  <Text style={styles.loginButtonText}>
                    {isLoading ? 'LOGGING IN...' : 'LOGIN'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    flex: 1,
  },
  LoginHeader: {
    backgroundColor: colors.primary,
    paddingTop: spacing.sm,
    paddingBottom: 0,
    marginBottom:0,
    position: 'relative',
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
 
  },
  LoginLogoContainer: {
    alignItems: 'center',
    paddingTop: spacing.lg,
    
  },
  logo: {
    width:Dimensions.get('window').width * 0.9,
    height: Dimensions.get('window').height * 0.085,
    marginBottom: spacing.sm,
  },

  homeBackButtonImgContainer: {
    position: 'relative',  
    marginTop: spacing.md, 
  },

  homeBackButton: {
    position: 'absolute',
    bottom:15,
    left: 0,
    zIndex: 10, 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.sm,
  },
 

  backButtonText: {
    color: colors.primaryLight,
    fontSize: Dimensions.get('window').width * 0.028,
   fontFamily: Fonts.SemiBold,
    letterSpacing: 1,
    marginLeft: spacing.sm,
  },
  floatingIconContainer: {
   flexDirection: 'row',
   justifyContent: 'center',
   alignItems: 'center',
   padding: spacing.md,
   marginBottom:-23,
  },

  floatingImgBlock: {
    width: Dimensions.get('window').width * 0.28,
    height: Dimensions.get('window').height * 0.12,
    backgroundColor: colors.white,
    borderTopRightRadius: borderRadius.xl,
    borderTopLeftRadius: borderRadius.xl,
    justifyContent: 'flex-start',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  floatingimg:{
    width: Dimensions.get('window').width * 0.9,
    height: Dimensions.get('window').height * 0.1,
   
  },

  loginCardContainer: {
    backgroundColor:colors.white,
    padding: spacing.lg,
  },

  loginCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,

    padding: spacing.md,
    marginTop:spacing.md,
  
    minHeight: screenHeight * 0.5,
    position: 'relative',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  ribbonContainer: {
    position: 'absolute',
    top:-52,
    right:-40,
    overflow: 'hidden',
  },
  ribbonImage: {
    width: Dimensions.get('window').width * 0.25,
    height: Dimensions.get('window').height * 0.09,
  },
  welcomeTitle: {
    fontSize: Dimensions.get('window').width * 0.05, 
    color: colors.black,
    fontFamily: Fonts.Bold,
    marginTop:Dimensions.get('window').height * 0.01,
    marginBottom: spacing.md,
  },


  loginTypeContainer: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.gray,
    marginRight:5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.white,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primaryLight,
    borderColor:'#EFD603',
    borderWidth: 1,
  },
  radioText: {
    fontSize: Dimensions.get('window').width * 0.037,
    color: colors.black,
    fontFamily: Fonts.Medium,
  },

  mainInputContainer: {
    marginBottom: spacing.md,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: colors.gray,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm,
    marginBottom:6,
  },

  input: {
    flex: 1,
    fontSize:Dimensions.get('window').width * 0.04,
    fontFamily: Fonts.Regular,
    color: colors.black,
    paddingVertical: spacing.sm,
    marginLeft: spacing.sm,
  },
  passwordInput: {
    marginRight: spacing.md,
  },
  forgotButton: {
    padding: spacing.xs,
  },
  forgotText: {
    color: colors.blue,
    fontSize: Dimensions.get('window').width * 0.037,
    fontFamily: Fonts.SemiBold,
  },
  captchaContainer: {
    backgroundColor: '#FFFBE7',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#9A8A5B',
    borderRadius:4,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  captchaBox: {   
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    marginRight: spacing.sm,
  },
  captchaText: {
    fontSize:Dimensions.get('window').width * 0.05,
    color: colors.primary,
    fontFamily: Fonts.Bold,
    letterSpacing: 2,
  },
  captchaRefresh: {
    padding: spacing.xs,
    marginRight: spacing.sm,
  },
  captchaRefreshText: {
    fontSize: Dimensions.get('window').width * 0.07,
    color: colors.primary,
    fontFamily: Fonts.Bold,
  },
  captchaInput: {
    flex: 1,
    fontSize: Dimensions.get('window').width * 0.04,
    fontFamily: Fonts.Medium,
    color: colors.primary,   
    backgroundColor:colors.white,
    borderColor:colors.gray,
    borderWidth:1,
    borderRadius:4,
    paddingHorizontal: spacing.sm,
   
  },
  errorText: {
    color: colors.red,
    fontSize: Dimensions.get('window').width * 0.03,
    fontFamily: Fonts.Medium,   
    marginLeft: spacing.sm,
  },
  loginButton: {
    borderRadius:100,
    overflow: 'hidden',
    marginTop: 0,
    marginBottom: spacing.lg,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  loginButtonGradient: {
    paddingVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
    height: Dimensions.get('window').height * 0.04,
  },
  loginButtonText: {
    color: colors.white,
    fontSize: Dimensions.get('window').width * 0.05,
    height: Dimensions.get('window').height * 0.04,
    lineHeight: Dimensions.get('window').height * 0.04,
    fontFamily: Fonts.Bold,
    letterSpacing: 1,
    textAlign: 'center',
  },
});

export default LoginPage;
