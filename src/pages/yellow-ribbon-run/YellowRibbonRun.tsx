import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Linking,
} from 'react-native';
import Header from '../../components/Header';
import globalStyles, {
  colors,
  spacing,
  borderRadius,
  Fonts,
} from '../../styles/globalStyles';
import {
  CalendarIconYellow,
  RunIcon,
  YellowRibbonIcon,
  RibbonRunBulletIcon,
} from '../../components/icons';
import { lightBlue100 } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';

interface YellowRibbonRunProps {
  onBack: () => void;
  onNavigateToHome: () => void;
}

const { width: screenWidth } = Dimensions.get('window');

const contactEmail = 'contact@endometriosisfoundationindia.in';
const contactPhone = '+91-9000000000';

const YellowRibbonRun: React.FC<YellowRibbonRunProps> = ({
  onBack,
  onNavigateToHome,
}) => {
  const handleEmailPress = () => {
    const url = `mailto:${contactEmail}`;
    Linking.openURL(url).catch(() => {
      console.warn('Unable to open mail client');
    });
  };

  const handlePhonePress = () => {
    const url = `tel:${contactPhone}`;
    Linking.openURL(url).catch(() => {
      console.warn('Unable to initiate call');
    });
  };

  return (
    <View style={styles.container}>
      <Header
        title="Yellow Ribbon Run"
        onBack={onBack}
        onNavigateToHome={onNavigateToHome}
        onMenuItemPress={(id: any) => console.log('Menu:', id)}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={require('../../assets/images/yellow-ribbon-run.jpg')}
          style={styles.heroImage}
        />

        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              { textAlign: 'center', fontSize: screenWidth * 0.05 },
            ]}
          >
            India’s First Public Awareness Run Dedicated to Endometriosis
          </Text>

          <Text
            style={[globalStyles.h2, { marginBottom: 0, paddingBottom: 5 }]}
          >
            A movement to make the invisible pain visible.
          </Text>

          <Text
            style={[
              globalStyles.paragraphP,
              { marginTop: 0, marginBottom: spacing.md },
            ]}
          >
           The Yellow Ribbon Run, launched by the Endometriosis Foundation of India (EFI) in 2024, is a pioneering initiative — the first of its kind in India — that uses the power of community participation, fitness, and public engagement to raise awareness about endometriosis, a debilitating chronic illness affecting over 40 million women in India and 240+ million globally.
          </Text>
          <Text
            style={[
              globalStyles.paragraphP,
              { marginTop: 0, marginBottom: spacing.md },
            ]}
          >
           With two impactful editions held in Hyderabad, the Yellow Ribbon Run has already united over 3,000 participants, making it not just a run, but a symbol of hope, strength, and solidarity for women suffering from an often overlooked and misunderstood disease.
          </Text>
        </View>

        <View style={styles.ctaCard}>
          <View style={styles.ctaContent}>
            <YellowRibbonIcon size={42} color={colors.primary} />
            <Text style={styles.ctaTitle}>Join Us — Let’s Run for Change</Text>
          </View>

          <Text style={styles.ctaDescription}>
          Your brand can help make invisible pain, visible.
          With your support, the Yellow Ribbon Run can reach more cities, touch more lives, and bring real change in how India sees, speaks about, and treats Endometriosis.
          </Text>

          <View style={styles.ctaButtonsContainer}>
            <Text style={styles.ctaTitleWhite}>Partner With Us</Text>
            <View style={styles.ctaButtons}>
              <TouchableOpacity
                style={[styles.primaryButton, styles.buttonSpacing]}
                activeOpacity={0.85}
                onPress={handleEmailPress}
              >
                <Text style={styles.primaryButtonText}>
                  contact@endometriosisfoundation.in
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.primaryButton}
                activeOpacity={0.85}
                onPress={handlePhonePress}
              >
                {/* <Text style={styles.primaryButtonText}>+91-XXXXXXXXXX</Text> */}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={[styles.section, { marginBottom: 0 } ]}>
          <Text style={[styles.sectionHeading, { marginBottom: 0 } ]}>Our Purpose</Text>
          <Text style={styles.sectionSubHeading}>
          Endometriosis is often described as an “invisible disease” — hidden pain, delayed diagnosis, misunderstood symptoms, and silent suffering. The Yellow Ribbon Run aims to:
          </Text>

          <View style={styles.listContainer}>
            <View style={styles.listItem}>
              <View style={styles.listIconWrapper}></View>
              <View style={styles.listTextContainer}>
                <Text style={styles.listItemTitle}>Raise mass awareness</Text>
                <Text style={styles.listItemDescription}>
                  about endometriosis in the public domain
                </Text>
              </View>
            </View>

            <View style={styles.listItem}>
              <View style={styles.listIconWrapper}></View>
              <View style={styles.listTextContainer}>
                <Text style={styles.listItemTitle}>
                  Normalize conversations
                </Text>
                <Text style={styles.listItemDescription}>
                  around menstrual and pelvic pain
                </Text>
                <View style={styles.listItem}>
                  <View style={styles.listIconWrapper}></View>
                  <View style={styles.listTextContainer}>
                    <Text style={styles.listItemTitle}>
                      Normalize conversations
                    </Text>
                    <Text style={styles.listItemDescription}>
                      around menstrual and pelvic pain
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.listItem}>
              <View style={styles.listIconWrapper}></View>
              <View style={styles.listTextContainer}>
                <Text style={styles.listItemTitle}>Empower women</Text>
                <Text style={styles.listItemDescription}>to seek timely diagnosis and care</Text>
              </View>
            </View>

            <View style={styles.listItem}>
              <View style={styles.listIconWrapper}></View>
              <View style={styles.listTextContainer}>
                <Text style={styles.listItemTitle}>Educate families, youth, employers, and health systems</Text>
            
              </View>
            </View>
          </View>

          <Text style={[globalStyles.paragraphP, { marginTop: spacing.md }]}>
            <Text style={{fontFamily: Fonts.Bold}}>Inspire community participation</Text> for a gender-sensitive
               healthcare future
          </Text>

          <Text style={[globalStyles.paragraphP, { marginTop: spacing.md }]}>
          <Text style={{fontFamily: Fonts.Bold}}>Reduce stigma</Text> by creating safe spaces for women to share their experiences without fear or shame, as many delay seeking help due to misconceptions that endometriosis is only a reproductive issue.
          </Text>

          <Text style={[globalStyles.paragraphP, { marginTop: spacing.md }]}>
          We also encourage partners and families to participate in events and conversations to build empathy and understanding, helping to normalize discussions around endometriosis. Every step taken in the Yellow Ribbon Run is a stride toward recognition, empathy, and reform.
          </Text>
        </View>

        

        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Event's Overview</Text>
          <View style={styles.timelineContainer}>
            <View style={styles.timelineCard}>
              <View style={styles.timelineIcon}>
                <RibbonRunBulletIcon size={60} color={colors.primary} />
              </View>
              <View style={styles.timelineTextContainer}>
                <Text style={styles.timelineLabel}>Upcoming - 2026</Text>
                <Text style={styles.timelineTheme}><Text style={{fontFamily: Fonts.Bold}}>Theme: </Text>
                “Invisible No More”</Text>
                <Text style={styles.timelineFocus}>
                <Text style={{fontFamily: Fonts.Bold}}>Focus:</Text> National visibility, media amplification, policy focus, and support advocacy

                </Text>
              </View>
            </View>

            <View style={styles.timelineCard}>
              <View style={styles.timelineIcon}>
                <RibbonRunBulletIcon size={60} color={colors.primary} />
              </View>
              <View style={styles.timelineTextContainer}>
                <Text style={styles.timelineLabel}>Year 2 - 2025</Text>
                <Text style={styles.timelineTheme}><Text style={{fontFamily: Fonts.Bold}}>Theme: </Text>“Every Step Counts”</Text>
                <Text style={styles.timelineFocus}>
                <Text style={{fontFamily: Fonts.Bold}}>Focus:</Text> Reinforcing that small steps lead to large impact in the endometriosis journey


                </Text>
              </View>
            </View>

            <View style={styles.timelineCard}>
              <View style={styles.timelineIcon}>
                <RibbonRunBulletIcon size={60} color={colors.primary} />
              </View>
              <View style={styles.timelineTextContainer}>
                <Text style={styles.timelineLabel}>Year 1 - 2024</Text>
                <Text style={styles.timelineTheme}>
                <Text style={{fontFamily: Fonts.Bold}}>Theme: </Text>“Beyond the Finish Line”
                </Text>
                <Text style={styles.timelineFocus}>
                <Text style={{fontFamily: Fonts.Bold}}>Focus:</Text> Starting a conversation, breaking myths, building a community
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View>
          <Text
            style={{
              marginBottom: 0.2,
              fontSize: screenWidth * 0.04,
              fontFamily: Fonts.SemiBold,
              textAlign: 'center',
            }}
          >
            Each edition includes:
          </Text>
        </View>

        <View style={styles.recSection}>
          <Text style={[styles.resHeading, { fontSize: screenWidth * 0.12 }]}>
            Race
          </Text>
          <Text style={[styles.resHeading, { fontSize: screenWidth * 0.08 }]}>
            Categories
          </Text>
          <View style={styles.raceContainer}>
            <View style={styles.raceCard}>
              <Text style={styles.raceDistance}>10K</Text>
              <Text style={styles.raceDescription}>
              For professional and fitness runners
              </Text>
            </View>
            <View style={styles.raceCard}>
              <Text style={styles.raceDistance}>5K</Text>
              <Text style={styles.raceDescription}>
              For active citizens and working professionals
              </Text>
            </View>
          </View>
          <View style={[styles.raceCard, { width: '100%' }]}>
            <Text style={styles.raceDistance}>3K</Text>
            <Text style={styles.raceDescription}>
            For families, students, patients, and caregivers
            </Text>
          </View>
        </View>

        <View style={[styles.section, { marginBottom: 0 } ]}>
          <View style={styles.listContainer}>
            <View style={styles.listItem}>
              <View style={styles.listIconWrapper}></View>
              <View style={styles.listTextContainer}>
                <Text style={styles.listItemTitle}>On-ground awareness booths
                </Text>               
              </View>
            </View>

            <View style={styles.listItem}>
              <View style={styles.listIconWrapper}></View>
              <View style={styles.listTextContainer}>
                <Text style={styles.listItemTitle}>Live storytelling from Endo Warriors
                </Text>               
              </View>
            </View>

            <View style={styles.listItem}>
              <View style={styles.listIconWrapper}></View>
              <View style={styles.listTextContainer}>
                <Text style={styles.listItemTitle}>Educational panels and workshops
                </Text>               
              </View>
            </View>

            <View style={styles.listItem}>
              <View style={styles.listIconWrapper}></View>
              <View style={styles.listTextContainer}>
                <Text style={styles.listItemTitle}>Celebrity/medical ambassadors speaking up for the cause
                </Text>               
              </View>
            </View>         
          </View>
        </View>



        <View style={[styles.section, { marginBottom: 0 } ]}>
        <Text style={[styles.sectionHeading, { marginBottom:0 }]}>
        Vision for Growth
          </Text>

          <Text style={[globalStyles.paragraphP, { marginTop:0 }]}>
          Our future goal is to scale the Yellow Ribbon Run across India, conducting multi-city editions in key metros and Tier 1 cities, creating a pan-India movement for menstrual and reproductive health advocacy.
          </Text>


          <Text style={[styles.sectionHeading, { marginTop:spacing.lg }]}>
          Partnership & Sponsorship Opportunities
          </Text>

            <Text style={globalStyles.paragraphP}>
            The Yellow Ribbon Run offers a powerful platform for corporates, wellness brands, healthcare institutions, NGOs, and government bodies to engage in meaningful Corporate Social Responsibility (CSR) and cause marketing.
            </Text>

            <Text style={[styles.sectionHeading, { marginTop: spacing.md }]}>
            How You Can Collaborate
          </Text>

          <View style={styles.opportunityGrid}>
            <View style={styles.opportunityRow}>
              <View style={styles.opportunityCard}>
                <Text style={styles.opportunityTitle}><Text style={{fontFamily: Fonts.Bold, fontSize: screenWidth * 0.035}}>Opportunity: </Text> Title Sponsorship</Text>
                <Text style={styles.opportunityDescription}>
                <Text style={{fontFamily: Fonts.Bold}}>Inclusions:</Text> Exclusive branding as “Yellow Ribbon Run presenting partner”.
                </Text>
              </View>

              <View style={styles.opportunityCard}>
                <Text style={styles.opportunityTitle}><Text style={{fontFamily: Fonts.Bold, fontSize: screenWidth * 0.035}}>Opportunity: </Text> Category Sponsors</Text>
                <Text style={styles.opportunityDescription}>
                <Text style={{fontFamily: Fonts.Bold}}>Inclusions:</Text> Branding and recognition for a specific race (10K, 5K, or 3K)
                </Text>
              </View>

              <View style={styles.opportunityCard}>
                <Text style={styles.opportunityTitle}><Text style={{fontFamily: Fonts.Bold, fontSize: screenWidth * 0.035}}>Opportunity: </Text>Corporate Team Participation</Text>
                <Text style={styles.opportunityDescription}>
                <Text style={{fontFamily: Fonts.Bold}}>Inclusions:</Text> CSR-driven employee engagement & branded team registrations
                </Text>
              </View>

              <View style={styles.opportunityCard}>
                <Text style={styles.opportunityTitle}><Text style={{fontFamily: Fonts.Bold, fontSize: screenWidth * 0.035}}>Opportunity: </Text> On-Ground Engagement</Text>
                <Text style={styles.opportunityDescription}>
                <Text style={{fontFamily: Fonts.Bold}}>Inclusions:</Text> Booths at awareness village, product demos, free health checks, merchandise
                </Text>
              </View>

              <View style={styles.opportunityCard}>
                <Text style={styles.opportunityTitle}><Text style={{fontFamily: Fonts.Bold, fontSize: screenWidth * 0.035}}>Opportunity: </Text> Cause Merchandise Collaboration</Text>
                <Text style={styles.opportunityDescription}>
                <Text style={{fontFamily: Fonts.Bold}}>Inclusions:</Text> Co-branded T-shirts, ribbons, giveaways, and medals
                </Text>
              </View>

              <View style={styles.opportunityCard}>
                <Text style={styles.opportunityTitle}><Text style={{fontFamily: Fonts.Bold, fontSize: screenWidth * 0.035}}>Opportunity: </Text> Media, Radio & Wellness Partnerships</Text>
                <Text style={styles.opportunityDescription}>
                <Text style={{fontFamily: Fonts.Bold}}>Inclusions:</Text> Brand-led campaigns, guest talks, interviews, and content series
                </Text>
              </View>

              <View style={styles.opportunityCard}>
                <Text style={styles.opportunityTitle}><Text style={{fontFamily: Fonts.Bold, fontSize: screenWidth * 0.035}}>Opportunity: </Text> City Edition Partners</Text>
                <Text style={styles.opportunityDescription}>
                <Text style={{fontFamily: Fonts.Bold}}>Inclusions:</Text> Help launch Yellow Ribbon Runs in other cities under co-hosting format
                </Text>
              </View>

              <View style={styles.opportunityCard}>
                <Text style={styles.opportunityTitle}><Text style={{fontFamily: Fonts.Bold, fontSize: screenWidth * 0.035}}>Opportunity: </Text> Public Health & Institutional Support</Text>
                <Text style={styles.opportunityDescription}>
                <Text style={{fontFamily: Fonts.Bold}}>Inclusions:</Text>Collaborate on awareness campaigns, health data sharing, or government outreach
                </Text>
              </View>
            
            </View>
      
          </View>

          <Text style={[globalStyles.paragraphP, { marginTop: spacing.md }]}>
            We invite brands, philanthropies, health-tech startups, fitness groups, and wellness platforms to come forward and partner with EFI in this landmark movement.
            </Text>
        </View>


     


        <View style={styles.section}>
          <Text style={styles.sectionHeading}>
          Why Associate With the Yellow Ribbon Run?
          </Text>
          <View style={styles.listContainer}>
            <View style={styles.reasonItem}>
              <View style={styles.listIconWrapper}></View>
              <Text style={styles.reasonText}>
              Align with India’s leading voice for endometriosis awareness (EFI)
              </Text>
            </View>

            <View style={styles.reasonItem}>
              <View style={styles.listIconWrapper}></View>
              <Text style={styles.reasonText}>
              Champion women's health, menstrual equity, and early diagnosis
              </Text>
            </View>

            <View style={styles.reasonItem}>
              <View style={styles.listIconWrapper}></View>
              <Text style={styles.reasonText}>
              Reach a high-engagement audience including youth, women, doctors, and educators
              </Text>
            </View>

            <View style={styles.reasonItem}>
              <View style={styles.listIconWrapper}></View>
              <Text style={styles.reasonText}>
              Be part of a transformative, long-term public health mission
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  scrollView: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  heroImage: {
    width: '100%',
    height: screenWidth * 0.55,
    resizeMode: 'cover',
  },
  section: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: screenWidth * 0.046,
    fontFamily: Fonts.SemiBold,
    color: colors.primary,
    marginBottom: spacing.md,
  },
  sectionHeading: {
    fontSize: screenWidth * 0.05,
    fontFamily: Fonts.Bold,
    color: colors.primary,
    marginBottom: spacing.md,
  },
  sectionSubHeading: {
    fontSize: screenWidth * 0.04,
    fontFamily: Fonts.Medium,
    color: colors.darkGray,
    marginBottom: spacing.lg,
    lineHeight: screenWidth * 0.06,
  },
  ctaCard: {
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    gap: spacing.lg,
    shadowColor: colors.black,
  },
  ctaContent: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  ctaTextContainer: {
    flex: 1,
    gap: spacing.sm,
  },
  ctaButtonsContainer: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  ctaTitle: {
    fontSize: screenWidth * 0.045,
    fontFamily: Fonts.Bold,
    color: colors.primary,
  },
  ctaTitleWhite: {
    fontSize: screenWidth * 0.045,
    fontFamily: Fonts.Bold,
    color: colors.white,
  },
  ctaDescription: {
    fontSize: screenWidth * 0.038,
    fontFamily: Fonts.Medium,
    color: colors.darkGray,
    lineHeight: screenWidth * 0.055,
  },
  ctaButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  primaryButton: {
    flexGrow: 1,
    minWidth: screenWidth * 0.38,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.sm,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  buttonSpacing: {
    marginRight: spacing.sm,
  },
  primaryButtonText: {
    fontSize: screenWidth * 0.04,
    fontFamily: Fonts.SemiBold,
    color: colors.primaryLight,
  },

  listContainer: {
    gap: spacing.md,
  },
  listItem: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  listIconWrapper: {
    width: 15,
    height: 15,
    borderRadius: 21,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: screenWidth * 0.017,
  },
  listTextContainer: {
    flex: 1,
    gap: spacing.xs,
  },
  listItemTitle: {
    fontSize: screenWidth * 0.042,
    fontFamily: Fonts.SemiBold,
    color: colors.primary,
  },
  listItemDescription: {
    fontSize: screenWidth * 0.036,
    fontFamily: Fonts.Regular,
    color: colors.darkGray,
    lineHeight: screenWidth * 0.055,
  },
  timelineContainer: {
    gap: spacing.md,
  },
  timelineCard: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  timelineIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.lightYellow,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineTextContainer: {
    flex: 1,
    gap: spacing.xs,
  },
  timelineLabel: {
    fontSize: screenWidth * 0.042,
    fontFamily: Fonts.SemiBold,
    color: colors.primary,
  },
  timelineTheme: {
    fontSize: screenWidth * 0.038,
    fontFamily: Fonts.Medium,
    color: colors.darkGray,
  },
  timelineFocus: {
    fontSize: screenWidth * 0.035,
    fontFamily: Fonts.Regular,
    color: colors.darkGray,
    lineHeight: screenWidth * 0.052,
  },
  recSection: {
    paddingHorizontal: spacing.md,
    paddingTop: 25,
    marginVertical: 0,
    backgroundColor: colors.lightGray,
  },
  resHeading: {
    color: colors.primary,
    fontFamily: Fonts.Bold,
    lineHeight: screenWidth * 0.1,
    textAlign: 'center',
  },
  raceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: screenWidth * 0.437,
    gap: spacing.md,
    marginTop: screenWidth * 0.06,
  },
  raceCard: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: screenWidth * 0.03,
    marginBottom: screenWidth * 0.04,
    paddingBottom: 20,
  },
  raceDistance: {
    fontSize: screenWidth * 0.06,
    fontFamily: Fonts.Bold,
    color: colors.primaryLight,
  },
  raceDescription: {
    fontSize: screenWidth * 0.035,
    fontFamily: Fonts.Medium,
    color: colors.white,
    textAlign: 'center',
    lineHeight: screenWidth * 0.05,
    paddingBottom: spacing.sm,
  },

  infoCard: {
    backgroundColor: colors.lightYellow,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  infoCardTitle: {
    fontSize: screenWidth * 0.048,
    fontFamily: Fonts.Bold,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  infoCardText: {
    fontSize: screenWidth * 0.038,
    fontFamily: Fonts.Regular,
    color: colors.darkGray,
    lineHeight: screenWidth * 0.058,
  },
  opportunityGrid: {
 
    gap: spacing.md,
  },
  opportunityRow: {   
    gap: spacing.md,
  },
  opportunityCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },
  opportunityTitle: {
    fontSize: screenWidth * 0.04,
    fontFamily: Fonts.SemiBold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  opportunityDescription: {
    fontSize: screenWidth * 0.035,
    fontFamily: Fonts.Regular,
    color: colors.darkGray,
    lineHeight: screenWidth * 0.052,
  },
  whySection: {},
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },
  reasonText: {
    flex: 1,
    fontSize: screenWidth * 0.038,
    fontFamily: Fonts.Medium,
    color: colors.darkGray,
    lineHeight: screenWidth * 0.056,
  },
});

export default YellowRibbonRun;
