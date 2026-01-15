import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, LAYOUT } from '../../constants/theme';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBackPress?: () => void;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightPress?: () => void;
  rightComponent?: React.ReactNode;
  transparent?: boolean;
  centerTitle?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  onBackPress,
  rightIcon,
  onRightPress,
  rightComponent,
  transparent = false,
  centerTitle = false,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: Platform.OS === 'ios' ? insets.top : StatusBar.currentHeight || SPACING.lg,
        },
        transparent && styles.transparent,
      ]}
    >
      <StatusBar
        barStyle={transparent ? 'light-content' : 'dark-content'}
        backgroundColor={transparent ? 'transparent' : COLORS.white}
        translucent={transparent}
      />
      <View style={styles.content}>
        {/* Left Side */}
        <View style={styles.leftContainer}>
          {showBack && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={onBackPress}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name="chevron-back"
                size={24}
                color={transparent ? COLORS.white : COLORS.primary}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Center - Title */}
        <View style={[styles.titleContainer, centerTitle && styles.titleCentered]}>
          {title && (
            <Text
              style={[
                styles.title,
                transparent && styles.titleLight,
                centerTitle && styles.titleCenteredText,
              ]}
              numberOfLines={1}
            >
              {title}
            </Text>
          )}
          {subtitle && (
            <Text
              style={[styles.subtitle, transparent && styles.subtitleLight]}
              numberOfLines={1}
            >
              {subtitle}
            </Text>
          )}
        </View>

        {/* Right Side */}
        <View style={styles.rightContainer}>
          {rightComponent || (
            rightIcon && (
              <TouchableOpacity
                style={styles.rightButton}
                onPress={onRightPress}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name={rightIcon}
                  size={24}
                  color={transparent ? COLORS.white : COLORS.primary}
                />
              </TouchableOpacity>
            )
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  transparent: {
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    height: LAYOUT.headerHeight,
    paddingHorizontal: SPACING.base,
  },
  leftContainer: {
    width: 40,
    alignItems: 'flex-start',
  },
  backButton: {
    padding: SPACING.xs,
  },
  titleContainer: {
    flex: 1,
    marginHorizontal: SPACING.sm,
  },
  titleCentered: {
    alignItems: 'center',
  },
  title: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.gray900,
  },
  titleCenteredText: {
    textAlign: 'center',
  },
  titleLight: {
    color: COLORS.white,
  },
  subtitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.gray500,
    marginTop: 2,
  },
  subtitleLight: {
    color: COLORS.gray200,
  },
  rightContainer: {
    width: 40,
    alignItems: 'flex-end',
  },
  rightButton: {
    padding: SPACING.xs,
  },
});

export default Header;
