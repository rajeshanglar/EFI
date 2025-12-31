import { useAuth } from '../contexts/AuthContext';
import { useNavigationManager } from '../hooks/use-navigation-manager';
import { NavigationProvider } from '../contexts/NavigationContext';
import { MenuProvider } from '../contexts/MenuContext';
import React, { JSX, Suspense, useState, useEffect } from 'react';
import { ActivityIndicator, ViewStyle, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../styles/globalStyles';
import { GetEventMappings } from '../services/staticService';

import NonResidentialPackages from '../pages/conference/NonResidentialPackages';
import ConferenceRegistrationForm  from '../pages/conference/ConferenceRegistrationForm';
import ResidentialPackages from '../pages/conference/ResidentialPackages';
import ConferencePaymentDetails from '../pages/conference/ConferencePaymentDetails';
import ConferenceQRCode from '../pages/conference/ConferenceQRCode';
import ConferenceList from '../pages/conference/ConferenceList';
import ConferenceSessionDetails from '../pages/conference/ConferenceSessionDetails';
import { MyConference, MyConferenceSession, LiveQA, MySessionNotes, MyQuestions, Handouts, MyAbstracts, DigitalPosters, KeynoteSpeakers, KeynoteSpeakersDetails, DelegateList, DelegateListDetails, PrivacySettings } from '../pages/conference/ConferenceAccess';
import TrainingPrograms from '../pages/training-programs/EFITrainingPrograms';
import MembershipRegistrationForm from '../pages/membership/MembershipRegistrationForm';
import MembershipPaymentDetails from '../pages/membership/MembershipPaymentDetails';
import MembershipExclusiveAccess from '../pages/membership/membershipExclusiveAccess/MembershipExclusiveAccess';
import MembershipInfo from '../pages/membership-info/MembershipInfo';
import Board from '../pages/board/Board';
import Profile from '../pages/profile/Profile';
import EditProfilePage from '../pages/profile/EditProfilePage';
import ChangePassword from '../pages/profile/ChangePassword';
import MyPayments from '../pages/payments/MyPayments';
import MyPaymentsDetails from '../pages/payments/MyPaymentsDetails';
import MyCertificates from '../pages/certificates/MyCertificates';
import MyCards from '../pages/cards/MyCards';
import ConferenceDetails from '../pages/conference/ConferenceDetails';
import ProfileConferenceDetails from '../pages/profile/ConferenceDetails';
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
    previousPage,
    selectedTier,
    selectedTicket,
    selectedSession,
    selectedPayment,
    selectedSpeaker,
    selectedDelegate,
    conferencePaymentData,
    conferenceRegistrationId,
    myConferenceSessions,
    membershipFormData,
    navigate,
    myConference,
    handleLogout,
  } = useNavigationManager();

  // Fetch eventId from GetEventMappings API
  const [eventId, setEventId] = useState<number | null>(null);

  useEffect(() => {
    const fetchEventId = async () => {
      try {
        const response = await GetEventMappings();
        if (response?.success && response?.data && response.data.length > 0) {
          const eventData = response.data[0];
          setEventId(eventData.id);
          console.log('Event ID fetched from GetEventMappings:', eventData.id);
        }
      } catch (error) {
        console.error('Error fetching event ID:', error);
      }
    };

    fetchEventId();
  }, []);

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
        onNavigateToSponsorPatient={navigate.sponsorPatient}
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
        onBack={navigate.chooseConferencePackage}
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
    sessionDetails: selectedSession?.id ? (
      <ConferenceSessionDetails
        onBack={navigate.conferenceList}
        onNavigateToHome={navigate.home}
        sessionId={selectedSession.id}
        onAddToMyConference={myConference.add}
        onRemoveFromMyConference={myConference.remove}
        isInMyConference={myConferenceSessions.includes(
          String(selectedSession?.id || ''),
        )}
      />
    ) : (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
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
    myConferenceSession: selectedSession?.id ? (
      <MyConferenceSession
        onBack={navigate.myConference}
        onNavigateToHome={navigate.home}
        sessionId={selectedSession.id}
        onLiveQA={navigate.liveQA}
        onSessionNotes={navigate.sessionNotes}
        onHandouts={navigate.handouts}
      />
    ) : (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    ),
    liveQA: selectedSession?.id ? (
      <LiveQA
        onBack={() =>
          selectedSession
            ? navigate.myConferenceSession(selectedSession)
            : navigate.myConference()
        }
        onNavigateToHome={navigate.home}
        sessionData={selectedSession}
        sessionId={selectedSession.id}
        onMyQuestionsPress={navigate.myQuestions}
      />
    ) : (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    ),
    sessionNotes: selectedSession?.id ? (
      <MySessionNotes
        onBack={() =>
          selectedSession
            ? navigate.myConferenceSession(selectedSession)
            : navigate.myConference()
        }
        onNavigateToHome={navigate.home}
        sessionId={selectedSession.id}
      />
    ) : (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    ),
    myQuestions: (
      <MyQuestions
        onBack={() =>
          selectedSession
            ? navigate.liveQA()
            : navigate.myConference()
        }
        onNavigateToHome={navigate.home}
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
    digitalPosters: (
      <DigitalPosters
        onBack={() =>
          selectedSession
            ? navigate.myConferenceSession(selectedSession)
            : navigate.myConference()
        }
        onNavigateToHome={navigate.home}
        sessionData={selectedSession}
      />
    ),
    myAbstracts: (
      <MyAbstracts
        onBack={() =>
          selectedSession
            ? navigate.myConferenceSession(selectedSession)
            : navigate.myConference()
        }
        onNavigateToHome={navigate.home}
        sessionData={selectedSession}
      />
    ),
    keynoteSpeakers: (
      <KeynoteSpeakers
        onBack={navigate.home}
        onNavigateToHome={navigate.home}
        onSpeakerPress={(speaker) => {
          // Convert speaker data to details format
          const speakerDetails = {
            id: speaker.id,
            name: speaker.name,
            titles: [speaker.affiliation],
            biography: `Biography for ${speaker.name}...`,
            sessionTitle: 'Robotics in Endometriosis',
            sessionSubtitle: 'Simulation to Strategy',
            date: 'Monday, March 06, 2025',
            location: 'Hall 1',
            time: '08.00 am - 12:30pm',
            workshopNumber: 'Workshop 1',
            theme: '"The Robotic Edge: Precision, Depth & Dexterity"',
            overview: 'This hands-on workshop focuses on robotic-assisted surgery for endometriosis.',
            image: speaker.image,
          };
          navigate.keynoteSpeakersDetails(speakerDetails);
        }}
      />
    ),
    keynoteSpeakersDetails: (
      <KeynoteSpeakersDetails
        onBack={navigate.keynoteSpeakers}
        onNavigateToHome={navigate.home}
        speakerData={selectedSpeaker}
      />
    ),
    delegateList: (
      <DelegateList
        onBack={navigate.myConference}
        onNavigateToHome={navigate.home}
        onDelegatePress={(delegate) => {
          // Convert delegate data to details format
          const delegateDetails = {
            id: delegate.id,
            name: delegate.name,
            titles: [delegate.affiliation],
            biography: `Biography for ${delegate.name}...`,
            sessionTitle: 'Robotics in Endometriosis',
            sessionSubtitle: 'Simulation to Strategy',
            date: 'Monday, March 06, 2025',
            location: 'Hall 1',
            time: '08.00 am - 12:30pm',
            workshopNumber: 'Workshop 1',
            theme: '"The Robotic Edge: Precision, Depth & Dexterity"',
            overview: 'This hands-on workshop focuses on robotic-assisted surgery for endometriosis.',
            image: delegate.image,
          };
          navigate.delegateListDetails(delegateDetails);
        }}
      />
    ),
    delegateListDetails: (
      <DelegateListDetails
        onBack={navigate.delegateList}
        onNavigateToHome={navigate.home}
        delegateData={selectedDelegate}
      />
    ),
    privacySettings: (
      <PrivacySettings
        onBack={navigate.home}
        onNavigateToHome={navigate.home}
        onNavigateToEditProfile={() => navigate.editProfile('privacySettings')}
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
        onNavigateToEditProfile={() => navigate.editProfile('profile')}
        onNavigateToChangePassword={navigate.changePassword}
        onNavigateToMyCertificates={navigate.myCertificates}
        onNavigateToConferenceDetails={navigate.profileConferenceDetails}
      />
    ),
    editProfile: (
      <EditProfilePage
        onBack={() => {
          // Navigate back to previous page, or default to profile
          if (previousPage && previousPage !== 'editProfile') {
            navigate.to(previousPage);
          } else {
            navigate.profile();
          }
        }}
        onNavigateToHome={navigate.home}
      />
    ),
    profileConferenceDetails: (
      <ProfileConferenceDetails
        onBack={navigate.profile}
        onNavigateToHome={navigate.home}
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
