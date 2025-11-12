import React, { useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  ImageBackground,
  Dimensions,
} from 'react-native';

import Header from '../../components/Header';
import globalStyles, { colors, spacing } from '../../styles/globalStyles';
import { EFIBoardContent } from './EFIBoardContent';
import { AdvisoryBoardContent } from './AdvisoryBoardContent';
import { VoluntaryTeamContent } from './VoluntaryTeamContent';
import { BoardMemberModal, BoardMemberData } from '../../components/BoardMemberModal';

interface BoardProps {
  onBack: () => void;
  onNavigateToHome: () => void;
}

type TabKey = 'efiBoard' | 'advisoryBoard' | 'voluntaryTeam';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'efiBoard', label: 'EFI Board' },
  { key: 'advisoryBoard', label: 'Advisory Board' },
  { key: 'voluntaryTeam', label: 'Voluntary Team' },
];

const tabContentMap: Record<TabKey, any> = {
  efiBoard: EFIBoardContent,
  advisoryBoard: AdvisoryBoardContent,
  voluntaryTeam: VoluntaryTeamContent,
};

const Board: React.FC<BoardProps> = ({
  onBack,
  onNavigateToHome,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('efiBoard');
  const [selectedMember, setSelectedMember] = useState<BoardMemberData | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const Content = useMemo(() => tabContentMap[activeTab], [activeTab]);

  const handleMemberPress = (member: BoardMemberData) => {
    setSelectedMember(member);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedMember(null);
  };

  return (
    <View style={styles.container}>
      <Header
        title="Board"
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
        <Content onMemberPress={handleMemberPress} />
      </ScrollView>
      </View>

      {/* Member Modal */}
      <BoardMemberModal
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
    position: 'relative',
  },
  scrollView: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
    paddingTop: spacing.md,
    zIndex:2,

  },
  bgColor: { backgroundColor: '#fff', marginTop: 0, flex: 1},
  bgImage: { 
    width: Dimensions.get('window').width * 1.2,
    height: Dimensions.get('window').height * 0.48,
    resizeMode: 'cover',
    opacity: 0.15,
    zIndex: 0,
    flexGrow: 1,


  },
});

export default Board;

