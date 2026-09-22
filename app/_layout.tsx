import { Stack } from 'expo-router';
import '../src/global.css';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="welcome" />
      <Stack.Screen name="invite" />
      <Stack.Screen name="login" />
      <Stack.Screen name="reset" />
      <Stack.Screen name="handlers" />
      <Stack.Screen name="pickup" />
    </Stack>
  );
}
