import { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme';

export type PillTone = 'neutral' | 'green' | 'red' | 'amber';

const PILL_TONES: Record<PillTone, { bg: string; icon: string }> = {
  neutral: { bg: colors.soft, icon: colors.navy },
  green: { bg: '#ECFDF3', icon: '#039855' },
  red: { bg: '#FEF3F2', icon: '#D92D20' },
  amber: { bg: '#FFFAEB', icon: '#DC6803' },
};

export interface ListItem {
  id: string;
  title: string;
  subtitle?: string;
  /** Icon in a tinted square; ignored when `leading` is given */
  icon?: React.ComponentProps<typeof Feather>['name'];
  tone?: PillTone;
  /** Custom leading element, e.g. an avatar */
  leading?: ReactNode;
  trailing?: ReactNode;
  onPress?: () => void;
}

export function SectionLabel({ label }: { label: string }) {
  return (
    <Text
      style={{
        fontSize: 11,
        fontWeight: '700',
        color: colors.mute,
        letterSpacing: 0.8,
        textTransform: 'uppercase',
        marginBottom: 8,
      }}
    >
      {label}
    </Text>
  );
}

/** White rounded card of rows with an icon pill or avatar on the left. */
export function ListCard({ items }: { items: ListItem[] }) {
  return (
    <View
      style={{
        backgroundColor: colors.white,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.line,
        overflow: 'hidden',
      }}
    >
      {items.map((item, index) => {
        const tone = PILL_TONES[item.tone ?? 'neutral'];
        return (
          <View key={item.id}>
            <Pressable
              onPress={item.onPress}
              disabled={!item.onPress}
              style={({ pressed }) => ({
                backgroundColor: pressed ? 'rgba(11,31,61,0.04)' : colors.white,
              })}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  gap: 12,
                }}
              >
                {item.leading ?? (
                  <View
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      backgroundColor: tone.bg,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {item.icon && <Feather name={item.icon} size={16} color={tone.icon} />}
                  </View>
                )}

                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: colors.ink, marginBottom: 2 }}>
                    {item.title}
                  </Text>
                  {item.subtitle ? (
                    <Text style={{ fontSize: 12, color: colors.mute, lineHeight: 17 }}>
                      {item.subtitle}
                    </Text>
                  ) : null}
                </View>

                {item.trailing}
              </View>
            </Pressable>

            {index < items.length - 1 && <View style={{ height: 1, backgroundColor: colors.line }} />}
          </View>
        );
      })}
    </View>
  );
}

/** Tinted note card used at the foot of several sub-screens. */
export function NoteCard({
  children,
  tone = 'blue',
}: {
  children: ReactNode;
  tone?: 'blue' | 'red';
}) {
  return (
    <View
      style={{
        backgroundColor: tone === 'blue' ? colors.bannerBlueBg : '#FEF3F2',
        borderRadius: 14,
        padding: 16,
      }}
    >
      <Text
        style={{
          fontSize: 13,
          lineHeight: 20,
          color: tone === 'blue' ? colors.bannerBlueText : colors.ink,
        }}
      >
        {children}
      </Text>
    </View>
  );
}
