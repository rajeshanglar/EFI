import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, Linking, Alert, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors, spacing, borderRadius, Fonts } from '../../../styles/globalStyles';
import { KmIcon, PhoneWIcon, WebsiteWIcon, MapWIcon, MapIcon } from '../../../components/icons';

const { width: screenWidth } = Dimensions.get('window');

interface AccommodationCard {
  id: string;
  location: string;
  hotelName: string;
  rating: string;
  address: string;
  distanceFromVenue: string;
  distanceFromAirport: string;
  phone: string;
  website: string;
  image: any;
  map: string;
}

const accommodations: AccommodationCard[] = [
  {
    id: '1',
    location: 'Banjara Hills',
    hotelName: 'Taj Krishna',
    rating: '4.7/5',
    address: 'Banjara Hills, Hyderabad, Telangana 500034',
    distanceFromVenue: '2.1 km from Venue',
    distanceFromAirport: '31.4 km from Airport',
    phone: '+919848922232',
    website: 'https://www.tajhotels.com/en-in/hotels/taj-krishna-hyderabad',
    image: require('../../../assets/images/accommodation/tajkrishna-img.jpg'),
    map: 'https://maps.app.goo.gl/gi8K6DxYuw7ZHkU17',
  },
  {
    id: '2',
    location: 'Banjara Hills',
    hotelName: 'The Leela Palace',
    rating: '4.7/5',
    address: 'Banjara Hills, Hyderabad 500034',
    distanceFromVenue: '1.5 km from Venue',
    distanceFromAirport: '31.1 km from Airport',
    phone: '+919867111234',
    website: 'https://www.theleela.com/hotels-in-hyderabad/the-leela-hyderabad',
    image: require('../../../assets/images/accommodation/the-leela-palace-img.png'),
    map: 'https://maps.app.goo.gl/WiYnGMDQmPZs9ihC8',
  },

  {
    id: '3',
    location: 'Begumpet',
    hotelName: 'ITC Kakatiya',
    rating: '4.6/5',
    address: '6-3-1187, Begumpet, Hyderabad 500016',
    distanceFromVenue: '3.7 km from Venue',
    distanceFromAirport: '33.8 km from Airport',
    phone: '+914023400132',
    website: 'https://www.itchotels.com/in/en/itckakatiya-hyderabad',
    image: require('../../../assets/images/accommodation/itc-kakatiya-img.jpg'),
    map: 'https://maps.app.goo.gl/7Bi3YsWTJgFKgLWEA',
  },

  {
    id: '4',
    location: 'Banjara Hills',
    hotelName: 'Taj Deccan',
    rating: '4.5/5',
    address: 'Banjara Hills, Hyderabad, Telangana 500034',
    distanceFromVenue: '1.9 km from Venue',
    distanceFromAirport: '31.6 km from Airport',
    phone: '+914066523939',
    website: 'https://www.tajhotels.com/en-in/hotels/taj-deccan-img.jpg',
    image: require('../../../assets/images/accommodation/taj-deccan-img.jpg'),
    map: 'https://maps.app.goo.gl/Z7fzmef3NhJAxqGw9',
  },

  {
    id: '5',
    location: 'Somajiguda',
    hotelName: 'Mercure Hyderabad',
    rating: '4.4/5',
    address: 'Somajiguda, Hyderabad 500082',
    distanceFromVenue: '3.1 km from Venue',
    distanceFromAirport: '33.2 km from Airport',
    phone: '+914067888888',
    website: 'https://all.accor.com/hotel/8824/index.en.shtml',
    image: require('../../../assets/images/accommodation/mercure-hyderabad-img.jpg'),
    map: 'https://maps.app.goo.gl/vZJ34xn9FuVJbgjs9',
  },

  {
    id: '6',
    location: 'Banjara Hills',
    hotelName: 'Radisson Blu Plaza',
    rating: '4.3/5',
    address: 'Banjara Hills, Hyderabad 500034',
    distanceFromVenue: '2.4 km from Venue',
    distanceFromAirport: '32 km from Airport',
    phone: '+914067331133',
    website: 'https://www.radissonhotels.com/en-us/hotels/radisson-blu-hyderabad-banjara-hills',
    image: require('../../../assets/images/accommodation/radisson-blu-plaza-img.jpg'),
    map: 'https://maps.app.goo.gl/A8fNuSKHvf23dGp46',
  },


  {
    id: '7',
    location: 'Banjara Hills',
    hotelName: 'Hyatt Place',
    rating: '4.2/5',
    address: 'Banjara Hills, Hyderabad 500034',
    distanceFromVenue: '0 km from Venue',
    distanceFromAirport: '31.8 km from Airport',
    phone: '+914067801234',
    website: 'https://www.hyatt.com/hyatt-place/en-US/hydzh-hyatt-place-hyderabad-banjara-hills',
    image: require('../../../assets/images/accommodation/hyatt-place-img.jpg'), 
    map: 'https://maps.app.goo.gl/iy8gqibxtqxDCdUu9',
  },

  {
    id: '8',
    location: 'Begumpet',
    hotelName: 'Hotel GreenPark',
    rating: '4.1/5',
    address: 'Greenlands, Begumpet, Hyderabad 500 016',
    distanceFromVenue: '4.1 km from Venue',
    distanceFromAirport: '34 km from Airport',
    phone: '+914066515151',
    website: 'https://hotelgreenpark.com/hotel-greenpark-hyderabad/',
    image: require('../../../assets/images/accommodation/greenpark-img.jpg'),
    map: 'https://maps.app.goo.gl/N3RN1jjRhq9V77F89',
  },

  {
    id: '9',
    location: 'Begumpet',
    hotelName: 'Marigold by GreenPark',
    rating: '4/5',
    address: 'Greenlands, Begumpet, Hyderabad 500 016',
    distanceFromVenue: '4.3 km from Venue',
    distanceFromAirport: '34.2 km from Airport',
    phone: '+914067363636',
    website: 'https://marigoldhotels.com/',
    image: require('../../../assets/images/accommodation/marigold-greenpark-img.jpg'),
    map: 'https://maps.app.goo.gl/bNw4b1wq13rY7raK9',
  },
];

