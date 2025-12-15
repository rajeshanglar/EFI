import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { EmailIcon } from '../../../components/icons';
import styles from '../styles';
import { colors } from '../../../styles/globalStyles';
import LinearGradient from 'react-native-linear-gradient';

interface Props {
  email_id: string;
  setEmail_id: (text: string) => void;
  onSubmit: () => void;
  onBack: () => void;
  error?: string;
  isLoading?: boolean;
}

const ForgotPasswordForm: React.FC<Props> = React.memo(
  ({
    email_id,
    setEmail_id,
    onSubmit,
    onBack,
    error,
    isLoading = false,
  }) => {
    return (
      <View>
        <Text style={styles.welcomeTitle}>FORGOT PASSWORD</Text>
        <Text style={styles.forgotPasswordSubtitle}>
          Enter your email address and we'll send you instructions to reset your password.
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
              onChangeText={setEmail_id}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
          </View>
          {error && <Text style={styles.errorText}>{error}</Text>}
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
            {isLoading ? 'Sending...' : 'Send Reset Instructions'}
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

ForgotPasswordForm.displayName = 'ForgotPasswordForm';

export default ForgotPasswordForm;

