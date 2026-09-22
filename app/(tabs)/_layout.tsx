import { Tabs } from 'expo-router';
import { PlatformPressable } from 'expo-router/react-navigation';
import { Feather } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { colors } from '@/src/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.navy,
        tabBarInactiveTintColor: '#98A2B3',
        tabBarButton: (props) => (
          <PlatformPressable
            {...props}
            pressColor="rgba(11, 31, 61, 0.04)"
            pressOpacity={0.85}
          />
        ),
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.line,
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 24 : 12,
          height: Platform.OS === 'ios' ? 84 : 64,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          letterSpacing: -0.2,
          marginBottom: Platform.OS === 'ios' ? 0 : 4,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
          minWidth: 64,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Feather size={22} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="children"
        options={{
          title: 'Children',
          tabBarIcon: ({ color }) => <Feather size={22} name="users" color={color} />,
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: 'Activity',
          tabBarIcon: ({ color }) => <Feather size={22} name="calendar" color={color} />,
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'More',
          tabBarIcon: ({ color }) => <Feather size={22} name="more-horizontal" color={color} />,
        }}
      />
    </Tabs>
  );
}
