import { ReactNode } from 'react';
import {
  Image,
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from './theme';

export function Wordmark({ light = false }: { light?: boolean }) {
  return (
    <View style={styles.wordmark}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Text style={[styles.brand, { color: light ? colors.white : colors.ink }]}>SchoolShield</Text>
    </View>
  );
}

export function PrimaryButton({
  label,
  onPress,
  inverted = false,
  outline = false,
  ghost = false,
  success = false,
  dangerOutline = false,
  danger = false,
  enabled = true,
  icon,
  style,
  textStyle,
  className,
}: {
  label: string;
  onPress: () => void;
  inverted?: boolean;
  outline?: boolean;
  ghost?: boolean;
  success?: boolean;
  dangerOutline?: boolean;
  danger?: boolean;
  enabled?: boolean;
  icon?: ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  className?: string;
}) {
  const isOutline = outline || dangerOutline;

  let backgroundColor: string;
  let color: string;
  let borderColor: string = 'transparent';
  let borderWidth: number = 0;

  if (!enabled) {
    if (ghost) {
      backgroundColor = 'transparent';
      borderColor = 'rgba(255,255,255,0.18)';
      borderWidth = 1.5;
      color = 'rgba(255,255,255,0.38)';
    } else if (isOutline) {
      backgroundColor = colors.white;
      borderColor = colors.line;
      borderWidth = 1.5;
      color = '#98A2B3';
    } else {
      // Disabled primary button matching Figma P004a
      backgroundColor = '#F2F4F7';
      borderWidth = 0;
      borderColor = 'transparent';
      color = '#98A2B3';
    }
  } else if (ghost) {
    backgroundColor = 'transparent';
    borderColor = 'rgba(255,255,255,0.35)';
    borderWidth = 1.5;
    color = colors.white;
  } else if (danger) {
    backgroundColor = '#D92D20';
    color = colors.white;
  } else if (dangerOutline) {
    backgroundColor = colors.white;
    borderColor = '#FECACA';
    borderWidth = 1.5;
    color = '#B42318';
  } else if (success) {
    backgroundColor = '#157A4B';
    color = colors.white;
  } else if (inverted) {
    backgroundColor = colors.white;
    color = colors.navy;
  } else if (outline) {
    backgroundColor = colors.white;
    borderColor = colors.line;
    borderWidth = 1.5;
    color = colors.navy;
  } else {
    backgroundColor = colors.navy;
    color = colors.white;
  }

  return (
    <Pressable
      // @ts-ignore
      cssInterop={false}
      className={className}
      onPress={onPress}
      disabled={!enabled}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor,
          borderWidth,
          borderColor,
          opacity: enabled && pressed ? 0.88 : 1,
        },
        style,
      ]}
    >
      <View style={styles.buttonContent}>
        {icon}
        <Text style={[styles.buttonLabel, { color }, textStyle]}>{label}</Text>
      </View>
    </Pressable>
  );
}

export function Field({
  label,
  value,
  onChangeText,
  light = false,
  password = false,
  trailing,
  keyboardType,
  placeholder,
  autoCapitalize = 'none',
  prefix,
  error = false,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  light?: boolean;
  password?: boolean;
  trailing?: ReactNode;
  keyboardType?: TextInputProps['keyboardType'];
  placeholder?: string;
  autoCapitalize?: TextInputProps['autoCapitalize'];
  prefix?: string;
  error?: boolean;
}) {
  return (
    <View>
      <Text style={[styles.label, light && styles.labelLight]}>{label}</Text>
      <View
        style={[
          styles.inputWrap,
          light ? styles.inputLight : styles.inputDark,
          error && { borderWidth: 1.5, borderColor: '#F04438' },
        ]}
      >
        {prefix ? <Text style={styles.prefix}>{prefix}</Text> : null}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={password}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          placeholder={placeholder}
          placeholderTextColor={light ? 'rgba(255,255,255,0.28)' : '#98A2B3'}
          style={[styles.input, { color: light ? colors.white : colors.ink }]}
        />
        {trailing}
      </View>
    </View>
  );
}

