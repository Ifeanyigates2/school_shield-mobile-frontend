import { useRouter, useLocalSearchParams } from 'expo-router';
import { PickupFlow } from '@/src/screens/PickupFlow';

export default function PickupRoute() {
  const router = useRouter();
  const params = useLocalSearchParams<{ childId?: string }>();

  return (
    <PickupFlow
      childId={params.childId || 'amara'}
      onBack={() => router.back()}
      onHandlers={() => router.push('/handlers')}
    />
  );
}
