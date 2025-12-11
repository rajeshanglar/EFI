import { useAuth } from '../contexts/AuthContext';
import { useNavigationManager } from '../hooks/use-navigation-manager';
import { NavigationProvider } from '../contexts/NavigationContext';
import { MenuProvider } from '../contexts/MenuContext';
import React, { JSX, Suspense } from 'react';
import { ActivityIndicator, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../styles/globalStyles';

import NonResidentialPackages from '../pages/conference/NonResidentialPackages';
import ConferenceRegistrationForm  from '../pages/conference/ConferenceRegistrationForm';
import ResidentialPackages from '../pages/conference/ResidentialPackages';
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
import ChangePassword from '../pages/profile/ChangePassword';
import MyPayments from '../pages/payments/MyPayments';
import MyPaymentsDetails from '../pages/payments/MyPaymentsDetails';
import MyCertificates from '../pages/certificates/MyCertificates';
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
import SponsorPatient from '../pages/sponsor-patient/SponsorPatient';

const LoginPage = React.lazy(() =>
  import('../pages/login').then(m => ({ default: m.LoginPage })),
);
const HomePage = React.lazy(() => import('../pages/home/home'));
const {
  ChooseConferencePackage,
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
  ChooseConferencePackage: React.lazy(
    () => import('../pages/conference/ChooseConferencePackage'),
  ),
};

function AppNavigation() {
  const { loading } = useAuth();
  const {
    currentPage,
    selectedTier,
    selectedTicket,
    selectedSession,
    selectedPayment,
    conferencePaymentData,
    conferenceRegistrationId,
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
        onNavigateToConference={navigate.chooseConferencePackage}
        onNavigateToConferenceList={navigate.conferenceList}
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
    chooseConferencePackage: (
      <ChooseConferencePackage
        onBack={navigate.home}
        onNavigateToHome={navigate.home}
        onNavigateToNonResidential={navigate.conference}
        onNavigateToResidential={navigate.residentialPackages}
      />
    ),
    residentialPackages: (
      <ResidentialPackages
        onBack={navigate.chooseConferencePackage}
        onNavigateToHome={navigate.home}
        onPackageSelect={(packageTitle, option, module_name, categoryId, event_id, module_id) => {
          console.log('Package selected:', packageTitle, option);
          // Navigate to conference form with selected package
          navigate.conferenceForm(packageTitle, option.ticket, module_name, 1, 'member', event_id, module_id, categoryId);
        }}
        onMemberClick={() => {
          console.log('Member click');
          // Navigate to member login or member registration
          navigate.login();
        }}  
      />
    ),
    conference: (
      <NonResidentialPackages
        onBack={navigate.chooseConferencePackage}
        onNavigateToHome={navigate.home}
        onNavigateToForm={navigate.conferenceForm}
        onMemberClick={() => {
          console.log('Member click');
          // Navigate to member login or member registration
          navigate.login();
        }}
      />
    ),
    conferenceForm: (
      <ConferenceRegistrationForm
        registrationTier={selectedTier}
        selectedTicket={selectedTicket}
        onBack={() => {
          // Navigate back based on is_residential value
          if (selectedTicket?.is_residential === 1) {
            navigate.residentialPackages();
          } else {
            navigate.conference();
          }
        }}
        onNavigateToHome={navigate.home}
        onNavigateToConferencePayment={(formData, paymentDetails) => {
          navigate.conferencePayment(paymentDetails);
        }}
      />
    ),
    conferencePayment: (
      <ConferencePaymentDetails
        onBack={navigate.home}
        onNavigateToHome={navigate.home}
        onNavigateToQRCode={navigate.conferenceQrCode}
        ticketInfo={conferencePaymentData?.ticketInfo}
        userData={conferencePaymentData?.userData}
        paymentData={conferencePaymentData?.paymentData}
        registrationPayload={conferencePaymentData?.registrationPayload}
      />
    ),
    conferenceQrCode: (
      <ConferenceQRCode
        onBack={navigate.conferencePayment}
        onNavigateToHome={navigate.home}
        onNavigateToLogin={navigate.login}
        registrationId={conferenceRegistrationId || undefined}
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
        onNavigateToChangePassword={navigate.changePassword}
        onNavigateToMyCertificates={navigate.myCertificates}
      />
    ),
    changePassword: (
      <ChangePassword
        onBack={navigate.profile}
        onNavigateToHome={navigate.home}
        onNavigateToLogin={navigate.login}
      />
    ),
    myPayments: (
      <MyPayments
        onBack={navigate.profile}
        onNavigateToHome={navigate.home}
        onNavigateToPaymentDetails={navigate.myPaymentsDetails}
      />
    ),
    myPaymentsDetails: (
      <MyPaymentsDetails
        onBack={navigate.myPayments}
        onNavigateToHome={navigate.home}
        paymentData={selectedPayment}
      />
    ),
    myCertificates: (
      <MyCertificates
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
    sponsorPatient: (
      <SponsorPatient
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
