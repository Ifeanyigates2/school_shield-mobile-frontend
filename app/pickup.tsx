import { useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { PickupFlow } from '@/src/screens/PickupFlow';

export default function PickupRoute() {
  const router = useRouter();
  const params = useLocalSearchParams<{ childId?: string; handlerId?: string }>();
  const [handlerId, setHandlerId] = useState(params.handlerId || 'chidinma');

  return (
    <PickupFlow
      childId={params.childId || 'amara'}
      handlerId={handlerId}
      onSelectHandler={setHandlerId}
      onBack={() => router.back()}
      onHandlers={() => router.push('/handlers')}
    />
  );
}
