import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING } from '../../constants/theme';

const { width } = Dimensions.get('window');

const SplashScreen: React.FC = () => {
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const dotOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Logo animation
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // Text animation with delay
    Animated.timing(textOpacity, {
      toValue: 1,
      duration: 300,
      delay: 400,
      useNativeDriver: true,
    }).start();

    // Loading dots
    Animated.loop(
      Animated.sequence([
        Animated.timing(dotOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(dotOpacity, {
          toValue: 0.3,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Logo */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
      >
        <View style={styles.logoInner}>
          <Ionicons name="fast-food" size={48} color={COLORS.primary} />
        </View>
      </Animated.View>

      {/* App Name */}
      <Animated.View style={{ opacity: textOpacity }}>
        <Text style={styles.appName}>FoodHub</Text>
        <Text style={styles.tagline}>Delicious food at your doorstep</Text>
      </Animated.View>

      {/* Loading indicator */}
      <Animated.View style={[styles.loadingContainer, { opacity: dotOpacity }]}>
        <View style={styles.dot} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 30,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  logoInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    fontSize: FONTS.sizes['4xl'],
    fontWeight: FONTS.weights.bold,
    color: COLORS.white,
    textAlign: 'center',
    letterSpacing: 1,
  },
  tagline: {
    fontSize: FONTS.sizes.base,
    color: COLORS.gray300,
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
  loadingContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 60,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.white,
    marginHorizontal: 4,
  },
});

export default SplashScreen;
