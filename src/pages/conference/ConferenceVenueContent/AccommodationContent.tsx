import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, Linking, Alert, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors, spacing, borderRadius, Fonts } from '../../../styles/globalStyles';
import { KmIcon, PhoneWIcon, WebsiteWIcon, MapWIcon, MapIcon } from '../../../components/icons';

const { width: screenWidth } = Dimensions.get('window');

interface AccommodationCard {
  id: string;
  name: string;
  rating: string;
  address: string;
  distanceFromVenue: string;
  distanceFromAirport: string;
  phone: string;
  website: string;
  image: any;
}

const accommodations: AccommodationCard[] = [
  {
    id: '1',
    name: 'Taj Krishna',
    rating: '4.7/5',
    address: 'Banjara Hills, Hyderabad, Telangana 500034',
    distanceFromVenue: '2.1 km from Venue',
    distanceFromAirport: '31.4 km from Airport',
    phone: '+91-9848922232',
    website: 'https://www.tajhotels.com/en-in/hotels/taj-krishna-hyderabad',
    image: require('../../../assets/images/accommodation/tajkrishna-img.jpg'),
  },
  {
    id: '2',
    name: 'The Leela Palace',
    rating: '4.7/5',
    address: 'Banjara Hills, Hyderabad 500034',
    distanceFromVenue: '1.5 km from Venue',
    distanceFromAirport: '31.1 km from Airport',
    phone: '+91-9867111234',
    website: 'https://www.theleela.com/hotels-in-hyderabad/the-leela-hyderabad',
    image: require('../../../assets/images/accommodation/the-leela-palace-img.png'),
  },
];

export const AccommodationContent: React.FC = () => {
  const handleCallNow = async (phone: string) => {
    try {
      const phoneUrl = `tel:${phone}`;
      const canOpen = await Linking.canOpenURL(phoneUrl);
      if (canOpen) {
        await Linking.openURL(phoneUrl);
      } else {
        Alert.alert('Error', 'Unable to open phone dialer');
      }
    } catch (error) {
      console.error('Error opening phone:', error);
      Alert.alert('Error', 'Unable to make phone call');
    }
  };

  const handleWebsite = async (url: string) => {
    try {
      // Ensure URL has http:// or https://
      const websiteUrl = url.startsWith('http://') || url.startsWith('https://') 
        ? url 
        : `https://${url}`;
      
      const canOpen = await Linking.canOpenURL(websiteUrl);
      if (canOpen) {
        await Linking.openURL(websiteUrl);
      } else {
        Alert.alert('Error', 'Unable to open website');
      }
    } catch (error) {
      console.error('Error opening website:', error);
      Alert.alert('Error', 'Unable to open website');
    }
  };

  const handleMaps = async (address: string) => {
    try {
      // Use Google Maps with directions
      // Format: https://www.google.com/maps/dir/?api=1&destination=<encoded_address>
      const encodedAddress = encodeURIComponent(address);
      const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
      
      // Alternative: Try to open native maps app first
      const nativeMapsUrl = Platform.OS === 'ios' 
        ? `maps://maps.apple.com/?daddr=${encodedAddress}`
        : `geo:0,0?q=${encodedAddress}`;
      
      try {
        // Try native maps first
        const canOpenNative = await Linking.canOpenURL(nativeMapsUrl);
        if (canOpenNative) {
          await Linking.openURL(nativeMapsUrl);
          return;
        }
      } catch (e) {
        // Fall through to web maps
      }
      
      // Fallback to web Google Maps
      const canOpen = await Linking.canOpenURL(mapsUrl);
      if (canOpen) {
        await Linking.openURL(mapsUrl);
      } else {
        Alert.alert('Error', 'Unable to open maps');
      }
    } catch (error) {
      console.error('Error opening maps:', error);
      Alert.alert('Error', 'Unable to open maps');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>ACCOMMODATION NEARBY</Text>
      <Text style={styles.description}>
        Discover premium accommodations near Conference Venue Hyderabad, carefully selected
        for their excellent service, amenities, and convenient locations.
      </Text>

      {accommodations.map((accommodation) => (
        <View key={accommodation.id} style={styles.card}>
          <Image
            source={accommodation.image}
            style={styles.cardImage}
            resizeMode="cover"
          />

          <View style={styles.cardContent}>
            <View style={styles.headerRow}>
              <Text style={styles.hotelName}>{accommodation.name}</Text>
              <View style={styles.ratingContainer}>
                <Text style={styles.star}>⭐</Text>
                <Text style={styles.rating}>{accommodation.rating}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <MapIcon size={24} color={colors.primary} />
              <Text style={styles.infoText}>{accommodation.address}</Text>
            </View>

            <View style={styles.infoRow}>
              <KmIcon size={24} color={colors.primary} />
              <Text style={styles.infoText}>{accommodation.distanceFromVenue}</Text>
            </View>

            <View style={styles.infoRow}>
              <KmIcon size={24} color={colors.primary} />
              <Text style={styles.infoText}>{accommodation.distanceFromAirport}</Text>
            </View>

            <View style={styles.buttonsRow}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleCallNow(accommodation.phone)}
              >
                <LinearGradient
                  colors={[colors.blue, colors.primaryLight]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradient}
                >
                  <PhoneWIcon size={20} color={colors.white} />
                  <Text style={styles.buttonText}>Call Now</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleWebsite(accommodation.website)}
              >
                <LinearGradient
                  colors={[colors.blue, colors.primaryLight]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradient}
                >
                  <WebsiteWIcon size={20} color={colors.primary} />
                  <Text style={styles.buttonText}>Website</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleMaps(accommodation.address)}
              >
                <LinearGradient
                  colors={[colors.blue, colors.primaryLight]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradient}
                >
                  <MapWIcon size={20} color={colors.white} />
                  <Text style={styles.buttonText}>Maps</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },

  gradient: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    marginRight:3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    width: screenWidth * 0.25,    
  },

  heading: {
    fontSize: screenWidth * 0.048,
    fontFamily: Fonts.Bold,
    color: colors.black,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },
  description: {
    fontSize: screenWidth * 0.037,
    fontFamily: Fonts.Regular,
    color: colors.black,
    lineHeight: screenWidth * 0.055,
    marginBottom: spacing.xl,
    textAlign: 'left',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.xl,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: screenWidth * 0.5,
  },
  cardContent: {
    padding: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  hotelName: {
    fontSize: screenWidth * 0.044,
    fontFamily: Fonts.Bold,
    color: colors.black,
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  star: {
    fontSize: screenWidth * 0.038,
  },
  rating: {
    fontSize: screenWidth * 0.037,
    fontFamily: Fonts.SemiBold,
    color: colors.black,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  infoText: {
    fontSize: screenWidth * 0.036,
    fontFamily: Fonts.Regular,
    color: colors.black,
    flex: 1,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  actionButton: {
    
  },



  buttonText: {
    fontSize: screenWidth * 0.032,
    fontFamily: Fonts.SemiBold,
    color: colors.white,
    marginLeft: spacing.xs,
  },
  websiteButtonText: {
    color: colors.primary,
  },
});
