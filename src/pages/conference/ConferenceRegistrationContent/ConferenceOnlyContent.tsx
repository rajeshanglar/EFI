import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { colors, spacing, borderRadius, Fonts } from '../../../styles/globalStyles';
import { CardRightArrowIcon } from '../../../components/icons';
import globalStyles from '../../../styles/globalStyles';

const { width: screenWidth } = Dimensions.get('window');

interface ConferenceOnlyContentProps {
  membershipType: 'efi' | 'nonEfi';
  onMembershipTypeChange: (type: 'efi' | 'nonEfi') => void;
  registrationTier: 'regular' | 'lateRegistration' | 'onSpot';
  onRegistrationTierChange: (tier: 'regular' | 'lateRegistration' | 'onSpot') => void;
  onCategorySelect: (tier: 'Regular' | 'Late Registration' | 'On Spot') => void;
}

export const ConferenceOnlyContent: React.FC<ConferenceOnlyContentProps> = ({
  membershipType,
  onMembershipTypeChange,
  registrationTier,
  onRegistrationTierChange,
  onCategorySelect,
}) => {
  // Pricing data based on membership type and registration tier
  const pricingData = {
    efi: {
      regular: {
        'National - Standard': '₹ 13,000',
        "National - PG's/Fellows": '₹ 7,000',
        'International - Standard': '220 USD',
        "International - PG's/Fellows": '110 USD',
      },
      lateRegistration: {
        'National - Standard': '₹ 14,000',
        "National - PG's/Fellows": '₹ 7,500',
        'International - Standard': '235 USD',
        "International - PG's/Fellows": '120 USD',
      },
      onSpot: {
        'National - Standard': '₹ 15,000',
        "National - PG's/Fellows": '₹ 8,000',
        'International - Standard': '250 USD',
        "International - PG's/Fellows": '125 USD',
      },
    },
    nonEfi: {
      regular: {
        'National - Standard': '₹ 16,000',
        "National - PG's/Fellows": '₹ 10,000',
        'International - Standard': '250 USD',
        "International - PG's/Fellows": '125 USD',
      },
      lateRegistration: {
        'National - Standard': '₹ 17,000',
        "National - PG's/Fellows": '₹ 10,500',
        'International - Standard': '265 USD',
        "International - PG's/Fellows": '135 USD',
      },
      onSpot: {
        'National - Standard': '₹ 18,000',
        "National - PG's/Fellows": '₹ 11,000',
        'International - Standard': '280 USD',
        "International - PG's/Fellows": '140 USD',
      },
    },
  };

  const registrationOptions = [
    { category: 'National - Standard' as const },
    { category: "National - PG's/Fellows" as const },
    { category: 'International - Standard' as const },
    { category: "International - PG's/Fellows" as const },
  ];

  return (
    <View style={styles.container}>
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
                lateRegistration: 'Regular',
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    marginTop: -spacing.sm,   
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
});

