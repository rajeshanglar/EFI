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
  | 'membershipForm'
  | 'membershipPaymentDetails'
  | 'membershipExclusiveAccess'
  | 'board'
  | 'profile'
  | 'changePassword'
  | 'myPayments'
  | 'myPaymentsDetails'
  | 'myCards'
  | 'conferenceDetails'
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
  const [selectedTier, setSelectedTier] = useState<
    'Regular' | 'Late Registration' | 'On Spot'
  >('Regular');
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
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
    conferenceForm: (tier?: 'Regular' | 'Late Registration' | 'On Spot') => {
      setSelectedTier(tier || 'Regular');
      setCurrentPage('conferenceForm');
    },
    conferencePayment: () => setCurrentPage('conferencePayment'),
    conferenceQrCode: () => setCurrentPage('conferenceQrCode'),
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
    board: () => setCurrentPage('board'),
    profile: () => setCurrentPage('profile'),
    changePassword: () => setCurrentPage('changePassword'),
    myPayments: () => setCurrentPage('myPayments'),
    myPaymentsDetails: (paymentData?: any) => {
      if (paymentData) setSelectedPayment(paymentData);
      setCurrentPage('myPaymentsDetails');
    },
    myCards: () => setCurrentPage('myCards'),
    conferenceDetails: () => setCurrentPage('conferenceDetails'),
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
    selectedSession,
    selectedPayment,
    myConferenceSessions,
    membershipFormData,
    navigate,
    myConference,
    handleLogout,
  };
}
