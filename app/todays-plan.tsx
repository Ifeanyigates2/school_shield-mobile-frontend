import { useRouter, useLocalSearchParams } from 'expo-router';
import { TodaysPlanScreen } from '@/src/screens/TodaysPlanScreen';

export default function TodaysPlanRoute() {
  const router = useRouter();
  const params = useLocalSearchParams<{ childId?: string }>();

  return (
    <TodaysPlanScreen
      childId={params.childId || 'amara'}
      onBack={() => router.back()}
      onOpenDropoff={() =>
        router.push({
          pathname: '/pickup',
          params: { childId: params.childId || 'amara', job: 'dropoff' },
        })
      }
      onOpenPickup={() =>
        router.push({
          pathname: '/pickup',
          params: { childId: params.childId || 'amara' },
        })
      }
    />
  );
}
