import { Dimensions, StyleSheet } from 'react-native';
import {
  borderRadius,
  colors,
  Fonts,
  spacing,
} from '../../styles/globalStyles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    flex: 1,
  },
  LoginHeader: {
    backgroundColor: colors.primary,
    paddingTop: spacing.sm,
    paddingBottom: 0,
    marginBottom: 0,
    position: 'relative',
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
  },
  LoginLogoContainer: {
    alignItems: 'center',
    paddingTop: spacing.sm,
  },
  logo: {
    width: Dimensions.get('window').width * 0.9,
    height: Dimensions.get('window').height * 0.085,
    marginBottom: spacing.sm,
  },

  homeBackButtonImgContainer: {
    position: 'relative',
    marginTop: spacing.sm,
    marginBottom: 0,
    paddingBottom: 0,
  },

  homeBackButton: {
    position: 'absolute',
    bottom: 0,
    left: -13,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.sm,
  },

  backButtonText: {
    color: colors.primaryLight,
    fontSize: Dimensions.get('window').width * 0.028,
    fontFamily: Fonts.SemiBold,
    letterSpacing: 1,
    marginLeft: spacing.sm,
  },

  floatingIconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
    marginBottom: -50,
  },

  floatingImgBlock: {
    width: Dimensions.get('window').width * 0.28,
    height: Dimensions.get('window').height * 0.12,
    backgroundColor: colors.white,
    borderTopRightRadius: borderRadius.xl,
    borderTopLeftRadius: borderRadius.xl,
    justifyContent: 'flex-start',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  floatingimg: {
    width: Dimensions.get('window').width * 0.9,
    height: Dimensions.get('window').height * 0.1,
  },

  loginCardContainer: {
    backgroundColor: colors.white,
    padding: spacing.lg,
  },

  loginCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,

    padding: spacing.md,
    marginTop: spacing.md,

    minHeight: Dimensions.get('window').height * 0.5,
    position: 'relative',
    shadowColor: colors.gray,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  ribbonContainer: {
    position: 'absolute',
    top: -52,
    right: -40,
    overflow: 'hidden',
  },
  ribbonImage: {
    width: Dimensions.get('window').width * 0.25,
    height: Dimensions.get('window').height * 0.09,
  },
  welcomeTitle: {
    fontSize: Dimensions.get('window').width * 0.05,
    color: colors.black,
    fontFamily: Fonts.Bold,
    marginTop: Dimensions.get('window').height * 0.01,
    marginBottom: spacing.md,
  },

  loginTypeContainer: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.gray,
    marginRight: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.white,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primaryLight,
    borderColor: '#EFD603',
    borderWidth: 1,
  },
  radioText: {
    fontSize: Dimensions.get('window').width * 0.037,
    color: colors.black,
    fontFamily: Fonts.Medium,
  },

  mainInputContainer: {
    marginBottom: spacing.md,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: colors.gray,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm,
    marginBottom: 6,
  },

  input: {
    flex: 1,
    fontSize: Dimensions.get('window').width * 0.04,
    fontFamily: Fonts.Regular,
    color: colors.black,
    paddingVertical: spacing.sm,
    marginLeft: spacing.sm,
  },
  passwordInput: {
    marginRight: spacing.md,
  },
  forgotButton: {
    padding: spacing.xs,
  },
  forgotText: {
    color: colors.blue,
    fontSize: Dimensions.get('window').width * 0.037,
    fontFamily: Fonts.SemiBold,
  },
  captchaContainer: {
    backgroundColor: '#FFFBE7',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#9A8A5B',
    borderRadius: 4,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  captchaBox: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    marginRight: spacing.sm,
  },
  captchaText: {
    fontSize: Dimensions.get('window').width * 0.05,
    color: colors.primary,
    fontFamily: Fonts.Bold,
    letterSpacing: 2,
  },
  captchaRefresh: {
    padding: spacing.xs,
    marginRight: spacing.sm,
  },
  captchaRefreshText: {
    fontSize: Dimensions.get('window').width * 0.07,
    color: colors.primary,
    fontFamily: Fonts.Bold,
  },
  captchaInput: {
    flex: 1,
    fontSize: Dimensions.get('window').width * 0.04,
    fontFamily: Fonts.Medium,
    color: colors.primary,
    backgroundColor: colors.white,
    borderColor: colors.gray,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: spacing.sm,
  },
  errorText: {
    color: colors.red,
    fontSize: Dimensions.get('window').width * 0.03,
    fontFamily: Fonts.Medium,
    marginLeft: spacing.sm,
  },
  loginButton: {
    borderRadius: 100,
    overflow: 'hidden',
    marginTop: 0,
    marginBottom: spacing.lg,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  loginButtonGradient: {
    paddingVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
    height: Dimensions.get('window').height * 0.04,
  },
  loginButtonText: {
    color: colors.white,
    fontSize: Dimensions.get('window').width * 0.05,
    height: Dimensions.get('window').height * 0.04,
    lineHeight: Dimensions.get('window').height * 0.04,
    fontFamily: Fonts.Bold,
    letterSpacing: 1,
    textAlign: 'center',
  },
});

export default styles;
