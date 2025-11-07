import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export type PageType =
  | 'login'
  | 'home'
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
  | 'myPayments'
  | 'myCards'
  | 'conferenceDetails'
  | 'conferenceVenue'
  | 'outreachPrograms'
  | 'aboutUs';

export function useNavigationManager() {
  const { isAuthenticated, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [selectedTier, setSelectedTier] = useState<
    'Early Bird' | 'Regular' | 'On Spot'
  >('Early Bird');
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [myConferenceSessions, setMyConferenceSessions] = useState<string[]>(
    [],
  );

  useEffect(() => {
    if (!isAuthenticated) setCurrentPage('board');
  }, [isAuthenticated]);

  const navigate = {
    to: setCurrentPage,
    home: () => setCurrentPage('home'),
    login: () => setCurrentPage('login'),
    conference: () => setCurrentPage('conference'),
    conferenceForm: (tier?: 'Early Bird' | 'Regular' | 'On Spot') => {
      setSelectedTier(tier || 'Early Bird');
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
    membershipPaymentDetails: () => setCurrentPage('membershipPaymentDetails'),
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
    myPayments: () => setCurrentPage('myPayments'),
    myCards: () => setCurrentPage('myCards'),
    conferenceDetails: () => setCurrentPage('conferenceDetails'),
    conferenceVenue: () => setCurrentPage('conferenceVenue'),
    outreachPrograms: () => setCurrentPage('outreachPrograms'),
    aboutUs: () => setCurrentPage('aboutUs'),
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
    myConferenceSessions,
    navigate,
    myConference,
    handleLogout,
  };
}
