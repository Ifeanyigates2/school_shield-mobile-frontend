import { ScrollView, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme';
import { StatusPill, SubscreenHeader } from '../components/SubscreenHeader';
import { useAndroidBack } from '../useAndroidBack';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Attempt {
  id: string;
  title: string;
  detail: string;
  ok: boolean;
}

interface Props {
  onBack: () => void;
}

// ─── Static data ──────────────────────────────────────────────────────────────

const THIS_WEEK: Attempt[] = [
  { id: 'tecno-mon', title: 'Signed in · Tecno Camon 20', detail: 'Lagos · Mon 6:58 AM', ok: true },
  {
    id: 'android-sat',
    title: 'Wrong password · unknown Android',
    detail: 'Ibadan · Sat 11:42 PM · 3 attempts, then locked 15 min',
    ok: false,
  },
];

const EARLIER: Attempt[] = [
  { id: 'iphone-sep', title: 'Signed in · Iphone 18pro', detail: 'Lekki · 2 Sep 9:04 PM', ok: true },
];

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

function AttemptCard({ attempts }: { attempts: Attempt[] }) {
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
      {attempts.map((a, index) => (
        <View key={a.id}>
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
                width: 32,
                height: 32,
                borderRadius: 8,
                backgroundColor: a.ok ? '#ECFDF3' : '#FEF3F2',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Feather name={a.ok ? 'check' : 'x'} size={15} color={a.ok ? '#039855' : '#D92D20'} />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: colors.ink, marginBottom: 2 }}>
                {a.title}
              </Text>
              <Text style={{ fontSize: 12, color: colors.mute, lineHeight: 17 }}>{a.detail}</Text>
            </View>

            {a.ok ? (
              <StatusPill label="OK" bg="#ECFDF3" color="#027A48" />
            ) : (
              <StatusPill label="FAILED" bg="#FEF3F2" color="#D92D20" />
            )}
          </View>

          {index < attempts.length - 1 && (
            <View style={{ height: 1, backgroundColor: colors.line }} />
          )}
        </View>
      ))}
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export function SignInAttemptsScreen({ onBack }: Props) {
  useAndroidBack(onBack);

  return (
    <View style={{ flex: 1, backgroundColor: colors.canvas }}>
      <SubscreenHeader title="Sign-In Attempts" onBack={onBack} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={{ fontSize: 14, color: colors.mute, lineHeight: 20, marginBottom: 16 }}>
          The last 30 days. Failed attempts are flagged.
        </Text>

        {/* Warning */}
        <View
          style={{
            flexDirection: 'row',
            gap: 10,
            backgroundColor: '#FFFAEB',
            borderRadius: 14,
            padding: 14,
            marginBottom: 20,
          }}
        >
          <Feather name="alert-triangle" size={16} color="#B54708" style={{ marginTop: 1 }} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#B54708', marginBottom: 4 }}>
              Wasn't you on Saturday?
            </Text>
            <Text style={{ fontSize: 12, color: '#B54708', lineHeight: 18 }}>
              Change your password. Nobody got in, the account locked after three tries.
            </Text>
          </View>
        </View>

        <SectionLabel label="This week" />
        <AttemptCard attempts={THIS_WEEK} />

        <View style={{ marginTop: 20 }}>
          <SectionLabel label="Earlier" />
          <AttemptCard attempts={EARLIER} />
        </View>
      </ScrollView>
    </View>
  );
}
