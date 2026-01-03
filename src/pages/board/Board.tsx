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
import { GoverningCouncilMembersContent } from './GoverningCouncilMembersContent';
import { BoardMemberModal, BoardMemberData } from '../../components/BoardMemberModal';

interface BoardProps {
  onBack: () => void;
  onNavigateToHome: () => void;
}

type TabKey = 'efiBoard' | 'advisoryBoard' | 'youngTeam' | 'governingCouncil';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'efiBoard', label: 'EFI Board' },
  { key: 'advisoryBoard', label: 'Advisory Board' },
  { key: 'youngTeam', label: 'Young Team' },
 { key: 'governingCouncil', label: 'Governing Council Members' },
];

const tabContentMap: Record<TabKey, any> = {
  efiBoard: EFIBoardContent,
  advisoryBoard: AdvisoryBoardContent,
  youngTeam: VoluntaryTeamContent,
  governingCouncil: GoverningCouncilMembersContent,
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
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsScrollView}
        contentContainerStyle={[globalStyles.tierTabs, styles.tabsContentContainer]}
      >
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
                  styles.tabLabel,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

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
  bgColor: { backgroundColor: '#fff',
     marginTop: 0, 
     flex: 1,
  },

  tabLabel: {
    textAlign: 'center',
  },
  tabsScrollView: {
flex: 1,
height: Dimensions.get('window').height * 0.06,
overflow: 'hidden',
position: 'absolute',
top: 0,
left: 0,
right: 0,
bottom: 0,
zIndex: 1,
  },
  tabsContentContainer: {
    paddingRight: spacing.md,

  },
});

export default Board;

