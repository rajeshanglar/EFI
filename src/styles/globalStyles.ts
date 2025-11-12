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
    backgroundColor: '#FF762F',
    borderRadius: 10,
    width: 21,
    height: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationText: {
    color: colors.white,
    fontSize: Dimensions.get('window').width * 0.03,
    fontWeight: 700,
  },

  spaceBottom: {
    paddingBottom: 100,
  },
  scrollViewContent: {
    flex: 1,
  },

  //inner page header BackButton
  headerContainer: {
    paddingHorizontal: 0,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    paddingBottom: spacing.md,
    backgroundColor: colors.primary,
    // borderBottomLeftRadius: borderRadius.xl,
    // borderBottomRightRadius: borderRadius.xl,
  },

  headerBackBtTittle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIcon: {
    width:22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: colors.white,
    fontSize: Dimensions.get('window').width * 0.04,
    fontFamily: Fonts.SemiBold,
    marginLeft: spacing.sm,
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
    marginRight: screenWidth * 0.06,
    paddingVertical:5,
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
  footerPrimaryMain: {
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
    textAlign: 'center',
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    backgroundColor: colors.primary,
  },
  footerPrimaryText: {
    color: colors.white,
    fontSize: screenWidth * 0.035,
    fontFamily: Fonts.Regular,
    marginRight: spacing.sm,
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
    paddingTop: Dimensions.get('window').height * 0.012,
    paddingBottom: Dimensions.get('window').height * 0.012,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 12,
  },

  footerSubmitBt: {
    paddingVertical: 0,
  },
  footerBtGradient: {
    paddingVertical: spacing.sm,
    marginHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
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
    flexGrow: 1,
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
  dateInput: {

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
  formCaptchaCodeContainer: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    marginRight: spacing.sm,
  },
  formCaptchaCode: {
    fontSize: screenWidth * 0.05,
    fontFamily: Fonts.Bold,
    color: '#84670D',
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

  // Wave Background
  imgBgContainerWave: {
    backgroundColor: colors.primary,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.md,
    borderBottomLeftRadius: borderRadius.lg,
    borderBottomRightRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  imgBgWave: {
    opacity: 0.3,
    resizeMode: 'cover',
  },
  // Wave Background End

  // Date Tabs Styles
  // DATE TABS START
dateTabsContainer: {
  flexDirection: 'row',
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.sm,
  gap: spacing.md,
},
dateTab: {
  paddingVertical: spacing.sm,
  paddingHorizontal: spacing.sm,
  borderRadius: borderRadius.round,
  backgroundColor: colors.white,
  alignItems: 'center',
  justifyContent: 'center',
  shadowColor: colors.black,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
  width:Dimensions.get('window').width * 0.15,
  lineHeight: screenWidth * 1,
},
dateTabActive: {
  backgroundColor: colors.primaryLight,
},
dateTabMonth: {
  fontSize: screenWidth * 0.035,
  fontFamily: Fonts.Medium,
  color: colors.darkGray,
lineHeight: screenWidth * 0.06,
},
dateTabMonthActive: {
  color: colors.darkGray,
},
dateTabDay: {
  fontSize: screenWidth * 0.05,
  fontFamily: Fonts.Bold,
  color: colors.darkGray,
lineHeight: screenWidth * 0.06,
},
dateTabDayActive: {
  color: colors.primary,
  fontSize: screenWidth * 0.05,
},
dateTabDayName: {
  fontSize: screenWidth * 0.035,
  fontFamily: Fonts.Medium,
  color: colors.darkGray,
},
dateTabDayNameActive: {
  color: colors.darkGray,
},

  // Date Tabs Styles End

   // Conference List Styles
  section: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: screenWidth * 0.042,
    fontFamily: Fonts.Bold,
    color: colors.black,
    marginBottom: spacing.md,
  },
  timeSlotContainer: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
    shadowColor: colors.gray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.lightGray,
    overflow: 'hidden',
    
  },
  timeBlock: {
    width: screenWidth * 0.25,
    backgroundColor: colors.primaryLight,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm,
    marginRight: spacing.md,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  timeBlockContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeBlockText: {
    fontSize: screenWidth * 0.033,
    fontFamily: Fonts.Bold,
    color: colors.black,
    textAlign: 'center',
    lineHeight: screenWidth * 0.04,
  },
  timeBlockSeparator: {
    fontSize: screenWidth * 0.038,
    fontFamily: Fonts.Medium,
    color: colors.black,
    textAlign: 'center',
  
  },
  eventsContainer: {
    flex: 1,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md, 
    paddingRight: spacing.md, 
  
  },
  eventItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  eventContent: {
    flex: 1,
  
    alignItems: 'flex-start',
    flexWrap: 'wrap',
},
eventHall: {
  fontSize: screenWidth * 0.035,
  fontFamily: Fonts.Regular,
  color: colors.black,
},
eventTitle: {
  fontSize: screenWidth * 0.035,
  fontFamily: Fonts.Bold,
  color: colors.black,
  flex: 1,
},
eventTitleNoHall: {
  fontSize: screenWidth * 0.035,
  fontFamily: Fonts.Bold,
  color: colors.black,
},
eventArrow: {
  marginLeft: spacing.sm,
},

  // Conference List Styles End

  //Session Details Styles
metadataCard: {
  marginHorizontal: spacing.md,
  marginTop:0, 
},
metadataRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: spacing.md,
},
iconContainer: {
  marginRight: spacing.sm,
},
calendarIcon: {
  width: 32,
  height: 32,
  borderRadius: borderRadius.md,
  backgroundColor: colors.primaryLight,
  justifyContent: 'center',
  alignItems: 'center',
},
dateText: {
  fontSize: screenWidth * 0.04,
  fontFamily: Fonts.Bold,
  color: colors.primaryLight,
},
metadataInfoRow: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: spacing.sm,
},
metadataInfoItem: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: spacing.xs,
},
iconText: {
  fontSize: screenWidth * 0.04,
},
metadataText: {
  fontSize: screenWidth * 0.033,
  fontFamily: Fonts.Medium,
  color: colors.white,
},
contentContainer: {
  padding: spacing.lg,
  paddingBottom: 100,
},
actionsSection: {
  marginTop: spacing.xl,
  marginBottom: spacing.lg,
},
actionsSectionTitle: {
  fontSize: screenWidth * 0.042,
  fontFamily: Fonts.Bold,
  color: colors.black,
  marginBottom: spacing.md,
},
actionButton: {
  backgroundColor: colors.accent,
  borderRadius: borderRadius.sm,
  padding: spacing.md,
  marginBottom:Dimensions.get('window').height * 0.02,
  shadowColor: colors.black,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
},
actionButtonContent: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
},
actionIconContainer: {
  width: 40,
  height: 40,
  borderRadius: borderRadius.round,
  backgroundColor: colors.white,
  justifyContent: 'center',
  alignItems: 'center',
},
actionButtonText: {
  flex: 1,
  fontSize: screenWidth * 0.038,
  fontFamily: Fonts.Bold,
  color: colors.black,
  marginLeft: spacing.md,
},
sessionTitle: {
  fontSize: screenWidth * 0.044,
  fontFamily: Fonts.Bold,
  color: colors.black,

},
sessionSubtitle: {
  fontSize: screenWidth * 0.04,
  fontFamily: Fonts.Regular,
  color: colors.black,
  marginBottom: spacing.md,
},
themeContainer: {
  marginBottom: spacing.md,
},
sectionLabel: {
  fontSize: screenWidth * 0.04,
  fontFamily: Fonts.Bold,
  color: colors.black,
  marginBottom: 0,
},
themeText: {
  fontSize: screenWidth * 0.038,
  fontFamily: Fonts.Regular,
  color: colors.black,
  lineHeight: screenWidth * 0.055,
},
overviewContainer: {
  marginBottom: spacing.lg,
},
overviewText: {
  fontSize: screenWidth * 0.037,
  fontFamily: Fonts.Regular,
  color: colors.black,
  lineHeight: screenWidth * 0.055,
  marginTop: spacing.sm,
},
imageContainer: {
  marginTop: spacing.sm,
  alignItems: 'flex-start',
  justifyContent: 'center',
},
previewImage: {
  width: Dimensions.get('window').width * 0.7,
  height: Dimensions.get('window').height * 0.2,
  resizeMode: 'cover',
},

