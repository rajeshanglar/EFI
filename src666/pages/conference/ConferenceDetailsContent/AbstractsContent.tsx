import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import globalStyles, { colors, spacing, borderRadius, Fonts } from '../../../styles/globalStyles';
import { GradientButton } from '../../../components/GradientButton';
import { EmailIcon } from '../../../components/icons';
import { useNavigationContext } from '../../../contexts/NavigationContext';

const { width: screenWidth } = Dimensions.get('window');

export const AbstractsContent: React.FC = () => {
  const { navigate } = useNavigationContext();

  const handleSubmitAbstract = () => {
    navigate.submitAbstract();
  };

  const handleEmailPress = () => {
    console.log('Email pressed');
    // Open email client
  };

  return (
    <View style={styles.container}>
      {/* Abstract Submission Section */}
      <Text style={globalStyles.sectionTitle}>
        Abstract Submission – Endometriosis India Congress 2026
      </Text>
      <Text style={[globalStyles.paragraphP, {marginBottom: spacing.md}]}>
      We are delighted to invite researchers, clinicians, surgeons and advocates to submit abstracts for the Endometriosis India Congress 2026, to be held from 6–8 March 2026 at Park Hyatt, Hyderabad.
      </Text>

      <Text style={[globalStyles.paragraphP, {marginBottom: spacing.md}]}>
      This international meeting brings together experts from gynaecology, surgery, reproductive medicine, public health, psychology, and patient advocacy to share cutting-edge research, surgical innovations, and real-world insights in endometriosis and adenomyosis care.
      </Text>

      <GradientButton
        title="Submit Abstract"
        onPress={handleSubmitAbstract}
        style={styles.submitButton}
      />


 
          <Text style={[globalStyles.headingH1, { marginBottom: spacing.md, marginTop: spacing.md }]}>
            Key Highlights of the Endometriosis India Congress 2026
          </Text>

          <View style={{marginBottom: spacing.md}}>
            <View style={[globalStyles.bulletRowLight, globalStyles.cardWhite]}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletText}>
                <Text style={globalStyles.bold}>Abstract Submission Deadline:</Text>
                <View>
                 <Text style={globalStyles.paragraphP}>30th November 2025</Text>
                 </View>             
              </Text>
            </View>
          </View>

          <View style={{marginBottom: spacing.md}}>
            <View style={[globalStyles.bulletRowLight, globalStyles.cardWhite]}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletText}>
              <View><Text style={globalStyles.bold}>Notification of Acceptance:</Text></View>
                <View><Text style={globalStyles.paragraphP}>15th January 2026</Text></View>             
              </Text>
            </View>
          </View>

          <View style={{marginBottom: spacing.md}}>
            <View style={[globalStyles.bulletRowLight, globalStyles.cardWhite]}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletText}>
              <View><Text style={globalStyles.bold}>Final Work Submission (PPT or Video):</Text></View>
                <View><Text style={globalStyles.paragraphP}>10th February 2026</Text></View>             
              </Text>
            </View>
          </View>

          <View style={{marginBottom: spacing.md}}>
            <View style={[globalStyles.bulletRowLight, globalStyles.cardWhite]}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletText}>
                <View><Text style={globalStyles.bold}>Registration Deadline for Presenting Authors:</Text></View>
                <View><Text style={globalStyles.paragraphP}>31st December 2025</Text></View>             
              </Text>
            </View>
          </View>

          <Text style={globalStyles.feeNoteYellow}>
        (Note:At least the first author must be registered for the
         congress by 31st December 2025 for the abstract to
          be considered.)
        </Text>


          <View style={[globalStyles.cardWhite, {marginTop: spacing.md}]}>
            <Text style={globalStyles.headingH1}>Presentation Categories</Text>
            <Text style={globalStyles.paragraphP}>You may submit your abstract in one of the following formats:</Text>
           
            <View style={[globalStyles.bulletRowLight, {marginTop: spacing.md}]}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletText}>
              Oral Presentation
              </Text>
            </View>

            <View style={[globalStyles.bulletRowLight, {marginTop: spacing.md}]}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletText}>
              Video Presentation
              </Text>
            </View>

            <View style={[globalStyles.bulletRowLight, {marginTop: spacing.md}]}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletText}>
              E-Poster Presentation
              </Text>
            </View>

            <Text style={[globalStyles.feeNoteYellow, {marginTop: spacing.md}]}>
            (Note:At least the first author must be registered for the
            congress by 31st December 2025 for the abstract to
              be considered.)
            </Text>
          </View>


          <View style={[globalStyles.cardWhite, {marginTop: spacing.md}]}>
            <Text style={globalStyles.headingH1}>Abstract Categories</Text>
            <Text style={globalStyles.paragraphP}>We welcome submissions under the following themes:</Text>
           
            <View style={[globalStyles.bulletRowLight, {marginTop: spacing.md}]}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletText}>
              Adenomyosis
              </Text>
            </View>

            <View style={[globalStyles.bulletRowLight, {marginTop: spacing.md}]}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletText}>
              Deep Endometriosis & Surgical Innovation
              </Text>
            </View>

            <View style={[globalStyles.bulletRowLight, {marginTop: spacing.md}]}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletText}>
              Infertility & ART
              </Text>
            </View> 

            <View style={[globalStyles.bulletRowLight, {marginTop: spacing.md}]}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletText}>
              Imaging (USG and MRI & Diagnostics)
              </Text>
            </View> 

            <View style={[globalStyles.bulletRowLight, {marginTop: spacing.md}]}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletText}>
              Medical Management
              </Text>
            </View> 

            <View style={[globalStyles.bulletRowLight, {marginTop: spacing.md}]}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletText}>
              Pain & Pain Mechanisms
              </Text>
            </View>

            <View style={[globalStyles.bulletRowLight, {marginTop: spacing.md}]}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletText}>
              Digital Health & AI
              </Text>
            </View>

            <View style={[globalStyles.bulletRowLight, {marginTop: spacing.md}]}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletText}>
              Psychology & Sexual Function
              </Text>
            </View>

            
            <View style={[globalStyles.bulletRowLight, {marginTop: spacing.md}]}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletText}>
              Patient Advocacy & Quality of Life
              </Text>
            </View>

            <View style={[globalStyles.bulletRowLight, {marginTop: spacing.md}]}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletText}>
              Public/Community Engagement
              </Text>
            </View>
          </View>

          <View style={[globalStyles.cardWhite, {marginTop: spacing.md}]}>
            <Text style={globalStyles.headingH1}>Abstract Guidelines</Text>
            <Text style={globalStyles.h2}>General Requirements</Text>
                     
            <View style={[globalStyles.bulletRowLight, {marginTop: spacing.md}]}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletText}>
              <Text style={globalStyles.bold}>Language:</Text>
              <Text style={globalStyles.paragraphP}> English</Text>
              </Text>
            </View>

            <View style={[globalStyles.bulletRowLight, {marginTop: spacing.md}]}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletText}>
              <Text style={globalStyles.bold}>Word Limit: </Text>
              300 words (excluding title, authors, affiliations)
              </Text>
            </View>

            <View style={[globalStyles.bulletRowLight, {marginTop: spacing.md}]}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletText}>
              Tables, figures, and images will not be accepted within the abstract text
              </Text>
            </View> 

            <View style={[globalStyles.bulletRowLight, {marginTop: spacing.md}]}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletText}>
              Define all abbreviations at first mention
              </Text>
            </View> 

            <View style={[globalStyles.bulletRowLight, {marginTop: spacing.md}]}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletText}>
              References and bibliography are not required in the abstract text
              </Text>
            </View>
          </View>


          <View style={[globalStyles.cardWhite, {marginTop: spacing.md}]}>
            <Text style={globalStyles.headingH1}>Structure of Abstract</Text>         
                     
            <View style={[globalStyles.bulletRowLight, {marginTop: spacing.md}]}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletText}>
              <Text style={globalStyles.bold}>Title :</Text>
              <Text style={globalStyles.paragraphP}>(bold)</Text>
              </Text>
            </View>

            <View style={[globalStyles.bulletRowLight, {marginTop: spacing.md}]}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletText}>
              <Text style={globalStyles.bold}>Authors & Affiliations : </Text>
              (max 5 authors) 
              </Text>
            </View>

            <View style={[globalStyles.bulletRowLight, {marginTop: spacing.md}]}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletText}>
              Background
              </Text>
            </View> 

            <View style={[globalStyles.bulletRowLight, {marginTop: spacing.md}]}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletText}>
              Objectives
              </Text>
            </View> 

            <View style={[globalStyles.bulletRowLight, {marginTop: spacing.md}]}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletText}>
              Methods
              </Text>
            </View>

            <View style={[globalStyles.bulletRowLight, {marginTop: spacing.md}]}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletText}>
              Results
              </Text>
            </View>

            <View style={[globalStyles.bulletRowLight, {marginTop: spacing.md}]}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletText}>
              Conclusion
              </Text>
            </View>

            <View style={[globalStyles.bulletRowLight, {marginTop: spacing.md}]}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletText}>
              <Text style={globalStyles.bold}>Keywords:</Text>
              3–5 keywords listed on a separate line
              </Text>
            </View>

            <Text style={[globalStyles.feeNoteYellow, {marginTop: spacing.md}]}>
            All accepted abstracts will be published on EFI website
            </Text>

          </View>



          <Text style={[globalStyles.headingH1, {marginTop: spacing.xl, fontSize: screenWidth * 0.05 }]}>
            Presentation Formats
          </Text>

          <View style={[globalStyles.cardWhite, {marginTop: spacing.md}]}>
            <Text style={globalStyles.headingH1}>1. Oral Presentation</Text>           
                  
                <View style={{marginTop: spacing.md}}>
                  <Text style={globalStyles.bold}>Duration:</Text>
                  <Text style={globalStyles.paragraphP}>5 minutes (+ 1 minute Q&A)</Text>
                </View>

                <View style={{marginTop: spacing.md}}>
                  <Text style={globalStyles.bold}>Format:</Text>
                  <Text style={globalStyles.paragraphP}>PowerPoint (PPT or PPTX) in 16:9</Text>
                </View>

                <View style={{marginTop: spacing.md}}>
                  <Text style={globalStyles.bold}>Final submission by 10th Feb 2026 to:</Text>
                  <Text style={globalStyles.paragraphP}>endoindia2026@gmail.com</Text>
                </View>            
          </View>


          <View style={[globalStyles.cardWhite, {marginTop: spacing.md}]}>
            <Text style={globalStyles.headingH1}>2. Video Presentation</Text>           
                  
                <View style={{marginTop: spacing.md}}>
                  <Text style={globalStyles.bold}>Duration:</Text>
                  <Text style={globalStyles.paragraphP}>7 minutes</Text>
                </View>

                <View style={{marginTop: spacing.md}}>
                  <Text style={globalStyles.bold}>Format:</Text>
                  <Text style={globalStyles.paragraphP}>mp4 / .avi / .mpeg, max file size 500 MB, in 16:9</Text>
                </View>

                <View style={{marginTop: spacing.md}}>
                  <Text style={globalStyles.bold}>Language</Text>
                  <Text style={globalStyles.paragraphP}>English</Text>
                </View>  

                <View style={{marginTop: spacing.md}}>
                  <Text style={globalStyles.bold}>Submit by 10th February 2026 to</Text>
                  <Text style={globalStyles.paragraphP}>endoindia2026@gmail.com</Text>
                </View> 


                                <View style={{marginTop: spacing.md}}>
                  <Text style={globalStyles.bold}>Include</Text>
                  <Text style={globalStyles.paragraphP}>- Title of Video</Text>
                  <Text style={globalStyles.paragraphP}>- Brief Description (Max 150 words)</Text>
                </View>           

          </View>

          <View style={[globalStyles.cardWhite, {marginTop: spacing.md}]}>
            <Text style={globalStyles.headingH1}>3. E-Poster Presentation</Text>           
                  
                <View style={{marginTop: spacing.md}}>
                  <Text style={globalStyles.bold}>Format:</Text>
                  <Text style={globalStyles.paragraphP}>One PowerPoint slide, portrait orientation, 16:9 ratio</Text>
                </View>

                <View style={{marginTop: spacing.md}}>
                  <Text style={globalStyles.bold}>No animations, video, or audio allowed</Text>                 
                </View>

                <View style={{marginTop: spacing.md}}>
                  <Text style={globalStyles.bold}>Language</Text>
                  <Text style={globalStyles.paragraphP}>English</Text>
                </View>  

                <View style={{marginTop: spacing.md}}>
                  <Text style={globalStyles.bold}>Submission deadline:</Text>
                  <Text style={globalStyles.paragraphP}>10th Feb 2026 </Text>
                </View> 

                <View style={{marginTop: spacing.md}}>
                  <Text style={globalStyles.bold}>Send to: </Text>
                  <Text style={globalStyles.paragraphP}>endoindia2026@gmail.com </Text>
                </View> 

          </View>

  
          <View style={[globalStyles.cardWhite, {marginTop: spacing.md}]}>
            <Text style={globalStyles.headingH1}>Awards & Recognition</Text>
            <Text style={globalStyles.paragraphP}>The Scientific Committee will select the best submission in each category:</Text>
                     
            <View style={[globalStyles.bulletRowLight, {marginTop: spacing.md}]}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletText}>
              <Text style={globalStyles.bold}>Best E-Poster</Text>            
              </Text>
            </View>

            <View style={[globalStyles.bulletRowLight, {marginTop: spacing.md}]}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletText}>
              <Text style={globalStyles.bold}>Best Oral Presentation</Text>            
              </Text>
            </View>

            <View style={[globalStyles.bulletRowLight, {marginTop: spacing.md}]}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletText}>
              <Text style={globalStyles.bold}>Best Video Communication</Text>            
              </Text>
            </View>

            <Text style={[globalStyles.feeNoteYellow, {marginTop: spacing.md}]}>
            Prizes will be announced soon
            </Text>

            

      

    
          </View>
          

