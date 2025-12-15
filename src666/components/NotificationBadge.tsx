import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import globalStyles, { colors, spacing, borderRadius } from '../styles/globalStyles';
import { NotificationIcon } from './icons';

interface NotificationBadgeProps {
  count: number;
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({ count }) => (
  <View style={globalStyles.notificationContainer}>
    <NotificationIcon size={25} color={colors.white} />
    <View style={globalStyles.notificationBadge}>
      <Text style={globalStyles.notificationText}>{count=(12)}</Text>
    </View>
  </View>
);






export default NotificationBadge;
