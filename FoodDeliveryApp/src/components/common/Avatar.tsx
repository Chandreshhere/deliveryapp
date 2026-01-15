import React from 'react';
import { View, Image, Text, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, FONTS, BORDER_RADIUS } from '../../constants/theme';

interface AvatarProps {
  source?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  style?: ViewStyle;
}

export const Avatar: React.FC<AvatarProps> = ({
  source,
  name,
  size = 'md',
  style,
}) => {
  const getSize = (): number => {
    switch (size) {
      case 'sm':
        return 32;
      case 'md':
        return 44;
      case 'lg':
        return 64;
      case 'xl':
        return 96;
      default:
        return 44;
    }
  };

  const getFontSize = (): number => {
    switch (size) {
      case 'sm':
        return FONTS.sizes.sm;
      case 'md':
        return FONTS.sizes.base;
      case 'lg':
        return FONTS.sizes.xl;
      case 'xl':
        return FONTS.sizes['2xl'];
      default:
        return FONTS.sizes.base;
    }
  };

  const getInitials = (name: string): string => {
    const words = name.split(' ');
    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const avatarSize = getSize();

  if (source) {
    return (
      <Image
        source={{ uri: source }}
        style={[
          styles.image,
          {
            width: avatarSize,
            height: avatarSize,
            borderRadius: avatarSize / 2,
          },
          style,
        ]}
      />
    );
  }

  return (
    <View
      style={[
        styles.placeholder,
        {
          width: avatarSize,
          height: avatarSize,
          borderRadius: avatarSize / 2,
        },
        style,
      ]}
    >
      <Text style={[styles.initials, { fontSize: getFontSize() }]}>
        {name ? getInitials(name) : '?'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    backgroundColor: COLORS.gray100,
  },
  placeholder: {
    backgroundColor: COLORS.gray200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: COLORS.gray600,
    fontWeight: FONTS.weights.semiBold,
  },
});

export default Avatar;
