import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  ImageBackground,
} from 'react-native';
import Header from '../../components/Header';
import globalStyles, { colors, spacing, borderRadius, Fonts } from '../../styles/globalStyles';
import { CongressIcon } from '../../components/icons';
import { useAuth } from '../../contexts/AuthContext';

const { width: screenWidth } = Dimensions.get('window');

interface ConferenceDetailsProps {
  onBack: () => void;
  onNavigateToHome: () => void;
}

const ConferenceDetails: React.FC<ConferenceDetailsProps> = ({
  onBack,
  onNavigateToHome,
}) => {
  const { user } = useAuth();
  
  // Get conference registrations from linked_registrations
  const conferenceRegistrations = user?.linked_registrations?.conference || [];
  const hasConference = Array.isArray(conferenceRegistrations) && conferenceRegistrations.length > 0;

  const formatDate = (dateString: string): string => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateString: string): string => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    } catch {
      return dateString;
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Conference Details"
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

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {!hasConference ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No conference registrations found</Text>
            </View>
          ) : (
            <View style={styles.registrationSection}>
              {conferenceRegistrations.map((conference: any, index: number) => {
                const infoRows = [
                  { label: 'Serial Number', value: conference.serial_number || 'N/A' },
                  { label: 'Event', value: conference.event_name || 'N/A' },
                  { label: 'Module', value: conference.module_name || 'N/A' },
                  { label: 'Category', value: conference.category_name || 'N/A' },
                  { label: 'Ticket', value: conference.ticket_name || 'N/A' },
                  { label: 'Member Type', value: conference.member_type || conference.efi_type || 'N/A' },
                  { 
                    label: 'Status', 
                    value: conference.status_name || (conference.status === 1 ? 'Active' : 'Inactive'),
                    isStatus: true,
                    status: conference.status,
                  },
                  ...(conference.created_on ? [{ label: 'Created On', value: formatDateTime(conference.created_on) }] : []),
                ];

                return (
                  <View key={index} style={styles.registrationCard}>
                    <View style={styles.sectionHeader}>
                      <CongressIcon size={24} color={colors.primary} />
                      <Text style={styles.sectionTitle}>
                        {conference.event_name || 'Conference Registration'}
                      </Text>
                    </View>

                    <View style={styles.infoSection}>
                      {infoRows.map((row, rowIndex) => {
                        const statusColor = row.isStatus 
                          ? (row.status === 1 ? '#4CAF50' : '#F44336')
                          : colors.primary;

                        return (
                          <View key={rowIndex} style={styles.infoRow}>
                            <Text style={styles.infoLabel}>{row.label}</Text>
                            <Text
                              style={[
                                styles.infoValue,
                                row.isStatus && { 
                                  color: statusColor, 
                                  fontFamily: Fonts.SemiBold 
                                },
                              ]}
                            >
                              {row.value}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  containerFullWidth: {
    width: '100%',
    flex: 1,
    position: 'relative',
  },
  scrollView: {
    zIndex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  emptyText: {
    fontSize: screenWidth * 0.038,
    fontFamily: Fonts.Medium,
    color: colors.darkGray,
    textAlign: 'center',
  },
  registrationSection: {
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  registrationCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.sm,
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: screenWidth * 0.04,  
    fontFamily: Fonts.Bold,
    color: colors.primary,
  },
  infoSection: {
    gap: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  infoLabel: {
    fontSize: screenWidth * 0.035,
    fontFamily: Fonts.Regular,
    color: colors.black,
    flex: 1,
  },
  infoValue: {
    fontSize: screenWidth * 0.035,
    fontFamily: Fonts.Medium,
    color: colors.primary,
    flex: 1,
    textAlign: 'right',
  },
});

export default ConferenceDetails;

