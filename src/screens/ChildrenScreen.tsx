import { useState } from 'react';
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
import { FigmaAvatar, PrimaryButton } from '../components';
import { CHILDREN, HANDLERS } from '../data/family';
import { colors } from '../theme';

export function ChildrenScreen({
  onSelectChild,
  onOpenHandlers,
  onOpenPickup,
  initialChildId,
}: {
  onSelectChild?: (childId: string) => void;
  onOpenHandlers: () => void;
  onOpenPickup: (childId: string) => void;
  initialChildId?: string;
}) {
  const [selectedId, setSelectedId] = useState<string>(
    initialChildId ?? CHILDREN[0].id
  );
  const activeChild = CHILDREN.find((c) => c.id === selectedId) ?? CHILDREN[0];

  const childHandlers = HANDLERS.filter((h) =>
    h.childIds.includes(activeChild.id)
  );

  const topInset = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 48;

  return (
    <View className="flex-1 bg-canvas">
      <ExpoStatusBar style="light" />

      {/* Navy Header matching iPhone 24 */}
      <View className="bg-navy px-5 pb-5 rounded-b-[32px]" style={{ paddingTop: topInset + 10 }}>
        <View className="flex-row justify-between items-center">
          <View className="flex-1">
            <Text className="text-white text-2xl font-bold tracking-tight">Your children (2)</Text>
            <Text className="text-slate-400 text-xs mt-1">Greenfield Academy · Lekki Phase 1</Text>
          </View>
          <View className="bg-emerald-500/20 px-2.5 py-1 rounded-full border border-emerald-500/40">
            <Text className="text-emerald-400 text-[10px] font-extrabold tracking-wider">ACTIVE</Text>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-4 pt-4"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Child Selector Tabs */}
        <View className="flex-row gap-3 mb-4">
          {CHILDREN.map((child) => {
            const isSelected = child.id === activeChild.id;
            return (
              <Pressable
                key={child.id}
                onPress={() => {
                  setSelectedId(child.id);
                  onSelectChild?.(child.id);
                }}
                className={`flex-1 flex-row items-center gap-2.5 p-3 rounded-2xl border ${
                  isSelected
                    ? 'bg-white border-navy shadow-sm'
                    : 'bg-white/80 border-line'
                }`}
              >
                <FigmaAvatar name={child.name} size={38} showStatusDot={isSelected} />
                <View className="flex-1">
                  <Text
                    className={`text-sm font-bold ${
                      isSelected ? 'text-navy' : 'text-ink'
                    }`}
                    numberOfLines={1}
                  >
                    {child.name.split(' ')[0]}
                  </Text>
                  <Text className="text-[11px] text-mute">{child.klass}</Text>
                </View>
                {isSelected && (
                  <View className="bg-navy px-1.5 py-0.5 rounded-md">
                    <Text className="text-white text-[9px] font-bold">Active</Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>

        {/* Active Child Profile Card */}
        <View className="bg-white rounded-3xl p-4 mb-4 border border-line shadow-sm">
          <View className="flex-row items-center">
            <FigmaAvatar name={activeChild.name} size={60} showStatusDot />
            <View className="flex-1 ml-3.5">
              <View className="flex-row justify-between items-center">
                <Text className="text-lg font-bold text-ink">{activeChild.name}</Text>
                <View className="flex-row items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-xl">
                  <View className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                  <Text className="text-[10px] font-bold text-slate-600">At Home</Text>
                </View>
              </View>
              <Text className="text-xs text-mute mt-1">
                {activeChild.klass} · {activeChild.gate ?? 'Main Gate'}
              </Text>
              <Text className="text-xs text-navy font-semibold mt-0.5">
                ID: {activeChild.studentId ?? 'GA-2024-001'}
              </Text>
            </View>
          </View>

          <View className="h-[1px] bg-slate-100 my-3.5" />

          {/* Quick Stats Grid */}
          <View className="flex-row items-center">
            <View className="flex-1 items-center">
              <Text className="text-[10px] font-bold text-mute tracking-wider mb-0.5">SCHOOL GATE</Text>
              <Text className="text-xs font-bold text-ink">{activeChild.gate ?? 'Main Gate'}</Text>
              <Text className="text-[10px] text-mute">Primary</Text>
            </View>
            <View className="w-[1px] h-8 bg-slate-100" />
            <View className="flex-1 items-center">
              <Text className="text-[10px] font-bold text-mute tracking-wider mb-0.5">SECURITY PIN</Text>
              <Text className="text-xs font-bold text-ink">Required</Text>
              <Text className="text-[10px] text-mute">At check-in</Text>
            </View>
            <View className="w-[1px] h-8 bg-slate-100" />
            <View className="flex-1 items-center">
              <Text className="text-[10px] font-bold text-mute tracking-wider mb-0.5">HANDLERS</Text>
              <Text className="text-xs font-bold text-ink">{childHandlers.length} approved</Text>
              <Text className="text-[10px] text-mute">Active now</Text>
            </View>
          </View>
        </View>

        {/* Today's Schedule Card */}
        <View className="bg-white rounded-3xl p-4 mb-3.5 border border-line shadow-sm">
          <View className="flex-row justify-between items-center mb-2.5">
            <View className="flex-row items-center gap-2">
              <Feather name="clock" size={16} color={colors.navy} />
              <Text className="text-sm font-bold text-ink">Today's Schedule</Text>
            </View>
            <Pressable onPress={() => onOpenPickup(activeChild.id)}>
              <Text className="text-xs font-bold text-navy">Manage</Text>
            </Pressable>
          </View>

          <View className="flex-row items-center py-2.5 border-b border-slate-50 gap-3">
            <View className="w-8 h-8 rounded-full bg-emerald-50 items-center justify-center">
              <Feather name="arrow-up-right" size={14} color="#027A48" />
            </View>
            <View className="flex-1">
              <Text className="text-xs font-semibold text-ink">Morning Drop-off</Text>
              <Text className="text-[11px] text-mute mt-0.5">
                7:00 AM – 8:30 AM · {activeChild.gate ?? 'Main Gate'}
              </Text>
            </View>
            <View className="bg-emerald-50 px-2.5 py-1 rounded-xl">
              <Text className="text-xs font-bold text-emerald-700">
                {activeChild.droppingOff ?? 'You'}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center py-2.5 gap-3">
            <View className="w-8 h-8 rounded-full bg-sky-50 items-center justify-center">
              <Feather name="arrow-down-left" size={14} color="#026AA2" />
            </View>
            <View className="flex-1">
              <Text className="text-xs font-semibold text-ink">Afternoon Pickup</Text>
              <Text className="text-[11px] text-mute mt-0.5">
                2:30 PM – 3:30 PM · {activeChild.gate ?? 'Main Gate'}
              </Text>
            </View>
            <View className="bg-sky-50 px-2.5 py-1 rounded-xl">
              <Text className="text-xs font-bold text-sky-700">
                {activeChild.pickingUp ?? 'You'}
              </Text>
            </View>
          </View>
        </View>

        {/* Approved Handlers for this child */}
        <View className="bg-white rounded-3xl p-4 mb-3.5 border border-line shadow-sm">
          <View className="flex-row justify-between items-center mb-1">
            <View className="flex-row items-center gap-2">
              <Feather name="shield" size={16} color={colors.navy} />
              <Text className="text-sm font-bold text-ink">Approved Handlers</Text>
            </View>
            <Pressable onPress={onOpenHandlers}>
              <Text className="text-xs font-bold text-navy">View all</Text>
            </Pressable>
          </View>
          <Text className="text-xs text-mute mb-2.5">
            People authorized to drop off or collect {activeChild.name.split(' ')[0]}.
          </Text>

          {childHandlers.map((handler) => (
            <Pressable
              key={handler.id}
              className="flex-row items-center py-2.5 border-b border-slate-50 last:border-b-0"
              onPress={onOpenHandlers}
            >
              <FigmaAvatar name={handler.name} size={38} />
              <View className="flex-1 ml-3">
                <Text className="text-sm font-bold text-ink">{handler.name}</Text>
                <Text className="text-[11px] text-mute mt-0.5">
                  {handler.relationship} · {handler.days}
                </Text>
              </View>
              <View
                className={`px-2 py-0.5 rounded-lg ${
                  handler.status === 'PAUSED' ? 'bg-slate-100' : 'bg-emerald-50'
                }`}
              >
                <Text
                  className={`text-[10px] font-bold ${
                    handler.status === 'PAUSED' ? 'text-slate-500' : 'text-emerald-700'
                  }`}
                >
                  {handler.status}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>

        {/* Safety & Medical Notes */}
        <View className="bg-white rounded-3xl p-4 mb-4 border border-line shadow-sm">
          <View className="flex-row items-center gap-2 mb-3">
            <Feather name="alert-circle" size={16} color={colors.navy} />
            <Text className="text-sm font-bold text-ink">Safety & Gate Notes</Text>
          </View>
          <View className="bg-slate-50 rounded-xl p-3 border border-slate-100 mb-2">
            <Text className="text-xs font-bold text-ink mb-1">Medical & Dietary</Text>
            <Text className="text-xs text-slate-600 leading-4">
              {activeChild.allergies ?? 'No allergies recorded with Greenfield Academy health office.'}
            </Text>
          </View>
          <View className="bg-slate-50 rounded-xl p-3 border border-slate-100">
            <Text className="text-xs font-bold text-ink mb-1">Pickup Security Instruction</Text>
            <Text className="text-xs text-slate-600 leading-4">
              {activeChild.notes ?? 'Standard gate handover protocol.'}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="mt-1 mb-6 gap-2.5">
          <PrimaryButton
            label={`Schedule pickup for ${activeChild.name.split(' ')[0]}`}
            onPress={() => onOpenPickup(activeChild.id)}
          />
          <PrimaryButton
            outline
            label="Manage authorized handlers"
            onPress={onOpenHandlers}
          />
        </View>
      </ScrollView>
    </View>
  );
}

