import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export type PageType =
  | 'login'
  | 'home'
  | 'conference'
  | 'conferenceForm'
  | 'payment'
  | 'qrCode'
  | 'conferenceList'
  | 'sessionDetails'
  | 'myConference'
  | 'myConferenceSession';

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
    if (!isAuthenticated) setCurrentPage('conferenceList');
  }, [isAuthenticated]);

  const navigate = {
    to: setCurrentPage,
    home: () => setCurrentPage('home'),
    login: () => setCurrentPage('login'),
    conference: () => setCurrentPage('conference'),
    form: (tier?: 'Early Bird' | 'Regular' | 'On Spot') => {
      setSelectedTier(tier || 'Early Bird');
      setCurrentPage('conferenceForm');
    },
    payment: () => setCurrentPage('payment'),
    qrCode: () => setCurrentPage('qrCode'),
    conferenceList: () => setCurrentPage('conferenceList'),
    sessionDetails: (eventData: any) => {
      const sessionData = {
        id: eventData.id,
        date: eventData.parsedDate || eventData.date,
        time: eventData.timeRange,
        location: eventData.hall || 'Main Hall',
        workshopNumber: eventData.title.match(/Workshop \d+/)?.[0],
        title: eventData.title.includes(':')
          ? eventData.title.split(':')[1].trim()
          : eventData.title,
        subtitle: eventData.title.includes('Simulation')
          ? 'Simulation to Strategy'
          : undefined,
        theme: '"The Robotic Edge: Precision, Depth & Dexterity"',
        overview: 'Hands-on robotic-assisted surgery workshop by top experts.',
      };
      setSelectedSession(sessionData);
      setCurrentPage('sessionDetails');
    },
    myConference: () => setCurrentPage('myConference'),
    myConferenceSession: (eventData: any) => {
      const sessionData = {
        ...eventData,
        theme: '"The Robotic Edge: Precision, Depth & Dexterity"',
      };
      setSelectedSession(sessionData);
      setCurrentPage('myConferenceSession');
    },
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
