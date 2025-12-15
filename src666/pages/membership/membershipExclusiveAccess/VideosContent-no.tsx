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
  Modal,
  Linking,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { colors, spacing, borderRadius, Fonts } from '../../../styles/globalStyles';
import { GetVideos } from '../../../services/membershipService';

const { width: screenWidth } = Dimensions.get('window');

interface Video {
  id: number;
  title: string;
  description: string;
  video_link: string;
  video_thumbnail_url: string | null;
}

export const VideosContent: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isVideoModalVisible, setVideoModalVisible] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null);

  const perPage = 10;
  const defaultThumbnail = require('../../../assets/images/membership-exclusive-access-img.jpg');

  // Convert YouTube URL → embed format
  const getEmbedUrl = (url: string) => {
    if (!url) return null;
    if (url.includes('embed')) return url;

    const match = url.match(/v=([^&]+)/);
    const videoId = match ? match[1] : null;

    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  // Open modal and play video
  const openVideoModal = (videoUrl: string) => {
    setCurrentVideoUrl(videoUrl);
    setVideoModalVisible(true);
  };

  const loadVideos = useCallback(async (page: number, append: boolean = false) => {
    try {
      append ? setLoadingMore(true) : setLoading(true);

      const result = await GetVideos(page, perPage);

      if (result?.success && result?.data?.videos) {
        const newVideos = result.data.videos;
        const pagination = result.data.pagination;

        setVideos(prev => (append ? [...prev, ...newVideos] : newVideos));
        setCurrentPage(pagination.current_page);
        setHasNextPage(pagination.has_next_page);
      } else {
        setError('Failed to load videos.');
      }
    } catch (err: any) {
      setError(err?.message || 'Something went wrong.');
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
    if (video.video_link) {
      openVideoModal(video.video_link);
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
            resizeMode="cover"
          >
            <View style={styles.playButtonWrapper}>
              <View style={styles.playButton}>
                <View style={styles.playButtonTriangle} />
              </View>
            </View>
          </ImageBackground>
        </View>

        {/* Title */}
        <View style={styles.videoTitleContainer}>
          <Text style={styles.videoTitle} numberOfLines={2}>
            {item.title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFooter = () =>
    loadingMore ? (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={styles.footerLoaderText}>Loading more videos...</Text>
      </View>
    ) : null;

  const renderEmpty = () =>
    loading ? (
      <View style={styles.emptyContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.emptyText}>Loading videos...</Text>
      </View>
    ) : (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No videos found</Text>
      </View>
    );

  return (
    <>
      {/* VIDEO GRID */}
      <FlatList
        data={videos}
        renderItem={renderVideoItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.flatListContent}
        columnWrapperStyle={styles.videoGrid}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />

      {/* MODAL YOUTUBE PLAYER */}
      <Modal
        visible={isVideoModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setVideoModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>

            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setVideoModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>

            {/* YouTube Player */}
            <View style={styles.webViewWrapper}>
  {currentVideoUrl ? (
    <WebView
      source={{
        html: `
          <html>
            <body style="margin:0;padding:0;background:black;">
              <iframe 
                width="100%" 
                height="100%" 
                src="${getEmbedUrl(currentVideoUrl)}?autoplay=1&playsinline=1" 
                frameborder="0" 
                allow="autoplay; encrypted-media" 
                allowfullscreen
              ></iframe>
            </body>
          </html>
        `,
      }}
      javaScriptEnabled
      domStorageEnabled
      allowsFullscreenVideo
    />
  ) : null}
</View>

          </View>
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
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 30,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  playButtonTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 14,
    borderTopWidth: 9,
    borderBottomWidth: 9,
    borderLeftColor: colors.primary,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    marginLeft: 3,
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

  /** Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    height: '55%',
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 10,
  },
  closeButtonText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  webViewWrapper: {
    flex: 1,
    marginBottom: 10,
  },

  footerLoader: {
    paddingVertical: spacing.xl,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  footerLoaderText: {
    fontSize: screenWidth * 0.035,
    color: colors.darkGray,
  },

  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: screenWidth * 0.04,
    color: colors.darkGray,
  },
});
