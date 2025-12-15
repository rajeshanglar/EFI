import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { colors, spacing, borderRadius } from '../styles/globalStyles';
import { Fonts } from '../styles/globalStyles';

interface LanguageSelectorProps {
  onLanguageChange?: (language: 'en' | 'hi') => void;
  initialLanguage?: 'en' | 'hi';
}

const { width: screenWidth } = Dimensions.get('window');

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  onLanguageChange, 
  initialLanguage = 'en' 
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hi'>(initialLanguage);
  const slideAnimation = useRef(new Animated.Value(selectedLanguage === 'en' ? 0 : 1)).current;

  const handleLanguageChange = (language: 'en' | 'hi') => {
    if (language === selectedLanguage) return;

    setSelectedLanguage(language);
    onLanguageChange?.(language);

    // Animate the slide
    Animated.timing(slideAnimation, {
      toValue: language === 'en' ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const slideTranslateX = slideAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, Dimensions.get('window').width * 0.094], // Half the width of the selector
  });

  return (
    <View style={styles.container}>
      {/* Background container */}
      <View style={styles.backgroundContainer}>
        {/* Sliding indicator */}
        <Animated.View 
          style={[
            styles.slidingIndicator,
            {
              transform: [{ translateX: slideTranslateX }],
            },
          ]}
        />
        
        {/* Language options */}
        <TouchableOpacity
          style={styles.languageOption}
          onPress={() => handleLanguageChange('en')}
        >
          <Text style={[
            styles.languageText,
            selectedLanguage === 'en' ? styles.activeText : styles.inactiveText
          ]}>
            EN
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.languageOption}
          onPress={() => handleLanguageChange('hi')}
        >
          <Text style={[
            styles.languageText,
            selectedLanguage === 'hi' ? styles.activeText : styles.inactiveText
          ]}>
            हिं
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.lightGray,
    padding:0,
    position: 'relative',
    width:Dimensions.get('window').width * 0.20,
    height:Dimensions.get('window').height * 0.035,
  },
  slidingIndicator: {
    position: 'absolute',
    top:1,
    left: 0,
    right: 0,
    width: Dimensions.get('window').width * 0.10, // Half width minus padding
    height:Dimensions.get('window').height * 0.030, // Height minus padding
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    zIndex: 1,
    
  },
  languageOption: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    height: 32,    
  },
  languageText: {
    fontSize:Dimensions.get('window').width * 0.033,
   fontFamily:Fonts.SemiBold,
    textAlign: 'center', 
    paddingHorizontal:10,
    width: Dimensions.get('window').width * 0.12,
    lineHeight: Dimensions.get('window').height * 0.03,
  },
  activeText: {
    color: colors.accent,
  },
  inactiveText: {
    color: colors.primary,
  },
});

export default LanguageSelector;
