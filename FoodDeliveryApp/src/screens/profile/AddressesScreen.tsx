import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { Header, EmptyState, Button } from '../../components/common';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { RootStackParamList, Address } from '../../types';
import { useLocationStore } from '../../store/useStore';

type AddressesScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Addresses'
>;

// Mock addresses
const addresses: Address[] = [
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
    address: '456 Business Park, Tower C, Floor 12',
    city: 'Gurugram',
    state: 'Haryana',
    pincode: '122001',
    latitude: 28.4595,
    longitude: 77.0266,
    isDefault: false,
  },
];

const AddressesScreen: React.FC = () => {
  const navigation = useNavigation<AddressesScreenNavigationProp>();

  const getIconForLabel = (label: string) => {
    switch (label.toLowerCase()) {
      case 'home':
        return 'home';
      case 'work':
        return 'briefcase';
      default:
        return 'location';
    }
  };

  const renderAddressCard = ({ item }: { item: Address }) => (
    <TouchableOpacity
      style={styles.addressCard}
      onPress={() => navigation.navigate('AddAddress', { addressId: item.id })}
    >
      <View style={styles.addressIcon}>
        <Ionicons
          name={getIconForLabel(item.label)}
          size={22}
          color={item.isDefault ? COLORS.accent : COLORS.gray500}
        />
      </View>
      <View style={styles.addressContent}>
        <View style={styles.addressHeader}>
          <Text style={styles.addressLabel}>{item.label}</Text>
          {item.isDefault && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultText}>Default</Text>
            </View>
          )}
        </View>
        <Text style={styles.addressText} numberOfLines={2}>
          {item.address}
        </Text>
        <Text style={styles.addressCity}>
          {item.city}, {item.state} - {item.pincode}
        </Text>
      </View>
      <View style={styles.addressActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="create-outline" size={20} color={COLORS.gray500} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="trash-outline" size={20} color={COLORS.error} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <Header
        showBack
        onBackPress={() => navigation.goBack()}
        title="Saved Addresses"
        centerTitle
      />

      {addresses.length === 0 ? (
        <EmptyState
          icon="location-outline"
          title="No Saved Addresses"
          description="Add your delivery addresses for faster checkout"
          actionTitle="Add Address"
          onAction={() => navigation.navigate('AddAddress', {})}
        />
      ) : (
        <>
          <FlatList
            data={addresses}
            renderItem={renderAddressCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />

          <View style={styles.footer}>
            <Button
              title="Add New Address"
              onPress={() => navigation.navigate('AddAddress', {})}
              fullWidth
              icon={<Ionicons name="add" size={20} color={COLORS.white} />}
            />
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundSecondary,
  },
  listContent: {
    padding: SPACING.base,
  },
  addressCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  addressIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.gray100,
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
    backgroundColor: COLORS.accentLight + '30',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  defaultText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.medium,
    color: COLORS.accent,
  },
  addressText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.gray600,
    marginBottom: SPACING.xs,
    lineHeight: FONTS.sizes.md * 1.4,
  },
  addressCity: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.gray500,
  },
  addressActions: {
    justifyContent: 'center',
  },
  actionButton: {
    padding: SPACING.sm,
  },
  footer: {
    padding: SPACING.base,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray100,
  },
});

export default AddressesScreen;
