import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme';
import { InitialsAvatar } from '../components';
import { AccountSecurityScreen } from './AccountSecurityScreen';
import { AlertsScreen } from './AlertsScreen';
import { UnauthorizedPickupScreen } from './UnauthorizedPickupScreen';
import { NotificationsScreen } from './NotificationsScreen';
import { ProfileScreen } from './ProfileScreen';
import { FamilySettingsScreen } from './FamilySettingsScreen';
import { ContactSchoolScreen } from './ContactSchoolScreen';
import { SchoolDetailsScreen } from './SchoolDetailsScreen';
import { HelpScreen } from './HelpScreen';
import { SignOutSheet } from '../components/SignOutSheet';

const SCREEN_WIDTH = Dimensions.get('window').width;

// --- Types --------------------------------------------------------------------

type MenuRow = {
  id: string;
  icon: React.ComponentProps<typeof Feather>['name'];
  label: string;
  sublabel: string;
  badge?: string;
  badgeColor?: string;
  badgeTextColor?: string;
  danger?: boolean;
  onPress?: () => void;
};

// --- Sub-components -----------------------------------------------------------

function ProfileCard({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}>
    <View
      style={{
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        borderWidth: 1,
        borderColor: colors.line,
      }}
    >
      <InitialsAvatar name="Zara Okafor" size={48} color={colors.navy} />
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: '700',
            color: colors.ink,
            letterSpacing: -0.3,
            marginBottom: 2,
          }}
        >
          Zara Okafor
        </Text>
        <Text style={{ fontSize: 13, color: colors.mute }}>
          Parent · +234 803 456 7890
        </Text>
      </View>
      <View
        style={{
          backgroundColor: '#ECFDF3',
          borderRadius: 20,
          paddingHorizontal: 10,
          paddingVertical: 4,
          borderWidth: 1,
          borderColor: '#A6F4C5',
        }}
      >
        <Text
          style={{
            fontSize: 11,
            fontWeight: '700',
            color: '#027A48',
            letterSpacing: 0.3,
          }}
        >
          PRIMARY
        </Text>
      </View>
    </View>
    </Pressable>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <Text
      style={{
        fontSize: 11,
        fontWeight: '700',
        color: colors.mute,
        letterSpacing: 0.8,
        textTransform: 'uppercase',
        marginBottom: 8,
        marginTop: 4,
      }}
    >
      {label}
    </Text>
  );
}

function MenuCard({
  rows,
  borderColor = colors.line,
}: {
  rows: MenuRow[];
  borderColor?: string;
}) {
  return (
    <View
      style={{
        backgroundColor: colors.white,
        borderRadius: 16,
        borderWidth: 1,
        borderColor,
        overflow: 'hidden',
      }}
    >
      {rows.map((row, index) => (
        <View key={row.id}>
          <Pressable
            onPress={row.onPress}
            style={({ pressed }) => ({
              backgroundColor: pressed ? 'rgba(11,31,61,0.04)' : colors.white,
            })}
          >
            {/* Inner row - static layout so flexDirection is always applied */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 16,
                paddingVertical: 14,
                gap: 12,
              }}
            >
              {/* Left icon pill */}
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  backgroundColor: row.danger ? '#FEF3F2' : colors.soft,
                  borderWidth: 1,
                  borderColor: row.danger ? '#FEE4E2' : colors.line,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Feather
                  name={row.icon}
                  size={16}
                  color={row.danger ? colors.danger : colors.navy}
                />
              </View>

              {/* Label + sublabel */}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: row.danger ? colors.danger : colors.ink,
                    letterSpacing: -0.2,
                    marginBottom: 1,
                  }}
                >
                  {row.label}
                </Text>
                <Text style={{ fontSize: 12, color: colors.mute }}>
                  {row.sublabel}
                </Text>
              </View>

              {/* Right-side: badge + chevron */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                  flexShrink: 0,
                }}
              >
                {row.badge ? (
                  <View
                    style={{
                      backgroundColor: row.badgeColor ?? '#FEE4E2',
                      borderRadius: 12,
                      paddingHorizontal: 8,
                      paddingVertical: 3,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: '700',
                        color: row.badgeTextColor ?? '#B42318',
                        letterSpacing: 0.3,
                      }}
                    >
                      {row.badge}
                    </Text>
                  </View>
                ) : null}

                {!row.danger && (
                  <Feather name="chevron-right" size={16} color="#C0C8D4" />
                )}
              </View>
            </View>
          </Pressable>

          {/* Divider (not after last row) */}
          {index < rows.length - 1 && (
            <View
              style={{
                height: 1,
                backgroundColor: colors.line,
                marginLeft: 64,
              }}
            />
          )}
        </View>
      ))}
    </View>
  );
}

