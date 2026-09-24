import React, { useState, useMemo } from 'react';
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
import { ACTIVITIES, ActivityCategory, ActivityItem } from '../data/activities';

interface ActivityScreenProps {
  onSelectActivity?: (activity: ActivityItem) => void;
}

const FILTER_TABS: { label: string; value: ActivityCategory }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pickup', value: 'pickup' },
  { label: 'Drop-off', value: 'dropoff' },
  { label: 'Authorization', value: 'authorization' },
  { label: 'Security', value: 'security' },
];

export function ActivityScreen({ onSelectActivity }: ActivityScreenProps) {
  const [selectedFilter, setSelectedFilter] = useState<ActivityCategory>('all');
  const [isFilterActiveOnly, setIsFilterActiveOnly] = useState(false);

  const topInset = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 48;

  const filteredActivities = useMemo(() => {
    if (selectedFilter === 'all') {
      return ACTIVITIES;
    }
    return ACTIVITIES.filter((item) => item.category === selectedFilter);
  }, [selectedFilter]);

  const renderStatusIcon = (item: ActivityItem) => {
    switch (item.statusType) {
      case 'success':
        return (
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: '#12B76A',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Feather name="check" size={18} color="#FFFFFF" strokeWidth={3} />
          </View>
        );
      case 'danger':
        return (
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: '#D92D20',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                color: '#FFFFFF',
                fontWeight: '900',
                fontSize: 18,
                lineHeight: 20,
              }}
            >
              !
            </Text>
          </View>
        );
      case 'cancelled':
        return (
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: '#475467',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Feather name="x" size={16} color="#FFFFFF" strokeWidth={3} />
          </View>
        );
      case 'info':
      default:
        return (
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: '#0B1F3D',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Feather name="info" size={16} color="#FFFFFF" />
          </View>
        );
    }
  };

  return (
    <View className="flex-1 bg-canvas">
      <ExpoStatusBar style="dark" />

      {/* HEADER */}
      <View
        className="px-5 pb-3 bg-canvas"
        style={{ paddingTop: topInset + 12 }}
      >
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-3xl font-extrabold text-[#0B1F3D] tracking-tight">
            Activity
          </Text>
          <Pressable
            onPress={() => {
              // Toggles filter reset or quick reset
              setSelectedFilter('all');
            }}
            className="w-10 h-10 rounded-full border border-line bg-white items-center justify-center shadow-xs active:bg-slate-50"
            hitSlop={8}
          >
            <Feather name="filter" size={18} color="#0B1F3D" />
          </Pressable>
        </View>

        {/* FILTER CHIPS (Matching Figma 2-row / wrap layout) */}
        <View className="flex-row flex-wrap gap-2">
          {FILTER_TABS.map((tab) => {
            const isActive = selectedFilter === tab.value;
            return (
              <Pressable
                key={tab.value}
                onPress={() => setSelectedFilter(tab.value)}
                className={`px-4 py-2 rounded-full border ${
                  isActive
                    ? 'bg-[#0B1F3D] border-[#0B1F3D]'
                    : 'bg-white border-line'
                } active:opacity-80`}
              >
                <Text
                  className={`text-xs font-semibold ${
                    isActive ? 'text-white' : 'text-slate-700'
                  }`}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* ACTIVITY LIST */}
      <ScrollView
        className="flex-1 px-4 pt-3"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* DATE SECTION HEADER */}
        <Text className="text-[11px] font-bold text-mute tracking-wider uppercase mb-3 px-1">
          TODAY · MONDAY 7 SEPTEMBER
        </Text>

        {/* CARD CONTAINER WITH LIST ITEMS */}
        {filteredActivities.length === 0 ? (
          <View className="bg-white rounded-3xl p-8 border border-line items-center justify-center mt-2">
            <Feather name="inbox" size={36} color="#98A2B3" />
            <Text className="text-base font-semibold text-ink mt-3">
              No activity logs
            </Text>
            <Text className="text-xs text-mute mt-1 text-center">
              There are no {selectedFilter} entries recorded for today.
            </Text>
          </View>
        ) : (
          <View className="bg-white rounded-3xl border border-line shadow-sm overflow-hidden">
            {filteredActivities.map((item, idx) => (
              <Pressable
                key={item.id}
                onPress={() => onSelectActivity?.(item)}
                style={{
                  borderBottomWidth: idx < filteredActivities.length - 1 ? 1 : 0,
                  borderBottomColor: '#F2F4F7',
                }}
                className="flex-row items-start p-4 active:bg-slate-50 transition-colors"
              >
                {/* STATUS ICON */}
                <View style={{ marginRight: 14, marginTop: 2 }}>{renderStatusIcon(item)}</View>

                {/* CONTENT */}
                <View className="flex-1">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-sm font-bold text-ink flex-1 pr-2">
                      {item.title}
                    </Text>
                    <Text className="text-xs text-mute font-medium">
                      {item.time}
                    </Text>
                  </View>

                  <Text className="text-xs text-mute mt-1" numberOfLines={1}>
                    {item.subtitle}
                  </Text>

                  {/* BADGE */}
                  <View
                    style={{
                      backgroundColor: '#F2F4F7',
                      borderRadius: 6,
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      alignSelf: 'flex-start',
                      marginTop: 8,
                    }}
                  >
                    <Text className="text-[11px] font-semibold text-[#475467]">
                      {item.tag}
                    </Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
