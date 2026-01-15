// Zustand Store - Centralized State Management
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  User,
  Address,
  Cart,
  CartItem,
  MenuItem,
  Order,
  Restaurant,
  Notification,
  RestaurantFilters,
} from '../types';

// Auth Store
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      token: null,
      setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
      setToken: (token) => set({ token }),
      logout: () => set({ user: null, isAuthenticated: false, token: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Location Store
interface LocationState {
  currentLocation: Address | null;
  savedAddresses: Address[];
  setCurrentLocation: (location: Address | null) => void;
  addAddress: (address: Address) => void;
  updateAddress: (address: Address) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set, get) => ({
      currentLocation: null,
      savedAddresses: [],
      setCurrentLocation: (location) => set({ currentLocation: location }),
      addAddress: (address) =>
        set({ savedAddresses: [...get().savedAddresses, address] }),
      updateAddress: (address) =>
        set({
          savedAddresses: get().savedAddresses.map((a) =>
            a.id === address.id ? address : a
          ),
        }),
      removeAddress: (id) =>
        set({
          savedAddresses: get().savedAddresses.filter((a) => a.id !== id),
        }),
      setDefaultAddress: (id) =>
        set({
          savedAddresses: get().savedAddresses.map((a) => ({
            ...a,
            isDefault: a.id === id,
          })),
        }),
    }),
    {
      name: 'location-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Cart Store
interface CartState {
  cart: Cart | null;
  addToCart: (item: MenuItem, restaurant: Restaurant, quantity?: number) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: null,
  addToCart: (item, restaurant, quantity = 1) => {
    const currentCart = get().cart;

    // If cart has items from different restaurant, clear it first
    if (currentCart && currentCart.restaurantId !== restaurant.id) {
      // In real app, show confirmation dialog
      set({ cart: null });
    }

    const cart = get().cart;
    const itemPrice = item.price * quantity;

    if (!cart) {
      // Create new cart
      const newCart: Cart = {
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        items: [
          {
            id: `${item.id}-${Date.now()}`,
            menuItem: item,
            quantity,
            totalPrice: itemPrice,
          },
        ],
        subtotal: itemPrice,
        deliveryFee: restaurant.deliveryFee,
        taxes: itemPrice * 0.05, // 5% tax
        discount: 0,
        total: itemPrice + restaurant.deliveryFee + itemPrice * 0.05,
      };
      set({ cart: newCart });
    } else {
      // Add to existing cart
      const existingItem = cart.items.find((i) => i.menuItem.id === item.id);

      let newItems: CartItem[];
      if (existingItem) {
        newItems = cart.items.map((i) =>
          i.menuItem.id === item.id
            ? {
                ...i,
                quantity: i.quantity + quantity,
                totalPrice: (i.quantity + quantity) * item.price,
              }
            : i
        );
      } else {
        newItems = [
          ...cart.items,
          {
            id: `${item.id}-${Date.now()}`,
            menuItem: item,
            quantity,
            totalPrice: itemPrice,
          },
        ];
      }

      const subtotal = newItems.reduce((sum, i) => sum + i.totalPrice, 0);
      const taxes = subtotal * 0.05;

      set({
        cart: {
          ...cart,
          items: newItems,
          subtotal,
          taxes,
          total: subtotal + cart.deliveryFee + taxes - cart.discount,
        },
      });
    }
  },
  updateQuantity: (itemId, quantity) => {
    const cart = get().cart;
    if (!cart) return;

    if (quantity === 0) {
      get().removeFromCart(itemId);
      return;
    }

    const newItems = cart.items.map((i) =>
      i.id === itemId
        ? { ...i, quantity, totalPrice: quantity * i.menuItem.price }
        : i
    );

    const subtotal = newItems.reduce((sum, i) => sum + i.totalPrice, 0);
    const taxes = subtotal * 0.05;

    set({
      cart: {
        ...cart,
        items: newItems,
        subtotal,
        taxes,
        total: subtotal + cart.deliveryFee + taxes - cart.discount,
      },
    });
  },
  removeFromCart: (itemId) => {
    const cart = get().cart;
    if (!cart) return;

    const newItems = cart.items.filter((i) => i.id !== itemId);

    if (newItems.length === 0) {
      set({ cart: null });
      return;
    }

    const subtotal = newItems.reduce((sum, i) => sum + i.totalPrice, 0);
    const taxes = subtotal * 0.05;

    set({
      cart: {
        ...cart,
        items: newItems,
        subtotal,
        taxes,
        total: subtotal + cart.deliveryFee + taxes - cart.discount,
      },
    });
  },
  clearCart: () => set({ cart: null }),
  applyCoupon: async (code) => {
    // API call placeholder
    // For now, simulate a 10% discount
    const cart = get().cart;
    if (!cart) return false;

    const discount = cart.subtotal * 0.1;
    set({
      cart: {
        ...cart,
        discount,
        total: cart.subtotal + cart.deliveryFee + cart.taxes - discount,
        couponApplied: {
          id: '1',
          code,
          title: '10% OFF',
          description: 'Get 10% off on your order',
          discountType: 'percentage',
          discountValue: 10,
          minOrder: 0,
          validTill: '',
          isApplied: true,
          discountAmount: discount,
        },
      },
    });
    return true;
  },
  removeCoupon: () => {
    const cart = get().cart;
    if (!cart) return;

    set({
      cart: {
        ...cart,
        discount: 0,
        total: cart.subtotal + cart.deliveryFee + cart.taxes,
        couponApplied: undefined,
      },
    });
  },
  getItemCount: () => {
    const cart = get().cart;
    if (!cart) return 0;
    return cart.items.reduce((sum, i) => sum + i.quantity, 0);
  },
}));

// Orders Store
interface OrdersState {
  orders: Order[];
  currentOrder: Order | null;
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
  setCurrentOrder: (order: Order | null) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
}

export const useOrdersStore = create<OrdersState>((set, get) => ({
  orders: [],
  currentOrder: null,
  setOrders: (orders) => set({ orders }),
  addOrder: (order) => set({ orders: [order, ...get().orders] }),
  setCurrentOrder: (order) => set({ currentOrder: order }),
  updateOrderStatus: (orderId, status) =>
    set({
      orders: get().orders.map((o) =>
        o.id === orderId ? { ...o, status } : o
      ),
      currentOrder:
        get().currentOrder?.id === orderId
          ? { ...get().currentOrder!, status }
          : get().currentOrder,
    }),
}));

// Restaurants Store
interface RestaurantsState {
  restaurants: Restaurant[];
  featuredRestaurants: Restaurant[];
  filters: RestaurantFilters;
  setRestaurants: (restaurants: Restaurant[]) => void;
  setFeaturedRestaurants: (restaurants: Restaurant[]) => void;
  setFilters: (filters: Partial<RestaurantFilters>) => void;
  resetFilters: () => void;
}

const defaultFilters: RestaurantFilters = {
  sortBy: 'relevance',
  cuisines: [],
  veg: null,
  rating: null,
  offers: false,
  maxDeliveryFee: null,
};

export const useRestaurantsStore = create<RestaurantsState>((set, get) => ({
  restaurants: [],
  featuredRestaurants: [],
  filters: defaultFilters,
  setRestaurants: (restaurants) => set({ restaurants }),
  setFeaturedRestaurants: (restaurants) => set({ featuredRestaurants: restaurants }),
  setFilters: (filters) => set({ filters: { ...get().filters, ...filters } }),
  resetFilters: () => set({ filters: defaultFilters }),
}));

// Notifications Store
interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  setNotifications: (notifications: Notification[]) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

export const useNotificationsStore = create<NotificationsState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  setNotifications: (notifications) =>
    set({
      notifications,
      unreadCount: notifications.filter((n) => !n.isRead).length,
    }),
  markAsRead: (id) => {
    const notifications = get().notifications.map((n) =>
      n.id === id ? { ...n, isRead: true } : n
    );
    set({
      notifications,
      unreadCount: notifications.filter((n) => !n.isRead).length,
    });
  },
  markAllAsRead: () => {
    const notifications = get().notifications.map((n) => ({
      ...n,
      isRead: true,
    }));
    set({ notifications, unreadCount: 0 });
  },
}));

// App State Store
interface AppState {
  isOnboarded: boolean;
  setOnboarded: (value: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isOnboarded: false,
      setOnboarded: (value) => set({ isOnboarded: value }),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