export const AccommodationContent: React.FC = () => {
  const handleCallNow = async (phone: string) => {
    try {
      // Clean phone number - remove spaces, dashes, and other special characters except +
      const cleanedPhone = phone.replace(/[\s\-\(\)]/g, '');
      const phoneUrl = `tel:${cleanedPhone}`;
      
      // Try to open directly - canOpenURL can be unreliable
      await Linking.openURL(phoneUrl);
    } catch (error) {
      console.error('Error opening phone:', error);
      Alert.alert('Error', 'Unable to open phone dialer. Please check if your device supports phone calls.');
    }
  };

  const handleWebsite = async (url: string) => {
    try {
      // Ensure URL has http:// or https://
      let websiteUrl = url.trim();
      
      if (!websiteUrl.startsWith('http://') && !websiteUrl.startsWith('https://')) {
        websiteUrl = `https://${websiteUrl}`;
      }
      
      // Try to open directly - canOpenURL can be unreliable for web URLs
      await Linking.openURL(websiteUrl);
    } catch (error) {
      console.error('Error opening website:', error);
      Alert.alert('Error', 'Unable to open website. Please check your internet connection.');
    }
  };

  const handleMaps = async (mapUrl: string) => {
    try {
      // Check if it's a Google Maps URL (maps.app.goo.gl or google.com/maps)
      const isGoogleMapsUrl = mapUrl.includes('maps.app.goo.gl') || mapUrl.includes('google.com/maps');
      
      if (isGoogleMapsUrl) {
        // Google Maps URLs will automatically open in Google Maps app if installed
        // Otherwise they'll open in the browser
        await Linking.openURL(mapUrl);
      } else {
        // If it's not a Google Maps URL, treat it as an address
        const encodedAddress = encodeURIComponent(mapUrl);
        
        // Try native maps apps first, then fallback to web
        const nativeMapsUrl = Platform.OS === 'ios' 
          ? `maps://maps.apple.com/?daddr=${encodedAddress}`
          : `geo:0,0?q=${encodedAddress}`;
        
        try {
          await Linking.openURL(nativeMapsUrl);
        } catch (e) {
          // Fallback to web Google Maps
          const webMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
          await Linking.openURL(webMapsUrl);
        }
      }
    } catch (error) {
      console.error('Error opening maps:', error);
      Alert.alert('Error', 'Unable to open maps. Please check your internet connection.');
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
            <Text style={styles.locationName}>{accommodation.location}</Text>
              <Text style={styles.hotelName}>{accommodation.hotelName}</Text>
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
                onPress={() => handleMaps(accommodation.map)}
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
  locationName:{
    fontSize: screenWidth * 0.04,
    fontFamily: Fonts.SemiBold,
    color: colors.white,
   position: 'absolute',
   top:-70,
   left: 0,
   backgroundColor:'rgba(0,0,0,0.5)',
 paddingVertical: spacing.xs,
   paddingHorizontal: spacing.sm,
   borderRadius: borderRadius.sm,
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
