import { Pressable, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { FigmaAvatar } from '../../components';

export function HomeCompletedView({
  onManagePickup,
  onGoHome,
  onViewActivity,
  topInset,
}: {
  onManagePickup: () => void;
  onGoHome: () => void;
  onViewActivity: () => void;
  topInset: number;
}) {
  return (
    <View
      className="flex-1 bg-navyDeep px-6 justify-between pb-8"
      style={{ paddingTop: topInset + 20 }}
    >
      <View className="items-center">
        <View className="w-16 h-16 rounded-full bg-emerald-950 items-center justify-center mb-6 border border-emerald-500/30">
          <View className="w-10 h-10 rounded-full bg-success items-center justify-center">
            <Feather name="check" size={22} color="#FFFFFF" />
          </View>
        </View>

        <Text className="text-white text-2xl font-bold tracking-tight">Drop-off Completed</Text>
        <Text className="text-slate-400 text-sm mt-2 text-center">
          Both Amara and David are in school.
        </Text>

        {/* Attendance Status Card */}
        <View className="w-full bg-slate-800/60 rounded-3xl p-5 mt-8 border border-slate-700/60">
          <View className="flex-row justify-between items-center py-3 border-b border-slate-700/40">
            <View className="flex-row items-center gap-3">
              <FigmaAvatar name="Amara Okafor" size={36} />
              <Text className="text-white font-semibold text-base">Amara</Text>
            </View>
            <Text className="text-slate-300 font-medium text-sm">7:48 AM | Mrs Sam</Text>
          </View>

          <View className="flex-row justify-between items-center py-3">
            <View className="flex-row items-center gap-3">
              <FigmaAvatar name="David Okafor" size={36} />
              <Text className="text-white font-semibold text-base">David</Text>
            </View>
            <Text className="text-slate-300 font-medium text-sm">7:52 AM | Mrs Sam</Text>
          </View>

          <Pressable
            className="mt-4 pt-3 border-t border-slate-700/40 items-center"
            onPress={onViewActivity}
          >
            <Text className="text-sky-400 font-bold text-sm">View Activity</Text>
          </Pressable>
        </View>
      </View>

      <View className="w-full gap-3">
        <Pressable
          className="w-full bg-white h-14 rounded-2xl items-center justify-center shadow-lg active:opacity-90"
          onPress={onManagePickup}
        >
          <Text className="text-navy font-bold text-base">Manage Pickup</Text>
        </Pressable>

        <Pressable
          className="w-full h-12 rounded-2xl items-center justify-center"
          onPress={onGoHome}
        >
          <Text className="text-slate-300 font-semibold text-sm">Go to Home</Text>
        </Pressable>
      </View>
    </View>
  );
}
