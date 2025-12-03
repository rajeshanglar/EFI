import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from 'react-native';
import Header from '../../components/Header';
import globalStyles, {
  colors,
  spacing,
  borderRadius,
  Fonts,
} from '../../styles/globalStyles';

const { width: screenWidth } = Dimensions.get('window');

interface ChooseConferencePackageProps {
  onBack: () => void;
  onNavigateToHome: () => void;
  onNavigateToNonResidential?: () => void;
  onNavigateToResidential?: () => void;
}

const ChooseConferencePackage: React.FC<ChooseConferencePackageProps> = ({
  onBack,
  onNavigateToHome,
  onNavigateToNonResidential,
  onNavigateToResidential,
}) => {
  return (
    <View style={styles.container}>
      <Header
        title=""
        onBack={onBack}
        onNavigateToHome={onNavigateToHome}
        onMenuItemPress={(id: string) => console.log('Menu:', id)}
      />

      <View style={styles.containerFullWidth}>
        <ImageBackground
          source={require('../../assets/images/ribbon-color-img.png')}
          style={globalStyles.bgBottomRibbon}
          imageStyle={globalStyles.bgBottomRibbonImage}
        />

        <View style={styles.content}>
          {/* Title */}
          <Text style={styles.title}>Choose Your Conference Package</Text>

          {/* Package Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.packageButton}
              onPress={onNavigateToNonResidential}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Non-Residential Packages</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.packageButton}
              onPress={() => {
                if (onNavigateToResidential) {
                  onNavigateToResidential();
                }
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Residential Packages</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  containerFullWidth: {
    width: '100%',
    flex: 1,
    position: 'relative',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    zIndex: 1,
  },
  title: {
    fontSize: screenWidth * 0.045,
    fontFamily: Fonts.Regular,
    color: colors.white,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  buttonContainer: {
    width: '100%',
    gap: spacing.xl,
  },
  packageButton: {
    backgroundColor: '#FFD700', // Yellow color
    borderRadius:5,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    fontSize: screenWidth * 0.045,
    fontFamily: Fonts.SemiBold,
    color: colors.primary,
    textAlign: 'center',
  },
});

export default ChooseConferencePackage;