export function FigmaAvatar({
  name,
  size = 48,
  showStatusDot = false,
}: {
  name: string;
  size?: number;
  showStatusDot?: boolean;
}) {
  const lower = name.toLowerCase();
  let emoji = '👤';
  let bgColor = '#F2F4F7';

  if (lower.includes('zara')) {
    emoji = '🧕🏽';
    bgColor = '#FCE7D0';
  } else if (lower.includes('amara')) {
    emoji = '👧🏾';
    bgColor = '#FED7AA';
  } else if (lower.includes('david')) {
    emoji = '👦🏾';
    bgColor = '#E0E7FF';
  } else if (lower.includes('chidinma')) {
    emoji = '👩🏾';
    bgColor = '#FCE7F3';
  } else if (lower.includes('emeka')) {
    emoji = '👨🏾';
    bgColor = '#DCFCE7';
  } else if (lower.includes('aisha')) {
    emoji = '👵🏾';
    bgColor = '#E0F2FE';
  }

  const dotSize = Math.max(10, Math.round(size * 0.25));

  return (
    <View style={{ width: size, height: size, position: 'relative' }}>
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: bgColor,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: 'rgba(0,0,0,0.05)',
        }}
      >
        <Text style={{ fontSize: size * 0.58, lineHeight: size * 0.68 }}>{emoji}</Text>
      </View>
      {showStatusDot && (
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: dotSize,
            height: dotSize,
            borderRadius: dotSize / 2,
            backgroundColor: '#12B76A',
            borderWidth: 2,
            borderColor: colors.white,
          }}
        />
      )}
    </View>
  );
}

export function InitialsAvatar({
  name,
  size = 48,
  color,
  showStatusDot = false,
}: {
  name: string;
  size?: number;
  color?: string;
  showStatusDot?: boolean;
}) {
  const lower = name.toLowerCase();
  if (
    lower.includes('zara') ||
    lower.includes('amara') ||
    lower.includes('david') ||
    lower.includes('chidinma')
  ) {
    return <FigmaAvatar name={name} size={size} showStatusDot={showStatusDot} />;
  }

  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
  const palette = ['#1C1917', '#BE185D', '#0B1F3D', '#9A3412', '#1D4ED8'];
  const bg = color ?? palette[Math.abs(name.split('').reduce((n, c) => n + c.charCodeAt(0), 0)) % palette.length];
  const dotSize = Math.max(10, Math.round(size * 0.25));

  return (
    <View style={{ width: size, height: size, position: 'relative' }}>
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: bg,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ color: colors.white, fontWeight: '700', fontSize: size * 0.32 }}>{initials || '?'}</Text>
      </View>
      {showStatusDot && (
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: dotSize,
            height: dotSize,
            borderRadius: dotSize / 2,
            backgroundColor: '#12B76A',
            borderWidth: 2,
            borderColor: colors.white,
          }}
        />
      )}
    </View>
  );
}

export function BottomTabBar({
  activeTab,
  onTabPress,
}: {
  activeTab: 'home' | 'children' | 'activity' | 'more';
  onTabPress: (tab: 'home' | 'children' | 'activity' | 'more') => void;
}) {
  const tabs: { key: 'home' | 'children' | 'activity' | 'more'; label: string; icon: 'home' | 'users' | 'calendar' | 'more-horizontal' }[] = [
    { key: 'home', label: 'Home', icon: 'home' },
    { key: 'children', label: 'Children', icon: 'users' },
    { key: 'activity', label: 'Activity', icon: 'calendar' },
    { key: 'more', label: 'More', icon: 'more-horizontal' },
  ];

  return (
    <View
      className="flex-row bg-white border-t border-line justify-around items-center pt-2 px-4"
      style={{ paddingBottom: Platform.OS === 'ios' ? 24 : 12 }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onTabPress(tab.key)}
            className="items-center justify-center py-1 min-w-[64px]"
          >
            <View className="h-6 items-center justify-center mb-1">
              <Feather
                name={tab.icon}
                size={22}
                color={isActive ? colors.navy : '#98A2B3'}
              />
            </View>
            <Text
              className={`text-[11px] tracking-tight ${
                isActive ? 'text-navy font-bold' : 'text-slate-400 font-medium'
              }`}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const tabStyles = StyleSheet.create({

  bar: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    paddingHorizontal: 16,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    minWidth: 64,
  },
  iconWrap: {
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    fontSize: 11,
    letterSpacing: -0.2,
  },
});



const styles = StyleSheet.create({
  wordmark: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logo: { width: 36, height: 36, borderRadius: 10 },
  brand: { fontSize: 20, fontWeight: '600', letterSpacing: -0.3 },
  button: {
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.ink,
    marginBottom: 8,
  },
  labelLight: { color: 'rgba(255,255,255,0.72)' },
  inputWrap: {
    minHeight: 54,
    borderRadius: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputDark: {
    backgroundColor: colors.white,
  },
  inputLight: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  input: { flex: 1, fontSize: 16, paddingVertical: 14 },
  prefix: { color: colors.ink, fontSize: 16, fontWeight: '600', marginRight: 8 },
});
