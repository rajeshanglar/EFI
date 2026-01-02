import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { PERMISSIONS, request, check, RESULTS } from 'react-native-permissions';

import { AuthProvider } from './src/contexts/AuthContext';
import AppNavigation from './src/navigation/app-navigation';
import { Fonts } from './src/styles/globalStyles';
import { getDeviceInfoForBackend } from './src/utils/deviceInfo';
import api from './src/services/api';
import { registerDeviceTokenAnonymous } from './src/services/staticService';

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

  // Send Device Info to Backend
  const sendDeviceInfoToBackend = async (fcmToken?: string) => {
    try {
      const deviceInfo = await getDeviceInfoForBackend();

      // Only send to backend if we have an FCM token
      if (fcmToken) {
        const payload = {
          app_version: deviceInfo.app_version,
          platform: deviceInfo.platform.toLowerCase(),
          device_id: deviceInfo.device_id,
          device_token: fcmToken
        };
        
        try {
          console.log('Payload to send to backend:', JSON.stringify(payload, null, 2));
          await registerDeviceTokenAnonymous(payload);
          console.log('Device info registered successfully');
        } catch (error: any) {
          // Silently handle errors - don't break the app
          console.error('Failed to register device info:', error.response?.status || error.message);
        }
      }
    } catch (error: any) {
      // Silently handle errors - don't break the app
      console.error('Error getting device info:', error.message);
    }
  };

  // Get FCM Token
  const getFcmToken = async () => {
    try {
      const token = await messaging().getToken();
      console.log('FCM Token obtained:', token);
      // Send FCM token along with device info to backend
      await sendDeviceInfoToBackend(token);
    } catch (error) {
      console.error('FCM token error:', error);
    }
  };

  // Request Notification Permission
  const requestNotificationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        // For Android 13+ (API 33+), we need to request POST_NOTIFICATIONS permission
        if (Platform.Version >= 33) {
          // Use permission string directly for Android 13+ POST_NOTIFICATIONS
          const permission = 'android.permission.POST_NOTIFICATIONS' as any;
          const checkResult = await check(permission);
          
          if (checkResult === RESULTS.GRANTED) {
            console.log('Notification permission already granted');
            getFcmToken();
          } else if (checkResult === RESULTS.DENIED) {
            const requestResult = await request(permission);
            if (requestResult === RESULTS.GRANTED) {
              console.log('Notification permission granted');
              getFcmToken();
            } else {
              console.log('Notification permission denied');
            }
          } else {
            console.log('Notification permission blocked or unavailable');
          }
        } else {
          // For Android 12 and below, permissions are granted by default
          console.log('Notification permission granted (Android < 13)');
          getFcmToken();
        }
      } else {
        // For iOS, use Firebase messaging permission request
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
      }
    } catch (error) {
      console.log('Permission request error:', error);
    }
  };

  // Initialize on app mount
  useEffect(() => {
    // Send device info on app startup (without FCM token)
    sendDeviceInfoToBackend().catch(() => {
      // Silently handle errors
    });
    
    // Request notification permission
    requestNotificationPermission().catch(() => {
      // Silently handle errors
    });

    // Handle foreground notifications (when app is open)
    const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
      console.log('Foreground FCM Message received:', remoteMessage);
      
      // Show notification when app is in foreground
      if (remoteMessage.notification) {
        Toast.show({
          type: 'info',
          text1: remoteMessage.notification.title || 'Notification',
          text2: remoteMessage.notification.body || '',
          visibilityTime: 4000,
        });
      }
    });

    // Handle notification opened when app is in background
    const unsubscribeBackground = messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Notification opened app from background:', remoteMessage);
      // Handle navigation or other actions here if needed
    });
    
    // Listen for token refresh (important for receiving notifications)
    const unsubscribeTokenRefresh = messaging().onTokenRefresh(async (token) => {
      console.log('FCM Token refreshed, updating backend:', token);
      // Update token on backend when it refreshes
      await sendDeviceInfoToBackend(token).catch(() => {
        // Silently handle errors
      });
    });

    // Check if app was opened from a notification (quit state)
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('App opened from notification (quit state):', remoteMessage);
          // Handle the notification data here if needed
        }
      })
      .catch(error => {
        console.error('Error getting initial notification:', error);
      });

    // Cleanup on unmount
    return () => {
      unsubscribeForeground();
      unsubscribeBackground();
      unsubscribeTokenRefresh();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppNavigation />
        <Toast config={toastConfig} />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