// --- Main Screen --------------------------------------------------------------

interface MoreScreenProps {
  onOpenChild?: (childId: string) => void;
  onOpenHandler?: (handlerId: string) => void;
  onSignOut?: () => void;
}

export function MoreScreen({ onOpenChild, onOpenHandler, onSignOut }: MoreScreenProps = {}) {
  type Subscreen =
    | 'main'
    | 'profile'
    | 'account-security'
    | 'alerts'
    | 'unauthorized-pickup'
    | 'notifications'
    | 'family-settings'
    | 'contact-school'
    | 'school-details'
    | 'help';
  const [subscreen, setSubscreen] = useState<Subscreen>('main');
  // Set when a screen is pushed on top of another sub-screen (e.g. Help → Contact school)
  const [detailParent, setDetailParent] = useState<Subscreen | null>(null);
  const [signOutSheet, setSignOutSheet] = useState(false);
  const slideAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current;
  const detailSlide = useRef(new Animated.Value(SCREEN_WIDTH)).current;

  const openSubscreen = (screen: Subscreen) => {
    setDetailParent(null);
    setSubscreen(screen);
    slideAnim.setValue(SCREEN_WIDTH);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 68,
      friction: 11,
    }).start();
  };

  const openDetail = (screen: Subscreen, parent: Subscreen) => {
    setDetailParent(parent);
    setSubscreen(screen);
    detailSlide.setValue(SCREEN_WIDTH);
    Animated.spring(detailSlide, {
      toValue: 0,
      useNativeDriver: true,
      tension: 68,
      friction: 11,
    }).start();
  };

  const closeSubscreen = () => {
    Animated.timing(slideAnim, {
      toValue: SCREEN_WIDTH,
      duration: 220,
      useNativeDriver: true,
    }).start(() => setSubscreen('main'));
  };

  const closeDetail = () => {
    Animated.timing(detailSlide, {
      toValue: SCREEN_WIDTH,
      duration: 220,
      useNativeDriver: true,
    }).start(() => {
      setSubscreen(detailParent ?? 'main');
      setDetailParent(null);
    });
  };

  const topInset =
    Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 48;

  const signOutSheetEl = (
    <SignOutSheet
      visible={signOutSheet}
      onCancel={() => setSignOutSheet(false)}
      onSignOut={() => {
        setSignOutSheet(false);
        onSignOut?.();
      }}
    />
  );

  // Sub-screen routing
  if (subscreen === 'profile') {
    return (
      <Animated.View style={{ flex: 1, transform: [{ translateX: slideAnim }] }}>
        <ProfileScreen onBack={closeSubscreen} />
      </Animated.View>
    );
  }

  if (subscreen === 'account-security') {
    return (
      <Animated.View style={{ flex: 1, transform: [{ translateX: slideAnim }] }}>
        <AccountSecurityScreen onBack={closeSubscreen} onLogOut={() => setSignOutSheet(true)} />
        {signOutSheetEl}
      </Animated.View>
    );
  }

  if (subscreen === 'alerts') {
    return (
      <Animated.View style={{ flex: 1, transform: [{ translateX: slideAnim }] }}>
        <AlertsScreen
          onBack={closeSubscreen}
          onOpenAlert={(id) => {
            if (id === 'unauthorized-pickup') openDetail('unauthorized-pickup', 'alerts');
          }}
        />
      </Animated.View>
    );
  }

  if (subscreen === 'unauthorized-pickup') {
    return (
      <Animated.View style={{ flex: 1, transform: [{ translateX: detailSlide }] }}>
        <UnauthorizedPickupScreen onBack={closeDetail} />
      </Animated.View>
    );
  }

  if (subscreen === 'notifications') {
    return (
      <Animated.View style={{ flex: 1, transform: [{ translateX: slideAnim }] }}>
        <NotificationsScreen onBack={closeSubscreen} />
      </Animated.View>
    );
  }

  if (subscreen === 'family-settings') {
    return (
      <Animated.View style={{ flex: 1, transform: [{ translateX: slideAnim }] }}>
        <FamilySettingsScreen
          onBack={closeSubscreen}
          onOpenChild={onOpenChild}
          onOpenHandler={onOpenHandler}
        />
      </Animated.View>
    );
  }

  if (subscreen === 'school-details') {
    return (
      <Animated.View style={{ flex: 1, transform: [{ translateX: slideAnim }] }}>
        <SchoolDetailsScreen onBack={closeSubscreen} />
      </Animated.View>
    );
  }

  if (subscreen === 'contact-school') {
    return (
      <Animated.View
        style={{ flex: 1, transform: [{ translateX: detailParent ? detailSlide : slideAnim }] }}
      >
        <ContactSchoolScreen onBack={detailParent ? closeDetail : closeSubscreen} />
      </Animated.View>
    );
  }

  if (subscreen === 'help') {
    return (
      <Animated.View style={{ flex: 1, transform: [{ translateX: slideAnim }] }}>
        <HelpScreen
          onBack={closeSubscreen}
          onContactSchool={() => openDetail('contact-school', 'help')}
        />
      </Animated.View>
    );
  }

  const needsYouRows: MenuRow[] = [
    {
      id: 'alerts',
      icon: 'alert-triangle',
      label: 'Alerts',
      sublabel: 'Security, pickup, child and school',
      badge: '2 NEW',
      onPress: () => openSubscreen('alerts'),
    },
  ];

  const familySchoolRows: MenuRow[] = [
    {
      id: 'school-details',
      icon: 'home',
      label: 'School details',
      sublabel: 'Windows, gates, routes, hours etc',
      onPress: () => openSubscreen('school-details'),
    },
    {
      id: 'contact-school',
      icon: 'phone',
      label: 'Contact school',
      sublabel: 'Call or email the office',
      onPress: () => openSubscreen('contact-school'),
    },
    {
      id: 'family-settings',
      icon: 'user',
      label: 'Family settings',
      sublabel: 'Guardians, children, handlers',
      onPress: () => openSubscreen('family-settings'),
    },
  ];

  const accountRows: MenuRow[] = [
    {
      id: 'account-security',
      icon: 'shield',
      label: 'Account & security',
      sublabel: 'Password, phone, sessions',
      onPress: () => openSubscreen('account-security'),
    },
    {
      id: 'notifications',
      icon: 'bell',
      label: 'Notifications',
      sublabel: 'What we send and how',
      onPress: () => openSubscreen('notifications'),
    },
    {
      id: 'help',
      icon: 'help-circle',
      label: 'Help',
      sublabel: 'How SchoolShield works',
      onPress: () => openSubscreen('help'),
    },
  ];

  const logoutRows: MenuRow[] = [
    {
      id: 'logout',
      icon: 'log-out',
      label: 'Log out',
      sublabel: 'SMS alerts continue',
      onPress: () => setSignOutSheet(true),
      danger: true,
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.canvas }}>
      <ExpoStatusBar style="dark" />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: topInset + 8,
          paddingHorizontal: 16,
          paddingBottom: 32,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* -- Page Header ----------------------------------------------- */}
        <Text
          style={{
            fontSize: 28,
            fontWeight: '800',
            color: colors.ink,
            letterSpacing: -0.5,
            marginBottom: 20,
          }}
        >
          More
        </Text>

        {/* -- Profile Card ---------------------------------------------- */}
        <ProfileCard onPress={() => openSubscreen('profile')} />

        {/* -- Needs You ------------------------------------------------- */}
        <View style={{ marginTop: 24 }}>
          <SectionLabel label="Needs you" />
          <MenuCard rows={needsYouRows} />
        </View>

        {/* -- Family & School ------------------------------------------- */}
        <View style={{ marginTop: 24 }}>
          <SectionLabel label="Family & school" />
          <MenuCard rows={familySchoolRows} />
        </View>

        {/* -- Account --------------------------------------------------- */}
        <View style={{ marginTop: 24 }}>
          <SectionLabel label="Account" />
          <MenuCard rows={accountRows} />
        </View>

        {/* -- Log out --------------------------------------------------- */}
        <View style={{ marginTop: 16 }}>
          <MenuCard rows={logoutRows} borderColor="#FDA29B" />
        </View>

        {/* -- Footer ---------------------------------------------------- */}
        <Text
          style={{
            fontSize: 11,
            color: '#C0C8D4',
            textAlign: 'center',
            marginTop: 32,
            letterSpacing: 0.2,
          }}
        >
          School Shield · Guardian App
        </Text>
      </ScrollView>
      {signOutSheetEl}
    </View>
  );
}
