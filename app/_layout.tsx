import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
import { Stack } from 'expo-router';
import { FamilyProvider } from '@/src/data/FamilyContext';
import '../src/global.css';

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

export default function RootLayout() {
  return (
    <FamilyProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="welcome" />
        <Stack.Screen name="invite" />
        <Stack.Screen name="login" />
        <Stack.Screen name="reset" />
        <Stack.Screen name="handlers" />
        <Stack.Screen name="pickup" />
        <Stack.Screen name="child-details" />
        <Stack.Screen name="todays-plan" />
      </Stack>
    </FamilyProvider>
  );
}

