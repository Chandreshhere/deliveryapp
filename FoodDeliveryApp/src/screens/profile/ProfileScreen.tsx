import React from 'react';
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
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { Avatar, Divider } from '../../components/common';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { RootStackParamList } from '../../types';
import { useAuthStore } from '../../store/useStore';

type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface MenuItem {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress: () => void;
  showBadge?: boolean;
  danger?: boolean;
}

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { user, logout } = useAuthStore();

  const menuItems: MenuItem[][] = [
    [
      {
        icon: 'person-outline',
        title: 'Edit Profile',
        subtitle: 'Update your personal information',
        onPress: () => navigation.navigate('EditProfile'),
      },
      {
        icon: 'location-outline',
        title: 'Saved Addresses',
        subtitle: 'Manage delivery addresses',
        onPress: () => navigation.navigate('Addresses'),
      },
      {
        icon: 'card-outline',
        title: 'Payment Methods',
        subtitle: 'Manage cards and wallets',
        onPress: () => {},
      },
    ],
    [
      {
        icon: 'notifications-outline',
        title: 'Notifications',
        subtitle: 'Manage notification preferences',
        onPress: () => {},
        showBadge: true,
      },
      {
        icon: 'settings-outline',
        title: 'Settings',
        onPress: () => {},
      },
    ],
    [
      {
        icon: 'help-circle-outline',
        title: 'Help & Support',
        onPress: () => {},
      },
      {
        icon: 'document-text-outline',
        title: 'Terms & Conditions',
        onPress: () => {},
      },
      {
        icon: 'shield-checkmark-outline',
        title: 'Privacy Policy',
        onPress: () => {},
      },
      {
        icon: 'information-circle-outline',
        title: 'About',
        onPress: () => {},
      },
    ],
    [
      {
        icon: 'log-out-outline',
        title: 'Logout',
        onPress: () => logout(),
        danger: true,
      },
    ],
  ];

  const renderMenuItem = (item: MenuItem, index: number, isLast: boolean) => (
    <TouchableOpacity
      key={index}
      style={styles.menuItem}
      onPress={item.onPress}
    >
      <View
        style={[styles.menuIcon, item.danger && styles.menuIconDanger]}
      >
        <Ionicons
          name={item.icon}
          size={22}
          color={item.danger ? COLORS.error : COLORS.gray600}
        />
      </View>
      <View style={[styles.menuContent, !isLast && styles.menuContentBorder]}>
        <View style={styles.menuText}>
          <Text
            style={[styles.menuTitle, item.danger && styles.menuTitleDanger]}
          >
            {item.title}
          </Text>
          {item.subtitle && (
            <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
          )}
        </View>
        <View style={styles.menuRight}>
          {item.showBadge && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          )}
          <Ionicons
            name="chevron-forward"
            size={20}
            color={COLORS.gray400}
          />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        {/* Profile Card */}
        <TouchableOpacity
          style={styles.profileCard}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Avatar name={user?.name || 'User'} size="lg" />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name || 'User'}</Text>
            <Text style={styles.profilePhone}>{user?.phone || '+91 98765 43210'}</Text>
            <Text style={styles.profileEmail}>{user?.email || 'user@example.com'}</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={COLORS.gray400} />
        </TouchableOpacity>

        {/* Stats */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>23</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>₹5,420</Text>
            <Text style={styles.statLabel}>Total Spent</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>4.8</Text>
            <Text style={styles.statLabel}>Avg Rating</Text>
          </View>
        </View>

        {/* Menu Items */}
        {menuItems.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.menuSection}>
            {section.map((item, itemIndex) =>
              renderMenuItem(
                item,
                itemIndex,
                itemIndex === section.length - 1
              )
            )}
          </View>
        ))}

        {/* App Version */}
        <Text style={styles.version}>Version 1.0.0</Text>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundSecondary,
  },
  header: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
  },
  headerTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.gray900,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SPACING.base,
    marginBottom: SPACING.sm,
  },
  profileInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  profileName: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.gray900,
    marginBottom: SPACING.xs,
  },
  profilePhone: {
    fontSize: FONTS.sizes.md,
    color: COLORS.gray600,
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.gray500,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    padding: SPACING.base,
    marginBottom: SPACING.sm,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.gray900,
    marginBottom: SPACING.xs,
  },
  statLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.gray500,
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.gray200,
    marginVertical: SPACING.sm,
  },
  menuSection: {
    backgroundColor: COLORS.white,
    marginBottom: SPACING.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: SPACING.base,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIconDanger: {
    backgroundColor: COLORS.error + '15',
  },
  menuContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingRight: SPACING.base,
    marginLeft: SPACING.md,
  },
  menuContentBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    fontSize: FONTS.sizes.base,
    fontWeight: FONTS.weights.medium,
    color: COLORS.gray900,
  },
  menuTitleDanger: {
    color: COLORS.error,
  },
  menuSubtitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.gray500,
    marginTop: 2,
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: COLORS.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.bold,
  },
  version: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.gray400,
    textAlign: 'center',
    marginTop: SPACING.lg,
  },
  bottomPadding: {
    height: 100,
  },
});

export default ProfileScreen;
