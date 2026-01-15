import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { SearchBar, EmptyState, Rating } from '../../components/common';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { RootStackParamList, Restaurant, MenuItem } from '../../types';
import { mockRestaurants, cuisineCategories } from '../../services/mockData';

type SearchScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const recentSearches = ['Pizza', 'Burger', 'Sushi', 'Indian Food'];
const popularSearches = ['Biryani', 'Pizza', 'Chinese', 'Desserts', 'Coffee'];

const SearchScreen: React.FC = () => {
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Restaurant[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (query.length > 1) {
      setIsSearching(true);
      // Simulate search
      const results = mockRestaurants.filter(
        (r) =>
          r.name.toLowerCase().includes(query.toLowerCase()) ||
          r.cuisine.some((c) => c.toLowerCase().includes(query.toLowerCase()))
      );
      setSearchResults(results);
    } else {
      setIsSearching(false);
      setSearchResults([]);
    }
  }, []);

  const renderRecentSearches = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Searches</Text>
        <TouchableOpacity>
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.tagsContainer}>
        {recentSearches.map((search, index) => (
          <TouchableOpacity
            key={index}
            style={styles.tag}
            onPress={() => handleSearch(search)}
          >
            <Ionicons name="time-outline" size={14} color={COLORS.gray500} />
            <Text style={styles.tagText}>{search}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderPopularSearches = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Popular Searches</Text>
      <View style={styles.tagsContainer}>
        {popularSearches.map((search, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.tag, styles.popularTag]}
            onPress={() => handleSearch(search)}
          >
            <Ionicons name="trending-up" size={14} color={COLORS.accent} />
            <Text style={[styles.tagText, styles.popularTagText]}>{search}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderCuisines = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Browse by Cuisine</Text>
      <View style={styles.cuisineGrid}>
        {cuisineCategories.map((cuisine) => (
          <TouchableOpacity
            key={cuisine.id}
            style={styles.cuisineItem}
            onPress={() => handleSearch(cuisine.name)}
          >
            <Image
              source={{ uri: cuisine.image }}
              style={styles.cuisineImage}
            />
            <View style={styles.cuisineOverlay} />
            <Text style={styles.cuisineName}>{cuisine.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderSearchResults = () => {
    if (searchResults.length === 0) {
      return (
        <EmptyState
          icon="search-outline"
          title="No results found"
          description={`We couldn't find anything for "${searchQuery}"`}
        />
      );
    }

    return (
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsCount}>
          {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
        </Text>
        {searchResults.map((restaurant) => (
          <TouchableOpacity
            key={restaurant.id}
            style={styles.resultCard}
            onPress={() =>
              navigation.navigate('RestaurantDetail', {
                restaurantId: restaurant.id,
              })
            }
          >
            <Image
              source={{ uri: restaurant.image }}
              style={styles.resultImage}
            />
            <View style={styles.resultInfo}>
              <Text style={styles.resultName}>{restaurant.name}</Text>
              <Text style={styles.resultCuisine} numberOfLines={1}>
                {restaurant.cuisine.join(' • ')}
              </Text>
              <View style={styles.resultMeta}>
                <Rating rating={restaurant.rating} size="sm" />
                <Text style={styles.resultDelivery}>
                  {restaurant.deliveryTime}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <View style={styles.header}>
        <SearchBar
          value={searchQuery}
          onChangeText={handleSearch}
          placeholder="Search restaurants or dishes..."
          autoFocus
          onClear={() => {
            setSearchQuery('');
            setIsSearching(false);
            setSearchResults([]);
          }}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {isSearching ? (
          renderSearchResults()
        ) : (
          <>
            {renderRecentSearches()}
            {renderPopularSearches()}
            {renderCuisines()}
          </>
        )}
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
    padding: SPACING.base,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  section: {
    padding: SPACING.base,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.base,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.gray900,
    marginBottom: SPACING.md,
  },
  clearText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.accent,
    fontWeight: FONTS.weights.medium,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray50,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  popularTag: {
    backgroundColor: COLORS.accentLight + '20',
  },
  tagText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.gray700,
    marginLeft: SPACING.xs,
  },
  popularTagText: {
    color: COLORS.accentDark,
  },
  cuisineGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cuisineItem: {
    width: '48%',
    height: 100,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  cuisineImage: {
    width: '100%',
    height: '100%',
  },
  cuisineOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  cuisineName: {
    position: 'absolute',
    bottom: SPACING.md,
    left: SPACING.md,
    fontSize: FONTS.sizes.base,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.white,
  },
  resultsContainer: {
    padding: SPACING.base,
  },
  resultsCount: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.gray500,
    marginBottom: SPACING.md,
  },
  resultCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
    overflow: 'hidden',
  },
  resultImage: {
    width: 100,
    height: 100,
  },
  resultInfo: {
    flex: 1,
    padding: SPACING.md,
    justifyContent: 'center',
  },
  resultName: {
    fontSize: FONTS.sizes.base,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.gray900,
    marginBottom: SPACING.xs,
  },
  resultCuisine: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.gray500,
    marginBottom: SPACING.sm,
  },
  resultMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resultDelivery: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.gray500,
  },
  bottomPadding: {
    height: 100,
  },
});

export default SearchScreen;
