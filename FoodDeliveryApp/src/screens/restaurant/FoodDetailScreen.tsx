import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { Button, QuantitySelector, Rating, Badge } from '../../components/common';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../constants/theme';
import { RootStackParamList } from '../../types';
import { useCartStore } from '../../store/useStore';
import { getRestaurantById, getMenuItemById } from '../../services/mockData';

const { width } = Dimensions.get('window');

type FoodDetailNavigationProp = NativeStackNavigationProp<RootStackParamList, 'FoodDetail'>;
type FoodDetailRouteProp = RouteProp<RootStackParamList, 'FoodDetail'>;

const FoodDetailScreen: React.FC = () => {
  const navigation = useNavigation<FoodDetailNavigationProp>();
  const route = useRoute<FoodDetailRouteProp>();
  const { restaurantId, itemId } = route.params;

  const restaurant = getRestaurantById(restaurantId);
  const menuItem = getMenuItemById(restaurantId, itemId);
  const { addToCart } = useCartStore();

  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');

  if (!menuItem || !restaurant) {
    return (
      <View style={styles.errorContainer}>
        <Text>Item not found</Text>
      </View>
    );
  }

  const totalPrice = menuItem.price * quantity;

  const handleAddToCart = () => {
    addToCart(menuItem, restaurant, quantity);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent={true} backgroundColor="transparent" />

      {/* Close Button */}
      <SafeAreaView style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="close" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image */}
        {menuItem.image ? (
          <Image source={{ uri: menuItem.image }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="fast-food-outline" size={64} color={COLORS.gray300} />
          </View>
        )}

        <View style={styles.content}>
          {/* Veg/Non-veg Badge */}
          <View style={styles.badges}>
            <View
              style={[
                styles.vegBadge,
                { borderColor: menuItem.isVeg ? COLORS.accent : COLORS.error },
              ]}
            >
              <View
                style={[
                  styles.vegDot,
                  { backgroundColor: menuItem.isVeg ? COLORS.accent : COLORS.error },
                ]}
              />
            </View>
            {menuItem.isBestSeller && (
              <Badge text="Bestseller" variant="warning" size="sm" />
            )}
          </View>

          {/* Name and Price */}
          <Text style={styles.name}>{menuItem.name}</Text>

          <View style={styles.priceRow}>
            <Text style={styles.price}>₹{menuItem.price}</Text>
            {menuItem.originalPrice && (
              <Text style={styles.originalPrice}>₹{menuItem.originalPrice}</Text>
            )}
            {menuItem.originalPrice && (
              <Badge
                text={`${Math.round(
                  ((menuItem.originalPrice - menuItem.price) /
                    menuItem.originalPrice) *
                    100
                )}% OFF`}
                variant="success"
                size="sm"
              />
            )}
          </View>

          {/* Rating */}
          {menuItem.rating && (
            <View style={styles.ratingContainer}>
              <Rating
                rating={menuItem.rating}
                reviewCount={menuItem.reviewCount}
                showStars
              />
            </View>
          )}

          {/* Description */}
          <Text style={styles.description}>{menuItem.description}</Text>

          {/* Restaurant Info */}
          <TouchableOpacity style={styles.restaurantInfo}>
            <Ionicons name="restaurant-outline" size={20} color={COLORS.gray500} />
            <Text style={styles.restaurantName}>{restaurant.name}</Text>
            <Ionicons name="chevron-forward" size={16} color={COLORS.gray400} />
          </TouchableOpacity>

          {/* Quantity Selector */}
          <View style={styles.quantitySection}>
            <Text style={styles.sectionTitle}>Quantity</Text>
            <QuantitySelector
              quantity={quantity}
              onIncrease={() => setQuantity(quantity + 1)}
              onDecrease={() => quantity > 1 && setQuantity(quantity - 1)}
              minValue={1}
              size="lg"
            />
          </View>

          {/* Customizations (Placeholder) */}
          {menuItem.customizations && menuItem.customizations.length > 0 && (
            <View style={styles.customizationSection}>
              <Text style={styles.sectionTitle}>Customizations</Text>
              {/* Add customization options here */}
            </View>
          )}

          {/* Special Instructions */}
          <View style={styles.instructionsSection}>
            <Text style={styles.sectionTitle}>Special Instructions</Text>
            <TouchableOpacity style={styles.instructionsInput}>
              <Ionicons name="create-outline" size={20} color={COLORS.gray400} />
              <Text style={styles.instructionsPlaceholder}>
                Add cooking instructions (optional)
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Add to Cart Button */}
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalPrice}>₹{totalPrice}</Text>
        </View>
        <Button
          title={`Add ${quantity} to Cart`}
          onPress={handleAddToCart}
          size="lg"
          style={styles.addButton}
        />
      </View>
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
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.sm,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: 280,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: COLORS.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: SPACING.base,
  },
  badges: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    gap: SPACING.sm,
  },
  vegBadge: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vegDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  name: {
    fontSize: FONTS.sizes['2xl'],
    fontWeight: FONTS.weights.bold,
    color: COLORS.gray900,
    marginBottom: SPACING.sm,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  price: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.gray900,
  },
  originalPrice: {
    fontSize: FONTS.sizes.base,
    color: COLORS.gray400,
    textDecorationLine: 'line-through',
  },
  ratingContainer: {
    marginBottom: SPACING.md,
  },
  description: {
    fontSize: FONTS.sizes.base,
    color: COLORS.gray600,
    lineHeight: FONTS.sizes.base * 1.5,
    marginBottom: SPACING.lg,
  },
  restaurantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.gray50,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.lg,
  },
  restaurantName: {
    flex: 1,
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.medium,
    color: COLORS.gray700,
    marginLeft: SPACING.sm,
  },
  quantitySection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray100,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.base,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.gray900,
  },
  customizationSection: {
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray100,
  },
  instructionsSection: {
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray100,
  },
  instructionsInput: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.gray50,
    borderRadius: BORDER_RADIUS.lg,
    marginTop: SPACING.sm,
  },
  instructionsPlaceholder: {
    fontSize: FONTS.sizes.md,
    color: COLORS.gray400,
    marginLeft: SPACING.sm,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.base,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray100,
  },
  totalContainer: {
    marginRight: SPACING.lg,
  },
  totalLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.gray500,
  },
  totalPrice: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.gray900,
  },
  addButton: {
    flex: 1,
  },
});

export default FoodDetailScreen;
