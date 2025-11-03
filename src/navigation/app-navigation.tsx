import { useAuth } from '../contexts/AuthContext';
import { useNavigationManager } from '../hooks/use-navigation-manager';
import React, { JSX, Suspense } from 'react';
import { ActivityIndicator, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../styles/globalStyles';

import ConferenceRegistrationPage  from '../pages/conference/ConferenceRegistrationPage';
import ConferenceRegistrationForm  from '../pages/conference/ConferenceRegistrationForm';
import ConferencePaymentDetails from '../pages/conference/ConferencePaymentDetails';
import ConferenceQRCode from '../pages/conference/ConferenceQRCode';
import ConferenceList from '../pages/conference/ConferenceList';
import ConferenceSessionDetails from '../pages/conference/ConferenceSessionDetails';
import MyConference from '../pages/conference/MyConference';
import MyConferenceSession from '../pages/conference/MyConferenceSession';
import LiveQA from '../pages/conference/LiveQA';
import MySessionNotes from '../pages/conference/MySessionNotes';
import Handouts from '../pages/conference/Handouts';
import TrainingPrograms from '../pages/training-programs/EFITrainingPrograms';
import MembershipRegistrationForm from '../pages/membership/MembershipRegistrationForm';
import MembershipPaymentDetails from '../pages/membership/MembershipPaymentDetails';
import MembershipExclusiveAccess from '../pages/membership/membershipExclusiveAccess/MembershipExclusiveAccess';

const LoginPage = React.lazy(() =>
  import('../pages/login').then(m => ({ default: m.LoginPage })),
);
const HomePage = React.lazy(() => import('../pages/home/home'));
const {
  // ConferenceRegistrationPage,
  // ConferenceRegistrationForm,
  // ConferencePaymentDetails,
  // ConferenceQRCode,
  // ConferenceList,
  // ConferenceSessionDetails,
  // MyConference,
  // MyConferenceSession,
  // LiveQA,
  // MySessionNotes,
  // Handouts,
  // TrainingPrograms,
  // MembershipRegistrationForm,
  // MembershipPaymentDetails,
  // MembershipExclusiveAccess,
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
  LiveQA: React.lazy(() => import('../pages/conference/LiveQA')),
  MySessionNotes: React.lazy(
    () => import('../pages/conference/MySessionNotes'),
  ),
  Handouts: React.lazy(() => import('../pages/conference/Handouts')),
  TrainingPrograms: React.lazy(
    () => import('../pages/training-programs/EFITrainingPrograms'),
  ),
  MembershipRegistrationForm: React.lazy(
    () => import('../pages/membership/MembershipRegistrationForm'),
  ),
  MembershipPaymentDetails: React.lazy(
    () => import('../pages/membership/MembershipPaymentDetails'),
  ),
  MembershipExclusiveAccess: React.lazy(
    () => import('../pages/membership/membershipExclusiveAccess/MembershipExclusiveAccess'),
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
        onNavigateToMyConference={navigate.myConference}
        onNavigateToTrainingPrograms={navigate.trainingPrograms}
        onNavigateToMembership={navigate.membershipForm}
      />
    ),
    conference: (
      <ConferenceRegistrationPage
        onBack={navigate.home}
        onNavigateToHome={navigate.home}
        onNavigateToForm={navigate.conferenceForm}
      />
    ),
    conferenceForm: (
      <ConferenceRegistrationForm
        registrationTier={selectedTier}
        onBack={navigate.conference}
        onNavigateToHome={navigate.home}
        onNavigateToConferencePayment={navigate.conferencePayment}
      />
    ),
    conferencePayment: (
      <ConferencePaymentDetails
        onBack={navigate.home}
        onNavigateToHome={navigate.home}
        onNavigateToQRCode={navigate.conferenceQrCode}
      />
    ),
    conferenceQrCode: (
      <ConferenceQRCode
        onBack={navigate.conferencePayment}
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
        onRemoveFromConference={() =>
          selectedSession ? myConference.remove(selectedSession.id) : undefined
        }
        onLiveQA={navigate.liveQA}
        onSessionNotes={navigate.sessionNotes}
        onHandouts={navigate.handouts}
      />
    ),
    liveQA: (
      <LiveQA
        onBack={() =>
          selectedSession
            ? navigate.myConferenceSession(selectedSession)
            : navigate.myConference()
        }
        onNavigateToHome={navigate.home}
        sessionData={selectedSession}
      />
    ),
    sessionNotes: (
      <MySessionNotes
        onBack={() =>
          selectedSession
            ? navigate.myConferenceSession(selectedSession)
            : navigate.myConference()
        }
        onNavigateToHome={navigate.home}
        sessionData={selectedSession}
      />
    ),
    handouts: (
      <Handouts
        onBack={() =>
          selectedSession
            ? navigate.myConferenceSession(selectedSession)
            : navigate.myConference()
        }
        onNavigateToHome={navigate.home}
        sessionData={selectedSession}
      />
    ),

    trainingPrograms: (
      <TrainingPrograms
        onBack={navigate.home}
        onNavigateToHome={navigate.home}
      />
    ),
    membershipForm: (
      <MembershipRegistrationForm    
       onBack={navigate.home}
        onNavigateToHome={navigate.home}     
        onNavigateToMembershipPayment={navigate.membershipPaymentDetails}
        />
    ),

    membershipPaymentDetails: (
      <MembershipPaymentDetails
        onBack={navigate.membershipForm}
        onNavigateToHome={navigate.home}
        onNavigateToLogin={navigate.login}
      />
    ),
    membershipExclusiveAccess: (
      <MembershipExclusiveAccess
      
        onBack={navigate.home}
        onNavigateToHome={navigate.home}
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
