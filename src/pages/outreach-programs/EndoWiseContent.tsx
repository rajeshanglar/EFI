import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import globalStyles, {
  colors,
  spacing,
  borderRadius,
  Fonts,
} from '../../styles/globalStyles';

const { width: screenWidth } = Dimensions.get('window');

export const EndoWiseContent: React.FC = () => {
  return (
    <View>
    <Image
        source={require('../../assets/images/efi-training-img.jpg')}
        style={styles.heroImage}
      />
   
   <View style={styles.contentSection}>
        <Text style={[globalStyles.headingH1, globalStyles.mb20]}>
        Endo WISE (Workplace Initiative for Sensitisation & Education)
        </Text>

      <View style={globalStyles.mb20}>
        <Text style={globalStyles.h2}>About the Program</Text>
        <Text style={globalStyles.paragraphP}>
        Endo WISE addresses the workplace challenges faced by women living with Endometriosis. Many struggle with absenteeism, reduced productivity, and stigma, which often goes unacknowledged in professional environments. This initiative works directly with corporates, organizations, and workplaces to build awareness and create supportive policies.
        </Text>
      </View>

        <View style={globalStyles.sectionCardBlue}>
          <Text style={[globalStyles.headingH1, globalStyles.whiteColor]}>Key Objectives</Text>        

          <View style={styles.detailBlock}>     
            <View style={globalStyles.bulletRowLight}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletTextLight}>
              <Text style={globalStyles.bold}>Sensitisation:</Text> Educate employers, HR leaders, and teams about Endometriosis and its real impact on working women.
            </Text>
            </View>

            <View style={globalStyles.bulletRowLight}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletTextLight}>
              <Text style={globalStyles.bold}>Education:</Text> Provide guidance on workplace accommodations such as flexible schedules, work-from-home policies, and health benefits.
              </Text>
            </View>

            <View style={globalStyles.bulletRowLight}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletTextLight}>
              <Text style={globalStyles.bold}>Empowerment:</Text> Enable women employees to speak openly about their health without fear of judgment or discrimination.
              </Text>
            </View>

            <View style={globalStyles.bulletRowLight}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletTextLight}>
              <Text style={globalStyles.bold}>Policy Advocacy:</Text> Encourage organizations to adopt gender-sensitive health policies that include menstrual and reproductive health.

            </Text>
            </View>
          </View>
        </View>

        <View style={globalStyles.cardHeadingPara}>
            <Text style={[globalStyles.headingH1, globalStyles.mbSm]}>Impact</Text>
            <Text style={globalStyles.paragraphP}>
            By making workplaces more inclusive and supportive, Endo WISE ensures that women can pursue their careers with dignity, productivity, and equality, without their health condition holding them back.
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

