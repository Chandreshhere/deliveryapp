import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { Header, Button, QuantitySelector, EmptyState, Divider } from '../../components/common';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { RootStackParamList } from '../../types';
import { useCartStore } from '../../store/useStore';

type CartScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Cart'>;

const CartScreen: React.FC = () => {
  const navigation = useNavigation<CartScreenNavigationProp>();
  const { cart, updateQuantity, removeFromCart, applyCoupon, removeCoupon, clearCart } =
    useCartStore();

  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  if (!cart || cart.items.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
        <Header
          showBack
          onBackPress={() => navigation.goBack()}
          title="Cart"
          centerTitle
        />
        <EmptyState
          icon="cart-outline"
          title="Your cart is empty"
          description="Add items from restaurants to start your order"
          actionTitle="Browse Restaurants"
          onAction={() => navigation.goBack()}
        />
      </SafeAreaView>
    );
  }

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    setIsApplyingCoupon(true);
    setCouponError('');

    const success = await applyCoupon(couponCode);

    if (!success) {
      setCouponError('Invalid coupon code');
    }

    setIsApplyingCoupon(false);
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponCode('');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <Header
        showBack
        onBackPress={() => navigation.goBack()}
        title="Cart"
        centerTitle
        rightIcon="trash-outline"
        onRightPress={clearCart}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Restaurant Info */}
        <View style={styles.restaurantCard}>
          <Ionicons name="restaurant" size={20} color={COLORS.gray600} />
          <Text style={styles.restaurantName}>{cart.restaurantName}</Text>
        </View>

        {/* Cart Items */}
        <View style={styles.itemsContainer}>
          {cart.items.map((item) => (
            <View key={item.id} style={styles.cartItem}>
              <View style={styles.itemLeft}>
                <View
                  style={[
                    styles.vegIndicator,
                    {
                      borderColor: item.menuItem.isVeg
                        ? COLORS.accent
                        : COLORS.error,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.vegDot,
                      {
                        backgroundColor: item.menuItem.isVeg
                          ? COLORS.accent
                          : COLORS.error,
                      },
                    ]}
                  />
                </View>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.menuItem.name}</Text>
                  <Text style={styles.itemPrice}>₹{item.menuItem.price}</Text>
                </View>
              </View>

              <View style={styles.itemRight}>
                <QuantitySelector
                  quantity={item.quantity}
                  onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
                  onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
                  size="sm"
                />
                <Text style={styles.itemTotal}>₹{item.totalPrice}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Add More Items */}
        <TouchableOpacity
          style={styles.addMoreButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="add-circle-outline" size={20} color={COLORS.accent} />
          <Text style={styles.addMoreText}>Add more items</Text>
        </TouchableOpacity>

        {/* Special Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.sectionTitle}>Special Instructions</Text>
          <TouchableOpacity style={styles.instructionsInput}>
            <Ionicons name="create-outline" size={20} color={COLORS.gray400} />
            <Text style={styles.instructionsPlaceholder}>
              Add cooking instructions, allergies, etc.
            </Text>
          </TouchableOpacity>
        </View>

        <Divider spacing={SPACING.md} />

        {/* Coupon Section */}
        <View style={styles.couponContainer}>
          <Text style={styles.sectionTitle}>Apply Coupon</Text>
          {cart.couponApplied ? (
            <View style={styles.appliedCoupon}>
              <View style={styles.couponInfo}>
                <Ionicons name="pricetag" size={20} color={COLORS.accent} />
                <View style={styles.couponDetails}>
                  <Text style={styles.couponCode}>{cart.couponApplied.code}</Text>
                  <Text style={styles.couponSavings}>
                    You saved ₹{cart.discount.toFixed(0)}
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={handleRemoveCoupon}>
                <Text style={styles.removeCoupon}>Remove</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.couponInputContainer}>
              <TextInput
                style={styles.couponInput}
                placeholder="Enter coupon code"
                placeholderTextColor={COLORS.gray400}
                value={couponCode}
                onChangeText={(text) => {
                  setCouponCode(text.toUpperCase());
                  setCouponError('');
                }}
                autoCapitalize="characters"
              />
              <TouchableOpacity
                style={styles.applyButton}
                onPress={handleApplyCoupon}
                disabled={isApplyingCoupon}
              >
                <Text style={styles.applyButtonText}>
                  {isApplyingCoupon ? '...' : 'APPLY'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          {couponError && <Text style={styles.couponError}>{couponError}</Text>}
        </View>

        <Divider spacing={SPACING.md} />

        {/* Bill Details */}
        <View style={styles.billContainer}>
          <Text style={styles.sectionTitle}>Bill Details</Text>

          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Item Total</Text>
            <Text style={styles.billValue}>₹{cart.subtotal.toFixed(0)}</Text>
          </View>

          <View style={styles.billRow}>
            <View style={styles.billLabelRow}>
              <Text style={styles.billLabel}>Delivery Fee</Text>
              <Ionicons
                name="information-circle-outline"
                size={14}
                color={COLORS.gray400}
              />
            </View>
            <Text style={styles.billValue}>₹{cart.deliveryFee.toFixed(0)}</Text>
          </View>

          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Taxes & Charges</Text>
            <Text style={styles.billValue}>₹{cart.taxes.toFixed(0)}</Text>
          </View>

          {cart.discount > 0 && (
            <View style={styles.billRow}>
              <Text style={[styles.billLabel, styles.discountLabel]}>
                Coupon Discount
              </Text>
              <Text style={[styles.billValue, styles.discountValue]}>
                -₹{cart.discount.toFixed(0)}
              </Text>
            </View>
          )}

          <Divider spacing={SPACING.sm} />

          <View style={styles.billRow}>
            <Text style={styles.totalLabel}>To Pay</Text>
            <Text style={styles.totalValue}>₹{cart.total.toFixed(0)}</Text>
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Checkout Footer */}
      <View style={styles.footer}>
        <View style={styles.footerInfo}>
          <Text style={styles.footerTotal}>₹{cart.total.toFixed(0)}</Text>
          <Text style={styles.footerItems}>
            {cart.items.reduce((sum, item) => sum + item.quantity, 0)} items
          </Text>
        </View>
        <Button
          title="Proceed to Checkout"
          onPress={() => navigation.navigate('Checkout')}
          size="lg"
          style={styles.checkoutButton}
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
  restaurantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SPACING.base,
    marginBottom: SPACING.sm,
  },
  restaurantName: {
    fontSize: FONTS.sizes.base,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.gray900,
    marginLeft: SPACING.sm,
  },
  itemsContainer: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  vegIndicator: {
    width: 14,
    height: 14,
    borderWidth: 1.5,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 3,
    marginRight: SPACING.sm,
  },
  vegDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.medium,
    color: COLORS.gray900,
    marginBottom: SPACING.xs,
  },
  itemPrice: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.gray500,
  },
  itemRight: {
    alignItems: 'flex-end',
  },
  itemTotal: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.gray900,
    marginTop: SPACING.sm,
  },
  addMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray100,
  },
  addMoreText: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.accent,
    marginLeft: SPACING.sm,
  },
  instructionsContainer: {
    backgroundColor: COLORS.white,
    padding: SPACING.base,
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.gray900,
    marginBottom: SPACING.md,
  },
  instructionsInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray50,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
  },
  instructionsPlaceholder: {
    fontSize: FONTS.sizes.md,
    color: COLORS.gray400,
    marginLeft: SPACING.sm,
  },
  couponContainer: {
    backgroundColor: COLORS.white,
    padding: SPACING.base,
  },
  couponInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  couponInput: {
    flex: 1,
    backgroundColor: COLORS.gray50,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.base,
    borderRadius: BORDER_RADIUS.lg,
    fontSize: FONTS.sizes.base,
    color: COLORS.gray900,
    marginRight: SPACING.sm,
  },
  applyButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
  },
  applyButtonText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
    color: COLORS.white,
  },
  couponError: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.error,
    marginTop: SPACING.sm,
  },
  appliedCoupon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.accentLight + '20',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.accentLight,
    borderStyle: 'dashed',
  },
  couponInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  couponDetails: {
    marginLeft: SPACING.sm,
  },
  couponCode: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.accentDark,
  },
  couponSavings: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.accent,
  },
  removeCoupon: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.error,
  },
  billContainer: {
    backgroundColor: COLORS.white,
    padding: SPACING.base,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  billLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  billLabel: {
    fontSize: FONTS.sizes.md,
    color: COLORS.gray600,
    marginRight: SPACING.xs,
  },
  billValue: {
    fontSize: FONTS.sizes.md,
    color: COLORS.gray900,
  },
  discountLabel: {
    color: COLORS.accent,
  },
  discountValue: {
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
  footerItems: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.gray500,
  },
  checkoutButton: {
    flex: 1,
  },
  bottomPadding: {
    height: SPACING.xl,
  },
});

export default CartScreen;
