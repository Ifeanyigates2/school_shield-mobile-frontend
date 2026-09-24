import { useRouter } from 'expo-router';
import { ActivityScreen } from '@/src/screens/ActivityScreen';

export default function ActivityTab() {
  const router = useRouter();

  return (
    <ActivityScreen
      onSelectActivity={(activity) => {
        router.push({
          pathname: '/handover-record',
          params: { activityId: activity.id },
        });
      }}
    />
  );
}
