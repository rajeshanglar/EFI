import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { globalStyles, colors, spacing, borderRadius } from '../../styles/globalStyles';
import ActionButton from './components/ActionButton';

interface CardProps {
  children: React.ReactNode;
  style?: any;
  onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, style, onPress }) => (
  <TouchableOpacity style={[styles.card, style]} onPress={onPress} activeOpacity={0.8}>
    {children}
  </TouchableOpacity>
);




// Re-export ActionButton from components
export { ActionButton };

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginVertical: spacing.sm,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },


});
