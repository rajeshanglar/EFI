import React from 'react';
import { View, Text, StyleSheet, ScrollView,  ImageBackground, Dimensions } from 'react-native';
import { Header } from '../../components/Header';
import { colors, spacing, borderRadius, Fonts, globalStyles } from '../../styles/globalStyles';
import { MapIcon, PhoneIcon, EmailIcon, RecentQuestionsIcon } from '../../components/icons';

interface ContactUsProps {
  onBack: () => void;
  onNavigateToHome: () => void;
}

const { width: screenWidth } = Dimensions.get('window');

const ContactUs: React.FC<ContactUsProps> = ({ onBack, onNavigateToHome }) => {
  return (
    <View style={styles.container}>
      <Header
        title="Contact us"
        onBack={onBack}
        onNavigateToHome={onNavigateToHome}
      />
<View style={styles.containerFullWidth}>
<ImageBackground
          source={require('../../assets/images/ribbon-color-img.png')}
          style={globalStyles.bgBottomRibbon}
          imageStyle={globalStyles.bgBottomRibbonImage}
        />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MapIcon size={28} color={colors.primary} />
            <Text style={styles.cardTitle}>Our Location</Text>
          </View>
          <Text style={styles.cardDescription}>
            Aparna – Astute Senore Colony, Aparna Senore Valley Villas, Ambedkar
            Nagar, Film Nagar, Hyderabad - 08
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <PhoneIcon size={28} color={colors.primary} />
            <Text style={styles.cardTitle}>Phone</Text>
          </View>
          <Text style={styles.cardDescription}>+91 9100014632</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <EmailIcon size={28} color={colors.primary} />
            <Text style={styles.cardTitle}>Email</Text>
          </View>
          <Text style={styles.cardDescription}>endometindia@gmail.com</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <RecentQuestionsIcon size={28} color={colors.primary} />
            <Text style={styles.cardTitle}>Work Hours</Text>
          </View>
          <Text style={styles.cardDescription}>Mon – Sat: 9:00 – 18:00</Text>
          <Text style={styles.cardDescription}>Sunday : Emergency</Text>
        </View>
      </ScrollView>
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: colors.white,
  },

  containerFullWidth:{
    width: '100%',
    flex: 1,
    position: 'relative',
  },
  scrollView: {
    flex: 1,

  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  card: {
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    gap: spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  cardTitle: {
    fontSize: screenWidth * 0.045,
    fontFamily: Fonts.SemiBold,
    color: colors.primary,
  },
  cardDescription: {
    fontSize: screenWidth * 0.038,
    fontFamily: Fonts.Medium,
    color: colors.primary,
    lineHeight: screenWidth * 0.056,
  },
});

export default ContactUs;


