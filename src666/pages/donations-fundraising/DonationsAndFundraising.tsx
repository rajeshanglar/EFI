import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Linking } from 'react-native';
import Header from '../../components/Header';
import globalStyles, { colors, spacing, Fonts, borderRadius } from '../../styles/globalStyles';
import { Image } from 'react-native';
import { GradientButton } from '../../components/GradientButton';

interface DonationsAndFundraisingProps {
  onBack: () => void;
  onNavigateToHome: () => void;
}

const { width: screenWidth } = Dimensions.get('window');

const DonationsAndFundraising: React.FC<DonationsAndFundraisingProps> = ({
  onBack,
  onNavigateToHome,
}) => {


  return (
    <View style={styles.container}>
      <Header
        title="Donations and Fundraising"
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
            <Text style={globalStyles.headingH1}>
            Support a Woman’s Right to Health
            </Text>
            <Text style={[globalStyles.paragraphP, globalStyles.mb20]}>
            Donate to the Endometriosis Foundation of India
            </Text>

            <Text style={[globalStyles.paragraphP, globalStyles.mb20]}>
            In India, millions of women live with endometriosis in silence — dismissed, misdiagnosed, and 
often denied access to the care they need. Many are told that period pain is normal. Many 
undergo repeated surgeries that don’t help. And many more simply cannot afford treatment at 
all Your contribution can help change that. 
            </Text>

            <Text style={[globalStyles.paragraphP, globalStyles.mb20]}>
            The Endometriosis Foundation of India (EFI) is leading a first-of-its-kind initiative to provide free, 
evidence-based surgical treatment to women who need it the most. Every donation you make 
helps bridge the gap between pain and care — between neglect and hope. 
            </Text>

            <View style={[globalStyles.sectionContent, { marginTop: spacing.md }]}>
              <Text style={[globalStyles.headingH1,  globalStyles.mb0]}>
              How You Can Help
              </Text>
              
         
                <View style={globalStyles.mb20}>              
                  <Text style={[globalStyles.paragraphP, globalStyles.mb20]}>
                  You can make a contribution in any amount that feels right for you. Every rupee counts. 
                  </Text>
                  <Text style={[globalStyles.paragraphP]}>
                  Or, you can choose from our pre-decided giving options that
                   directly support patients in different 
                  stages of their treatment and recovery journey. 
                  </Text>
                </View>

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

                <Text style={[globalStyles.headingH1 , globalStyles.mt20]}>Partner With Us: CSR and Institutional Giving</Text>
                <Text style={[globalStyles.paragraphP , globalStyles.mt20]}>
                Create long-term impact through strategic support
                </Text>

                <Text style={[globalStyles.paragraphP , globalStyles.mt20]}>  
                Endometriosis affects millions of Indian women across urban and rural areas, yet it remains 
        underdiagnosed, undertreated, and surrounded by silence. Your organisation can help us 
        change this.
                </Text>

                <Text style={[globalStyles.paragraphP , globalStyles.mt20]}>  
                The Endometriosis Foundation of India (EFI) invites companies, philanthropic foundations, and 
        CSR teams to partner with us in delivering <Text style={globalStyles.bold}>free surgical care, long-term recovery support, 
        and large-scale awareness programs across India. </Text>
                </Text>

                <Text style={[globalStyles.paragraphP , globalStyles.mt20]}>  
                Through your partnership, you enable high-impact interventions for women who are otherwise 
                left behind by the healthcare system.
                </Text>
                
                <Text style={[globalStyles.headingH1 , globalStyles.mt20, globalStyles.mb20]}>  
                Why Partner With EFI
                </Text>

                <View style={[globalStyles.bulletRowLight, globalStyles.mb20]}>
                    <View style={globalStyles.bulletDot} />
                    <Text style={globalStyles.bulletText}>
                    <Text style={globalStyles.bold}>First-of-its-kind surgical intervention model</Text> in India for endometriosis care 
                    </Text>
                  </View>

                  <View style={[globalStyles.bulletRowLight, globalStyles.mb20]}>
                    <View style={globalStyles.bulletDot} />
                    <Text style={globalStyles.bulletText}>
                    Focused on <Text style={globalStyles.bold}>underserved communities</Text> with limited access to diagnosis or treatment 
                    </Text>
                  </View>

                  <View style={[globalStyles.bulletRowLight, globalStyles.mb20]}>
                    <View style={globalStyles.bulletDot} />
                    <Text style={globalStyles.bulletText}>
                    <Text style={globalStyles.bold} >Transparent, accountable fund use</Text> with detailed reporting and outcome tracking
                    </Text>
                  </View>

                  <View style={[globalStyles.bulletRowLight, globalStyles.mb20]}>
                    <View style={globalStyles.bulletDot} />
                    <Text style={globalStyles.bulletText}>
                    Aligned with key CSR focus areas: <Text style={globalStyles.bold} >Women’s Health, Gender Equity, Rural Health 
        Access, and Public Health Infrastructure </Text>

                    </Text>
                  </View>


                  <Text style={[globalStyles.headingH1 , globalStyles.mt20]}>  
                  Ways to Support
                </Text>
                <Text style={[globalStyles.paragraphP, globalStyles.mb20]}>
                  Your organisation can fund or co-fund: 
                  </Text>

                <View style={[globalStyles.bulletRowLight, globalStyles.mb20]}>
                    <View style={globalStyles.bulletDot} />
                    <Text style={globalStyles.bulletText}>
                    <Text style={globalStyles.bold}>Free surgeries</Text> for low-income women  
                  </Text>
                  </View>

                  <View style={[globalStyles.bulletRowLight, globalStyles.mb20]}>
                    <View style={globalStyles.bulletDot} />
                    <Text style={globalStyles.bulletText}>
                    <Text style={globalStyles.bold}>Surgery-to-recovery packages</Text> including diagnostics, hospital care, medication, and 
                    follow-ups 
                  </Text>
                  </View>

                  <View style={[globalStyles.bulletRowLight, globalStyles.mb20]}>
                    <View style={globalStyles.bulletDot} />
                    <Text style={globalStyles.bulletText}>
                    <Text style={globalStyles.bold}>Nutrition and rehabilitation support</Text>
                  </Text>
                  </View>

                  <View style={[globalStyles.bulletRowLight, globalStyles.mb20]}>
                    <View style={globalStyles.bulletDot} />
                    <Text style={globalStyles.bulletText}>
                    <Text style={globalStyles.bold}>Community awareness campaigns</Text> in schools, rural areas, and low-income 
                    settlements 
                  </Text>
                  </View>

                  <View style={[globalStyles.bulletRowLight, globalStyles.mb20]}>
                    <View style={globalStyles.bulletDot} />
                    <Text style={globalStyles.bulletText}>
                    <Text style={globalStyles.bold}>Research and capacity-building efforts</Text> to train frontline health workers and improve 
                    early diagnosis 
                  </Text>
                  </View>

              
                <Text style={[globalStyles.paragraphP, globalStyles.mb20]}>
                We offer comprehensive impact reports, patient stories, and media-ready assets for all 
        institutional partners. Custom donor visibility options can be discussed. 
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

export default DonationsAndFundraising;