moreDetailsText: {
  fontSize: screenWidth * 0.04,
  fontFamily: Fonts.Medium,
  color: colors.blue,
  textAlign: 'center',
  marginTop: spacing.sm,
  textDecorationLine: 'underline',
},
bottomActionBar: {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: colors.primaryLight,
  paddingVertical: spacing.md,
  paddingHorizontal: spacing.lg,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  shadowColor: colors.black,
  shadowOffset: { width: 0, height: -2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 5,
},
addButtonContainer: {
  flex: 1,
},
addButtonText: {
  fontSize: screenWidth * 0.04,
  fontFamily: Fonts.Bold,
  color: colors.black,
},
statusContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: spacing.md,
},
checkmarkIcon: {
  width: 28,
  height: 28,
  borderRadius: 14,
  backgroundColor: colors.blue,
  justifyContent: 'center',
  alignItems: 'center',
},
removeText: {
  fontSize: screenWidth * 0.037,
  fontFamily: Fonts.Medium,
  color: colors.red,
},
removeButton: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
},
removeButtonText: {
  fontSize: screenWidth * 0.04,
  fontFamily: Fonts.Bold,
  color: colors.black,
},
//session details styles END

 // Information Modal Styles
 modalInfoOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  justifyContent: 'flex-end',
  alignItems: 'center',
},
modalInfoContainer: {
  width: '94%',
  maxHeight: '95%',
  backgroundColor: colors.white,
  borderRadius: borderRadius.lg,
  overflow: 'hidden',
},
modalInfoHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: spacing.md,
  paddingBottom: 0,
},
modalInfoTitle: {
  fontSize: screenWidth * 0.045,
  fontFamily: Fonts.Bold,
  color: colors.black,
},

