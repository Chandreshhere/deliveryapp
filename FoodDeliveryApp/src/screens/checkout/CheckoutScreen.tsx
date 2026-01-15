import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { Header, Button, Divider } from '../../components/common';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { RootStackParamList, PaymentMethod } from '../../types';
import { useCartStore, useLocationStore } from '../../store/useStore';

type CheckoutScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Checkout'
>;

const paymentMethods: { id: PaymentMethod; name: string; icon: keyof typeof Ionicons.glyphMap; description?: string }[] = [
  { id: 'upi', name: 'UPI', icon: 'phone-portrait-outline', description: 'Google Pay, PhonePe, Paytm' },
  { id: 'card', name: 'Credit / Debit Card', icon: 'card-outline' },
  { id: 'wallet', name: 'Wallet', icon: 'wallet-outline', description: 'Paytm, Amazon Pay' },
  { id: 'cod', name: 'Cash on Delivery', icon: 'cash-outline' },
];

const CheckoutScreen: React.FC = () => {
  const navigation = useNavigation<CheckoutScreenNavigationProp>();
  const { cart } = useCartStore();
  const { currentLocation } = useLocationStore();

  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('upi');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  if (!cart) {
    navigation.goBack();
    return null;
  }

  const handlePlaceOrder = () => {
    setIsPlacingOrder(true);

    // Simulate order placement
    setTimeout(() => {
      setIsPlacingOrder(false);
      navigation.navigate('Payment', { orderId: 'order123' });
    }, 500);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <Header
        showBack
        onBackPress={() => navigation.goBack()}
        title="Checkout"
        centerTitle
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Delivery Address */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Delivery Address</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('LocationSelector')}
            >
              <Text style={styles.changeText}>Change</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.addressCard}>
            <View style={styles.addressIcon}>
              <Ionicons
                name={
                  currentLocation?.label === 'Home'
                    ? 'home'
                    : currentLocation?.label === 'Work'
                    ? 'briefcase'
                    : 'location'
                }
                size={20}
                color={COLORS.accent}
              />
            </View>
            <View style={styles.addressContent}>
              <Text style={styles.addressLabel}>
                {currentLocation?.label || 'Select Address'}
              </Text>
              <Text style={styles.addressText} numberOfLines={2}>
                {currentLocation?.address || 'Please select a delivery address'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.gray400} />
          </View>
        </View>

        {/* Delivery Time */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Time</Text>
          <View style={styles.deliveryTimeCard}>
            <View style={styles.timeOption}>
              <View style={styles.radioOuter}>
                <View style={styles.radioInner} />
              </View>
              <View style={styles.timeInfo}>
                <Text style={styles.timeTitle}>Standard Delivery</Text>
                <Text style={styles.timeSubtitle}>25-35 min</Text>
              </View>
              <Text style={styles.timeFee}>₹{cart.deliveryFee}</Text>
            </View>
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Order Summary</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
              <Text style={styles.changeText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.orderSummaryCard}>
            <View style={styles.restaurantRow}>
              <Ionicons name="restaurant" size={18} color={COLORS.gray600} />
              <Text style={styles.restaurantName}>{cart.restaurantName}</Text>
            </View>

            <Divider spacing={SPACING.sm} color={COLORS.gray100} />

            {cart.items.map((item, index) => (
              <View key={item.id} style={styles.summaryItem}>
                <View style={styles.summaryItemLeft}>
                  <Text style={styles.summaryQuantity}>{item.quantity}x</Text>
                  <Text style={styles.summaryName}>{item.menuItem.name}</Text>
                </View>
                <Text style={styles.summaryPrice}>₹{item.totalPrice}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>

          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentOption,
                selectedPayment === method.id && styles.paymentOptionSelected,
              ]}
              onPress={() => setSelectedPayment(method.id)}
            >
              <View style={styles.paymentLeft}>
                <View
                  style={[
                    styles.paymentIcon,
                    selectedPayment === method.id && styles.paymentIconSelected,
                  ]}
                >
                  <Ionicons
                    name={method.icon}
                    size={20}
                    color={
                      selectedPayment === method.id
                        ? COLORS.accent
                        : COLORS.gray500
                    }
                  />
                </View>
                <View style={styles.paymentInfo}>
                  <Text style={styles.paymentName}>{method.name}</Text>
                  {method.description && (
                    <Text style={styles.paymentDescription}>
                      {method.description}
                    </Text>
                  )}
                </View>
              </View>
              <View
                style={[
                  styles.radioOuter,
                  selectedPayment === method.id && styles.radioOuterSelected,
                ]}
              >
                {selectedPayment === method.id && (
                  <View style={styles.radioInner} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bill Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bill Details</Text>
          <View style={styles.billCard}>
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Item Total</Text>
              <Text style={styles.billValue}>₹{cart.subtotal.toFixed(0)}</Text>
            </View>
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Delivery Fee</Text>
              <Text style={styles.billValue}>₹{cart.deliveryFee.toFixed(0)}</Text>
            </View>
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Taxes & Charges</Text>
              <Text style={styles.billValue}>₹{cart.taxes.toFixed(0)}</Text>
            </View>
            {cart.discount > 0 && (
              <View style={styles.billRow}>
                <Text style={[styles.billLabel, styles.discountText]}>
                  Discount
                </Text>
                <Text style={[styles.billValue, styles.discountText]}>
                  -₹{cart.discount.toFixed(0)}
                </Text>
              </View>
            )}
            <Divider spacing={SPACING.sm} />
            <View style={styles.billRow}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>₹{cart.total.toFixed(0)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Place Order Footer */}
      <View style={styles.footer}>
        <View style={styles.footerInfo}>
          <Text style={styles.footerTotal}>₹{cart.total.toFixed(0)}</Text>
          <Text style={styles.footerSubtext}>Total Amount</Text>
        </View>
        <Button
          title="Place Order"
          onPress={handlePlaceOrder}
          loading={isPlacingOrder}
          size="lg"
          style={styles.placeOrderButton}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundSecondary,
  },
  section: {
    backgroundColor: COLORS.white,
    padding: SPACING.base,
    marginBottom: SPACING.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.gray900,
  },
  changeText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.accent,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.gray50,
    borderRadius: BORDER_RADIUS.lg,
  },
  addressIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.accentLight + '30',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  addressContent: {
    flex: 1,
  },
  addressLabel: {
    fontSize: FONTS.sizes.base,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.gray900,
    marginBottom: SPACING.xs,
  },
  addressText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.gray500,
    lineHeight: FONTS.sizes.sm * 1.4,
  },
  deliveryTimeCard: {
    marginTop: SPACING.sm,
  },
  timeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.accentLight + '15',
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.gray300,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  radioOuterSelected: {
    borderColor: COLORS.accent,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.accent,
  },
  timeInfo: {
    flex: 1,
  },
  timeTitle: {
    fontSize: FONTS.sizes.base,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.gray900,
  },
  timeSubtitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.gray500,
  },
  timeFee: {
    fontSize: FONTS.sizes.base,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.gray900,
  },
  orderSummaryCard: {
    padding: SPACING.md,
    backgroundColor: COLORS.gray50,
    borderRadius: BORDER_RADIUS.lg,
  },
  restaurantRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  restaurantName: {
    fontSize: FONTS.sizes.base,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.gray900,
    marginLeft: SPACING.sm,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  summaryItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  summaryQuantity: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.accent,
    marginRight: SPACING.sm,
  },
  summaryName: {
    fontSize: FONTS.sizes.md,
    color: COLORS.gray700,
    flex: 1,
  },
  summaryPrice: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.medium,
    color: COLORS.gray900,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    backgroundColor: COLORS.gray50,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.gray100,
  },
  paymentOptionSelected: {
    backgroundColor: COLORS.accentLight + '15',
    borderColor: COLORS.accent,
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  paymentIconSelected: {
    backgroundColor: COLORS.accentLight + '30',
  },
  paymentInfo: {
    flex: 1,
  },
  paymentName: {
    fontSize: FONTS.sizes.base,
    fontWeight: FONTS.weights.medium,
    color: COLORS.gray900,
  },
  paymentDescription: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.gray500,
    marginTop: 2,
  },
  billCard: {
    marginTop: SPACING.sm,
    padding: SPACING.md,
    backgroundColor: COLORS.gray50,
    borderRadius: BORDER_RADIUS.lg,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  billLabel: {
    fontSize: FONTS.sizes.md,
    color: COLORS.gray600,
  },
  billValue: {
    fontSize: FONTS.sizes.md,
    color: COLORS.gray900,
  },
  discountText: {
    color: COLORS.accent,
  },
  totalLabel: {
    fontSize: FONTS.sizes.base,
    fontWeight: FONTS.weights.bold,
    color: COLORS.gray900,
  },
  totalValue: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.gray900,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.base,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray100,
    ...SHADOWS.lg,
  },
  footerInfo: {
    marginRight: SPACING.lg,
  },
  footerTotal: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.gray900,
  },
  footerSubtext: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.gray500,
  },
  placeOrderButton: {
    flex: 1,
  },
  bottomPadding: {
    height: SPACING.xl,
  },
});

export default CheckoutScreen;
