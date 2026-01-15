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

import { Input, Button } from '../../components/common';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../constants/theme';
import { RootStackParamList } from '../../types';
import { useAuthStore } from '../../store/useStore';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const setUser = useAuthStore((state) => state.setUser);

  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const validatePhone = (phoneNumber: string): boolean => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phoneNumber);
  };

  const handleContinue = async () => {
    setError('');

    if (!phone) {
      setError('Please enter your phone number');
      return;
    }

    if (!validatePhone(phone)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigation.navigate('OTP', { phone });
    }, 1000);
  };

  const handleSocialLogin = (provider: string) => {
    // Social login placeholder
    console.log(`Login with ${provider}`);
    // For demo, directly login
    setUser({
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '9876543210',
      addresses: [],
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Ionicons name="fast-food" size={40} color={COLORS.primary} />
            </View>
            <Text style={styles.title}>Welcome to FoodHub</Text>
            <Text style={styles.subtitle}>
              Enter your phone number to continue
            </Text>
          </View>

          {/* Phone Input */}
          <View style={styles.inputContainer}>
            <View style={styles.phoneInputWrapper}>
              <View style={styles.countryCode}>
                <Text style={styles.countryCodeText}>+91</Text>
                <Ionicons name="chevron-down" size={16} color={COLORS.gray500} />
              </View>
              <View style={styles.phoneInput}>
                <Input
                  placeholder="Enter phone number"
                  value={phone}
                  onChangeText={(text) => {
                    setPhone(text.replace(/[^0-9]/g, '').slice(0, 10));
                    setError('');
                  }}
                  keyboardType="phone-pad"
                  maxLength={10}
                  error={error}
                  containerStyle={{ marginBottom: 0 }}
                />
              </View>
            </View>

            <Button
              title="Continue"
              onPress={handleContinue}
              loading={isLoading}
              fullWidth
              style={styles.continueButton}
            />
          </View>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.divider} />
          </View>

          {/* Social Login */}
          <View style={styles.socialContainer}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialLogin('google')}
            >
              <Ionicons name="logo-google" size={24} color="#DB4437" />
              <Text style={styles.socialButtonText}>Google</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialLogin('apple')}
            >
              <Ionicons name="logo-apple" size={24} color={COLORS.black} />
              <Text style={styles.socialButtonText}>Apple</Text>
            </TouchableOpacity>
          </View>

          {/* Signup Link */}
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.signupLink}>Sign up</Text>
            </TouchableOpacity>
          </View>

          {/* Terms */}
          <Text style={styles.termsText}>
            By continuing, you agree to our{' '}
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
    paddingTop: SPACING['2xl'],
    paddingBottom: SPACING.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING['2xl'],
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: COLORS.gray50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
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
  inputContainer: {
    marginBottom: SPACING.xl,
  },
  phoneInputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.base,
  },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray50,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md + 2,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1.5,
    borderColor: COLORS.gray200,
    marginRight: SPACING.sm,
  },
  countryCodeText: {
    fontSize: FONTS.sizes.base,
    fontWeight: FONTS.weights.medium,
    color: COLORS.gray700,
    marginRight: SPACING.xs,
  },
  phoneInput: {
    flex: 1,
  },
  continueButton: {
    marginTop: SPACING.sm,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.gray200,
  },
  dividerText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.gray500,
    paddingHorizontal: SPACING.md,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1.5,
    borderColor: COLORS.gray200,
    backgroundColor: COLORS.white,
  },
  socialButtonText: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.medium,
    color: COLORS.gray700,
    marginLeft: SPACING.sm,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
  },
  signupText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.gray500,
  },
  signupLink: {
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

export default LoginScreen;
