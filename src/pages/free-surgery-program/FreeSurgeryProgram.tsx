import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import Header from '../../components/Header';
import globalStyles,{ colors, spacing, Fonts } from '../../styles/globalStyles';
import { Image } from 'react-native';
interface FreeSurgeryProgramProps {
  onBack: () => void;
  onNavigateToHome: () => void;
}

const { width: screenWidth } = Dimensions.get('window');

const FreeSurgeryProgram: React.FC<FreeSurgeryProgramProps> = ({
  onBack,
  onNavigateToHome,
}) => {
  return (
    <View style={styles.container}>
      <Header
        title="Free Surgery Program"
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
          Free Endometriosis Surgery for Eligible Patients 
          </Text>
          <Text style={[globalStyles.paragraphP, globalStyles.mb20]}>A first-of-its-kind initiative in India by the Endometriosis Foundation of India (EFI)</Text>
          <Text style={[globalStyles.paragraphP, globalStyles.mb20]}>Every month, thousands of women in India silently battle debilitating pain, fatigue, and 
emotional distress caused by endometriosis. Many are told it’s just “normal period pain.” Others 
undergo surgery after surgery, often without lasting relief. Too many never reach the right 
diagnosis, or the right doctor.</Text>

          <Text style={[globalStyles.paragraphP, globalStyles.mb20]}>At the Endometriosis Foundation of India, we believe no woman should be denied proper care 
because of lack of access, awareness, or affordability. That’s why we are launching India’s first 
<Text style={{fontFamily: Fonts.Bold}}>free endometriosis surgery program</Text> for eligible patients. </Text>
        
          <Text style={globalStyles.paragraphP}>This initiative offers life-changing, evidence-based care to women who otherwise cannot afford 
or access expert surgical treatment. It is our step toward bridging the care gap in endometriosis 
and giving patients the chance to reclaim their health and quality of life. </Text>


          <View style={[globalStyles.sectionCardBlue, { marginTop: spacing.md }]}>
          <Text style={[globalStyles.headingH1, globalStyles.primaryLightColor]}>Why This Matters</Text>        
            <Text style={[globalStyles.paragraphP, globalStyles.whiteColor]}>
            Endometriosis is a complex disease that affects the entire body—not just the reproductive 
system. Despite this, access to quality treatment remains out of reach for many women in India 
due to: 
            </Text>
          <View style={styles.detailBlock}>   
            <View style={globalStyles.mb20}>
              <Text style={[globalStyles.h2, globalStyles.whiteColor]}>
              Limited surgical expertise: 
              </Text>
              <Text style={[globalStyles.paragraphP, globalStyles.whiteColor]}>
              Very few surgeons in India are trained to properly diagnose 
              and excise endometriosis. 
              </Text>
            </View>

            <View style={globalStyles.mb20}>
              <Text style={[globalStyles.h2, globalStyles.whiteColor]}>
              High cost of surgery:
              </Text>
              <Text style={[globalStyles.paragraphP, globalStyles.whiteColor]}>
              Advanced care is often available only in private hospitals, making 
it unaffordable for low-income patients. 
              </Text>
            </View>

            <View style={globalStyles.mb20}>
              <Text style={[globalStyles.h2, globalStyles.whiteColor]}>
              Widespread misinformation
              </Text>
              <Text style={[globalStyles.paragraphP, globalStyles.whiteColor]}>
              Painful periods are still seen as “normal,” delaying 
              diagnosis and worsening outcomes.
              </Text>
            </View>

            <View style={globalStyles.mb20}>
              <Text style={[globalStyles.h2, globalStyles.whiteColor]}>
              Repeat surgeries
              </Text>
              <Text style={[globalStyles.paragraphP, globalStyles.whiteColor]}>
              Patients often undergo ineffective or incomplete procedures that 
              offer only temporary relief. 
              </Text>
            </View>

      <Text style={[globalStyles.paragraphP, globalStyles.whiteColor]}>
      This program is designed to change that. Through EFI’s free surgery initiative, selected patients 
will receive surgery from trusted, experienced surgeons committed to best practices in 
endometriosis care.
      </Text>

      <Text style={[globalStyles.paragraphP, globalStyles.whiteColor]}>
      Everything you need to know about EFI’s free endometriosis surgery initiative—who it’s for, how 
      it works, and what you can expect at each step. 
      </Text>

     
          </View>
        </View>


        <View style={[styles.contentCard, {marginTop: spacing.lg}]}>
          <Text style={globalStyles.headingH1}>
          Eligibility Criteria 
          </Text>

          <Text style={[globalStyles.paragraphP,{ marginTop: spacing.sm, marginBottom: spacing.md }]}>
          Women may be considered for free surgery under this initiative if they meet the following 
          conditions: 
            </Text>

          <View style={globalStyles.bulletRowLight}>
            <View style={globalStyles.bulletDot} />
            <Text style={globalStyles.bulletText}>
            Have a confirmed diagnosis of endometriosis (via scan, medical report, or clinical 
              history) 
            </Text>
          </View>

          <View style={[globalStyles.bulletRowLight, {marginTop: spacing.md}]}>
            <View style={globalStyles.bulletDotAccent} />
            <Text style={globalStyles.bulletText}>
            Are experiencing significant pain or life-disrupting symptoms 
            </Text>
          </View>

          <View style={[globalStyles.bulletRowLight, {marginTop: spacing.md}]}>
            <View style={globalStyles.bulletDotAccent} />
            <Text style={globalStyles.bulletText}>
            Are unable to afford private treatment due to financial constraints 
            </Text>
          </View>

          <View style={[globalStyles.bulletRowLight, {marginTop: spacing.md}]}>
            <View style={globalStyles.bulletDotAccent} />
            <Text style={globalStyles.bulletText}>
            Have not received adequate or successful surgical treatment previously 
            </Text>
          </View>

          <View style={[globalStyles.bulletRowLight, {marginTop: spacing.md}]}>
            <View style={globalStyles.bulletDotAccent} />
            <Text style={globalStyles.bulletText}>
            Are willing to undergo treatment at one of EFI’s partnered facilities and follow 
            post-operative guidance
            </Text>
          </View>

          <Text style={[globalStyles.paragraphP, globalStyles.mt20]}>
          Final selection will be based on a combination of medical urgency, financial need, and 
          availability of surgical slots.
          </Text>
         

     
        </View>

        <View style={[globalStyles.sectionCardBlue, { marginTop: spacing.md }]}>
          <Text style={[globalStyles.headingH1, globalStyles.primaryLightColor]}>How to Apply </Text>        
          
          <View style={styles.detailBlock}>     
            <View style={globalStyles.bulletRowLight}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletTextLight}>
              Fill out the application form (linked here). 
            </Text>
            </View>

            <View style={globalStyles.bulletRowLight}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletTextLight}>
              Upload your most recent medical reports and scan results (if available). 
              </Text>
            </View>

            <View style={globalStyles.bulletRowLight}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletTextLight}>
              Share a short summary of your experience so far with symptoms, treatment, or 
              diagnosis. 
              </Text>
            </View>

            <View style={globalStyles.bulletRowLight}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletTextLight}>
              Submit basic financial details to help us understand affordability.
              </Text>
            </View>

            <View style={globalStyles.bulletRowLight}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletTextLight}>
              Wait to hear back from the EFI screening team. 

              </Text>
            </View>
                <Text style={[globalStyles.paragraphP, globalStyles.whiteColor]}>
                Shortlisted applicants will be contacted by our team for a medical review and further 
                coordination.
                </Text>
     
          </View>
        </View>
     
     <View style={globalStyles.section}>
         <Text style={globalStyles.headingH1}>
         Frequently Asked Questions (FAQ)
        </Text> 
        <View style={globalStyles.mt20}>
          <Text style={globalStyles.h2}>
          1. Who will perform the surgery?
          </Text>
          <Text style={globalStyles.paragraphP}>       
