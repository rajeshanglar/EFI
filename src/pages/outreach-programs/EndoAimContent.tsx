import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import globalStyles, {
  colors,
  spacing,
  borderRadius,
  Fonts,
} from '../../styles/globalStyles';

const { width: screenWidth } = Dimensions.get('window');

export const EndoAimContent: React.FC = () => {
  return (
    <View>
     <Image
        source={require('../../assets/images/efi-training-img.jpg')}
        style={styles.heroImage}
      />
      <View style={styles.contentSection}>
        <Text style={[globalStyles.headingH1, globalStyles.mb20]}>
        Endo AIM (Awareness, Insight, Management)
        </Text>

      <View style={globalStyles.mb20}>
        <Text style={globalStyles.h2}>About the Program</Text>
        <Text style={globalStyles.paragraphP}>
        Endo AIM is a flagship initiative designed to empower the healthcare community with the right knowledge and training to recognize, understand, and manage Endometriosis effectively. By engaging directly with Medical Colleges and Universities, the program focuses on building awareness among medical students and young doctors, offering clinical insights, and strengthening management approaches that are evidence-based and patient-centered.
        </Text>
      </View>

        <View style={globalStyles.sectionCardBlue}>
          <Text style={[globalStyles.headingH1, globalStyles.whiteColor]}>Key Objectives</Text>        

          <View style={styles.detailBlock}>     
            <View style={globalStyles.bulletRowLight}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletTextLight}>
              Medical Awareness: Conduct sensitization sessions in Medical Colleges and Universities to train medical students and residents. By introducing evidence-based knowledge early in their careers, Endo AIM ensures that future doctors are better equipped to recognize Endometriosis and avoid misdiagnosis.
            </Text>
            </View>

            <View style={globalStyles.bulletRowLight}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletTextLight}>
              Clinical Insight: Provide updated, research-driven understanding of Endometriosis, its varied presentations, and effective treatment pathways.
              </Text>
            </View>

            <View style={globalStyles.bulletRowLight}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletTextLight}>
              Management Training: Advocate for multidisciplinary management strategies that improve patient outcomes and quality of life.
              </Text>
            </View>

            <View style={globalStyles.bulletRowLight}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletTextLight}>
              Professional Empowerment: Create a network of young healthcare professionals who are aware, sensitized, and committed to addressing Endometriosis.              </Text>
            </View>
          </View>
        </View>

        <View style={globalStyles.cardHeadingPara}>
            <Text style={[globalStyles.headingH1, globalStyles.mbSm]}>Impact</Text>
            <Text style={globalStyles.paragraphP}>
            By focusing on the healthcare community, Endo AIM strengthens the very foundation of change—ensuring future doctors are knowledgeable, empathetic, and skilled in managing Endometriosis effectively.
            </Text>
        </View>

     
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  heroImage: {
    width: '100%',
    height: screenWidth * 0.45,
    resizeMode: 'cover',
  },
  contentSection: {
    padding: spacing.md,
    gap: spacing.sm,
  },

  detailBlock: {
    gap: spacing.sm,
  },
});

