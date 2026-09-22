import { Pressable, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { FigmaAvatar } from '../../components';
import { CHILDREN, Child } from '../../data/family';
import { OperationalState } from './HomeHeader';

export function HomeChildrenSection({
  operationalState,
  onShowCode,
  onSelectChild,
  onViewPlan,
}: {
  operationalState: OperationalState;
  onShowCode: (child: Child) => void;
  onSelectChild: (childId: string) => void;
  onViewPlan: (childId: string) => void;
}) {
  return (
    <View className="mb-4">
      {operationalState === 'active' ? (
        /* EXPANDED CARDS FOR CODES LIVE (IPHONE 19 / 27) */
        <View className="gap-3">
          {CHILDREN.map((child) => {
            const isAmara = child.id === 'amara';
            const pickingPerson = isAmara ? 'You' : 'Chidinma';

            return (
              <View
                key={child.id}
                className="bg-white rounded-[24px] p-4 border border-line shadow-sm"
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3 flex-1">
                    <FigmaAvatar name={child.name} size={48} showStatusDot />
                    <View className="flex-1">
                      <Text className="text-base font-bold text-ink">{child.name}</Text>
                      <Text className="text-xs text-mute mt-0.5">
                        {child.klass} · {child.gate ?? 'Main Gate'}
                      </Text>
                    </View>
                  </View>
                  {/* Chevron Action Pill */}
                  <Pressable
                    className="w-8 h-8 rounded-xl bg-slate-50 items-center justify-center border border-slate-200"
                    onPress={() => onSelectChild(child.id)}
                  >
                    <Feather name="chevron-right" size={18} color="#667085" />
                  </Pressable>
                </View>

                <View className="flex-row justify-between items-end my-3 pt-1">
                  <View>
                    <Text className="text-xs text-mute font-medium">Picking up</Text>
                    <Text className="text-base font-bold text-ink mt-0.5">{pickingPerson}</Text>
                  </View>
                  <Pressable onPress={() => onViewPlan(child.id)}>
                    <Text className="text-xs font-bold text-navy underline">
                      View Today's plan
                    </Text>
                  </Pressable>
                </View>

                <Pressable
                  className="bg-navy h-12 rounded-xl items-center justify-center active:opacity-90"
                  onPress={() => onShowCode(child)}
                >
                  <Text className="text-white text-sm font-semibold">Show Code</Text>
                </Pressable>
              </View>
            );
          })}

          {/* Carousel Page Indicator (as seen in iPhone 19 / 27) */}
          <View className="flex-row items-center justify-center gap-2 mt-1 mb-1">
            <View className="w-2 h-2 rounded-full bg-navy" />
            <View className="w-2 h-2 rounded-full bg-slate-300" />
          </View>
        </View>
      ) : (
        /* COMPACT CARDS (IPHONE 13 BEFORE DROP-OFF) */
        <View className="gap-3">
          {CHILDREN.map((child) => {
            const isAmara = child.id === 'amara';
            const dropPerson = isAmara ? 'You' : 'Chidinma';
            const badgeLabel = operationalState === 'no_school' ? 'NO SCHOOL' : 'AT HOME';

            return (
              <Pressable
                key={child.id}
                className="flex-row items-center bg-white rounded-3xl p-3.5 border border-line shadow-sm"
                onPress={() => onSelectChild(child.id)}
              >
                <FigmaAvatar name={child.name} size={46} />
                <View className="flex-1 ml-3">
                  <Text className="text-base font-bold text-ink">{child.name}</Text>
                  <Text className="text-xs text-mute mt-0.5">
                    {child.klass} · {child.gate ?? 'Main Gate'}
                  </Text>
                  {operationalState === 'upcoming' && (
                    <Text className="text-xs text-ink mt-1">
                      Dropping off: <Text className="font-bold">{dropPerson}</Text>
                    </Text>
                  )}
                </View>
                <View className="bg-slate-100 px-2.5 py-1 rounded-xl mr-2">
                  <Text className="text-[11px] font-bold text-slate-600 tracking-wider">
                    {badgeLabel}
                  </Text>
                </View>
                <Feather name="chevron-right" size={18} color="#98A2B3" />
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}
