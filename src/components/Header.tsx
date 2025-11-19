import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import globalStyles from '../styles/globalStyles';
import { BackArrowIcon, HomeHeaderIcon, MenuIcon } from './icons';
import { SharedMenu } from './SharedMenu';
import { useNavigationContext } from '../contexts/NavigationContext';
import { useMenu } from '../contexts/MenuContext';
import { Screen } from 'react-native-screens';
const { width: ScreenWidth, height: ScreenHeight } = Dimensions.get('window');

interface HeaderProps {
  title: string;
  onBack?: () => void;
  onNavigateToHome?: () => void;
  onLogout?: () => void;
  onLoginPress?: () => void;
  onProfilePress?: () => void;
  onMenuItemPress?: (id: string) => void; // Deprecated: SharedMenu handles all navigation
}

const Header: React.FC<HeaderProps> = ({
  title,
  onBack,
  onNavigateToHome,
  onLogout,
  onLoginPress,
  onProfilePress,
  onMenuItemPress, // Deprecated: kept for backward compatibility
}) => {
  const { navigate } = useNavigationContext();
  const { openMenu } = useMenu();

  // ✅ Safe navigation hook
  let navigation: any = null;
  try {
    navigation = useNavigation();
  } catch {
    navigation = null; // fallback if outside NavigationContainer
  }

  // ✅ Fallback navigation if prop not passed
  const goHome = () => {
    if (onNavigateToHome) {
      onNavigateToHome();
    } else {
      navigate.home();
    }
  };

  const goBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation?.canGoBack()) {
      navigation.goBack();
    } else {
      console.log('Back navigation not available');
    }
  };


  return (
    <>
      <View style={globalStyles.headerContainer}>
        <View style={globalStyles.header}>
          <View style={globalStyles.headerBackBtTittle}>
            <TouchableOpacity onPress={goBack} style={globalStyles.headerIcon}>
              <BackArrowIcon size={ScreenWidth * 0.05} />
               <Text style={globalStyles.headerTitle}>{title}</Text>
            </TouchableOpacity>           
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
            <TouchableOpacity onPress={goHome} style={globalStyles.headerIcon}>
              <HomeHeaderIcon size={ScreenWidth * 0.052} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={openMenu}
              style={globalStyles.headerIcon}
            >
              <MenuIcon size={ScreenWidth * 0.064} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* ✅ Shared Menu Component - handles all menu navigation */}
      <SharedMenu
        onMenuItemPress={onMenuItemPress} // Pass through for backward compatibility
        onLogout={onLogout}
        onLoginPress={onLoginPress}
        onProfilePress={onProfilePress}
      />
    </>
  );
};

export default Header;
