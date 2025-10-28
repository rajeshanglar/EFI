/**
 * EFI React Native App
 * Endometriosis Foundation of India
 *
 * @format
 */

import React, { useState, useEffect } from 'react';
import { StatusBar, ActivityIndicator } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import HomePage from './src/pages/home/HomePage';
import { LoginPage } from './src/pages/login';
import { ConferenceRegistrationPage, ConferenceRegistrationForm, ConferencePaymentDetails, ConferenceQRCode } from './src/pages/conference';
import { colors } from './src/styles/globalStyles';

type PageType = 'login' | 'home' | 'conference' | 'conferenceForm' | 'payment' | 'qrCode';

function AppContent() {
  const { isAuthenticated, loading, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [selectedTier, setSelectedTier] = useState<'Early Bird' | 'Regular' | 'On Spot'>('Early Bird');

  useEffect(() => {
    if (!isAuthenticated) {
      // setCurrentPage('login');
      setCurrentPage('qrCode');
    }
  }, [isAuthenticated]);

  const handleLoginSuccess = () => {
    setCurrentPage('home');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
  };

  const handleNavigateToConference = () => {
    setCurrentPage('conference');
  };

  const handleBackFromConference = () => {
    setCurrentPage('home');
  };

  const handleNavigateToForm = (tier: 'Early Bird' | 'Regular' | 'On Spot') => {
    setSelectedTier(tier);
    setCurrentPage('conferenceForm');
  };

  const handleBackFromForm = () => {
    setCurrentPage('conference');
  };

  const handleNavigateToPayment = (formData: any) => {
    setCurrentPage('payment');
  };

  const handleBackFromPayment = () => {
    setCurrentPage('conferenceForm');
  };

  const handleNavigateToQRCode = () => {
    setCurrentPage('qrCode');
  };

  const handleBackFromQRCode = () => {
    setCurrentPage('payment');
  };

  const handleLogout = async () => {
    await logout();
    setCurrentPage('login');
  };

  const handleNavigateToLogin = () => {
    setCurrentPage('login');
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primaryLight} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.primary }}>
      {currentPage === 'login' ? (
        <LoginPage onLoginSuccess={handleLoginSuccess} onBackToHome={handleBackToHome} />
      ) : currentPage === 'conference' ? (
        <ConferenceRegistrationPage 
          onBack={handleBackFromConference} 
          onNavigateToHome={handleBackToHome}
          onNavigateToForm={handleNavigateToForm}
        />
      ) : currentPage === 'conferenceForm' ? (
        <ConferenceRegistrationForm
          registrationTier={selectedTier}
          onBack={handleBackFromForm}
          onNavigateToHome={handleBackToHome}
          onNavigateToPayment={handleNavigateToPayment}
        />
      ) : currentPage === 'payment' ? (
        <ConferencePaymentDetails
          onBack={handleBackFromPayment}
          onNavigateToHome={handleBackToHome}
          onNavigateToQRCode={handleNavigateToQRCode}
        />
      ) : currentPage === 'qrCode' ? (
        <ConferenceQRCode
          onBack={handleBackFromQRCode}
          onNavigateToHome={handleBackToHome}
          onNavigateToLogin={handleNavigateToLogin}
        />
      ) : (
        <HomePage 
          onNavigateToConference={handleNavigateToConference} 
          onLogout={handleLogout}
          onNavigateToLogin={handleNavigateToLogin}
        />
      )}
      {/* <StatusBar barStyle="light-content" backgroundColor="#1a237e" /> */}
    </SafeAreaView>
  );
}

function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

export default App;
