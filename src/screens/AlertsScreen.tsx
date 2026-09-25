import { useState, useRef } from 'react';
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
import { useAndroidBack } from '../useAndroidBack';

const SCREEN_WIDTH = Dimensions.get('window').width;

// ─── Types ────────────────────────────────────────────────────────────────────

type AlertCategory = 'security' | 'pickup' | 'child' | 'school';
type BadgeKind = 'action-needed' | 'reminder' | null;

interface AlertItem {
  id: string;
  category: AlertCategory;
  dot: 'red' | 'orange' | 'grey';
  title: string;
  time: string;
  body: string;
  badge: BadgeKind;
  read: boolean;
}

// ─── Static alert data ────────────────────────────────────────────────────────

const ALERTS: AlertItem[] = [
  {
    id: 'unauthorized-pickup',
    category: 'security',
    dot: 'red',
    title: 'Unauthorized pickup attempt',
    time: '2:12 PM',
    body: 'Someone tried to collect Amara at 2:12 PM. She was not released.',
    badge: 'action-needed',
    read: false,
  },
  {
    id: 'pickup-window',
    category: 'pickup',
    dot: 'orange',
    title: 'Pickup window opens in 30 minutes',
    time: '2:00 PM',
    body: 'Chidinma Okafor collects Amara at the Main Gate.',
    badge: 'reminder',
    read: false,
  },
  {
    id: 'auth-created',
    category: 'pickup',
    dot: 'grey',
    title: 'Authorization created',
    time: '6:40 AM',
    body: 'Chidinma Okafor · valid until 3:30 PM today.',
    badge: null,
    read: true,
  },
  {
    id: 'david-pickup',
    category: 'child',
    dot: 'grey',
    title: 'David picked up',
    time: '2:41 PM',
    body: 'Chidinma Okafor collected David at 2:41 PM, Main Gate.',
    badge: null,
    read: true,
  },
  {
    id: 'amara-checkin',
    category: 'child',
    dot: 'grey',
    title: 'Amara checked in',
    time: '7:48 AM',
    body: 'Arrived at the Main Gate at 7:48 AM.',
    badge: null,
    read: true,
  },
  {
    id: 'dismissal',
    category: 'school',
    dot: 'grey',
    title: 'Dismissal moves to 1:00 PM on Friday',
    time: 'Yesterday',
    body: 'End-of-term assembly. Pickup windows shift automatically.',
    badge: null,
    read: true,
  },
];

const SECTION_ORDER: AlertCategory[] = ['security', 'pickup', 'child', 'school'];
const SECTION_LABELS: Record<AlertCategory, string> = {
  security: 'Security',
  pickup: 'Pickup',
  child: 'Child',
  school: 'School',
};

const DOT_COLORS: Record<AlertItem['dot'], string> = {
  red: '#EF4444',
  orange: '#F59E0B',
  grey: '#D0D5DD',
};

const BADGE_STYLES: Record<NonNullable<BadgeKind>, { bg: string; text: string; label: string }> = {
  'action-needed': { bg: '#FEE2E2', text: '#B91C1C', label: 'ACTION NEEDED' },
  reminder: { bg: '#FEF3C7', text: '#92400E', label: 'REMINDER' },
};

// ─── Alert row ────────────────────────────────────────────────────────────────

function AlertRow({
  alert,
  onPress,
}: {
  alert: AlertItem;
  onPress: () => void;
}) {
  const badge = alert.badge ? BADGE_STYLES[alert.badge] : null;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: pressed ? 'rgba(11,31,61,0.04)' : colors.white,
        paddingHorizontal: 16,
        paddingVertical: 14,
      })}
    >
      <View style={{ flexDirection: 'row', gap: 10 }}>
        {/* Dot */}
        <View style={{ paddingTop: 5, flexShrink: 0 }}>
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: DOT_COLORS[alert.dot],
            }}
          />
        </View>

        {/* Content */}
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 8,
              marginBottom: 3,
            }}
          >
            <Text
              style={{
                flex: 1,
                fontSize: 14,
                fontWeight: alert.read ? '500' : '700',
                color: colors.ink,
                letterSpacing: -0.2,
              }}
            >
              {alert.title}
            </Text>
            <Text style={{ fontSize: 12, color: colors.mute, flexShrink: 0 }}>
              {alert.time}
            </Text>
          </View>

          <Text style={{ fontSize: 13, color: colors.mute, lineHeight: 18 }}>
            {alert.body}
          </Text>

          {badge && (
            <View
              style={{
                alignSelf: 'flex-start',
                marginTop: 8,
                backgroundColor: badge.bg,
                borderRadius: 20,
                paddingHorizontal: 10,
                paddingVertical: 3,
              }}
            >
              <Text style={{ fontSize: 10, fontWeight: '700', color: badge.text, letterSpacing: 0.5 }}>
                {badge.label}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export function AlertsScreen({
  onBack,
  onOpenAlert,
}: {
  onBack: () => void;
  onOpenAlert: (id: string) => void;
}) {
  useAndroidBack(onBack);
  const topInset = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 48;

  const sections = SECTION_ORDER.map((cat) => ({
    category: cat,
    label: SECTION_LABELS[cat],
    items: ALERTS.filter((a) => a.category === cat),
  })).filter((s) => s.items.length > 0);

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
              fontSize: 28,
              fontWeight: '800',
              color: colors.ink,
              letterSpacing: -0.5,
              marginLeft: 4,
            }}
          >
            Alerts
          </Text>

          <Pressable
            style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, paddingHorizontal: 8 })}
          >
            <Text style={{ fontSize: 13, fontWeight: '600', color: colors.navy }}>
              Mark all read
            </Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {sections.map((section) => (
          <View key={section.category} style={{ marginTop: 20 }}>
            {/* Section label */}
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
              {section.label}
            </Text>

            {/* Card */}
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
              {section.items.map((alert, idx) => (
                <View key={alert.id}>
                  <AlertRow
                    alert={alert}
                    onPress={() => onOpenAlert(alert.id)}
                  />
                  {idx < section.items.length - 1 && (
                    <View
                      style={{
                        height: 1,
                        backgroundColor: colors.line,
                        marginLeft: 34,
                      }}
                    />
                  )}
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
