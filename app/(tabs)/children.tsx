import { useRouter, useLocalSearchParams } from 'expo-router';
import { ChildrenScreen } from '@/src/screens/ChildrenScreen';

export default function ChildrenTab() {
  const router = useRouter();
  const params = useLocalSearchParams<{ initialChildId?: string }>();

  return (
    <ChildrenScreen
      initialChildId={params.initialChildId}
      onOpenHandlers={() => router.push('/handlers')}
      onOpenPickup={(childId) => {
        router.push({ pathname: '/pickup', params: { childId } });
      }}
      onSelectChild={(childId) => {
        router.push({ pathname: '/child-details', params: { childId } });
      }}
    />
  );
}