modalInfoSubtitle:{
  fontSize: screenWidth * 0.035,
  fontFamily: Fonts.SemiBold,
  color: colors.black,
  marginBottom: spacing.sm,
},
modalInfoCloseButton: {
  width: 32,
  height: 32,
  borderRadius: 16,
  backgroundColor: colors.primaryLight,
  justifyContent: 'center',
  alignItems: 'center',
},
modalInfoCloseText: {
  fontSize: 20,
  fontFamily: Fonts.Bold,
  color: colors.black,
},
modalInfoContent: {
  padding: spacing.lg,
},
modalInfoSection: {
  marginBottom: spacing.lg,
},
modalInfoSectionTitle: {
  fontSize: screenWidth * 0.04,
  fontFamily: Fonts.Bold,
  color: colors.blue,
  marginBottom: spacing.sm,
},
modalInfoListItem: {
  fontSize: screenWidth * 0.037,
  fontFamily: Fonts.Regular,
  color: colors.black,
  lineHeight: 22,
  marginBottom: spacing.sm,
},

modalInfoRegularText:{
  fontSize: screenWidth * 0.037,
  fontFamily: Fonts.Regular,
  color: colors.black,
  lineHeight: 22,
  marginBottom: spacing.md,
},  

modalInfoBoldText: {
  fontFamily: Fonts.Bold,
},

floatingInfoButton: {
  position: 'absolute',
  bottom: 100,
  right: 20,
  zIndex: 10,
},
floatingInfoButtonInner: {},

// Information Modal Styles End

// Board Member Card Styles
boardGrid: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  gap: spacing.md,
},
boardCard: {
  backgroundColor: colors.white,
  borderRadius: borderRadius.lg,
  padding: spacing.md,
paddingBottom: 40,
  marginBottom: spacing.xxl,
  alignItems: 'center',
  shadowColor: colors.black,
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
},
boardImageContainer: {
  marginBottom: spacing.sm,
  marginTop: -spacing.xxl,
},
boardMemberImage: {
  width: 80,
  height: 80,
  borderRadius: 40,
  borderWidth: 2,
  borderColor: colors.primaryLight,
},
boardMemberPlaceholderImage: {
  width: 80,
  height: 80,
  borderRadius: 40,
  backgroundColor: colors.lightGray,
  borderWidth: 2,
  borderColor: colors.primaryLight,
  justifyContent: 'center',
  alignItems: 'center', 
},
boardMemberName: {
  fontSize: Dimensions.get('window').width * 0.032,
  fontFamily: Fonts.Bold,
  color: colors.black,
  textAlign: 'center',

},
boardMemberRole: {
  fontSize: Dimensions.get('window').width * 0.028,
  fontFamily: Fonts.Medium,
  color: colors.black,
  textAlign: 'center',

},
boardArrowContainer: {
  position: 'absolute',
  bottom:12,
  right: spacing.sm,
  width: 24,
  height: 24,
  borderRadius: 12,
  backgroundColor: colors.primaryLight,
  justifyContent: 'center',
  alignItems: 'center',
},
boardMembercountryContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: spacing.xs,
},
boardMemberflag: {
  fontSize: 16,
  marginRight: spacing.xs,
},
boardMembercountry: {
  fontSize: Dimensions.get('window').width * 0.03,
  fontFamily: Fonts.Regular,
  color: colors.black,
},
// Board Member Card Styles

