import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Linking,
} from 'react-native';
import Header from '../../components/Header';
import globalStyles, {
  colors,
  spacing,
  borderRadius,
  Fonts,
} from '../../styles/globalStyles';

interface EndoCongressProps {
  onBack: () => void;
  onNavigateToHome: () => void;
}

const { width: screenWidth } = Dimensions.get('window');

const contactEmail = 'contact@endometriosisfoundation.in';
const contactPhone = '+91-9000000000';

const EndoCongress: React.FC<EndoCongressProps> = ({
  onBack,
  onNavigateToHome,
}) => {
  const handleEmailPress = () => {
    const url = `mailto:${contactEmail}`;
    Linking.openURL(url).catch(() => {
      console.warn('Unable to open mail client');
    });
  };

  const handlePhonePress = () => {
    const url = `tel:${contactPhone}`;
    Linking.openURL(url).catch(() => {
      console.warn('Unable to initiate call');
    });
  };

  return (
    <View style={styles.container}>
      <Header title="Endo Congress"
       onBack={onBack}
        onNavigateToHome={onNavigateToHome}
         onMenuItemPress={(id: any) => console.log('Menu:', id)} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
       

        <View style={globalStyles.section}>
          <Text
            style={[
              globalStyles.headingH1,
              { textAlign: 'center', fontSize: screenWidth * 0.053, marginBottom: spacing.md },
            ]}
          >
            Endometriosis India Congress
          </Text>

          <Text style={[globalStyles.h2, { marginBottom: spacing.sm }]}>
          A Global Platform for Clinical Excellence, Surgical Innovation, and Public Advocacy
          </Text>

          <Text style={globalStyles.paragraphP}>
          The Endometriosis India Congress, launched in 2023 by the Endometriosis Foundation of India (EFI), is a flagship biennial event that brings together the world’s leading minds in the field of Endometriosis care, surgery, research, and advocacy.
         </Text>

         <Text style={globalStyles.paragraphP}>
         Spanning three impactful days, the Congress offers a dynamic blend of education, clinical training, public engagement, and cutting-edge scientific exchange.
         </Text>

         <View style={[globalStyles.sectionCardBlue, { marginTop: spacing.md }]}>
          <Text style={[globalStyles.headingH1, globalStyles.whiteColor]}>Congress Format</Text>

          <View style={globalStyles.mb20}>
             <Text style={[globalStyles.h2, globalStyles.primaryLightColor]}>Day 1 – Pre-Congress Workshops & Public Awareness Events</Text>
             <Text style={[globalStyles.paragraphP, globalStyles.whiteColor]}>
             The first day is dedicated to in-depth hands-on workshops for clinicians and surgeons, including advanced training in laparoscopic and robotic excision techniques.
              </Text>
          </View>

          <View style={globalStyles.mb20}>
             <Text style={[globalStyles.h2, globalStyles.whiteColor]}>
             Public awareness initiatives
              </Text>
             <Text style={[globalStyles.paragraphP, globalStyles.whiteColor]}>
             aim to educate and empower patients, caregivers, the common public and the broader community about Endometriosis, breaking the silence around this debilitating disease.
             </Text>
          </View>

          <View>
             <Text style={[globalStyles.h2, globalStyles.primaryLightColor]}>
             Day 2 & 3 – Scientific Conference
              </Text>
             <Text style={[globalStyles.paragraphP, globalStyles.whiteColor]}>
             The main conference spans two days, featuring:
              </Text>
          </View>

          <View style={globalStyles.bulletRowLight}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletTextLight}>
              Live Laparoscopic & Robotic Endometriosis Excision Surgeries
              </Text>
          </View>

          <View style={globalStyles.bulletRowLight}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletTextLight}>
              Expert Presentations on surgical strategies, diagnostics, pain management, fertility, adolescent care, and multidisciplinary approaches.
              </Text>
          </View>

          <View style={globalStyles.bulletRowLight}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletTextLight}>
              Research Showcases presenting the latest innovations and clinical studies from around the globe.
              </Text>
          </View>

          <View style={globalStyles.bulletRowLight}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletTextLight}>
              Panel Discussions & Case Reviews with global experts.
              </Text>
          </View>

         

    



        </View>
         
        </View>

    
        <View style={globalStyles.section}>
        <View style={globalStyles.cardWhite}>
          <Text style={[globalStyles.headingH1, { marginBottom: spacing.md }]}>
          Global Participation and Reach
          </Text>


  <Text style={[globalStyles.paragraphP, { marginBottom: spacing.md }]}>
  Since its inception, the Endometriosis India Congress has rapidly gained international acclaim. The last two editions witnessed:
</Text>


          <View style={[globalStyles.bulletRowLight,{ marginBottom: spacing.md }]} >
            <View style={globalStyles.bulletDotAccent} />
            <Text style={globalStyles.bulletText}>Participation from over <Text style={globalStyles.bold}>50+ countries</Text>
            </Text>
          </View>

          <View style={[globalStyles.bulletRowLight,{ marginBottom: spacing.md }]} >
            <View style={globalStyles.bulletDotAccent} />
            <Text style={globalStyles.bulletText  }>
            A lineup of <Text style={globalStyles.bold}>100+ distinguished speakers</Text> and faculty
            </Text>
          </View>

          <View style={[globalStyles.bulletRowLight,{ marginBottom: spacing.md }]} >
            <View style={globalStyles.bulletDotAccent} />
            <Text style={globalStyles.bulletText  }>
            Attendance by leading <Text style={globalStyles.bold}>surgeons, gynecologists, pain specialists, researchers,</Text>and  <Text style={globalStyles.bold}>advocates</Text>
          
            </Text>
          </View>
          
          
          
        </View>

        <Text style={[globalStyles.paragraphP, {marginTop: spacing.md, marginBottom: spacing.md }]}>
        As the only dedicated international congress on endometriosis hosted from India, it reflects EFI's commitment to advancing care through  
         <Text style={globalStyles.bold}> knowledge sharing, capacity building, and global collaboration.</Text>
        </Text>

        <Text style={globalStyles.paragraphP}>
        Join us in reshaping the future of endometriosis care — one congress at a time.
        </Text>
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
    paddingBottom: spacing.xxl,
  },
 
});

export default EndoCongress;


