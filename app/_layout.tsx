import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { FamilyProvider } from '@/src/data/FamilyContext';
import '../src/global.css';

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

export default function RootLayout() {
  // Icon fonts otherwise load lazily on first render and can show up blank
  const [fontsLoaded, fontError] = useFonts({
    ...Feather.font,
    ...Ionicons.font,
    ...MaterialCommunityIcons.font,
  });

  if (!fontsLoaded && !fontError) return null;

  return (
    <FamilyProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="welcome" />
        <Stack.Screen name="invite" />
        <Stack.Screen name="login" />
        <Stack.Screen name="reset" />
        <Stack.Screen name="locked" />
        <Stack.Screen name="handlers" />
        <Stack.Screen name="pickup" />
        <Stack.Screen name="child-details" />
        <Stack.Screen name="todays-plan" />
        <Stack.Screen name="handover-record" />
      </Stack>
    </FamilyProvider>
  );
}

