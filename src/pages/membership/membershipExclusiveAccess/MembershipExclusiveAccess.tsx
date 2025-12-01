import React, { useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import Header from '../../../components/Header';
import globalStyles, { colors, spacing } from '../../../styles/globalStyles';
import { VideosContent } from './VideosContent';
import { DocumentsContent } from './DocumentsContent';

interface MembershipExclusiveAccessProps {
  onBack: () => void;
  onNavigateToHome: () => void;
  onVideoPress?: (videoId: string) => void;
  onDocumentPress?: (documentId: string) => void;
}

type TabKey = 'videos' | 'documents';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'videos', label: 'Videos' },
  // { key: 'documents', label: 'Documents' },
];

const tabContentMap: Record<TabKey, any> = {
  videos: VideosContent,
  documents: DocumentsContent,
};

const MembershipExclusiveAccess: React.FC<MembershipExclusiveAccessProps> = ({
  onBack,
  onNavigateToHome,
  onVideoPress,
  onDocumentPress,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('videos');

  const Content = useMemo(() => tabContentMap[activeTab], [activeTab]);

  return (
    <View style={styles.container}>
      <Header
        title="Membership Exclusive Access"
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
        <Content 
          onVideoPress={onVideoPress}
          onDocumentPress={onDocumentPress}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  yellowBar: {
    height: 8,
    backgroundColor: colors.primaryLight,
    width: '100%',
  },
  contentContainer: {
    flex: 1,
    marginTop: spacing.md,
  },
    });

export default MembershipExclusiveAccess;

