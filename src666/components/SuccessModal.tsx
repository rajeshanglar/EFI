import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { colors, spacing, borderRadius, Fonts } from '../styles/globalStyles';
import { SuccessIcon, DownloadIcon } from './icons';
import { GradientButton } from './GradientButton';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface SuccessModalProps {
  visible: boolean;
  message: string;
  onClose: () => void;
  onDownload?: () => void;
  downloadText?: string;
  icon?: React.ReactNode;
  instructionText?: string;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  visible,
  message,
  onClose,
  onDownload,
  downloadText = 'Download Payment Receipt',
  icon,
  instructionText,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => {}}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View
          style={styles.container}
          onStartShouldSetResponder={() => true}
        >
          {/* Success Icon */}
          <View style={styles.iconContainer}>
           
          {icon ? icon : <SuccessIcon size={60} color="#4CAF50" />}
           
          </View>

          {/* Message */}
          <Text style={styles.message}>{message}</Text>

          {/* Instruction Box */}
          {instructionText && (
            <View style={styles.instructionBox}>
              <Text style={styles.instructionText}>{instructionText}</Text>
            </View>
          )}

          {/* Okay Button */}
          <GradientButton
            title="Okay"
            onPress={onClose}
            style={styles.buttonContainer}
          />

          {/* Download Link */}
          {onDownload && (
            <TouchableOpacity onPress={onDownload} style={styles.downloadContainer}>
              <DownloadIcon size={20} color={colors.black} />
              <Text style={styles.downloadText}>{downloadText}</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {

    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',   
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    width: screenWidth * 0.85,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: spacing.lg,
  },

  message: {
    fontSize: screenWidth * 0.04,
    lineHeight: screenWidth * 0.064,
    fontFamily: Fonts.Medium,
    color: colors.black,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  instructionBox: {
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    width: '100%',
  },
  instructionText: {
    fontSize: screenWidth * 0.038,
    lineHeight: screenWidth * 0.06,
    fontFamily: Fonts.Medium,
    color: colors.black,
    textAlign: 'center',
  },
  buttonContainer: {
    marginBottom: spacing.xl,
  },
  downloadContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingTop: spacing.md,
  },
  downloadText: {
    fontSize: screenWidth * 0.04,
    fontFamily: Fonts.Medium,
    color: colors.black,
    textDecorationLine: 'underline',
  },
});

export default SuccessModal;

