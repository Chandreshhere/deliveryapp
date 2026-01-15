import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';

import { Button } from '../../components/common';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../constants/theme';
import { RootStackParamList } from '../../types';

type OrderSuccessNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'OrderSuccess'
>;
type OrderSuccessRouteProp = RouteProp<RootStackParamList, 'OrderSuccess'>;

const OrderSuccessScreen: React.FC = () => {
  const navigation = useNavigation<OrderSuccessNavigationProp>();
  const route = useRoute<OrderSuccessRouteProp>();
  const { orderId } = route.params;

  const scaleValue = useRef(new Animated.Value(0)).current;
  const opacityValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(scaleValue, {
          toValue: 1,
          tension: 50,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.timing(opacityValue, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      <View style={styles.content}>
        {/* Success Animation */}
        <Animated.View
          style={[
            styles.iconContainer,
            {
              opacity: opacityValue,
              transform: [{ scale: scaleValue }],
            },
          ]}
        >
          <View style={styles.successCircle}>
            <Ionicons name="checkmark" size={56} color={COLORS.white} />
          </View>
        </Animated.View>

        {/* Success Message */}
        <Animated.View style={{ opacity: opacityValue }}>
          <Text style={styles.title}>Order Placed!</Text>
          <Text style={styles.subtitle}>
            Your order has been placed successfully.{'\n'}
            You can track your order status below.
          </Text>

          <View style={styles.orderInfo}>
            <Text style={styles.orderLabel}>Order ID</Text>
            <Text style={styles.orderId}>#{orderId.toUpperCase()}</Text>
          </View>

          <View style={styles.estimatedTime}>
            <Ionicons name="time-outline" size={24} color={COLORS.accent} />
            <View style={styles.timeInfo}>
              <Text style={styles.timeLabel}>Estimated Delivery</Text>
              <Text style={styles.timeValue}>25-35 minutes</Text>
            </View>
          </View>
        </Animated.View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <Button
          title="Track Order"
          onPress={() => navigation.replace('OrderTracking', { orderId })}
          fullWidth
          style={styles.primaryButton}
        />
        <Button
          title="Back to Home"
          onPress={() => navigation.navigate('Main')}
          variant="outline"
          fullWidth
          style={styles.secondaryButton}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
  },
  iconContainer: {
    marginBottom: SPACING.xl,
  },
  successCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: FONTS.sizes['3xl'],
    fontWeight: FONTS.weights.bold,
    color: COLORS.gray900,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONTS.sizes.base,
    color: COLORS.gray500,
    textAlign: 'center',
    lineHeight: FONTS.sizes.base * 1.5,
    marginBottom: SPACING.xl,
  },
  orderInfo: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  orderLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.gray500,
    marginBottom: SPACING.xs,
  },
  orderId: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.gray900,
    letterSpacing: 1,
  },
  estimatedTime: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accentLight + '20',
    padding: SPACING.base,
    borderRadius: BORDER_RADIUS.xl,
    width: '100%',
  },
  timeInfo: {
    marginLeft: SPACING.md,
  },
  timeLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.gray500,
  },
  timeValue: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.gray900,
  },
  actions: {
    padding: SPACING.base,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray100,
  },
  primaryButton: {
    marginBottom: SPACING.sm,
  },
  secondaryButton: {},
});

export default OrderSuccessScreen;
