import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { AuthProvider } from './src/contexts/AuthContext';
import AppNavigation from './src/navigation/app-navigation';
import { Fonts } from './src/styles/globalStyles';
import { Dimensions } from 'react-native';

// Custom Toast configuration with font size and styling
const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: '#00b000',
        height: 70,
        backgroundColor: '#fff',
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize:Dimensions.get('window').width * 0.04,
        fontFamily: Fonts.SemiBold,
        color: '#000',
       
      }}
      text2Style={{
        fontSize: Dimensions.get('window').width * 0.035,
        fontFamily: Fonts.Regular,
        color: '#00b000',
      }}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: '#ff1100',
        height: 70,
        backgroundColor: '#fff',
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize:Dimensions.get('window').width * 0.04,
        fontFamily: Fonts.SemiBold,
        color:"#333333",
        
      }}
      text2Style={{
        fontSize:Dimensions.get('window').width * 0.035,
        fontFamily: Fonts.Regular,
        color: '#ff1100',
      }}
    />
  ),
  info: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: '#0079d8',
        height: 70,
        backgroundColor: '#fff',
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: Dimensions.get('window').width * 0.04,
        fontFamily: Fonts.SemiBold,
        color: '#000',        
      }}
      text2Style={{
        fontSize: Dimensions.get('window').width * 0.035,
        fontFamily: Fonts.Regular,
        color: '#0079d8',
      }}
    />
  ),
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppNavigation />
        <Toast config={toastConfig} />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
