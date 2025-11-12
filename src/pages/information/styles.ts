import { Dimensions, StyleSheet } from 'react-native';
const { width: screenWidth } = Dimensions.get('window');
import {
  colors,
  spacing,
  borderRadius,
  Fonts,
} from '../../styles/globalStyles';

export const informationStyles = StyleSheet.create({
  screenWidth: {
    width: screenWidth,
  },
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
  azList: {
    gap: spacing.md,
  },
  bulletDotAccent: {
    width: 14,
    height: 14,
    borderRadius: 100,
    backgroundColor: colors.accent,
    marginTop: 8,
  },

  bulletDot: {
    width: 14,
    height: 14,
    borderRadius: 100,
    backgroundColor: colors.accent,
    marginTop: spacing.xs,
  },
  bulletText:{
    fontSize:screenWidth * 0.037,
    fontFamily: Fonts.Regular,
    color: colors.darkGray,
    lineHeight:screenWidth * 0.058,
    paddingRight: screenWidth * 0.06,
  },

  azCard: {
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
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft:screenWidth * -0.06,
  },
  letterText: {
    fontSize: 20,
    lineHeight: 40,
    fontFamily: Fonts.Bold,
    color: colors.primaryLight,
  },
  azEntries: {
    flex: 1,
    gap: spacing.md,
  },
  entryBlock: {
    gap: spacing.xs,
  },
  entryPoints: {
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  entryTitle: {
    fontSize:screenWidth * 0.04,
    fontFamily: Fonts.SemiBold,
    color: colors.primary,
  },
  entryDescription: {
    fontSize:screenWidth * 0.037,
    fontFamily: Fonts.Regular,
    color: colors.darkGray,
    lineHeight:screenWidth * 0.058,
    paddingRight: screenWidth * 0.06,

  },
  faqContainer: {
    gap: spacing.md,
  },
  faqCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.sm,
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
    fontSize: screenWidth * 0.04,
    fontFamily: Fonts.Medium,
    color: colors.primary,
  },
  faqQuestionActive: {
    fontFamily: Fonts.Bold,
  },
  faqToggle: {
    fontSize: screenWidth * 0.048,
    fontFamily: Fonts.Bold,
    color: colors.primary,
  },
  faqAnswerContainer: {
    marginTop: spacing.sm,
    paddingBottom: screenWidth * 0.03,
    paddingRight: screenWidth * 0.01,
    gap: spacing.sm,
  },
  faqAnswer: {
    fontSize: screenWidth * 0.037,
    fontFamily: Fonts.Regular,
    color: colors.darkGray,
    lineHeight: screenWidth * 0.058,
  },
  faqPointsList: {
    gap: spacing.md,
  },
  faqPointsHeading: {
    fontSize: screenWidth * 0.04,
    fontFamily: Fonts.SemiBold,
    color: colors.primary,
    marginBottom:0,
    marginTop: spacing.md,
  },
  faqPointItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    width: '97%',
  },
  faqPointBullet: {
    fontSize: screenWidth * 0.036,
    lineHeight: 18,
    color: colors.primary,
  },
  faqPointText: {
    fontSize:screenWidth * 0.039,
    fontFamily: Fonts.Regular,
    color: colors.primary,
    lineHeight:screenWidth * 0.058,
    paddingLeft: screenWidth * 0.01,
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


