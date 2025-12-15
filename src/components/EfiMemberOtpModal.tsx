import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { colors, spacing, borderRadius, Fonts } from '../styles/globalStyles';
import { GradientButton } from './GradientButton';
import { CloseIcon } from './icons';

const { width: screenWidth } = Dimensions.get('window');

interface EfiMemberOtpModalProps {
  visible: boolean;
  email: string;
  onVerify: (otp: string) => Promise<void>;
  onSendOtp: () => Promise<void>;
  onClose: () => void;
  isLoading?: boolean;
  otpExpiryMinutes?: number;
}

export const EfiMemberOtpModal: React.FC<EfiMemberOtpModalProps> = ({
  visible,
  email,
  onVerify,
  onSendOtp,
  onClose,
  isLoading = false,
  otpExpiryMinutes = 15,
}) => {
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState<string | undefined>(undefined);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (visible && !isOtpSent) {
      // Auto-send OTP when modal opens
      handleSendOtp();
    }
  }, [visible]);

  useEffect(() => {
    if (timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            if (timerRef.current) {
              clearInterval(timerRef.current);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timeRemaining]);

  const handleSendOtp = async () => {
    setIsSendingOtp(true);
    setOtpError(undefined);
    setOtp('');
    try {
      await onSendOtp();
      setIsOtpSent(true);
      setTimeRemaining(otpExpiryMinutes * 60); // Convert minutes to seconds
    } catch (error: any) {
      setOtpError(error?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerify = async () => {
    if (!otp || otp.length !== 6) {
      setOtpError('Please enter a valid 6-digit OTP');
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setOtpError('OTP must contain only numbers');
      return;
    }

    setOtpError(undefined);
    setIsVerifyingOtp(true);
    
    try {
      await onVerify(otp);
    } catch (error: any) {
      const errorMessage = error?.message || error?.response?.data?.message || 'Invalid OTP. Please try again.';
      setOtpError(errorMessage);
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleClose = () => {
    setOtp('');
    setOtpError(undefined);
    setIsOtpSent(false);
    setTimeRemaining(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={[
                styles.closeButton,
                (isVerifyingOtp || isLoading) && styles.closeButtonDisabled,
              ]}
              onPress={handleClose}
              activeOpacity={0.7}
              disabled={isVerifyingOtp || isLoading}
            >
              <CloseIcon size={20} color={(isVerifyingOtp || isLoading) ? colors.lightGray : colors.gray} />
            </TouchableOpacity>
            <Text style={styles.title}>EFI Member Verification</Text>
            <Text style={styles.subtitle}>
              Please verify your EFI membership by entering the OTP sent to:
            </Text>
            <Text style={styles.email}>{email}</Text>

            {isOtpSent && timeRemaining > 0 && (
              <Text style={styles.timerText}>
                OTP expires in: {formatTime(timeRemaining)}
              </Text>
            )}

            <View style={styles.otpContainer}>
              <TextInput
                style={[styles.otpInput, otpError && styles.otpInputError]}
                placeholder="Enter 6-digit OTP"
                placeholderTextColor={colors.gray}
                value={otp}
                onChangeText={(text) => {
                  const cleanedText = text.replace(/[^0-9]/g, '').slice(0, 6);
                  console.log('OTP Input Changed:', cleanedText, 'Length:', cleanedText.length);
                  setOtp(cleanedText);
                  setOtpError(undefined);
                }}
                keyboardType="number-pad"
                maxLength={6}
                editable={!isLoading && !isVerifyingOtp && isOtpSent}
                autoFocus={isOtpSent}
              />
              {otpError && <Text style={styles.errorText}>{otpError}</Text>}
            </View>

            {!isOtpSent || timeRemaining === 0 ? (
              <TouchableOpacity
                style={styles.resendButton}
                onPress={handleSendOtp}
                disabled={isSendingOtp}
              >
                <Text style={styles.resendButtonText}>
                  {isSendingOtp ? 'Sending...' : 'Resend OTP'}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.resendButton, timeRemaining > 0 && styles.resendButtonDisabled]}
                onPress={handleSendOtp}
                disabled={timeRemaining > 60 || isSendingOtp}
              >
                <Text style={styles.resendButtonText}>
                  {timeRemaining > 60
                    ? `Resend OTP (${formatTime(timeRemaining - 60)})`
                    : 'Resend OTP'}
                </Text>
              </TouchableOpacity>
            )}

            <View style={styles.buttonContainer}>
              <GradientButton
                title={isVerifyingOtp || isLoading ? 'VERIFYING...' : 'VERIFY OTP'}
                onPress={() => {
                  console.log('=== VERIFY OTP BUTTON PRESSED ===');
                  console.log('isVerifyingOtp:', isVerifyingOtp);
                  console.log('isLoading:', isLoading);
                  console.log('isOtpSent:', isOtpSent);
                  console.log('otp.length:', otp.length);
                  console.log('Button disabled:', isVerifyingOtp || isLoading || !isOtpSent || otp.length !== 6);
                  handleVerify();
                }}
                disabled={isVerifyingOtp || isLoading || !isOtpSent || otp.length !== 6}
              />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  modalContainer: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    width: screenWidth * 0.9,
    maxWidth: 400,
    alignItems: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    padding: spacing.xs,
    zIndex: 10,
    borderRadius: borderRadius.sm,
    backgroundColor: 'transparent',
  },
  closeButtonDisabled: {
    opacity: 0.5,
  },
  title: {
    fontSize: screenWidth * 0.05,
    fontFamily: Fonts.Bold,
    color: colors.black,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: screenWidth * 0.038,
    fontFamily: Fonts.Regular,
    color: colors.black,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  email: {
    fontSize: screenWidth * 0.04,
    fontFamily: Fonts.SemiBold,
    color: colors.primary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  timerText: {
    fontSize: screenWidth * 0.035,
    fontFamily: Fonts.Medium,
    color: '#F44336',
    marginBottom: spacing.md,
  },
  otpContainer: {
    width: '100%',
    marginBottom: spacing.md,
  },
  otpInput: {
    borderWidth: 2,
    borderColor: colors.gray,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: screenWidth * 0.045,
    fontFamily: Fonts.SemiBold,
    textAlign: 'center',
    letterSpacing: 8,
    color: colors.black,
  },
  otpInputError: {
    borderColor: '#F44336',
  },
  errorText: {
    fontSize: screenWidth * 0.032,
    fontFamily: Fonts.Regular,
    color: '#F44336',
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  resendButton: {
    marginBottom: spacing.md,
  },
  resendButtonDisabled: {
    opacity: 0.5,
  },
  resendButtonText: {
    fontSize: screenWidth * 0.038,
    fontFamily: Fonts.Medium,
    color: colors.primary,
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
  },
});

export default EfiMemberOtpModal;

