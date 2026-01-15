import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Animated,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { Header, Button, Avatar } from '../../components/common';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { RootStackParamList, OrderStatus } from '../../types';

const { width, height } = Dimensions.get('window');

type OrderTrackingNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'OrderTracking'
>;
type OrderTrackingRouteProp = RouteProp<RootStackParamList, 'OrderTracking'>;

interface TrackingStep {
  id: OrderStatus;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const trackingSteps: TrackingStep[] = [
  {
    id: 'confirmed',
    title: 'Order Confirmed',
    subtitle: 'Restaurant accepted your order',
    icon: 'checkmark-circle',
  },
  {
    id: 'preparing',
    title: 'Preparing',
    subtitle: 'Your food is being prepared',
    icon: 'restaurant',
  },
  {
    id: 'picked_up',
    title: 'On the Way',
    subtitle: 'Delivery partner picked up your order',
    icon: 'bicycle',
  },
  {
    id: 'delivered',
    title: 'Delivered',
    subtitle: 'Enjoy your meal!',
    icon: 'home',
  },
];

const OrderTrackingScreen: React.FC = () => {
  const navigation = useNavigation<OrderTrackingNavigationProp>();
  const route = useRoute<OrderTrackingRouteProp>();
  const { orderId } = route.params;

  const [currentStatus, setCurrentStatus] = useState<OrderStatus>('preparing');

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const deliveryAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulse animation for current step
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Delivery animation
    Animated.loop(
      Animated.timing(deliveryAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();

    // Simulate order status updates
    const statusTimeline = setTimeout(() => {
      setCurrentStatus('picked_up');
    }, 10000);

    return () => {
      clearTimeout(statusTimeline);
    };
  }, []);

  const getCurrentStepIndex = () => {
    return trackingSteps.findIndex((step) => step.id === currentStatus);
  };

  const isStepCompleted = (stepIndex: number) => {
    return stepIndex < getCurrentStepIndex();
  };

  const isCurrentStep = (stepIndex: number) => {
    return stepIndex === getCurrentStepIndex();
  };

  const deliveryPartner = {
    name: 'Rahul Kumar',
    phone: '+91 98765 43210',
    rating: 4.8,
    avatar: null,
  };

  const deliveryX = deliveryAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width * 0.6],
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* Map Placeholder with Animation */}
      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          {/* Animated route visualization */}
          <View style={styles.routeContainer}>
            {/* Restaurant */}
            <View style={styles.locationPoint}>
              <View style={styles.restaurantMarker}>
                <Ionicons name="restaurant" size={20} color={COLORS.white} />
              </View>
              <Text style={styles.locationLabel}>Restaurant</Text>
            </View>

            {/* Route line */}
            <View style={styles.routeLine}>
              <View style={styles.routeLineDashed} />
              {/* Animated delivery icon */}
              {currentStatus === 'picked_up' && (
                <Animated.View
                  style={[
                    styles.deliveryIcon,
                    { transform: [{ translateX: deliveryX }] },
                  ]}
                >
                  <Ionicons name="bicycle" size={24} color={COLORS.accent} />
                </Animated.View>
              )}
            </View>

            {/* Your location */}
            <View style={styles.locationPoint}>
              <View style={styles.userMarker}>
                <Ionicons name="location" size={20} color={COLORS.white} />
              </View>
              <Text style={styles.locationLabel}>Your Location</Text>
            </View>
          </View>

          {/* Map illustration */}
          <View style={styles.mapIllustration}>
            <Ionicons name="map-outline" size={60} color={COLORS.gray200} />
            <Text style={styles.mapText}>Live tracking</Text>
          </View>
        </View>

        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.gray900} />
        </TouchableOpacity>

        {/* Estimated Time Badge */}
        <View style={styles.etaBadge}>
          <Ionicons name="time-outline" size={16} color={COLORS.accent} />
          <Text style={styles.etaText}>25 min</Text>
        </View>
      </View>

      {/* Order Details Bottom Sheet */}
      <View style={styles.bottomSheet}>
        <View style={styles.handle} />

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Order Status */}
          <View style={styles.statusSection}>
            <Text style={styles.sectionTitle}>Order Status</Text>
            <Text style={styles.orderId}>#{orderId.toUpperCase()}</Text>
          </View>

          {/* Tracking Steps */}
          <View style={styles.trackingSteps}>
            {trackingSteps.map((step, index) => (
              <View key={step.id} style={styles.stepContainer}>
                <View style={styles.stepIconContainer}>
                  <Animated.View
                    style={[
                      styles.stepIcon,
                      isStepCompleted(index) && styles.stepIconCompleted,
                      isCurrentStep(index) && styles.stepIconCurrent,
                      isCurrentStep(index) && {
                        transform: [{ scale: pulseAnim }],
                      },
                    ]}
                  >
                    <Ionicons
                      name={isStepCompleted(index) ? 'checkmark' : step.icon}
                      size={18}
                      color={
                        isStepCompleted(index) || isCurrentStep(index)
                          ? COLORS.white
                          : COLORS.gray400
                      }
                    />
                  </Animated.View>
                  {index < trackingSteps.length - 1 && (
                    <View
                      style={[
                        styles.stepLine,
                        isStepCompleted(index) && styles.stepLineCompleted,
                      ]}
                    />
                  )}
                </View>
                <View style={styles.stepContent}>
                  <Text
                    style={[
                      styles.stepTitle,
                      (isStepCompleted(index) || isCurrentStep(index)) &&
                        styles.stepTitleActive,
                    ]}
                  >
                    {step.title}
                  </Text>
                  <Text style={styles.stepSubtitle}>{step.subtitle}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Delivery Partner */}
          {currentStatus === 'picked_up' && (
            <View style={styles.deliveryPartnerCard}>
              <View style={styles.partnerInfo}>
                <Avatar name={deliveryPartner.name} size="md" />
                <View style={styles.partnerDetails}>
                  <Text style={styles.partnerName}>{deliveryPartner.name}</Text>
                  <View style={styles.partnerRating}>
                    <Ionicons name="star" size={14} color="#FBBF24" />
                    <Text style={styles.ratingText}>{deliveryPartner.rating}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.partnerActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="call" size={20} color={COLORS.accent} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="chatbubble" size={20} color={COLORS.accent} />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Help */}
          <TouchableOpacity style={styles.helpButton}>
            <Ionicons name="help-circle-outline" size={20} color={COLORS.gray600} />
            <Text style={styles.helpText}>Need help with your order?</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.gray400} />
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  mapContainer: {
    height: height * 0.35,
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: COLORS.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    width: '100%',
  },
  locationPoint: {
    alignItems: 'center',
  },
  restaurantMarker: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.white,
    ...SHADOWS.md,
  },
  userMarker: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.white,
    ...SHADOWS.md,
  },
  locationLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.gray600,
    marginTop: SPACING.xs,
    fontWeight: FONTS.weights.medium,
  },
  routeLine: {
    flex: 1,
    height: 3,
    backgroundColor: COLORS.gray300,
    marginHorizontal: SPACING.md,
    borderRadius: 2,
    overflow: 'visible',
  },
  routeLineDashed: {
    flex: 1,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  deliveryIcon: {
    position: 'absolute',
    top: -12,
    left: 0,
  },
  mapIllustration: {
    position: 'absolute',
    bottom: SPACING.lg,
    alignItems: 'center',
  },
  mapText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.gray400,
    marginTop: SPACING.xs,
  },
  backButton: {
    position: 'absolute',
    top: SPACING.base,
    left: SPACING.base,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.md,
  },
  etaBadge: {
    position: 'absolute',
    top: SPACING.base,
    right: SPACING.base,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    ...SHADOWS.md,
  },
  etaText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.gray900,
    marginLeft: SPACING.xs,
  },
  bottomSheet: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: BORDER_RADIUS['2xl'],
    borderTopRightRadius: BORDER_RADIUS['2xl'],
    marginTop: -SPACING.lg,
    paddingHorizontal: SPACING.base,
    ...SHADOWS.lg,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.gray300,
    borderRadius: 2,
    alignSelf: 'center',
    marginVertical: SPACING.md,
  },
  statusSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.gray900,
  },
  orderId: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.medium,
    color: COLORS.gray500,
  },
  trackingSteps: {
    marginBottom: SPACING.lg,
  },
  stepContainer: {
    flexDirection: 'row',
  },
  stepIconContainer: {
    alignItems: 'center',
    width: 40,
  },
  stepIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepIconCompleted: {
    backgroundColor: COLORS.accent,
  },
  stepIconCurrent: {
    backgroundColor: COLORS.accent,
  },
  stepLine: {
    width: 2,
    height: 40,
    backgroundColor: COLORS.gray200,
    marginVertical: SPACING.xs,
  },
  stepLineCompleted: {
    backgroundColor: COLORS.accent,
  },
  stepContent: {
    flex: 1,
    marginLeft: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  stepTitle: {
    fontSize: FONTS.sizes.base,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.gray400,
    marginBottom: SPACING.xs,
  },
  stepTitleActive: {
    color: COLORS.gray900,
  },
  stepSubtitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.gray500,
  },
  deliveryPartnerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    backgroundColor: COLORS.gray50,
    borderRadius: BORDER_RADIUS.xl,
    marginBottom: SPACING.lg,
  },
  partnerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  partnerDetails: {
    marginLeft: SPACING.md,
  },
  partnerName: {
    fontSize: FONTS.sizes.base,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.gray900,
  },
  partnerRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  ratingText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.gray600,
    marginLeft: SPACING.xs,
  },
  partnerActions: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.accentLight + '30',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.sm,
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.gray50,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.lg,
  },
  helpText: {
    flex: 1,
    fontSize: FONTS.sizes.md,
    color: COLORS.gray700,
    marginLeft: SPACING.sm,
  },
});

export default OrderTrackingScreen;
