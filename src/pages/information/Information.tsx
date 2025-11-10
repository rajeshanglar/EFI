import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Header } from '../../components/Header';
import globalStyles from '../../styles/globalStyles';
import { informationStyles as styles } from './styles';
import AZEndometriosisContent from './components/AZEndometriosisContent';
import FaqsContent from './components/FaqsContent';
import PublishedPapersContent from './components/PublishedPapersContent';

type InformationTab = 'glossary' | 'faqs' | 'papers';

interface InformationProps {
  onBack: () => void;
  onNavigateToHome: () => void;
}

const tabs: { key: InformationTab; label: string }[] = [
  { key: 'glossary', label: 'A–Z of Endometriosis' },
  { key: 'faqs', label: 'FAQs' },
  { key: 'papers', label: 'Published Papers' },
];

const tabComponents: Record<InformationTab, React.ComponentType> = {
  glossary: AZEndometriosisContent,
  faqs: FaqsContent,
  papers: PublishedPapersContent,
};

const Information: React.FC<InformationProps> = ({
  onBack,
  onNavigateToHome,
}) => {
  const [activeTab, setActiveTab] = useState<InformationTab>('glossary');
  const TabContent = useMemo(
    () => tabComponents[activeTab],
    [activeTab],
  );

  return (
    <View style={styles.container}>
      <Header
        title="Information"
        onBack={onBack}
        onNavigateToHome={onNavigateToHome}
      />

      <View style={globalStyles.tierTabs}>
        {tabs.map(tab => {
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

      <View style={styles.yellowBar} />

      <ScrollView
        style={styles.contentScroll}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <TabContent />
      </ScrollView>
    </View>
  );
};

export default Information;


