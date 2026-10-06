import { useState } from 'react';
import { ScrollView, Switch, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme';
import { StatusPill, SubscreenHeader } from '../components/SubscreenHeader';
import { useAndroidBack } from '../useAndroidBack';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  onBack: () => void;
}

type IconName = React.ComponentProps<typeof Feather>['name'];

interface PrefRow {
  id: string;
  icon: IconName;
  label: string;
  sublabel: string;
  /** Always on — shows a pill instead of a toggle */
  locked?: boolean;
}

// ─── Static data ──────────────────────────────────────────────────────────────

const CHANNELS: PrefRow[] = [
  { id: 'push', icon: 'smartphone', label: 'Push', sublabel: 'On this phone' },
  { id: 'sms', icon: 'phone', label: 'SMS', sublabel: 'Works without data' },
  { id: 'whatsapp', icon: 'message-circle', label: 'WhatsApp', sublabel: '+234 803 456 7890' },
];

const TOPICS: PrefRow[] = [
  {
    id: 'arrivals',
    icon: 'check',
    label: 'Arrivals and departures',
    sublabel: 'Checked in, collected, left alone',
  },
  { id: 'reminders', icon: 'clock', label: 'Reminders', sublabel: '15 minutes before a window' },
  {
    id: 'exceptions',
    icon: 'info',
    label: 'Exception decisions',
    sublabel: 'Approved, declined, expired',
  },
  {
    id: 'security',
    icon: 'shield',
    label: 'Security alerts',
    sublabel: 'Refused pickups, revoked codes',
    locked: true,
  },
];

const INITIAL_PREFS: Record<string, boolean> = {
  push: true,
  sms: true,
  whatsapp: false,
  arrivals: true,
  reminders: true,
  exceptions: true,
};

const TOGGLE_ON = '#0F6647';

// ─── Sub-components ───────────────────────────────────────────────────────────

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
      }}
    >
      {label}
    </Text>
  );
}

function PrefCard({
  rows,
  prefs,
  onToggle,
}: {
  rows: PrefRow[];
  prefs: Record<string, boolean>;
  onToggle: (id: string, value: boolean) => void;
}) {
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
      {rows.map((row, index) => {
        const on = row.locked || prefs[row.id];
        return (
          <View key={row.id}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 16,
                paddingVertical: 14,
                gap: 12,
              }}
            >
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  backgroundColor: row.locked ? colors.soft : on ? '#ECFDF3' : colors.soft,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Feather
                  name={row.icon}
                  size={16}
                  color={row.locked ? colors.navy : on ? '#039855' : colors.mute}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: colors.ink, marginBottom: 1 }}>
                  {row.label}
                </Text>
                <Text style={{ fontSize: 12, color: colors.mute }}>{row.sublabel}</Text>
              </View>

              {row.locked ? (
                <StatusPill label="ALWAYS ON" bg={colors.bannerBlueBg} color="#1D4ED8" />
              ) : (
                <Switch
                  value={prefs[row.id]}
                  onValueChange={(value) => onToggle(row.id, value)}
                  trackColor={{ false: colors.line, true: TOGGLE_ON }}
                  thumbColor={colors.white}
                  ios_backgroundColor={colors.line}
                />
              )}
            </View>

            {index < rows.length - 1 && (
              <View style={{ height: 1, backgroundColor: colors.line }} />
            )}
          </View>
        );
      })}
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export function NotificationsScreen({ onBack }: Props) {
  useAndroidBack(onBack);
  const [prefs, setPrefs] = useState(INITIAL_PREFS);
  const toggle = (id: string, value: boolean) =>
    setPrefs((prev) => {
      const next = { ...prev, [id]: value };
      // Security alerts need somewhere to go — never let the last channel switch off.
      if (!CHANNELS.some((c) => next[c.id])) return prev;
      return next;
    });

  return (
    <View style={{ flex: 1, backgroundColor: colors.canvas }}>
      <SubscreenHeader title="Notifications" onBack={onBack} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={{ fontSize: 14, color: colors.mute, lineHeight: 20, marginBottom: 20 }}>
          Security alerts always reach you. Everything else is up to you.
        </Text>

        <SectionLabel label="Channels" />
        <PrefCard rows={CHANNELS} prefs={prefs} onToggle={toggle} />

        <View style={{ marginTop: 24 }}>
          <SectionLabel label="What you get" />
          <PrefCard rows={TOPICS} prefs={prefs} onToggle={toggle} />
        </View>
      </ScrollView>
    </View>
  );
}
