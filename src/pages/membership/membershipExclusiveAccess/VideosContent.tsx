import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  FlatList,
  ActivityIndicator,
  Image,
  Linking,
  Modal,
} from 'react-native';
import YoutubePlayer from "react-native-youtube-iframe";
import { WebView } from "react-native-webview";
import { colors, spacing, borderRadius, Fonts } from '../../../styles/globalStyles';
import { GetVideos } from '../../../services/membershipService';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface Video {
  id: number;
  title: string;
  description: string;
  video_link: string;
  video_thumbnail_url: string | null;
}

interface VideosContentProps {
  onVideoPress?: (videoId: string | number, videoLink?: string) => void;
}

export const VideosContent: React.FC<VideosContentProps> = ({
  onVideoPress,
}) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const perPage = 10;
  const defaultThumbnail = require('../../../assets/images/membership-exclusive-access-img.jpg');

  // Extract YouTube video ID - handles multiple URL formats
  const getVideoId = (url: string): string => {
    if (!url) return "";
    
    // Handle different YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/.*[?&]v=([^&\n?#]+)/,
      /youtu\.be\/([^&\n?#]+)/,
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    return "";
  };

  // Open fullscreen YouTube overlay
  const openPlayer = (url: string) => {
    setSelectedVideoUrl(url);
  };

  // Close overlay
  const closePlayer = () => {
    setSelectedVideoUrl(null);
  };

  const loadVideos = useCallback(async (page: number, append: boolean = false) => {
    try {
      if (append) setLoadingMore(true);
      else setLoading(true);

      const result = await GetVideos(page, perPage);
      const newVideos = result?.data?.videos || [];
      const pagination = result?.data?.pagination;

      if (append) {
        setVideos(prev => [...prev, ...newVideos]);
      } else {
        setVideos(newVideos);
      }

      setCurrentPage(pagination?.current_page || 1);
      setHasNextPage(pagination?.has_next_page || false);
    } catch (err: any) {
      setError("Failed to load videos.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    loadVideos(1, false);
  }, []);

  const handleLoadMore = () => {
    if (!loadingMore && hasNextPage) {
      loadVideos(currentPage + 1, true);
    }
  };

  const handleVideoPress = (video: Video) => {
    if (video?.video_link) {
      openPlayer(video.video_link); 
    }
  };

  const renderVideoItem = ({ item }: { item: Video }) => {
    const thumbnailSource = item.video_thumbnail_url
      ? { uri: item.video_thumbnail_url }
      : defaultThumbnail;

    return (
      <TouchableOpacity
        style={styles.videoCard}
        activeOpacity={0.9}
        onPress={() => handleVideoPress(item)}
      >
        {/* Thumbnail */}
        <View style={styles.thumbnailContainer}>
          <ImageBackground
            source={thumbnailSource}
            style={styles.thumbnail}
            imageStyle={styles.thumbnailImage}
          >
            <View style={styles.playButtonWrapper}>
              <View style={styles.playButton}>
                <View style={styles.playTriangle} />
              </View>
            </View>
          </ImageBackground>
        </View>

        <Text style={styles.videoTitle} numberOfLines={2}>
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    if (!loadingMore) return null;

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  };

  const renderVideoPlayer = () => {
    if (!selectedVideoUrl) return null;

    const videoId = getVideoId(selectedVideoUrl);
    if (!videoId) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Invalid video URL</Text>
        </View>
      );
    }

    return (
      <View style={styles.playerContainer}>
        <YoutubePlayer
          height={screenHeight * 0.6}
          width={screenWidth * 0.9}
          play={true}
          videoId={videoId}
          webViewProps={{
            androidLayerType: "hardware",
            renderToHardwareTextureAndroid: true,
            allowsInlineMediaPlayback: true,
            mediaPlaybackRequiresUserAction: false,
          }}
          initialPlayerParams={{
            controls: true,
            modestbranding: true,
            rel: false,
          }}
        />
      </View>
    );
  };

  return (
    <>
      {/* VIDEO LIST */}
      <FlatList
        data={videos}
        renderItem={renderVideoItem}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.flatListContent}
        columnWrapperStyle={styles.videoGrid}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
      />

      {/* FULLSCREEN OVERLAY PLAYER */}
      <Modal
        visible={!!selectedVideoUrl}
        animationType="fade"
        transparent={true}
        onRequestClose={closePlayer}
        statusBarTranslucent={true}
      >
        <View style={styles.overlay}>
          <View style={styles.closeBtnWrapper}>
            <TouchableOpacity onPress={closePlayer} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>
          {renderVideoPlayer()}
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  flatListContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
    paddingTop: spacing.sm,
  },
  videoGrid: {
    justifyContent: 'space-between',
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailImage: {
    opacity: 0.9,
  },
  playButtonWrapper: {
    position: 'absolute',
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 30,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 14,
    borderTopWidth: 9,
    borderBottomWidth: 9,
    borderLeftColor: colors.primary,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    marginLeft: 4,
  },

  /* Fullscreen Overlay */
  overlay: {
    flex: 1,
   backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
    alignItems: "center",
  },

  playerContainer: {
    width: screenWidth * 0.9,
    height: screenHeight * 0.6,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    borderRadius: 8,
    overflow: "hidden",

  },

  closeBtnWrapper: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 99999,
  },
  closeButton: {
    padding: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  closeText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },

  errorContainer: {
    padding: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 10,
  },
  errorText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },

  footerLoader: {
    paddingVertical: 20,
  },

  videoTitle: {
    fontSize: screenWidth * 0.035,
    fontFamily: Fonts.Regular,
    color: colors.black,
  },
});
