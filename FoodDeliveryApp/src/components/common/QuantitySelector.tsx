import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../constants/theme';

interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  minValue?: number;
  maxValue?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled';
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onIncrease,
  onDecrease,
  minValue = 0,
  maxValue = 99,
  size = 'md',
  variant = 'default',
}) => {
  const scaleValue = React.useRef(new Animated.Value(1)).current;

  const handlePress = (action: 'increase' | 'decrease') => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.9,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    if (action === 'increase' && quantity < maxValue) {
      onIncrease();
    } else if (action === 'decrease' && quantity > minValue) {
      onDecrease();
    }
  };

  const getButtonSize = (): number => {
    switch (size) {
      case 'sm':
        return 24;
      case 'md':
        return 32;
      case 'lg':
        return 40;
      default:
        return 32;
    }
  };

  const getIconSize = (): number => {
    switch (size) {
      case 'sm':
        return 14;
      case 'md':
        return 18;
      case 'lg':
        return 22;
      default:
        return 18;
    }
  };

  const getFontSize = (): number => {
    switch (size) {
      case 'sm':
        return FONTS.sizes.sm;
      case 'md':
        return FONTS.sizes.base;
      case 'lg':
        return FONTS.sizes.lg;
      default:
        return FONTS.sizes.base;
    }
  };

  const buttonSize = getButtonSize();
  const iconSize = getIconSize();
  const fontSize = getFontSize();

  const isFilledVariant = variant === 'filled';
  const canDecrease = quantity > minValue;
  const canIncrease = quantity < maxValue;

  return (
    <Animated.View
      style={[
        styles.container,
        isFilledVariant && styles.containerFilled,
        { transform: [{ scale: scaleValue }] },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.button,
          isFilledVariant && styles.buttonFilled,
          {
            width: buttonSize,
            height: buttonSize,
            borderRadius: buttonSize / 2,
          },
          !canDecrease && styles.buttonDisabled,
        ]}
        onPress={() => handlePress('decrease')}
        disabled={!canDecrease}
        activeOpacity={0.7}
      >
        <Ionicons
          name="remove"
          size={iconSize}
          color={
            canDecrease
              ? isFilledVariant
                ? COLORS.white
                : COLORS.accent
              : COLORS.gray300
          }
        />
      </TouchableOpacity>

      <Text
        style={[
          styles.quantity,
          isFilledVariant && styles.quantityFilled,
          { fontSize, minWidth: buttonSize },
        ]}
      >
        {quantity}
      </Text>

      <TouchableOpacity
        style={[
          styles.button,
          isFilledVariant && styles.buttonFilled,
          {
            width: buttonSize,
            height: buttonSize,
            borderRadius: buttonSize / 2,
          },
          !canIncrease && styles.buttonDisabled,
        ]}
        onPress={() => handlePress('increase')}
        disabled={!canIncrease}
        activeOpacity={0.7}
      >
        <Ionicons
          name="add"
          size={iconSize}
          color={
            canIncrease
              ? isFilledVariant
                ? COLORS.white
                : COLORS.accent
              : COLORS.gray300
          }
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.gray200,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.white,
    padding: 2,
  },
  containerFilled: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.gray50,
  },
  buttonFilled: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  quantity: {
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.gray900,
    textAlign: 'center',
    paddingHorizontal: SPACING.sm,
  },
  quantityFilled: {
    color: COLORS.white,
  },
});

export default QuantitySelector;
