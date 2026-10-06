import { useState } from 'react';
import { useRouter } from 'expo-router';
import { TooManyAttemptsScreen } from '@/src/screens/TooManyAttemptsScreen';

const LOCK_MINUTES = 15;

export default function LockedRoute() {
  const router = useRouter();
  const [unlockAt] = useState(() =>
    new Date(Date.now() + LOCK_MINUTES * 60_000).toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
    }),
  );
  return (
    <TooManyAttemptsScreen
      unlockAt={unlockAt}
      onReset={() => router.replace('/reset')}
      onBack={() => router.back()}
    />
  );
}
