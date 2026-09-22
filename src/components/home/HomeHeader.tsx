import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { FigmaAvatar } from '../../components';

export type OperationalState = 'no_school' | 'upcoming' | 'active' | 'completed';

export interface HomeHeaderProps {
  topInset: number;
  operationalState: OperationalState;
  onSelectOperationalState: (state: OperationalState) => void;
  onOpenNotifications: () => void;
}

export function HomeHeader({
  topInset,
  operationalState,
  onSelectOperationalState,
  onOpenNotifications,
}: HomeHeaderProps) {
  return (
    <View
      className="bg-navy p-8 py-12"
      style={{ paddingTop: topInset + 20 }}
    >
      <View className="flex-row justify-between items-center">
        {/* Profile & School Info */}
        <View className="flex-row items-center gap-3">
          <FigmaAvatar name="Zara" size={50} />
          <View className="justify-center">
            <Text className="text-primaryLight text-sm">Good morning, Zara</Text>
            <Text className="text-white text-2xl font-bold tracking-tight">Greenfield Academy</Text>
          </View>
        </View>

        {/* Notification Bell Button */}
        <Pressable
          className="w-12 h-12 rounded-xl bg-white items-center justify-center relative shadow-sm"
          onPress={onOpenNotifications}
          hitSlop={8}
        >
          <Feather name="bell" size={20} color="#101828" />
          <View className="absolute top-1 right-1 bg-[#B93A3A] w-5 h-5 rounded-full items-center justify-center border-2 border-white">
            <Text className="text-white text-[10px] font-extrabold">2</Text>
          </View>
        </Pressable>
      </View>

      {/* State Preview Switcher */}
      {/* <View className="flex-row bg-white/10 rounded-2xl p-1 mt-4">
        {(['no_school', 'upcoming', 'active', 'completed'] as OperationalState[]).map((stateKey) => {
          const isActive = operationalState === stateKey;
          const label =
            stateKey === 'no_school'
              ? 'No School'
              : stateKey === 'upcoming'
              ? 'At 6:45'
              : stateKey === 'active'
              ? 'Codes Live'
              : 'Completed';
          return (
            <Pressable
              key={stateKey}
              className={`flex-1 py-1.5 rounded-xl items-center justify-center ${
                isActive ? 'bg-white' : ''
              }`}
              onPress={() => onSelectOperationalState(stateKey)}
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
      </View> */}
    </View>
  );
}
