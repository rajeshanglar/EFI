import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { setAuthErrorHandler } from '../utils/authErrorHandler';

export type PageType =
  | 'login'
  | 'home'
  | 'chooseConferencePackage'
  | 'residentialPackages'
  | 'conference'
  | 'conferenceForm'
  | 'conferencePayment'
  | 'conferenceQrCode'
  | 'conferenceList'
  | 'sessionDetails'
  | 'myConference'
  | 'myConferenceSession'
  | 'trainingPrograms'
  | 'liveQA'
  | 'myQuestions'
  | 'sessionNotes'
  | 'handouts'
  | 'digitalPosters'
  | 'myAbstracts'
  | 'keynoteSpeakers'
  | 'keynoteSpeakersDetails'
  | 'delegateList'
  | 'delegateListDetails'
  | 'privacySettings'
  | 'membershipForm'
  | 'membershipPaymentDetails'
  | 'membershipExclusiveAccess'
  | 'board'
  | 'profile'
  | 'editProfile'
  | 'changePassword'
  | 'myPayments'
  | 'myPaymentsDetails'
  | 'myCertificates'
  | 'myCards'
  | 'conferenceDetails'
  | 'profileConferenceDetails'
  | 'conferenceVenue'
  | 'outreachPrograms'
  | 'yellowRibbonRun'
  | 'aboutUs'
  | 'endoCongress'
  | 'freeSurgeryProgram'
  | 'membershipInfo'
  | 'contactUs'
  | 'information'
  | 'submitAbstract'
  | 'donationsAndFundraising'
  | 'sponsorPatient';

