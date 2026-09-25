import {
  Linking,
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

// ─── Detail row ───────────────────────────────────────────────────────────────

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 13,
        borderBottomWidth: 1,
        borderBottomColor: colors.line,
      }}
    >
      <Text style={{ flex: 1, fontSize: 13, color: colors.mute }}>{label}</Text>
      <Text
        style={{
          fontSize: 13,
          fontWeight: '700',
          color: colors.ink,
          textAlign: 'right',
          flexShrink: 0,
          maxWidth: '60%',
        }}
      >
        {value}
      </Text>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export function UnauthorizedPickupScreen({ onBack }: { onBack: () => void }) {
  useAndroidBack(onBack);
  const topInset = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 48;

  return (
    <View style={{ flex: 1, backgroundColor: colors.canvas }}>
      <ExpoStatusBar style="light" />

      {/* ── Red hero header ───────────────────────────────────────────── */}
      <View style={{ backgroundColor: '#991B1B', paddingTop: topInset, paddingBottom: 28 }}>
        {/* Nav row */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 8,
            paddingTop: 4,
            paddingBottom: 16,
            gap: 8,
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
            <Feather name="chevron-left" size={24} color="rgba(255,255,255,0.85)" />
          </Pressable>

          <Text
            style={{
              fontSize: 11,
              fontWeight: '700',
              color: 'rgba(255,255,255,0.7)',
              letterSpacing: 1,
              textTransform: 'uppercase',
            }}
          >
            Security Alert · Action Needed
          </Text>
        </View>

        {/* Title + body */}
        <View style={{ paddingHorizontal: 20 }}>
          <Text
            style={{
              fontSize: 28,
              fontWeight: '800',
              color: colors.white,
              letterSpacing: -0.5,
              marginBottom: 10,
              lineHeight: 34,
            }}
          >
            Unauthorized pickup attempt
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: 'rgba(255,255,255,0.8)',
              lineHeight: 20,
            }}
          >
            Someone attempted to collect Amara without an active authorization.
            She was not released and is safe at school.
          </Text>
        </View>
      </View>

      {/* ── Body ──────────────────────────────────────────────────────── */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Incident detail card */}
        <View
          style={{
            backgroundColor: colors.white,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: colors.line,
            paddingHorizontal: 16,
            marginBottom: 12,
          }}
        >
          <DetailRow label="Child" value="Amara Okafor · Primary 4A" />
          <DetailRow label="Time" value="2:12 PM today" />
          <DetailRow label="Gate" value="Main Gate" />
          <DetailRow label="Person" value="Gave name: Emeka Nwosu" />
          <DetailRow label="Outcome" value="Not released" />
          {/* Last row — no bottom border */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 13,
            }}
          >
            <Text style={{ flex: 1, fontSize: 13, color: colors.mute }}>Incident</Text>
            <Text
              style={{
                fontSize: 13,
                fontWeight: '700',
                color: colors.ink,
              }}
            >
              SG-0907-014 · open
            </Text>
          </View>
        </View>

        {/* Green safe note */}
        <View
          style={{
            backgroundColor: '#F0FDF4',
            borderRadius: 14,
            padding: 14,
            borderWidth: 1,
            borderColor: '#A6F4C5',
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: 10,
            marginBottom: 24,
          }}
        >
          <Feather name="check-circle" size={16} color="#16A34A" style={{ marginTop: 1 }} />
          <Text style={{ flex: 1, fontSize: 13, color: '#15803D', lineHeight: 19 }}>
            Amara is still at school and safe. Greenfield Academy's office has the incident and a photo of the person.
          </Text>
        </View>

        {/* Action buttons */}
        <Pressable
          style={({ pressed }) => ({ opacity: pressed ? 0.82 : 1 })}
        >
          <View
            style={{
              backgroundColor: '#0F6647',
              borderRadius: 14,
              height: 54,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 10,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: '700', color: colors.white }}>
              Authorize this person once
            </Text>
          </View>
        </Pressable>

        <Pressable
          style={({ pressed }) => ({ opacity: pressed ? 0.82 : 1 })}
        >
          <View
            style={{
              backgroundColor: '#DC2626',
              borderRadius: 14,
              height: 54,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 10,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: '700', color: colors.white }}>
              Reject this person
            </Text>
          </View>
        </Pressable>

        <Pressable
          onPress={() => Linking.openURL('tel:+2348001234567')}
          style={({ pressed }) => ({ opacity: pressed ? 0.75 : 1 })}
        >
          <View
            style={{
              backgroundColor: colors.white,
              borderRadius: 14,
              height: 54,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1.5,
              borderColor: colors.line,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: '600', color: colors.ink }}>
              Call Greenfield Academy
            </Text>
          </View>
        </Pressable>
      </ScrollView>
    </View>
  );
}
