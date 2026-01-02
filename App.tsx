import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import messaging from '@react-native-firebase/messaging';

import { AuthProvider } from './src/contexts/AuthContext';
import AppNavigation from './src/navigation/app-navigation';
import { Fonts } from './src/styles/globalStyles';

const { width: screenWidth } = Dimensions.get('window');

// --------------------
// Custom Toast Component
// --------------------
const CustomToast = ({ text1, text2, type }: any) => {
  const getBorderColor = () => {
    switch (type) {
      case 'success':
        return '#00b000';
      case 'error':
        return '#ff1100';
      case 'info':
        return '#0079d8';
      default:
        return '#0079d8';
    }
  };

  const getText2Color = () => {
    switch (type) {
      case 'success':
        return '#00b000';
      case 'error':
        return '#ff1100';
      case 'info':
        return '#0079d8';
      default:
        return '#0079d8';
    }
  };

  return (
    <View style={[styles.toastContainer, { borderLeftColor: getBorderColor() }]}>
      <View style={styles.contentContainer}>
        {text1 && <Text style={styles.text1}>{text1}</Text>}
        {text2 && (
          <Text style={[styles.text2, { color: getText2Color() }]}>
            {text2}
          </Text>
        )}
      </View>
    </View>
  );
};

// --------------------
// Styles
// --------------------
const styles = StyleSheet.create({
  toastContainer: {
    minHeight: 70,
    width: screenWidth * 0.9,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  contentContainer: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    flex: 1,
  },
  text1: {
    fontSize: screenWidth * 0.04,
    fontFamily: Fonts.SemiBold,
    color: '#000',
    marginBottom: 3,
  },
  text2: {
    fontSize: screenWidth * 0.035,
    fontFamily: Fonts.Regular,
  },
});

// --------------------
// Toast Configuration
// --------------------
const toastConfig = {
  success: (props: any) => <CustomToast {...props} type="success" />,
  error: (props: any) => <CustomToast {...props} type="error" />,
  info: (props: any) => <CustomToast {...props} type="info" />,
};

// --------------------
// App Component
// --------------------
export default function App() {

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  // Request Notification Permission
  const requestNotificationPermission = async () => {
    try {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Notification permission granted');
        getFcmToken();
      } else {
        console.log('Notification permission denied');
      }
    } catch (error) {
      console.log('Permission request error:', error);
    }
  };

  // Get FCM Token
  const getFcmToken = async () => {
    try {
      const token = await messaging().getToken();
      console.log('FCM TOKEN:', token);
      // TODO: send token to backend
    } catch (error) {
      console.log('FCM token error:', error);
    }
  };

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppNavigation />
        <Toast config={toastConfig} />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
