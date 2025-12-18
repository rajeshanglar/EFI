import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

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
      const workshopFromTitle = eventData.title.match(/Workshop\s*\d+/)?.[0];
      const workshopFromType =
        typeof eventData.eventType === 'string' &&
        eventData.eventType.includes('Workshop')
          ? eventData.eventType
          : undefined;

      const sessionData = {
        id: eventData.id,
        date: eventData.parsedDate || eventData.date,
        time: eventData.timeRange,
        location: eventData.hall || 'Main Hall',
        workshopNumber: workshopFromType || workshopFromTitle,
        title: eventData.title.includes(':')
          ? eventData.title.split(':')[1].trim()
          : eventData.title,
        subtitle: eventData.eventType || 'Simulation to Strategy',
        theme: 'The Robotic Edge: Precision, Depth & Dexterity',
        overview:
          'Hands-on robotic-assisted surgery workshop by top experts.',
      };
      setSelectedSession(sessionData);
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
      const sessionData = {
        ...eventData,
        id: eventData.id,
        date: eventData.parsedDate || eventData.date,
        time: eventData.timeRange,
        location: eventData.hall || 'Main Hall',
        workshopNumber: eventData.eventType,
        subtitle: eventData.eventType || 'Simulation to Strategy',
        theme: 'The Robotic Edge: Precision, Depth & Dexterity',
        overview:
          'Hands-on robotic-assisted surgery workshop by top experts.',
      };
      setSelectedSession(sessionData);
      setCurrentPage('myConferenceSession');
    },
    liveQA: () => setCurrentPage('liveQA'),
    sessionNotes: () => setCurrentPage('sessionNotes'),
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
    profile: () => setCurrentPage('profile'),
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
