import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import globalStyles, { colors, spacing, Fonts, borderRadius } from '../../../styles/globalStyles';

const { width: screenWidth } = Dimensions.get('window');

export const HostCityContent: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* First Section */}
      <View style={globalStyles.sectionContent}>
        <View style={globalStyles.imageContainerContFull}>
          <Image
            source={require('../../../assets/images/venue/hyderabad-img.jpg')}
            style={globalStyles.imageContFull}
            resizeMode="cover"
          />
        </View>
        <View style={globalStyles.textContainer}>
          <Text style={globalStyles.headingH1}>ABOUT HYDERABAD</Text>
          <Text style={globalStyles.taglineH5}>Where Heritage Meets Innovation</Text>
          <Text style={globalStyles.paragraphP}>
            Hyderabad is a city where centuries-old traditions flow seamlessly into
            tomorrow's breakthroughs. As the host city for the Endometriosis India
            Congress 2026, Hyderabad offers attendees a living experience of India's
            resilience, intellect, and soul. From the echo of minarets to the pulse of
            code, from royal courts to global corporations, Hyderabad bridges eras with
            grace and ambition.
          </Text>
        </View>
      </View>

      {/* Second Section */}
      <View style={globalStyles.sectionContent}>
      <Text style={globalStyles.headingH1}>A City Rooted in Legacy, Rising with Vision</Text>
      <View style={[globalStyles.imageContainer, {paddingTop: spacing.md}]}>
          <Image
            source={require('../../../assets/images/venue/golconda-img.jpg')}
            style={globalStyles.imageContFull}
            resizeMode="cover"
          />
        </View>
        <View style={globalStyles.textContainer}>
         
          <Text style={globalStyles.paragraphP}>
          Founded in the 16th century by the Qutb Shahi dynasty, Hyderabad is a city shaped by time and marked by grandeur. Its historic monuments — like the imposing Golconda Fort and the intricately designed Chowmahalla Palace — are not just landmarks but living chapters of a cultural saga. Today, these majestic structures stand alongside cutting-edge infrastructure, illustrating a city unafraid to honor its past while building its future.
          </Text>
        </View>

      </View>

           {/* Second Section */}
            <View style={globalStyles.sectionContent}>
      <Text style={globalStyles.headingH1}>A Tapestry of Cultures and Celebrations</Text>
      <View style={[globalStyles.imageContainer, {paddingTop: spacing.md}]}>
          <Image
            source={require('../../../assets/images/venue/cultures-img.png')}
            style={globalStyles.imageContFull}
            resizeMode="cover"
          />
        </View>
        <View style={globalStyles.textContainer}>         
          <Text style={globalStyles.paragraphP}>
          Hyderabad’s strength lies in its unity through diversity. Here, cultures converge and communities thrive. Festivals like Bonalu, Eid, and Diwali illuminate the city in vibrant color, joy, and tradition. Art, music, and dance echo through the city’s historic halls and contemporary spaces, creating a cultural rhythm that celebrates every voice.          </Text>
        </View>

           </View>

               {/* Second Section */}
  <View style={globalStyles.sectionContent}>
      <Text style={globalStyles.headingH1}>Flavors That Tell a Story</Text>
      <View style={[globalStyles.imageContainerContFull, {paddingTop: spacing.md}]}>
          <Image
            source={require('../../../assets/images/venue/flavors-img.png')}
            style={globalStyles.imageContFull}
            resizeMode="cover"
          />
        </View>
        <View style={globalStyles.textContainer}>         
          <Text style={globalStyles.paragraphP}>
          No visit to Hyderabad is complete without tasting its culinary soul. The iconic Hyderabadi Biryani, Haleem during Ramadan, and Irani chai served with Osmania biscuits are more than meals — they are heritage on a plate. From fine-dining institutions to spirited street vendors, the city’s cuisine reflects its layered identity and unbroken traditions.                </Text>
        </View>
  </View>

  <View style={globalStyles.sectionContent}>
      <Text style={globalStyles.headingH1}>India’s Emerging Innovation Capital</Text>
      <View style={[globalStyles.imageContainerContFull, {paddingTop: spacing.md}]}>
          <Image
            source={require('../../../assets/images/venue/hitechcity-img.png')}
            style={globalStyles.imageContFull}
            resizeMode="cover"
          />
        </View>
        <View style={globalStyles.textContainer}>         
          <Text style={globalStyles.paragraphP}>
          Home to HITEC City and numerous global tech parks, Hyderabad is among India’s most dynamic centers of innovation. The city has become a magnet for entrepreneurs, tech leaders, and researchers. Its collaborative spirit makes it the perfect backdrop for a medical congress that aims to break boundaries and foster meaningful scientific dialogue.
                                  </Text>
        </View>
  </View>


  <View style={globalStyles.sectionContent}>
      <Text style={globalStyles.headingH1}>An Artistic Heartbeat</Text>
        <View style={[globalStyles.imageContainerContFull , {paddingTop: spacing.md}]}>
          <Image
            source={require('../../../assets/images/venue/ramojifilmcity-img.png')}
            style={globalStyles.imageContFull}
            resizeMode="cover"
          />
        </View>
        <View style={globalStyles.textContainer}>         
          <Text style={globalStyles.paragraphP}>
          Creativity runs deep in Hyderabad — from handcrafted bangles at Laad Bazaar to contemporary exhibits in modern art galleries. As home to Ramoji Film City, one of the world’s largest film production hubs, Hyderabad also stands as a beacon of storytelling, expression, and visual culture.
         </Text>
        </View>
  </View>

  <View style={globalStyles.sectionContent}>
      <Text style={globalStyles.headingH1}>Greenscapes Within the Urban Tapestry</Text>
      <View style={[globalStyles.imageContainerContFull, {paddingTop: spacing.md}]}>
          <Image
            source={require('../../../assets/images/venue/greenscapes-img.png')}
            style={globalStyles.imageContFull}
            resizeMode="cover"
          />
        </View>
        <View style={globalStyles.textContainer}>         
          <Text style={globalStyles.paragraphP}>
          Despite its bustling pace, Hyderabad remains deeply connected to nature. KBR National Park, Durgam Cheruvu, and other green enclaves offer moments of calm and clarity — essential for a city that balances ambition with sustainability. These spaces remind us that wellness is not just clinical — it’s also environmental.
         </Text>
        </View>
  </View>

  <View style={globalStyles.sectionContent}>
      <Text style={globalStyles.headingH1}>A Healthcare Hub with Global Reach</Text>
      <View style={[globalStyles.imageContainer, {paddingTop: spacing.md}]}>
          <Image
            source={require('../../../assets/images/venue/healthcare-excellence-img.png')}
            style={globalStyles.imageContFull}
            resizeMode="cover"
          />
        </View>
        <View style={globalStyles.textContainer}>         
          <Text style={globalStyles.paragraphP}>
          Hyderabad is also recognized for its medical excellence, attracting patients from across the globe. From advanced surgical centers to holistic wellness clinics, the city embodies a progressive approach to health — making it an ideal host for a congress dedicated to transforming women’s healthcare through Endometriosis research, education, and collaboration.
         </Text>
        </View>
  </View>

  <View style={globalStyles.sectionContent}>
      <Text style={globalStyles.headingH1}>Congress Venue: Park Hyatt, Hyderabad</Text>
      <View style={[globalStyles.imageContainer, {paddingTop: spacing.md}]}>
          <Image
            source={require('../../../assets/images/venue/venue-img.jpg')}
            style={globalStyles.imageContFull}
            resizeMode="cover"
          />
        </View>
        <View style={globalStyles.textContainer}>         
          <Text style={globalStyles.paragraphP}>
          Located in the upscale Banjara Hills, Park Hyatt Hyderabad combines refined luxury with cultural depth. Its sleek design, exceptional hospitality, and proximity to major business and cultural hubs make it the perfect setting for high-level engagement. Whether you're attending scientific sessions or building lasting connections, Park Hyatt offers a world-class experience in the heart of one of India’s most captivating cities.
         </Text>
        </View>
  </View>

  <View style={globalStyles.sectionContent}>
      <Text style={globalStyles.headingH1}>Experience Hyderabad. Advance the Future</Text>
      <View style={[globalStyles.imageContainerContFull, {paddingTop: spacing.md}]}>
          <Image
            source={require('../../../assets/images/venue/experiencehyd-img.png')}
            style={globalStyles.imageContFull}
            resizeMode="cover"
          />
        </View>
        <View style={globalStyles.textContainer}>         
          <Text style={globalStyles.paragraphP}>
          As delegates, speakers, researchers, and advocates gather in Hyderabad for the Endometriosis India Congress 2026, they are stepping into a city that mirrors the mission of the event itself: to honor the past, understand the present, and shape a better future. 
         </Text>
        </View>
  </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
 
 
});
