import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, ScrollView } from 'react-native';
import globalStyles, {
  colors,
  spacing,
  borderRadius,
  Fonts,
} from '../../styles/globalStyles';

const { width: screenWidth } = Dimensions.get('window');

export const EFIMasterclassContent: React.FC = () => {
  return (
    <View>
      <Image
        source={require('../../assets/images/efi-training-img.jpg')}
        style={styles.heroImage}
      />
      <View style={styles.contentSection}>
        <Text style={globalStyles.headingH1}>
          EFI MASTERCLASS on Robotic / Laparoscopic Surgery in Endometriosis
        </Text>

        <Text style={globalStyles.paragraphP}>
          Launched in 2023 by the Endometriosis Foundation of India (EFI), the EFI Masterclass is a pioneering training initiative designed to empower surgeons with advanced skills in both robotic and laparoscopic excision techniques for Endometriosis.
        </Text>

        <Text style={globalStyles.paragraphP}>
          This immersive, hands-on program provides participants with a unique opportunity to train under expert guidance using cutting-edge surgical technology. The curriculum emphasizes real-world, precision-based approaches tailored to the complexities of excising endometriosis — especially deep infiltrating disease.
        </Text>
      </View>

      <View style={globalStyles.sectionCardLightYellow}>
        <Text style={globalStyles.headingH1}>Masterclass Fee:</Text>
        <Text style={globalStyles.taglineH5}>For two day masterclass</Text>

        <View style={globalStyles.feeCard}>
          <View style={globalStyles.feeRow}>
            <Text style={globalStyles.feeLabel}>EFI member</Text>
            <Text style={globalStyles.feeAmount}>₹ 25,000</Text>
          </View>
        </View>

        <View style={globalStyles.feeCard}>
          <View style={globalStyles.feeRow}>
            <Text style={globalStyles.feeLabel}>Non-member</Text>
            <Text style={globalStyles.feeAmount}>₹ 35,000</Text>
          </View>
          <Text style={globalStyles.feeNote}>
            Upon registration, non-members will automatically be granted lifetime membership with EFI
          </Text>
        </View>
      </View>

      <View style={styles.contentSection}>
        <View style={styles.sectionWhiteBulletCard}>
          <Text style={[globalStyles.headingH1, { marginBottom: spacing.md }]}>
            Key Highlights of the EFI Masterclass
          </Text>

          <View style={styles.bulletRow}>
            <View style={styles.bulletDot} />
            <Text style={styles.bulletText}>
            Live Robotic Surgery Experience – Observe and engage with expert-performed robotic excision surgeries.
            </Text>
          </View>

          <View style={styles.bulletRow}>
            <View style={styles.bulletDot} />
            <Text style={styles.bulletText}>
            Live Laparoscopic Surgery Experience – In-theatre learning during real-time laparoscopic procedures.
            </Text>
          </View>

          <View style={styles.bulletRow}>
            <View style={styles.bulletDot} />
            <Text style={styles.bulletText}>
            Hands-On Microwave Ablation Training on Wet Tissue – Gain tactile experience in energy-based excision techniques.
            </Text>
          </View>

          <View style={styles.bulletRow}>
            <View style={styles.bulletDot} />
            <Text style={styles.bulletText}>
            Stapler Firing on Wet Tissue Models – Practical exposure to stapling technologies in controlled simulation.
            </Text>
          </View>
        </View>

        <Text style={globalStyles.paragraphP}>
        Through this robust surgical training, EFI aims to build a skilled community of endometriosis specialists across India and beyond — raising the standard of care and improving long-term outcomes for patients.
        </Text>
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
    gap: spacing.lg,
  },

  sectionWhiteBulletCard: {},
  bulletRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
    backgroundColor: colors.white,
    marginBottom: spacing.md,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 3,
  },
  bulletDot: {
    width: 20,
    height: 20,
    borderRadius: 100,
    backgroundColor: colors.accent,
    marginTop: spacing.xs,
  },
  bulletText: {
    flex: 1,
    fontSize: screenWidth * 0.036,
    fontFamily: Fonts.Regular,
    color: colors.darkGray,
    lineHeight: screenWidth * 0.055,
  },
});
