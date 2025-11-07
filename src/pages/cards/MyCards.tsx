import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  FlatList,
  ImageBackground,
} from 'react-native';
import { Header } from '../../components/Header';
import globalStyles, { colors, spacing, borderRadius, Fonts } from '../../styles/globalStyles';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface MyCardsProps {
  onBack: () => void;
  onNavigateToHome: () => void;
}

interface CardData {
  id: string;
  referenceNumber: string;
    name: string;
    title: string;
    address: string;
  affiliation: string;
}

const MyCards: React.FC<MyCardsProps> = ({
  onBack,
  onNavigateToHome,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  // Mock card data - Replace with actual data from context/store
  const cardsData: CardData[] = [
    {
      id: '1',
      referenceNumber: 'EFON2243',
      title: '3rd Edition of Endometriosis Congress',
      address: '6, 7 & 8 MARCH 2026, Park Hyatt, Hyderabad',
      name: 'Hitesh Bharadwaj',
      affiliation: 'Max Super Speciality Hospital',
    },
    {
      id: '2',
      referenceNumber: 'EFON2244',
      title: 'Training Session',
      address: '6, 7 & 8 MARCH 2026, Park Hyatt, Hyderabad',
      name: 'Hitesh Bharadwaj',
      affiliation: 'City Hospital',
    },
    {
      id: '3',
      referenceNumber: 'EFON2245',
      title: 'Training Session',
      address: '6, 7 & 8 MARCH 2026, Park Hyatt, Hyderabad',
      name: 'Hitesh Bharadwaj',
      affiliation: 'Medical Center',
    },
  ];

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / (screenWidth - spacing.md * 2 - spacing.lg * 2));
    setCurrentIndex(index);
  };

  const renderCard = ({ item }: { item: CardData }) => (
    <View style={styles.cardContainer}>
       
      <View style={styles.card}>
        {/* Dark Blue Top Section */}
        <View style={globalStyles.qrHeader}>
        <View style={globalStyles.qrHeaderContent}>
          <View style={globalStyles.qrLogoContainer}>
            <Image source={require('../../assets/images/logo-w.png')} style={globalStyles.qrLogo} />
          </View>
          <View style={globalStyles.qrDivider} />
          <View style={globalStyles.qrConferenceInfo}>
            <Text style={[globalStyles.qrConferenceTitle, styles.myQrTitle]}>{item.title}</Text>
            <Text style={globalStyles.qrConferenceDetails}>{item.address}</Text>
          </View>
        </View>
      </View>

        {/* White Bottom Section */}
        <View style={styles.cardBody}>
          <Text style={globalStyles.qrReferenceNumber}>{item.referenceNumber}</Text>
          
          <View style={styles.qrCodeContainer}>
            <Image
              source={require('../../assets/images/qrcode-img.png')}
              style={styles.qrCode}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.cardName}>{item.name}</Text>
          <Text style={styles.cardAffiliation}>{item.affiliation}</Text>
        </View>
      </View>
    </View>
  );

  const renderPaginationDots = () => (
    <View style={styles.paginationContainer}>
      {cardsData.map((_, index) => (
        <View
          key={index}
          style={[
            styles.paginationDot,
            index === currentIndex && styles.paginationDotActive,
          ]}
        />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <Header
        title="My Cards"
        onBack={onBack}
        onNavigateToHome={onNavigateToHome}
      />
      <View style={styles.contentContainer}>
      <ImageBackground
          source={require('../../assets/images/ribbon-color-img.png')}
          style={globalStyles.bgBottomRibbon}
          imageStyle={globalStyles.bgBottomRibbonImage}
        />
        <FlatList
          ref={flatListRef}
          data={cardsData}
          renderItem={renderCard}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={styles.flatListContent}
          snapToInterval={screenWidth - spacing.md * 2 - spacing.lg * 2}
          decelerationRate="fast"
        />
        {renderPaginationDots()}
      </View> 
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  contentContainer: {
    flex: 1,
    position: 'relative',
  },
  myQrTitle: {
 fontSize: screenWidth * 0.037,

  },
  flatListContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  cardContainer: {
    width: screenWidth - spacing.md * 2 - spacing.lg * 2,
    marginRight: spacing.lg,
    paddingTop: spacing.xl,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },

  cardBody: {
    backgroundColor: colors.white,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
  },

  qrCodeContainer: {
    width: 180,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  qrCode: {
    width: '100%',
    height: '100%',
  },
  cardName: {
    fontSize: screenWidth * 0.044,
    fontFamily: Fonts.Bold,
    color: colors.black,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  cardAffiliation: {
    fontSize: screenWidth * 0.036,
    fontFamily: Fonts.Regular,
    color: colors.black,
    textAlign: 'center',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    marginBottom: spacing.xl,
  },
  paginationDot: {
    width: 20,
    height: 20,
    borderRadius:100,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.gray,
    marginHorizontal: spacing.xs,
  },
  paginationDotActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

});

export default MyCards;
