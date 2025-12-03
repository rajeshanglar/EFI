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
import { SafeAreaView } from 'react-native-safe-area-context';
import globalStyles, {
  colors,
  spacing,
  borderRadius,
  Fonts,
} from '../../styles/globalStyles';
import {
  ArrowRightIcon,
  InformationIcon,
  CardRightArrowIcon,
} from '../../components/icons';
import Header from '../../components/Header';
import ConferenceInformationModal from '../../components/ConferenceInformationModal';
import { ConferenceOnlyContent } from './ConferenceRegistrationContent/ConferenceOnlyContent';
import { PreCongressWorkshopsContent } from './ConferenceRegistrationContent/PreCongressWorkshopsContent';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface NonResidentialPackagesProps {
  onBack: (tier?: 'Regular' | 'Late Registration' | 'On Spot') => void;
  onNavigateToHome: () => void;
  onNavigateToForm?: (tier: 'Regular' | 'Late Registration' | 'On Spot') => void;
}

type TabType = 'conference' | 'workshops';

const NonResidentialPackages: React.FC<NonResidentialPackagesProps> = ({
  onBack,
  onNavigateToHome,  
  onNavigateToForm,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('conference');
  const [membershipType, setMembershipType] = useState<'efi' | 'nonEfi'>('efi');
  const [registrationTier, setRegistrationTier] = useState<
    'regular' | 'lateRegistration' | 'onSpot'
  >('regular'); // regular maps to "Regular" tier in UI
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Header
        title="Non-Residential Packages"
        onBack={onBack}
        onNavigateToHome={onNavigateToHome}
        onMenuItemPress={(id: any) => console.log('Menu:', id)}
      />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Conference Title */}
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

          {/* Tab Buttons */}
          <View style={styles.tabButtonsContainer}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === 'conference' && styles.tabButtonActive,
              ]}
              onPress={() => setActiveTab('conference')}
            >
              <Text
                style={[
                  styles.tabButtonText,
                  activeTab === 'conference' && styles.tabButtonTextActive,
                ]}
              >
                Conference Only
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === 'workshops' && styles.tabButtonActive,
              ]}
              onPress={() => setActiveTab('workshops')}
            >
              <Text
                style={[
                  styles.tabButtonText,
                  activeTab === 'workshops' && styles.tabButtonTextActive,
                ]}
              >
                Pre-Congress Workshops
              </Text>
            </TouchableOpacity>
          </View>

          {/* Membership Selection - Show for both tabs */}
          <View style={styles.membershipSection}>
            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => setMembershipType('efi')}
            >
              <View
                style={[
                  styles.radio,
                  membershipType === 'efi' && styles.radioSelected,
                ]}
              >
                {membershipType === 'efi' && <View style={styles.radioInner} />}
              </View>
              <Text style={styles.radioText}>EFI Members</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => setMembershipType('nonEfi')}
            >
              <View
                style={[
                  styles.radio,
                  membershipType === 'nonEfi' && styles.radioSelected,
                ]}
              >
                {membershipType === 'nonEfi' && (
                  <View style={styles.radioInner} />
                )}
              </View>
              <Text style={styles.radioText}>Non EFI Members</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>

        {/* Tab Content */}
        {activeTab === 'conference' ? (
          <ConferenceOnlyContent
            membershipType={membershipType}
            onMembershipTypeChange={setMembershipType}
            registrationTier={registrationTier}
            onRegistrationTierChange={setRegistrationTier}
            onCategorySelect={(tier) => {
              const tierMap: {
                [key: string]: 'Regular' | 'Late Registration' | 'On Spot';
              } = {
                regular: 'Regular',
                lateRegistration: 'Late Registration',
                onSpot: 'On Spot',
              };
              onNavigateToForm?.(tierMap[registrationTier]);
            }}
          />
        ) : (
          <PreCongressWorkshopsContent
            membershipType={membershipType}
            onMembershipTypeChange={setMembershipType}
            registrationTier={registrationTier}
            onRegistrationTierChange={setRegistrationTier}
            onCategorySelect={(tier) => {
              const tierMap: {
                [key: string]: 'Regular' | 'Late Registration' | 'On Spot';
              } = {
                regular: 'Regular',
                lateRegistration: 'Late Registration',
                onSpot: 'On Spot',
              };
              onNavigateToForm?.(tierMap[registrationTier]);
            }}
            onWorkshopPress={(workshopId) => {
              console.log('Workshop pressed:', workshopId);
              // Handle workshop selection if needed
            }}
          />
        )}
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
    paddingBottom: spacing.xxl,
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    flex: 1,
  },
  tabButtonsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  tabButton: {
    paddingVertical: 0,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    minHeight: 50,
    opacity: 0.75,
  },
  tabButtonActive: {
    backgroundColor: colors.primaryLight,
    opacity: 1,
  },
  tabButtonText: {
    fontSize: screenWidth * 0.037,
    fontFamily: Fonts.Bold,
    color: colors.primary,
  },
  tabButtonTextActive: {
    color: colors.primary,
  },
  membershipSection: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.white,
    marginRight: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: colors.primaryLight,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primaryLight,
    borderWidth: 2,
    borderColor: colors.white,
  },
  radioText: {
    color: colors.white,
    fontSize: screenWidth * 0.037,
    fontFamily: Fonts.Medium,
  },
});

export default NonResidentialPackages;

