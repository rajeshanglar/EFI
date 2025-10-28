import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import globalStyles, { colors, spacing, borderRadius } from '../../../styles/globalStyles';

interface ActionButtonProps {
  title: string;
  icon: React.ComponentType<any>;
  onPress: () => void;
  style?: any;
  iconStyle?: any;
  textStyle?: any;
  iconContainer?: any;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ 
  title, 
  icon: Icon, 
  onPress, 
  style, 
  iconStyle, 
  textStyle,
  iconContainer
}) => (
  <TouchableOpacity style={[style]} onPress={onPress}>
    <View style={[iconContainer]}>
      <View style={[iconStyle]}>
        <Icon size={34} />
      </View> 
    </View>
    <Text style={[textStyle]}>{title}</Text>
  </TouchableOpacity>
);



export default ActionButton;
