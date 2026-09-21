import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { Field, PrimaryButton, Wordmark } from '../components';
import { colors } from '../theme';

export function LoginScreen({ onForgot }: { onForgot: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password');
  const [hidden, setHidden] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => email.trim().length > 0 && password.length > 0, [email, password]);

  return (
    <View style={styles.root}>
      <ExpoStatusBar style="light" />
      <View style={[styles.blob, styles.blobRight]} />
      <View style={[styles.blob, styles.blobBottom]} />
      <View style={[styles.blob, styles.blobMid]} />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.inner}>
        <Wordmark light />
        <Text style={styles.title}>Welcome back, Zara</Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Field
          light
          label="Phone number or email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <View style={{ height: 18 }} />
        <Field
          light
          label="Password"
          value={password}
          onChangeText={setPassword}
          password={hidden}
          trailing={
            <Pressable onPress={() => setHidden((v) => !v)} hitSlop={8}>
              <Text style={styles.show}>{hidden ? 'Show' : 'Hide'}</Text>
            </Pressable>
          }
        />

        <Pressable onPress={onForgot} style={styles.forgotWrap} hitSlop={12}>
          <Text style={styles.forgot}>Forgot password?</Text>
        </Pressable>

        <View style={{ flex: 1 }} />
        <PrimaryButton
          inverted
          label="Log in"
          onPress={() => {
            if (!canSubmit) {
              setError('Enter your phone number or email, and password.');
              return;
            }
            setError(null);
          }}
        />
      </KeyboardAvoidingView>
    </View>
  );
}

const top = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) + 12 : 56;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.navyDeep, overflow: 'hidden' },
  inner: { flex: 1, paddingHorizontal: 24, paddingTop: top, paddingBottom: 28 },
  blob: { position: 'absolute', borderRadius: 999 },
  blobRight: {
    width: 520,
    height: 520,
    backgroundColor: colors.navyBlob,
    right: -160,
    top: 90,
  },
  blobBottom: {
    width: 560,
    height: 560,
    backgroundColor: '#06101C',
    left: -220,
    bottom: -220,
    opacity: 0.95,
  },
  blobMid: {
    width: 340,
    height: 340,
    backgroundColor: colors.navyBlobSoft,
    right: -80,
    bottom: 120,
    opacity: 0.45,
  },
  title: {
    color: colors.white,
    fontSize: 34,
    fontWeight: '600',
    letterSpacing: -0.6,
    marginTop: 36,
    marginBottom: 28,
  },
  error: { color: '#F97066', marginBottom: 12, fontSize: 13 },
  show: { color: 'rgba(255,255,255,0.78)', fontWeight: '600', fontSize: 14 },
  forgotWrap: { alignSelf: 'flex-end', marginTop: 14 },
  forgot: { color: colors.white, fontWeight: '600', fontSize: 14 },
});
