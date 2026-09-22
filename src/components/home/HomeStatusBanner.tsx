import { Pressable, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { OperationalState } from './HomeHeader';

export function HomeStatusBanner({
  operationalState,
  onActionPress,
}: {
  operationalState: OperationalState;
  onActionPress: () => void;
}) {
  if (operationalState === 'no_school') {
    return (
      <View className="bg-bannerBlue rounded-3xl p-4 border border-bannerBlueBorder mb-4">
        <View className="flex-row items-start gap-3">
          <View className="w-6 h-6 rounded-full bg-navy items-center justify-center mt-0.5">
            <Text className="text-white text-xs font-bold italic">i</Text>
          </View>
          <View className="flex-1">
            <Text className="text-base font-bold text-ink">No school today</Text>
            <Text className="text-xs text-slate-600 leading-5 mt-1">
              Next school day is Monday 7 September.{'\n'}Drop-off opens 7:00 AM at Main Gate.
            </Text>
          </View>
        </View>
        <Pressable
          className="bg-navy rounded-xl h-12 items-center justify-center mt-3.5"
          onPress={onActionPress}
        >
          <Text className="text-white text-sm font-semibold">Plan Monday's drop-off</Text>
        </Pressable>
      </View>
    );
  }

  if (operationalState === 'upcoming') {
    return (
      <View className="bg-bannerBlue rounded-3xl p-4 border border-bannerBlueBorder mb-4">
        <View className="flex-row items-start gap-3">
          <View className="w-6 h-6 rounded-full bg-navy items-center justify-center mt-0.5">
            <Text className="text-white text-xs font-bold italic">i</Text>
          </View>
          <View className="flex-1">
            <Text className="text-base font-bold text-ink">Drop-off opens at 6:45AM</Text>
            <Text className="text-xs text-slate-600 leading-5 mt-1">
              Both children are assigned. Codes are issued automatically at 6:40 AM
            </Text>
          </View>
        </View>
        <Pressable
          className="bg-navy rounded-xl h-12 items-center justify-center mt-3.5"
          onPress={onActionPress}
        >
          <Text className="text-white text-sm font-semibold">Manage Drop-off</Text>
        </Pressable>
      </View>
    );
  }

  if (operationalState === 'active') {
    return (
      <View className="bg-bannerGreen rounded-3xl p-4 border border-bannerGreenBorder mb-4">
        <View className="flex-row items-start gap-3">
          <View className="w-6 h-6 rounded-full bg-success items-center justify-center mt-0.5">
            <Feather name="check" size={14} color="#FFFFFF" />
          </View>
          <View className="flex-1">
            <Text className="text-base font-bold text-bannerGreenText">
              Drop-off is open until 8:30 AM
            </Text>
            <Text className="text-xs text-emerald-900 leading-5 mt-1">
              Amara's code is on this phone. David's sent to Chidinma by SMS.
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return null;
}
