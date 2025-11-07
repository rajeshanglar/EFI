import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { Header } from '../../components/Header';
import globalStyles, { colors, spacing, Fonts } from '../../styles/globalStyles';
import {
  SurgicalIcon,
  AwarenessIcon,
  ResearchIcon,
  MissionIcon,
  VisionIcon,
  ObjectivesIcon,
} from '../../components/icons';

interface AboutUsProps {
  onBack: () => void;
  onNavigateToHome: () => void;
}

const { width: screenWidth } = Dimensions.get('window');

const AboutUs: React.FC<AboutUsProps> = ({ onBack, onNavigateToHome }) => {
  return (
    <View style={styles.container}>
      <Header
        title="About Us"
        onBack={onBack}
        onNavigateToHome={onNavigateToHome}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        <ImageBackground
          source={require('../../assets/images/about-img.jpg')}
          style={styles.headerBackground}
          imageStyle={styles.headerBackgroundImage}
        >
          <View style={styles.headerOverlay}>
            <Text style={styles.headerParagraph}>
            The Endometriosis Foundation of India (EFI) is a national-level nonprofit organization 
            established to transform the landscape of Endometriosis care and
             awareness in India. EFI aims to close the critical gaps in diagnosis,
              treatment, and public understanding of this debilitating disease.
            </Text>
            <Text style={styles.headerHeading}>
              We work across three verticals:
            </Text>
          </View>
        </ImageBackground>

        {/* Three Verticals Section */}
        <View style={styles.verticalsContainer}>
          <View style={styles.verticalItem}>
            <View style={styles.verticalIconContainer}>
              <SurgicalIcon size={40} color={colors.primary} />
            </View>
            <Text style={styles.verticalText}>
              Clinical Excellence & Surgical Training
            </Text>
          </View>

          <View style={styles.verticalItem}>
            <View style={styles.verticalIconContainer}>
              <AwarenessIcon size={40} color={colors.primary} />
            </View>
            <Text style={styles.verticalText}>Awareness & Advocacy</Text>
          </View>

          <View style={styles.verticalItem}>
            <View style={styles.verticalIconContainer}>
              <ResearchIcon size={40} color={colors.primary} />
            </View>
            <Text style={styles.verticalText}>Research & Policy Action</Text>
          </View>
        </View>

        {/* Affiliation Text Section */}
        <View style={styles.affiliationContainer}>
          <Text style={styles.affiliationText}>
            EFI is affiliated with top healthcare institutions and works in close
            collaboration with national and international medical societies,
            universities, NGOs and industry partners.
          </Text>
        </View>

        {/* Mission & Vision Section */}
        <View style={styles.missionVisionContainer}>
          <View style={styles.missionVisionCard}>
            <View style={styles.cardIconContainer}>
              <MissionIcon size={50} color={colors.primary} />
            </View>
            <Text style={styles.cardHeading}>MISSION</Text>
            <Text style={styles.cardText}>
              To lead India's fight against Endometriosis through awareness,
              clinical expertise, and systemic change – including stronger
              policies and healthcare pathways – so that no woman suffers in
              silence again.
            </Text>
          </View>

          <View style={styles.missionVisionCard}>
            <View style={styles.cardIconContainer}>
              <VisionIcon size={50} color={colors.primary} />
            </View>
            <Text style={styles.cardHeading}>VISION</Text>
            <Text style={styles.cardText}>
              To make India a global leader in Endometriosis care and education
              – where every girl, woman, and gender-diverse person receives
              timely diagnosis, compassionate care, and a life without
              unnecessary suffering.
            </Text>
          </View>



          <View style={styles.missionVisionCard}>
          <View style={styles.cardIconContainer}>
            <ObjectivesIcon size={60} color={colors.primary} />
          </View>
            <Text style={styles.cardHeading}>OBJECTIVES</Text>
            <View style={styles.objectivesList}>
            <View style={styles.objectiveRow}>
              <View style={styles.objectiveBullet} />
              <Text style={styles.objectiveText}>
                Raise National Awareness through campaigns, public talks, and
                partnerships with media, corporates, and educational
              </Text>
            </View>

            <View style={styles.objectiveRow}>
              <View style={styles.objectiveBullet} />
              <Text style={styles.objectiveText}>
                Train the Next Generation of surgeons in gold-standard excision
                surgery via programs like EFI-SCOPE.
              </Text>
            </View>

            <View style={styles.objectiveRow}>
              <View style={styles.objectiveBullet} />
              <Text style={styles.objectiveText}>
                Support Patients through resources, guidance, and access to
                expert care.
              </Text>
            </View>

            <View style={styles.objectiveRow}>
              <View style={styles.objectiveBullet} />
              <Text style={styles.objectiveText}>
                Advance Research in diagnosis, surgical outcomes, and disease
                patterns in Indian women.
              </Text>
            </View>

            <View style={styles.objectiveRow}>
              <View style={styles.objectiveBullet} />
              <Text style={styles.objectiveText}>
                Advocate for Policy Change to include Endometriosis in national
                health policies and insurance frameworks.
              </Text>
            </View>

            <View style={styles.objectiveRow}>
              <View style={styles.objectiveBullet} />
              <Text style={styles.objectiveText}>
                Combat Myths & Stigma that delay diagnosis and perpetuate
                neglect.
              </Text>
            </View>
          </View>
          </View>

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
    paddingBottom: spacing.xl,
  },
  headerBackground: {
    width: '100%',
    minHeight: 280,
    justifyContent: 'flex-end',
    marginTop: -spacing.md,
  },
  headerBackgroundImage: {
    resizeMode: 'cover',
 
  },
  headerOverlay: { 
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom:screenWidth * 0.16,

  },
  headerParagraph: {
    fontSize: screenWidth * 0.04,
    fontFamily: Fonts.Medium,
    color: colors.white,
    lineHeight: screenWidth * 0.06,
    marginBottom: spacing.md,
    textAlign: 'left',
  },
  headerHeading: {
    fontSize: screenWidth * 0.044,
    fontFamily: Fonts.SemiBold,
    color: colors.white,
    marginTop: spacing.md,
  },
  verticalsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.sm, 
    paddingBottom: spacing.lg,
    marginTop:screenWidth * -0.1,
    zIndex: 1,
  },
  verticalItem: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: spacing.xs,
  },
  verticalIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 100,
    backgroundColor: colors.primaryLight,
    borderWidth:5,
    borderColor:'#FFF9C3',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  verticalText: {
    fontSize: screenWidth * 0.031,
    fontFamily: Fonts.SemiBold,
    color: colors.black,
    textAlign: 'center',
    lineHeight: screenWidth * 0.04,
  },
  affiliationContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    backgroundColor: colors.white,
    position: 'relative',
    marginBottom:spacing.xl,
  },
  affiliationText: {
    fontSize: screenWidth * 0.04,
    fontFamily: Fonts.Regular,
    color: colors.black,
    lineHeight: screenWidth * 0.058,
    textAlign: 'left',
  },
  missionVisionContainer: {
    // flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
    gap: spacing.sm,
  },
  missionVisionCard: {
    marginBottom:80,
    backgroundColor: colors.white,
    borderRadius: spacing.md,
    padding: spacing.sm,
    paddingBottom: spacing.xl,
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    borderWidth: 5,
    borderColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
    marginTop:screenWidth * -0.12,
  },
  cardHeading: {
    fontSize: screenWidth * 0.042,
    fontFamily: Fonts.Bold,
    color: colors.black,   
    textAlign: 'center',
  },
  cardText: {
    fontSize: screenWidth * 0.034,
    fontFamily: Fonts.Regular,
    color: colors.black,
    lineHeight: screenWidth * 0.052,
    textAlign: 'center',
  },
  objectivesContainer: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: spacing.md,
    padding: spacing.sm,
    marginHorizontal:spacing.md,
    paddingBottom: spacing.xl,
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  objectivesIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary,
    borderWidth: 3,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  objectivesHeading: {
    fontSize: screenWidth * 0.044,
    fontFamily: Fonts.Bold,
    color: colors.black,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  objectivesList: {
    width: '100%',
    gap: spacing.md,
  },
  objectiveRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.sm,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  objectiveBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.darkGray,
    marginTop: spacing.xs + 2,
  },
  objectiveText: {
    flex: 1,
    fontSize: screenWidth * 0.036,
    fontFamily: Fonts.Regular,
    color: colors.darkGray,
    lineHeight: screenWidth * 0.055,
  },
});

export default AboutUs;

