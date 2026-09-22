import { Pressable, Text, View } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';

export function HomeQuickActions({
  onOpenHandlers,
  onOpenException,
  onOpenPlan,
}: {
  onOpenHandlers: () => void;
  onOpenException: () => void;
  onOpenPlan: () => void;
}) {
  return (
    <View className="mb-2">
      <Text className="text-base font-bold text-ink mb-3">Quick Actions</Text>
      <View className="flex-row gap-3">
        {/* Handlers Tile */}
        <Pressable
          className="flex-1 bg-actionGreen rounded-3xl py-4 items-center border border-actionGreenBorder"
          onPress={onOpenHandlers}
        >
          <View className="w-11 h-11 rounded-full bg-white items-center justify-center mb-2 shadow-xs">
            <Ionicons name="person-outline" size={20} color="#1B5E20" />
          </View>
          <Text className="text-xs font-bold text-ink">Handlers</Text>
        </Pressable>

        {/* Exception Tile */}
        <Pressable
          className="flex-1 bg-actionOrange rounded-3xl py-4 items-center border border-actionOrangeBorder"
          onPress={onOpenException}
        >
          <View className="w-11 h-11 rounded-full bg-white items-center justify-center mb-2 shadow-xs">
            <Feather name="clock" size={20} color="#E65100" />
          </View>
          <Text className="text-xs font-bold text-ink">Exception</Text>
        </Pressable>

        {/* Today's plan Tile */}
        <Pressable
          className="flex-1 bg-actionBlue rounded-3xl py-4 items-center border border-actionBlueBorder"
          onPress={onOpenPlan}
        >
          <View className="w-11 h-11 rounded-full bg-white items-center justify-center mb-2 shadow-xs">
            <Feather name="calendar" size={20} color="#0D47A1" />
          </View>
          <Text className="text-xs font-bold text-ink">Today's plan</Text>
        </Pressable>
      </View>
    </View>
  );
}
