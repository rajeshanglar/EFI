import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import globalStyles, { colors, spacing, borderRadius, Fonts } from '../../styles/globalStyles';
import { 
  ArrowRightIcon, 
  InformationIcon,
  HomeHeaderIcon,
  BackArrowIcon,
  CardRightArrowIcon,
} from '../../components/icons';
import { Header } from '../../components/Header';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface ConferenceRegistrationPageProps {
  onBack: () => void;
  onNavigateToHome: () => void;
  onNavigateToForm?: (tier: 'Early Bird' | 'Regular' | 'On Spot') => void;
}

const ConferenceRegistrationPage: React.FC<ConferenceRegistrationPageProps> = ({ 
  onBack, 
  onNavigateToHome,
  onNavigateToForm 
}) => {
  const [membershipType, setMembershipType] = useState<'efi' | 'nonEfi'>('efi');
  const [registrationTier, setRegistrationTier] = useState<'earlyBird' | 'regular' | 'onSpot'>('earlyBird');
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Pricing data for each tier
  const pricingData = {
    earlyBird: {
      'National - Standard': '₹ 11,000',
      'National - PG\'s/Fellows': '₹ 6,000',
      'International - Standard': '190 USD',
      'International - PG\'s/Fellows': '100 USD',
    },
    regular: {
      'National - Standard': '₹ 13,000',
      'National - PG\'s/Fellows': '₹ 8,000',
      'International - Standard': '230 USD',
      'International - PG\'s/Fellows': '140 USD',
    },
    onSpot: {
      'National - Standard': '₹ 15,000',
      'National - PG\'s/Fellows': '₹ 10,000',
      'International - Standard': '280 USD',
      'International - PG\'s/Fellows': '180 USD',
    },
  };

  const registrationOptions = [
    { category: 'National - Standard' as const },
    { category: 'National - PG\'s/Fellows' as const },
    { category: 'International - Standard' as const },
    { category: 'International - PG\'s/Fellows' as const },
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
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
      <Header 
        title="Conference Registration"
        onBack={onBack}
        onNavigateToHome={onNavigateToHome}
      />

        {/* Conference Title */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>3rd Edition of Endometriosis Congress</Text>
          <Text style={styles.dateLocation}>6, 7 & 8 MARCH 2026, Park Hyatt, Hyderabad</Text>
        </View>

        {/* Membership Selection */}
        <View style={styles.membershipSection}>
          <TouchableOpacity
            style={styles.radioOption}
            onPress={() => setMembershipType('efi')}
          >
            <View style={[styles.radio, membershipType === 'efi' && styles.radioSelected]}>
              {membershipType === 'efi' && <View style={styles.radioInner} />}
            </View>
            <Text style={styles.radioText}>EFI Members</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.radioOption}
            onPress={() => setMembershipType('nonEfi')}
          >
            <View style={[styles.radio, membershipType === 'nonEfi' && styles.radioSelected]}>
              {membershipType === 'nonEfi' && <View style={styles.radioInner} />}
            </View>
            <Text style={styles.radioText}>Non EFI Members</Text>
          </TouchableOpacity>
        </View>

        {/* Registration Tier Tabs */}
        <View style={globalStyles.tierTabs}>
          <TouchableOpacity
            style={[globalStyles.tierTab, registrationTier === 'earlyBird' && globalStyles.tierTabActive]}
            onPress={() => setRegistrationTier('earlyBird')}
          >
            <Text style={[globalStyles.tierTabText, registrationTier === 'earlyBird' && globalStyles.tierTabTextActive]}>
              Early Bird
            </Text>
            <Text style={[globalStyles.tierTabSubtext, registrationTier === 'earlyBird' && globalStyles.tierTabSubtextActive]}>
              Upto 15 Oct 2025
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[globalStyles.tierTab, registrationTier === 'regular' && globalStyles.tierTabActive]}
            onPress={() => setRegistrationTier('regular')}
          >
            <Text style={[globalStyles.tierTabText, registrationTier === 'regular' && globalStyles.tierTabTextActive]}>
              Regular
            </Text>
            <Text style={[globalStyles.tierTabSubtext, registrationTier === 'regular' && globalStyles.tierTabSubtextActive]}>
              Upto 15 Feb 2026
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[globalStyles.tierTab, registrationTier === 'onSpot' && globalStyles.tierTabActive]}
            onPress={() => setRegistrationTier('onSpot')}
          >
            <Text style={[globalStyles.tierTabText, registrationTier === 'onSpot' && globalStyles.tierTabTextActive]}>
              On Spot
            </Text>
            <Text style={[globalStyles.tierTabSubtext, registrationTier === 'onSpot' && globalStyles.tierTabSubtextActive]}>
              After 15 Feb 2026
            </Text>
          </TouchableOpacity>
        </View>

        {/* Registration Options Card */}
        <View style={styles.cardContainer}>
        
            {registrationOptions.map((option, index) => (
              <TouchableOpacity 
                key={index} 
                style={[styles.card, styles.cardBottom]}
                onPress={() => {
                  const tierMap: { [key: string]: 'Early Bird' | 'Regular' | 'On Spot' } = {
                    earlyBird: 'Early Bird',
                    regular: 'Regular',
                    onSpot: 'On Spot',
                  };
                  onNavigateToForm?.(tierMap[registrationTier]);
                }}
              >
                 <View style={[styles.optionCard]}>
                  <Text style={styles.optionText}>{option.category}</Text>
                  <View style={styles.priceArrowContainer}>
                    <Text style={styles.priceText}>{pricingData[registrationTier][option.category]}</Text>
                    <CardRightArrowIcon size={16} color={colors.darkGray} />
                   </View>
                  </View>
                </TouchableOpacity>
              ))}
        
        </View>


      </ScrollView>

              {/* Footer */}
              <View style={globalStyles.footerPrimaryMain}>
          <View style={globalStyles.footerPrimaryLinkContainer}>
            <Text style={globalStyles.footerPrimaryText}>Already an EFI Member?</Text>
            <TouchableOpacity>
              <Text style={globalStyles.footerPrimaryLinkText}>Click Here to Continue</Text>
            </TouchableOpacity>
          </View>
        </View>

      {/* Floating Info Button */}
      <TouchableOpacity 
        style={styles.infoButton}
        onPress={() => setIsModalVisible(true)}
      >
        <View style={styles.infoButtonInner}>
          <InformationIcon size={50}  />
        </View>
      </TouchableOpacity>

      {/* Information Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>INFORMATION</Text>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              {/* Important Section */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Important</Text>
                <Text style={styles.modalListItem}>• Registration fee is exclusive of GST @ 18%.</Text>
                <Text style={styles.modalListItem}>• Membership number is mandatory.</Text>
                <Text style={styles.modalListItem}>• Please mention your mobile number and email ID for better communication.</Text>
              </View>

              {/* Registration Guidelines Section */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Registration Guidelines</Text>
                <Text style={styles.modalListItem}>• Online charges will be applicable at 3% of the total amount.</Text>
                <Text style={styles.modalListItem}>• Registration fees include admission to the scientific halls, trade exhibition, public awareness programme, inaugural function, lunch, banquet, delegate kit, and participation certificate.</Text>
                <Text style={styles.modalListItem}>• No delegate kit for spot registrations.</Text>
                <Text style={styles.modalListItem}>• The participation certificate will be available to download once the feedback form is submitted.</Text>
              </View>

              {/* Cancellation Policy Section */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Cancellation & Refund Policy</Text>
                <Text style={styles.modalListItem}>• Requests for cancellation refunds must be made in writing via email or post to the conference secretariat.</Text>
                <Text style={styles.modalListItem}>• No refund of registration fee will be provided for cancellation requests received after <Text style={styles.boldText}>15.11.2025</Text>.</Text>
                <Text style={styles.modalListItem}>• <Text style={styles.boldText}>30%</Text> of the registration fee will be deducted as processing charges, and the remaining amount will be refunded.</Text>
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
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    flex: 1,
  },


  titleSection: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primary,
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
  membershipSection: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    backgroundColor: colors.primary,
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
 
  cardContainer: {
    padding: spacing.md,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.sm,
   
    shadowColor:'#746ABE',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation:4,
  },

  cardBottom:{
    marginBottom: spacing.md,
  },
  optionCard: {
    padding: spacing.md,
    backgroundColor:'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

 
   
  },
  optionText: {
    flex: 1,
    color: colors.darkGray,
    fontSize: screenWidth * 0.038,
    fontFamily: Fonts.Medium,
  },
  priceArrowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  priceText: {
    color: colors.darkGray,
    fontSize: screenWidth * 0.038,
    fontFamily: Fonts.Medium,
  },
 
  infoButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    zIndex: 10,
  },
  infoButtonInner: {

  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContainer: {
    width: '94%',
    maxHeight: '95%',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    paddingBottom:0,
  },
  modalTitle: {
    fontSize: screenWidth * 0.045,
    fontFamily: Fonts.Bold,
    color: colors.black,
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 20,
    fontFamily: Fonts.Bold,
    color: colors.black,
  },
  modalContent: {
    padding: spacing.lg,
  },
  modalSection: {
    marginBottom: spacing.lg,
  },
  modalSectionTitle: {
    fontSize: screenWidth * 0.04,
    fontFamily: Fonts.Bold,
    color: colors.blue,
    marginBottom: spacing.sm,
  },
  modalListItem: {
    fontSize: screenWidth * 0.037,
    fontFamily: Fonts.Regular,
    color: colors.black,
    lineHeight: 22,
    marginBottom: spacing.sm,
  },
  boldText: {
    fontFamily: Fonts.Bold,
  },
});

export default ConferenceRegistrationPage;
