import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import Header from '../../components/Header';
import globalStyles, { colors, spacing, Fonts } from '../../styles/globalStyles';

interface TermsAndConditionsProps {
  onBack: () => void;
  onNavigateToHome: () => void;
}

const { width: screenWidth } = Dimensions.get('window');

const TermsAndConditions: React.FC<TermsAndConditionsProps> = ({
  onBack,
  onNavigateToHome,
}) => {
  return (
    <View style={styles.container}>
      <Header
        title="Terms and Conditions"
        onBack={onBack}
        onNavigateToHome={onNavigateToHome}
        onMenuItemPress={(id: any) => console.log('Menu:', id)}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentContainer}>
      
        <Text style={[globalStyles.pricacySectionTitle, {marginTop:0}]}>Endometriosis Foundation of India (EFI)</Text>
        <Text style={globalStyles.pricacyParagraph}>
        By accessing this website, you agree to comply with these Terms of Use.
        </Text>

        <Text style={globalStyles.pricacySectionTitle}>1. Purpose of Website</Text>
        <Text style={globalStyles.pricacyParagraph}>
        This website is intended for awareness, education, advocacy, and information related to Endometriosis and women’s health. 
        </Text>

        <Text style={globalStyles.pricacySectionTitle}>2. No Medical Advice</Text>
        <Text style={globalStyles.pricacyParagraph}>
        Content on this website is not a substitute for professional medical consultation, diagnosis, or treatment.
        </Text>

        <Text style={globalStyles.pricacySectionTitle}>3. Intellectual Property</Text>
        <Text style={globalStyles.pricacyParagraph}>
        All content belongs to EFI unless otherwise stated. No content may
         be reused without written permission.
        </Text>

        <Text style={globalStyles.pricacySectionTitle}>4. User Conduct  </Text>
        <Text style={globalStyles.pricacyParagraph}>
        Users shall not misuse content, upload misleading information,
         or attempt to disrupt website operations.
        </Text>

        <Text style={globalStyles.pricacySectionTitle}>5. Limitation of Liability</Text>
        <Text style={globalStyles.pricacyParagraph}>
        EFI is not liable for any loss arising from use or reliance on website content.
        </Text>

        <Text style={globalStyles.pricacySectionTitle}>6. Governing Law</Text>
        <Text style={globalStyles.pricacyParagraph}>
        These terms are governed by the laws of India. Jurisdiction shall lie in Indian courts.
        </Text>


        <Text style={globalStyles.pricacySectionTitle}>Contact: endometindia@gmail.com</Text>


        
          


         
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
  contentContainer: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
  },
  lastUpdated: {
    fontSize: screenWidth * 0.032,
    fontFamily: Fonts.Regular,
    color: colors.darkGray,
    marginBottom: spacing.xl,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: screenWidth * 0.042,
    fontFamily: Fonts.Bold,
    color: colors.primary,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  subSectionTitle: {
    fontSize: screenWidth * 0.038,
    fontFamily: Fonts.SemiBold,
    color: colors.darkGray,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  paragraph: {
    fontSize: screenWidth * 0.036,
    fontFamily: Fonts.Regular,
    color: colors.black,
    lineHeight: screenWidth * 0.055,
    marginBottom: spacing.md,
  },
 
  contactInfo: {
    fontSize: screenWidth * 0.036,
    fontFamily: Fonts.Medium,
    color: colors.primary,
    lineHeight: screenWidth * 0.055,
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
});

export default TermsAndConditions;

