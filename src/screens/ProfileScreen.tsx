import { ReactNode, useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme';
import { FigmaAvatar, PrimaryButton } from '../components';
import { useAndroidBack } from '../useAndroidBack';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  onBack: () => void;
}

const RELATIONSHIPS = ['Parent', 'Guardian', 'Grandparent', 'Other relative'];

// ─── Form field ───────────────────────────────────────────────────────────────

function ProfileField({
  label,
  value,
  onChangeText,
  helper,
  disabled = false,
  trailing,
  keyboardType,
  autoCapitalize = 'words',
}: {
  label: string;
  value: string;
  onChangeText?: (text: string) => void;
  helper: string;
  disabled?: boolean;
  trailing?: ReactNode;
  keyboardType?: TextInputProps['keyboardType'];
  autoCapitalize?: TextInputProps['autoCapitalize'];
}) {
  return (
    <View style={{ marginBottom: 20 }}>
      <Text
        style={{
          fontSize: 14,
          fontWeight: '600',
          color: colors.ink,
          marginBottom: 8,
        }}
      >
        {label}
      </Text>
      <View
        style={{
          minHeight: 50,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: colors.line,
          backgroundColor: disabled ? colors.soft : colors.white,
          paddingHorizontal: 14,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          editable={!disabled && !!onChangeText}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          style={{
            flex: 1,
            fontSize: 15,
            paddingVertical: 13,
            color: disabled ? colors.mute : colors.ink,
          }}
        />
        {trailing}
      </View>
      <Text style={{ fontSize: 12, color: colors.mute, marginTop: 6 }}>
        {helper}
      </Text>
    </View>
  );
}

// ─── Relationship picker ──────────────────────────────────────────────────────

function RelationshipSheet({
  visible,
  value,
  onSelect,
  onClose,
}: {
  visible: boolean;
  value: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.45)',
          justifyContent: 'flex-end',
        }}
        onPress={onClose}
      >
        <Pressable
          onPress={() => {}}
          style={{
            backgroundColor: colors.white,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingHorizontal: 16,
            paddingTop: 20,
            paddingBottom: 32,
          }}
        >
          <Text
            style={{
              fontSize: 17,
              fontWeight: '700',
              color: colors.ink,
              letterSpacing: -0.3,
              marginBottom: 4,
              paddingHorizontal: 4,
            }}
          >
            Relationship
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: colors.mute,
              marginBottom: 16,
              paddingHorizontal: 4,
            }}
          >
            How you are related to Amara and David
          </Text>

          {RELATIONSHIPS.map((option) => {
            const selected = option === value;
            return (
              <Pressable
                key={option}
                onPress={() => onSelect(option)}
                style={({ pressed }) => ({
                  borderRadius: 12,
                  backgroundColor: pressed ? 'rgba(11,31,61,0.04)' : colors.white,
                })}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 4,
                    paddingVertical: 14,
                  }}
                >
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 15,
                      fontWeight: selected ? '700' : '500',
                      color: colors.ink,
                    }}
                  >
                    {option}
                  </Text>
                  {selected && <Feather name="check" size={18} color={colors.navy} />}
                </View>
              </Pressable>
            );
          })}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export function ProfileScreen({ onBack }: Props) {
  useAndroidBack(onBack);

  const topInset = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 48;
  const [fullName, setFullName] = useState('Zara Okafor');
  const [relationship, setRelationship] = useState('Parent');
  const [email, setEmail] = useState('zara.okafor@gmail.com');
  const [relationshipSheet, setRelationshipSheet] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: colors.canvas }}>
      <ExpoStatusBar style="dark" />

      {/* ── Nav bar ───────────────────────────────────────────────────── */}
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
              marginRight: 40, // offset to keep text truly centred vs back button
            }}
          >
            Profile
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
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={{
            fontSize: 14,
            color: colors.mute,
            lineHeight: 20,
            marginBottom: 28,
          }}
        >
          Gate staff see your name and photo when you collect.
        </Text>

        {/* Photo */}
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <FigmaAvatar name="Zara Okafor" size={140} />
          <Pressable
            onPress={() => {}}
            style={({ pressed }) => ({
              marginTop: 14,
              backgroundColor: '#E8EEF6',
              borderRadius: 8,
              paddingHorizontal: 14,
              paddingVertical: 8,
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Text style={{ fontSize: 12, fontWeight: '600', color: colors.navy }}>
              Change image
            </Text>
          </Pressable>
          <Text style={{ fontSize: 12, color: colors.mute, marginTop: 8 }}>
            can be replaced, never removed
          </Text>
        </View>

        {/* Details */}
        <ProfileField
          label="Full name"
          value={fullName}
          onChangeText={setFullName}
          helper="As it appears on your ID"
        />

        <ProfileField
          label="Relationship"
          value={relationship}
          helper="To Amara and David"
          trailing={
            <Pressable
              onPress={() => setRelationshipSheet(true)}
              hitSlop={8}
              style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
            >
              <Text style={{ fontSize: 13, fontWeight: '600', color: colors.navy }}>
                Change
              </Text>
            </Pressable>
          }
        />

        <ProfileField
          label="Email"
          value={email}
          onChangeText={setEmail}
          helper="For records and receipts"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <ProfileField
          label="Phone"
          value="+234 803 456 7890"
          helper="Change it in Account & security"
          disabled
        />

        <PrimaryButton label="Save changes" onPress={onBack} style={{ marginTop: 12 }} />
      </ScrollView>

      <RelationshipSheet
        visible={relationshipSheet}
        value={relationship}
        onSelect={(value) => {
          setRelationship(value);
          setRelationshipSheet(false);
        }}
        onClose={() => setRelationshipSheet(false)}
      />
    </View>
  );
}
