import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  borderRadius?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  shadow = 'sm',
  padding = 'md',
  borderRadius = 'lg',
}) => {
  const scaleValue = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (onPress) {
      Animated.spring(scaleValue, {
        toValue: 0.98,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  };

  const getShadowStyle = () => {
    switch (shadow) {
      case 'none':
        return SHADOWS.none;
      case 'sm':
        return SHADOWS.sm;
      case 'md':
        return SHADOWS.md;
      case 'lg':
        return SHADOWS.lg;
      default:
        return SHADOWS.sm;
    }
  };

  const getPaddingStyle = (): ViewStyle => {
    switch (padding) {
      case 'none':
        return { padding: 0 };
      case 'sm':
        return { padding: SPACING.sm };
      case 'md':
        return { padding: SPACING.base };
      case 'lg':
        return { padding: SPACING.lg };
      default:
        return { padding: SPACING.base };
    }
  };

  const getBorderRadiusStyle = (): ViewStyle => {
    switch (borderRadius) {
      case 'sm':
        return { borderRadius: BORDER_RADIUS.sm };
      case 'md':
        return { borderRadius: BORDER_RADIUS.md };
      case 'lg':
        return { borderRadius: BORDER_RADIUS.lg };
      case 'xl':
        return { borderRadius: BORDER_RADIUS.xl };
      default:
        return { borderRadius: BORDER_RADIUS.lg };
    }
  };

  const cardStyles = [
    styles.card,
    getShadowStyle(),
    getPaddingStyle(),
    getBorderRadiusStyle(),
    style,
  ];

  if (onPress) {
    return (
      <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
        <TouchableOpacity
          style={cardStyles}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.95}
        >
          {children}
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return <View style={cardStyles}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
  },
});

export default Card;
