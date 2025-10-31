import { useAuth } from '../contexts/AuthContext';
import { useNavigationManager } from '../hooks/use-navigation-manager';
import React, { JSX, Suspense } from 'react';
import { ActivityIndicator, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../styles/globalStyles';

const LoginPage = React.lazy(() =>
  import('../pages/login').then(m => ({ default: m.LoginPage })),
);
const HomePage = React.lazy(() => import('../pages/home/home'));
const {
  ConferenceRegistrationPage,
  ConferenceRegistrationForm,
  ConferencePaymentDetails,
  ConferenceQRCode,
  ConferenceList,
  ConferenceSessionDetails,
  MyConference,
  MyConferenceSession,
} = {
  ConferenceRegistrationPage: React.lazy(
    () => import('../pages/conference/ConferenceRegistrationPage'),
  ),
  ConferenceRegistrationForm: React.lazy(
    () => import('../pages/conference/ConferenceRegistrationForm'),
  ),
  ConferencePaymentDetails: React.lazy(
    () => import('../pages/conference/ConferencePaymentDetails'),
  ),
  ConferenceQRCode: React.lazy(
    () => import('../pages/conference/ConferenceQRCode'),
  ),
  ConferenceList: React.lazy(
    () => import('../pages/conference/ConferenceList'),
  ),
  ConferenceSessionDetails: React.lazy(
    () => import('../pages/conference/ConferenceSessionDetails'),
  ),
  MyConference: React.lazy(() => import('../pages/conference/MyConference')),
  MyConferenceSession: React.lazy(
    () => import('../pages/conference/MyConferenceSession'),
  ),
};

function AppNavigation() {
  const { loading } = useAuth();
  const {
    currentPage,
    selectedTier,
    selectedSession,
    myConferenceSessions,
    navigate,
    myConference,
    handleLogout,
  } = useNavigationManager();

  if (loading) {
    return (
      <SafeAreaView style={styles.loaderContainer as ViewStyle}>
        <ActivityIndicator size="large" color={colors.primaryLight} />
      </SafeAreaView>
    );
  }

  const pages: Record<string, JSX.Element> = {
    login: (
      <LoginPage onLoginSuccess={navigate.home} onBackToHome={navigate.home} />
    ),
    home: (
      <HomePage
        onNavigateToConference={navigate.conference}
        onLogout={handleLogout}
        onNavigateToLogin={navigate.login}
      />
    ),
    conference: (
      <ConferenceRegistrationPage
        onBack={navigate.home}
        onNavigateToHome={navigate.home}
        onNavigateToForm={navigate.form}
      />
    ),
    conferenceForm: (
      <ConferenceRegistrationForm
        registrationTier={selectedTier}
        onBack={navigate.conference}
        onNavigateToHome={navigate.home}
        onNavigateToPayment={navigate.payment}
      />
    ),
    payment: (
      <ConferencePaymentDetails
        onBack={navigate.form}
        onNavigateToHome={navigate.home}
        onNavigateToQRCode={navigate.qrCode}
      />
    ),
    qrCode: (
      <ConferenceQRCode
        onBack={navigate.payment}
        onNavigateToHome={navigate.home}
        onNavigateToLogin={navigate.login}
      />
    ),
    conferenceList: (
      <ConferenceList
        onBack={navigate.home}
        onNavigateToHome={navigate.home}
        onEventPress={navigate.sessionDetails}
      />
    ),
    sessionDetails: (
      <ConferenceSessionDetails
        onBack={navigate.conferenceList}
        onNavigateToHome={navigate.home}
        sessionData={selectedSession}
        onAddToMyConference={myConference.add}
        onRemoveFromMyConference={myConference.remove}
        isInMyConference={myConferenceSessions.includes(
          selectedSession?.id || '',
        )}
      />
    ),
    myConference: (
      <MyConference
        onBack={navigate.home}
        onNavigateToHome={navigate.home}
        onEventPress={navigate.myConferenceSession}
        myConferenceSessions={myConferenceSessions}
        onRemoveSession={myConference.remove}
      />
    ),
    myConferenceSession: (
      <MyConferenceSession
        onBack={navigate.myConference}
        onNavigateToHome={navigate.home}
        sessionData={selectedSession}
        onRemoveFromConference={() => myConference.remove(selectedSession.id)}
        onLiveQA={() => console.log('Live Q&A')}
        onSessionNotes={() => console.log('Session Notes')}
        onHandouts={() => console.log('Handouts')}
      />
    ),
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.primary }}>
      <Suspense
        fallback={
          <ActivityIndicator
            size="large"
            color={colors.primaryLight}
            style={{ flex: 1 }}
          />
        }
      >
        {pages[currentPage] || <HomePage />}
      </Suspense>
    </SafeAreaView>
  );
}

export default AppNavigation;

const styles = {
  loaderContainer: {
    flex: 1,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
};
