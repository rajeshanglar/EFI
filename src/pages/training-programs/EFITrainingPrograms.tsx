import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ImageBackground,
} from 'react-native';
import { Header } from '../../components/Header';
import GradientButton from '../../components/GradientButton';
import globalStyles, {
  colors,
  spacing,
  borderRadius,
  Fonts,
} from '../../styles/globalStyles';
import { EFIMasterclassContent } from './EFIMasterclass';
import { EFIScopeContent } from './EFIScope';
import { PapersCertificationsContent } from './PapersCertifications';

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

const tabContentMap: Record<TabKey, any> = {
  masterclass: EFIMasterclassContent,
  scope: EFIScopeContent,
  papers: PapersCertificationsContent,
};

const EFITrainingPrograms: React.FC<TrainingProgramsProps> = ({
  onBack,
  onNavigateToHome,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('masterclass');

  const content = useMemo(() => tabContentMap[activeTab], [activeTab]);

  return (
    <View style={styles.container}>
      <Header
        title="EFI Training Programs"
        onBack={onBack}
        onNavigateToHome={onNavigateToHome}
      />

        <View style={globalStyles.tierTabs}>
            {tabs.map(tab => {
              const active = tab.key === activeTab;
              return (
                <TouchableOpacity                
                  key={tab.key}
                  style={[ globalStyles.tierTab, active && globalStyles.tierTabActive]}
                  onPress={() => setActiveTab(tab.key)}
                  activeOpacity={0.85}
                >
                  <Text
                    style={[globalStyles.tierTabText, active && globalStyles.tierTabTextActive]}
                  >
                    {tab.label}
                  </Text>              
                </TouchableOpacity>
              );
            })}
          </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

        <View style={styles.contentSection}>
          <Text style={styles.contentTitle}>{content.title}</Text>

          {(content.description || []).map((paragraph: string, index: number) => (
            <Text key={index} style={styles.paragraph}>
              {paragraph}
            </Text>
          ))}

          {content.feeTitle && (
            <View style={styles.sectionCardYellow}>
              <Text style={styles.sectionHeading}>{content.feeTitle}</Text>
              {content.feeSubtitle && (
                <Text style={styles.sectionSubheading}>{content.feeSubtitle}</Text>
              )}
              {(content.fees || []).map((fee: any) => (
                <View key={fee.label} style={styles.feeRow}>
                  <Text style={styles.feeLabel}>{fee.label}</Text>
                  <Text style={styles.feeAmount}>{fee.amount}</Text>
                  {fee.note && <Text style={styles.feeNote}>{fee.note}</Text>}
                </View>
              ))}
            </View>
          )}

          {content.highlightsTitle && (
            <View style={styles.sectionCardYellow}>
              <Text style={styles.sectionHeading}>{content.highlightsTitle}</Text>
              {(content.highlights || []).map((item: string, index: number) => (
                <View key={index} style={styles.bulletRow}>
                  <View style={styles.bulletDot} />
                  <Text style={styles.bulletText}>{item}</Text>
                </View>
              ))}
            </View>
          )}

          {content.closing && (
            <Text style={styles.paragraph}>{content.closing}</Text>
          )}

          {content.whyTitle && (
            <View style={styles.sectionCardBlue}>
              <Text style={styles.sectionHeadingLight}>{content.whyTitle}</Text>
              {(content.whyPoints || []).map((item: string, index: number) => (
                <View key={index} style={styles.bulletRowLight}>
                  <View style={styles.bulletDotAccent} />
                  <Text style={styles.bulletTextLight}>{item}</Text>
                </View>
              ))}
            </View>
          )}

          {content.courseCostTitle && (
            <View style={styles.sectionCardYellow}>
              <Text style={styles.sectionHeading}>{content.courseCostTitle}</Text>
              {(content.courseCostGroups || []).map((group: any) => (
                <View key={group.title} style={styles.costGroup}>
                  <Text style={styles.costGroupTitle}>{group.title}</Text>
                  {(group.rows || []).map((row: any) => (
                    <View key={row.label} style={styles.costRow}>
                      <Text style={styles.costLabel}>{row.label}</Text>
                      <Text style={styles.costAmount}>{row.amount}</Text>
                    </View>
                  ))}
                </View>
              ))}
              {content.courseCostNote && (
                <Text style={styles.costNote}>{content.courseCostNote}</Text>
              )}
            </View>
          )}

          {content.programDetails && (
            <View style={styles.sectionCardBlue}>
              <Text style={styles.sectionHeadingLight}>Program Details</Text>

              {content.programDetails.duration && (
                <Text style={styles.detailTag}>
                  Duration: {content.programDetails.duration}
                </Text>
              )}

              {(content.programDetails.format || []).length > 0 && (
                <View style={styles.detailBlock}>
                  <Text style={styles.detailHeading}>Format</Text>
                  {(content.programDetails.format || []).map(
                    (item: string, index: number) => (
                      <View key={index} style={styles.bulletRowLight}>
                        <View style={styles.bulletDotAccent} />
                        <Text style={styles.bulletTextLight}>{item}</Text>
                      </View>
                    ),
                  )}
                </View>
              )}

              {(content.programDetails.outcomes || []).length > 0 && (
                <View style={styles.detailBlock}>
                  <Text style={styles.detailHeading}>Key Learning Outcomes</Text>
                  {(content.programDetails.outcomes || []).map(
                    (item: string, index: number) => (
                      <View key={index} style={styles.bulletRowLight}>
                        <View style={styles.bulletDotAccent} />
                        <Text style={styles.bulletTextLight}>{item}</Text>
                      </View>
                    ),
                  )}
                </View>
              )}

              {(content.programDetails.eligibility || []).length > 0 && (
                <View style={styles.detailBlock}>
                  <Text style={styles.detailHeading}>Eligibility Criteria</Text>
                  {(content.programDetails.eligibility || []).map(
                    (item: string, index: number) => (
                      <View key={index} style={styles.bulletRowLight}>
                        <View style={styles.bulletDotAccent} />
                        <Text style={styles.bulletTextLight}>{item}</Text>
                      </View>
                    ),
                  )}
                </View>
              )}

              {content.programDetails.invitation && (
                <Text style={styles.bulletTextLight}>
                  {content.programDetails.invitation}
                </Text>
              )}
            </View>
          )}
        </View>
      </ScrollView>

  
    </View>
  );
};

const styles = StyleSheet.create<{ [key: string]: any }>({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  scrollView: {
    flex: 1,
    backgroundColor: colors.white,
  },
  tabsContainer: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  tabsWave: {
    resizeMode: 'cover',
    opacity: 0.15,
  },
  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    marginHorizontal: spacing.xs,
  },
  tabButtonActive: {},
  tabText: {
    fontSize: spacing.md,
    fontFamily: Fonts.Medium,
    color: colors.white,
  },
  tabTextActive: {
    color: colors.black,
    fontFamily: Fonts.Bold,
  },
  tabIndicator: {
    marginTop: spacing.xs,
    width: '60%',
    height: 4,
    borderRadius: 4,
    backgroundColor: colors.accent,
  },
  heroImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  contentSection: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  contentTitle: {
    fontSize: spacing.xl,
    fontFamily: Fonts.Bold,
    color: colors.black,
  },
  paragraph: {
    fontSize: spacing.md,
    fontFamily: Fonts.Regular,
    color: colors.darkGray,
    lineHeight: spacing.xl,
  },
  sectionCardYellow: {
    backgroundColor: colors.lightYellow,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  sectionHeading: {
    fontSize: spacing.lg,
    fontFamily: Fonts.Bold,
    color: colors.black,
  },
  sectionSubheading: {
    fontSize: spacing.md,
    fontFamily: Fonts.Medium,
    color: colors.darkGray,
  },
  feeRow: {
    gap: spacing.xs,
  },
  feeLabel: {
    fontSize: spacing.md,
    fontFamily: Fonts.Medium,
    color: colors.black,
  },
  feeAmount: {
    fontSize: spacing.lg,
    fontFamily: Fonts.Bold,
    color: colors.black,
  },
  feeNote: {
    fontSize: spacing.sm,
    fontFamily: Fonts.Regular,
    color: colors.darkGray,
  },
  sectionCardBlue: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    gap: spacing.md,
  },
  sectionHeadingLight: {
    fontSize: spacing.lg,
    fontFamily: Fonts.Bold,
    color: colors.white,
  },
  bulletRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  bulletDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.accent,
    marginTop: spacing.xs,
  },
  bulletText: {
    flex: 1,
    fontSize: spacing.md,
    fontFamily: Fonts.Regular,
    color: colors.darkGray,
    lineHeight: spacing.xl,
  },
  bulletRowLight: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  bulletDotAccent: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.accent,
    marginTop: spacing.xs,
  },
  bulletTextLight: {
    flex: 1,
    fontSize: spacing.md,
    fontFamily: Fonts.Regular,
    color: colors.white,
    lineHeight: spacing.xl,
  },
  costGroup: {
    gap: spacing.xs,
  },
  costGroupTitle: {
    fontSize: spacing.md,
    fontFamily: Fonts.Bold,
    color: colors.black,
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  costLabel: {
    fontSize: spacing.md,
    fontFamily: Fonts.Medium,
    color: colors.black,
  },
  costAmount: {
    fontSize: spacing.md,
    fontFamily: Fonts.Bold,
    color: colors.black,
  },
  costNote: {
    fontSize: spacing.sm,
    fontFamily: Fonts.Regular,
    color: colors.darkGray,
  },
  detailTag: {
    alignSelf: 'flex-start',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.round,
    backgroundColor: colors.accent,
    fontSize: spacing.sm,
    fontFamily: Fonts.Bold,
    color: colors.black,
  },
  detailBlock: {
    gap: spacing.sm,
  },
  detailHeading: {
    fontSize: spacing.md,
    fontFamily: Fonts.Bold,
    color: colors.white,
  },
  footer: {
    padding: spacing.lg,
    backgroundColor: colors.white,
  },
});

export default EFITrainingPrograms;


