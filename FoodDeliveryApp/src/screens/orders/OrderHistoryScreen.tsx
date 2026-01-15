import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { EmptyState, Badge } from '../../components/common';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { RootStackParamList, Order, OrderStatus } from '../../types';

type OrderHistoryNavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Mock orders data
const mockOrders = [
  {
    id: 'ord001',
    orderNumber: 'ORD001',
    restaurantName: 'Pizza Paradise',
    restaurantImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200',
    items: ['Margherita Pizza', 'Garlic Bread'],
    itemCount: 2,
    total: 428,
    status: 'delivered' as OrderStatus,
    date: '2024-01-10',
    rating: 4,
  },
  {
    id: 'ord002',
    orderNumber: 'ORD002',
    restaurantName: 'Burger Barn',
    restaurantImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200',
    items: ['Classic Burger', 'Fries', 'Coke'],
    itemCount: 3,
    total: 349,
    status: 'on_the_way' as OrderStatus,
    date: '2024-01-10',
  },
  {
    id: 'ord003',
    orderNumber: 'ORD003',
    restaurantName: 'Sushi Master',
    restaurantImage: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=200',
    items: ['California Roll', 'Miso Soup'],
    itemCount: 2,
    total: 599,
    status: 'preparing' as OrderStatus,
    date: '2024-01-09',
  },
  {
    id: 'ord004',
    orderNumber: 'ORD004',
    restaurantName: 'Curry House',
    restaurantImage: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=200',
    items: ['Butter Chicken', 'Naan', 'Biryani'],
    itemCount: 3,
    total: 699,
    status: 'delivered' as OrderStatus,
    date: '2024-01-08',
    rating: 5,
  },
];

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case 'delivered':
      return COLORS.accent;
    case 'on_the_way':
    case 'picked_up':
      return COLORS.info;
    case 'preparing':
    case 'confirmed':
      return COLORS.warning;
    case 'cancelled':
      return COLORS.error;
    default:
      return COLORS.gray500;
  }
};

const getStatusText = (status: OrderStatus) => {
  switch (status) {
    case 'delivered':
      return 'Delivered';
    case 'on_the_way':
      return 'On the Way';
    case 'picked_up':
      return 'Picked Up';
    case 'preparing':
      return 'Preparing';
    case 'confirmed':
      return 'Confirmed';
    case 'cancelled':
      return 'Cancelled';
    default:
      return 'Pending';
  }
};

