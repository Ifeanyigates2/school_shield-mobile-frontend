import { Platform, Pressable, StatusBar, Text, View } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme';

export const SUBSCREEN_TOP_INSET =
  Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 48;

/** Back chevron + centred title, used by the More-tab sub-screens. */
export function SubscreenHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <View style={{ paddingTop: SUBSCREEN_TOP_INSET, backgroundColor: colors.canvas }}>
      <ExpoStatusBar style="dark" />
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
          numberOfLines={1}
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
          {title}
        </Text>
      </View>
    </View>
  );
}

/** Small uppercase status pill, e.g. VERIFIED, OK, FAILED. */
export function StatusPill({ label, bg, color }: { label: string; bg: string; color: string }) {
  return (
    <View style={{ backgroundColor: bg, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4 }}>
      <Text style={{ fontSize: 10, fontWeight: '700', color, letterSpacing: 0.4 }}>{label}</Text>
    </View>
  );
}
