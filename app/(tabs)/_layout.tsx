import { Tabs } from 'expo-router';
import { PlatformPressable } from 'expo-router/react-navigation';
import { Feather } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/src/theme';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  // Provide generous space so tab buttons never hide behind Android navigation buttons (or iOS home indicator)
  const bottomInset = Platform.OS === 'android' ? Math.max(insets.bottom, 24) : insets.bottom;
  const paddingBottom = Platform.OS === 'android' ? bottomInset + 12 : Math.max(insets.bottom, 20);
  const height = 54 + paddingBottom;

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
          paddingBottom: paddingBottom,
          height: height,
          elevation: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.08,
          shadowRadius: 10,
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
