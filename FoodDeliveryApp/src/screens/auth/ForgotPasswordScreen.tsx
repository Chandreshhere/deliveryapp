import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { Input, Button, Header } from '../../components/common';
import { COLORS, FONTS, SPACING } from '../../constants/theme';

const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation();

  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!phone || phone.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setIsLoading(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  if (isSubmitted) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
        <Header
          showBack
          onBackPress={() => navigation.goBack()}
          title=""
        />
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={80} color={COLORS.accent} />
          </View>
          <Text style={styles.successTitle}>Check your phone</Text>
          <Text style={styles.successText}>
            We've sent a password reset link to your phone number{' '}
            <Text style={styles.phone}>+91 {phone}</Text>
          </Text>
          <Button
            title="Back to Login"
            onPress={() => navigation.goBack()}
            fullWidth
            style={styles.backButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <Header
        showBack
        onBackPress={() => navigation.goBack()}
        title="Forgot Password"
        centerTitle
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Ionicons name="lock-closed-outline" size={48} color={COLORS.primary} />
          </View>

          <Text style={styles.title}>Reset your password</Text>
          <Text style={styles.subtitle}>
            Enter your phone number and we'll send you a link to reset your password
          </Text>

          <Input
            label="Phone Number"
            placeholder="Enter your phone number"
            value={phone}
            onChangeText={(text) => {
              setPhone(text.replace(/[^0-9]/g, '').slice(0, 10));
              setError('');
            }}
            leftIcon="call-outline"
            keyboardType="phone-pad"
            maxLength={10}
            error={error}
          />

          <Button
            title="Send Reset Link"
            onPress={handleSubmit}
            loading={isLoading}
            fullWidth
            style={styles.submitButton}
          />
        </View>
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
  content: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.gray50,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: FONTS.sizes['2xl'],
    fontWeight: FONTS.weights.bold,
    color: COLORS.gray900,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONTS.sizes.base,
    color: COLORS.gray500,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: FONTS.sizes.base * 1.5,
  },
  submitButton: {
    marginTop: SPACING.md,
  },
  successContainer: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successIcon: {
    marginBottom: SPACING.xl,
  },
  successTitle: {
    fontSize: FONTS.sizes['2xl'],
    fontWeight: FONTS.weights.bold,
    color: COLORS.gray900,
    marginBottom: SPACING.md,
  },
  successText: {
    fontSize: FONTS.sizes.base,
    color: COLORS.gray500,
    textAlign: 'center',
    lineHeight: FONTS.sizes.base * 1.5,
    marginBottom: SPACING.xl,
  },
  phone: {
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.gray700,
  },
  backButton: {
    marginTop: SPACING.md,
  },
});

export default ForgotPasswordScreen;
