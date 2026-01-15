import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { Header, Button, Divider } from '../../components/common';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { RootStackParamList } from '../../types';

type OrderDetailNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'OrderDetail'
>;
type OrderDetailRouteProp = RouteProp<RootStackParamList, 'OrderDetail'>;

const OrderDetailScreen: React.FC = () => {
  const navigation = useNavigation<OrderDetailNavigationProp>();
  const route = useRoute<OrderDetailRouteProp>();
  const { orderId } = route.params;

  // Mock order data
  const order = {
    id: orderId,
    orderNumber: 'ORD001',
    restaurantName: 'Pizza Paradise',
    restaurantImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200',
    status: 'delivered',
    date: 'January 10, 2024 at 7:30 PM',
    items: [
      { name: 'Margherita Pizza', quantity: 1, price: 299 },
      { name: 'Garlic Bread', quantity: 1, price: 129 },
    ],
    subtotal: 428,
    deliveryFee: 30,
    taxes: 21,
    discount: 0,
    total: 479,
    paymentMethod: 'UPI',
    deliveryAddress: '123 Main Street, Apartment 4B, New Delhi',
    rating: 4,
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <Header
        showBack
        onBackPress={() => navigation.goBack()}
        title="Order Details"
        centerTitle
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Restaurant Info */}
        <View style={styles.restaurantCard}>
          <Image
            source={{ uri: order.restaurantImage }}
            style={styles.restaurantImage}
          />
          <View style={styles.restaurantInfo}>
            <Text style={styles.restaurantName}>{order.restaurantName}</Text>
            <Text style={styles.orderDate}>{order.date}</Text>
          </View>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>Delivered</Text>
          </View>
        </View>

        {/* Order Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          {order.items.map((item, index) => (
            <View key={index} style={styles.orderItem}>
              <View style={styles.itemLeft}>
                <Text style={styles.itemQuantity}>{item.quantity}x</Text>
                <Text style={styles.itemName}>{item.name}</Text>
              </View>
              <Text style={styles.itemPrice}>₹{item.price}</Text>
            </View>
          ))}
        </View>

        <Divider spacing={0} />

        {/* Bill Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bill Summary</Text>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Item Total</Text>
            <Text style={styles.billValue}>₹{order.subtotal}</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Delivery Fee</Text>
            <Text style={styles.billValue}>₹{order.deliveryFee}</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Taxes</Text>
            <Text style={styles.billValue}>₹{order.taxes}</Text>
          </View>
          {order.discount > 0 && (
            <View style={styles.billRow}>
              <Text style={[styles.billLabel, styles.discount]}>Discount</Text>
              <Text style={[styles.billValue, styles.discount]}>
                -₹{order.discount}
              </Text>
            </View>
          )}
          <Divider spacing={SPACING.sm} />
          <View style={styles.billRow}>
            <Text style={styles.totalLabel}>Total Paid</Text>
            <Text style={styles.totalValue}>₹{order.total}</Text>
          </View>
        </View>

        <Divider spacing={0} />

        {/* Payment Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment</Text>
          <View style={styles.paymentRow}>
            <Ionicons name="phone-portrait-outline" size={20} color={COLORS.gray600} />
            <Text style={styles.paymentMethod}>{order.paymentMethod}</Text>
            <View style={styles.paidBadge}>
              <Text style={styles.paidText}>Paid</Text>
            </View>
          </View>
        </View>

        <Divider spacing={0} />

        {/* Delivery Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivered To</Text>
          <View style={styles.addressRow}>
            <Ionicons name="location-outline" size={20} color={COLORS.gray600} />
            <Text style={styles.addressText}>{order.deliveryAddress}</Text>
          </View>
        </View>

        <Divider spacing={0} />

        {/* Rating */}
        {order.rating && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Rating</Text>
            <View style={styles.ratingRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons
                  key={star}
                  name={star <= order.rating ? 'star' : 'star-outline'}
                  size={24}
                  color={star <= order.rating ? '#FBBF24' : COLORS.gray300}
                  style={{ marginRight: SPACING.xs }}
                />
              ))}
            </View>
          </View>
        )}

        {/* Actions */}
        <View style={styles.actionsSection}>
          <Button
            title="Reorder"
            onPress={() => {}}
            fullWidth
            style={styles.reorderButton}
          />
          <TouchableOpacity style={styles.helpButton}>
            <Ionicons name="help-circle-outline" size={20} color={COLORS.gray600} />
            <Text style={styles.helpText}>Need help with this order?</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  restaurantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.base,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  restaurantImage: {
    width: 60,
    height: 60,
    borderRadius: BORDER_RADIUS.lg,
  },
  restaurantInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  restaurantName: {
    fontSize: FONTS.sizes.base,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.gray900,
    marginBottom: SPACING.xs,
  },
  orderDate: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.gray500,
  },
  statusBadge: {
    backgroundColor: COLORS.accentLight + '30',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
  },
  statusText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.accent,
  },
  section: {
    padding: SPACING.base,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.gray900,
    marginBottom: SPACING.md,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemQuantity: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.accent,
    marginRight: SPACING.sm,
  },
  itemName: {
    fontSize: FONTS.sizes.md,
    color: COLORS.gray700,
  },
  itemPrice: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.medium,
    color: COLORS.gray900,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
  },
  billLabel: {
    fontSize: FONTS.sizes.md,
    color: COLORS.gray600,
  },
  billValue: {
    fontSize: FONTS.sizes.md,
    color: COLORS.gray900,
  },
  discount: {
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
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentMethod: {
    fontSize: FONTS.sizes.md,
    color: COLORS.gray700,
    marginLeft: SPACING.sm,
    flex: 1,
  },
  paidBadge: {
    backgroundColor: COLORS.accentLight + '30',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  paidText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.accent,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  addressText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.gray700,
    marginLeft: SPACING.sm,
    flex: 1,
    lineHeight: FONTS.sizes.md * 1.4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionsSection: {
    padding: SPACING.base,
  },
  reorderButton: {
    marginBottom: SPACING.md,
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.md,
  },
  helpText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.gray600,
    marginLeft: SPACING.sm,
  },
  bottomPadding: {
    height: SPACING.xl,
  },
});

export default OrderDetailScreen;
