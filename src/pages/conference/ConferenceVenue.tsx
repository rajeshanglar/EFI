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
import { VenueContent, HostCityContent, AccommodationContent } from './ConferenceVenueContent';

const { width: screenWidth } = Dimensions.get('window');

interface ConferenceVenueProps {
  onBack: () => void;
  onNavigateToHome: () => void;
}

type TabKey = 'venue' | 'hostCity' | 'accommodation';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'venue', label: 'Venue' },
  { key: 'hostCity', label: 'Host City' },
  { key: 'accommodation', label: 'Accommodation' },
];

const ConferenceVenue: React.FC<ConferenceVenueProps> = ({
  onBack,
  onNavigateToHome,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('venue');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'venue':
        return <VenueContent />;
      case 'hostCity':
        return <HostCityContent />;
      case 'accommodation':
        return <AccommodationContent />;
      default:
        return <VenueContent />;
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Conference Venue"
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
});

export default ConferenceVenue;
