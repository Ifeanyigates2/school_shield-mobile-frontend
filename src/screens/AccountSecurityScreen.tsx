import { useCallback, useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
  Modal,
} from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme';
import { useAndroidBack } from '../useAndroidBack';
import { VerifyPhoneFlow } from './VerifyPhoneFlow';
import { ActiveSessionsScreen, INITIAL_SESSIONS, Session } from './ActiveSessionsScreen';
import { SignInAttemptsScreen } from './SignInAttemptsScreen';

// ─── Types ────────────────────────────────────────────────────────────────────

type SubView = 'main' | 'verify-phone' | 'sessions' | 'attempts';

interface Props {
  onBack: () => void;
  /** Opens the shared sign-out sheet owned by the More screen */
  onLogOut?: () => void;
}

// ─── Shared primitives ────────────────────────────────────────────────────────

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

type RowTone = 'normal' | 'warning' | 'danger' | 'muted';

interface Row {
  id: string;
  icon: React.ComponentProps<typeof Feather>['name'];
  label: string;
  sublabel: string;
  tone?: RowTone;
  /** Text pill on the right, e.g. VERIFIED or CHECK */
  pill?: { label: string; bg: string; color: string };
  /** Small square count badge on the right */
  count?: string;
  /** Shows a lock on the right; the row cannot be changed */
  locked?: boolean;
  chevron?: boolean;
  onPress?: () => void;
}

const TONE: Record<RowTone, { pillBg: string; pillBorder: string; icon: string; label: string }> = {
  normal:  { pillBg: colors.soft, pillBorder: colors.line, icon: colors.navy, label: colors.ink },
  warning: { pillBg: '#FFFAEB', pillBorder: '#FEDF89', icon: '#DC6803', label: colors.ink },
  danger:  { pillBg: '#FEF3F2', pillBorder: '#FEE4E2', icon: colors.danger, label: colors.danger },
  muted:   { pillBg: '#FFFAEB', pillBorder: '#FEF0C7', icon: '#FEC84B', label: colors.mute },
};

function SettingsCard({ rows }: { rows: Row[] }) {
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
        const tone = TONE[row.tone ?? 'normal'];

        return (
          <View key={row.id}>
            <Pressable
              onPress={row.onPress}
              disabled={!row.onPress}
              style={({ pressed }) => ({
                backgroundColor: pressed ? 'rgba(11,31,61,0.04)' : colors.white,
              })}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  gap: 12,
                }}
              >
                {/* Icon pill */}
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    backgroundColor: tone.pillBg,
                    borderWidth: 1,
                    borderColor: tone.pillBorder,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Feather name={row.icon} size={16} color={tone.icon} />
                </View>

                {/* Text */}
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '600',
                      color: tone.label,
                      letterSpacing: -0.2,
                      marginBottom: 1,
                    }}
                  >
                    {row.label}
                  </Text>
                  <Text style={{ fontSize: 12, color: row.tone === 'muted' ? '#98A2B3' : colors.mute }}>
                    {row.sublabel}
                  </Text>
                </View>

                {/* Right: pill / count / lock / chevron */}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                    flexShrink: 0,
                  }}
                >
                  {row.pill && (
                    <View
                      style={{
                        backgroundColor: row.pill.bg,
                        borderRadius: 6,
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 10,
                          fontWeight: '700',
                          color: row.pill.color,
                          letterSpacing: 0.4,
                        }}
                      >
                        {row.pill.label}
                      </Text>
                    </View>
                  )}

                  {row.count && (
                    <View
                      style={{
                        minWidth: 22,
                        height: 22,
                        borderRadius: 6,
                        paddingHorizontal: 6,
                        backgroundColor: colors.soft,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Text style={{ fontSize: 11, fontWeight: '700', color: colors.ink }}>
                        {row.count}
                      </Text>
                    </View>
                  )}

                  {row.locked && (
                    <View
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 6,
                        backgroundColor: colors.soft,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Feather name="lock" size={13} color="#98A2B3" />
                    </View>
                  )}

                  {row.chevron && (
                    <Feather name="chevron-right" size={16} color={colors.ink} />
                  )}
                </View>
              </View>
            </Pressable>

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
        );
      })}
    </View>
  );
}

// ─── Confirm-by-tapping modal ─────────────────────────────────────────────────