export function useNavigationManager() {
  const { isAuthenticated, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [previousPage, setPreviousPage] = useState<PageType | null>(null);
  const [selectedTier, setSelectedTier] = useState<string>('');
  const [selectedTicket, setSelectedTicket] = useState<{
    module_name?: string;
    categoryName?: string;
    ticket?: any;
    is_residential?: number;
    membershipType?: string;
    event_id?: number;
    module_id?: number;
    category_id?: number;
  } | null>(null);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [selectedSpeaker, setSelectedSpeaker] = useState<any>(null);
  const [selectedDelegate, setSelectedDelegate] = useState<any>(null);
  const [conferencePaymentData, setConferencePaymentData] = useState<{
    ticketInfo?: {
      module_name?: string;
      categoryName?: string;
      ticketName?: string;
      membershipType?: string;
    };
    userData?: {
      full_name?: string;
      email?: string;
      mobile?: string;
    };
    paymentData?: {
      sub_total?: number;
      grand_total?: number;
      currency?: string;
    };
    registrationPayload?: any;
    registrationId?: number;
  } | null>(null);
  const [conferenceRegistrationId, setConferenceRegistrationId] = useState<number | null>(null);
  const [myConferenceSessions, setMyConferenceSessions] = useState<string[]>(
    [],
  );
  const [membershipFormData, setMembershipFormData] = useState<{
    formData?: any;
    userData?: {
      name?: string;
      email?: string;
      phone?: string;
      country?: string;
    };
    paymentData?: {
      subTotal?: number;
      coupon?: number;
      grandTotal?: number;
    };
  } | null>(null);

  useEffect(() => {
    if (!isAuthenticated) setCurrentPage('home');
  }, [isAuthenticated]);

  // Set up auth error handler for API interceptor
  useEffect(() => {
    const handleAuthError = async (shouldRedirectToLogin: boolean) => {
      console.log('=== AUTH ERROR HANDLER ===');
      console.log('Should redirect to login:', shouldRedirectToLogin);
      console.log('Is authenticated (before logout):', isAuthenticated);
      
      try {
        // Logout user if they were logged in (tokens are already cleared by interceptor)
        if (isAuthenticated) {
          await logout();
          console.log('=== LOGGED OUT USER ===');
        }
        
        // Redirect based on the flag passed from API interceptor
        // shouldRedirectToLogin is true when: user was logged in AND token expired
        if (shouldRedirectToLogin) {
          // User was logged in and token expired - redirect to login
          console.log('=== REDIRECTING TO LOGIN (TOKEN EXPIRED) ===');
          setCurrentPage('login');
        } else {
          // User was not logged in - redirect to dashboard/home
          console.log('=== REDIRECTING TO HOME (NOT LOGGED IN) ===');
          setCurrentPage('home');
        }
      } catch (error) {
        console.error('Error in auth error handler:', error);
        // Fallback: redirect based on shouldRedirectToLogin flag
        if (shouldRedirectToLogin) {
          setCurrentPage('login');
        } else {
          setCurrentPage('home');
        }
      }
    };

    // Register the handler
    setAuthErrorHandler(handleAuthError);

    // Cleanup on unmount
    return () => {
      setAuthErrorHandler(() => {});
    };
  }, [logout, isAuthenticated]);

  const navigate = {
    to: setCurrentPage,
    home: () => setCurrentPage('home'),
    login: () => setCurrentPage('login'),
    chooseConferencePackage: () => setCurrentPage('chooseConferencePackage'),
    residentialPackages: () => setCurrentPage('residentialPackages'),
    conference: () => setCurrentPage('conference'),
    conferenceForm: (categoryName?: string, ticket?: any, module_name?: string, is_residential?: number, membershipType?: string, event_id?: number, module_id?: number, category_id?: number) => {
      // Accept dynamic category name - fully dynamic, no hardcoded values
      setSelectedTier(categoryName || '');
      setSelectedTicket({
        module_name,
        categoryName,
        ticket,
        is_residential,
        membershipType,
        event_id,
        module_id,
        category_id,
      });
      setCurrentPage('conferenceForm');
    },
    conferencePayment: (data?: {
      ticketInfo?: {
        module_name?: string;
        categoryName?: string;
        ticketName?: string;
        membershipType?: string;
      };
      userData?: {
        full_name?: string;
        email?: string;
        mobile?: string;
      };
      paymentData?: {
        sub_total?: number;
        grand_total?: number;
        currency?: string;
      };
      registrationPayload?: any;
    }) => {
      if (data) {
        setConferencePaymentData(data);
      }
      setCurrentPage('conferencePayment');
    },
    conferenceQrCode: (registrationId?: number) => {
      if (registrationId) {
        setConferenceRegistrationId(registrationId);
      }
      setCurrentPage('conferenceQrCode');
    },
    conferenceList: () => setCurrentPage('conferenceList'),
    sessionDetails: (eventData: any) => {
      // Store session ID to fetch details via API
      const sessionId = eventData.id;
      setSelectedSession({ id: sessionId });
      setCurrentPage('sessionDetails');
    },
    myConference: () => setCurrentPage('myConference'),
    trainingPrograms: () => setCurrentPage('trainingPrograms'),
    membershipForm: () => setCurrentPage('membershipForm'),
    membershipPaymentDetails: (data?: {
      userData?: {
        name?: string;
        email?: string;
        phone?: string;
        country?: string;
      };
      paymentData?: {
        subTotal?: number;
        coupon?: number;
        grandTotal?: number;
      };
    }) => {
      if (data) {
        setMembershipFormData(data);
      }
      setCurrentPage('membershipPaymentDetails');
    },
    membershipExclusiveAccess: () => setCurrentPage('membershipExclusiveAccess'),
    myConferenceSession: (eventData: any) => {
      // Store just the session ID, component will fetch full details via API
      setSelectedSession({ id: eventData.id });
      setCurrentPage('myConferenceSession');
    },
    liveQA: () => setCurrentPage('liveQA'),
    sessionNotes: () => setCurrentPage('sessionNotes'),
    myQuestions: (sessionId?: number | string) => {
      if (sessionId) setSelectedSession({ id: sessionId });
      setCurrentPage('myQuestions');
    },
    handouts: () => setCurrentPage('handouts'),
    digitalPosters: () => setCurrentPage('digitalPosters'),
    myAbstracts: () => setCurrentPage('myAbstracts'),
    keynoteSpeakers: () => setCurrentPage('keynoteSpeakers'),
    keynoteSpeakersDetails: (speakerData?: any) => {
      if (speakerData) setSelectedSpeaker(speakerData);
      setCurrentPage('keynoteSpeakersDetails');
    },
    delegateList: () => setCurrentPage('delegateList'),
    delegateListDetails: (delegateData?: any) => {
      if (delegateData) setSelectedDelegate(delegateData);
      setCurrentPage('delegateListDetails');
    },
    privacySettings: () => setCurrentPage('privacySettings'),
    board: () => setCurrentPage('board'),
    profile: () => {
      setPreviousPage(currentPage);
      setCurrentPage('profile');
    },
    editProfile: (backPage?: PageType) => {
      // Store the current page as previous page, or use provided backPage
      if (backPage) {
        setPreviousPage(backPage);
      } else {
        setPreviousPage(currentPage);
      }
      setCurrentPage('editProfile');
    },
    changePassword: () => setCurrentPage('changePassword'),
    myPayments: () => setCurrentPage('myPayments'),
    myPaymentsDetails: (paymentData?: any) => {
      if (paymentData) setSelectedPayment(paymentData);
      setCurrentPage('myPaymentsDetails');
    },
    myCertificates: () => setCurrentPage('myCertificates'),
    myCards: () => setCurrentPage('myCards'),
    conferenceDetails: () => setCurrentPage('conferenceDetails'),
    profileConferenceDetails: () => setCurrentPage('profileConferenceDetails'),
    conferenceVenue: () => setCurrentPage('conferenceVenue'),
    outreachPrograms: () => setCurrentPage('outreachPrograms'),
    yellowRibbonRun: () => setCurrentPage('yellowRibbonRun'),
    aboutUs: () => setCurrentPage('aboutUs'),
    endoCongress: () => setCurrentPage('endoCongress'),
    freeSurgeryProgram: () => setCurrentPage('freeSurgeryProgram'),
    membershipInfo: () => setCurrentPage('membershipInfo'),
    contactUs: () => setCurrentPage('contactUs'),
    information: () => setCurrentPage('information'),
    submitAbstract: () => setCurrentPage('submitAbstract'),
    donationsAndFundraising: () => setCurrentPage('donationsAndFundraising'),
    sponsorPatient: () => setCurrentPage('sponsorPatient'),
  };


  const myConference = {
    add: (id: string) =>
      setMyConferenceSessions(prev => [...new Set([...prev, id])]),
    remove: (id: string) =>
      setMyConferenceSessions(prev => prev.filter(x => x !== id)),
  };

  const handleLogout = async () => {
    await logout();
    setCurrentPage('login');
  };

  return {
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
  };
}
