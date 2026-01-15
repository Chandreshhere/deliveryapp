import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { Header, Button } from '../../components/common';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../constants/theme';
import { RootStackParamList } from '../../types';

type RateOrderNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'RateOrder'
>;
type RateOrderRouteProp = RouteProp<RootStackParamList, 'RateOrder'>;

const RateOrderScreen: React.FC = () => {
  const navigation = useNavigation<RateOrderNavigationProp>();
  const route = useRoute<RateOrderRouteProp>();
  const { orderId } = route.params;

  const [foodRating, setFoodRating] = useState(0);
  const [deliveryRating, setDeliveryRating] = useState(0);
  const [review, setReview] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tags = [
    'Great taste',
    'Good packaging',
    'Fresh food',
    'Fast delivery',
    'Polite delivery',
    'On-time',
  ];

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      navigation.goBack();
    }, 1000);
  };

  const renderStars = (
    rating: number,
    onRate: (rating: number) => void,
    size = 36
  ) => (
    <View style={styles.starsContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => onRate(star)}
          style={styles.starButton}
        >
          <Ionicons
            name={star <= rating ? 'star' : 'star-outline'}
            size={size}
            color={star <= rating ? '#FBBF24' : COLORS.gray300}
          />
        </TouchableOpacity>
      ))}
    </View>
  );

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 1:
        return 'Poor';
      case 2:
        return 'Fair';
      case 3:
        return 'Good';
      case 4:
        return 'Very Good';
      case 5:
        return 'Excellent';
      default:
        return 'Tap to rate';
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* Close Button */}
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="close" size={24} color={COLORS.gray600} />
      </TouchableOpacity>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Rate your experience</Text>
          <Text style={styles.subtitle}>
            Your feedback helps us improve our service
          </Text>
        </View>

        {/* Food Rating */}
        <View style={styles.ratingSection}>
          <Text style={styles.ratingLabel}>Food Quality</Text>
          {renderStars(foodRating, setFoodRating)}
          <Text style={styles.ratingText}>{getRatingText(foodRating)}</Text>
        </View>

        {/* Delivery Rating */}
        <View style={styles.ratingSection}>
          <Text style={styles.ratingLabel}>Delivery Experience</Text>
          {renderStars(deliveryRating, setDeliveryRating)}
          <Text style={styles.ratingText}>{getRatingText(deliveryRating)}</Text>
        </View>

        {/* Tags */}
        <View style={styles.tagsSection}>
          <Text style={styles.tagsLabel}>What did you like?</Text>
          <View style={styles.tagsContainer}>
            {tags.map((tag) => (
              <TouchableOpacity
                key={tag}
                style={[
                  styles.tag,
                  selectedTags.includes(tag) && styles.tagSelected,
                ]}
                onPress={() => toggleTag(tag)}
              >
                <Text
                  style={[
                    styles.tagText,
                    selectedTags.includes(tag) && styles.tagTextSelected,
                  ]}
                >
                  {tag}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Review */}
        <View style={styles.reviewSection}>
          <Text style={styles.reviewLabel}>Additional feedback (optional)</Text>
          <TextInput
            style={styles.reviewInput}
            placeholder="Share your experience..."
            placeholderTextColor={COLORS.gray400}
            multiline
            numberOfLines={4}
            value={review}
            onChangeText={setReview}
            textAlignVertical="top"
          />
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.footer}>
        <Button
          title="Submit Review"
          onPress={handleSubmit}
          loading={isSubmitting}
          disabled={foodRating === 0}
          fullWidth
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
  closeButton: {
    alignSelf: 'flex-end',
    padding: SPACING.base,
  },
  scrollContent: {
    paddingHorizontal: SPACING.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: FONTS.sizes['2xl'],
    fontWeight: FONTS.weights.bold,
    color: COLORS.gray900,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONTS.sizes.base,
    color: COLORS.gray500,
    textAlign: 'center',
  },
  ratingSection: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.gray50,
    borderRadius: BORDER_RADIUS.xl,
  },
  ratingLabel: {
    fontSize: FONTS.sizes.base,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.gray900,
    marginBottom: SPACING.md,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starButton: {
    padding: SPACING.xs,
  },
  ratingText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.gray500,
    marginTop: SPACING.sm,
  },
  tagsSection: {
    marginBottom: SPACING.xl,
  },
  tagsLabel: {
    fontSize: FONTS.sizes.base,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.gray900,
    marginBottom: SPACING.md,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.gray100,
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  tagSelected: {
    backgroundColor: COLORS.accentLight + '30',
    borderColor: COLORS.accent,
    borderWidth: 1,
  },
  tagText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.gray600,
  },
  tagTextSelected: {
    color: COLORS.accent,
    fontWeight: FONTS.weights.medium,
  },
  reviewSection: {
    marginBottom: SPACING.xl,
  },
  reviewLabel: {
    fontSize: FONTS.sizes.base,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.gray900,
    marginBottom: SPACING.md,
  },
  reviewInput: {
    backgroundColor: COLORS.gray50,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    fontSize: FONTS.sizes.base,
    color: COLORS.gray900,
    minHeight: 100,
    borderWidth: 1,
    borderColor: COLORS.gray200,
  },
  footer: {
    padding: SPACING.base,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray100,
  },
});

export default RateOrderScreen;
