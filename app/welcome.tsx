import { useRouter } from 'expo-router';
import { WelcomeScreen } from '@/src/screens/WelcomeScreen';

export default function WelcomeRoute() {
  const router = useRouter();
  return (
    <WelcomeScreen
      onContinue={() => router.push('/invite')}
      onHasAccount={() => router.push('/login')}
    />
  );
}
