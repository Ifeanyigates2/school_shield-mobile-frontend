import { useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
  Modal,
} from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme';
import { useAndroidBack } from '../useAndroidBack';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  onBack: () => void;
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

type RowVariant = 'normal' | 'locked' | 'badge' | 'danger';

interface Row {
  id: string;
  icon: React.ComponentProps<typeof Feather>['name'];
  label: string;
  sublabel: string;
  variant?: RowVariant;
  badge?: string;
  badgeColor?: string;
  onPress?: () => void;
}

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
        const isDanger = row.variant === 'danger';
        const isLocked = row.variant === 'locked';

        return (
          <View key={row.id}>
            <Pressable
              onPress={row.onPress}
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
                    backgroundColor: isDanger ? '#FEF2F2' : colors.soft,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Feather
                    name={row.icon}
                    size={17}
                    color={isDanger ? colors.danger : colors.navy}
                  />
                </View>

                {/* Text */}
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '600',
                      color: isDanger ? colors.danger : colors.ink,
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

                {/* Right: locked pill / number badge / chevron */}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                    flexShrink: 0,
                  }}
                >
                  {isLocked && (
                    <View
                      style={{
                        backgroundColor: '#F2F4F7',
                        borderRadius: 20,
                        paddingHorizontal: 9,
                        paddingVertical: 3,
                        borderWidth: 1,
                        borderColor: colors.line,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 10,
                          fontWeight: '700',
                          color: colors.mute,
                          letterSpacing: 0.4,
                        }}
                      >
                        LOCKED
                      </Text>
                    </View>
                  )}

                  {row.badge && (
                    <View
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 11,
                        backgroundColor: row.badgeColor ?? colors.navy,
                        alignItems: 'center',
                        justifyContent: 'center',
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
                  )}

                  <Feather name="chevron-right" size={16} color="#C0C8D4" />
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

// ─── Confirm-by-typing modal ──────────────────────────────────────────────────

function ConfirmModal({
  visible,
  title,
  body,
  confirmWord,
  confirmLabel,
  onConfirm,
  onCancel,
}: {
  visible: boolean;
  title: string;
  body: string;
  confirmWord: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const [typed, setTyped] = useState('');
  const ready = typed.trim().toLowerCase() === confirmWord.toLowerCase();

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
          <Text style={{ fontSize: 14, color: colors.mute, lineHeight: 20, marginBottom: 20 }}>
            {body}
          </Text>

          <Text style={{ fontSize: 12, fontWeight: '600', color: colors.mute, marginBottom: 8 }}>
            Type <Text style={{ color: colors.ink, fontWeight: '700' }}>"{confirmWord}"</Text> to confirm
          </Text>

          <TextInput
            value={typed}
            onChangeText={setTyped}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder={confirmWord}
            placeholderTextColor="#C0C8D4"
            style={{
              height: 48,
              borderRadius: 12,
              borderWidth: 1.5,
              borderColor: ready ? '#12B76A' : colors.line,
              paddingHorizontal: 14,
              fontSize: 15,
              color: colors.ink,
              marginBottom: 20,
            }}
          />

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
              onPress={() => { if (ready) { setTyped(''); onConfirm(); } }}
              style={({ pressed }) => ({
                flex: 1,
                height: 48,
                borderRadius: 12,
                backgroundColor: ready ? '#D92D20' : '#F2F4F7',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: pressed && ready ? 0.85 : 1,
              })}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: '700',
                  color: ready ? colors.white : '#98A2B3',
                }}
              >
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

export function AccountSecurityScreen({ onBack }: Props) {
  useAndroidBack(onBack);

  const topInset = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 48;
  const [logoutModal, setLogoutModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const signingInRows: Row[] = [
    {
      id: 'change-password',
      icon: 'key',
      label: 'Change password',
      sublabel: 'Last changed 3 weeks ago',
      onPress: () => {},
    },
    {
      id: 'phone-verification',
      icon: 'phone',
      label: 'Phone verification',
      sublabel: '+234 803 456 7890 · verified',
      onPress: () => {},
    },
    {
      id: 'active-sessions',
      icon: 'clock',
      label: 'Active sessions',
      sublabel: 'This phone, and a tablet in Lekki',
      variant: 'badge',
      badge: '2',
      badgeColor: colors.navy,
      onPress: () => {},
    },
  ];

  const securityRows: Row[] = [
    {
      id: 'security-alerts',
      icon: 'shield',
      label: 'Security alerts',
      sublabel: 'Always on, cannot be muted',
      variant: 'locked',
    },
    {
      id: 'login-attempts',
      icon: 'alert-triangle',
      label: 'Login attempts',
      sublabel: 'One failed attempt, Fri 4 Sep',
      onPress: () => {},
    },
  ];

  const destructiveRows: Row[] = [
    {
      id: 'logout',
      icon: 'log-out',
      label: 'Log out',
      sublabel: 'SMS alerts continue to Chidinma',
      variant: 'danger',
      onPress: () => setLogoutModal(true),
    },
    {
      id: 'delete-account',
      icon: 'trash-2',
      label: 'Delete account',
      sublabel: 'Handover records to Chidinma',
      variant: 'danger',
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
          Destructive actions sit at the bottom and each one is confirmed by typing.
        </Text>

        {/* SIGNING IN */}
        <SectionLabel label="Signing in" />
        <SettingsCard rows={signingInRows} />

        {/* SECURITY */}
        <View style={{ marginTop: 24 }}>
          <SectionLabel label="Security" />
          <SettingsCard rows={securityRows} />
        </View>

        {/* ACCOUNT (destructive) */}
        <View style={{ marginTop: 24 }}>
          <SectionLabel label="Account" />
          <SettingsCard rows={destructiveRows} />
        </View>

        {/* Info card */}
        <View
          style={{
            marginTop: 12,
            backgroundColor: '#EFF6FF',
            borderRadius: 14,
            padding: 16,
            borderWidth: 1,
            borderColor: '#DBEAFE',
          }}
        >
          <Text
            style={{
              fontSize: 14,
              color: '#1E40AF',
              lineHeight: 21,
            }}
          >
            Deleting your account removes your handlers and preferences. Greenfield Academy keeps handover records as their safeguarding policy requires.
          </Text>
        </View>
      </ScrollView>

      {/* ── Log out confirm modal ─────────────────────────────────────── */}
      <ConfirmModal
        visible={logoutModal}
        title="Log out?"
        body="SMS alerts will continue going to Chidinma while you are logged out. You can log back in any time."
        confirmWord="logout"
        confirmLabel="Log out"
        onConfirm={() => setLogoutModal(false)}
        onCancel={() => setLogoutModal(false)}
      />

      {/* ── Delete account confirm modal ──────────────────────────────── */}
      <ConfirmModal
        visible={deleteModal}
        title="Delete account?"
        body="This permanently deletes your account and preferences. Greenfield Academy will retain handover records as their safeguarding obligation."
        confirmWord="delete"
        confirmLabel="Delete"
        onConfirm={() => setDeleteModal(false)}
        onCancel={() => setDeleteModal(false)}
      />
    </View>
  );
}
