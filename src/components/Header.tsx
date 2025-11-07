import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import globalStyles from '../styles/globalStyles';
import { BackArrowIcon, HomeHeaderIcon } from './icons';

interface HeaderProps {
  title: string;
  onBack?: () => void;
  onNavigateToHome?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  title, 
  onBack,
  onNavigateToHome
}) => {
  return (
    <View style={globalStyles.headerContainer}>
      <View style={globalStyles.header}>
        <View style={globalStyles.headerBackBtTittle}>
          {onBack && (
            <TouchableOpacity onPress={onBack} style={globalStyles.headerIcon}>
              <BackArrowIcon size={20} />
            </TouchableOpacity>
          )}
          <Text style={globalStyles.headerTitle}>{title}</Text>
        </View>
        {onNavigateToHome && (
          <TouchableOpacity onPress={onNavigateToHome} style={globalStyles.headerIcon}>
            <HomeHeaderIcon size={20} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Header;

