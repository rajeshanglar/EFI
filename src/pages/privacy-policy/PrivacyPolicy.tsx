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

interface PrivacyPolicyProps {
  onBack: () => void;
  onNavigateToHome: () => void;
}

const { width: screenWidth } = Dimensions.get('window');

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({
  onBack,
  onNavigateToHome,
}) => {
  return (
    <View style={styles.container}>
      <Header
        title="Privacy Policy"
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
          The Endometriosis Foundation of India ("EFI", "we", "our", or "us") is committed to protecting the privacy and personal information of visitors, donors, participants, healthcare professionals, and users of our website. This Privacy Policy is framed in accordance with applicable Indian laws including the Information Technology Act, 2000, the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, and the Digital Personal Data Protection Act, 2023.
          </Text>

          <Text style={globalStyles.pricacySectionTitle}>1. Information We Collect</Text>
          <Text style={globalStyles.pricacyParagraph}>
          We may collect personal information such as name, email address, phone number,
           Profession, organisation/affiliation, and any information voluntarily shared
            through contact forms, registrations, event sign-ups, donations, or emails.
          </Text>

          <Text style={globalStyles.pricacyParagraph}>
          EFI does not intentionally solicit or require Sensitive Personal Data unless
           explicitly stated for a specific program, initiative, or lawful purpose, with
            appropriate notice and consent.
          </Text>

          <Text style={globalStyles.pricacyParagraph}>
          We also collect limited technical information such as IP address, browser
           type, device information, pages visited, and access time for security and
            performance purposes.
            </Text>


            <Text style={globalStyles.pricacySectionTitle}>2. Purpose of Use</Text>
            <Text style={globalStyles.pricacyParagraph}>
            Information is used for responding to queries, managing registrations and
             events, processing donations, sharing EFI initiatives, improving website
              performance, ensuring security, and complying with legal obligations.
            </Text>


            <Text style={globalStyles.pricacySectionTitle}>3. Cookies & Analytics</Text>
            <Text style={globalStyles.pricacyParagraph}>
            Cookies may be used to enhance user experience and analyse website traffic. 
            Users may disable cookies via browser settings. Aggregated and anonymised
             analytics data may be collected.
            </Text>

            <Text style={globalStyles.pricacySectionTitle}>4. Disclosure</Text>
            <Text style={globalStyles.pricacyParagraph}>
            Information is shared only with trusted service providers, legal 
            authorities if required, or to protect EFI’s rights and integrity.
            </Text>

            <Text style={globalStyles.pricacySectionTitle}>5. Data Retention</Text>
            <Text style={globalStyles.pricacyParagraph}>
            Personal data is retained only as long as necessary or legally required,
             after which it is securely deleted or anonymised.
            </Text>

            <Text style={globalStyles.pricacySectionTitle}>6. Data Security</Text>
            <Text style={globalStyles.pricacyParagraph}>
            EFI adopts reasonable security measures. However, internet
             transmissions cannot be guaranteed fully secure.
            </Text>

          
            <Text style={globalStyles.pricacyParagraph}>
            EFI adopts reasonable security measures. However, internet
             transmissions cannot be guaranteed fully secure.
            </Text>
            

            <Text style={globalStyles.pricacySectionTitle}>7. User Rights</Text>
            <Text style={globalStyles.pricacyParagraph}>
            Users may access, correct, withdraw consent, request deletion of data, and seek grievance redressal subject to applicable law.
            </Text>

            <Text style={globalStyles.pricacySectionTitle}>8. Grievance Redressal</Text>
            <Text style={globalStyles.pricacyParagraph}>
            Grievances may be addressed by contacting EFI at the details below. EFI will endeavour to resolve concerns lawfully and promptly.
            </Text>

            <Text style={globalStyles.pricacySectionTitle}>9. Third-Party Links</Text>
            <Text style={globalStyles.pricacyParagraph}>
            EFI is not responsible for external websites linked from its platform.
            </Text>

            <Text style={globalStyles.pricacySectionTitle}>10. Children’s Privacy</Text>
            <Text style={globalStyles.pricacyParagraph}>
              EFI does not knowingly collect data from children under 18 years.
            </Text>

            <Text style={globalStyles.pricacySectionTitle}>11. Updates</Text>
            <Text style={globalStyles.pricacyParagraph}>
              EFI may update this policy periodically.
            </Text>


            <Text style={globalStyles.pricacySectionTitle}>Contact:</Text>
            <Text style={[globalStyles.pricacyParagraph, {fontFamily: Fonts.SemiBold}]}>
            Endometriosis Foundation of India (EFI)
            </Text>

            <Text style={globalStyles.pricacyParagraph}>
            Email: endometindia@gmail.com
            </Text>

            <Text style={globalStyles.pricacyParagraph}>
            Website: www.endofoundindia.org
            </Text>

            







        
         

        

         

          

  
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

 


});

export default PrivacyPolicy;

