import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Modal,
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
import { ConferenceOnlyContent } from './ConferenceRegistrationContent/ConferenceOnlyContent';
import { PreCongressWorkshopsContent } from './ConferenceRegistrationContent/PreCongressWorkshopsContent';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface ConferenceRegistrationPageProps {
  onBack: (tier?: 'Regular' | 'Late Registration' | 'On Spot') => void;
  onNavigateToHome: () => void;
  onNavigateToForm?: (tier: 'Regular' | 'Late Registration' | 'On Spot') => void;
}

type TabType = 'conference' | 'workshops';

const ConferenceRegistrationPage: React.FC<ConferenceRegistrationPageProps> = ({
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
          title="Conference Registration"
          onBack={onBack}
          onNavigateToHome={onNavigateToHome}
          onMenuItemPress={(id: any) => console.log('Menu:', id)}
        />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        {/* <View style={globalStyles.header}>
          <View style={globalStyles.headerBackBtTittle}>
          <TouchableOpacity onPress={onBack} style={globalStyles.headerIcon}>
            <BackArrowIcon size={25}  />
          </TouchableOpacity> 
          <Text style={globalStyles.headerTitle}>Conference Registration</Text>
          </View>
          <TouchableOpacity onPress={onNavigateToHome} style={globalStyles.headerIcon}>
            <HomeHeaderIcon size={25}  />
          </TouchableOpacity>
        </View> */}
        {/* Header */}


        {/* Conference Title */}
        <ImageBackground
          source={require('../../assets/images/wave-img.png')}
          style={globalStyles.imgBgContainerWave}
          imageStyle={globalStyles.imgBgWave}
        >
          <View style={styles.titleSection}>
            <Text style={styles.mainTitle}>
              3rd Edition of Endometriosis Congress
            </Text>
            <Text style={styles.dateLocation}>
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
                lateRegistration: 'Regular',
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
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={globalStyles.modalInfoOverlay}>
          <View style={globalStyles.modalInfoContainer}>
            <View style={globalStyles.modalInfoHeader}>
              <Text style={globalStyles.modalInfoTitle}>INFORMATION</Text>
              <TouchableOpacity
                style={globalStyles.modalInfoCloseButton}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={globalStyles.modalInfoCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={globalStyles.modalInfoContent}>
              {/* Important Section */}
              <View style={globalStyles.modalInfoSection}>
                <Text style={globalStyles.modalInfoSectionTitle}>Important</Text>
                <Text style={globalStyles.modalInfoListItem}>
                  • Registration fee is exclusive of GST @ 18%.
                </Text>
                <Text style={globalStyles.modalInfoListItem}>
                  • Membership number is mandatory.
                </Text>
                <Text style={globalStyles.modalInfoListItem}>
                  • Please mention your mobile number and email ID for better
                  communication.
                </Text>
              </View>

              {/* Registration Guidelines Section */}
              <View style={globalStyles.modalInfoSection}>
                <Text style={globalStyles.modalInfoSectionTitle}>
                  Registration Guidelines
                </Text>
                <Text style={globalStyles.modalInfoListItem}>
                  • Online charges will be applicable at 3% of the total amount.
                </Text>
                <Text style={globalStyles.modalInfoListItem}>
                  • Registration fees include admission to the scientific halls,
                  trade exhibition, public awareness programme, inaugural
                  function, lunch, banquet, delegate kit, and participation
                  certificate.
                </Text>
                <Text style={globalStyles.modalInfoListItem}>
                  • No delegate kit for spot registrations.
                </Text>
                <Text style={globalStyles.modalInfoListItem}>
                  • The participation certificate will be available to download
                  once the feedback form is submitted.
                </Text>
              </View>

              {/* Cancellation Policy Section */}
              <View style={globalStyles.modalInfoSection}>
                <Text style={globalStyles.modalInfoSectionTitle}>
                  Cancellation & Refund Policy
                </Text>
                <Text style={globalStyles.modalInfoListItem}>
                  • Requests for cancellation refunds must be made in writing
                  via email or post to the conference secretariat.
                </Text>
                <Text style={globalStyles.modalInfoListItem}>
                  • No refund of registration fee will be provided for
                  cancellation requests received after{' '}
                  <Text style={globalStyles.modalInfoBoldText}>15.11.2025</Text>.
                </Text>
                <Text style={globalStyles.modalInfoListItem}>
                  • <Text style={globalStyles.modalInfoBoldText}>30%</Text> of the registration
                  fee will be deducted as processing charges, and the remaining
                  amount will be refunded.
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
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

  titleSection: {
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.sm,
    paddingTop: 0,
  },
  mainTitle: {
    color: colors.primaryLight,
    fontSize: screenWidth * 0.043,
    fontFamily: Fonts.Bold,
    marginBottom: spacing.xs,
  },
  dateLocation: {
    color: colors.primaryLight,
    fontSize: screenWidth * 0.035,
    fontFamily: Fonts.Regular,
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
    paddingVertical:0,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    minHeight: 50,
    opacity:0.75,
  },
  tabButtonActive: {
    backgroundColor: colors.primaryLight,
    opacity:1,
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

export default ConferenceRegistrationPage;
