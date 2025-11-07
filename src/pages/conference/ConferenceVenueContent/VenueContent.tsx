import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import { colors, spacing, borderRadius, Fonts } from '../../../styles/globalStyles';
import { GradientButton } from '../../../components/GradientButton';
import { MapWIcon, MapIcon, GetDirectionsIcon } from '../../../components/icons';

const { width: screenWidth } = Dimensions.get('window');

export const VenueContent: React.FC = () => {
  const handleGetDirections = () => {
    console.log('Get Directions pressed');
    // Open maps app with venue location
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/images/venue/venue-img.jpg')}
        style={styles.venueImage}
        resizeMode="cover"
      />

      <View style={styles.content}>
        <Text style={styles.venueTitle}>Park Hyatt Hyderabad, Banjara Hills</Text>

        <Text style={styles.venueDescription}>
          Nestled in the heart of Hyderabad's upscale Banjara Hills, Park Hyatt Hyderabad
          epitomizes luxury and refined elegance. With its striking architecture,
          world-class amenities, and bespoke service, the hotel offers an unparalleled
          experience for discerning guests. Seamlessly blending modern sophistication with
          timeless comfort, Park Hyatt Hyderabad provides a perfect setting for business
          and leisure travelers alike. Its strategic location places it in close proximity
          to major business hubs, shopping districts, and cultural landmarks, making it a
          preferred destination for elite travelers, dignitaries, and global professionals
          alike.
        </Text>
        <View style={styles.buttonContainer}>
        <GradientButton
          title="Get Directions"
          onPress={handleGetDirections}
          icon={
            <View style={styles.iconContainer}>
              <GetDirectionsIcon size={30} color={colors.white} />             
            </View>
          }
        />
      </View>
        
      </View>

      {/* Fixed Get Directions Button */}
     

      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  venueImage: {
    width: '100%',
    height: screenWidth * 0.6,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl + 80, // Extra padding for fixed button
  },
  venueTitle: {
    fontSize: screenWidth * 0.048,
    fontFamily: Fonts.Bold,
    color: colors.black,
    marginBottom: spacing.md,
  },
  venueDescription: {
    fontSize: screenWidth * 0.037,
    fontFamily: Fonts.Regular,
    color: colors.black,
    lineHeight: screenWidth * 0.055,
    textAlign: 'left',
  },
  buttonContainer: {
   marginTop: spacing.md,
    paddingHorizontal: spacing.md,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginRight: spacing.sm,
  },
  smallIcon: {
    marginLeft: -spacing.xs,
  },
});
