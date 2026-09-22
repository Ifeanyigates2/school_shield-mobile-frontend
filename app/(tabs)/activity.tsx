import {
  Platform,
  Pressable,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '@/src/theme';

export default function ActivityTab() {
  const router = useRouter();
  const topInset = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 48;

  return (
    <View className="flex-1 items-center justify-center px-8 bg-canvas" style={{ paddingTop: topInset }}>
      <ExpoStatusBar style="light" />
      <Feather name="calendar" size={48} color={colors.navy} />
      <Text className="text-2xl font-bold text-ink mt-4 mb-2">Activity & History</Text>
      <Text className="text-sm text-mute text-center leading-6 mb-6">
        Past pickup logs, gate check-in confirmations, and handler audits will be listed here.
      </Text>
      <Pressable
        className="bg-navy py-3 px-6 rounded-2xl"
        onPress={() => router.push('/(tabs)')}
      >
        <Text className="text-white text-sm font-semibold">Back to Home</Text>
      </Pressable>
    </View>
  );
}
