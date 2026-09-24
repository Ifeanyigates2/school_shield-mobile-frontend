import React, { useState } from 'react';
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
import { FigmaAvatar } from '../components';
import { useFamily } from '../data/FamilyContext';
import { Child, CHILDREN } from '../data/family';
import { useAndroidBack } from '../useAndroidBack';
import { OperationalState } from '../components/home';

export interface ChildDetailsScreenProps {
  initialChildId?: string;
  operationalState?: OperationalState;
  onBack: () => void;
  onOpenPickup?: (childId: string) => void;
  onOpenDropoff?: (childId: string) => void;
  onOpenHandlers?: () => void;
  onViewPlan?: (childId: string) => void;
  onViewActivity?: () => void;
}

export function ChildDetailsScreen({
  initialChildId = 'amara',
  operationalState = 'active',
  onBack,
  onOpenPickup,
  onOpenDropoff,
  onOpenHandlers,
  onViewPlan,
  onViewActivity,
}: ChildDetailsScreenProps) {
  useAndroidBack(onBack);

  const { children = CHILDREN, handlers, guardianName } = useFamily();
  const [selectedChildId, setSelectedChildId] = useState<string>(initialChildId);

  const activeChild: Child =
    children.find((c) => c.id === selectedChildId) ?? children[0] ?? CHILDREN[0];

  const isAtSchool = operationalState === 'active';
  const isAmara = activeChild.id === 'amara';
  const checkInTime = isAmara ? '7:48 AM' : '7:52 AM';
  const childFirstName = activeChild.name.split(' ')[0];

  // Handlers authorized for this specific child
  const childHandlers = handlers.filter((h) =>
    h.childIds.includes(activeChild.id)
  );

  const topInset = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 48;
  const guardianInitial = (guardianName?.[0] ?? 'Z').toUpperCase();

  return (
    <View className="flex-1 bg-canvas">
      <ExpoStatusBar style="dark" />

      {/* HEADER BAR */}
      <View
        className="bg-canvas px-4 pb-3 flex-row items-center justify-between"
        style={{ paddingTop: topInset + 4 }}
      >
        <View className="flex-row items-center gap-2">
          {/* Back button */}
          <Pressable
            onPress={onBack}
            className="w-10 h-10 rounded-full items-center justify-center active:bg-slate-200/70"
            hitSlop={8}
          >
            <Feather name="chevron-left" size={24} color="#101828" />
          </Pressable>

          {/* Guardian initial badge (Z) matching Figma */}
          <View className="w-8 h-8 rounded-full bg-[#3B1260] items-center justify-center shadow-md shadow-purple-900/40">
            <Text className="text-white text-xs font-bold">{guardianInitial}</Text>
          </View>
        </View>

        {/* Center title */}
        <Text className="text-base font-bold text-ink tracking-tight">Child details</Text>

        {/* Balance layout */}
        <View className="w-16" />
      </View>

      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
      >
        {/* SWITCH CHILD PROFILE SECTION */}
        <View className="mt-2 mb-4">
          <Text className="text-xs text-slate-500 font-medium mb-1.5">
            Switch child profile
          </Text>
          <View className="flex-row items-center gap-2 bg-white/90 self-start p-1.5 rounded-2xl border border-slate-200 shadow-xs">
            {children.map((child) => {
              const isSelected = child.id === activeChild.id;
              return (
                <Pressable
                  key={child.id}
                  onPress={() => setSelectedChildId(child.id)}
                  className={`flex-row items-center gap-1.5 px-2.5 py-1 rounded-xl transition-all ${
                    isSelected ? 'bg-slate-100 border border-slate-300' : 'opacity-70'
                  }`}
                >
                  <FigmaAvatar name={child.name} size={28} showStatusDot={false} />
                  <Text
                    className={`text-xs ${
                      isSelected ? 'font-bold text-ink' : 'font-medium text-slate-600'
                    }`}
                  >
                    {child.name.split(' ')[0]}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* MAIN CHILD HERO PROFILE */}
        <View className="items-center mt-1 mb-5">
          {/* Large Avatar */}
          <View className="relative">
            <FigmaAvatar
              name={activeChild.name}
              size={88}
              showStatusDot={isAtSchool}
            />
          </View>

          {/* Child Name */}
          <Text className="text-2xl font-bold text-ink mt-3 text-center">
            {activeChild.name}
          </Text>

          {/* Class and Campus */}
          <Text className="text-xs text-slate-500 font-medium mt-1 text-center">
            {activeChild.klass} · Greenfield Academy, Lekki Phase 1
          </Text>

          {/* Status Pill Badge */}
          {isAtSchool ? (
            <View className="flex-row items-center gap-1.5 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200 mt-3">
              <View className="w-2 h-2 rounded-full bg-emerald-500" />
              <Text className="text-xs font-semibold text-emerald-800">
                At school · checked in {checkInTime}
              </Text>
            </View>
          ) : (
            <View className="bg-slate-100 px-3.5 py-1 rounded-xl border border-slate-200 mt-3">
              <Text className="text-[11px] font-bold text-slate-600 tracking-wider">
                AT HOME
              </Text>
            </View>
          )}
        </View>

        {/* ACTION BUTTON(S) */}
        <View className="mb-6">
          {isAtSchool ? (
            /* AT SCHOOL STATE: Single Navy Manage Pickup Button (iPhone 23) */
            <Pressable
              className="bg-navy h-13 rounded-2xl items-center justify-center active:opacity-90 shadow-sm"
              onPress={() => onOpenPickup?.(activeChild.id)}
            >
              <Text className="text-white text-base font-semibold">Manage pickup</Text>
            </Pressable>
          ) : (
            /* AT HOME STATE: Manage Drop-off & Manage Pickup (iPhone 22) */
            <View className="flex-row gap-3">
              <Pressable
                className="flex-1 bg-navy h-13 rounded-2xl items-center justify-center active:opacity-90 shadow-sm"
                onPress={() => onOpenDropoff?.(activeChild.id)}
              >
                <Text className="text-white text-sm font-semibold">Manage Drop-off</Text>
              </Pressable>
              <Pressable
                className="flex-1 bg-white border border-slate-300 h-13 rounded-2xl items-center justify-center active:opacity-90 shadow-xs"
                onPress={() => onOpenPickup?.(activeChild.id)}
              >
                <Text className="text-navy text-sm font-semibold">Manage Pickup</Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* CHILD'S DAY SCHEDULE CARD */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-2 px-1">
            <Text className="text-xs font-bold text-slate-700 tracking-wider">
              {childFirstName.toUpperCase()}'S DAY
            </Text>
            <Pressable onPress={() => onViewPlan?.(activeChild.id)}>
              <Text className="text-xs font-bold text-navy underline">
                View Today's plan
              </Text>
            </Pressable>
          </View>

          <View className="bg-white rounded-3xl p-5 border border-line shadow-xs">
            {/* Drop-off window */}
            <View className="flex-row justify-between items-center py-2.5 border-b border-slate-100">
              <Text className="text-sm text-slate-500 font-medium">Drop-off window</Text>
              <Text className="text-sm font-bold text-ink">6:45 – 8:30 AM</Text>
            </View>

            {/* Pickup window */}
            <View className="flex-row justify-between items-center py-2.5 border-b border-slate-100">
              <Text className="text-sm text-slate-500 font-medium">Pickup window</Text>
              <Text className="text-sm font-bold text-ink">2:30 – 3:30 PM</Text>
            </View>

            {isAtSchool ? (
              <>
                {/* Dropped-off */}
                <View className="flex-row justify-between items-center py-2.5 border-b border-slate-100">
                  <Text className="text-sm text-slate-500 font-medium">Dropped-off</Text>
                  <Text className="text-sm font-bold text-ink">
                    {activeChild.droppingOff ?? 'You'}
                  </Text>
                </View>

                {/* Checked In */}
                <View className="flex-row justify-between items-center py-2.5 border-b border-slate-100">
                  <Text className="text-sm text-slate-500 font-medium">Checked In</Text>
                  <Text className="text-sm font-bold text-ink">{checkInTime}</Text>
                </View>

                {/* Authorized */}
                <View className="flex-row justify-between items-center py-2.5 border-b border-slate-100">
                  <Text className="text-sm text-slate-500 font-medium">Authorized</Text>
                  <Text className="text-sm font-bold text-ink">Mrs Sam</Text>
                </View>

                {/* Picking up */}
                <View className="flex-row justify-between items-center pt-2.5">
                  <Text className="text-sm text-slate-500 font-medium">Picking up</Text>
                  <Text className="text-sm font-bold text-ink">
                    {activeChild.pickingUp ?? (isAmara ? 'Chidinma Okafor' : 'You')}
                  </Text>
                </View>
              </>
            ) : (
              <>
                {/* Assigned Drop-off */}
                <View className="flex-row justify-between items-center py-2.5 border-b border-slate-100">
                  <Text className="text-sm text-slate-500 font-medium">Assigned Drop-off</Text>
                  <Text className="text-sm font-bold text-ink">
                    {activeChild.droppingOff ?? 'You'}
                  </Text>
                </View>

                {/* Assigned Pickup */}
                <View className="flex-row justify-between items-center pt-2.5">
                  <Text className="text-sm text-slate-500 font-medium">Assigned Pickup</Text>
                  <Text className="text-sm font-bold text-ink">
                    {activeChild.pickingUp ?? (isAmara ? 'Chidinma Okafor' : 'You')}
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>

        {/* AUTHORIZED HANDLERS SECTION */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-2 px-1">
            <Text className="text-xs font-bold text-slate-700 tracking-wider">
              AUTHORIZED HANDLERS
            </Text>
            <Pressable onPress={onOpenHandlers}>
              <Text className="text-xs font-bold text-navy">Manage</Text>
            </Pressable>
          </View>

          <View className="bg-white rounded-3xl p-4 border border-line shadow-xs">
            {childHandlers.length > 0 ? (
              childHandlers.map((handler, idx) => (
                <Pressable
                  key={handler.id}
                  className={`flex-row items-center py-3 ${
                    idx !== childHandlers.length - 1 ? 'border-b border-slate-100' : ''
                  } active:opacity-70`}
                  onPress={onOpenHandlers}
                >
                  <FigmaAvatar name={handler.name} size={42} />
                  <View className="flex-1 ml-3">
                    <Text className="text-sm font-bold text-ink">{handler.name}</Text>
                    <Text className="text-xs text-slate-500 mt-0.5">
                      {handler.relationship} · {handler.days}
                    </Text>
                  </View>
                  <Feather name="chevron-right" size={16} color="#98A2B3" />
                </Pressable>
              ))
            ) : (
              <Text className="text-xs text-slate-500 py-3 text-center">
                No handlers assigned yet.
              </Text>
            )}
          </View>
        </View>

        {/* RECENT ACTIVITY SECTION */}
        <View className="mb-4">
          <View className="flex-row justify-between items-center mb-2 px-1">
            <Text className="text-xs font-bold text-slate-700 tracking-wider">
              RECENT ACTIVITY
            </Text>
            <Pressable onPress={onViewActivity}>
              <Text className="text-xs font-bold text-navy">See all</Text>
            </Pressable>
          </View>

          <View className="bg-white rounded-3xl p-4 border border-line shadow-xs gap-3">
            {/* Activity 1 */}
            <View className="flex-row items-center py-1">
              <View className="w-10 h-10 rounded-xl bg-emerald-50 items-center justify-center border border-emerald-100">
                <Feather name="file-text" size={16} color="#027A48" />
              </View>
              <View className="flex-1 ml-3">
                <Text className="text-sm font-semibold text-ink">
                  Code issued for {childFirstName}
                </Text>
                <Text className="text-xs text-slate-500 mt-0.5">
                  Drop-off · expires 8:00 AM
                </Text>
              </View>
              <Text className="text-xs text-slate-400">6:45 AM</Text>
            </View>

            <View className="h-[1px] bg-slate-100" />

            {/* Activity 2 */}
            <View className="flex-row items-center py-1">
              <View className="w-10 h-10 rounded-xl bg-sky-50 items-center justify-center border border-sky-100">
                <Feather name="message-square" size={16} color="#026AA2" />
              </View>
              <View className="flex-1 ml-3">
                <Text className="text-sm font-semibold text-ink">
                  Code sent to Chidinma
                </Text>
                <Text className="text-xs text-slate-500 mt-0.5">
                  SMS +234 805 221 4475
                </Text>
              </View>
              <Text className="text-xs text-slate-400">6:45 AM</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