const OrderHistoryScreen: React.FC = () => {
  const navigation = useNavigation<OrderHistoryNavigationProp>();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'past'>('active');

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const activeOrders = mockOrders.filter(
    (o) =>
      o.status === 'confirmed' ||
      o.status === 'preparing' ||
      o.status === 'picked_up' ||
      o.status === 'on_the_way'
  );

  const pastOrders = mockOrders.filter(
    (o) => o.status === 'delivered' || o.status === 'cancelled'
  );

  const orders = activeTab === 'active' ? activeOrders : pastOrders;

  const renderOrderCard = ({ item }: { item: typeof mockOrders[0] }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => {
        if (item.status !== 'delivered' && item.status !== 'cancelled') {
          navigation.navigate('OrderTracking', { orderId: item.id });
        } else {
          navigation.navigate('OrderDetail', { orderId: item.id });
        }
      }}
    >
      <View style={styles.orderHeader}>
        <Image source={{ uri: item.restaurantImage }} style={styles.restaurantImage} />
        <View style={styles.orderInfo}>
          <Text style={styles.restaurantName}>{item.restaurantName}</Text>
          <Text style={styles.orderItems} numberOfLines={1}>
            {item.items.join(', ')}
          </Text>
          <Text style={styles.orderDate}>{item.date}</Text>
        </View>
        <View style={styles.orderRight}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(item.status) + '20' },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: getStatusColor(item.status) },
              ]}
            >
              {getStatusText(item.status)}
            </Text>
          </View>
          <Text style={styles.orderTotal}>₹{item.total}</Text>
        </View>
      </View>

      <View style={styles.orderFooter}>
        <View style={styles.itemsInfo}>
          <Text style={styles.itemsCount}>
            {item.itemCount} item{item.itemCount > 1 ? 's' : ''}
          </Text>
        </View>

        {item.status === 'delivered' && !item.rating && (
          <TouchableOpacity
            style={styles.rateButton}
            onPress={() => navigation.navigate('RateOrder', { orderId: item.id })}
          >
            <Ionicons name="star-outline" size={16} color={COLORS.accent} />
            <Text style={styles.rateButtonText}>Rate Order</Text>
          </TouchableOpacity>
        )}

        {item.status === 'delivered' && item.rating && (
          <View style={styles.ratingDisplay}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Ionicons
                key={star}
                name={star <= item.rating ? 'star' : 'star-outline'}
                size={16}
                color={star <= item.rating ? '#FBBF24' : COLORS.gray300}
              />
            ))}
          </View>
        )}

        {item.status !== 'delivered' && item.status !== 'cancelled' && (
          <TouchableOpacity
            style={styles.trackButton}
            onPress={() =>
              navigation.navigate('OrderTracking', { orderId: item.id })
            }
          >
            <Ionicons name="location-outline" size={16} color={COLORS.accent} />
            <Text style={styles.trackButtonText}>Track Order</Text>
          </TouchableOpacity>
        )}

        {item.status === 'delivered' && (
          <TouchableOpacity style={styles.reorderButton}>
            <Ionicons name="repeat" size={16} color={COLORS.accent} />
            <Text style={styles.reorderButtonText}>Reorder</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Orders</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'active' && styles.tabActive]}
          onPress={() => setActiveTab('active')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'active' && styles.tabTextActive,
            ]}
          >
            Active ({activeOrders.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'past' && styles.tabActive]}
          onPress={() => setActiveTab('past')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'past' && styles.tabTextActive,
            ]}
          >
            Past Orders ({pastOrders.length})
          </Text>
        </TouchableOpacity>
      </View>

      {orders.length === 0 ? (
        <EmptyState
          icon={activeTab === 'active' ? 'receipt-outline' : 'time-outline'}
          title={
            activeTab === 'active'
              ? 'No Active Orders'
              : 'No Past Orders'
          }
          description={
            activeTab === 'active'
              ? "You don't have any active orders right now"
              : "You haven't placed any orders yet"
          }
          actionTitle="Browse Restaurants"
          onAction={() => navigation.navigate('Main')}
        />
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundSecondary,
  },
  header: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
  },
  headerTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.gray900,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.base,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.medium,
    color: COLORS.gray500,
  },
  tabTextActive: {
    color: COLORS.primary,
    fontWeight: FONTS.weights.semiBold,
  },
  listContent: {
    padding: SPACING.base,
  },
  orderCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  orderHeader: {
    flexDirection: 'row',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  restaurantImage: {
    width: 60,
    height: 60,
    borderRadius: BORDER_RADIUS.lg,
  },
  orderInfo: {
    flex: 1,
    marginLeft: SPACING.md,
    justifyContent: 'center',
  },
  restaurantName: {
    fontSize: FONTS.sizes.base,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.gray900,
    marginBottom: SPACING.xs,
  },
  orderItems: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.gray500,
    marginBottom: SPACING.xs,
  },
  orderDate: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.gray400,
  },
  orderRight: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
  },
  statusText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.semiBold,
  },
  orderTotal: {
    fontSize: FONTS.sizes.base,
    fontWeight: FONTS.weights.bold,
    color: COLORS.gray900,
  },
  orderFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
  },
  itemsInfo: {
    flex: 1,
  },
  itemsCount: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.gray500,
  },
  rateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.accent,
    marginLeft: SPACING.sm,
  },
  rateButtonText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.accent,
    marginLeft: SPACING.xs,
  },
  ratingDisplay: {
    flexDirection: 'row',
  },
  trackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.accentLight + '30',
    borderRadius: BORDER_RADIUS.full,
    marginLeft: SPACING.sm,
  },
  trackButtonText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.accent,
    marginLeft: SPACING.xs,
  },
  reorderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.accent,
    marginLeft: SPACING.sm,
  },
  reorderButtonText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.accent,
    marginLeft: SPACING.xs,
  },
});

export default OrderHistoryScreen;