EFI is collaborating with highly experienced, excision-trained endometriosis surgeons across 
India. Only doctors with a strong track record in endometriosis care are part of this initiative. 
          </Text>
        </View>

        <View style={globalStyles.mt20}>
          <Text style={globalStyles.h2}>
          2. What kind of surgery will be done?
          </Text>
          <Text style={globalStyles.paragraphP}>       
          Surgical plans will be personalized based on each patient’s case. Wherever possible, EFI 
          prioritizes excision surgery, which is the global gold standard in endometriosis treatment. 
          </Text>
        </View>

        <View style={globalStyles.mt20}>
          <Text style={globalStyles.h2}>
          3. Will I need to travel?
          </Text>
          <Text style={globalStyles.paragraphP}>       
          Yes. Patients may need to travel to an EFI-partnered hospital or clinic where the surgery is 
          scheduled. EFI will assist with basic logistics guidance.  
          </Text>
        </View>

        <View style={globalStyles.mt20}>
          <Text style={globalStyles.h2}>
          4. Will EFI cover all costs?
          </Text>
          <Text style={globalStyles.paragraphP}>       
          Surgery costs and surgeon fees will be fully covered. Patients may be required to bear travel or 
          incidental costs depending on their location.  
          </Text>
        </View>

        <View style={globalStyles.mt20}>
          <Text style={globalStyles.h2}>
          5. Can I choose my own surgeon?
          </Text>
          <Text style={globalStyles.paragraphP}>       
          Surgery will be offered only through EFI's verified partner network. We do not currently 
          accommodate requests for external providers. 
          </Text>
        </View>

        <View style={globalStyles.mt20}>
          <Text style={globalStyles.h2}>
          6. What if I need follow-up care? 
          </Text>
          <Text style={globalStyles.paragraphP}>       
          Post-surgical care will be coordinated with EFI and the treating doctor. Follow-up consultations 
