import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Linking } from 'react-native';
import Header from '../../components/Header';
import globalStyles, { colors, spacing, Fonts, borderRadius } from '../../styles/globalStyles';
import { Image } from 'react-native';
import { GradientButton } from '../../components/GradientButton';

const { width: screenWidth } = Dimensions.get('window');


interface SponsorPatientProps {
  onBack: () => void;
  onNavigateToHome: () => void;
}

const SponsorPatient: React.FC<SponsorPatientProps> = ({
  onBack,
  onNavigateToHome,
}) => {
  return (
    <View style={styles.container}>
      <Header
        title="Sponsor a Patient"
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
          source={require('../../assets/images/efi-training-img.jpg')}
          style={globalStyles.heroImage}
        />

        <View style={styles.contentHorizontalMargin}>
          <View style={globalStyles.sectionContent}>
        
            <View style={[globalStyles.sectionContent, { marginBottom: spacing.md }]}>
              <Text style={[globalStyles.headingH1,  globalStyles.mb20]}>
              How You Can Help
              </Text>
           

                <View style={styles.opportunityGrid}>
                    <View style={styles.opportunityRow}>

                        <View style={styles.opportunityCard}>
                            <Text style={styles.opportunityTitle}><Text style={{fontFamily: Fonts.Bold}}>Donation 
                            Amount: </Text>₹5,000 </Text>
                            <Text style={styles.opportunityDescription}>
                            <Text style={{fontFamily: Fonts.Bold}}>Impact :</Text> Covers diagnostic tests for one patient
                            </Text>
                        </View>

                        <View style={styles.opportunityCard}>
                            <Text style={styles.opportunityTitle}><Text style={{fontFamily: Fonts.Bold}}>Donation 
                            Amount: </Text>₹10,000 </Text>
                            <Text style={styles.opportunityDescription}>
                            <Text style={{fontFamily: Fonts.Bold}}>Impact :</Text>Covers one month of medication and tests for a patient 
                            </Text>
                        </View>

                        <View style={styles.opportunityCard}>
                            <Text style={styles.opportunityTitle}><Text style={{fontFamily: Fonts.Bold}}>Donation 
                            Amount: </Text>₹50,000  </Text>
                            <Text style={styles.opportunityDescription}>
                            <Text style={{fontFamily: Fonts.Bold}}>Impact :</Text>Supports pre-surgery evaluation, hospital preparation, and immediate 
                            post-op care 
                            </Text>
                        </View>

                        <View style={styles.opportunityCard}>
                            <Text style={styles.opportunityTitle}><Text style={{fontFamily: Fonts.Bold}}>Donation 
                            Amount: </Text>₹1,00,000</Text>
                            <Text style={styles.opportunityDescription}>
                            <Text style={{fontFamily: Fonts.Bold}}>Impact :</Text>Sponsors a complete endometriosis surgery for one woman 
                            </Text>
                        </View>

                        <View style={styles.opportunityCard}>
                            <Text style={styles.opportunityTitle}><Text style={{fontFamily: Fonts.Bold}}>Donation 
                            Amount: </Text>₹1,50,000</Text>
                            <Text style={styles.opportunityDescription}>
                            <Text style={{fontFamily: Fonts.Bold}}>Impact :</Text>Sponsors a full journey — from surgery to recovery, including follow-ups 
            and medication 

                            </Text>
                        </View>

                        <Text style={[globalStyles.paragraphP, globalStyles.mb20]}>
                        You may also choose to make a monthly contribution to continuously support patients 
                        throughout the year. 
                        </Text>

                        <View style={[globalStyles.sectionCardBlue]}>
                        <Text style={[globalStyles.headingH1, globalStyles.primaryLightColor]}>Where Your Donation Goes </Text>        
                        <Text style={[globalStyles.paragraphP, globalStyles.whiteColor]}>
                        EFI ensures full transparency and accountability in how every contribution is used. Funds 
                        directly support: 
                        </Text>

                        <View style={styles.detailBlock}>     
                            <View style={[globalStyles.bulletRowLight, {marginBottom: spacing.md}]}>
                            <View style={globalStyles.bulletDotAccent} />
                            <Text style={globalStyles.bulletTextLight}>
                            Free surgeries for low-income endometriosis patients 
                            </Text>
                            </View>

                            <View style={[globalStyles.bulletRowLight, {marginBottom: spacing.md}]}>
                            <View style={globalStyles.bulletDotAccent} />
                            <Text style={globalStyles.bulletTextLight}>
                            Pre- and post-operative care including medication and follow-ups
                            </Text>
                            </View>

                            <View style={[globalStyles.bulletRowLight, {marginBottom: spacing.md}]}>
                            <View style={globalStyles.bulletDotAccent} />
                            <Text style={globalStyles.bulletTextLight}>
                            Nutrition and wellness programs to aid recovery
                            </Text>
                            </View>

                            <View style={[globalStyles.bulletRowLight, {marginBottom: spacing.md}]}>
                            <View style={globalStyles.bulletDotAccent} />
                            <Text style={globalStyles.bulletTextLight}>
                            Awareness campaigns to help women recognise symptoms early 
                            </Text>
                            </View>

                            <View style={[globalStyles.bulletRowLight, {marginBottom: spacing.md}]}>
                            <View style={globalStyles.bulletDotAccent} />
                            <Text style={globalStyles.bulletTextLight}>
                            Community education to challenge stigma and misinformation 

                            </Text>
                            </View>
                                <Text style={[globalStyles.paragraphP, globalStyles.whiteColor]}>
                                Every donation helps us reach one more woman who might otherwise be left behind.
                                </Text>
                    
                        </View>
                        
                        </View>

                        <View style={[globalStyles.sectionContent, { marginBottom:0, }]}>
                                <Text style={[globalStyles.headingH1]}>Make a Donation</Text>
                                <Text style={[globalStyles.paragraphP]}>
                                [Donate Now] (CTA button leading to payment gateway or donation form)
                                </Text>

                                <Text style={[globalStyles.paragraphP, globalStyles.mb20]}>
                                All contributions are eligible for tax exemption under Section 80G of the Income Tax Act, 1961. 
                                </Text>

                                <Text style={[globalStyles.paragraphP, globalStyles.mb20]}>
                                EFI accepts payments via UPI, credit/debit cards, bank transfer, and verified international 
                                donation platforms. For queries or large contributions, write to donate@endofoundindia.org. 
                                </Text>

                                <Text style={[globalStyles.headingH1]}>Why It Matters </Text>
                                <Text style={[globalStyles.paragraphP, globalStyles.mb20]}>
                                Endometriosis affects 1 in 10 women worldwide. Yet in India, awareness, diagnosis, and access 
                        to skilled care remain extremely limited. Many women spend years living with chronic pain that 
                        affects their health, work, and dignity.  
                                </Text>

                                <Text style={[globalStyles.paragraphP]}>
                                Your donation helps us change this reality — one surgery, one recovery, and one empowered 
                                woman at a time. 
                                </Text>

                                <Text style={[globalStyles.headingH1 , globalStyles.mt20]}>Donor Voices</Text>
                                <Text style={globalStyles.paragraphP}>
                                Our donors come from all walks of life — united by the belief that no woman should live in pain 
                        because she cannot afford care. Their generosity fuels change and gives women across India a 
                        second chance at health.
                                </Text>

                                <Text style={[globalStyles.paragraphP, globalStyles.mt20, globalStyles.mb20]}>
                                “This is one of the few organisations in India that’s creating real impact in 
                        endometriosis care. Knowing my contribution directly helps a woman receive 
                        surgery gives my donation real meaning.”  --  EFI Donor 
                                </Text>
                        </View>

                        <View style={globalStyles.sectionCardBlue}>
                        <Text style={[globalStyles.headingH1, globalStyles.primaryLightColor]}>Connect With Us </Text>        
                        <Text style={[globalStyles.paragraphP, globalStyles.whiteColor]}>
                        For customised CSR partnerships, bulk donations, or foundation support, please write to:  
                        <Text style={globalStyles.bold}> csr@endofoundindia.org </Text>
                        </Text>

                        <Text style={[globalStyles.paragraphP, globalStyles.whiteColor]}>
                        Our team will respond within 3 working days to schedule a call or share a proposal.  
                        </Text>
                        
                        </View>   

                    
                    </View>      
                </View>
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
        backgroundColor: colors.white,
      },
      scrollView: {
        flex: 1,
      },
      scrollContent: {
        paddingBottom: spacing.xxl,
      },
      contentHorizontalMargin: {
        paddingHorizontal: spacing.lg,
      },
      detailBlock: {
        marginTop: spacing.md,
      },
      donateButton: {
        marginTop: spacing.md,
      },
      contactSection: {
        marginTop: spacing.xl,
        marginBottom: spacing.lg,
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
        fontSize: screenWidth * 0.04,
        fontFamily: Fonts.Regular,
        color: colors.darkGray,
        lineHeight: screenWidth * 0.052,
      },
});

export default SponsorPatient;

