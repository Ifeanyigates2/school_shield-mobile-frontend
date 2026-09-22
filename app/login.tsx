import { useRouter } from 'expo-router';
import { LoginScreen } from '@/src/screens/LoginScreen';

export default function LoginRoute() {
  const router = useRouter();
  return (
    <LoginScreen
      onForgot={() => router.push('/reset')}
    />
  );
}
