import { useRouter, useLocalSearchParams } from 'expo-router';
import { ChildDetailsScreen } from '@/src/screens/ChildDetailsScreen';

export default function ChildDetailsRoute() {
  const router = useRouter();
  const params = useLocalSearchParams<{ childId?: string }>();

  return (
    <ChildDetailsScreen
      initialChildId={params.childId || 'amara'}
      onBack={() => router.back()}
      onOpenPickup={(childId) =>
        router.push({ pathname: '/pickup', params: { childId } })
      }
      onOpenDropoff={(childId) =>
        router.push({ pathname: '/pickup', params: { childId, job: 'dropoff' } })
      }
      onOpenHandlers={() => router.push('/handlers')}
      onViewPlan={(childId) =>
        router.push({ pathname: '/todays-plan', params: { childId } })
      }
      onViewActivity={() => router.push('/(tabs)/activity')}
    />
  );
}
