import React, { useState, useRef, useEffect } from 'react';
import {
  Animated,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { BottomArrowIcon } from '../components/icons';
import { borderRadius, colors, Fonts, spacing } from '../styles/globalStyles';

export const ConferenceAccess = ({
  conferenceAccessItems,
  renderConferenceItem,
}: any) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const animation = useRef(new Animated.Value(0)).current;

  // Animate expand / collapse
  useEffect(() => {
    Animated.timing(animation, {
      toValue: isExpanded ? 1 : 0,
      duration: 350,
      useNativeDriver: false,
    }).start();
  }, [isExpanded]);

  // Interpolations
  const heightInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, contentHeight],
  });

  const opacityInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const rotateInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={styles.wrapper}>
      {/* Header */}
      <TouchableOpacity
        style={styles.header}
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.8}
      >
        <Text style={styles.title}>Conference Access</Text>

        {/* Smooth arrow rotation */}
        <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
          <BottomArrowIcon size={14} color="white" />
        </Animated.View>
      </TouchableOpacity>

      {/* Animated expandable container */}
      <Animated.View
        style={[
          styles.animatedContainer,
          {
            height: heightInterpolate,
            opacity: opacityInterpolate,
          },
        ]}
      >
        <View
          style={styles.content}
          onLayout={e => {
            // Only set once — this ensures we capture the full content height
            if (contentHeight === 0) {
              setContentHeight(e.nativeEvent.layout.height);
            }
          }}
        >
          {conferenceAccessItems.map((item: any, index: number) =>
            renderConferenceItem(item, index),
          )}
        </View>
      </Animated.View>

      {/* Hidden view used only for measuring (not visible) */}
      {contentHeight === 0 && (
        <View
          style={[styles.content, { position: 'absolute', opacity: 0 }]}
          onLayout={e => {
            setContentHeight(e.nativeEvent.layout.height);
          }}
        >
          {conferenceAccessItems.map((item: any, index: number) =>
            renderConferenceItem(item, index),
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.accent,
    borderRadius: borderRadius.sm,
    width: Dimensions.get('window').width * 0.75,
    alignSelf: 'center',
    marginTop: spacing.md,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  title: {
    color: colors.primary,
    fontSize: Dimensions.get('window').width * 0.04,
    fontFamily: Fonts.Medium,
  },
  animatedContainer: {
    overflow: 'hidden',
    backgroundColor: colors.accent,
  },
  content: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Dimensions.get('window').width * 0.02,
    padding: spacing.sm,
  },
});
