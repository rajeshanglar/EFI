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
import { DynamicModuleContent } from './ConferenceRegistrationContent/DynamicModuleContent';
import { GetEventMappings } from '../../services/staticService';
import { ToastService } from '../../utils/service-handlers';
import { useAuth } from '../../contexts/AuthContext';
import { MEMBERSHIP_TYPES, EventMapping, Module } from '../../utils/conferenceTypes';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Membership type labels - can be made configurable or fetched from API if needed
const MEMBERSHIP_LABELS = {
  [MEMBERSHIP_TYPES.MEMBER]: 'EFI Members',
  [MEMBERSHIP_TYPES.NON_MEMBER]: 'Non EFI Members',
};

// UI text constants - can be made configurable or fetched from API if needed
const UI_TEXTS = {
  PAGE_TITLE: 'Non-Residential Packages',
  FOOTER_QUESTION: 'Already an EFI Member?',
  FOOTER_LINK: 'Click Here to Continue',
  LOADING: 'Loading packages...',
  EMPTY_STATE: 'No non-residential packages available',
} as const;

interface NonResidentialPackagesProps {
  onBack: (tier?: string) => void;
  onNavigateToHome: () => void;
  onNavigateToForm?: (categoryName: string, ticket?: any, module_name?: string, is_residential?: number, membershipType?: string, event_id?: number, module_id?: number, category_id?: number) => void;
  onMemberClick?: () => void;
}

