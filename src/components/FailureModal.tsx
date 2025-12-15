import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions, Platform } from 'react-native';
import { colors, spacing, borderRadius, Fonts } from '../styles/globalStyles';
import { GradientButton } from './GradientButton';

const { width: screenWidth } = Dimensions.get('window');

interface FailureModalProps {
  visible: boolean;
  message: string;
  onClose: () => void;
  icon?: React.ReactNode;
  instructionText?: string;
  disableOverlayClose?: boolean;
}

export const FailureModal: React.FC<FailureModalProps> = ({
  visible,
  message,
  onClose,
  icon,
  instructionText,
  disableOverlayClose = false,
}) => {
  const OverlayComponent = disableOverlayClose ? View : TouchableOpacity;
  const overlayProps = disableOverlayClose 
    ? {} 
    : { activeOpacity: 1, onPress: onClose };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={disableOverlayClose ? () => {} : onClose}
      hardwareAccelerated={true}
    >
      <OverlayComponent
        style={styles.overlay}
        {...overlayProps}
      >
        <View
          style={styles.container}
          onStartShouldSetResponder={() => true}
        >
          {/* Failure Icon */}
          <View style={styles.iconContainer}>
            {icon ? icon : (
              <View style={styles.errorIconCircle}>
                <Text style={styles.errorIconText}>✕</Text>
              </View>
            )}
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
        </View>
      </OverlayComponent>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
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
  errorIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFEBEE',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#F44336',
  },
  errorIconText: {
    fontSize: 48,
    color: '#F44336',
    fontWeight: 'bold',
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
    backgroundColor: '#FFEBEE',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    width: '100%',
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
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
});

export default FailureModal;

