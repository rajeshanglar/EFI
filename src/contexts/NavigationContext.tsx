import React, { createContext, useContext, ReactNode } from 'react';
import { useNavigationManager } from '../hooks/use-navigation-manager';

interface NavigationContextType {
  navigate: ReturnType<typeof useNavigationManager>['navigate'];
  currentPage: ReturnType<typeof useNavigationManager>['currentPage'];
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useNavigationContext = (): NavigationContextType => {
  const context = useContext(NavigationContext);
  if (!context) {
    // Return a fallback navigation object if context is not available
    const fallbackNavigate: ReturnType<typeof useNavigationManager>['navigate'] = {
      home: () => console.log('Navigation not available'),
      to: () => console.log('Navigation not available'),
      login: () => {},
      conference: () => {},
      trainingPrograms: () => {},
      membershipInfo: () => {},
      board: () => {},
      profile: () => {},
      contactUs: () => {},
      aboutUs: () => {},
      information: () => {},
      outreachPrograms: () => {},
      sponsorPatient: () => {},
      yellowRibbonRun: () => {},
      endoCongress: () => {},
      freeSurgeryProgram: () => {},
      membershipForm: () => {},
      myPayments: () => {},
      myCards: () => {},
      conferenceDetails: () => {},
      submitAbstract: () => {},
      donationsAndFundraising: () => {},
      myConference: () => {},
      conferenceList: () => {},
      conferenceForm: () => {},
      conferencePayment: () => {},
      conferenceQrCode: () => {},
      sessionDetails: () => {},
      membershipPaymentDetails: () => {},
      membershipExclusiveAccess: () => {},
      myConferenceSession: () => {},
      liveQA: () => {},
      sessionNotes: () => {},
      handouts: () => {},
      conferenceVenue: () => {},
    } as ReturnType<typeof useNavigationManager>['navigate'];
    
    return {
      navigate: fallbackNavigate,
      currentPage: 'home' as ReturnType<typeof useNavigationManager>['currentPage'],
    };
  }
  return context;
};

interface NavigationProviderProps {
  children: ReactNode;
  navigate: ReturnType<typeof useNavigationManager>['navigate'];
  currentPage: ReturnType<typeof useNavigationManager>['currentPage'];
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ 
  children, 
  navigate, 
  currentPage 
}) => {
  return (
    <NavigationContext.Provider value={{ navigate, currentPage }}>
      {children}
    </NavigationContext.Provider>
  );
};