function ConfirmModal({
  visible,
  title,
  body,
  confirmLabel,
  onConfirm,
  onCancel,
}: {
  visible: boolean;
  title: string;
  body: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.45)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 24,
        }}
        onPress={onCancel}
      >
        <Pressable
          onPress={() => {}}
          style={{
            backgroundColor: colors.white,
            borderRadius: 20,
            padding: 24,
            width: '100%',
            maxWidth: 360,
          }}
        >
          <Text
            style={{
              fontSize: 17,
              fontWeight: '700',
              color: colors.ink,
              marginBottom: 8,
              letterSpacing: -0.3,
            }}
          >
            {title}
          </Text>
          <Text style={{ fontSize: 14, color: colors.mute, lineHeight: 20, marginBottom: 24 }}>
            {body}
          </Text>

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Pressable
              onPress={onCancel}
              style={({ pressed }) => ({
                flex: 1,
                height: 48,
                borderRadius: 12,
                borderWidth: 1.5,
                borderColor: colors.line,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <Text style={{ fontSize: 15, fontWeight: '600', color: colors.mute }}>
                Cancel
              </Text>
            </Pressable>

            <Pressable
              onPress={onConfirm}
              style={({ pressed }) => ({
                flex: 1,
                height: 48,
                borderRadius: 12,
                backgroundColor: '#D92D20',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: pressed ? 0.85 : 1,
              })}
            >
              <Text style={{ fontSize: 15, fontWeight: '700', color: colors.white }}>
                {confirmLabel}
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export function AccountSecurityScreen({ onBack, onLogOut }: Props) {
  useAndroidBack(onBack);

  const topInset = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 48;
  const [deleteModal, setDeleteModal] = useState(false);
  const [view, setView] = useState<SubView>('main');
  const [sessions, setSessions] = useState<Session[]>(INITIAL_SESSIONS);
  const backToMain = useCallback(() => setView('main'), []);

  if (view === 'verify-phone') {
    return <VerifyPhoneFlow onBack={backToMain} onVerified={backToMain} />;
  }

  if (view === 'sessions') {
    return (
      <ActiveSessionsScreen
        sessions={sessions}
        onSignOut={(id) => setSessions((prev) => prev.filter((s) => s.id !== id))}
        onBack={backToMain}
      />
    );
  }

  if (view === 'attempts') {
    return <SignInAttemptsScreen onBack={backToMain} />;
  }

  const signingInRows: Row[] = [
    {
      id: 'change-password',
      icon: 'key',
      label: 'Change password',
      sublabel: 'Last changed 12 August',
      onPress: () => {},
    },
    {
      id: 'phone-verification',
      icon: 'phone',
      label: 'Phone verification',
      sublabel: 'Changed number? tap to verify',
      pill: { label: 'VERIFIED', bg: '#ECFDF3', color: '#027A48' },
      onPress: () => setView('verify-phone'),
    },
  ];

  const activityRows: Row[] = [
    {
      id: 'login-attempts',
      icon: 'shield',
      label: 'Login attempts',
      sublabel: '1 failed attempt this week',
      tone: 'warning',
      pill: { label: 'CHECK', bg: '#FFFAEB', color: '#B54708' },
      onPress: () => setView('attempts'),
    },
    {
      id: 'active-sessions',
      icon: 'smartphone',
      label: 'Active sessions',
      sublabel: `${sessions.length} device${sessions.length === 1 ? '' : 's'} signed in`,
      count: String(sessions.length),
      onPress: () => setView('sessions'),
    },
    {
      id: 'security-alerts',
      icon: 'shield',
      label: 'Security alerts',
      sublabel: 'Always on, cannot be muted',
      tone: 'muted',
      locked: true,
    },
  ];

  const destructiveRows: Row[] = [
    {
      id: 'logout',
      icon: 'log-out',
      label: 'Log out',
      sublabel: 'SMS alerts continue',
      tone: 'danger',
      chevron: true,
      onPress: onLogOut,
    },
    {
      id: 'delete-account',
      icon: 'lock',
      label: 'Delete account',
      sublabel: 'Handover records stay with the school',
      tone: 'danger',
      chevron: true,
      onPress: () => setDeleteModal(true),
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.canvas }}>
      <ExpoStatusBar style="dark" />

      {/* ── Nav bar ───────────────────────────────────────────────────── */}
      <View
        style={{
          paddingTop: topInset,
          backgroundColor: colors.canvas,
        }}
      >
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
              marginRight: 40, // offset to keep text truly centred vs back button
            }}
          >
            Account & security
          </Text>
        </View>
      </View>

      {/* ── Body ──────────────────────────────────────────────────────── */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Subtitle */}
        <Text
          style={{
            fontSize: 14,
            color: colors.mute,
            lineHeight: 20,
            marginBottom: 28,
          }}
        >
          Destructive actions sit at the bottom and each one is confirmed by tapping.
        </Text>

        {/* SIGNING IN */}
        <SectionLabel label="Signing in" />
        <SettingsCard rows={signingInRows} />

        {/* ACTIVITY */}
        <View style={{ marginTop: 24 }}>
          <SectionLabel label="Activity" />
          <SettingsCard rows={activityRows} />
        </View>

        {/* ACCOUNT (destructive) */}
        <View style={{ marginTop: 24 }}>
          <SectionLabel label="Account" />
          <SettingsCard rows={destructiveRows} />
        </View>

        {/* Info card */}
        <View
          style={{
            marginTop: 16,
            backgroundColor: '#FEF3F2',
            borderRadius: 14,
            padding: 16,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              color: '#D92D20',
              lineHeight: 21,
            }}
          >
            Deleting your account removes your handlers and preferences. Greenfield Academy keeps handover records as their safeguarding policy requires.
          </Text>
        </View>
      </ScrollView>

      {/* ── Delete account confirm modal ──────────────────────────────── */}
      <ConfirmModal
        visible={deleteModal}
        title="Delete account?"
        body="This permanently deletes your account and preferences. Greenfield Academy will retain handover records as their safeguarding obligation."
        confirmLabel="Delete"
        onConfirm={() => setDeleteModal(false)}
        onCancel={() => setDeleteModal(false)}
      />
    </View>
  );
}
