import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, SPACING } from '../../constants/theme';

interface DividerProps {
  vertical?: boolean;
  color?: string;
  thickness?: number;
  spacing?: number;
  style?: ViewStyle;
}

export const Divider: React.FC<DividerProps> = ({
  vertical = false,
  color = COLORS.gray200,
  thickness = 1,
  spacing = SPACING.base,
  style,
}) => {
  return (
    <View
      style={[
        vertical ? styles.vertical : styles.horizontal,
        {
          backgroundColor: color,
          [vertical ? 'width' : 'height']: thickness,
          [vertical ? 'marginHorizontal' : 'marginVertical']: spacing,
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  horizontal: {
    width: '100%',
  },
  vertical: {
    height: '100%',
  },
});

export default Divider;
