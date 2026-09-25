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

const SCREEN_WIDTH = Dimensions.get('window').width;

// --- Types --------------------------------------------------------------------

type MenuRow = {
  id: string;
  icon: React.ComponentProps<typeof Feather>['name'];
  label: string;
  sublabel: string;
  badge?: string;
  badgeColor?: string;
  danger?: boolean;
  onPress?: () => void;
};

// --- Sub-components -----------------------------------------------------------

function ProfileCard() {
  return (
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

function MenuCard({ rows }: { rows: MenuRow[] }) {
  return (
    <View
      style={{
        backgroundColor: colors.white,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.line,
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
                  backgroundColor: row.danger ? '#FEF2F2' : colors.soft,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Feather
                  name={row.icon}
                  size={17}
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
                      backgroundColor: row.badgeColor ?? '#3B82F6',
                      borderRadius: 12,
                      paddingHorizontal: 8,
                      paddingVertical: 3,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 11,
                        fontWeight: '700',
                        color: colors.white,
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

export function MoreScreen() {
  type Subscreen = 'main' | 'account-security' | 'alerts' | 'unauthorized-pickup' | 'notifications';
  const [subscreen, setSubscreen] = useState<Subscreen>('main');
  const slideAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current;
  const detailSlide = useRef(new Animated.Value(SCREEN_WIDTH)).current;

  const openSubscreen = (screen: Subscreen) => {
    setSubscreen(screen);
    slideAnim.setValue(SCREEN_WIDTH);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 68,
      friction: 11,
    }).start();
  };

  const openDetail = (screen: Subscreen) => {
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
    }).start(() => setSubscreen('alerts'));
  };

  const topInset =
    Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 48;

  // Sub-screen routing
  if (subscreen === 'account-security') {
    return (
      <Animated.View style={{ flex: 1, transform: [{ translateX: slideAnim }] }}>
        <AccountSecurityScreen onBack={closeSubscreen} />
      </Animated.View>
    );
  }

  if (subscreen === 'alerts') {
    return (
      <Animated.View style={{ flex: 1, transform: [{ translateX: slideAnim }] }}>
        <AlertsScreen
          onBack={closeSubscreen}
          onOpenAlert={(id) => {
            if (id === 'unauthorized-pickup') openDetail('unauthorized-pickup');
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

  const needsYouRows: MenuRow[] = [
    {
      id: 'alerts',
      icon: 'alert-triangle',
      label: 'Alerts',
      sublabel: 'Security, pickup, child and school',
      badge: '2 NEW',
      badgeColor: '#3B82F6',
      onPress: () => openSubscreen('alerts'),
    },
  ];

  const familyRows: MenuRow[] = [
    {
      id: 'profile',
      icon: 'user',
      label: 'Profile',
      sublabel: 'Name, phone, email, photo',
    },
    {
      id: 'family-settings',
      icon: 'users',
      label: 'Family settings',
      sublabel: 'Children, guardians, handlers',
    },
  ];

  const schoolRows: MenuRow[] = [
    {
      id: 'school-details',
      icon: 'home',
      label: 'School details',
      sublabel: 'Gates, windows, hours, calendar',
    },
    {
      id: 'contact-school',
      icon: 'phone',
      label: 'Contact school',
      sublabel: 'Call or email the office',
    },
  ];

  const accountRows: MenuRow[] = [
    {
      id: 'notifications',
      icon: 'bell',
      label: 'Notifications',
      sublabel: 'Channels and what you are told',
      onPress: () => openSubscreen('notifications'),
    },
    {
      id: 'account-security',
      icon: 'lock',
      label: 'Account & security',
      sublabel: 'Password, sessions, deletion',
      onPress: () => openSubscreen('account-security'),
    },
    {
      id: 'help',
      icon: 'help-circle',
      label: 'Help',
      sublabel: 'Six common questions',
    },
  ];

  const destructiveRows: MenuRow[] = [
    {
      id: 'logout',
      icon: 'log-out',
      label: 'Log out',
      sublabel: 'SMS alerts continue to Chidinma',
      danger: true,
    },
    {
      id: 'delete-account',
      icon: 'trash-2',
      label: 'Delete account',
      sublabel: 'Handover records to Chidinma',
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
            marginBottom: 6,
          }}
        >
          More
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: colors.mute,
            lineHeight: 20,
            marginBottom: 24,
          }}
        >
          Everything that is not today. Pickup and drop-off are deliberately
          absent — they live on Home and Children, where a parent already is.
        </Text>

        {/* -- Profile Card ---------------------------------------------- */}
        <ProfileCard />

        {/* -- Needs You ------------------------------------------------- */}
        <View style={{ marginTop: 24 }}>
          <SectionLabel label="Needs you" />
          <MenuCard rows={needsYouRows} />
        </View>

        {/* -- Your Family ----------------------------------------------- */}
        <View style={{ marginTop: 24 }}>
          <SectionLabel label="Your family" />
          <MenuCard rows={familyRows} />
        </View>

        {/* -- School ---------------------------------------------------- */}
        <View style={{ marginTop: 24 }}>
          <SectionLabel label="School" />
          <MenuCard rows={schoolRows} />
        </View>

        {/* -- Account --------------------------------------------------- */}
        <View style={{ marginTop: 24 }}>
          <SectionLabel label="Account" />
          <MenuCard rows={accountRows} />
        </View>

        {/* -- Destructive Actions --------------------------------------- */}
        <View style={{ marginTop: 12 }}>
          <MenuCard rows={destructiveRows} />
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
    </View>
  );
}
