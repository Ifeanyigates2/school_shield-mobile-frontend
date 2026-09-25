import {
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
import { useAndroidBack } from '../useAndroidBack';

// ─── Types ────────────────────────────────────────────────────────────────────

type NotifKind = 'security' | 'pickup' | 'success' | 'info' | 'school';

interface NotifItem {
  id: string;
  kind: NotifKind;
  title: string;
  time: string;
  body: string;
}

// ─── Static data ──────────────────────────────────────────────────────────────

const TODAY: NotifItem[] = [
  {
    id: 'unauth-pickup',
    kind: 'security',
    title: 'Unauthorized pickup attempt',
    time: '2:12 PM',
    body: 'Amara was not released. The office has the incident.',
  },
  {
    id: 'pickup-reminder',
    kind: 'pickup',
    title: 'Pickup reminder',
    time: '2:00 PM',
    body: 'Chidinma collects Amara at 2:30 PM, Main Gate.',
  },
  {
    id: 'amara-checkin',
    kind: 'success',
    title: 'Amara checked in',
    time: '7:48 AM',
    body: 'Arrived at the Main Gate.',
  },
  {
    id: 'auth-updated',
    kind: 'info',
    title: 'Authorization updated',
    time: '6:40 AM',
    body: 'Chidinma Okafor · valid until 3:30 PM.',
  },
];

const YESTERDAY: NotifItem[] = [
  {
    id: 'school-announcement',
    kind: 'school',
    title: 'School announcement',
    time: '4:10 PM',
    body: 'Dismissal moves to 1:00 PM on Friday for assembly.',
  },
  {
    id: 'david-pickup',
    kind: 'success',
    title: 'David picked up',
    time: '2:41 PM',
    body: 'Chidinma Okafor · Main Gate.',
  },
];

// ─── Icon config ──────────────────────────────────────────────────────────────

const KIND_CONFIG: Record<
  NotifKind,
  { bg: string; iconColor: string; icon: React.ComponentProps<typeof Feather>['name'] }
> = {
  security:  { bg: '#FEE2E2', iconColor: '#DC2626', icon: 'alert-circle' },
  pickup:    { bg: '#FEF3C7', iconColor: '#D97706', icon: 'clock' },
  success:   { bg: '#DCFCE7', iconColor: '#16A34A', icon: 'check-circle' },
  info:      { bg: '#DBEAFE', iconColor: '#2563EB', icon: 'info' },
  school:    { bg: '#EDE9FE', iconColor: '#7C3AED', icon: 'book-open' },
};

// ─── Notification row ─────────────────────────────────────────────────────────

function NotifRow({ item }: { item: NotifItem }) {
  const cfg = KIND_CONFIG[item.kind];
  return (
    <Pressable
      style={({ pressed }) => ({
        backgroundColor: pressed ? 'rgba(11,31,61,0.04)' : colors.white,
        paddingHorizontal: 16,
        paddingVertical: 14,
      })}
    >
      <View style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
        {/* Circular icon */}
        <View
          style={{
            width: 38,
            height: 38,
            borderRadius: 19,
            backgroundColor: cfg.bg,
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginTop: 1,
          }}
        >
          <Feather name={cfg.icon} size={17} color={cfg.iconColor} />
        </View>

        {/* Content */}
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: 8,
              marginBottom: 3,
            }}
          >
            <Text
              style={{
                flex: 1,
                fontSize: 14,
                fontWeight: '600',
                color: colors.ink,
                letterSpacing: -0.2,
                lineHeight: 19,
              }}
            >
              {item.title}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: colors.mute,
                flexShrink: 0,
              }}
            >
              {item.time}
            </Text>
          </View>
          <Text style={{ fontSize: 13, color: colors.mute, lineHeight: 18 }}>
            {item.body}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

function Section({ label, items }: { label: string; items: NotifItem[] }) {
  return (
    <View style={{ marginTop: 20 }}>
      <Text
        style={{
          fontSize: 11,
          fontWeight: '700',
          color: colors.mute,
          letterSpacing: 0.8,
          textTransform: 'uppercase',
          paddingHorizontal: 16,
          marginBottom: 8,
        }}
      >
        {label}
      </Text>

      <View
        style={{
          marginHorizontal: 16,
          backgroundColor: colors.white,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: colors.line,
          overflow: 'hidden',
        }}
      >
        {items.map((item, idx) => (
          <View key={item.id}>
            <NotifRow item={item} />
            {idx < items.length - 1 && (
              <View
                style={{
                  height: 1,
                  backgroundColor: colors.line,
                  marginLeft: 66,
                }}
              />
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export function NotificationsScreen({ onBack }: { onBack: () => void }) {
  useAndroidBack(onBack);
  const topInset = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 48;

  return (
    <View style={{ flex: 1, backgroundColor: colors.canvas }}>
      <ExpoStatusBar style="dark" />

      {/* Nav bar */}
      <View style={{ paddingTop: topInset, backgroundColor: colors.canvas }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 8,
            paddingVertical: 8,
          }}
        >
          <Pressable
            onPress={onBack}
            style={({ pressed }) => ({
              width: 40,
              height: 40,
              borderRadius: 20,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.6 : 1,
            })}
          >
            <Feather name="chevron-left" size={24} color={colors.navy} />
          </Pressable>

          <Text
            style={{
              flex: 1,
              textAlign: 'center',
              fontSize: 17,
              fontWeight: '700',
              color: colors.ink,
              letterSpacing: -0.3,
              marginRight: 40,
            }}
          >
            Notifications
          </Text>

          <Pressable
            style={({ pressed }) => ({
              opacity: pressed ? 0.5 : 1,
              paddingHorizontal: 8,
            })}
          >
            <Text
              style={{ fontSize: 13, fontWeight: '600', color: colors.navy }}
            >
              Mark all read
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Body */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <Section label="Today" items={TODAY} />
        <Section label="Yesterday" items={YESTERDAY} />

        {/* Footer note */}
        <View
          style={{
            marginHorizontal: 16,
            marginTop: 16,
            backgroundColor: colors.soft,
            borderRadius: 14,
            padding: 14,
          }}
        >
          <Text
            style={{
              fontSize: 13,
              color: colors.mute,
              lineHeight: 19,
              textAlign: 'center',
            }}
          >
            Clearing notifications does not delete security records. Every incident stays in Activity and with the school.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
