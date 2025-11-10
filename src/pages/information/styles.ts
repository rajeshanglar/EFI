import { StyleSheet } from 'react-native';
import {
  colors,
  spacing,
  borderRadius,
  Fonts,
} from '../../styles/globalStyles';

export const informationStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  yellowBar: {
    height: 8,
    backgroundColor: colors.primaryLight,
    width: '100%',
  },
  contentScroll: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.xl,
  },
  section: {
    gap: spacing.md,
  },
  highlightCard: {
    backgroundColor: '#FFF9D6',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    gap: spacing.sm,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  highlightTitle: {
    fontSize: 16,
    fontFamily: Fonts.SemiBold,
    color: colors.primary,
  },
  glossaryList: {
    gap: spacing.md,
  },
  glossaryCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    flexDirection: 'row',
    gap: spacing.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  letterBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
  },
  letterText: {
    fontSize: 20,
    fontFamily: Fonts.Bold,
    color: colors.primary,
  },
  glossaryEntries: {
    flex: 1,
    gap: spacing.sm,
  },
  entryBlock: {
    gap: spacing.xs,
  },
  entryPoints: {
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  entryTitle: {
    fontSize: 16,
    fontFamily: Fonts.SemiBold,
    color: colors.primary,
  },
  entryDescription: {
    fontSize: 14,
    fontFamily: Fonts.Regular,
    color: colors.darkGray,
    lineHeight: 22,
  },
  faqContainer: {
    gap: spacing.md,
  },
  faqCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  faqCardActive: {
    backgroundColor: '#EBF1FF',
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  faqQuestion: {
    flex: 1,
    fontSize: 16,
    fontFamily: Fonts.Medium,
    color: colors.primary,
  },
  faqQuestionActive: {
    fontFamily: Fonts.Bold,
  },
  faqToggle: {
    fontSize: 22,
    fontFamily: Fonts.Bold,
    color: colors.primary,
  },
  faqAnswer: {
    marginTop: spacing.sm,
    fontSize: 14,
    fontFamily: Fonts.Regular,
    color: colors.darkGray,
    lineHeight: 22,
  },
  paperList: {
    gap: spacing.md,
  },
  paperCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    gap: spacing.xs,
  },
  paperTitle: {
    fontSize: 16,
    fontFamily: Fonts.SemiBold,
    color: colors.primary,
  },
  paperDescription: {
    fontSize: 14,
    fontFamily: Fonts.Regular,
    color: colors.darkGray,
    lineHeight: 22,
  },
});


