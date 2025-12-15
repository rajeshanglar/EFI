import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import Header from '../../../components/Header';
import ConferenceInformationModal from '../../../components/ConferenceInformationModal';
import globalStyles, {
  colors,
  spacing,
  borderRadius,
  Fonts,
} from '../../../styles/globalStyles';
import { CardRightArrowIcon, InformationIcon } from '../../../components/icons';
import { GetEventMappings } from '../../../services/staticService';
import { ToastService } from '../../../utils/service-handlers';
import { useAuth } from '../../../contexts/AuthContext';
import { formatPrice } from '../../../utils/currencyFormatter';
import { EventMapping, Module } from '../../../utils/conferenceTypes';

const { width: screenWidth } = Dimensions.get('window');

interface PackageOption {
  label: string;
  price: string;
  ticket?: Ticket; // Store full ticket data for logging
}

interface PackageCard {
  id: number;
  title: string;
  description: string;
  options: PackageOption[];
}

import { Ticket, Category } from '../../../utils/conferenceTypes';

interface ResidentialPackagesProps {
  onBack: () => void;
  onNavigateToHome: () => void;
  onPackageSelect?: (packageTitle: string, option: PackageOption, module_name?: string, categoryId?: number, event_id?: number, module_id?: number) => void;
  onMemberClick?: () => void;
}

