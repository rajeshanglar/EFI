import React from 'react';
import SlideOutMenu from './SlideOutMenu';
import { useMenu } from '../contexts/MenuContext';
import { useNavigationContext } from '../contexts/NavigationContext';
import { useAuth } from '../contexts/AuthContext';

/**
 * SharedMenu Component
 * 
 * Central menu component used by both Header and Home page.
 * Handles all menu navigation through NavigationContext.
 * 
 * All menu item navigation is handled here - no need for custom handlers
 * in individual pages/components.
 */
interface SharedMenuProps {
  onLogout?: () => void;
  onLoginPress?: () => void;
  onProfilePress?: () => void;
  onMenuItemPress?: (id: string) => void; // Optional: for additional side effects only
}

export const SharedMenu: React.FC<SharedMenuProps> = ({
  onLogout,
  onLoginPress,
  onProfilePress,
  onMenuItemPress,
}) => {
  const { isMenuVisible, closeMenu } = useMenu();
  const { navigate } = useNavigationContext();
  const { isAuthenticated, logout: authLogout } = useAuth();

  // Handle profile press - always navigate to profile page
  const handleProfilePress = () => {
    closeMenu();
    
    // Call custom handler if provided (for side effects)
    if (onProfilePress) {
      onProfilePress();
    }
    
    // Always navigate to profile page
    navigate.profile();
  };

  // Handle login press - navigate to login page (only if not logged in)
  const handleLoginPress = () => {
    closeMenu();
    
    // Call custom handler if provided (for side effects)
    if (onLoginPress) {
      onLoginPress();
    }
    
    // Navigate to login page only if not authenticated
    if (!isAuthenticated) {
      navigate.login();
    }
  };

  // Handle logout
  const handleLogout = async () => {
    closeMenu();
    
    try {
      // Call custom logout handler if provided
      if (onLogout) {
        onLogout();
      }
      
      // Call auth service logout
      await authLogout();
      
      // Navigate to home after logout
      navigate.home();
      
      console.log('=== LOGOUT SUCCESSFUL ===');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleMenuItemPress = (id: string) => {
    closeMenu();
    
    // Call custom handler if provided (for side effects)
    if (onMenuItemPress) {
      onMenuItemPress(id);
    }

    // ✅ Always handle navigation (works even if custom handler doesn't handle the item)
    // This ensures all menu items navigate properly
    try {
      switch (id) {
      case 'home':
        navigate.home();
        break;
      case 'about':
        navigate.aboutUs();
        break;
      case 'training':
        navigate.trainingPrograms();
        break;
      case 'membership':
      case 'membershipInfo':
        navigate.membershipInfo();
        break;
      case 'membershipForm':
        navigate.membershipForm();
        break;
      case 'contact':
        navigate.contactUs();
        break;
      case 'board':
        navigate.board();
        break;
      case 'profile':
        navigate.profile();
        break;
      case 'information':
        navigate.information();
        break;
      case 'outreach':
        navigate.outreachPrograms();
        break;
      case 'surgery':
        navigate.freeSurgeryProgram();
        break;
        case 'sponsorPatient':
        navigate.sponsorPatient();
        break;
      case 'congress':
        navigate.endoCongress();
        break;
      case 'run':
        navigate.yellowRibbonRun();
        break;
      case 'conference':
        navigate.conference();
        break;
      case 'conferenceList':
        navigate.conferenceList();
        break;
      case 'myConference':
        navigate.myConference();
        break;
      case 'myPayments':
        navigate.myPayments();
        break;
      case 'myCards':
        navigate.myCards();
        break;
      case 'conferenceDetails':
        navigate.conferenceDetails();
        break;
      case 'submitAbstract':
        navigate.submitAbstract();
        break;
      case 'donations':
        navigate.donationsAndFundraising();
        break;
      case 'privacy':
      case 'posters':
      case 'speakers':
      case 'delegates':
      case 'abstracts':
        // Conference access items - handled by custom handler if needed
        break;
      default:
        console.log('Menu pressed:', id);
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  return (
    <SlideOutMenu
      isVisible={isMenuVisible}
      onClose={closeMenu}
      onMenuItemPress={handleMenuItemPress}
      onLogout={handleLogout}
      onLoginPress={handleLoginPress}
      onProfilePress={handleProfilePress}
      isAuthenticated={isAuthenticated}
    />
  );
};

