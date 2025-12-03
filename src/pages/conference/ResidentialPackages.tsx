import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ImageBackground,
} from 'react-native';
import Header from '../../components/Header';
import ConferenceInformationModal from '../../components/ConferenceInformationModal';
import globalStyles, {
  colors,
  spacing,
  borderRadius,
  Fonts,
} from '../../styles/globalStyles';
import { CardRightArrowIcon, InformationIcon } from '../../components/icons';

const { width: screenWidth } = Dimensions.get('window');

interface PackageOption {
  label: string;
  price: string;
}

interface PackageCard {
  title: string;
  options: PackageOption[];
}

interface ResidentialPackagesProps {
  onBack: () => void;
  onNavigateToHome: () => void;
  onPackageSelect?: (packageTitle: string, option: PackageOption) => void;
  onMemberClick?: () => void;
  onInfoClick?: () => void;
}

const ResidentialPackages: React.FC<ResidentialPackagesProps> = ({
  onBack,
  onNavigateToHome,
  onPackageSelect,
  onMemberClick,
  onInfoClick,
}) => {
  const packages: PackageCard[] = [
    {
      title: 'Only Conference',
      options: [
        { label: '1 Night - Single', price: '₹50,000' },
        { label: '1 Night - Twin', price: '₹40,000' },
      ],
    },
    {
      title: 'Conference + 1 Workshop',
      options: [
        { label: '1 Night - Single', price: '₹50,000' },
        { label: '1 Night - Twin', price: '₹40,000' },
      ],
    },
    {
      title: 'Conference + 2 Workshops',
      options: [
        { label: '1 Night - Single', price: '₹50,000' },
        { label: '1 Night - Twin', price: '₹40,000' },
      ],
    },
  ];
  const [isModalVisible, setIsModalVisible] = useState(false);
  return (
    <View style={styles.container}>
      <Header
        title="Residential Packages"
        onBack={onBack}
        onNavigateToHome={onNavigateToHome}
        onMenuItemPress={(id: string) => console.log('Menu:', id)}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Conference Banner */}
        <ImageBackground
          source={require('../../assets/images/wave-img.png')}
          style={globalStyles.imgBgContainerWave}
          imageStyle={globalStyles.imgBgWave}
        >
            <View style={globalStyles.conferenceTitleSection}>
            <Text style={globalStyles.conferenceMainTitle}>
              3rd Edition of Endometriosis Congress
            </Text>
            <Text style={globalStyles.conferenceDateLocation}>
              6, 7 & 8 MARCH 2026, Park Hyatt, Hyderabad
            </Text>
          </View>
        </ImageBackground>

        {/* Package Cards */}
        <View style={styles.packagesContainer}>
          {packages.map((pkg, index) => (
            <View key={index} style={styles.packageCard}>
              <Text style={styles.packageTitle}>{pkg.title}</Text>
              {pkg.options.map((option, optionIndex) => (
                <View key={optionIndex}>
                  <TouchableOpacity
                    style={styles.optionRow}
                    onPress={() => onPackageSelect?.(pkg.title, option)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.optionLabel}>{option.label}</Text>
                    <View style={styles.priceContainer}>
                      <Text style={styles.optionPrice}>{option.price}</Text>
                      <CardRightArrowIcon
                        size={16}
                        color={colors.primary}
                        style={styles.arrowIcon}
                      />
                    </View>
                  </TouchableOpacity>
                  {optionIndex < pkg.options.length - 1 && (
                    <View style={styles.separator} />
                  )}
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>

            {/* Footer */}
      <View style={globalStyles.footerPrimaryMain}>
        <View style={globalStyles.footerPrimaryLinkContainer}>
          <Text style={globalStyles.footerPrimaryText}>
            Already an EFI Member?
          </Text>
          <TouchableOpacity>
            <Text style={globalStyles.footerPrimaryLinkText}>
              Click Here to Continue
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Floating Info Button */}
      <TouchableOpacity
        style={globalStyles.floatingInfoButton}
        onPress={() => setIsModalVisible(true)}
      >
        <View style={globalStyles.floatingInfoButtonInner}>
          <InformationIcon size={50} />
        </View>
      </TouchableOpacity>

      {/* Information Modal */}
      <ConferenceInformationModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl * 2,
  },
  banner: {
    backgroundColor: colors.primaryLight,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  bannerImage: {
    resizeMode: 'cover',
    opacity: 0.1,
  },
  bannerContent: {
    zIndex: 1,
  },
  bannerTitle: {
    fontSize: screenWidth * 0.045,
    fontFamily: Fonts.Bold,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  bannerDetails: {
    fontSize: screenWidth * 0.035,
    fontFamily: Fonts.Regular,
    color: colors.primary,
    textAlign: 'center',
  },
  packagesContainer: {
    paddingHorizontal: spacing.md,
    gap: spacing.md,
    marginTop: spacing.md,
  },
  packageCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  packageTitle: {
    fontSize: screenWidth * 0.04,
    fontFamily: Fonts.Bold,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  optionLabel: {
    fontSize: screenWidth * 0.038,
    fontFamily: Fonts.Medium,
    color: colors.black,
    flex: 1,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  optionPrice: {
    fontSize: screenWidth * 0.038,
    fontFamily: Fonts.Medium,
    color: colors.black,
  },
  arrowIcon: {
    marginLeft: spacing.md,
    marginBottom: spacing.xs,
  },
  separator: {
    height: 1,
    backgroundColor: colors.lightGray,
    marginVertical: spacing.xs,
  },
  footer: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  footerText: {
    fontSize: screenWidth * 0.036,
    fontFamily: Fonts.Regular,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  footerLink: {
    fontSize: screenWidth * 0.036,
    fontFamily: Fonts.Regular,
    color: colors.primaryLight,
    textDecorationLine: 'underline',
  },
  floatingInfoButton: {
    position: 'absolute',
    bottom: spacing.xl * 2,
    right: spacing.md,
    zIndex: 1000,
  },
  infoBubble: {
    backgroundColor: colors.lightGray,
    borderRadius: borderRadius.round,
    padding: spacing.xs,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  infoIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoIconText: {
    fontSize: 18,
    fontFamily: Fonts.Bold,
    color: colors.white,
  },
});

export default ResidentialPackages;