cardWhite: {
  backgroundColor: colors.white,
  borderRadius: borderRadius.lg,
  padding: spacing.md,

  shadowColor: colors.black,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 8,
  elevation: 3,
},
// QR Code Styles
qrHeader: {
  width: '100%',
  backgroundColor: colors.primary,
  paddingVertical: spacing.lg,
  paddingHorizontal: spacing.md,
},
qrHeaderContent: {
  alignItems: 'center',
},
qrLogoContainer: {
  marginBottom: spacing.md,
},
qrLogo: {
  width: screenWidth * 0.6,
  height: screenWidth * 0.2,
  resizeMode: 'contain',
},
qrDivider: {
  width: '100%',
  height: 1,
  backgroundColor: colors.white,
  marginBottom: spacing.sm,
},
qrConferenceInfo: {
  alignItems: 'center',
},
qrConferenceTitle: {
  fontSize: screenWidth * 0.039,
  fontFamily: Fonts.Bold,
  color: colors.primaryLight,
  textAlign: 'center',
  marginBottom:0,
},
qrConferenceDetails: {
  fontSize: screenWidth * 0.033,
  fontFamily: Fonts.Regular,
  color: colors.white,
  textAlign: 'center',
},

qrCard: {
  backgroundColor: colors.white,
  borderRadius: borderRadius.lg,
  margin: spacing.lg,
  paddingBottom: spacing.xl,

  alignItems: 'center',
  shadowColor: colors.black,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 8,
  elevation: 3,
},
qrReferenceNumber: {
  fontSize: screenWidth * 0.044,
  fontFamily: Fonts.Medium,
  color: colors.black,
  marginTop: spacing.md,
  marginBottom: spacing.md,
},
qrImageContainer: {
  width: 170,
  height: 170, 
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: spacing.md,
  
},
qrProfileImage: {
  width: '100%',
  height: '100%',
},
qrSpeakerName: {
  fontSize: screenWidth * 0.046,
  fontFamily: Fonts.Bold,
  color: colors.primary,
  textAlign: 'center',
},
qrAffiliation: {
  fontSize: screenWidth * 0.036,
  fontFamily: Fonts.Medium,
  color: colors.black,
  marginBottom: spacing.md,
  textAlign: 'center',
},
qrDownloadButton: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: spacing.sm,
  paddingHorizontal: spacing.lg,
  borderWidth: 1,
  borderColor: colors.blue,
  borderRadius:100,
  gap: spacing.xs,
},
qrDownloadText: {
  fontSize: screenWidth * 0.037,
  fontFamily: Fonts.Medium,
  color: colors.blue,
},
qrLoginPrompt: {
  paddingHorizontal: spacing.lg,
  paddingBottom: spacing.lg,
},
qrPromptText: {
  fontSize: screenWidth * 0.037,
  fontFamily: Fonts.Regular,
  color: colors.darkGray,
  textAlign: 'center',
  lineHeight: 24,
},
qrProceedToLoginButton: {
  marginHorizontal: spacing.md,
  marginBottom: spacing.lg,
  position: 'relative',
  
},

  qrProceedLoginArrow: {
  position: 'absolute',
  right: '10%',
  top: '50%',
  transform: [{ translateY: '-50%' }],
  borderRadius: 100,
  padding: spacing.sm,
  backgroundColor: colors.primary,
  zIndex: 1,  
},    
qrProceedLoginArrowIcon: {
  transform: [{ rotate: '180deg' }],
},

// QR Code Styles End


// Bottom Background Ribbon Styles
bgBottomRibbon: { 
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  height: Dimensions.get('window').height * 0.48,
  width: '100%',
  zIndex: 0,
},
bgBottomRibbonImage: {   
  width: Dimensions.get('window').width * 1.2,
  height: '100%', 
  opacity: 0.15,
  resizeMode: 'cover',
},

