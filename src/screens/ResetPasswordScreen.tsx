import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { Field, PrimaryButton } from '../components';
import { colors } from '../theme';
import { useAndroidBack } from '../useAndroidBack';

// TODO(ship): replace demo reset code 0000 with the SMS verification API.
const RESET_CODE = '0000';
const POLICY =
  'Password must include at least one capital letter, one number, and one special character.';

const meetsPolicy = (password: string) =>
  /[A-Z]/.test(password) && /\d/.test(password) && /[^A-Za-z0-9]/.test(password);

export function ResetPasswordScreen({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState(0);
  const [identifier, setIdentifier] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [contact, setContact] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const goBack = () => {
    setError(null);
    if (step > 0) setStep(step - 1);
    else onBack();
  };
  useAndroidBack(goBack);

  return (
    <View style={styles.root}>
      <ExpoStatusBar style="dark" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.nav}>
            <Pressable onPress={goBack} hitSlop={12} style={styles.backHit}>
              <Text style={styles.back}>‹</Text>
            </Pressable>
            <Text style={styles.navTitle}>Reset password</Text>
            <View style={{ width: 40 }} />
          </View>

          {step === 0 ? (
            <>
              <Text style={styles.h1}>Reset your password</Text>
              <Text style={styles.body}>
                Enter the phone number or email on your SchoolShield account. We'll send a 4-digit code.
              </Text>
              {error ? <Text style={styles.error}>{error}</Text> : null}
              <Field label="Phone number or email" value={identifier} onChangeText={setIdentifier} />
              <View style={styles.card}>
                <Text style={styles.kicker}>FOUR STEPS</Text>
                <Step n={1} label="Confirm your phone number or email" active />
                <Step n={2} label="Enter the 4-digit code we send" />
                <Step n={3} label="Choose a new password" />
                <Step n={4} label="Sign in with it" />
              </View>
              <PrimaryButton
                label="Send code"
                onPress={() => {
                  if (!identifier.trim()) {
                    setError('Enter the phone number or email on your account.');
                    return;
                  }
                  setError(null);
                  setStep(1);
                }}
              />
              <View style={{ height: 12 }} />
              <PrimaryButton outline label="Contact school instead" onPress={() => setContact(true)} />
            </>
          ) : null}

          {step === 1 ? (
            <>
              <Text style={styles.h1}>Enter your code</Text>
              <Text style={styles.body}>We sent a 4-digit code to {identifier}.</Text>
              {error ? <Text style={styles.error}>{error}</Text> : null}
              <OtpBoxes value={code} onChange={setCode} />
              <View style={styles.hintCard}>
                <Text style={styles.kickerNavy}>ON-SCREEN CODE</Text>
                <Text style={styles.demoCode}>{RESET_CODE}</Text>
                <Text style={styles.hint}>Demo reset code is 0000.</Text>
              </View>
              <PrimaryButton
                label="Continue"
                enabled={code.length === 4}
                onPress={() => {
                  if (code !== RESET_CODE) {
                    setError('That code does not match.');
                    return;
                  }
                  setError(null);
                  setStep(2);
                }}
              />
            </>
          ) : null}

          {step === 2 ? (
            <>
              <Text style={styles.h1}>Choose a new password</Text>
              <Text style={styles.body}>Then sign in with it on the next screen.</Text>
              {error ? <Text style={styles.error}>{error}</Text> : null}
              <Field label="New password" value={password} onChangeText={setPassword} password />
              <View style={{ height: 12, gap: 6 }}>
                <Check ok={/[A-Z]/.test(password)} label="One capital letter" />
                <Check ok={/\d/.test(password)} label="One number" />
                <Check ok={/[^A-Za-z0-9]/.test(password)} label="One special character" />
              </View>
              {password.length > 0 && !meetsPolicy(password) ? <Text style={styles.hint}>{POLICY}</Text> : null}
              <View style={{ height: 20 }} />
              <PrimaryButton
                label="Sign in with it"
                enabled={meetsPolicy(password)}
                onPress={onBack}
              />
            </>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={contact} transparent animationType="fade" onRequestClose={() => setContact(false)}>
        <Pressable style={styles.modalBg} onPress={() => setContact(false)}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Contact school</Text>
            <Text style={styles.body}>
              Ask the school admin desk to reset your SchoolShield password. They will confirm your identity and issue a new one.
            </Text>
            <PrimaryButton label="Close" onPress={() => setContact(false)} />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

function Step({ n, label, active = false }: { n: number; label: string; active?: boolean }) {
  return (
    <View style={styles.step}>
      <View style={[styles.stepNum, { backgroundColor: active ? colors.navy : colors.soft }]}>
        <Text style={{ color: active ? colors.white : colors.mute, fontWeight: '700', fontSize: 12 }}>{n}</Text>
      </View>
      <Text style={styles.stepLabel}>{label}</Text>
    </View>
  );
}

function Check({ ok, label }: { ok: boolean; label: string }) {
  return (
    <Text style={{ color: ok ? colors.success : colors.mute, fontSize: 13, marginTop: 6 }}>
      {ok ? '✓' : '○'}  {label}
    </Text>
  );
}

function OtpBoxes({ value, onChange }: { value: string; onChange: (next: string) => void }) {
  return (
    <View style={{ marginBottom: 16 }}>
      <TextInput
        value={value}
        onChangeText={(text) => onChange(text.replace(/\D/g, '').slice(0, 4))}
        keyboardType="number-pad"
        maxLength={4}
        autoFocus
        style={styles.hidden}
      />
      <View style={styles.otpRow} pointerEvents="none">
        {Array.from({ length: 4 }).map((_, i) => (
          <View key={i} style={styles.otpBox}>
            <Text style={styles.otpChar}>{value[i] ?? ''}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const top = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 54;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.canvas },
  scroll: { paddingHorizontal: 24, paddingTop: top, paddingBottom: 40 },
  nav: { flexDirection: 'row', alignItems: 'center', marginBottom: 28 },
  backHit: { width: 40, height: 40, justifyContent: 'center' },
  back: { fontSize: 32, color: colors.ink, marginTop: -6 },
  navTitle: { flex: 1, textAlign: 'center', fontWeight: '600', fontSize: 16, color: colors.ink },
  h1: { fontSize: 28, fontWeight: '700', color: colors.ink, letterSpacing: -0.4, marginBottom: 8 },
  body: { color: colors.mute, fontSize: 14, lineHeight: 21, marginBottom: 22 },
  error: { color: colors.danger, fontSize: 13, marginBottom: 12 },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 18,
    marginTop: 18,
    marginBottom: 28,
  },
  kicker: {
    color: colors.mute,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 14,
  },
  kickerNavy: { color: colors.navy, fontSize: 11, fontWeight: '700', letterSpacing: 1.1 },
  step: { flexDirection: 'row', alignItems: 'center', paddingVertical: 7 },
  stepNum: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepLabel: { color: colors.ink, fontSize: 14, flex: 1 },
  hintCard: {
    backgroundColor: '#FFF6E5',
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
  },
  demoCode: { fontSize: 28, fontWeight: '700', color: colors.ink, letterSpacing: 6, marginTop: 4 },
  hint: { color: colors.mute, fontSize: 12, marginTop: 4 },
  hidden: { position: 'absolute', opacity: 0, height: 56, width: '100%' },
  otpRow: { flexDirection: 'row', gap: 8 },
  otpBox: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpChar: { fontSize: 22, fontWeight: '600', color: colors.ink },
  modalBg: { flex: 1, backgroundColor: 'rgba(16,24,40,0.4)', justifyContent: 'center', padding: 24 },
  modalCard: { backgroundColor: colors.white, borderRadius: 20, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: colors.ink, marginBottom: 8 },
});
