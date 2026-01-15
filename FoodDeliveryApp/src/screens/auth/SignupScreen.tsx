import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { Input, Button, Header } from '../../components/common';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../constants/theme';
import { RootStackParamList } from '../../types';

type SignupScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Signup'>;

const SignupScreen: React.FC = () => {
  const navigation = useNavigation<SignupScreenNavigationProp>();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigation.navigate('OTP', { phone: formData.phone });
    }, 1000);
  };

  const updateFormData = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: '' }));
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <Header
        showBack
        onBackPress={() => navigation.goBack()}
        title="Create Account"
        centerTitle
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Text */}
          <View style={styles.headerText}>
            <Text style={styles.title}>Join FoodHub</Text>
            <Text style={styles.subtitle}>
              Create an account to start ordering delicious food
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              value={formData.name}
              onChangeText={(value) => updateFormData('name', value)}
              leftIcon="person-outline"
              error={errors.name}
              autoCapitalize="words"
            />

            <Input
              label="Email"
              placeholder="Enter your email"
              value={formData.email}
              onChangeText={(value) => updateFormData('email', value)}
              leftIcon="mail-outline"
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <View style={styles.phoneInputWrapper}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <View style={styles.phoneRow}>
                <View style={styles.countryCode}>
                  <Text style={styles.countryCodeText}>+91</Text>
                </View>
                <View style={styles.phoneInput}>
                  <Input
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChangeText={(value) =>
                      updateFormData('phone', value.replace(/[^0-9]/g, '').slice(0, 10))
                    }
                    keyboardType="phone-pad"
                    maxLength={10}
                    error={errors.phone}
                    containerStyle={{ marginBottom: 0 }}
                  />
                </View>
              </View>
            </View>

            <Button
              title="Create Account"
              onPress={handleSignup}
              loading={isLoading}
              fullWidth
              style={styles.signupButton}
            />
          </View>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Log in</Text>
            </TouchableOpacity>
          </View>

          {/* Terms */}
          <Text style={styles.termsText}>
            By creating an account, you agree to our{' '}
            <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  headerText: {
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
  },
  form: {
    marginBottom: SPACING.xl,
  },
  phoneInputWrapper: {
    marginBottom: SPACING.base,
  },
  inputLabel: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.medium,
    color: COLORS.gray700,
    marginBottom: SPACING.sm,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  countryCode: {
    backgroundColor: COLORS.gray50,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md + 2,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1.5,
    borderColor: COLORS.gray200,
    marginRight: SPACING.sm,
    justifyContent: 'center',
  },
  countryCodeText: {
    fontSize: FONTS.sizes.base,
    fontWeight: FONTS.weights.medium,
    color: COLORS.gray700,
  },
  phoneInput: {
    flex: 1,
  },
  signupButton: {
    marginTop: SPACING.md,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
  },
  loginText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.gray500,
  },
  loginLink: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.primary,
  },
  termsText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.gray400,
    textAlign: 'center',
    lineHeight: FONTS.sizes.sm * 1.5,
  },
  termsLink: {
    color: COLORS.primary,
    fontWeight: FONTS.weights.medium,
  },
});

export default SignupScreen;
