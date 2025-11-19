import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image, Linking, Alert } from 'react-native';
import { colors, spacing, borderRadius, Fonts } from '../../../styles/globalStyles';
import { ArrowRightIcon, CardRightArrowIcon } from '../../../components/icons';
import globalStyles from '../../../styles/globalStyles';

const { width: screenWidth } = Dimensions.get('window');

interface Workshop {
  id: string;
  title: string;
  subtag: string;
  description: string;
  image: any;
  link: string; // PDF URL
}

interface PreCongressWorkshopsContentProps {
  membershipType: 'efi' | 'nonEfi';
  onMembershipTypeChange: (type: 'efi' | 'nonEfi') => void;
  registrationTier: 'regular' | 'lateRegistration' | 'onSpot';
  onRegistrationTierChange: (tier: 'regular' | 'lateRegistration' | 'onSpot') => void;
  onCategorySelect: (tier: 'Regular' | 'Late Registration' | 'On Spot') => void;
  onWorkshopPress?: (workshopId: string) => void;
}

export const PreCongressWorkshopsContent: React.FC<PreCongressWorkshopsContentProps> = ({
  membershipType,
  onMembershipTypeChange,
  registrationTier,
  onRegistrationTierChange,
  onCategorySelect,
  onWorkshopPress,
}) => {
  // Pricing data based on membership type and registration tier
  const pricingData = {
    efi: {
      regular: {
        'National - Standard': '₹ 6,000',
        "National - PG's/Fellows": '₹ 4,000',
        'International - Standard': '100 USD',
        "International - PG's/Fellows": '70 USD',
      },
      lateRegistration: {
        'National - Standard': '₹ 6,500',
        "National - PG's/Fellows": '₹ 4,500',
        'International - Standard': '110 USD',
        "International - PG's/Fellows": '80 USD',
      },
      onSpot: {
        'National - Standard': '₹ 7,000',
        "National - PG's/Fellows": '₹ 5,000',
        'International - Standard': '120 USD',
        "International - PG's/Fellows": '90 USD',
      },
    },
    nonEfi: {
      regular: {
        'National - Standard': '₹ 9,000',
        "National - PG's/Fellows": '₹ 7,000',
        'International - Standard': '120 USD',
        "International - PG's/Fellows": '90 USD',
      },
      lateRegistration: {
        'National - Standard': '₹ 9,500',
        "National - PG's/Fellows": '₹ 7,500',
        'International - Standard': '130 USD',
        "International - PG's/Fellows": '100 USD',
      },
      onSpot: {
        'National - Standard': '₹ 10,000',
        "National - PG's/Fellows": '₹ 8,000',
        'International - Standard': '140 USD',
        "International - PG's/Fellows": '110 USD',
      },
    },
  };

  const registrationOptions = [
    { category: 'National - Standard' as const },
    { category: "National - PG's/Fellows" as const },
    { category: 'International - Standard' as const },
    { category: "International - PG's/Fellows" as const },
  ];
  // Handle PDF opening
  const handleOpenPDF = async (pdfUrl: string) => {
    try {
      // Ensure URL has http:// or https://
      let url = pdfUrl.trim();
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = `https://${url}`;
      }
      await Linking.openURL(url);
    } catch (error) {
      console.error('Error opening PDF:', error);
      Alert.alert('Error', 'Unable to open PDF. Please check your internet connection.');
    }
  };

  // Morning session workshops - JSON data structure
  const morningWorkshops: Workshop[] = [
    {
      id: '1',
      title: 'Robotics in Endometriosis',
      subtag: 'Simulation to Strategy',
      description: 'Learn advanced robotic techniques for endometriosis surgery',
      image: require('../../../assets/images/efi-training-img.jpg'),
      link: 'https://endometriosiscongress.com/assets/program_images/PC%20WORKSHOP%205.pdf',
    },
    {
      id: '2',
      title: 'Ultrasound in Endometriosis',
      subtag: 'Simulation to Strategy',
      description: 'Advanced ultrasound techniques for endometriosis diagnosis',
      image: require('../../../assets/images/efi-training-img.jpg'),
      link: 'https://endometriosiscongress.com/assets/program_images/PC%20WORKSHOP%205.pdf',
    },
    {
      id: '3',
      title: 'Robotics in Endometriosis',
      subtag: 'Depth & Dexterity',
      description: 'Learn advanced robotic techniques for endometriosis surgery',
      image: require('../../../assets/images/efi-training-img.jpg'),
      link: 'https://endometriosiscongress.com/assets/program_images/PC%20WORKSHOP%206.pdf',
    },
  ];

  // Afternoon session workshops - JSON data structure
  const afternoonWorkshops: Workshop[] = [
    {
      id: '4',
      title: 'Robotics in Endometriosis',
      subtag: 'Simulation to Strategy',
      description: 'Learn advanced robotic techniques for endometriosis surgery',
      image: require('../../../assets/images/efi-training-img.jpg'),
      link: 'https://endometriosiscongress.com/assets/program_images/PC%20WORKSHOP%207.pdf',
    },
    {
      id: '5',
      title: 'Ultrasound in Endometriosis',
      subtag: 'Simulation to Strategy',
      description: 'Advanced ultrasound techniques for endometriosis diagnosis',
      image: require('../../../assets/images/efi-training-img.jpg'),
      link: 'https://endometriosiscongress.com/assets/program_images/PC%20WORKSHOP%208.pdf',
    },
    {
      id: '6',
      title: 'Robotics in Endometriosis',
      subtag: 'Depth & Dexterity',
      description: 'Learn advanced robotic techniques for endometriosis surgery',
      image: require('../../../assets/images/efi-training-img.jpg'),
      link: 'https://endometriosiscongress.com/assets/program_images/PC%20WORKSHOP%209.pdf',
    },
  ];

  const renderWorkshopCard = (workshop: Workshop) => (
    <TouchableOpacity
      key={workshop.id}
      style={styles.workshopCard}
      onPress={() => {
        onWorkshopPress?.(workshop.id);
        handleOpenPDF(workshop.link);
      }}
      activeOpacity={0.8}
    >
      <Image
        source={workshop.image}
        style={styles.workshopImage}
        resizeMode="cover"
      />

      {/* Content section at bottom */}
      <View style={styles.workshopContent}>
        <Text style={styles.workshopTitle}>{workshop.title}</Text>
        <Text style={styles.workshopDescription}>{workshop.description}</Text>
        <View style={styles.arrowContainer}>
          <ArrowRightIcon size={16} color={colors.primaryLight} />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <>

      {/* Registration Tier Tabs */}
      <View style={globalStyles.tierTabs}>
        <TouchableOpacity
          style={[
            globalStyles.tierTab,
            registrationTier === 'regular' && globalStyles.tierTabActive,
          ]}
          onPress={() => onRegistrationTierChange('regular')}
        >
          <Text
            style={[
              globalStyles.tierTabText,
              registrationTier === 'regular' &&
                globalStyles.tierTabTextActive,
            ]}
          >
            Regular
          </Text>
          <Text
            style={[
              globalStyles.tierTabSubtext,
              registrationTier === 'regular' &&
                globalStyles.tierTabSubtextActive,
            ]}
          >
            Upto 31 Dec 2025
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            globalStyles.tierTab,
            registrationTier === 'lateRegistration' && globalStyles.tierTabActive,
          ]}
          onPress={() => onRegistrationTierChange('lateRegistration')}
        >
          <Text
            style={[
              globalStyles.tierTabText,
              registrationTier === 'lateRegistration' &&
                globalStyles.tierTabTextActive,
            ]}
          >
            Late Registration
          </Text>
          <Text
            style={[
              globalStyles.tierTabSubtext,
              registrationTier === 'lateRegistration' &&
                globalStyles.tierTabSubtextActive,
            ]}
          >
            Upto 15 Feb 2026
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            globalStyles.tierTab,
            registrationTier === 'onSpot' && globalStyles.tierTabActive,
          ]}
          onPress={() => onRegistrationTierChange('onSpot')}
        >
          <Text
            style={[
              globalStyles.tierTabText,
              registrationTier === 'onSpot' && globalStyles.tierTabTextActive,
            ]}
          >
            On Spot
          </Text>
          <Text
            style={[
              globalStyles.tierTabSubtext,
              registrationTier === 'onSpot' &&
                globalStyles.tierTabSubtextActive,
            ]}
          >
            After 15 Feb 2026
          </Text>
        </TouchableOpacity>
      </View>


      <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Registration Options Cards */}
      <View style={styles.cardContainer}>
        {registrationOptions.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.card, styles.cardBottom]}
            onPress={() => {
              const tierMap: {
                [key: string]: 'Regular' | 'Late Registration' | 'On Spot';
              } = {
                regular: 'Regular',
                lateRegistration: 'Late Registration',
                onSpot: 'On Spot',
              };
              onCategorySelect(tierMap[registrationTier]);
            }}
          >
            <View style={styles.optionCard}>
              <Text style={styles.optionText}>{option.category}</Text>
              <View style={styles.priceArrowContainer}>
                <Text style={styles.priceText}>
                  {pricingData[membershipType][registrationTier][option.category]}
                </Text>
                <CardRightArrowIcon size={16} color={colors.darkGray} />
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Morning Session */}



      <View style={styles.section}>

      <View style={styles.noteContainer}>
  <Text style={styles.noteText}>
    <Text style={styles.noteTextBold}>Note:</Text> Participants can select only one workshop per session (one in the morning and one in the afternoon).
  </Text>
