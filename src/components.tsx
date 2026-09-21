import { ReactNode } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import { colors } from './theme';

export function Wordmark({ light = false }: { light?: boolean }) {
  return (
    <View style={styles.wordmark}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Text style={[styles.brand, { color: light ? colors.white : colors.ink }]}>SchoolShield</Text>
    </View>
  );
}

export function PrimaryButton({
  label,
  onPress,
  inverted = false,
  outline = false,
  enabled = true,
}: {
  label: string;
  onPress: () => void;
  inverted?: boolean;
  outline?: boolean;
  enabled?: boolean;
}) {
  const backgroundColor = inverted ? colors.white : outline ? colors.white : colors.navy;
  const color = inverted || outline ? colors.navy : colors.white;
  return (
    <Pressable
      onPress={onPress}
      disabled={!enabled}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor,
          borderWidth: outline ? 1 : 0,
          borderColor: colors.line,
          opacity: !enabled ? 0.45 : pressed ? 0.88 : 1,
        },
      ]}
    >
      <Text style={[styles.buttonLabel, { color }]}>{label}</Text>
    </Pressable>
  );
}

export function Field({
  label,
  value,
  onChangeText,
  light = false,
  password = false,
  trailing,
  keyboardType,
  placeholder,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  light?: boolean;
  password?: boolean;
  trailing?: ReactNode;
  keyboardType?: TextInputProps['keyboardType'];
  placeholder?: string;
}) {
  return (
    <View>
      <Text style={[styles.label, light && styles.labelLight]}>{label}</Text>
      <View style={[styles.inputWrap, light ? styles.inputLight : styles.inputDark]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={password}
          keyboardType={keyboardType}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder={placeholder}
          placeholderTextColor={light ? 'rgba(255,255,255,0.28)' : '#98A2B3'}
          style={[styles.input, { color: light ? colors.white : colors.ink }]}
        />
        {trailing}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wordmark: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logo: { width: 36, height: 36, borderRadius: 10 },
  brand: { fontSize: 20, fontWeight: '600', letterSpacing: -0.3 },
  button: {
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLabel: { fontSize: 16, fontWeight: '600' },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.ink,
    marginBottom: 8,
  },
  labelLight: { color: 'rgba(255,255,255,0.72)' },
  inputWrap: {
    minHeight: 54,
    borderRadius: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputDark: {
    backgroundColor: colors.white,
  },
  inputLight: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  input: { flex: 1, fontSize: 16, paddingVertical: 14 },
});
