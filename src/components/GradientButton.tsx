import React, { ReactNode } from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors, spacing, borderRadius, Fonts } from '../styles/globalStyles';
import { Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface GradientButtonProps {
  title: string;
  onPress: () => void;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  gradientColors?: string[];
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

export const GradientButton: React.FC<GradientButtonProps> = ({
  title,
  onPress,
  icon,
  iconPosition = 'left',
  gradientColors = [colors.blue, colors.primaryLight],
  style,
  textStyle,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.container, style]}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        <View style={styles.contentContainer}>
          {icon && iconPosition === 'left' && (
            <View style={styles.iconContainer}>
              {icon}
            </View>
          )}
    
          <Text style={[styles.text, textStyle, disabled && styles.disabledText]}>
            {title}
          </Text>         
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  gradient: {
    marginHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 150,
    height:42,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginHorizontal: spacing.xs,
  },
  text: {
    color: colors.white,
    fontSize: screenWidth * 0.043,
    fontFamily: Fonts.Bold,
    lineHeight: screenHeight * 0.04,
  },
  disabledText: {
    opacity: 0.6,
  },
});

export default GradientButton;
