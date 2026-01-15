import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { SearchBar, Card, Rating, Badge } from '../../components/common';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { RootStackParamList, Restaurant } from '../../types';
import { useLocationStore, useCartStore } from '../../store/useStore';
import { mockRestaurants, cuisineCategories, mockOffers } from '../../services/mockData';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - SPACING.base * 2;

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const currentLocation = useLocationStore((state) => state.currentLocation);
  const cartItemCount = useCartStore((state) => state.getItemCount());

  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  const featuredRestaurants = mockRestaurants.filter((r) => r.isFeatured);
  const allRestaurants = mockRestaurants;

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.locationContainer}
        onPress={() => navigation.navigate('LocationSelector')}
      >
        <View style={styles.locationIcon}>
          <Ionicons name="location" size={20} color={COLORS.accent} />
        </View>
        <View style={styles.locationText}>
          <Text style={styles.deliverTo}>Deliver to</Text>
          <View style={styles.addressRow}>
            <Text style={styles.address} numberOfLines={1}>
              {currentLocation?.label || 'Select Location'}
            </Text>
            <Ionicons name="chevron-down" size={16} color={COLORS.gray900} />
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cartButton}
        onPress={() => navigation.navigate('Cart')}
      >
        <Ionicons name="cart-outline" size={24} color={COLORS.gray900} />
        {cartItemCount > 0 && (
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>
              {cartItemCount > 9 ? '9+' : cartItemCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );

  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search for restaurants or dishes..."
        editable={false}
        onPress={() => navigation.navigate('Search')}
      />
    </View>
  );

  const renderOffersBanner = () => (
    <View style={styles.offersContainer}>
      <FlatList
        data={mockOffers}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.offersList}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.offerCard} activeOpacity={0.9}>
            <View style={styles.offerContent}>
              <Text style={styles.offerTitle}>{item.title}</Text>
              <Text style={styles.offerDescription}>{item.description}</Text>
              <View style={styles.offerCode}>
                <Text style={styles.offerCodeText}>Use code: {item.code}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );

  const renderCategories = () => (
    <View style={styles.categoriesContainer}>
      <Text style={styles.sectionTitle}>What are you craving?</Text>
      <FlatList
        data={cuisineCategories}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesList}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.categoryItem}>
            <View style={styles.categoryImageContainer}>
              <Image
                source={{ uri: item.image }}
                style={styles.categoryImage}
              />
            </View>
            <Text style={styles.categoryName}>{item.name}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );

  const renderRestaurantCard = (restaurant: Restaurant, compact = false) => (
    <TouchableOpacity
      key={restaurant.id}
      style={[styles.restaurantCard, compact && styles.restaurantCardCompact]}
      onPress={() =>
        navigation.navigate('RestaurantDetail', { restaurantId: restaurant.id })
      }
      activeOpacity={0.9}
    >
      <View style={styles.restaurantImageContainer}>
        <Image
          source={{ uri: restaurant.image }}
          style={[
            styles.restaurantImage,
            compact && styles.restaurantImageCompact,
          ]}
        />
        {restaurant.offers && restaurant.offers.length > 0 && (
          <View style={styles.offerBadge}>
            <Text style={styles.offerBadgeText}>
              {restaurant.offers[0].title}
            </Text>
          </View>
        )}
        <View style={styles.deliveryTimeBadge}>
          <Ionicons name="time-outline" size={12} color={COLORS.gray700} />
          <Text style={styles.deliveryTimeText}>{restaurant.deliveryTime}</Text>
        </View>
      </View>

      <View style={styles.restaurantInfo}>
        <View style={styles.restaurantHeader}>
          <Text style={styles.restaurantName} numberOfLines={1}>
            {restaurant.name}
          </Text>
          <Rating rating={restaurant.rating} size="sm" />
        </View>

        <Text style={styles.cuisineText} numberOfLines={1}>
          {restaurant.cuisine.join(' • ')}
        </Text>

        <View style={styles.restaurantMeta}>
          <Text style={styles.metaText}>{restaurant.distance}</Text>
          <View style={styles.metaDot} />
          <Text style={styles.metaText}>
            ₹{restaurant.deliveryFee} delivery
          </Text>
          {restaurant.isPureVeg && (
            <>
              <View style={styles.metaDot} />
              <View style={styles.vegBadge}>
                <View style={styles.vegDot} />
              </View>
            </>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFeaturedRestaurants = () => (
    <View style={styles.featuredContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Featured Restaurants</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={featuredRestaurants}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.featuredList}
        renderItem={({ item }) => renderRestaurantCard(item, true)}
        keyExtractor={(item) => item.id}
      />
    </View>
  );

  const renderAllRestaurants = () => (
    <View style={styles.allRestaurantsContainer}>
      <Text style={styles.sectionTitle}>All Restaurants</Text>
      {allRestaurants.map((restaurant) => renderRestaurantCard(restaurant))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      >
        {renderHeader()}
        {renderSearchBar()}
        {renderOffersBanner()}
        {renderCategories()}
        {renderFeaturedRestaurants()}
        {renderAllRestaurants()}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.accentLight + '30',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  locationText: {
    flex: 1,
  },
  deliverTo: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.gray500,
    marginBottom: 2,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  address: {
    fontSize: FONTS.sizes.base,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.gray900,
    marginRight: SPACING.xs,
    maxWidth: width * 0.5,
  },
  cartButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.gray50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: COLORS.accent,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: FONTS.weights.bold,
  },
  searchContainer: {
    paddingHorizontal: SPACING.base,
    marginBottom: SPACING.base,
  },
  offersContainer: {
    marginBottom: SPACING.lg,
  },
  offersList: {
    paddingHorizontal: SPACING.base,
  },
  offerCard: {
    width: width * 0.8,
    height: 100,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.xl,
    marginRight: SPACING.md,
    overflow: 'hidden',
  },
  offerContent: {
    flex: 1,
    padding: SPACING.base,
    justifyContent: 'center',
  },
  offerTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  offerDescription: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.gray300,
    marginBottom: SPACING.sm,
  },
  offerCode: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    alignSelf: 'flex-start',
  },
  offerCodeText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.white,
    fontWeight: FONTS.weights.medium,
  },
  categoriesContainer: {
    marginBottom: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.base,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.gray900,
    paddingHorizontal: SPACING.base,
    marginBottom: SPACING.md,
  },
  seeAllText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.accent,
  },
  categoriesList: {
    paddingHorizontal: SPACING.base,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: SPACING.lg,
  },
  categoryImageContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.gray50,
    overflow: 'hidden',
    marginBottom: SPACING.sm,
    ...SHADOWS.sm,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  categoryName: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.medium,
    color: COLORS.gray700,
  },
  featuredContainer: {
    marginBottom: SPACING.lg,
  },
  featuredList: {
    paddingHorizontal: SPACING.base,
  },
  restaurantCard: {
    marginHorizontal: SPACING.base,
    marginBottom: SPACING.base,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    ...SHADOWS.md,
  },
  restaurantCardCompact: {
    width: width * 0.7,
    marginHorizontal: 0,
    marginRight: SPACING.md,
  },
  restaurantImageContainer: {
    position: 'relative',
  },
  restaurantImage: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
  },
  restaurantImageCompact: {
    height: 130,
  },
  offerBadge: {
    position: 'absolute',
    bottom: SPACING.sm,
    left: SPACING.sm,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  offerBadgeText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.bold,
    color: COLORS.white,
  },
  deliveryTimeBadge: {
    position: 'absolute',
    bottom: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  deliveryTimeText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.medium,
    color: COLORS.gray700,
    marginLeft: 4,
  },
  restaurantInfo: {
    padding: SPACING.md,
  },
  restaurantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  restaurantName: {
    fontSize: FONTS.sizes.base,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.gray900,
    flex: 1,
    marginRight: SPACING.sm,
  },
  cuisineText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.gray500,
    marginBottom: SPACING.sm,
  },
  restaurantMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.gray500,
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: COLORS.gray400,
    marginHorizontal: SPACING.sm,
  },
  vegBadge: {
    width: 16,
    height: 16,
    borderWidth: 1.5,
    borderColor: COLORS.accent,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vegDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.accent,
  },
  allRestaurantsContainer: {
    paddingBottom: SPACING.lg,
  },
  bottomPadding: {
    height: 100,
  },
});

export default HomeScreen;