//Content Tags
bold:{
  fontFamily: Fonts.Bold,
},
mb20:{
  marginBottom: spacing.md,
},
mbSm:{
  marginBottom: spacing.sm,
},
whiteColor:{
  color: colors.white,
},
primaryLightColor:{
  color: colors.primaryLight,
},
cardHeadingPara:{
  backgroundColor: colors.white,
  shadowColor: colors.gray,
  borderRadius: borderRadius.md,
  // padding: spacing.md,
  // shadowOffset: {
  //   width: 0,
  //   height: 2,
  // },
  // shadowOpacity: 0.09,
  // shadowRadius: 4,
  // elevation: 3,
},
headingH1: {
  fontSize: screenWidth * 0.045,
  fontFamily: Fonts.Bold,
  color: colors.primary,
  marginBottom:0,
  lineHeight: screenWidth * 0.07,
},
h2:{ 
  fontSize: screenWidth * 0.043,
  fontFamily: Fonts.SemiBold,
  color: colors.primary,
  lineHeight: screenWidth * 0.065,
  marginBottom: spacing.sm,
},
taglineH5: {
  fontSize: screenWidth * 0.04,
  fontFamily: Fonts.Medium,
  color: colors.primary,
  marginBottom: spacing.md,
},

yellowTaglineH5:{
  fontSize: screenWidth * 0.04,
  fontFamily: Fonts.Medium,
  color: colors.primaryLight,
  marginBottom: spacing.md,

},

paragraphP: {
  fontSize: screenWidth * 0.039,
  fontFamily: Fonts.Regular,
  color: colors.black,
  lineHeight: screenWidth * 0.062,
  textAlign: 'left',
},

sectionContent: {
  marginBottom: spacing.xl,
},
imageContainerContFull: {
  width: '100%',
  marginBottom: spacing.md,
},
imageContFull: {
 width: '100%',   
  borderRadius: borderRadius.md,
},
textContainer: {
  marginBottom: spacing.md,
},

//Blue BG
sectionCardBlue: {
  backgroundColor: colors.primary,
  borderRadius: borderRadius.md,
  padding: spacing.md,
  gap: spacing.md,
},

//Blue BG End

// FEE CARD STYLES

sectionCardLightYellow: {
  backgroundColor: '#FFF1CC',
  borderRadius: borderRadius.md,
  padding: spacing.md,
  gap: spacing.sm,
  marginHorizontal: spacing.lg,
  marginBottom: spacing.lg,
},


feeCard: {
  backgroundColor: '#FFFBE3',
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.md,
  borderRadius: borderRadius.sm,
},
feeRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingVertical: spacing.xs,
},
feeLabel: {
  fontSize: screenWidth * 0.043,
  fontFamily: Fonts.Medium,
  color: colors.black,
},
feeAmount: {
  fontSize: screenWidth * 0.043,
  fontFamily: Fonts.SemiBold,
  color: colors.black,
},
feeNote: {
  borderTopWidth: 1,
  borderTopColor: '#E4E1CD',
  paddingTop: spacing.md,
  fontSize: screenWidth * 0.036,
  fontFamily: Fonts.Medium,
  color: colors.darkGray,
},
feeNoteYellow:{
  backgroundColor:colors.primaryLight,
  padding: spacing.md,
  fontSize: screenWidth * 0.036,
  fontFamily: Fonts.Medium,
  color: colors.darkGray,
},
// FEE CARD STYLES END


bulletDot: {
  width: 20,
  height: 20,
  borderRadius: 100,
  backgroundColor: colors.accent,
  marginTop: spacing.xs,
},
bulletText: {
  flex: 1,
  fontSize: screenWidth * 0.036,
  fontFamily: Fonts.Regular,
  color: colors.darkGray,
  lineHeight: screenWidth * 0.055,
},
bulletRowLight: {
  flexDirection: 'row',
  gap: spacing.sm,
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
},
bulletDotAccent: {
  width: 18,
  height: 18,
  borderRadius: 100,
  backgroundColor: colors.accent,
  marginTop: 8,
},
bulletTextLight: {
  flex: 1,
  fontSize: screenWidth * 0.036,
  fontFamily: Fonts.Regular,
  color: colors.white,
  lineHeight: screenWidth * 0.055,
},
});
export default globalStyles;
