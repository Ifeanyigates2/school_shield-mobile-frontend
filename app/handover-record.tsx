import { useRouter, useLocalSearchParams } from 'expo-router';
import { HandoverRecordScreen } from '@/src/screens/HandoverRecordScreen';

export default function HandoverRecordRoute() {
  const router = useRouter();
  const params = useLocalSearchParams<{ activityId?: string }>();

  return (
    <HandoverRecordScreen
      activityId={params.activityId}
      onBack={() => router.back()}
    />
  );
}