const ResidentialPackages: React.FC<ResidentialPackagesProps> = ({
  onBack,
  onNavigateToHome,
  onPackageSelect,
  onMemberClick,

}) => {
  const { user, isAuthenticated } = useAuth();
  const [packages, setPackages] = useState<PackageCard[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [eventInfo, setEventInfo] = useState<{ name: string; description: string } | null>(null);
  const [currentModuleName, setCurrentModuleName] = useState<string>('');
  const [eventId, setEventId] = useState<number>(0);
  const [currentModuleId, setCurrentModuleId] = useState<number>(0);

  // Check if user is a membership user
  const registrationType = user?.registration_type || '';
  const isMembershipUser = isAuthenticated && registrationType === 'membership';

  useEffect(() => {
    const loadEventMappings = async () => {
      setCategoriesLoading(true);
      try {
        const response = await GetEventMappings();
        if (response?.success && response?.data && response.data.length > 0) {
          const eventData: EventMapping = response.data[0];
          
          // Set event info
          setEventInfo({
            name: eventData.event_name,
            description: eventData.description,
          });
          setEventId(eventData.id);

          // Find all modules with residential categories (is_residential === 1)
          const residentialModules: Module[] = [];
          
          eventData.modules.forEach((module) => {
            // Filter categories where is_residential === 1
            const residentialCategories = module.categories.filter(
              (category) => category.is_residential === 1
            );

            if (residentialCategories.length > 0) {
              residentialModules.push({
                ...module,
                categories: residentialCategories,
              });
            }
          });

          if (residentialModules.length === 0) {
            console.warn('No residential modules found');
            setPackages([]);
            return;
          }

          // Use the first residential module (or find "Residential Registration" if exists)
          const residentialModule = residentialModules.find(
            (module) => module.module_name === 'Residential Registration'
          ) || residentialModules[0];

          // Store module name and ID
          setCurrentModuleName(residentialModule.module_name);
          setCurrentModuleId(residentialModule.id);

          // Get all residential categories from the module
          const residentialCategories = residentialModule.categories;

          // Transform categories into PackageCard format
          const packageCards: PackageCard[] = residentialCategories
            .map((category) => ({
              id: category.id,
              title: category.name,
              description: category.name,
              options: category.tickets.map((ticket) => ({
                label: ticket.name,
                price: formatPrice(ticket.member_price, ticket.currency),
                ticket: ticket, // Store full ticket data
              })),
            }));

          setPackages(packageCards);
        } else {
          console.error('Failed to load event mappings:', response?.message);
          ToastService.error('Error', response?.message || 'Failed to fetch packages');
        }
      } catch (error: any) {
        console.error('Failed to load event mappings:', error);
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          'Failed to fetch packages';
        ToastService.error('Error', errorMessage);
      } finally {
        setCategoriesLoading(false);
      }
    };

    loadEventMappings();
  }, []);
  return (
    <View style={styles.container}>
      <Header
        title="Residential Packages"
        onBack={onBack}
        onNavigateToHome={onNavigateToHome}
        onMenuItemPress={(id: string) => console.log('Menu:', id)}
      />

      <ScrollView
        style={[styles.scrollView, ] }
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.containerPaddingBottom}>
        {/* Conference Banner */}
        <ImageBackground
          source={require('../../../assets/images/wave-img.png')}
          style={globalStyles.imgBgContainerWave}
          imageStyle={globalStyles.imgBgWave}
        >
            <View style={globalStyles.conferenceTitleSection}>
            <Text style={globalStyles.conferenceMainTitle}>
              {eventInfo?.name}
            </Text>
            <Text style={globalStyles.conferenceDateLocation}>
              {eventInfo?.description}
            </Text>
          </View>
        </ImageBackground>

        {/* Package Cards */}
        <View style={styles.packagesContainer}>
          {categoriesLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>Loading packages...</Text>
            </View>
          ) : packages.length > 0 ? (
            packages.map((pkg) => (
              <View key={pkg.id} style={styles.packageCard}>
                <Text style={styles.packageTitle}>{pkg.title}</Text>
                {pkg.options.map((option, optionIndex) => (
                  <View key={optionIndex}>
                    <TouchableOpacity
                      style={styles.optionRow}
                      onPress={() => {
                        console.log('ResidentialPackages - Ticket Details:', {
                          categoryName: pkg.title,
                          categoryId: pkg.id,
                          ticketId: option.ticket?.id,
                          ticketName: option.label,
                          price: option.price,
                          memberPrice: option.ticket?.member_price,
                          nonMemberPrice: option.ticket?.non_member_price,
                          currency: option.ticket?.currency,
                          categoryTillDate: option.ticket?.category_till_date,
                          categoryAfterDate: option.ticket?.category_after_date,
                          mappingId: option.ticket?.mapping_id,
                          sortOrder: option.ticket?.sort_order,
                          fullTicket: option.ticket,
                          fullOption: option,
                        });
                        onPackageSelect?.(pkg.title, option, currentModuleName, pkg.id, eventId, currentModuleId);
                      }}
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
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No residential packages available</Text>
            </View>
          )}
        </View>
        </View>
      </ScrollView>

            {/* Footer - Only show if user is NOT a membership user */}
      {!isMembershipUser && (
        <View style={globalStyles.footerPrimaryMain}>
          <View style={globalStyles.footerPrimaryLinkContainer}>
            <Text style={globalStyles.footerPrimaryText}>
              Already an EFI Member?
            </Text>
            <TouchableOpacity onPress={onMemberClick}>
              <Text style={globalStyles.footerPrimaryLinkText}>
                Click Here to Continue
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

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
  containerPaddingBottom:{
    paddingBottom:100,
  },
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
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    textAlign: 'center',
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
    color: colors.primary,
    flex: 1,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  optionPrice: {
    fontSize: screenWidth * 0.038,
    fontFamily: Fonts.SemiBold,
    color: colors.primary,
  },
  arrowIcon: {
    marginLeft: spacing.md,
    marginBottom: spacing.xs,
  },
  separator: {
    height: 1,
    backgroundColor:'#D8E0F3',
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
  loadingContainer: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: screenWidth * 0.038,
    fontFamily: Fonts.Medium,
    color: colors.gray,
    marginTop: spacing.sm,
  },
  emptyContainer: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: screenWidth * 0.038,
    fontFamily: Fonts.Medium,
    color: colors.gray,
  },
});

export default ResidentialPackages;

