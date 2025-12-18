import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ImageBackground,
  Dimensions,
} from 'react-native';
import Header from '../../../components/Header';
import {
  CalendarIconYellow,
  MapWIcon,
  TimeWIcon,
  WorkshopIcon,
  CardRightArrowIcon,
} from '../../../components/icons';
import globalStyles, {
  colors,
  spacing,
  borderRadius,
  Fonts,
} from '../../../styles/globalStyles';

interface SessionData {
  id: string;
  date: string;
  time: string;
  location: string;
  workshopNumber?: string;
  title: string;
}

interface DigitalPostersProps {
  onBack: () => void;
  onNavigateToHome: () => void;
  sessionData?: SessionData;
  onOpenPoster?: (posterId: string) => void;
}

const mockPosters = [
  { id: 'poster-1', title: 'The Robotic Edge: Precision, Depth & Dexterity' },
  { id: 'poster-2', title: 'The Robotic Edge: Precision, Depth & Dexterity' },
  { id: 'poster-3', title: 'The Robotic Edge: Precision, Depth & Dexterity' },
  { id: 'poster-4', title: 'The Robotic Edge: Precision, Depth & Dexterity' },
];

const DigitalPosters: React.FC<DigitalPostersProps> = ({
  onBack,
  onNavigateToHome,
  sessionData,
  onOpenPoster,
}) => {
  const session = sessionData || {
    id: '1',
    date: 'Monday, March 06, 2025',
    time: '08.00 am - 12:30pm',
    location: 'Hall 1',
    workshopNumber: 'Workshop 1',
    title: 'Robotics in Endometriosis',
  };

  const metadataItems = [
    {
      icon: <MapWIcon size={20} color={colors.primaryLight} />,
      label: session.location,
    },
    {
      icon: <TimeWIcon size={20} color={colors.primaryLight} />,
      label: session.time,
    },
    session.workshopNumber
      ? {
          icon: <WorkshopIcon size={20} color={colors.primaryLight} />,
          label: session.workshopNumber,
        }
      : null,
  ].filter(Boolean) as { icon: React.ReactNode; label: string }[];

  const handlePress = (posterId: string) => {
    onOpenPoster?.(posterId);
  };

  return (
    <View style={styles.container}>
      <Header title="Digital Posters"
       onBack={onBack}
        onNavigateToHome={onNavigateToHome}
         onMenuItemPress={(id: any) => console.log('Menu:', id)} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <ImageBackground
          source={require('../../../assets/images/wave-img.png')}
          style={globalStyles.imgBgContainerWave}
          imageStyle={globalStyles.imgBgWave}
        >
          <View style={globalStyles.metadataCard}>
            <View style={globalStyles.metadataRow}>
              <View style={globalStyles.iconContainer}>
                <CalendarIconYellow size={20} color={colors.primaryLight} />
              </View>
              <Text style={globalStyles.dateText}>{session.date}</Text>
            </View>

            <View style={globalStyles.metadataInfoRow}>
              {metadataItems.map(item => (
                <View style={globalStyles.metadataInfoItem} key={item.label}>
                  {item.icon}
                  <Text style={globalStyles.metadataText}>{item.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </ImageBackground>

        <View style={styles.contentContainer}>
          <View style={styles.grid}>
            {mockPosters.map(poster => (
              <TouchableOpacity
                key={poster.id}
                style={styles.card}
                activeOpacity={0.85}
                onPress={() => handlePress(poster.id)}
              >
                <Image
                  source={require('../../../assets/images/pdfscreen.jpg')}
                  style={styles.posterImage}
                />
                <View style={styles.posterFooter}>
                  <Text style={styles.posterTitle}>{poster.title}</Text>
                  <CardRightArrowIcon size={14} color={colors.black} style={styles.posterArrowIcon} />
                </View>
              </TouchableOpacity>
            ))}
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
  contentContainer: {
    padding: spacing.md,
 
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: spacing.md,
    columnGap: spacing.md,
  },
  card: {
    width: Dimensions.get('window').width * 0.44,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.lightGray,
    backgroundColor: colors.white,
    overflow: 'hidden',
    elevation: 2,
  },
  posterImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  posterFooter: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  posterTitle: {
    flex: 1,
    fontSize: Dimensions.get('window').width * 0.03,
    fontFamily: Fonts.Medium,
    color: colors.black,
    marginRight: spacing.xs,
  },
  posterArrowIcon: {
    marginTop: Dimensions.get('window').height * 0.005,
  },
});

export default DigitalPosters;

