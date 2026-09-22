import { Pressable, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { FigmaAvatar } from '../../components';

export type OperationalState = 'no_school' | 'upcoming' | 'active' | 'completed';

export function HomeHeader({
  operationalState,
  onSelectState,
  onPressNotifications,
  topInset,
}: {
  operationalState: OperationalState;
  onSelectState: (state: OperationalState) => void;
  onPressNotifications: () => void;
  topInset: number;
}) {
  const states: { key: OperationalState; label: string }[] = [
    { key: 'no_school', label: 'No School' },
    { key: 'upcoming', label: 'At 6:45' },
    { key: 'active', label: 'Codes Live' },
    { key: 'completed', label: 'Completed' },
  ];

  return (
    <View
      className="bg-navy px-5 pb-5 rounded-b-[32px]"
      style={{ paddingTop: topInset + 10 }}
    >
      <View className="flex-row justify-between items-center">
        {/* Profile & School Info */}
        <View className="flex-row items-center gap-3">
          <FigmaAvatar name="Zara" size={46} />
          <View className="justify-center">
            <Text className="text-slate-400 text-xs font-medium">Good morning, Zara</Text>
            <Text className="text-white text-xl font-bold tracking-tight mt-0.5">
              Greenfield Academy
            </Text>
          </View>
        </View>

        {/* Notification Bell Button */}
        <Pressable
          className="w-11 h-11 rounded-full bg-white items-center justify-center relative shadow-sm"
          onPress={onPressNotifications}
          hitSlop={8}
        >
          <Feather name="bell" size={20} color="#101828" />
          <View className="absolute -top-1 -right-1 bg-red-500 w-5 h-5 rounded-full items-center justify-center border-2 border-white">
            <Text className="text-white text-[10px] font-extrabold">2</Text>
          </View>
        </Pressable>
      </View>

      {/* State Preview Switcher */}
      <View className="flex-row bg-white/10 rounded-2xl p-1 mt-4">
        {states.map(({ key, label }) => {
          const isActive = operationalState === key;
          return (
            <Pressable
              key={key}
              className={`flex-1 py-1.5 rounded-xl items-center justify-center ${
                isActive ? 'bg-white' : ''
              }`}
              onPress={() => onSelectState(key)}
            >
              <Text
                className={`text-[11px] font-semibold ${
                  isActive ? 'text-navy font-bold' : 'text-slate-300'
                }`}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
