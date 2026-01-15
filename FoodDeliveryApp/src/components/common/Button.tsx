import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  Animated,
} from 'react-native';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
  textStyle,
}) => {
  const scaleValue = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: disabled ? COLORS.gray300 : COLORS.primary,
        };
      case 'secondary':
        return {
          backgroundColor: disabled ? COLORS.gray200 : COLORS.accent,
        };
      case 'outline':
        return {
          backgroundColor: COLORS.transparent,
          borderWidth: 1.5,
          borderColor: disabled ? COLORS.gray300 : COLORS.primary,
        };
      case 'ghost':
        return {
          backgroundColor: COLORS.transparent,
        };
      default:
        return {};
    }
  };

  const getTextColor = (): string => {
    if (disabled) return COLORS.gray400;
    switch (variant) {
      case 'primary':
        return COLORS.white;
      case 'secondary':
        return COLORS.white;
      case 'outline':
      case 'ghost':
        return COLORS.primary;
      default:
        return COLORS.white;
    }
  };

  const getSizeStyles = (): ViewStyle => {
    switch (size) {
      case 'sm':
        return {
          paddingVertical: SPACING.sm,
          paddingHorizontal: SPACING.base,
        };
      case 'md':
        return {
          paddingVertical: SPACING.md,
          paddingHorizontal: SPACING.lg,
        };
      case 'lg':
        return {
          paddingVertical: SPACING.base,
          paddingHorizontal: SPACING.xl,
        };
      default:
        return {};
    }
  };

  const getTextSize = (): number => {
    switch (size) {
      case 'sm':
        return FONTS.sizes.sm;
      case 'md':
        return FONTS.sizes.md;
      case 'lg':
        return FONTS.sizes.base;
      default:
        return FONTS.sizes.md;
    }
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      <TouchableOpacity
        style={[
          styles.button,
          getVariantStyles(),
          getSizeStyles(),
          fullWidth && styles.fullWidth,
          variant === 'primary' && !disabled && SHADOWS.md,
          style,
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color={getTextColor()} size="small" />
        ) : (
          <>
            {icon && iconPosition === 'left' && (
              <Text style={styles.iconLeft}>{icon}</Text>
            )}
            <Text
              style={[
                styles.text,
                { color: getTextColor(), fontSize: getTextSize() },
                textStyle,
              ]}
            >
              {title}
            </Text>
            {icon && iconPosition === 'right' && (
              <Text style={styles.iconRight}>{icon}</Text>
            )}
          </>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.lg,
  },
  fullWidth: {
    width: '100%',
  },
  text: {
    fontWeight: FONTS.weights.semiBold,
    textAlign: 'center',
  },
  iconLeft: {
    marginRight: SPACING.sm,
  },
  iconRight: {
    marginLeft: SPACING.sm,
  },
});

export default Button;
