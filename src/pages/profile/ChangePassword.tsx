import React, { useState, useCallback } from 'react';
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
import { ToastService } from '../../utils/service-handlers';

const { width: screenWidth } = Dimensions.get('window');

interface ChangePasswordProps {
  onBack: () => void;
  onNavigateToHome: () => void;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({
  onBack,
  onNavigateToHome,
}) => {
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

      console.log('Change Password Response:', result);

      if (result?.success) {
        ToastService.success('Success', result?.message || 'Password changed successfully!');
        
        // Clear form
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        
        // Navigate back to profile
        onBack();
      } else {
        const errorMessage = result?.message || 'Failed to change password';
        
        // Handle field-specific errors
        if (result?.errors) {
          const apiErrors: typeof errors = {};
          if (result.errors.current_password) {
            apiErrors.current_password = Array.isArray(result.errors.current_password) 
              ? result.errors.current_password[0] 
              : result.errors.current_password;
          }
          if (result.errors.new_password) {
            apiErrors.new_password = Array.isArray(result.errors.new_password) 
              ? result.errors.new_password[0] 
              : result.errors.new_password;
          }
          if (result.errors.new_password_confirmation) {
            apiErrors.new_password_confirmation = Array.isArray(result.errors.new_password_confirmation) 
              ? result.errors.new_password_confirmation[0] 
              : result.errors.new_password_confirmation;
          }
          setErrors(apiErrors);
        } else {
          setErrors({ current_password: errorMessage });
        }
        
        ToastService.error('Error', errorMessage);
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to change password. Please try again.';
      
      // Handle field-specific errors from API
      if (error?.response?.data?.errors) {
        const apiErrors: typeof errors = {};
        const errorData = error.response.data.errors;
        if (errorData.current_password) {
          apiErrors.current_password = Array.isArray(errorData.current_password) 
            ? errorData.current_password[0] 
            : errorData.current_password;
        }
        if (errorData.new_password) {
          apiErrors.new_password = Array.isArray(errorData.new_password) 
            ? errorData.new_password[0] 
            : errorData.new_password;
        }
        if (errorData.new_password_confirmation) {
          apiErrors.new_password_confirmation = Array.isArray(errorData.new_password_confirmation) 
            ? errorData.new_password_confirmation[0] 
            : errorData.new_password_confirmation;
        }
        setErrors(apiErrors);
      } else {
        setErrors({ current_password: errorMessage });
      }
      
      ToastService.error('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [currentPassword, newPassword, confirmPassword, onBack]);

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
      >
        <View style={styles.formContainer}>
          <Text style={styles.title}>Change Password</Text>
          <Text style={styles.subtitle}>
            Enter your current password and your new password.
          </Text>

          {/* Current Password Field */}
          <View style={globalStyles.fieldContainer}>
            <Text style={globalStyles.fieldLabel}>Current Password</Text>
            <View style={styles.inputContainer}>
              <PasswordIcon size={24} color={colors.primary} />
              <TextInput
                style={styles.input}
                placeholder="Enter Current Password"
                placeholderTextColor={colors.gray}
                value={currentPassword}
                onChangeText={(text) => {
                  setCurrentPassword(text);
                  setErrors((prev) => ({ ...prev, current_password: undefined }));
                }}
                secureTextEntry={!showCurrentPassword}
                editable={!isLoading}
              />
              <TouchableOpacity
                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                style={styles.eyeIconContainer}
                activeOpacity={0.7}
              >
                {showCurrentPassword ? (
                  <PasswordViewHideIcon size={20} color={colors.primary} />
                ) : (
                  <PasswordViewIcon size={20} color={colors.primary} />
                )}
              </TouchableOpacity>
            </View>
            {errors.current_password && (
              <Text style={globalStyles.fieldErrorText}>{errors.current_password}</Text>
            )}
          </View>

          {/* New Password Field */}
          <View style={globalStyles.fieldContainer}>
            <Text style={globalStyles.fieldLabel}>New Password</Text>
            <View style={styles.inputContainer}>
              <PasswordIcon size={24} color={colors.primary} />
              <TextInput
                style={styles.input}
                placeholder="Enter New Password"
                placeholderTextColor={colors.gray}
                value={newPassword}
                onChangeText={(text) => {
                  setNewPassword(text);
                  setErrors((prev) => ({ ...prev, new_password: undefined }));
                }}
                secureTextEntry={!showNewPassword}
                editable={!isLoading}
              />
              <TouchableOpacity
                onPress={() => setShowNewPassword(!showNewPassword)}
                style={styles.eyeIconContainer}
                activeOpacity={0.7}
              >
                {showNewPassword ? (
                  <PasswordViewHideIcon size={20} color={colors.primary} />
                ) : (
                  <PasswordViewIcon size={20} color={colors.primary} />
                )}
              </TouchableOpacity>
            </View>
            {errors.new_password && (
              <Text style={globalStyles.fieldErrorText}>{errors.new_password}</Text>
            )}
          </View>

          {/* Confirm Password Field */}
          <View style={globalStyles.fieldContainer}>
            <Text style={globalStyles.fieldLabel}>Confirm New Password</Text>
            <View style={styles.inputContainer}>
              <PasswordIcon size={24} color={colors.primary} />
              <TextInput
                style={styles.input}
                placeholder="Confirm New Password"
                placeholderTextColor={colors.gray}
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  setErrors((prev) => ({ ...prev, new_password_confirmation: undefined }));
                }}
                secureTextEntry={!showConfirmPassword}
                editable={!isLoading}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIconContainer}
                activeOpacity={0.7}
              >
                {showConfirmPassword ? (
                  <PasswordViewHideIcon size={20} color={colors.primary} />
                ) : (
                  <PasswordViewIcon size={20} color={colors.primary} />
                )}
              </TouchableOpacity>
            </View>
            {errors.new_password_confirmation && (
              <Text style={globalStyles.fieldErrorText}>
                {errors.new_password_confirmation}
              </Text>
            )}
          </View>

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

export default ChangePassword;