</View>

        <Text style={styles.sectionTitle}>Pre-Congress Workshops - Morning session</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.workshopScrollContent}
        >
          {morningWorkshops.map(renderWorkshopCard)}
        </ScrollView>
      </View>

      {/* Afternoon Session */}
      <View style={styles.section}>





        <Text style={styles.sectionTitle}>Pre-Congress Workshops - Afternoon session</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.workshopScrollContent}
        >
          {afternoonWorkshops.map(renderWorkshopCard)}
        </ScrollView>
      </View>
    </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({

  noteContainer:{
    padding: spacing.md,
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.md,
  },
  noteText: {
    fontSize: screenWidth * 0.04,
    fontFamily: Fonts.Regular,
    color: colors.black,
    lineHeight: screenWidth * 0.058,
  },
  noteTextBold: {
    fontSize: screenWidth * 0.04,
    fontFamily: Fonts.Bold,
    color: colors.black,
  },
  tierTabs: {
    flexDirection: 'row',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.md,
    paddingTop: 0,
  },

  container: {
    flex: 1,
    marginTop: -spacing.sm,   
    backgroundColor: colors.white,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  cardContainer: {
    padding: spacing.md,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.sm,
    shadowColor: '#746ABE',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 4,
  },
  cardBottom: {
    marginBottom: spacing.md,
  },
  optionCard: {
    padding: spacing.md,
    backgroundColor: 'transparent',
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
  section: {
    paddingBottom: spacing.md,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  sectionTitle: {
    fontSize: screenWidth * 0.042,
    fontFamily: Fonts.Bold,
    color: colors.black,
    marginBottom: spacing.md,
  },
  workshopScrollContent: {
    paddingRight: spacing.md,
    paddingBottom: spacing.md,
  },
  workshopCard: {
    width: screenWidth * 0.7,
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    marginRight: spacing.md,
    overflow: 'hidden',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  workshopImage: {
    width: '100%',
    height: screenWidth * 0.4,
  },
  // workshopOverlay: {
  //   position: 'absolute',
  //   top: 0,
  //   left: 0,
  //   right: 0,
  //   bottom: 0,
  //   backgroundColor: 'rgba(0, 0, 0, 0.4)',
  //   justifyContent: 'flex-start',
  //   padding: spacing.md,
  //   paddingTop: spacing.md,
  // },
  workshopTitle: {
    fontSize: screenWidth * 0.042,
    fontFamily: Fonts.Bold,
    color: colors.primary,
    marginBottom: spacing.xs,

  },
  workshopSubtag: {
    fontSize: screenWidth * 0.033,
    fontFamily: Fonts.Medium,
    color: colors.primaryLight,
    lineHeight: screenWidth * 0.04,
  },
  workshopContent: {
    padding: spacing.md,
  
  },
  workshopDescription: {
    flex: 1,
    fontSize: screenWidth * 0.035,
    fontFamily: Fonts.Regular,
    color: colors.darkGray,
    marginRight: spacing.sm,
  },
  arrowContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primaryLight + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

