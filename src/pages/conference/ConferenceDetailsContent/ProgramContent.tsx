import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { colors, spacing, borderRadius, Fonts } from '../../../styles/globalStyles';
import { GradientButton } from '../../../components/GradientButton';

const { width: screenWidth } = Dimensions.get('window');

export const ProgramContent: React.FC = () => {
  const handleRegistrationPress = () => {
    console.log('Registration Details pressed');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Endometriosis India Congress 2026</Text>
      <Text style={styles.details}>March 6–8 | Park Hyatt, Hyderabad, India</Text>
      <Text style={styles.theme}>
        Theme: <Text style={styles.themeBold}>Invisible No More</Text>
      </Text>

      <GradientButton
        title="Registration Details"
        onPress={handleRegistrationPress}
        style={styles.registrationButton}
      />

      <Text style={styles.paragraph}>
        Welcome to the 3rd edition of the Endometriosis India Congress. We are excited to
        bring together clinicians, researchers, advocates, and patients from across India
        and around the world for this landmark event. Mark your calendars for March 6-8,
        2026, and join us in Hyderabad, India, at Park Hyatt for three days of learning,
        collaboration, and innovation.
      </Text>

      <Text style={styles.paragraph}>
        Under the theme "Invisible No More," we aim to break the silence around
        endometriosis and bring this often-overlooked condition to the forefront of
        women's health. Our congress will focus on clinical practice, research, patient
        advocacy, innovation, and pathways toward earlier diagnosis, better treatment, and
        holistic care.
      </Text>

      <Text style={styles.paragraph}>
        Our multidisciplinary program will feature Live Ultrasound, live robotic and
        laparoscopic surgeries, pre-congress workshops on imaging (Ultrasound and MRI),
        infertility, robotics, deep endometriosis, and high-impact lectures from renowned
        national and international experts.
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



