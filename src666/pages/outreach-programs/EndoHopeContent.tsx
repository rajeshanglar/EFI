import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import globalStyles, {
  colors,
  spacing,
  borderRadius,
  Fonts,
} from '../../styles/globalStyles';

const { width: screenWidth } = Dimensions.get('window');

export const EndoHopeContent: React.FC = () => {
  return (
    <View>
     <Image
        source={require('../../assets/images/efi-training-img.jpg')}
        style={styles.heroImage}
      />
    
    <View style={styles.contentSection}>
        <Text style={[globalStyles.headingH1, globalStyles.mb20]}>
        Endo HOPE (Health, Outreach, Preparedness, Education)
        </Text>

      <View style={globalStyles.mb20}>
        <Text style={globalStyles.h2}>About the Program</Text>
        <Text style={globalStyles.paragraphP}>
        Endo HOPE is designed to reach the younger generation and wider communities by creating early awareness in schools, general colleges (non-medical), communities, NGOs, and youth groups. The initiative focuses on breaking the stigma around menstrual and reproductive health, fostering open dialogue, and building preparedness so that young people grow up informed and empathetic about Endometriosis.
        </Text>
      </View>

        <View style={globalStyles.sectionCardBlue}>
          <Text style={[globalStyles.headingH1, globalStyles.whiteColor]}>Key Objectives</Text>        

          <View style={styles.detailBlock}>     
            <View style={globalStyles.bulletRowLight}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletTextLight}>
              <Text style={globalStyles.bold}>Health:</Text> Promote understanding of menstrual and reproductive health as a normal part of well-being, reducing myths and taboos.
            </Text>
            </View>

            <View style={globalStyles.bulletRowLight}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletTextLight}>
              <Text style={globalStyles.bold}>Outreach:</Text> Partner with schools, colleges, NGOs, and community organizations to spread awareness widely and inclusively.
              </Text>
            </View>

            <View style={globalStyles.bulletRowLight}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletTextLight}>
              <Text style={globalStyles.bold}>Preparedness:</Text> Equip young women to recognize symptoms that go beyond “normal period pain,” encouraging early consultation and timely diagnosis.

              </Text>
            </View>

            <View style={globalStyles.bulletRowLight}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletTextLight}>
              <Text style={globalStyles.bold}>Education:</Text> Develop simple, accessible learning resources for students, teachers, parents, and community leaders to ensure knowledge spreads across generations.
            </Text>
            </View>
          </View>
        </View>

        <View style={globalStyles.cardHeadingPara}>
            <Text style={[globalStyles.headingH1, globalStyles.mbSm]}>Impact</Text>
            <Text style={globalStyles.paragraphP}>
            By starting conversations early and reaching into communities, Endo HOPE ensures that the next generation and society at large grow up better informed, more empathetic, and ready to break the silence around Endometriosis.
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

