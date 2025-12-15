import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import globalStyles, { colors, spacing, borderRadius } from '../../../styles/globalStyles';
import { TickIcon } from '../../../components/icons';
import styles from '../../login/styles';

interface ActionButtonProps {
  title: string;
  icon: React.ComponentType<any>;
  onPress: () => void;
  style?: any;
  iconStyle?: any;
  textStyle?: any;
  iconContainer?: any;
  isSpecial?: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ 
  title, 
  icon: Icon, 
  onPress, 
  style, 
  iconStyle, 
  textStyle,
  iconContainer,
  isSpecial = false
}) => (
  <TouchableOpacity style={[style]} onPress={onPress}>
    <View style={[iconContainer]}>
      <View style={[iconStyle]}>
        <Icon size={isSpecial ? 34 : 34} color={isSpecial ? colors.white : undefined} />
      </View>
      {isSpecial && (
          <View style={globalStyles.tickIconContainer}>
          <TickIcon size={16} color={colors.primary} />
        </View>
      )}
    </View>
    <Text style={[textStyle]}>{title}</Text>
  </TouchableOpacity>
);



export default ActionButton;
