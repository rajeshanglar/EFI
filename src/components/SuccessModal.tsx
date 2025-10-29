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
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  visible,
  message,
  onClose,
  onDownload,
  downloadText = 'Download Payment Receipt',
  icon,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Success Icon */}
          <View style={styles.iconContainer}>
           
          {icon ? icon : <SuccessIcon size={60} color="#4CAF50" />}
           
          </View>

          {/* Message */}
          <Text style={styles.message}>{message}</Text>

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
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {

    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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

