import React, { useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import Header from '../../components/Header';
import globalStyles, { colors, spacing } from '../../styles/globalStyles';
import { EndoAimContent } from './EndoAimContent';
import { EndoHopeContent } from './EndoHopeContent';
import { EndoWiseContent } from './EndoWiseContent';

interface EFIOutreachProgramsProps {
  onBack: () => void;
  onNavigateToHome: () => void;
}

type TabKey = 'endoAim' | 'endoHope' | 'endoWise';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'endoAim', label: 'Endo AIM' },
  { key: 'endoHope', label: 'Endo HOPE' },
  { key: 'endoWise', label: 'Endo WISE' },
];

const tabContentMap: Record<TabKey, any> = {
  endoAim: EndoAimContent,
  endoHope: EndoHopeContent,
  endoWise: EndoWiseContent,
};

const EFIOutreachPrograms: React.FC<EFIOutreachProgramsProps> = ({
  onBack,
  onNavigateToHome,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('endoAim');

  const Content = useMemo(() => tabContentMap[activeTab], [activeTab]);

  return (
    <View style={styles.container}>
      <Header
        title="EFI Outreach Programs"
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
      <View style={styles.bgColor}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Content />
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    position: 'relative',
  },
  scrollView: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    paddingBottom: spacing.xl,

    zIndex: 2,
  },
  bgColor: {
    backgroundColor: '#fff',
    marginTop: 0,
    flex: 1,
  },
});

export default EFIOutreachPrograms;

