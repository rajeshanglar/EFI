import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { colors, spacing, borderRadius, Fonts } from '../../../styles/globalStyles';
import { GradientButton } from '../../../components/GradientButton';
import { EmailIcon } from '../../../components/icons';

const { width: screenWidth } = Dimensions.get('window');

export const AbstractsContent: React.FC = () => {
  const handleSubmitAbstract = () => {
    console.log('Submit Abstract pressed');
    // Navigate to abstract submission page
  };

  const handleEmailPress = () => {
    console.log('Email pressed');
    // Open email client
  };

  return (
    <View style={styles.container}>
      {/* Abstract Submission Section */}
      <Text style={styles.sectionTitle}>
        Abstract Submission – Endometriosis India Congress 2026
      </Text>
      <Text style={styles.paragraph}>
        We invite researchers, clinicians, surgeons, and advocates to submit abstracts for
        the Endometriosis India Congress 2026, to be held from March 6-8, 2026, at Park
        Hyatt, Hyderabad. This meeting brings together experts to share research,
        innovations, and insights in endometriosis and adenomyosis care.
      </Text>

      <GradientButton
        title="Submit Abstract"
        onPress={handleSubmitAbstract}
        style={styles.submitButton}
      />

      {/* Important Dates Section */}
      <Text style={styles.sectionTitle}>Important Dates</Text>
      <View style={styles.dateItem}>
        <Text style={styles.dateText}>
          Abstract Submission Deadline{' '}
          <Text style={styles.dateBold}>30th November 2025</Text>
        </Text>
      </View>
      <View style={styles.dateItem}>
        <Text style={styles.dateText}>
          Notification of Acceptance{' '}
          <Text style={styles.dateBold}>15th January 2026</Text>
        </Text>
      </View>
      <View style={styles.dateItem}>
        <Text style={styles.dateText}>
          Final Work Submission (PPT or Video){' '}
          <Text style={styles.dateBold}>10th February 2026</Text>
        </Text>
      </View>
      <View style={styles.dateItem}>
        <Text style={styles.dateText}>
          Registration Deadline for Presenting Authors{' '}
          <Text style={styles.dateBold}>31st December 2025</Text>
        </Text>
      </View>

      {/* Presentation Categories Section */}
      <Text style={styles.sectionTitle}>Presentation Categories</Text>
      <Text style={styles.paragraph}>
        You may submit your abstract in one of the following formats:
      </Text>
      <View style={styles.categoryItem}>
        <Text style={styles.categoryText}>• Oral Presentation</Text>
      </View>
      <View style={styles.categoryItem}>
        <Text style={styles.categoryText}>• Video Presentation</Text>
      </View>
      <View style={styles.categoryItem}>
        <Text style={styles.categoryText}>• E-Poster Presentation</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          The Scientific Committee reserves the right to assign the final format of
          presentation.
        </Text>
      </View>

      {/* Contact Us Section */}
      <Text style={styles.sectionTitle}>Contact Us</Text>
      <Text style={styles.paragraph}>
        If you have any queries, feel free to reach out:
      </Text>

      <TouchableOpacity style={styles.emailButton} onPress={handleEmailPress}>
        <EmailIcon size={20} color={colors.white} />
        <Text style={styles.emailText}>ENDOINDIA2026@GMAIL.COM</Text>
      </TouchableOpacity>

      <Text style={styles.closingText}>
        We look forward to showcasing your work at #EndoIndia2026 and celebrating
        innovation and collaboration in endometriosis care.
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
