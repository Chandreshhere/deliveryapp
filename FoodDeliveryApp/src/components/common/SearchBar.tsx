import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  onClear?: () => void;
  autoFocus?: boolean;
  style?: ViewStyle;
  editable?: boolean;
  onPress?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search...',
  onFocus,
  onBlur,
  onClear,
  autoFocus = false,
  style,
  editable = true,
  onPress,
}) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const focusAnim = React.useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(focusAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.timing(focusAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
    onBlur?.();
  };

  const handleClear = () => {
    onChangeText('');
    onClear?.();
  };

  const containerStyle = {
    ...SHADOWS.sm,
    borderColor: focusAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [COLORS.gray100, COLORS.gray300],
    }),
  };

  const content = (
    <>
      <Ionicons
        name="search"
        size={20}
        color={isFocused ? COLORS.gray600 : COLORS.gray400}
        style={styles.searchIcon}
      />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.gray400}
        onFocus={handleFocus}
        onBlur={handleBlur}
        autoFocus={autoFocus}
        editable={editable}
        returnKeyType="search"
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
          <Ionicons name="close-circle" size={18} color={COLORS.gray400} />
        </TouchableOpacity>
      )}
    </>
  );

  if (onPress && !editable) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={[styles.container, SHADOWS.sm, style]}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return (
    <Animated.View style={[styles.container, containerStyle, style]}>
      {content}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.gray100,
  },
  searchIcon: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    paddingVertical: SPACING.md,
    fontSize: FONTS.sizes.base,
    color: COLORS.gray900,
  },
  clearButton: {
    padding: SPACING.xs,
  },
});

export default SearchBar;
