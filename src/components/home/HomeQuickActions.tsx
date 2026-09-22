import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';

export interface HomeQuickActionsProps {
  onOpenHandlers: () => void;
  onOpenException: () => void;
  onOpenPlan: () => void;
}

export function HomeQuickActions({
  onOpenHandlers,
  onOpenException,
  onOpenPlan,
}: HomeQuickActionsProps) {
  return (
    <View className="mb-2">
      <Text className="text-base font-bold text-ink mb-3">Quick Actions</Text>
      <View className="flex-row gap-3">
        {/* Handlers Tile */}
        <Pressable
          className="flex-1 bg-[#E8F7F0] rounded-3xl py-4 items-center border border-actionGreenBorder"
          onPress={onOpenHandlers}
        >
          <View className="w-11 h-11 rounded-lg bg-[#0F6647] items-center justify-center mb-2 shadow-xs">
            <Ionicons name="person-outline" size={20} color="#fff" />
          </View>
          <Text className="text-xs font-bold text-ink">Handlers</Text>
        </Pressable>

        {/* Exception Tile */}
        <Pressable
          className="flex-1 bg-actionOrange rounded-3xl py-4 items-center border border-actionOrangeBorder"
          onPress={onOpenException}
        >
          <View className="w-11 h-11 rounded-lg bg-[#D9822B] items-center justify-center mb-2 shadow-xs">
            <Feather name="clock" size={20} color="#fff" />
          </View>
          <Text className="text-xs font-bold text-ink">Exception</Text>
        </Pressable>

        {/* Today's plan Tile */}
        <Pressable
          className="flex-1 bg-actionBlue rounded-3xl py-4 items-center border border-actionBlueBorder"
          onPress={onOpenPlan}
        >
          <View className="w-11 h-11 rounded-lg bg-navy items-center justify-center mb-2 shadow-xs">
            <Feather name="calendar" size={20} color="#fff" />
          </View>
          <Text className="text-xs font-bold text-ink">Today's plan</Text>
        </Pressable>
      </View>
    </View>
  );
}
