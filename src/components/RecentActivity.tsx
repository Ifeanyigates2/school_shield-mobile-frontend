import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { OperationalState } from './home/HomeHeader';

export interface RecentActivityItem {
  id?: string;
  icon?: React.ReactNode;
  iconType?: 'qr' | 'message' | 'document';
  iconBgColor?: string;
  iconColor?: string;
  title: string;
  subtitle: string;
  time: string;
  onPress?: () => void;
}

export interface RecentActivityProps {
  operationalState?: OperationalState;
  onSeeAll?: () => void;
  title?: string;
  childName?: string;
  items?: RecentActivityItem[];
  emptyTitle?: string;
  emptySubtitle?: string;
  className?: string;
  containerClassName?: string;
  showHeader?: boolean;
}

export type HomeRecentActivityProps = RecentActivityProps;

function renderItemIcon(item: RecentActivityItem) {
  if (item.icon) {
    return item.icon;
  }
  if (item.iconType === 'message') {
    return (
      <View
        className={`w-9 h-9 rounded-lg ${item.iconBgColor ?? 'bg-sky-100'} items-center justify-center`}
      >
        <Feather
          name="message-square"
          size={16}
          color={item.iconColor ?? '#026AA2'}
        />
      </View>
    );
  }
  if (item.iconType === 'document') {
    return (
      <View
        className={`w-9 h-9 rounded-lg ${item.iconBgColor ?? 'bg-emerald-100'} items-center justify-center`}
      >
        <Feather
          name="file-text"
          size={16}
          color={item.iconColor ?? '#027A48'}
        />
      </View>
    );
  }
  return (
    <View
      className={`w-9 h-9 rounded-lg ${item.iconBgColor ?? 'bg-emerald-100'} items-center justify-center`}
    >
      <Ionicons
        name="qr-code-outline"
        size={16}
        color={item.iconColor ?? '#027A48'}
      />
    </View>
  );
}

export function RecentActivity({
  operationalState = 'active',
  onSeeAll,
  title = 'RECENT ACTIVITY',
  childName,
  items,
  emptyTitle = 'Nothing since Friday',
  emptySubtitle = "Friday's pickups are in Activity if you need them.",
  className,
  containerClassName,
  showHeader = true,
}: RecentActivityProps) {
  const containerClass = className ?? containerClassName ?? 'mt-4';

  const activityItems: RecentActivityItem[] = items ?? [
    {
      id: '1',
      iconType: 'qr',
      title: `Code issued for ${childName || 'Amara'}`,
      subtitle: 'Drop-off · expires 8:30 AM',
      time: '6:45 AM',
    },
    {
      id: '2',
      iconType: 'message',
      title: 'Code sent to Chidinma',
      subtitle: 'SMS · +234 805 221 4478',
      time: '6:45 AM',
    },
  ];

  return (
    <View className={containerClass}>
      {showHeader && (
        <View className="flex-row justify-between items-center mb-2.5">
          <Text className="text-sm text-ink tracking-widest">
            {title}
          </Text>
          {onSeeAll && (
            <Pressable onPress={onSeeAll}>
              <Text className="text-sm font-semibold text-navy">See all</Text>
            </Pressable>
          )}
        </View>
      )}

      {operationalState === 'active' && activityItems.length > 0 ? (
        /* Dynamic Activity Items for Active Codes State (Figma iPhone 19/27) */
        <View className="bg-white rounded-3xl p-3 border border-line gap-2">
          {activityItems.map((item, idx) => {
            const content = (
              <View className="flex-row items-center justify-between p-2 rounded-2xl">
                <View className="flex-row items-center gap-3 flex-1">
                  {renderItemIcon(item)}
                  <View className="flex-1">
                    <Text className="text-md font-bold text-ink">{item.title}</Text>
                    <Text className="text-[11px] text-mute mt-0.5">{item.subtitle}</Text>
                  </View>
                </View>
                <Text className="text-sm text-mute">{item.time}</Text>
              </View>
            );

            if (item.onPress) {
              return (
                <Pressable
                  key={item.id ?? `${item.title}-${idx}`}
                  onPress={item.onPress}
                  className="active:opacity-70"
                >
                  {content}
                </Pressable>
              );
            }

            return (
              <View key={item.id ?? `${item.title}-${idx}`}>
                {content}
              </View>
            );
          })}
        </View>
      ) : (
        /* Quiet State Activity Card (Figma iPhone 13) */
        <View className="flex items-center bg-white rounded-3xl p-5 border border-line">
          <Text className="text-md font-medium text-ink">{emptyTitle}</Text>
          <Text className="text-sm text-mute mt-1 leading-5 text-center">
            {emptySubtitle}
          </Text>
        </View>
      )}
    </View>
  );
}

export { RecentActivity as HomeRecentActivity };
