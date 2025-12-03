import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from 'react-native';
import Header from '../../components/Header';
import globalStyles, { colors, spacing, borderRadius, Fonts } from '../../styles/globalStyles';
import {
  PasswordIcon,
  PasswordViewIcon,
  PasswordViewHideIcon,
} from '../../components/icons';
import { GradientButton } from '../../components/GradientButton';
import { ChangePassword as ChangePasswordAPI } from '../../services/authService';
import authService from '../../services/authService';
import { ToastService } from '../../utils/service-handlers';
import { useNavigationContext } from '../../contexts/NavigationContext';

const { width: screenWidth } = Dimensions.get('window');


interface ChangePasswordProps {
  onBack: () => void;
  onNavigateToHome: () => void;
  onNavigateToLogin?: () => void;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({
  onBack,
  onNavigateToHome,
  onNavigateToLogin,
}) => {
  const { navigate } = useNavigationContext();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    current_password?: string;
    new_password?: string;
    new_password_confirmation?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!currentPassword.trim()) {
      newErrors.current_password = 'Current password is required';
    }

    if (!newPassword.trim()) {
      newErrors.new_password = 'New password is required';
    } else if (newPassword.length < 6) {
      newErrors.new_password = 'Password must be at least 6 characters';
    } else if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(newPassword)) {
      newErrors.new_password = 'Password must contain letters and numbers';
    }

    if (!confirmPassword.trim()) {
      newErrors.new_password_confirmation = 'Please confirm your password';
    } else if (newPassword !== confirmPassword) {
      newErrors.new_password_confirmation = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const extractError = (error: any): string => {
    return Array.isArray(error) ? error[0] : error;
  };

  const handleApiErrors = (errorData: any) => {
    const apiErrors: typeof errors = {};
    if (errorData.current_password) apiErrors.current_password = extractError(errorData.current_password);
    if (errorData.new_password) apiErrors.new_password = extractError(errorData.new_password);
    if (errorData.new_password_confirmation) apiErrors.new_password_confirmation = extractError(errorData.new_password_confirmation);
    return apiErrors;
  };

  const handleCurrentPasswordChange = useCallback((text: string) => {
    setCurrentPassword(text);
    if (errors.current_password) {
      setErrors((prev) => ({ ...prev, current_password: undefined }));
    }
  }, [errors.current_password]);

  const handleNewPasswordChange = useCallback((text: string) => {
    setNewPassword(text);
    if (errors.new_password) {
      setErrors((prev) => ({ ...prev, new_password: undefined }));
    }
  }, [errors.new_password]);

  const handleConfirmPasswordChange = useCallback((text: string) => {
    setConfirmPassword(text);
    if (errors.new_password_confirmation) {
      setErrors((prev) => ({ ...prev, new_password_confirmation: undefined }));
    }
  }, [errors.new_password_confirmation]);

  const toggleCurrentPassword = useCallback(() => setShowCurrentPassword(prev => !prev), []);
  const toggleNewPassword = useCallback(() => setShowNewPassword(prev => !prev), []);
  const toggleConfirmPassword = useCallback(() => setShowConfirmPassword(prev => !prev), []);


  const handleSubmit = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const payload = {
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
      };

      const result = await ChangePasswordAPI(payload);


      if (result?.success) {
        ToastService.success('Success', result?.message || 'Password changed successfully!');
        
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        
        // Clear authentication tokens
        try {
          await authService.logout();
        } catch (clearTokenError) {
          console.error('Error clearing tokens:', clearTokenError);
        }
        
        // Navigate to login page
        (onNavigateToLogin || (() => navigate.to('login')))();
      } else {
        const errorMessage = result?.message || 'Failed to change password';
        setErrors(result?.errors ? handleApiErrors(result.errors) : { current_password: errorMessage });
        ToastService.error('Error', errorMessage);
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to change password. Please try again.';
      const errorData = error?.response?.data?.errors;
      setErrors(errorData ? handleApiErrors(errorData) : { current_password: errorMessage });
      ToastService.error('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [currentPassword, newPassword, confirmPassword, onNavigateToLogin, navigate]);

  return (
    <View style={styles.container}>
      <Header
        title="Change Password"
        onBack={onBack}
        onNavigateToHome={onNavigateToHome}
        onMenuItemPress={(id: any) => console.log('Menu:', id)}
      />

<View style={styles.containerFullWidth}>
<ImageBackground
          source={require('../../assets/images/ribbon-color-img.png')}
          style={globalStyles.bgBottomRibbon}
          imageStyle={globalStyles.bgBottomRibbonImage}
        />
       
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          <Text style={styles.title}>Change Password</Text>
          <Text style={styles.subtitle}>
            Enter your current password and your new password.
          </Text>

          <PasswordField
            key="current-password"
            label="Current Password"
            value={currentPassword}
            onChangeText={handleCurrentPasswordChange}
            onToggleVisibility={toggleCurrentPassword}
            showPassword={showCurrentPassword}
            error={errors.current_password}
            placeholder="Enter Current Password"
            editable={!isLoading}
          />

          <PasswordField
            key="new-password"
            label="New Password"
            value={newPassword}
            onChangeText={handleNewPasswordChange}
            onToggleVisibility={toggleNewPassword}
            showPassword={showNewPassword}
            error={errors.new_password}
            placeholder="Enter New Password"
            editable={!isLoading}
          />

          <PasswordField
            key="confirm-password"
            label="Confirm New Password"
            value={confirmPassword}
            onChangeText={handleConfirmPasswordChange}
            onToggleVisibility={toggleConfirmPassword}
            showPassword={showConfirmPassword}
            error={errors.new_password_confirmation}
            placeholder="Confirm New Password"
            editable={!isLoading}
          />

          {/* Submit Button */}
          <View style={styles.buttonContainer}>
            <GradientButton
              title={isLoading ? 'Changing Password...' : 'Change Password'}
              onPress={handleSubmit}
              disabled={isLoading}
            />
          </View>
        </View>
      </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({

  //Container Full Width
  containerFullWidth:{
    width: '100%',
    flex: 1,
    position: 'relative',
  },

  //Container
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    flex: 1,
    backgroundColor:colors.transparent,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  formContainer: {
    backgroundColor:colors.transparent,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginTop: spacing.md,
  },
  title: {
    fontSize: screenWidth * 0.048,
    fontFamily: Fonts.Bold,
    color: colors.black,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: screenWidth * 0.035,
    fontFamily: Fonts.Regular,
    color: colors.darkGray,
    marginBottom: spacing.lg,
    textAlign: 'center',
    lineHeight: screenWidth * 0.045,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical:0,
    marginTop:0,
    backgroundColor:colors.white,
  },
  input: {
    flex: 1,
    fontSize: screenWidth * 0.038,
    fontFamily: Fonts.Regular,
    color: colors.black,
    marginLeft: spacing.sm,
  
  },
  eyeIconContainer: {
    padding: spacing.xs,
  },
  buttonContainer: {
    marginTop: spacing.lg,
  },
});

interface PasswordFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  onToggleVisibility: () => void;
  showPassword: boolean;
  error?: string;
  placeholder: string;
  editable: boolean;
}

const PasswordField: React.FC<PasswordFieldProps> = React.memo(({
  label,
  value,
  onChangeText,
  onToggleVisibility,
  showPassword,
  error,
  placeholder,
  editable,
}) => (
  <View style={globalStyles.fieldContainer}>
    <Text style={globalStyles.fieldLabel}>{label}</Text>
    <View style={styles.inputContainer}>
      <PasswordIcon size={24} color={colors.primary} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.gray}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={!showPassword}
        editable={editable}
      />
      <TouchableOpacity onPress={onToggleVisibility} style={styles.eyeIconContainer} activeOpacity={0.7}>
        {showPassword ? (
          <PasswordViewHideIcon size={20} color={colors.primary} />
        ) : (
          <PasswordViewIcon size={20} color={colors.primary} />
        )}
      </TouchableOpacity>
    </View>
    {error && <Text style={globalStyles.fieldErrorText}>{error}</Text>}
  </View>
));

export default ChangePassword;

