import { useRouter } from 'expo-router';
import { LoginScreen } from '@/src/screens/LoginScreen';

export default function LoginRoute() {
  const router = useRouter();
  return (
    <LoginScreen
      onBack={() => router.back()}
      onForgot={() => router.push('/reset')}
      onSuccess={() => router.replace('/(tabs)')}
    />
  );
}
