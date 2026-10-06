import { Pressable, ScrollView, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme';
import { StatusPill, SubscreenHeader } from '../components/SubscreenHeader';
import { useAndroidBack } from '../useAndroidBack';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Session {
  id: string;
  device: string;
  detail: string;
  current?: boolean;
}

export const INITIAL_SESSIONS: Session[] = [
  { id: 'tecno', device: 'Tecno Camon 20 · this phone', detail: 'Lagos · active now', current: true },
  { id: 'iphone', device: 'Iphone 18pro', detail: 'Lekki · last active yesterday 9:12 PM' },
];

interface Props {
  sessions: Session[];
  onSignOut: (id: string) => void;
  onBack: () => void;
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export function ActiveSessionsScreen({ sessions, onSignOut, onBack }: Props) {
  useAndroidBack(onBack);

  return (
    <View style={{ flex: 1, backgroundColor: colors.canvas }}>
      <SubscreenHeader title="Where you're signed in" onBack={onBack} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={{ fontSize: 14, color: colors.mute, lineHeight: 20, marginBottom: 20 }}>
          Sign out any device you don't recognise.
        </Text>

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
          Devices
        </Text>

        <View
          style={{
            backgroundColor: colors.white,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: colors.line,
            overflow: 'hidden',
          }}
        >
          {sessions.map((session, index) => (
            <View key={session.id}>
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
                    backgroundColor: '#ECFDF3',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Feather name="smartphone" size={16} color="#039855" />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: colors.ink, marginBottom: 1 }}>
                    {session.device}
                  </Text>
                  <Text style={{ fontSize: 12, color: colors.mute }}>{session.detail}</Text>
                </View>

                {session.current ? (
                  <StatusPill label="THIS DEVICE" bg="#ECFDF3" color="#027A48" />
                ) : (
                  <Pressable
                    onPress={() => onSignOut(session.id)}
                    hitSlop={8}
                    style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
                  >
                    <StatusPill label="SIGN OUT" bg="#FEF3F2" color="#D92D20" />
                  </Pressable>
                )}
              </View>

              {index < sessions.length - 1 && (
                <View style={{ height: 1, backgroundColor: colors.line, marginLeft: 64 }} />
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
