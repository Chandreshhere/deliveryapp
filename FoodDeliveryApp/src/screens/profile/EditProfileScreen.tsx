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
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { Header, Input, Button, Avatar } from '../../components/common';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../constants/theme';
import { useAuthStore } from '../../store/useStore';

const EditProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user, setUser } = useAuthStore();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      if (user) {
        setUser({
          ...user,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        });
      }
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
        title="Edit Profile"
        centerTitle
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <Avatar name={formData.name || 'User'} size="xl" />
            <TouchableOpacity style={styles.editAvatarButton}>
              <Ionicons name="camera" size={18} color={COLORS.white} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity>
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Input
            label="Full Name"
            placeholder="Enter your full name"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            leftIcon="person-outline"
            autoCapitalize="words"
          />

          <Input
            label="Email"
            placeholder="Enter your email"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            leftIcon="mail-outline"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            label="Phone Number"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChangeText={(text) =>
              setFormData({
                ...formData,
                phone: text.replace(/[^0-9]/g, '').slice(0, 10),
              })
            }
            leftIcon="call-outline"
            keyboardType="phone-pad"
            maxLength={10}
          />
        </View>

        {/* Save Button */}
        <Button
          title="Save Changes"
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
  avatarSection: {
    alignItems: 'center',
    marginVertical: SPACING.xl,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: SPACING.md,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  changePhotoText: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.accent,
  },
  form: {
    marginBottom: SPACING.xl,
  },
  saveButton: {
    marginTop: SPACING.md,
  },
});

export default EditProfileScreen;
