import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Header from '../../components/Header';
import globalStyles, { colors, spacing } from '../../styles/globalStyles';
import { CommitteeFacultyModal, ConferenceMemberData } from '../../components/CommitteeFacultyModal';
import { VenueFloatingIcon } from '../../components/icons';

import { ProgramContent } from './ConferenceDetailsContent/ProgramContent';
import { FacultyContent } from './ConferenceDetailsContent/FacultyContent';
import { CommitteeContent } from './ConferenceDetailsContent/CommitteeContent';
import { AbstractsContent } from './ConferenceDetailsContent/AbstractsContent';

const { width: screenWidth } = Dimensions.get('window');

interface ConferenceDetailsProps {
  onBack: () => void;
  onNavigateToHome: () => void;
  onNavigateToVenue?: () => void;
}

type TabKey = 'program' | 'faculty' | 'committee' | 'abstracts';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'program', label: 'Program' },
  { key: 'faculty', label: 'Faculty' },
  { key: 'committee', label: 'Committee' },
  { key: 'abstracts', label: 'Abstracts' },
];

const ConferenceDetails: React.FC<ConferenceDetailsProps> = ({
  onBack,
  onNavigateToHome,
  onNavigateToVenue,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('program');
  const [selectedMember, setSelectedMember] = useState<ConferenceMemberData | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleMemberPress = (member: ConferenceMemberData) => {
    setSelectedMember(member);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedMember(null);
  };

  const handleVenuePress = () => {
    onNavigateToVenue?.();
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'program':
        return <ProgramContent />;
      case 'faculty':
        return <FacultyContent onMemberPress={handleMemberPress} />;
      case 'committee':
        return <CommitteeContent onMemberPress={handleMemberPress} />;
      case 'abstracts':
        return <AbstractsContent />;
      default:
        return <ProgramContent />;
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Conference Details"
        onBack={onBack}
        onNavigateToHome={onNavigateToHome}
        onMenuItemPress={(id: any) => console.log('Menu:', id)}
      />

      {/* Tabs */}
      <View style={globalStyles.tierTabs}>
        {tabs.map((tab) => {
          const active = tab.key === activeTab;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[globalStyles.tierTab, active && globalStyles.tierTabActive]}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.85}
            >
              <Text
                style={[
                  globalStyles.tierTabText,
                  active && globalStyles.tierTabTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Tab Content */}
      <View style={styles.contentContainer}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {renderTabContent()}
        </ScrollView>
      </View>

      {/* Fixed Venue Button - Only show for Program tab */}
      {activeTab === 'program' && (
        <TouchableOpacity style={styles.venueButton} onPress={handleVenuePress}>
          <View style={styles.venueButtonContent}>
            <VenueFloatingIcon size={94} color={colors.white} />
          </View>
        </TouchableOpacity>
      )}

      {/* Member Modal */}
      <CommitteeFacultyModal
        visible={isModalVisible}
        member={selectedMember}
        onClose={handleCloseModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  venueButton: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
    zIndex: 10,
  },
  venueButtonContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ConferenceDetails;
