// Food Delivery App Type Definitions

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  addresses: Address[];
  createdAt: string;
}

export interface Address {
  id: string;
  label: string; // Home, Work, Other
  address: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  latitude: number;
  longitude: number;
  isDefault: boolean;
}

// Restaurant Types
export interface Restaurant {
  id: string;
  name: string;
  image: string;
  coverImage?: string;
  cuisine: string[];
  rating: number;
  reviewCount: number;
  deliveryTime: string; // "25-35 min"
  deliveryFee: number;
  minOrder: number;
  distance: string; // "1.2 km"
  isOpen: boolean;
  isPureVeg: boolean;
  isFeatured: boolean;
  offers?: Offer[];
  address: string;
  latitude: number;
  longitude: number;
}

export interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image?: string;
  isVeg: boolean;
  isBestSeller: boolean;
  isAvailable: boolean;
  customizations?: Customization[];
  rating?: number;
  reviewCount?: number;
}

export interface Customization {
  id: string;
  name: string;
  required: boolean;
  maxSelect: number;
  options: CustomizationOption[];
}

export interface CustomizationOption {
  id: string;
  name: string;
  price: number;
  isDefault: boolean;
}

// Cart Types
export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  selectedCustomizations?: SelectedCustomization[];
  totalPrice: number;
  specialInstructions?: string;
}

export interface SelectedCustomization {
  customizationId: string;
  optionIds: string[];
}

export interface Cart {
  restaurantId: string;
  restaurantName: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  taxes: number;
  discount: number;
  total: number;
  couponApplied?: Coupon;
}

// Order Types
export interface Order {
  id: string;
  orderNumber: string;
  restaurant: Restaurant;
  items: CartItem[];
  status: OrderStatus;
  statusHistory: OrderStatusUpdate[];
  deliveryAddress: Address;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  subtotal: number;
  deliveryFee: number;
  taxes: number;
  discount: number;
  total: number;
  deliveryPartner?: DeliveryPartner;
  estimatedDelivery: string;
  actualDelivery?: string;
  createdAt: string;
  rating?: number;
  review?: string;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'picked_up'
  | 'on_the_way'
  | 'delivered'
  | 'cancelled';

export interface OrderStatusUpdate {
  status: OrderStatus;
  timestamp: string;
  message?: string;
}

export type PaymentMethod = 'upi' | 'card' | 'wallet' | 'cod';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

// Delivery Partner Types
export interface DeliveryPartner {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  rating: number;
  vehicleNumber?: string;
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
}

// Offer/Coupon Types
export interface Offer {
  id: string;
  code: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  maxDiscount?: number;
  minOrder: number;
  validTill: string;
}

export interface Coupon extends Offer {
  isApplied: boolean;
  discountAmount: number;
}

// Search Types
export interface SearchResult {
  restaurants: Restaurant[];
  dishes: SearchDish[];
}

export interface SearchDish {
  id: string;
  name: string;
  restaurant: Restaurant;
  price: number;
  image?: string;
}

// Filter Types
export interface RestaurantFilters {
  sortBy: 'relevance' | 'rating' | 'deliveryTime' | 'distance' | 'costLowToHigh' | 'costHighToLow';
  cuisines: string[];
  veg: boolean | null;
  rating: number | null;
  offers: boolean;
  maxDeliveryFee: number | null;
}

// Notification Types
export interface Notification {
  id: string;
  type: 'order' | 'offer' | 'general';
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: string;
}

// Navigation Types
export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  Main: undefined;
  Login: undefined;
  Signup: undefined;
  OTP: { phone: string };
  ForgotPassword: undefined;
  LocationSelector: undefined;
  RestaurantDetail: { restaurantId: string };
  FoodDetail: { restaurantId: string; itemId: string };
  Cart: undefined;
  Checkout: undefined;
  Payment: { orderId: string };
  OrderSuccess: { orderId: string };
  OrderTracking: { orderId: string };
  OrderHistory: undefined;
  OrderDetail: { orderId: string };
  RateOrder: { orderId: string };
  Search: undefined;
  Profile: undefined;
  EditProfile: undefined;
  Addresses: undefined;
  AddAddress: { addressId?: string };
  SavedPayments: undefined;
  Notifications: undefined;
  Help: undefined;
  About: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Orders: undefined;
  Profile: undefined;
};

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
