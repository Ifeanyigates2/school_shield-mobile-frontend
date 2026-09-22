import { useRouter } from 'expo-router';
import { InviteScreen } from '@/src/screens/InviteScreen';

export default function InviteRoute() {
  const router = useRouter();
  return (
    <InviteScreen
      onBack={() => router.back()}
      onDone={() => router.replace('/(tabs)')}
    />
  );
}
