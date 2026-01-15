import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Button, Header } from '../../components/common';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../constants/theme';
import { RootStackParamList } from '../../types';
import { useAuthStore } from '../../store/useStore';

type OTPScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'OTP'>;
type OTPScreenRouteProp = RouteProp<RootStackParamList, 'OTP'>;

const OTP_LENGTH = 6;

const OTPScreen: React.FC = () => {
  const navigation = useNavigation<OTPScreenNavigationProp>();
  const route = useRoute<OTPScreenRouteProp>();
  const setUser = useAuthStore((state) => state.setUser);
  const { phone } = route.params;

  const [otp, setOtp] = useState<string[]>(new Array(OTP_LENGTH).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleOTPChange = (value: string, index: number) => {
    if (value.length > 1) {
      // Handle paste
      const pastedOTP = value.slice(0, OTP_LENGTH).split('');
      const newOTP = [...otp];
      pastedOTP.forEach((char, i) => {
        if (i + index < OTP_LENGTH) {
          newOTP[i + index] = char;
        }
      });
      setOtp(newOTP);
      const lastIndex = Math.min(index + pastedOTP.length - 1, OTP_LENGTH - 1);
      inputRefs.current[lastIndex]?.focus();
      return;
    }

    const newOTP = [...otp];
    newOTP[index] = value;
    setOtp(newOTP);
    setError('');

    // Move to next input
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpValue = otp.join('');

    if (otpValue.length !== OTP_LENGTH) {
      setError('Please enter complete OTP');
      return;
    }

    setIsLoading(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);

      // For demo, any OTP works
      if (otpValue === '123456' || true) {
        setUser({
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          phone: phone,
          addresses: [],
          createdAt: new Date().toISOString(),
        });
      } else {
        setError('Invalid OTP. Please try again.');
      }
    }, 1500);
  };

  const handleResend = () => {
    if (!canResend) return;

    // Simulate resend
    setTimer(30);
    setCanResend(false);
    setOtp(new Array(OTP_LENGTH).fill(''));
    setError('');
    inputRefs.current[0]?.focus();
  };

  const maskedPhone = `+91 ${phone.slice(0, 2)}****${phone.slice(-2)}`;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <Header
        showBack
        onBackPress={() => navigation.goBack()}
        title="Verify Phone"
        centerTitle
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Enter verification code</Text>
            <Text style={styles.subtitle}>
              We've sent a 6-digit code to{'\n'}
              <Text style={styles.phone}>{maskedPhone}</Text>
            </Text>
          </View>

          {/* OTP Input */}
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                style={[
                  styles.otpInput,
                  digit && styles.otpInputFilled,
                  error && styles.otpInputError,
                ]}
                value={digit}
                onChangeText={(value) =>
                  handleOTPChange(value.replace(/[^0-9]/g, ''), index)
                }
                onKeyPress={({ nativeEvent }) =>
                  handleKeyPress(nativeEvent.key, index)
                }
                keyboardType="number-pad"
                maxLength={OTP_LENGTH}
                selectTextOnFocus
              />
            ))}
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}

          {/* Verify Button */}
          <Button
            title="Verify"
            onPress={handleVerify}
            loading={isLoading}
            fullWidth
            disabled={otp.some((d) => !d)}
            style={styles.verifyButton}
          />

          {/* Resend */}
          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn't receive the code? </Text>
            {canResend ? (
              <TouchableOpacity onPress={handleResend}>
                <Text style={styles.resendLink}>Resend</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.timerText}>Resend in {timer}s</Text>
            )}
          </View>
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
  header: {
    marginBottom: SPACING['2xl'],
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
    lineHeight: FONTS.sizes.base * 1.5,
  },
  phone: {
    color: COLORS.gray900,
    fontWeight: FONTS.weights.semiBold,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  otpInput: {
    width: 48,
    height: 56,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1.5,
    borderColor: COLORS.gray200,
    backgroundColor: COLORS.gray50,
    textAlign: 'center',
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.gray900,
  },
  otpInputFilled: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
  },
  otpInputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.error,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  verifyButton: {
    marginTop: SPACING.md,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.xl,
  },
  resendText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.gray500,
  },
  resendLink: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.primary,
  },
  timerText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.gray400,
  },
});

export default OTPScreen;
