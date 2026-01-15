import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING } from '../../constants/theme';

interface RatingProps {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md' | 'lg';
  showStars?: boolean;
  style?: ViewStyle;
}

export const Rating: React.FC<RatingProps> = ({
  rating,
  reviewCount,
  size = 'md',
  showStars = false,
  style,
}) => {
  const getIconSize = (): number => {
    switch (size) {
      case 'sm':
        return 12;
      case 'md':
        return 14;
      case 'lg':
        return 18;
      default:
        return 14;
    }
  };

  const getFontSize = (): number => {
    switch (size) {
      case 'sm':
        return FONTS.sizes.xs;
      case 'md':
        return FONTS.sizes.sm;
      case 'lg':
        return FONTS.sizes.base;
      default:
        return FONTS.sizes.sm;
    }
  };

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Ionicons
            key={i}
            name="star"
            size={getIconSize()}
            color="#FBBF24"
            style={{ marginRight: 2 }}
          />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Ionicons
            key={i}
            name="star-half"
            size={getIconSize()}
            color="#FBBF24"
            style={{ marginRight: 2 }}
          />
        );
      } else {
        stars.push(
          <Ionicons
            key={i}
            name="star-outline"
            size={getIconSize()}
            color={COLORS.gray300}
            style={{ marginRight: 2 }}
          />
        );
      }
    }
    return stars;
  };

  if (showStars) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.starsContainer}>{renderStars()}</View>
        {reviewCount !== undefined && (
          <Text style={[styles.reviewCount, { fontSize: getFontSize() }]}>
            ({reviewCount})
          </Text>
        )}
      </View>
    );
  }

  return (
    <View style={[styles.container, styles.badge, style]}>
      <Ionicons name="star" size={getIconSize()} color={COLORS.white} />
      <Text style={[styles.ratingText, { fontSize: getFontSize() }]}>
        {rating.toFixed(1)}
      </Text>
      {reviewCount !== undefined && (
        <Text style={[styles.reviewCountBadge, { fontSize: getFontSize() }]}>
          ({reviewCount}+)
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs - 2,
    borderRadius: 6,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: COLORS.white,
    fontWeight: FONTS.weights.bold,
    marginLeft: SPACING.xs,
  },
  reviewCount: {
    color: COLORS.gray500,
    marginLeft: SPACING.xs,
  },
  reviewCountBadge: {
    color: COLORS.white,
    fontWeight: FONTS.weights.medium,
    marginLeft: SPACING.xs,
    opacity: 0.9,
  },
});

export default Rating;
