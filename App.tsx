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
import { ConferenceRegistrationPage, ConferenceRegistrationForm, ConferencePaymentDetails, ConferenceQRCode, ConferenceList, ConferenceSessionDetails, MyConference, MyConferenceSession } from './src/pages/conference';
import { colors } from './src/styles/globalStyles';

type PageType = 'login' | 'home' | 'conference' | 'conferenceForm' | 'payment' | 'qrCode' | 'conferenceList' | 'sessionDetails' | 'myConference' | 'myConferenceSession';

function AppContent() {
  const { isAuthenticated, loading, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [selectedTier, setSelectedTier] = useState<'Early Bird' | 'Regular' | 'On Spot'>('Early Bird');
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [myConferenceSessions, setMyConferenceSessions] = useState<string[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      // setCurrentPage('login');
      setCurrentPage('conferenceList');
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

  const handleNavigateToSessionDetails = (eventData: any) => {
    // Transform event data to session data format
    const sessionData = {
      id: eventData.id,
      date: eventData.parsedDate || eventData.date,
      time: eventData.timeRange,
      location: eventData.hall || 'Main Hall',
      workshopNumber: eventData.title.includes('Workshop') ? eventData.title.match(/Workshop \d+/)?.[0] : undefined,
      title: eventData.title.includes(':') ? eventData.title.split(':')[1].trim() : eventData.title,
      subtitle: eventData.title.includes('Simulation') ? 'Simulation to Strategy' : undefined,
      theme: '"The Robotic Edge: Precision, Depth & Dexterity"',
      overview: 'This hands-on workshop focuses on robotic-assisted surgery for endometriosis. It features console-based simulator training, step-by-step case videos, and real-time guidance from India\'s and the world\'s top robotic endometriosis surgeons. Suitable for beginners to advanced surgeons, this workshop provides comprehensive insight into robotic techniques.',
    };
    setSelectedSession(sessionData);
    setCurrentPage('sessionDetails');
  };

  const handleBackFromSessionDetails = () => {
    setCurrentPage('conferenceList');
    setSelectedSession(null);
  };

  // My Conference handlers
  const handleAddToMyConference = (sessionId: string) => {
    if (!myConferenceSessions.includes(sessionId)) {
      setMyConferenceSessions([...myConferenceSessions, sessionId]);
    }
  };

  const handleRemoveFromMyConference = (sessionId: string) => {
    setMyConferenceSessions(myConferenceSessions.filter((id) => id !== sessionId));
  };

  const handleNavigateToMyConference = () => {
    setCurrentPage('myConference');
  };

  const handleBackFromMyConference = () => {
    setCurrentPage('home');
  };

  const handleNavigateToMyConferenceSession = (eventData: any) => {
    const sessionData = {
      id: eventData.id,
      date: eventData.parsedDate || eventData.date,
      time: eventData.timeRange,
      location: eventData.hall || 'Main Hall',
      workshopNumber: eventData.title.includes('Workshop') ? eventData.title.match(/Workshop \d+/)?.[0] : undefined,
      title: eventData.title.includes(':') ? eventData.title.split(':')[1].trim() : eventData.title,
      subtitle: eventData.title.includes('Simulation') ? 'Simulation to Strategy' : undefined,
      theme: '"The Robotic Edge: Precision, Depth & Dexterity"',
      overview: 'This hands-on workshop focuses on robotic-assisted surgery for endometriosis. It features console-based simulator training, step-by-step case videos, and real-time guidance from India\'s and the world\'s top robotic endometriosis surgeons.',
    };
    setSelectedSession(sessionData);
    setCurrentPage('myConferenceSession');
  };

  const handleBackFromMyConferenceSession = () => {
    setCurrentPage('myConference');
    setSelectedSession(null);
  };

  const handleRemoveFromMyConferenceSession = () => {
    if (selectedSession?.id) {
      handleRemoveFromMyConference(selectedSession.id);
      handleBackFromMyConferenceSession();
    }
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
          sessionData={selectedSession}
          onAddToMyConference={handleAddToMyConference}
          onRemoveFromMyConference={handleRemoveFromMyConference}
          isInMyConference={myConferenceSessions.includes(selectedSession?.id || '')}
        />
      ) : currentPage === 'myConference' ? (
        <MyConference
          onBack={handleBackFromMyConference}
          onNavigateToHome={handleBackToHome}
          onEventPress={handleNavigateToMyConferenceSession}
          myConferenceSessions={myConferenceSessions}
          onRemoveSession={handleRemoveFromMyConference}
        />
      ) : currentPage === 'myConferenceSession' ? (
        <MyConferenceSession
          onBack={handleBackFromMyConferenceSession}
          onNavigateToHome={handleBackToHome}
          sessionData={selectedSession}
          onRemoveFromConference={handleRemoveFromMyConferenceSession}
          onLiveQA={() => console.log('Live Q&A')}
          onSessionNotes={() => console.log('Session Notes')}
          onHandouts={() => console.log('Handouts')}
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
