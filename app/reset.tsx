import { useRouter } from 'expo-router';
import { ResetPasswordScreen } from '@/src/screens/ResetPasswordScreen';

export default function ResetRoute() {
  const router = useRouter();
  return (
    <ResetPasswordScreen
      onBack={() => router.back()}
    />
  );
}