const NonResidentialPackages: React.FC<NonResidentialPackagesProps> = ({
  onBack,
  onNavigateToHome,
  onMemberClick,
  onNavigateToForm,
}) => {
  const { user, isAuthenticated } = useAuth();
  const [modules, setModules] = useState<Module[]>([]);
  const [activeModuleIndex, setActiveModuleIndex] = useState<number>(0);
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [membershipType, setMembershipType] = useState<string>(MEMBERSHIP_TYPES.MEMBER);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [eventInfo, setEventInfo] = useState<{ name: string; description: string } | null>(null);
  const [eventId, setEventId] = useState<number>(0);

  // Check if user is a membership user for footer visibility
  const registrationType = user?.registration_type || '';
  const isMembershipUser = isAuthenticated && registrationType === 'membership';

  // Set default membership type (always EFI Members)
  useEffect(() => {
    setMembershipType(MEMBERSHIP_TYPES.MEMBER);
  }, []);

  // Load event mappings and filter non-residential modules
  useEffect(() => {
    const loadEventMappings = async () => {
      setLoading(true);
      try {
        const response = await GetEventMappings();
        if (!response?.success || !response?.data?.length) {
          ToastService.error('Error', response?.message || 'Failed to fetch packages');
          return;
        }

        const eventData: EventMapping = response.data[0];
        setEventInfo({
          name: eventData.event_name,
          description: eventData.description,
        });
        setEventId(eventData.id);

        // Filter and transform modules for non-residential packages
        const nonResidentialModules = eventData.modules
          .map((module) => ({
            ...module,
            categories: module.categories.filter((cat) => cat.is_residential === 0),
          }))
          .filter((module) => module.categories.length > 0);

        setModules(nonResidentialModules);

        // Set initial active module and category
        if (nonResidentialModules.length > 0) {
          setActiveModuleIndex(0);
          const firstCategory = nonResidentialModules[0].categories[0];
          if (firstCategory) {
            setActiveCategoryId(firstCategory.id);
          }
        }
      } catch (error: any) {
        console.error('Failed to load event mappings:', error);
        ToastService.error('Error', error?.response?.data?.message || error?.message || 'Failed to fetch packages');
      } finally {
        setLoading(false);
      }
    };

    loadEventMappings();
  }, []);

  return (
    <View style={styles.container}>
      <Header
        title={UI_TEXTS.PAGE_TITLE}
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
              {eventInfo?.name}
            </Text>
            <Text style={globalStyles.conferenceDateLocation}>
              {eventInfo?.description}
            </Text>
          </View>

          {/* Dynamic Tab Buttons from module_name */}
          {modules.length > 0 && (
            <View style={styles.tabButtonsContainer}>
              {modules.map((module, index) => {
                const isActive = activeModuleIndex === index;
                const handleTabPress = () => {
                  setActiveModuleIndex(index);
                  const firstCategory = module.categories[0];
                  if (firstCategory) {
                    setActiveCategoryId(firstCategory.id);
                  }
                };

                return (
                  <TouchableOpacity
                    key={module.id}
                    style={[styles.tabButton, isActive && styles.tabButtonActive]}
                    onPress={handleTabPress}
                  >
                    <Text style={[styles.tabButtonText, isActive && styles.tabButtonTextActive]}>
                      {module.module_name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* Membership Selection - Show for both tabs */}
          <View style={styles.membershipSection}>
            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => setMembershipType(MEMBERSHIP_TYPES.MEMBER)}
            >
              <View
                style={[
                  styles.radio,
                  membershipType === MEMBERSHIP_TYPES.MEMBER && styles.radioSelected,
                ]}
              >
                {membershipType === MEMBERSHIP_TYPES.MEMBER && <View style={styles.radioInner} />}
              </View>
              <Text style={styles.radioText}>{MEMBERSHIP_LABELS[MEMBERSHIP_TYPES.MEMBER]}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => setMembershipType(MEMBERSHIP_TYPES.NON_MEMBER)}
            >
              <View
                style={[
                  styles.radio,
                  membershipType === MEMBERSHIP_TYPES.NON_MEMBER && styles.radioSelected,
                ]}
              >
                {membershipType === MEMBERSHIP_TYPES.NON_MEMBER && (
                  <View style={styles.radioInner} />
                )}
              </View>
              <Text style={styles.radioText}>{MEMBERSHIP_LABELS[MEMBERSHIP_TYPES.NON_MEMBER]}</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>

        {/* Tab Content */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>{UI_TEXTS.LOADING}</Text>
          </View>
        ) : modules.length > 0 ? (
          <DynamicModuleContent
            module={modules[activeModuleIndex]}
            membershipType={membershipType}
            onMembershipTypeChange={setMembershipType}
            activeCategoryId={activeCategoryId}
            onCategoryChange={setActiveCategoryId}
            onCategorySelect={(categoryName, ticket) => {
              const activeModule = modules[activeModuleIndex];
              const activeCategory = activeModule?.categories.find(cat => cat.id === activeCategoryId);
              
              console.log('NonResidentialPackages - Ticket Selected:', {
                categoryName: categoryName,
                moduleName: activeModule?.module_name,
                moduleId: activeModule?.id,
                categoryId: activeCategory?.id,
                eventId: eventId,
                ticketId: ticket?.id,
                ticketName: ticket?.name,
                memberPrice: ticket?.member_price,
                nonMemberPrice: ticket?.non_member_price,
                currency: ticket?.currency,
                categoryTillDate: ticket?.category_till_date,
                categoryAfterDate: ticket?.category_after_date,
                mappingId: ticket?.mapping_id,
                sortOrder: ticket?.sort_order,
                selectedMembershipType: membershipType,
                fullTicket: ticket,
              });
              onNavigateToForm?.(
                categoryName, 
                ticket, 
                activeModule?.module_name, 
                0, 
                membershipType,
                eventId,
                activeModule?.id,
                activeCategory?.id
              );
            }}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{UI_TEXTS.EMPTY_STATE}</Text>
          </View>
        )}
      </ScrollView>

      {/* Footer - Only show if user is NOT a membership user */}
      {!isMembershipUser && (
        <View style={globalStyles.footerPrimaryMain}>
          <View style={globalStyles.footerPrimaryLinkContainer}>
            <Text style={globalStyles.footerPrimaryText}>
              {UI_TEXTS.FOOTER_QUESTION}
            </Text>
            <TouchableOpacity onPress={onMemberClick}>
              <Text style={globalStyles.footerPrimaryLinkText}>
                {UI_TEXTS.FOOTER_LINK}
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
    backgroundColor: colors.lightYellow,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    minHeight: 50,
    opacity:0.75,
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

export default NonResidentialPackages;

