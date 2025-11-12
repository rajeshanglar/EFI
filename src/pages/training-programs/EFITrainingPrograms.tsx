import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import Header from '../../components/Header';
import globalStyles, {
  colors,
  spacing,
} from '../../styles/globalStyles';
import { EFIMasterclassContent } from './EFIMasterclassContent';
import { EFIScopeContent } from './EFIScopeContent';
import { PapersCertificationsContent } from './PapersCertificationsContent';

const { width: screenWidth } = Dimensions.get('window');

interface TrainingProgramsProps {
  onBack: () => void;
  onNavigateToHome: () => void;
}

type TabKey = 'masterclass' | 'scope' | 'papers';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'masterclass', label: 'EFI Masterclass' },
  { key: 'scope', label: 'EFI Scope' },
  { key: 'papers', label: 'Papers / Certifications' },
];

const EFITrainingPrograms: React.FC<TrainingProgramsProps> = ({
  onBack,
  onNavigateToHome,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('masterclass');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'masterclass':
        return <EFIMasterclassContent />;
      case 'scope':
        return <EFIScopeContent />;
      case 'papers':
        return <PapersCertificationsContent />;
      default:
        return <EFIMasterclassContent />;
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="EFI Training Programs"
        onBack={onBack}
        onNavigateToHome={onNavigateToHome}
        onMenuItemPress={(id: any) => console.log('Menu:', id)}
      />

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

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderTabContent()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  scrollView: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    flexGrow: 1,
  },
});

export default EFITrainingPrograms;


