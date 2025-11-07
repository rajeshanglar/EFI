import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import globalStyles, {
  colors,
  spacing,
  Fonts,
} from '../../styles/globalStyles';

const { width: screenWidth } = Dimensions.get('window');

export const PapersCertificationsContent: React.FC = () => {
  return (
    <View>
      <Image
        source={require('../../assets/images/efi-training-img.jpg')}
        style={styles.heroImage}
      />
      <View style={styles.contentSection}>
        <Text style={globalStyles.headingH1}>
          No content available
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
});
