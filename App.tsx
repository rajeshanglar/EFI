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
import { ConferenceRegistrationPage, ConferenceRegistrationForm, ConferencePaymentDetails, ConferenceQRCode, ConferenceList, MyConference, ConferenceSessionDetails } from './src/pages/conference';
import { colors } from './src/styles/globalStyles';

type PageType = 'login' | 'home' | 'conference' | 'conferenceForm' | 'payment' | 'qrCode' | 'conferenceList' | 'myConference' | 'sessionDetails';

function AppContent() {
  const { isAuthenticated, loading, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [selectedTier, setSelectedTier] = useState<'Early Bird' | 'Regular' | 'On Spot'>('Early Bird');
  const [selectedSessionData, setSelectedSessionData] = useState<any>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      // setCurrentPage('home');
      setCurrentPage('sessionDetails');
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

  const handleNavigateToConferenceList = () => {
    setCurrentPage('conferenceList');
  };

  const handleBackFromConferenceList = () => {
    setCurrentPage('home');
  };

  const handleNavigateToMyConferenceMark = () => {
    setCurrentPage('myConference');
  };

  const handleBackFromMyConference = () => {
    setCurrentPage('home');
  };

  const handleNavigateToSessionDetails = (eventData: any, fromMyConference: boolean = false) => {
    // Map event data to SessionData format
    const sessionData = {
      id: eventData.id,
      date: eventData.parsedDate || eventData.dateLabel || '',
      time: eventData.timeRange || '',
      location: eventData.hall || '',
      workshopNumber: eventData.eventType || (eventData.title?.includes('Workshop') ? eventData.title.split(':')[0].trim() : undefined),
      title: eventData.title?.includes(':') ? eventData.title.split(':')[1]?.trim() || eventData.title : eventData.title,
      subtitle: undefined,
      theme: `"${eventData.title}"`,
      overview: `This session will cover topics related to ${eventData.title}. Join us for an informative and engaging presentation.`,
      imageUrl: undefined,
      isFromMyConference: fromMyConference,
    };
    setSelectedSessionData(sessionData);
    setCurrentPage('sessionDetails');
  };

  const handleBackFromSessionDetails = () => {
    // Determine where to go back based on where we came from
    const cameFrom = selectedSessionData?.isFromMyConference ? 'myConference' : 'conferenceList';
    setCurrentPage(cameFrom);
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
      ) : currentPage === 'conferenceList' ? (
        <ConferenceList
          onBack={handleBackFromConferenceList}
          onNavigateToHome={handleBackToHome}
          onEventPress={handleNavigateToSessionDetails}
        />
      ) : currentPage === 'sessionDetails' ? (
        <ConferenceSessionDetails
          onBack={handleBackFromSessionDetails}
          onNavigateToHome={handleBackToHome}
          sessionData={selectedSessionData}
          isFromMyConference={selectedSessionData?.isFromMyConference || false}
          isInMyConference={selectedSessionData?.isFromMyConference || false}
        />
      ) : currentPage === 'myConference' ? (
        <MyConference
          onBack={handleBackFromMyConference}
          onNavigateToHome={handleBackToHome}
          onEventPress={handleNavigateToSessionDetails}
        />
      ) : (
        <HomePage 
          onNavigateToConference={handleNavigateToConference} 
          onLogout={handleLogout}
          onNavigateToLogin={handleNavigateToLogin}
          onNavigateToMyConference={handleNavigateToMyConferenceMark}
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
