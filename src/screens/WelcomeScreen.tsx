import { Image, Platform, StatusBar, StyleSheet, Text, View } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { PrimaryButton } from '../components';
import { colors } from '../theme';

export function WelcomeScreen({
  onContinue,
  onHasAccount,
}: {
  onContinue: () => void;
  onHasAccount: () => void;
}) {
  return (
    <View style={styles.root}>
      <ExpoStatusBar style="light" />
      <View style={[styles.blob, styles.blobRight]} />
      <View style={[styles.blob, styles.blobBottom]} />
      <View style={styles.inner}>
        <View style={styles.hero}>
          <Image source={require('../../assets/logo.png')} style={styles.logo} />
          <Text style={styles.brand}>SchoolShield</Text>
        </View>
        <View style={{ flex: 1 }} />
        <Text style={styles.title}>
          Know they're safe.{'\n'}Know who's picking{'\n'}them up.
        </Text>
        <Text style={styles.body}>
          SchoolShield helps you manage your child's school drop-off and pickup with verified authorizations and real-time handover updates.
        </Text>
        <PrimaryButton inverted label="Continue" onPress={onContinue} />
        <View style={{ height: 12 }} />
        <PrimaryButton ghost label="I already have an account" onPress={onHasAccount} />
      </View>
    </View>
  );
}

const top = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) + 16 : 56;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.navyDeep, overflow: 'hidden' },
  inner: { flex: 1, paddingHorizontal: 24, paddingTop: top, paddingBottom: 28 },
  blob: { position: 'absolute', borderRadius: 999 },
  blobRight: {
    width: 480,
    height: 480,
    backgroundColor: colors.navyBlob,
    right: -140,
    top: 40,
  },
  blobBottom: {
    width: 520,
    height: 520,
    backgroundColor: '#081525',
    left: -180,
    bottom: 80,
    opacity: 0.9,
  },
  hero: { alignItems: 'center', marginTop: 36 },
  logo: { width: 88, height: 88, borderRadius: 22 },
  brand: { color: colors.white, fontSize: 18, fontWeight: '600', marginTop: 12 },
  title: {
    color: colors.white,
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.6,
    lineHeight: 38,
    marginBottom: 12,
  },
  body: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 28,
  },
});
