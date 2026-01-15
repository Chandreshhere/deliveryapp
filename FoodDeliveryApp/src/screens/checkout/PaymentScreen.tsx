import React, { useState, useEffect } from 'react';
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

import { Header, Button } from '../../components/common';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../constants/theme';
import { RootStackParamList } from '../../types';
import { useCartStore, useOrdersStore } from '../../store/useStore';

type PaymentScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Payment'
>;
type PaymentScreenRouteProp = RouteProp<RootStackParamList, 'Payment'>;

const PaymentScreen: React.FC = () => {
  const navigation = useNavigation<PaymentScreenNavigationProp>();
  const route = useRoute<PaymentScreenRouteProp>();
  const { orderId } = route.params;
  const { cart, clearCart } = useCartStore();

  const [paymentStatus, setPaymentStatus] = useState<'processing' | 'success' | 'failed'>(
    'processing'
  );
  const spinValue = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate spinner
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();

    // Simulate payment processing
    const timer = setTimeout(() => {
      setPaymentStatus('success');
      clearCart();

      // Navigate to success screen
      setTimeout(() => {
        navigation.replace('OrderSuccess', { orderId });
      }, 1500);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const renderProcessing = () => (
    <View style={styles.statusContainer}>
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <View style={styles.spinner}>
          <View style={styles.spinnerInner} />
        </View>
      </Animated.View>
      <Text style={styles.statusTitle}>Processing Payment</Text>
      <Text style={styles.statusSubtitle}>
        Please wait while we process your payment...
      </Text>
      <Text style={styles.amount}>₹{cart?.total.toFixed(0)}</Text>
    </View>
  );

  const renderSuccess = () => (
    <View style={styles.statusContainer}>
      <View style={styles.successIcon}>
        <Ionicons name="checkmark" size={48} color={COLORS.white} />
      </View>
      <Text style={styles.statusTitle}>Payment Successful!</Text>
      <Text style={styles.statusSubtitle}>
        Your order has been placed successfully
      </Text>
      <Text style={styles.amount}>₹{cart?.total.toFixed(0)}</Text>
    </View>
  );

  const renderFailed = () => (
    <View style={styles.statusContainer}>
      <View style={styles.failedIcon}>
        <Ionicons name="close" size={48} color={COLORS.white} />
      </View>
      <Text style={styles.statusTitle}>Payment Failed</Text>
      <Text style={styles.statusSubtitle}>
        Something went wrong. Please try again.
      </Text>
      <Button
        title="Retry Payment"
        onPress={() => setPaymentStatus('processing')}
        style={styles.retryButton}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      <View style={styles.content}>
        {paymentStatus === 'processing' && renderProcessing()}
        {paymentStatus === 'success' && renderSuccess()}
        {paymentStatus === 'failed' && renderFailed()}
      </View>

      {/* Security Badge */}
      <View style={styles.securityBadge}>
        <Ionicons name="shield-checkmark" size={16} color={COLORS.accent} />
        <Text style={styles.securityText}>
          Secured by 256-bit encryption
        </Text>
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
  statusContainer: {
    alignItems: 'center',
  },
  spinner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: COLORS.gray200,
    borderTopColor: COLORS.accent,
    marginBottom: SPACING.xl,
  },
  spinnerInner: {
    width: '100%',
    height: '100%',
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
  },
  failedIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.error,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
  },
  statusTitle: {
    fontSize: FONTS.sizes['2xl'],
    fontWeight: FONTS.weights.bold,
    color: COLORS.gray900,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  statusSubtitle: {
    fontSize: FONTS.sizes.base,
    color: COLORS.gray500,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  amount: {
    fontSize: FONTS.sizes['3xl'],
    fontWeight: FONTS.weights.bold,
    color: COLORS.gray900,
  },
  retryButton: {
    marginTop: SPACING.xl,
    minWidth: 200,
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray100,
  },
  securityText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.gray500,
    marginLeft: SPACING.xs,
  },
});

export default PaymentScreen;