will be part of the program and patients will be guided on symptom tracking and recovery. 
          </Text>
        </View>



      </View>

      <Text style={[globalStyles.headingH1, globalStyles.mt20]}>Pre-Op and Post-Op Guidance </Text>
      <View style={[styles.contentCard,{ marginTop: spacing.sm }]}>
          <Text style={globalStyles.h2}>
          Before Surgery
          </Text>


          <View style={globalStyles.bulletRowLight}>
            <View style={globalStyles.bulletDot} />
            <Text style={globalStyles.bulletText}>
            You will be given a full consultation with your surgeon before the procedure. 
            </Text>
          </View>

          <View style={[globalStyles.bulletRowLight, {marginTop: spacing.md}]}>
            <View style={globalStyles.bulletDotAccent} />
            <Text style={globalStyles.bulletText}>
            Please follow all instructions regarding fasting, medication, and travel.
            </Text>
          </View>

          <View style={[globalStyles.bulletRowLight, {marginTop: spacing.md}]}>
            <View style={globalStyles.bulletDotAccent} />
            <Text style={globalStyles.bulletText}>
            Arrange for a family member or trusted person to accompany you on the day of surgery. 

            </Text>
          </View>

          <View style={[globalStyles.bulletRowLight, {marginTop: spacing.md}]}>
            <View style={globalStyles.bulletDotAccent} />
            <Text style={globalStyles.bulletText}>
            EFI will ensure you receive clear information about the surgical plan and expected 
            recovery. 
            </Text>
          </View>

         
        </View>

        <View style={[globalStyles.sectionCardBlue, { marginTop: spacing.md }]}>
          <Text style={[globalStyles.headingH1, globalStyles.primaryLightColor]}>After Surgery</Text>        
          
          <View style={styles.detailBlock}>     
            <View style={globalStyles.bulletRowLight}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletTextLight}>
              Recovery times may vary based on the extent of disease and procedure.
            </Text>
            </View>

            <View style={globalStyles.bulletRowLight}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletTextLight}>
              Patients are advised to rest for a minimum of  <Text style={globalStyles.bold}>
               2 weeks</Text> and avoid strenuous activity. 
              </Text>
            </View>

            <View style={globalStyles.bulletRowLight}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletTextLight}>
              Mild pain, fatigue, or bloating post-surgery is normal. EFI will guide you on warning signs 
              to watch for. 
              </Text>
            </View>

            <View style={globalStyles.bulletRowLight}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletTextLight}>
              Our team will check in with you after discharge and schedule 
              <Text style={globalStyles.bold}>follow-up care</Text> with your 
              surgeon. 
              </Text>
            </View>

      
                <Text style={[globalStyles.paragraphP, globalStyles.whiteColor]}>
                EFI will also provide <Text style={globalStyles.bold}>symptom tracking tools</Text>, <Text style={globalStyles.bold}>emotional health check-ins</Text>, and educational 
                material to support your recovery. 
                </Text>
     
          </View>
        </View>

        <Text style={[globalStyles.headingH1, globalStyles.mt20]}>Patient Voices</Text>
        <Text style={[globalStyles.paragraphP]}>
        Every woman’s endometriosis journey is different, but the barriers are often the same — 
delayed diagnosis, unaffordable care, and a lack of support. 
        </Text>

        <Text style={[globalStyles.paragraphP, globalStyles.mt20]}>
        In this section, you will hear from women who have received free endometriosis surgery through 
EFI. They speak about their struggles before surgery, what the process was like, and how 
timely, expert care has helped them regain control over their lives.
        </Text>
         
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
   
  },
  contentHorizontalMargin:{
    paddingLeft:screenWidth * 0.04,
    paddingRight:screenWidth * 0.05,
  },

  contentCard: {
    backgroundColor: colors.white,
    borderRadius: spacing.md,
    padding: spacing.lg,
    shadowColor: colors.black,
    shadowOffset: { 
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  paragraph: {
    fontSize: screenWidth * 0.04,
    fontFamily: Fonts.Regular,
    color: colors.darkGray,
    lineHeight: screenWidth * 0.06,
    marginBottom: spacing.md,
  },

  detailBlock: {
    gap: spacing.sm,
  },
});

export default FreeSurgeryProgram;


