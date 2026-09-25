import React from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { useFamily } from '../data/FamilyContext';
import { Child, CHILDREN } from '../data/family';
import { useAndroidBack } from '../useAndroidBack';

export interface TodaysPlanScreenProps {
  childId?: string;
  onBack: () => void;
  onOpenDropoff?: () => void;
  onOpenPickup?: () => void;
}

export function TodaysPlanScreen({
  childId = 'amara',
  onBack,
  onOpenDropoff,
  onOpenPickup,
}: TodaysPlanScreenProps) {
  useAndroidBack(onBack);

  const { children = CHILDREN } = useFamily();
  const activeChild: Child =
    children.find((c) => c.id === childId) ?? children[0] ?? CHILDREN[0];

  const childFirstName = activeChild.name.split(' ')[0];
  const isAmara = activeChild.id === 'amara';
  const checkInTime = isAmara ? '7:48 AM' : '7:52 AM';
  const topInset = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 48;

  return (
    <View className="flex-1 bg-canvas">
      <ExpoStatusBar style="dark" />

      {/* HEADER BAR */}
      <View
        className="bg-white px-4 pb-3 flex-row items-center justify-between"
        style={{ paddingTop: topInset + 4 }}
      >
        <Pressable
          onPress={onBack}
          className="w-10 h-10 rounded-full items-center justify-center active:bg-slate-200/70"
          hitSlop={8}
        >
          <Feather name="chevron-left" size={24} color="#101828" />
        </Pressable>

        <Text className="text-base font-bold text-ink tracking-tight">Today's plan</Text>

        <View className="w-10" />
      </View>

      <ScrollView
        className="flex-1 px-4 bg-white"
        contentContainerStyle={{ paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
      >
        {/* TITLE & SUBTITLE */}
        <View className="items-center my-3">
          <Text className="text-2xl font-bold text-ink text-center">
            Monday, 7 September
          </Text>
          <Text className="text-sm text-slate-500 font-medium mt-1 text-center">
            {activeChild.name} · {activeChild.klass} · {activeChild.gate ?? 'Main Gate'}
          </Text>
        </View>

        {/* GREEN ALERT CARD: DROP-OFF AUTHORIZATION */}
        <View className="bg-bannerGreen rounded-3xl p-6 mb-3 border border-[#A6F4C5] shadow-xs">
          <View className="flex-row items-start gap-3 mb-3">
            <View className="w-6 h-6 rounded-full bg-success items-center justify-center mt-0.5">
              <Text className="text-white text-sm font-bold italic">i</Text>
            </View>
            <View className="flex-1">
              <Text className="text-md font-bold text-ink">
                You are authorized to drop-off {childFirstName}.
              </Text>
              <Text className="text-md text-ink mt-1 leading-4">
                Recurring authorization · 6:45 AM – 8:30 AM · {activeChild.gate ?? 'Main Gate'}
              </Text>
            </View>
          </View>

          <Pressable
            className="bg-white border border-ink h-12 rounded-xl items-center justify-center active:bg-slate-50 shadow-xs"
            onPress={onOpenDropoff}
          >
            <Text className="text-slate-800 text-md font-semibold">Manage drop-off</Text>
          </Pressable>
        </View>

        {/* NAVY ALERT CARD: PICKUP AUTHORIZATION */}
        <View className="bg-bannerInfo rounded-3xl p-6 mb-6 border border-[#D5E1F2] shadow-xs">
          <View className="flex-row items-start gap-3 mb-3">
            <View className="w-6 h-6 rounded-full bg-[#0B1F3D] items-center justify-center mt-0.5">
              <Text className="text-white text-sm font-bold italic">i</Text>
            </View>
            <View className="flex-1">
              <Text className="text-md font-bold text-[#0B1F3D]">
                Chidinma Okafor is authorized to pick up {childFirstName}.
              </Text>
              <Text className="text-md text-[#344054] mt-1 leading-4">
                Recurring authorization · 2:30 PM – 3:30 PM · {activeChild.gate ?? 'Main Gate'}
              </Text>
            </View>
          </View>

          <Pressable
            className="bg-white border border-ink h-12 rounded-2xl items-center justify-center active:bg-slate-50 shadow-xs"
            onPress={onOpenPickup}
          >
            <Text className="text-slate-800 text-md font-semibold">Manage pickup</Text>
          </Pressable>
        </View>

        {/* TIMELINE SECTION */}
        <View className="bg-white rounded-3xl p-5 border border-line shadow-xs">
          {/* Milestone 1: 6:45 AM */}
          <View className="flex-row gap-4">
            <Text className="w-16 text-sm font-bold text-ink pt-0.5">6:45 AM</Text>
            <View className="items-center">
              <View className="w-6 h-6 rounded-full bg-success items-center justify-center">
                <Feather name="check" size={12} color="#FFFFFF" />
              </View>
              <View className="w-0.5 h-16 bg-success my-1" />
            </View>
            <View className="flex-1 pb-4">
              <Text className="text-md font-bold text-ink">Drop-off window opens</Text>
              <Text className="text-sm text-slate-500 mt-0.5">Main Gate · Primary 1–6</Text>
            </View>
          </View>

          {/* Milestone 2: 7:48 AM */}
          <View className="flex-row gap-4">
            <Text className="w-16 text-sm font-bold text-ink pt-0.5">{checkInTime}</Text>
            <View className="items-center">
              <View className="w-6 h-6 rounded-full bg-success items-center justify-center">
                <Feather name="check" size={12} color="#FFFFFF" />
              </View>
              <View className="w-0.5 h-20 bg-slate-200 my-1" />
            </View>
            <View className="flex-1 pb-4">
              <Text className="text-md font-bold text-ink">{childFirstName} checked in</Text>
              <Text className="text-sm text-slate-500 mt-0.5">Main Gate · handed over by You</Text>
              <Text className="text-sm text-slate-600 font-medium mt-0.5">Authorized by Mrs Sam</Text>
            </View>
          </View>

          {/* Milestone 3: 2:30 PM */}
          <View className="flex-row gap-4">
            <Text className="w-16 text-sm font-bold text-ink pt-0.5">2:30 PM</Text>
            <View className="items-center">
              <View className="w-6 h-6 rounded-full bg-[#F79009] items-center justify-center">
                <View className="w-3 h-3 rounded-full bg-white" />
              </View>
              <View className="w-0.5 h-16 bg-slate-200 my-1" />
            </View>
            <View className="flex-1 pb-4">
              <Text className="text-md font-bold text-ink">Pickup window opens</Text>
              <Text className="text-sm text-slate-500 mt-0.5">Chidinma's code becomes active</Text>
            </View>
          </View>

          {/* Milestone 4: 3:30 PM */}
          <View className="flex-row gap-4">
            <Text className="w-16 text-sm font-bold text-ink pt-0.5">3:30 PM</Text>
            <View className="items-center">
              <View className="w-6 h-6 rounded-full bg-slate-200 items-center justify-center">
                <View className="w-3 h-3 rounded-full bg-slate-400" />
              </View>
              <View className="w-0.5 h-16 bg-slate-200 my-1" />
            </View>
            <View className="flex-1 pb-4">
              <Text className="text-md  font-bold text-ink">Pickup window ends</Text>
              <Text className="text-sm text-slate-500 mt-0.5">
                After this, the front office takes over
              </Text>
            </View>
          </View>

          {/* Milestone 5: 3:45 PM */}
          <View className="flex-row gap-4">
            <Text className="w-16 text-sm font-bold text-ink pt-0.5">3:45 PM</Text>
            <View className="items-center">
              <View className="w-6 h-6 rounded-full bg-slate-200 items-center justify-center">
                <View className="w-3 h-3 rounded-full bg-slate-400" />
              </View>
            </View>
            <View className="flex-1">
              <Text className="text-sm font-bold text-ink">Late pickup escalation</Text>
              <Text className="text-sm text-slate-500 mt-0.5">
                You and the office are alerted
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
