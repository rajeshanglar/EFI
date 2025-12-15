import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { colors, spacing, borderRadius, Fonts } from '../../../../styles/globalStyles';
import { CardRightArrowIcon } from '../../../../components/icons';
import globalStyles from '../../../../styles/globalStyles';
import { formatPrice } from '../../../../utils/currencyFormatter';
import { formatDate, DATE_PREFIXES } from '../../../../utils/dateFormatter';
import { MEMBERSHIP_TYPES, Ticket, Category, Module } from '../../../../utils/conferenceTypes';

const { width: screenWidth } = Dimensions.get('window');

// Category IDs for Pre-Congress / Pre-Conference Workshops (view-only)
// TODO: Populate with actual category IDs from the API response
const PRE_CONGRESS_CATEGORY_IDS: number[] = [
  // e.g., 5, 7
];

interface DynamicModuleContentProps {
  module: Module | null;
  membershipType: string; // Dynamic membership type (e.g., 'member', 'non_member')
  onMembershipTypeChange: (type: string) => void;
  activeCategoryId: number | null;
  onCategoryChange: (categoryId: number) => void;
  onCategorySelect: (categoryName: string, ticket?: Ticket) => void;
}


export const DynamicModuleContent: React.FC<DynamicModuleContentProps> = ({
  module,
  membershipType,
  activeCategoryId,
  onCategoryChange,
  onCategorySelect,
}) => {
  // Get categories in API order
  const categories = useMemo(() => {
    if (!module?.categories?.length) return [];
    return module.categories;
  }, [module?.categories]);

  // Memoize active category
  const activeCategory = useMemo(() => {
    return categories.find(cat => cat.id === activeCategoryId) || categories[0];
  }, [categories, activeCategoryId]);

  // Get tickets in API order
  const tickets = useMemo(() => {
    if (!activeCategory?.tickets?.length) return [];
    return activeCategory.tickets;
  }, [activeCategory?.tickets]);

  // Helper to get date text for category
  const getCategoryDateText = (category: Category): string => {
    const firstTicket = category.tickets?.[0];
    if (firstTicket?.category_till_date) {
      return `${DATE_PREFIXES.UPTO} ${formatDate(firstTicket.category_till_date)}`;
    }
    if (firstTicket?.category_after_date) {
      return `${DATE_PREFIXES.AFTER} ${formatDate(firstTicket.category_after_date)}`;
    }
    return '';
  };

  if (!module || categories.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>No packages available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Registration Tier Tabs */}
      <View style={globalStyles.tierTabs}>
        {categories.map((category) => {
          const isActive = category.id === activeCategory?.id;
          const dateText = getCategoryDateText(category);

          return (
            <TouchableOpacity
              key={category.id}
              style={[
                globalStyles.tierTab,
                isActive && globalStyles.tierTabActive,
              ]}
              onPress={() => onCategoryChange(category.id)}
            >
              <Text
                style={[
                  globalStyles.tierTabText,
                  isActive && globalStyles.tierTabTextActive,
                ]}
              >
                {category.name}
              </Text>
              {dateText ? (
                <Text
                  style={[
                    globalStyles.tierTabSubtext,
                    isActive && globalStyles.tierTabSubtextActive,
                  ]}
                >
                  {dateText}
                </Text>
              ) : null}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Registration Options Cards */}
      <View style={styles.cardContainer}>
        {tickets.map((ticket) => {
          console.log('activeCategory', module);
          const price = membershipType === MEMBERSHIP_TYPES.MEMBER 
            ? ticket.member_price 
            : ticket.non_member_price;

          // Check if this category is a Pre-Congress/Pre-Conference Workshop (view-only)
          // Priority: ID-based (recommended). Fallback: name contains "pre-conference"/"pre congress".
          const categoryNameLower = activeCategory?.name?.toLowerCase() || '';
          const isPreConferenceWorkshop = module?.id == 2 ? true : false;

          // Use View for Pre-Conference Workshop tickets, TouchableOpacity for others
          const CardComponent = isPreConferenceWorkshop ? View : TouchableOpacity;

          return (
            <CardComponent
              key={ticket.id}
              style={[styles.card, styles.cardBottom]}
              {...(isPreConferenceWorkshop ? {} : {
                onPress: () => {
                  console.log('NonResidentialPackages - Ticket Details:', {
                    ticketId: ticket.id,
                    ticketName: ticket.name,
                    categoryName: activeCategory?.name || '',
                    memberPrice: ticket.member_price,
                    nonMemberPrice: ticket.non_member_price,
                    currency: ticket.currency,
                    categoryTillDate: ticket.category_till_date,
                    categoryAfterDate: ticket.category_after_date,
                    mappingId: ticket.mapping_id,
                    sortOrder: ticket.sort_order,
                    selectedPrice: price,
                    membershipType: membershipType,
                    fullTicket: ticket,
                  });
                  onCategorySelect(activeCategory?.name || '', ticket);
                }
              })}
            >
              <View style={styles.optionCard}>
                <Text style={styles.optionText}>{ticket.name}</Text>
                <View style={styles.priceArrowContainer}>
                  <Text style={styles.priceText}>{formatPrice(price, ticket.currency)}</Text>
                  {/* Hide arrow for Pre-Conference Workshop tickets (view-only) */}
                  {!isPreConferenceWorkshop && (
                    <CardRightArrowIcon size={16} color={colors.darkGray} />
                  )}
                </View>
              </View>
            </CardComponent>
          );
        })}
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
  emptyText: {
    textAlign: 'center',
    color: colors.gray,
    fontSize: screenWidth * 0.038,
    fontFamily: Fonts.Medium,
    padding: spacing.xl,
  },
});

