import { useRouter } from 'expo-router';
import { MoreScreen } from '@/src/screens/MoreScreen';

export default function MoreTab() {
  const router = useRouter();
  return (
    <MoreScreen
      onOpenChild={(childId) => router.push({ pathname: '/child-details', params: { childId } })}
      onOpenHandler={(handlerId) =>
        router.push({ pathname: '/handlers', params: { initialHandlerId: handlerId } })
      }
      onSignOut={() => router.replace('/welcome')}
    />
  );
}
