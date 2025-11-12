import React, { createContext, useContext, ReactNode } from 'react';
import { useNavigationManager } from '../hooks/use-navigation-manager';

interface NavigationContextType {
  navigate: ReturnType<typeof useNavigationManager>['navigate'];
  currentPage: ReturnType<typeof useNavigationManager>['currentPage'];
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useNavigationContext = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    // Return a fallback navigation object if context is not available
    return {
      navigate: {
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
        yellowRibbonRun: () => {},
        endoCongress: () => {},
        freeSurgeryProgram: () => {},
        membershipForm: () => {},
        myPayments: () => {},
        myCards: () => {},
        conferenceDetails: () => {},
        submitAbstract: () => {},
        myConference: () => {},
        conferenceList: () => {},
      },
      currentPage: 'home' as const,
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

