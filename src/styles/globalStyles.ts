import { Dimensions, StyleSheet } from 'react-native';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
// Color palette based on the UI design
export const colors = {
  primary: '#08265D', // Dark blue
  primaryLight: '#FFE610', // Slightly lighter blue
  accent: '#ffeb3b', // Yellow
  white: '#ffffff',
  black: '#000000',
  gray: '#9e9e9e',
  lightGray: '#EDF3FF',
  darkGray: '#424242',
  red: '#f44336',
  transparent: 'transparent',
  blue: '#245BBC',
  lightYellow: '#FFFBEE',
};

export const Fonts = {
  Regular: 'Poppins-Regular',
  Medium: 'Poppins-Medium',
  SemiBold: 'Poppins-SemiBold',
  Bold: 'Poppins-Bold',
};

// Typography with Poppins fonts
export const typography = {
   caption: {
    fontSize: 14,
    fontWeight: '400' as const,
    fontFamily: 'Poppins-Regular',
    color: colors.white,
  },
  small: {
    fontSize: 12,
    fontWeight: '400' as const,
    fontFamily: 'Poppins-Regular',
    color: colors.white,
  },
  medium: {
    fontSize: 16,
    fontWeight: '500' as const,
    fontFamily: 'Poppins-Medium',
    color: colors.white,
  },
  light: {
    fontSize: 16,
    fontWeight: '300' as const,
    fontFamily: 'Poppins-Light',
    color: colors.white,
  },
};

// Spacing
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Border radius
export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  round: 50,
};

// Global styles
export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  card: {
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginVertical: spacing.sm,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  button: {
    backgroundColor: colors.accent,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  circularButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.gray,
  },

  notificationContainer: {
    position: 'relative',
  },

  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor:'#FF762F',
    borderRadius: 10,
    width: 21,
    height: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationText: {
    color: colors.white,
    fontSize: Dimensions.get('window').width * 0.030,
    fontWeight: 700,
  },

  spaceBottom:{
    paddingBottom: 100,
  },
  scrollViewContent: {
    flex: 1,
  },

  //inner page header BackButton
  headerContainer: {
    paddingHorizontal:0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primary,
  },

  headerBackBtTittle:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  headerIcon:{
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle:{
    color: colors.white,
    fontSize: Dimensions.get('window').width * 0.04,
    fontFamily: Fonts.SemiBold,
  },

  headerBottomContainer: {
    backgroundColor: colors.primary,
    paddingTop: 0,
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  HeaderBottomHeading: {
    color: colors.primaryLight,
    fontSize: screenWidth * 0.04,
    fontFamily: Fonts.Medium,
    textAlign: 'left',
  },


  //Tab Section Styles
  tierTabs: {
    flexDirection: 'row',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  tierTab: {
  marginRight:screenWidth*0.06,
    paddingVertical:0,
    alignItems: 'flex-start',
    borderBottomWidth: 5,
    borderBottomColor: 'transparent',
    borderRadius: 2,
  },
  tierTabActive: {
    borderBottomColor: colors.primary,
  },
  tierTabText: {
    color: '#254A8F',
    fontSize: screenWidth * 0.035,
    fontFamily: Fonts.Bold,
  },
  tierTabTextActive: {
    fontFamily: Fonts.Bold,
    color: colors.primary,
  },
  tierTabSubtext: {
    color: '#254A8F',
    fontSize: screenWidth * 0.03,
    fontFamily: Fonts.Medium,
    marginTop: 0,
  },
  tierTabSubtextActive: {
    fontFamily: Fonts.Medium,
    color: colors.primary,
  },

  //footer text with link
  footerPrimaryMain:{
    position: 'absolute',
    bottom: Dimensions.get('window').height * 0,
    left: 0,
    right: 0,

  },

footerPrimaryLinkContainer: {
  width: '100%',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign:'center',
  paddingTop:spacing.md,
  paddingBottom:spacing.md, 
    backgroundColor: colors.primary,

},
footerPrimaryText: {
  color: colors.white,
  fontSize: screenWidth * 0.035,
  fontFamily: Fonts.Regular,
  marginRight:spacing.sm,
},
footerPrimaryLinkText: {
  color: colors.primaryLight,
  fontSize: screenWidth * 0.035,
  fontFamily: Fonts.SemiBold,
  textDecorationLine: 'underline',
},



footerBtContainer: {
  position: 'absolute',
  bottom: Dimensions.get('window').height * 0,
  left: 0,
  right: 0,
  backgroundColor: colors.lightGray,
  paddingTop:Dimensions.get('window').height * 0.012,  
  paddingBottom:Dimensions.get('window').height * 0.012,
  shadowColor: colors.black,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.6,
  shadowRadius: 8,
  elevation: 12,
},

footerSubmitBt: {
  paddingVertical:0, 
},
footerBtGradient: {
 paddingVertical: spacing.sm,
 marginHorizontal:spacing.md,
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius:100,
},
footerBtIcon: {
 marginRight: spacing.sm,
},
footerBtText: {
  color: colors.white,
    fontSize: Dimensions.get('window').width * 0.043,  
    fontFamily: Fonts.Bold,   
    lineHeight: Dimensions.get('window').height * 0.04,
},



//form container Start
formContainer: {
  padding: spacing.md,
  paddingBottom: 120,
},
fieldContainer: {
  marginBottom: spacing.md,
},
fieldLabel: {
  fontSize: screenWidth * 0.037,
  fontFamily: Fonts.Medium,
  color: colors.black,
  marginBottom: spacing.xs,
},
fieldSubLabel: {
  fontSize: screenWidth * 0.028,
  fontFamily: Fonts.Regular,
  color: colors.gray,
},
fieldInput: {
  borderWidth: 1,
  borderColor: colors.gray,
  borderRadius: borderRadius.sm,
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.sm,
  fontSize: screenWidth * 0.038,
  fontFamily: Fonts.Regular,
  color: colors.black,
  backgroundColor: colors.white,
},
fieldInputError: {
  borderColor: colors.red,
},
fieldErrorText: {
  color: colors.red,
  fontSize: screenWidth * 0.03,
  fontFamily: Fonts.Regular,
  marginTop: spacing.xs,
},
fieldAmountContainer: {
  borderWidth: 1,
  borderColor: colors.gray,
  borderRadius: borderRadius.sm,
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.sm,
  backgroundColor: colors.lightGray,
},
fieldAmountText: {
  fontSize: screenWidth * 0.038,
  fontFamily: Fonts.Bold,
  color: colors.primary,
},
formCaptchaContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: spacing.sm,
},
formCaptchaCodeContainer: {
  borderWidth: 1,
  borderColor: colors.gray,
  borderStyle: 'dashed',
  borderRadius: borderRadius.sm,
  padding: spacing.sm,
  backgroundColor: colors.lightYellow,
  justifyContent: 'center',
  alignItems: 'center',
  minWidth: 100,
},
formCaptchaCode: {
  fontSize: screenWidth * 0.05,
  fontFamily: Fonts.Bold,
  color: colors.primary,
  letterSpacing: 2,
},
formCaptchaInput: {
  flex: 1,
  borderWidth: 1,
  borderColor: colors.gray,
  borderRadius: borderRadius.sm,
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.sm,
  fontSize: screenWidth * 0.038,
  fontFamily: Fonts.Regular,
  color: colors.black,
  backgroundColor: colors.white,
},
formRefreshButton: {
  width: 40,
  height: 48,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: colors.lightYellow,
  borderRadius: borderRadius.sm,
},

formRefreshIcon: {
  width: 20,
  height: 20,
},

//form container End


});

export default globalStyles;
