import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { EmailIcon, OtpIcon, PasswordIcon, PasswordViewIcon, PasswordViewHideIcon } from '../../../components/icons';
import styles from '../styles';
import { colors } from '../../../styles/globalStyles';
import LinearGradient from 'react-native-linear-gradient';

interface Props {
  email_id  : string;
  otp_code: string;
  new_password: string;
  new_password_confirmation: string;
  setEmail_id: (text: string) => void;
  setOtp_code: (text: string) => void;
  setNew_password: (text: string) => void;
  setNew_password_confirmation: (text: string) => void;
  onSubmit: () => void;
  onBack: () => void;
  errors: {
    email_id?: string;
    otp_code?: string;
    new_password?: string;
    new_password_confirmation?: string;
  };
  isLoading?: boolean;
}

const ChangePasswordForm: React.FC<Props> = React.memo(
  ({
    email_id,
    otp_code,
    new_password,
    new_password_confirmation,
    setEmail_id,
    setOtp_code,
    setNew_password,
    setNew_password_confirmation,
    onSubmit,
    onBack,
    errors,
    isLoading = false,
  }) => {
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
      <View>
        <Text style={styles.welcomeTitle}>CHANGE PASSWORD</Text>
        <Text style={styles.forgotPasswordSubtitle}>
          Enter the OTP code sent to your email and your new password.
        </Text>

        {/* Email */}
        <View style={styles.emailContainer}>
          <View style={styles.inputContainer}>
            <EmailIcon size={26} color={colors.primary} />
            <TextInput
              style={styles.input}
              placeholder="Enter Email"
              placeholderTextColor={colors.gray}
              value={email_id}
              onChangeText={(text) => setEmail_id(text.toLowerCase())}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
          </View>
          {errors.email_id && <Text style={styles.errorText}>{errors.email_id}</Text>}
        </View>

        {/* OTP Code */}
        <View style={styles.emailContainer}>
          <View style={styles.inputContainer}>
            <OtpIcon size={26} color={colors.primary} />
            <TextInput
              style={styles.input}
              placeholder="Enter OTP Code"
              placeholderTextColor={colors.gray}
              value={otp_code}
              onChangeText={setOtp_code}
              keyboardType="number-pad"
              editable={!isLoading}
              maxLength={6}
            />
          </View>
          {errors.otp_code && <Text style={styles.errorText}>{errors.otp_code}</Text>}
        </View>

        {/* New Password */}
        <View style={styles.emailContainer}>
          <View style={styles.inputContainer}>
            <PasswordIcon size={26} color={colors.primary} />
            <TextInput
              style={styles.input}
              placeholder="Enter New Password"
              placeholderTextColor={colors.gray}
              value={new_password}
              onChangeText={setNew_password}
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
          {errors.new_password && <Text style={styles.errorText}>{errors.new_password}</Text>}
        </View>

        {/* Confirm Password */}
        <View style={styles.emailContainer}>
          <View style={styles.inputContainer}>
            <PasswordIcon size={26} color={colors.primary} />
            <TextInput
              style={styles.input}
              placeholder="Confirm New Password"
              placeholderTextColor={colors.gray}
              value={new_password_confirmation}
              onChangeText={setNew_password_confirmation}
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
          {errors.new_password_confirmation && <Text style={styles.errorText}>{errors.new_password_confirmation}</Text>}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.loginButton, isLoading && styles.forgotPasswordButtonDisabled]}
          onPress={onSubmit}
          disabled={isLoading}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={[colors.blue, colors.primaryLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.loginButtonGradient}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? 'Resetting Password...' : 'Reset Password'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Back to Login */}
        <TouchableOpacity
          style={styles.backToLoginButton}
          onPress={onBack}
          disabled={isLoading}
          activeOpacity={0.7}
        >
          <Text style={styles.backToLoginText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    );
  },
);

ChangePasswordForm.displayName = 'ChangePasswordForm';

export default ChangePasswordForm;

