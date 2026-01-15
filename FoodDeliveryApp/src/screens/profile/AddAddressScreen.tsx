import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { Header, Input, Button } from '../../components/common';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../constants/theme';
import { RootStackParamList } from '../../types';

type AddAddressRouteProp = RouteProp<RootStackParamList, 'AddAddress'>;

const addressLabels = ['Home', 'Work', 'Other'];

const AddAddressScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<AddAddressRouteProp>();
  const isEditing = !!route.params?.addressId;

  const [formData, setFormData] = useState({
    label: 'Home',
    address: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [isDefault, setIsDefault] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigation.goBack();
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <Header
        showBack
        onBackPress={() => navigation.goBack()}
        title={isEditing ? 'Edit Address' : 'Add New Address'}
        centerTitle
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Map Placeholder */}
        <TouchableOpacity style={styles.mapPlaceholder}>
          <Ionicons name="map-outline" size={32} color={COLORS.gray400} />
          <Text style={styles.mapText}>Tap to select location on map</Text>
        </TouchableOpacity>

        {/* Address Labels */}
        <View style={styles.labelSection}>
          <Text style={styles.sectionTitle}>Save as</Text>
          <View style={styles.labelsContainer}>
            {addressLabels.map((label) => (
              <TouchableOpacity
                key={label}
                style={[
                  styles.labelChip,
                  formData.label === label && styles.labelChipActive,
                ]}
                onPress={() => setFormData({ ...formData, label })}
              >
                <Ionicons
                  name={
                    label === 'Home'
                      ? 'home-outline'
                      : label === 'Work'
                      ? 'briefcase-outline'
                      : 'location-outline'
                  }
                  size={18}
                  color={
                    formData.label === label ? COLORS.accent : COLORS.gray500
                  }
                />
                <Text
                  style={[
                    styles.labelText,
                    formData.label === label && styles.labelTextActive,
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Address Form */}
        <View style={styles.form}>
          <Input
            label="Full Address"
            placeholder="House/Flat No., Building, Street"
            value={formData.address}
            onChangeText={(text) => setFormData({ ...formData, address: text })}
            leftIcon="location-outline"
          />

          <Input
            label="Landmark (Optional)"
            placeholder="Near landmark"
            value={formData.landmark}
            onChangeText={(text) => setFormData({ ...formData, landmark: text })}
            leftIcon="flag-outline"
          />

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Input
                label="City"
                placeholder="City"
                value={formData.city}
                onChangeText={(text) => setFormData({ ...formData, city: text })}
              />
            </View>
            <View style={styles.halfInput}>
              <Input
                label="State"
                placeholder="State"
                value={formData.state}
                onChangeText={(text) => setFormData({ ...formData, state: text })}
              />
            </View>
          </View>

          <Input
            label="Pincode"
            placeholder="6-digit pincode"
            value={formData.pincode}
            onChangeText={(text) =>
              setFormData({
                ...formData,
                pincode: text.replace(/[^0-9]/g, '').slice(0, 6),
              })
            }
            keyboardType="number-pad"
            maxLength={6}
          />
        </View>

        {/* Default Toggle */}
        <TouchableOpacity
          style={styles.defaultToggle}
          onPress={() => setIsDefault(!isDefault)}
        >
          <View
            style={[styles.checkbox, isDefault && styles.checkboxChecked]}
          >
            {isDefault && (
              <Ionicons name="checkmark" size={16} color={COLORS.white} />
            )}
          </View>
          <Text style={styles.defaultText}>Set as default address</Text>
        </TouchableOpacity>

        {/* Save Button */}
        <Button
          title={isEditing ? 'Update Address' : 'Save Address'}
          onPress={handleSave}
          loading={isLoading}
          fullWidth
          style={styles.saveButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    padding: SPACING.base,
  },
  mapPlaceholder: {
    height: 150,
    backgroundColor: COLORS.gray100,
    borderRadius: BORDER_RADIUS.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  mapText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.gray500,
    marginTop: SPACING.sm,
  },
  labelSection: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.gray900,
    marginBottom: SPACING.md,
  },
  labelsContainer: {
    flexDirection: 'row',
  },
  labelChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.gray100,
    marginRight: SPACING.sm,
  },
  labelChipActive: {
    backgroundColor: COLORS.accentLight + '30',
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  labelText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.gray600,
    marginLeft: SPACING.xs,
  },
  labelTextActive: {
    color: COLORS.accent,
    fontWeight: FONTS.weights.medium,
  },
  form: {
    marginBottom: SPACING.lg,
  },
  row: {
    flexDirection: 'row',
    marginHorizontal: -SPACING.xs,
  },
  halfInput: {
    flex: 1,
    paddingHorizontal: SPACING.xs,
  },
  defaultToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.gray300,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  checkboxChecked: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  defaultText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.gray700,
  },
  saveButton: {
    marginTop: SPACING.md,
  },
});

export default AddAddressScreen;
