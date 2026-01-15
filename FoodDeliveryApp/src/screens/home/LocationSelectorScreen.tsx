import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

import { Header, SearchBar, Button } from '../../components/common';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { useLocationStore } from '../../store/useStore';
import { Address } from '../../types';

const savedAddresses: Address[] = [
  {
    id: '1',
    label: 'Home',
    address: '123 Main Street, Apartment 4B',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110001',
    latitude: 28.6139,
    longitude: 77.209,
    isDefault: true,
  },
  {
    id: '2',
    label: 'Work',
    address: '456 Business Park, Tower C',
    city: 'Gurugram',
    state: 'Haryana',
    pincode: '122001',
    latitude: 28.4595,
    longitude: 77.0266,
    isDefault: false,
  },
];

const LocationSelectorScreen: React.FC = () => {
  const navigation = useNavigation();
  const { setCurrentLocation, currentLocation } = useLocationStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleUseCurrentLocation = async () => {
    setIsLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Please enable location permissions in settings'
        );
        setIsLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const [address] = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      const currentAddr: Address = {
        id: 'current',
        label: 'Current Location',
        address: `${address.street || ''} ${address.name || ''}`.trim(),
        city: address.city || '',
        state: address.region || '',
        pincode: address.postalCode || '',
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        isDefault: false,
      };

      setCurrentLocation(currentAddr);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to get current location');
    }
    setIsLoading(false);
  };

  const handleSelectAddress = (address: Address) => {
    setCurrentLocation(address);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <Header
        showBack
        onBackPress={() => navigation.goBack()}
        title="Select Location"
        centerTitle
      />

      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search for area, street name..."
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Current Location Button */}
        <TouchableOpacity
          style={styles.currentLocationButton}
          onPress={handleUseCurrentLocation}
          disabled={isLoading}
        >
          <View style={styles.currentLocationIcon}>
            <Ionicons name="navigate" size={20} color={COLORS.accent} />
          </View>
          <View style={styles.currentLocationText}>
            <Text style={styles.currentLocationTitle}>
              {isLoading ? 'Getting location...' : 'Use Current Location'}
            </Text>
            <Text style={styles.currentLocationSubtitle}>
              Using GPS
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.gray400} />
        </TouchableOpacity>

        {/* Saved Addresses */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Saved Addresses</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AddAddress' as never)}>
              <Text style={styles.addNewText}>+ Add New</Text>
            </TouchableOpacity>
          </View>

          {savedAddresses.map((address) => (
            <TouchableOpacity
              key={address.id}
              style={[
                styles.addressCard,
                currentLocation?.id === address.id && styles.addressCardSelected,
              ]}
              onPress={() => handleSelectAddress(address)}
            >
              <View style={styles.addressIcon}>
                <Ionicons
                  name={address.label === 'Home' ? 'home' : 'briefcase'}
                  size={20}
                  color={
                    currentLocation?.id === address.id
                      ? COLORS.accent
                      : COLORS.gray500
                  }
                />
              </View>
              <View style={styles.addressContent}>
                <View style={styles.addressHeader}>
                  <Text style={styles.addressLabel}>{address.label}</Text>
                  {address.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultBadgeText}>Default</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.addressText} numberOfLines={2}>
                  {address.address}, {address.city}
                </Text>
              </View>
              {currentLocation?.id === address.id && (
                <Ionicons name="checkmark-circle" size={24} color={COLORS.accent} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Locations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Locations</Text>
          <TouchableOpacity style={styles.recentItem}>
            <Ionicons name="time-outline" size={20} color={COLORS.gray500} />
            <Text style={styles.recentText}>
              Connaught Place, New Delhi
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.recentItem}>
            <Ionicons name="time-outline" size={20} color={COLORS.gray500} />
            <Text style={styles.recentText}>
              Saket Mall, New Delhi
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  searchContainer: {
    padding: SPACING.base,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  currentLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.base,
    backgroundColor: COLORS.accentLight + '15',
    marginHorizontal: SPACING.base,
    marginTop: SPACING.base,
    borderRadius: BORDER_RADIUS.lg,
  },
  currentLocationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  currentLocationText: {
    flex: 1,
  },
  currentLocationTitle: {
    fontSize: FONTS.sizes.base,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.accent,
    marginBottom: 2,
  },
  currentLocationSubtitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.gray500,
  },
  section: {
    padding: SPACING.base,
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
  },
  addNewText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.accent,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.gray200,
  },
  addressCardSelected: {
    borderColor: COLORS.accent,
    backgroundColor: COLORS.accentLight + '10',
  },
  addressIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.gray50,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  addressContent: {
    flex: 1,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  addressLabel: {
    fontSize: FONTS.sizes.base,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.gray900,
    marginRight: SPACING.sm,
  },
  defaultBadge: {
    backgroundColor: COLORS.gray100,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  defaultBadgeText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.gray600,
    fontWeight: FONTS.weights.medium,
  },
  addressText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.gray500,
    lineHeight: FONTS.sizes.sm * 1.4,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  recentText: {
    fontSize: FONTS.sizes.base,
    color: COLORS.gray700,
    marginLeft: SPACING.md,
  },
});

export default LocationSelectorScreen;
