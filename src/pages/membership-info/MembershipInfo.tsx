import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import Header from '../../components/Header';
import globalStyles,{ colors, spacing, Fonts } from '../../styles/globalStyles';

interface MembershipInfoProps {
  onBack: () => void;
  onNavigateToHome: () => void;
}

const { width: screenWidth } = Dimensions.get('window');

const MembershipInfo: React.FC<MembershipInfoProps> = ({
  onBack,
  onNavigateToHome,
}) => {
  return (
    <View style={styles.container}>
      <Header
        title="Membership"
        onBack={onBack}
        onNavigateToHome={onNavigateToHome}
        onMenuItemPress={(id: any) => console.log('Menu:', id)}
      />

<ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={globalStyles.sectionContent}>

          <Text style={globalStyles.headingH1}>Membership for professionals</Text>
        

    


        <View style={[styles.contentCard, {marginTop: spacing.lg}]}>
          <Text style={[globalStyles.headingH1, {marginBottom:spacing.sm,}]}>
          Application Process
          </Text>


          <View style={[globalStyles.bulletRowLight, {marginBottom: spacing.md}]}>
            <View style={globalStyles.bulletDot} />
            <Text style={globalStyles.bulletText}>
            Access to exclusive content such as video recordings of conferences and masterclasses
            </Text>
          </View>

          <View style={[globalStyles.bulletRowLight, {marginBottom: spacing.md}]}>
            <View style={globalStyles.bulletDot} />
            <Text style={globalStyles.bulletText}>
            Participation in training programmes
            </Text>
          </View>

          <View style={[globalStyles.bulletRowLight, {marginBottom: spacing.md}]}>
            <View style={globalStyles.bulletDot} />
            <Text style={globalStyles.bulletText}>
            Reduced fees for annual conferences and paid workshops, teaching programmes and masterclasses
            </Text>
          </View>

          <View style={[globalStyles.bulletRowLight, {marginBottom: spacing.md}]}>
            <View style={globalStyles.bulletDot} />
            <Text style={globalStyles.bulletText}>
            Membership to an exclusive and dedicated endometriosis foundation
            </Text>
          </View>

          <View style={[globalStyles.bulletRowLight, {marginBottom: spacing.md}]}>
            <View style={globalStyles.bulletDot} />
            <Text style={globalStyles.bulletText}>
            Lifetime membership certification
            </Text>
          </View>

          <View style={[globalStyles.bulletRowLight, {marginBottom: spacing.md}]}>
            <View style={globalStyles.bulletDot} />
            <Text style={globalStyles.bulletText}>
            The opportunity to elevate your skills and empower endometriosis management 
            </Text>
          </View>

          <View style={[globalStyles.bulletRowLight, {marginBottom: spacing.md}]}>
            <View style={globalStyles.bulletDot} />
            <Text style={globalStyles.bulletText}>
            Opportunity to be a faculty in future programs

            </Text>
          </View>

          <Text style={[globalStyles.paragraphP, {fontSize: screenWidth * 0.037}]}>Lifetime Membership Fee For Professionals :</Text>
          <Text style={[globalStyles.h2, {fontSize: screenWidth * 0.05, marginTop: spacing.sm}]}>INR 11,800 (Inclusive of GST)</Text>
    
        </View>

        <View style={[globalStyles.sectionCardBlue, { marginTop: spacing.md }]}>
          <Text style={[globalStyles.headingH1, globalStyles.whiteColor]}>Membership for patients & relatives</Text>        
            <Text style={[globalStyles.paragraphP, globalStyles.whiteColor]}>
            Member benefits for patients and relatives:
            </Text>
          <View style={styles.detailBlock}>     
            <View style={globalStyles.bulletRowLight}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletTextLight}>
              Access to medically-accurate endometriosis information
            </Text>
            </View>

            <View style={globalStyles.bulletRowLight}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletTextLight}>
              Involvement in EFI’s specially-designated public awareness programmes
              </Text>
            </View>

            <View style={globalStyles.bulletRowLight}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletTextLight}>
              Inclusion in endometriosis support groups
              </Text>
            </View>

            <View style={globalStyles.bulletRowLight}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletTextLight}>
              Opportunities for patient advocacy collaboration and exchange of ideas

              </Text>
            </View>

            <View style={[globalStyles.bulletRowLight, {marginBottom: spacing.md}]}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletTextLight}>
              Lifetime membership certificate
              </Text>
            </View>

            <Text style={[globalStyles.paragraphP, globalStyles.whiteColor, {fontSize: screenWidth * 0.037}]}>Lifetime Membership Fee For Professionals :</Text>
            <Text style={[globalStyles.h2, globalStyles.whiteColor, {fontSize: screenWidth * 0.05}]}>INR 11,800 (Inclusive of GST)</Text>
          </View>
        </View>
     
    
         <Text style={[globalStyles.headingH1, {marginTop: spacing.md}]}>
         Bank Details:
        </Text> 

<View style={{marginBottom: spacing.md, marginTop: spacing.md}}>
  <Text style={globalStyles.paragraphP}>A/c Name </Text>
  <Text style={globalStyles.h2}>The Endometriosis Foundation Of India</Text>
</View>

<View style={{marginBottom: spacing.sm}}>
  <Text style={globalStyles.paragraphP}>Bank</Text>
  <Text style={globalStyles.h2}>Axis Bank</Text>
</View>

<View style={{marginBottom: spacing.sm}}>
  <Text style={globalStyles.paragraphP}>A/c No</Text>
  <Text style={globalStyles.h2}>922020054548625</Text>
</View>

<View style={{marginBottom: spacing.sm}}>
  <Text style={globalStyles.paragraphP}>IFSC Code</Text>
  <Text style={globalStyles.h2}>UTIB0000030</Text>
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

  detailBlock: {
    gap: spacing.sm,
  },

  contentCard: {
    backgroundColor: colors.white,
    borderRadius: spacing.md,
    padding: spacing.md,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
});

export default MembershipInfo;


