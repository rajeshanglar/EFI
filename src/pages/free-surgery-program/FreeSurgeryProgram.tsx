import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Header } from '../../components/Header';
import globalStyles,{ colors, spacing, Fonts } from '../../styles/globalStyles';

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
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={globalStyles.sectionContent}>
          <Text style={globalStyles.paragraphP}>
          <Text style={{fontFamily: Fonts.Bold}}>The Endometriosis Foundation of India</Text> is committed to ensuring that every woman suffering from Endometriosis has access to the right care. Through our Free Surgery Program, we aim to provide high-quality, advanced excision surgeries for women who may not have the financial means to afford treatment. This initiative helps bridge the gap between patients in need and expert excision surgeons, ensuring that no woman is left untreated because of financial constraints.
          </Text>

          <View style={[globalStyles.sectionCardBlue, { marginTop: spacing.md }]}>
          <Text style={[globalStyles.headingH1, globalStyles.whiteColor]}>Eligibility Criteria</Text>        
            <Text style={[globalStyles.paragraphP, globalStyles.whiteColor]}>
            To ensure that the program reaches those who need it the most, women must meet the following criteria:
            </Text>
          <View style={styles.detailBlock}>     
            <View style={globalStyles.bulletRowLight}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletTextLight}>
              Confirmed or suspected diagnosis of Endometriosis.
            </Text>
            </View>

            <View style={globalStyles.bulletRowLight}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletTextLight}>
              Inability to afford surgical treatment due to financial constraints.
              </Text>
            </View>

            <View style={globalStyles.bulletRowLight}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletTextLight}>
              Willingness to undergo medical evaluation and pre-surgical screening by EFI’s partner team.
              </Text>
            </View>

            <View style={globalStyles.bulletRowLight}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletTextLight}>
              Priority is given to women with severe pain, infertility concerns, or advanced disease impacting daily life.
              </Text>
            </View>
          </View>
        </View>


        <View style={[styles.contentCard, {marginTop: spacing.lg}]}>
          <Text style={globalStyles.headingH1}>
          Application Process
          </Text>

          <Text style={[globalStyles.paragraphP,{ marginTop: spacing.sm, marginBottom: spacing.md }]}>Applying for the Free Surgery Program is simple and transparent:</Text>

          <View style={globalStyles.bulletRowLight}>
            <View style={globalStyles.bulletDot} />
            <Text style={globalStyles.bulletText}>
            Submit Application – Fill out the application form available on the EFI website or through EFI partner clinics.
            </Text>
          </View>

          <View style={[globalStyles.bulletRowLight, {marginTop: spacing.md}]}>
            <View style={globalStyles.bulletDotAccent} />
            <Text style={globalStyles.bulletText}>
            Medical Assessment – Provide previous reports, scans, and medical history for review.
            </Text>
          </View>

          <View style={[globalStyles.bulletRowLight, {marginTop: spacing.md}]}>
            <View style={globalStyles.bulletDotAccent} />
            <Text style={globalStyles.bulletText}>
            Eligibility Review – Our expert medical team will assess your condition and financial background to determine eligibility.
            </Text>
          </View>

          <View style={[globalStyles.bulletRowLight, {marginTop: spacing.md}]}>
            <View style={globalStyles.bulletDotAccent} />
            <Text style={globalStyles.bulletText}>
            Confirmation & Scheduling – If approved, you will be guided to one of our partner hospitals where the surgery will be scheduled.
            </Text>
          </View>

          <View style={[globalStyles.bulletRowLight, {marginTop: spacing.md}]}>
            <View style={globalStyles.bulletDotAccent} />
            <Text style={globalStyles.bulletText}>
            Post-surgery Support – EFI also extends counseling and follow-up care to ensure recovery and long-term health improvement.
            </Text>
          </View>


         

     
        </View>

        <View style={[globalStyles.sectionCardBlue, { marginTop: spacing.md }]}>
          <Text style={[globalStyles.headingH1, globalStyles.whiteColor]}>Partner Hospitals</Text>        
            <Text style={[globalStyles.paragraphP, globalStyles.whiteColor]}>
            EFI collaborates with leading hospitals and specialized surgical centers across India to deliver advanced Endometriosis excision surgery. These hospitals are:
            </Text>
          <View style={styles.detailBlock}>     
            <View style={globalStyles.bulletRowLight}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletTextLight}>
              Equipped with state-of-the-art laparoscopic and robotic surgical facilities.
            </Text>
            </View>

            <View style={globalStyles.bulletRowLight}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletTextLight}>
              Staffed by highly trained excision surgeons who are part of EFI’s expert panel.
              </Text>
            </View>

            <View style={globalStyles.bulletRowLight}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletTextLight}>
              Located in accessible cities to help patients from different regions.
              </Text>
            </View>

     
          </View>
        </View>
     
     <View style={globalStyles.section}>
         <Text style={globalStyles.headingH1}>
          APOLLO HOSPITALS NALINI SPECIALITY HOSPITAL
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
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },

  contentSection: {
    padding: spacing.md,
    gap: spacing.lg,
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


