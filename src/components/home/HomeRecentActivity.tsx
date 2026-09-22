import { Pressable, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { OperationalState } from './HomeHeader';

export function HomeRecentActivity({
  operationalState,
  onSeeAll,
}: {
  operationalState: OperationalState;
  onSeeAll: () => void;
}) {
  return (
    <View className="mt-4">
      <View className="flex-row justify-between items-center mb-2.5">
        <Text className="text-[11px] font-extrabold text-mute tracking-widest">
          RECENT ACTIVITY
        </Text>
        <Pressable onPress={onSeeAll}>
          <Text className="text-xs font-bold text-navy">See all</Text>
        </Pressable>
      </View>

      {operationalState === 'active' ? (
        /* Dynamic Activity Items for Active Codes State (Figma iPhone 19/27) */
        <View className="bg-white rounded-3xl p-3 border border-line gap-2">
          <View className="flex-row items-center justify-between p-2 rounded-2xl bg-emerald-50/50">
            <View className="flex-row items-center gap-3 flex-1">
              <View className="w-9 h-9 rounded-xl bg-emerald-100 items-center justify-center">
                <Feather name="file-text" size={16} color="#027A48" />
              </View>
              <View className="flex-1">
                <Text className="text-xs font-bold text-ink">Code issued for Amara</Text>
                <Text className="text-[11px] text-mute mt-0.5">Drop-off · expires 8:30 AM</Text>
              </View>
            </View>
            <Text className="text-[11px] font-semibold text-mute">6:45 AM</Text>
          </View>

          <View className="flex-row items-center justify-between p-2 rounded-2xl bg-sky-50/50">
            <View className="flex-row items-center gap-3 flex-1">
              <View className="w-9 h-9 rounded-xl bg-sky-100 items-center justify-center">
                <Feather name="message-square" size={16} color="#026AA2" />
              </View>
              <View className="flex-1">
                <Text className="text-xs font-bold text-ink">Code sent to Chidinma</Text>
                <Text className="text-[11px] text-mute mt-0.5">SMS · +234 805 221 4478</Text>
              </View>
            </View>
            <Text className="text-[11px] font-semibold text-mute">6:45 AM</Text>
          </View>
        </View>
      ) : (
        /* Quiet State Activity Card (Figma iPhone 13) */
        <View className="bg-white rounded-3xl p-5 border border-line">
          <Text className="text-sm font-bold text-ink">Nothing since Friday</Text>
          <Text className="text-xs text-mute mt-1 leading-5">
            Friday's pickups are in Activity if you need them.
          </Text>
        </View>
      )}
    </View>
  );
}
