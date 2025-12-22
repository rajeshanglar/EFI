import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import globalStyles, { colors, spacing, borderRadius, Fonts } from '../../../styles/globalStyles';
import { GradientButton } from '../../../components/GradientButton';
import { useNavigationContext } from '../../../contexts/NavigationContext';

const { width: screenWidth } = Dimensions.get('window');

export const ProgramContent: React.FC = () => {
  const { navigate } = useNavigationContext();

  const handleRegistrationPress = () => {
    navigate.conference();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Endometriosis India Congress 2026</Text>
      <Text style={styles.details}>March 6,7 & 8 | Park Hyatt, Hyderabad, India</Text>
      <Text style={styles.theme}>
        Theme: <Text style={styles.themeBold}>Invisible No More</Text>
      </Text>

      <GradientButton
        title="Register Now"
        onPress={handleRegistrationPress}
        style={styles.registrationButton}
      />

<Text style={styles.paragraph}>Dear colleagues, friends, and champions of women’s health,</Text>
      <Text style={styles.paragraph}>
      It gives us immense pleasure to welcome you to the 3rd edition of the Endometriosis India Congress, taking place from March 6–8, 2026 in the vibrant city of Hyderabad, India, at Park Hyatt.
      </Text>

      <Text style={styles.paragraph}>
      Under the powerful theme “Invisible No More,” this year’s congress aims to break the silence around endometriosis, bringing together leading voices in clinical practice, research, and patient advocacy. Together, we will spotlight innovation, challenge old paradigms, and build meaningful pathways toward earlier diagnosis, better treatment, and holistic care.
      </Text>

      <Text style={styles.paragraph}>
      Our scientific program is designed to be multidisciplinary and deeply engaging—featuring Live Ultraosund , live robotic and laparoscopic surgeries, focused pre-congress workshops on imaging (Ultraosund and MRI), infertility, robotics, deep endometriosis, as well as high-impact lectures from renowned national and international experts.
      </Text>

      <Text style={globalStyles.h2}>
      Expect dynamic discussions on:
      </Text>

      <View style={[globalStyles.bulletRowLight, {marginBottom: spacing.md}]}> 
            <View style={globalStyles.bulletDotAccent} />
            <Text style={globalStyles.bulletText}>
            Emerging surgical strategies, including robotic innovation
            </Text>
          </View>

          <View style={[globalStyles.bulletRowLight, {marginBottom: spacing.md}]}> 
            <View style={globalStyles.bulletDotAccent} />
            <Text style={globalStyles.bulletText}>
         The role of AI, MRI, and ultrasound in diagnosis and mapping
            </Text>
          </View>

          <View style={[globalStyles.bulletRowLight, {marginBottom: spacing.md}]}> 
            <View style={globalStyles.bulletDotAccent} />
            <Text style={globalStyles.bulletText}>
            Multidisciplinary care models for complex endometriosis
            </Text>
          </View>

          <View style={[globalStyles.bulletRowLight, {marginBottom: spacing.md}]}> 
            <View style={globalStyles.bulletDotAccent} />
            <Text style={globalStyles.bulletText}>
            The patient voice—at the heart of clinical decision-making
            </Text>
          </View>

          <Text style={styles.paragraph}>
          Beyond science, we look forward to three days of collaboration, 
          learning, and community-building—culminating with our signature
           Yellow Ribbon Run for Endometriosis Awareness, uniting doctors,
            patients, and the public in one movement of visibility and strength.
      </Text>

      <Text style={styles.paragraph}>
      We warmly invite you to join us in Hyderabad—where tradition meets
       innovation—for a congress that promises to be both intellectually 
       enriching and personally meaningful.
      </Text>

      <Text style={[globalStyles.h2 , {marginBottom: spacing.lg}]}>
      Let’s make endometriosis visible. Let’s make a difference.
      </Text>

          
              <Text style={globalStyles.h2}>
              Warm regards,
              </Text>

              <Text style={globalStyles.h2}>
              The Organising Committee
              </Text>

              <Text style={globalStyles.h2}>
              Endometriosis Foundation of India
              </Text>
          
   </View>
      
 
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  title: {
    fontSize: screenWidth * 0.048,
    fontFamily: Fonts.Bold,
    color: colors.black,
    marginBottom: spacing.sm,
    lineHeight: screenWidth * 0.065,
  },
  details: {
    fontSize: screenWidth * 0.038,
    fontFamily: Fonts.Regular,
    color: colors.black,
    marginBottom: spacing.sm,
  },
  theme: {
    fontSize: screenWidth * 0.038,
    fontFamily: Fonts.Regular,
    color: colors.black,
    marginBottom: spacing.lg,
  },
  themeBold: {
    fontFamily: Fonts.Bold,
  },
  registrationButton: {
    marginBottom: spacing.lg,
  },
  paragraph: {
    fontSize: screenWidth * 0.037,
    fontFamily: Fonts.Regular,
    color: colors.black,
    lineHeight: screenWidth * 0.055,
    marginBottom: spacing.md,
    textAlign: 'left',
  },
});



