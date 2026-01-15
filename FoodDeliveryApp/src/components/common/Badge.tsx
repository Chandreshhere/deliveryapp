import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../constants/theme';

interface BadgeProps {
  text: string;
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  text,
  variant = 'primary',
  size = 'md',
  style,
}) => {
  const getVariantStyles = (): { bg: string; text: string } => {
    switch (variant) {
      case 'primary':
        return { bg: COLORS.primary, text: COLORS.white };
      case 'success':
        return { bg: COLORS.accentLight, text: COLORS.accentDark };
      case 'warning':
        return { bg: '#FEF3C7', text: '#D97706' };
      case 'error':
        return { bg: '#FEE2E2', text: '#DC2626' };
      case 'info':
        return { bg: '#DBEAFE', text: '#2563EB' };
      case 'neutral':
        return { bg: COLORS.gray100, text: COLORS.gray700 };
      default:
        return { bg: COLORS.primary, text: COLORS.white };
    }
  };

  const colors = getVariantStyles();

  return (
    <View
      style={[
        styles.badge,
        size === 'sm' && styles.badgeSm,
        { backgroundColor: colors.bg },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          size === 'sm' && styles.textSm,
          { color: colors.text },
        ]}
      >
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
    alignSelf: 'flex-start',
  },
  badgeSm: {
    paddingHorizontal: SPACING.xs + 2,
    paddingVertical: 2,
  },
  text: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.medium,
  },
  textSm: {
    fontSize: FONTS.sizes.xs,
  },
});

export default Badge;