</View>



 



  
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  sectionTitle: {
    fontSize: screenWidth * 0.042,
    fontFamily: Fonts.Bold,
    color: colors.black,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  paragraph: {
    fontSize: screenWidth * 0.037,
    fontFamily: Fonts.Regular,
    color: colors.black,
    lineHeight: screenWidth * 0.055,
    marginBottom: spacing.md,
    textAlign: 'left',
  },
  submitButton: {
    marginBottom: spacing.lg,
  },
  dateItem: {
    marginBottom: spacing.md,
  },
  dateText: {
    fontSize: screenWidth * 0.037,
    fontFamily: Fonts.Regular,
    color: colors.black,
    lineHeight: screenWidth * 0.055,
  },
  dateBold: {
    fontFamily: Fonts.Bold,
  },
  categoryItem: {
    marginBottom: spacing.sm,
  },
  categoryText: {
    fontSize: screenWidth * 0.037,
    fontFamily: Fonts.Regular,
    color: colors.black,
    lineHeight: screenWidth * 0.055,
  },
  infoBox: {
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  infoText: {
    fontSize: screenWidth * 0.037,
    fontFamily: Fonts.Regular,
    color: colors.black,
    lineHeight: screenWidth * 0.055,
  },
  emailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.blue,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  emailText: {
    fontSize: screenWidth * 0.037,
    fontFamily: Fonts.Bold,
    color: colors.white,
  },
  closingText: {
    fontSize: screenWidth * 0.037,
    fontFamily: Fonts.Regular,
    color: colors.black,
    lineHeight: screenWidth * 0.055,
    marginTop: spacing.md,
    textAlign: 'left',
  },
});
