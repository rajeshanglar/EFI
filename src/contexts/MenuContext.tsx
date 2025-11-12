import React, { createContext, useContext, useState, ReactNode } from 'react';

interface MenuContextType {
  isMenuVisible: boolean;
  openMenu: () => void;
  closeMenu: () => void;
  toggleMenu: () => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};

interface MenuProviderProps {
  children: ReactNode;
}

export const MenuProvider: React.FC<MenuProviderProps> = ({ children }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const openMenu = () => setIsMenuVisible(true);
  const closeMenu = () => setIsMenuVisible(false);
  const toggleMenu = () => setIsMenuVisible(prev => !prev);

  return (
    <MenuContext.Provider value={{ isMenuVisible, openMenu, closeMenu, toggleMenu }}>
      {children}
    </MenuContext.Provider>
  );
};

