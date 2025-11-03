import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  ScrollView,
  ImageSourcePropType,
} from 'react-native';
import { colors, spacing, borderRadius, Fonts } from '../../../styles/globalStyles';

const { width: screenWidth } = Dimensions.get('window');

interface VideoItem {
  id: string;
  title: string;
  thumbnail: ImageSourcePropType;
}

interface VideosContentProps {
  videos?: VideoItem[];
  onVideoPress?: (videoId: string) => void;
}

export const VideosContent: React.FC<VideosContentProps> = ({
  videos = [],
  onVideoPress,
}) => {
  // Default videos data
  const defaultVideos: VideoItem[] = [
    {
      id: '1',
      thumbnail: require('../../../assets/images/membership-exclusive-access-img.jpg'),
      title: 'Characterizing the Genetic and Biological...',
    },
    {
      id: '2',
      thumbnail: require('../../../assets/images/membership-exclusive-access-img.jpg'),
      title: 'Characterizing the Genetic and Biological...',
    },
    {
      id: '3',
      thumbnail: require('../../../assets/images/membership-exclusive-access-img.jpg'),
      title: 'Characterizing the Genetic and Biological...',
    },
    {
      id: '4',
      thumbnail: require('../../../assets/images/membership-exclusive-access-img.jpg'),
      title: 'Characterizing the Genetic and Biological...',
    },
    {
      id: '5',
      thumbnail: require('../../../assets/images/membership-exclusive-access-img.jpg'),
      title: 'Characterizing the Genetic and Biological...',
    },
    {
      id: '6',
      thumbnail: require('../../../assets/images/membership-exclusive-access-img.jpg'),
      title: 'Characterizing the Genetic and Biological...',
    },


    {
      id: '7',
      thumbnail: require('../../../assets/images/membership-exclusive-access-img.jpg'),
      title: 'Characterizing the Genetic and Biological...',
    },
    {
      id: '8',
      thumbnail: require('../../../assets/images/membership-exclusive-access-img.jpg'),
      title: 'Characterizing the Genetic and Biological...',
    },


    {
      id: '9',
      thumbnail: require('../../../assets/images/membership-exclusive-access-img.jpg'),
      title: 'Characterizing the Genetic and Biological...',
    },
    {
      id: '10',
      thumbnail: require('../../../assets/images/membership-exclusive-access-img.jpg'),
      title: 'Characterizing the Genetic and Biological...',
    },
  ];

  const videoList = videos.length > 0 ? videos : defaultVideos;

  const handleVideoPress = (videoId: string) => {
    onVideoPress?.(videoId);
    console.log('Video pressed:', videoId);
  };

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >


      {/* Video Grid */}
      <View style={styles.videoGrid}>
        {videoList.map((video) => (
          <TouchableOpacity
            key={video.id}
            style={styles.videoCard}
            activeOpacity={0.9}
            onPress={() => handleVideoPress(video.id)}
          >
            {/* Video Thumbnail */}
            <View style={styles.thumbnailContainer}>
              <ImageBackground
                source={video.thumbnail}
                style={styles.thumbnail}
                imageStyle={styles.thumbnailImage}
                resizeMode="cover"
              >
                {/* Play Button */}
                <View style={styles.playButtonWrapper}>
                  <View style={styles.playButton}>
                    <View style={styles.playButtonTriangle} />
                  </View>
                </View>
              </ImageBackground>
            </View>

            {/* Video Title */}
            <View style={styles.videoTitleContainer}>
              <Text style={styles.videoTitle} numberOfLines={2}>
                {video.title}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  titleContainer: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  videosTitle: {
    fontSize: screenWidth * 0.06,
    fontFamily: Fonts.Bold,
    color: colors.black,
    marginBottom: spacing.xs,
  },
  titleUnderline: {
    width: 80,
    height: 4,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.sm,
  },
  videoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  videoCard: {
    width: (screenWidth - spacing.md * 3) / 2,
    marginBottom: spacing.lg,
  },
  thumbnailContainer: {
    width: '100%',
    aspectRatio: 16 / 11,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    padding: 3,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: borderRadius.sm,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#6B46C1',
    overflow: 'hidden',
  },
  thumbnailImage: {
    opacity: 0.9,
  },
  playButtonWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 30,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  playButtonTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 14,
    borderTopWidth: 9,
    borderBottomWidth: 9,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: colors.primary,
    marginLeft: 4,
  },
  videoTitleContainer: {
    paddingHorizontal: spacing.xs,
  },
  videoTitle: {
    fontSize: screenWidth * 0.035,
    fontFamily: Fonts.Regular,
    color: colors.black,
    lineHeight: screenWidth * 0.045,
  },
});

