import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { Rating, Badge, Button, QuantitySelector } from '../../components/common';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { RootStackParamList, MenuItem, MenuCategory } from '../../types';
import { useCartStore } from '../../store/useStore';
import { getRestaurantById, getMenuByRestaurantId } from '../../services/mockData';

const { width, height } = Dimensions.get('window');
const HEADER_HEIGHT = 280;

type RestaurantDetailNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'RestaurantDetail'
>;
type RestaurantDetailRouteProp = RouteProp<RootStackParamList, 'RestaurantDetail'>;

const RestaurantDetailScreen: React.FC = () => {
  const navigation = useNavigation<RestaurantDetailNavigationProp>();
  const route = useRoute<RestaurantDetailRouteProp>();
  const { restaurantId } = route.params;

  const restaurant = getRestaurantById(restaurantId);
  const menuCategories = getMenuByRestaurantId(restaurantId);

  const scrollY = useRef(new Animated.Value(0)).current;
  const { cart, addToCart } = useCartStore();

  const [selectedCategory, setSelectedCategory] = useState(
    menuCategories[0]?.id || ''
  );

  if (!restaurant) {
    return (
      <View style={styles.errorContainer}>
        <Text>Restaurant not found</Text>
      </View>
    );
  }

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT - 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const imageScale = scrollY.interpolate({
    inputRange: [-100, 0],
    outputRange: [1.5, 1],
    extrapolate: 'clamp',
  });

  const handleAddToCart = (item: MenuItem) => {
    addToCart(item, restaurant, 1);
  };

  const getItemQuantityInCart = (itemId: string): number => {
    if (!cart) return 0;
    const cartItem = cart.items.find((i) => i.menuItem.id === itemId);
    return cartItem?.quantity || 0;
  };

  const renderHeader = () => (
    <View style={styles.imageContainer}>
      <Animated.Image
        source={{ uri: restaurant.coverImage || restaurant.image }}
        style={[
          styles.coverImage,
          { transform: [{ scale: imageScale }] },
        ]}
      />
      <View style={styles.imageOverlay} />

      {/* Back Button */}
      <SafeAreaView style={styles.headerButtons}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <View style={styles.headerRightButtons}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="heart-outline" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="share-outline" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Restaurant Info Overlay */}
      <View style={styles.restaurantInfoOverlay}>
        <Text style={styles.restaurantName}>{restaurant.name}</Text>
        <Text style={styles.cuisineText}>
          {restaurant.cuisine.join(' • ')}
        </Text>
        <View style={styles.metaRow}>
          <Rating rating={restaurant.rating} reviewCount={restaurant.reviewCount} />
          <Text style={styles.deliveryInfo}>
            {restaurant.deliveryTime} • {restaurant.distance}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderRestaurantInfo = () => (
    <View style={styles.infoSection}>
      {/* Offers */}
      {restaurant.offers && restaurant.offers.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.offersList}
        >
          {restaurant.offers.map((offer) => (
            <TouchableOpacity key={offer.id} style={styles.offerCard}>
              <Ionicons name="pricetag" size={16} color={COLORS.accent} />
              <View style={styles.offerContent}>
                <Text style={styles.offerTitle}>{offer.title}</Text>
                <Text style={styles.offerCode}>Use code {offer.code}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Info Cards */}
      <View style={styles.infoCards}>
        <View style={styles.infoCard}>
          <Ionicons name="time-outline" size={20} color={COLORS.gray600} />
          <Text style={styles.infoCardTitle}>{restaurant.deliveryTime}</Text>
          <Text style={styles.infoCardSubtitle}>Delivery</Text>
        </View>
        <View style={styles.infoCard}>
          <Ionicons name="bicycle-outline" size={20} color={COLORS.gray600} />
          <Text style={styles.infoCardTitle}>₹{restaurant.deliveryFee}</Text>
          <Text style={styles.infoCardSubtitle}>Delivery Fee</Text>
        </View>
        <View style={styles.infoCard}>
          <Ionicons name="receipt-outline" size={20} color={COLORS.gray600} />
          <Text style={styles.infoCardTitle}>₹{restaurant.minOrder}</Text>
          <Text style={styles.infoCardSubtitle}>Min Order</Text>
        </View>
      </View>
    </View>
  );

  const renderCategoryTabs = () => (
    <View style={styles.categoryTabs}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryTabsContent}
      >
        {menuCategories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryTab,
              selectedCategory === category.id && styles.categoryTabActive,
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Text
              style={[
                styles.categoryTabText,
                selectedCategory === category.id && styles.categoryTabTextActive,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderMenuItem = (item: MenuItem) => {
    const quantity = getItemQuantityInCart(item.id);

    return (
      <View key={item.id} style={styles.menuItem}>
        <View style={styles.menuItemContent}>
          {/* Veg/Non-veg indicator */}
          <View
            style={[
              styles.vegIndicator,
              { borderColor: item.isVeg ? COLORS.accent : COLORS.error },
            ]}
          >
            <View
              style={[
                styles.vegDot,
                { backgroundColor: item.isVeg ? COLORS.accent : COLORS.error },
              ]}
            />
          </View>

          {item.isBestSeller && (
            <Badge text="Bestseller" variant="warning" size="sm" style={styles.bestsellerBadge} />
          )}

          <Text style={styles.menuItemName}>{item.name}</Text>
          <Text style={styles.menuItemPrice}>
            ₹{item.price}
            {item.originalPrice && (
              <Text style={styles.originalPrice}> ₹{item.originalPrice}</Text>
            )}
          </Text>

          {item.rating && (
            <View style={styles.menuItemRating}>
              <Ionicons name="star" size={12} color="#FBBF24" />
              <Text style={styles.ratingText}>
                {item.rating} ({item.reviewCount})
              </Text>
            </View>
          )}

          <Text style={styles.menuItemDescription} numberOfLines={2}>
            {item.description}
          </Text>
        </View>

        <View style={styles.menuItemRight}>
          {item.image && (
            <Image source={{ uri: item.image }} style={styles.menuItemImage} />
          )}
          <View style={styles.addButtonContainer}>
            {quantity > 0 ? (
              <QuantitySelector
                quantity={quantity}
                onIncrease={() => handleAddToCart(item)}
                onDecrease={() => {
                  // Handle decrease
                }}
                size="sm"
                variant="filled"
              />
            ) : (
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => handleAddToCart(item)}
                disabled={!item.isAvailable}
              >
                <Text style={styles.addButtonText}>ADD</Text>
                <Ionicons name="add" size={16} color={COLORS.accent} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderMenu = () => (
    <View style={styles.menuSection}>
      {menuCategories.map((category) => (
        <View key={category.id} style={styles.menuCategory}>
          <Text style={styles.categoryTitle}>
            {category.name} ({category.items.length})
          </Text>
          {category.items.map(renderMenuItem)}
        </View>
      ))}
    </View>
  );

  const cartItemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent={true} backgroundColor="transparent" />

      {/* Animated Header */}
      <Animated.View style={[styles.animatedHeader, { opacity: headerOpacity }]}>
        <SafeAreaView style={styles.animatedHeaderContent}>
          <TouchableOpacity
            style={styles.animatedHeaderButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.gray900} />
          </TouchableOpacity>
          <Text style={styles.animatedHeaderTitle} numberOfLines={1}>
            {restaurant.name}
          </Text>
          <View style={styles.animatedHeaderRight}>
            <TouchableOpacity style={styles.animatedHeaderButton}>
              <Ionicons name="heart-outline" size={24} color={COLORS.gray900} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Animated.View>

      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {renderHeader()}
        {renderRestaurantInfo()}
        {renderCategoryTabs()}
        {renderMenu()}
        <View style={styles.bottomPadding} />
      </Animated.ScrollView>

      {/* Cart Footer */}
      {cartItemCount > 0 && (
        <View style={styles.cartFooter}>
          <View style={styles.cartInfo}>
            <Text style={styles.cartCount}>
              {cartItemCount} item{cartItemCount > 1 ? 's' : ''}
            </Text>
            <Text style={styles.cartTotal}>₹{cart?.total.toFixed(0)}</Text>
          </View>
          <Button
            title="View Cart"
            onPress={() => navigation.navigate('Cart')}
            size="md"
            icon={<Ionicons name="cart" size={18} color={COLORS.white} />}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    height: HEADER_HEIGHT,
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  headerButtons: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.sm,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  headerRightButtons: {
    flexDirection: 'row',
  },
  restaurantInfoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.base,
  },
  restaurantName: {
    fontSize: FONTS.sizes['2xl'],
    fontWeight: FONTS.weights.bold,
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  cuisineText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.gray200,
    marginBottom: SPACING.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  deliveryInfo: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.white,
  },
  animatedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  animatedHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.base,
    paddingBottom: SPACING.sm,
    paddingTop: SPACING.sm,
  },
  animatedHeaderButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  animatedHeaderTitle: {
    flex: 1,
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.gray900,
    marginHorizontal: SPACING.sm,
  },
  animatedHeaderRight: {
    width: 40,
  },
  infoSection: {
    paddingVertical: SPACING.base,
  },
  offersList: {
    paddingHorizontal: SPACING.base,
    marginBottom: SPACING.base,
  },
  offerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accentLight + '20',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.lg,
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.accentLight,
    borderStyle: 'dashed',
  },
  offerContent: {
    marginLeft: SPACING.sm,
  },
  offerTitle: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.accentDark,
  },
  offerCode: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.gray500,
  },
  infoCards: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.base,
  },
  infoCard: {
    flex: 1,
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.gray50,
    borderRadius: BORDER_RADIUS.lg,
    marginHorizontal: SPACING.xs,
  },
  infoCardTitle: {
    fontSize: FONTS.sizes.base,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.gray900,
    marginTop: SPACING.xs,
  },
  infoCardSubtitle: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.gray500,
    marginTop: 2,
  },
  categoryTabs: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  categoryTabsContent: {
    paddingHorizontal: SPACING.base,
  },
  categoryTab: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.base,
    marginRight: SPACING.sm,
  },
  categoryTabActive: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  categoryTabText: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.medium,
    color: COLORS.gray500,
  },
  categoryTabTextActive: {
    color: COLORS.primary,
    fontWeight: FONTS.weights.semiBold,
  },
  menuSection: {
    padding: SPACING.base,
  },
  menuCategory: {
    marginBottom: SPACING.lg,
  },
  categoryTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.gray900,
    marginBottom: SPACING.md,
  },
  menuItem: {
    flexDirection: 'row',
    paddingVertical: SPACING.base,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  menuItemContent: {
    flex: 1,
    paddingRight: SPACING.md,
  },
  vegIndicator: {
    width: 16,
    height: 16,
    borderWidth: 1.5,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs,
  },
  vegDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  bestsellerBadge: {
    marginBottom: SPACING.xs,
  },
  menuItemName: {
    fontSize: FONTS.sizes.base,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.gray900,
    marginBottom: SPACING.xs,
  },
  menuItemPrice: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.medium,
    color: COLORS.gray900,
    marginBottom: SPACING.xs,
  },
  originalPrice: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.gray400,
    textDecorationLine: 'line-through',
  },
  menuItemRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  ratingText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.gray500,
    marginLeft: SPACING.xs,
  },
  menuItemDescription: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.gray500,
    lineHeight: FONTS.sizes.sm * 1.4,
  },
  menuItemRight: {
    width: 120,
    alignItems: 'center',
  },
  menuItemImage: {
    width: 100,
    height: 80,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.sm,
  },
  addButtonContainer: {
    position: 'absolute',
    bottom: -SPACING.xs,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.accent,
    ...SHADOWS.sm,
  },
  addButtonText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
    color: COLORS.accent,
    marginRight: SPACING.xs,
  },
  cartFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.base,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray100,
    ...SHADOWS.lg,
  },
  cartInfo: {
    flex: 1,
  },
  cartCount: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.gray500,
  },
  cartTotal: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.gray900,
  },
  bottomPadding: {
    height: 100,
  },
});

export default RestaurantDetailScreen;
