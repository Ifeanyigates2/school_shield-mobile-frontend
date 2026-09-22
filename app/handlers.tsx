import { useRouter, useLocalSearchParams } from 'expo-router';
import { HandlersFlow } from '@/src/screens/HandlersFlow';

export default function HandlersRoute() {
  const router = useRouter();
  const params = useLocalSearchParams<{ initialHandlerId?: string }>();

  return (
    <HandlersFlow
      initialHandlerId={params.initialHandlerId || 'chidinma'}
      onBack={() => router.back()}
      onOpenPickup={() => router.push('/pickup')}
    />
  );
}
