import { useAuth } from '../contexts/AuthContext';
import { useNavigationManager } from '../hooks/use-navigation-manager';
import { NavigationProvider } from '../contexts/NavigationContext';
import { MenuProvider } from '../contexts/MenuContext';
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
import MembershipInfo from '../pages/membership-info/MembershipInfo';
import Board from '../pages/board/Board';
import Profile from '../pages/profile/Profile';
import MyPayments from '../pages/payments/MyPayments';
import MyCards from '../pages/cards/MyCards';
import ConferenceDetails from '../pages/conference/ConferenceDetails';
import ConferenceVenue from '../pages/conference/ConferenceVenue';
import EFIOutreachPrograms from '../pages/outreach-programs/EFIOutreachPrograms';
import AboutUs from '../pages/about-us/AboutUs';
import YellowRibbonRun from '../pages/yellow-ribbon-run/YellowRibbonRun';
import EndoCongress from '../pages/endo-congress/EndoCongress';
import FreeSurgeryProgram from '../pages/free-surgery-program/FreeSurgeryProgram';
import ContactUs from '../pages/contact-us/ContactUs';
import Information from '../pages/information/Information';
import SubmitAbstract from '../pages/conference/SubmitAbstract';
import DonationsAndFundraising from '../pages/donations-fundraising/DonationsAndFundraising';

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
    membershipFormData,
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
        onNavigateToMembershipInfo={navigate.membershipInfo}
        onNavigateToMembershipExclusiveAccess={navigate.membershipExclusiveAccess}
        onNavigateToBoard={navigate.board}
        onNavigateToProfile={navigate.profile}
        onNavigateToMyCards={navigate.myCards}
        onNavigateToConferenceDetails={navigate.conferenceDetails}
        onNavigateToOutreachPrograms={navigate.outreachPrograms}
        onNavigateToYellowRibbonRun={navigate.yellowRibbonRun}
        onNavigateToAboutUs={navigate.aboutUs}
        onNavigateToEndoCongress={navigate.endoCongress}
        onNavigateToFreeSurgeryProgram={navigate.freeSurgeryProgram}
        onNavigateToContactUs={navigate.contactUs}
        onNavigateToInformation={navigate.information}
        onNavigateToSubmitAbstract={navigate.submitAbstract}
        onNavigateToDonationsAndFundraising={navigate.donationsAndFundraising}
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
        formData={membershipFormData?.formData}
        userData={membershipFormData?.userData}
        paymentData={membershipFormData?.paymentData}
      />
    ),
    membershipExclusiveAccess: (
      <MembershipExclusiveAccess
      
        onBack={navigate.home}
        onNavigateToHome={navigate.home}
      />
    ),
    board: (
      <Board
        onBack={navigate.home}
        onNavigateToHome={navigate.home}
      />
    ),
    profile: (
      <Profile
        onBack={navigate.home}
        onNavigateToHome={navigate.home}    
        onNavigateToMyPayments={navigate.myPayments}
      />
    ),
    myPayments: (
      <MyPayments
        onBack={navigate.profile}
        onNavigateToHome={navigate.home}
      />
    ),
    myCards: (
      <MyCards
        onBack={navigate.home}
        onNavigateToHome={navigate.home}
      />
    ),
    conferenceDetails: (
      <ConferenceDetails
        onBack={navigate.home}
        onNavigateToHome={navigate.home}
        onNavigateToVenue={navigate.conferenceVenue}
      />
    ),
    conferenceVenue: (
      <ConferenceVenue
        onBack={navigate.conferenceDetails}
        onNavigateToHome={navigate.home}
      />
    ),
    outreachPrograms: (
      <EFIOutreachPrograms
        onBack={navigate.home}
        onNavigateToHome={navigate.home}
      />
    ),
    yellowRibbonRun: (
      <YellowRibbonRun
        onBack={navigate.home}
        onNavigateToHome={navigate.home}
      />
    ),
    endoCongress: (
      <EndoCongress
        onBack={navigate.home}
        onNavigateToHome={navigate.home}
      />
    ),
    freeSurgeryProgram: (
      <FreeSurgeryProgram
        onBack={navigate.home}
        onNavigateToHome={navigate.home}
      />
    ),
    membershipInfo: (
      <MembershipInfo
        onBack={navigate.home}
        onNavigateToHome={navigate.home}
      />
    ),
    contactUs: (
      <ContactUs
        onBack={navigate.home}
        onNavigateToHome={navigate.home}
      />
    ),
    information: (
      <Information
        onBack={navigate.home}
        onNavigateToHome={navigate.home}
      />
    ),
    submitAbstract: (
      <SubmitAbstract
        onBack={navigate.home}
        onNavigateToHome={navigate.home}
        onSubmitSuccess={() => navigate.home()}
      />
    ),
    donationsAndFundraising: (
      <DonationsAndFundraising
        onBack={navigate.home}
        onNavigateToHome={navigate.home}
      />
    ),
    aboutUs: (
      <AboutUs
        onBack={navigate.home}
        onNavigateToHome={navigate.home}
      />
    ),
  };

  return (
    <NavigationProvider navigate={navigate} currentPage={currentPage}>
      <MenuProvider>
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
      </MenuProvider>
    </NavigationProvider>
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
