import { ScrollView, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme';
import { InitialsAvatar } from '../components';
import { ListCard, ListItem, SectionLabel } from '../components/ListCard';
import { StatusPill, SubscreenHeader } from '../components/SubscreenHeader';
import { useFamily } from '../data/FamilyContext';
import { useAndroidBack } from '../useAndroidBack';

interface Props {
  onBack: () => void;
  onOpenChild?: (childId: string) => void;
  onOpenHandler?: (handlerId: string) => void;
}

// TODO(data): additional guardians aren't in the family model yet.
const ADDITIONAL_GUARDIANS = [{ id: 'chukwuemeka', name: 'Chukwuemeka Okafor' }];

export function FamilySettingsScreen({ onBack, onOpenChild, onOpenHandler }: Props) {
  useAndroidBack(onBack);
  const { guardianName, children, handlers } = useFamily();

  const guardians: ListItem[] = [
    {
      id: 'you',
      title: 'You',
      leading: <InitialsAvatar name={guardianName} size={44} />,
      trailing: <StatusPill label="PRIMARY" bg="#ECFDF3" color="#027A48" />,
    },
    ...ADDITIONAL_GUARDIANS.map((g) => ({
      id: g.id,
      title: g.name,
      leading: <InitialsAvatar name={g.name} size={44} />,
      trailing: <StatusPill label="ADDITIONAL" bg={colors.soft} color={colors.badgeText} />,
    })),
  ];

  const childItems: ListItem[] = children.map((child) => ({
    id: child.id,
    title: child.name,
    subtitle: child.klass,
    leading: <InitialsAvatar name={child.name} size={44} color={child.color} />,
    onPress: onOpenChild ? () => onOpenChild(child.id) : undefined,
  }));

  const handlerItems: ListItem[] = handlers.map((h) => ({
    id: h.id,
    title: h.name,
    subtitle: h.relationship,
    leading: <InitialsAvatar name={h.name} size={44} color={h.color} />,
    trailing:
      h.status === 'ACTIVE' ? (
        <StatusPill label="ACTIVE" bg="#ECFDF3" color="#027A48" />
      ) : (
        <StatusPill label={h.status} bg={colors.soft} color={colors.badgeText} />
      ),
    onPress: onOpenHandler ? () => onOpenHandler(h.id) : undefined,
  }));

  return (
    <View style={{ flex: 1, backgroundColor: colors.canvas }}>
      <SubscreenHeader title="Family Settings" onBack={onBack} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={{ fontSize: 14, color: colors.mute, lineHeight: 20, marginBottom: 16 }}>
          You are the primary guardian.
        </Text>

        <View
          style={{
            flexDirection: 'row',
            gap: 10,
            backgroundColor: colors.bannerBlueBg,
            borderRadius: 14,
            padding: 14,
            marginBottom: 24,
          }}
        >
          <Feather name="info" size={16} color={colors.bannerBlueText} style={{ marginTop: 1 }} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: colors.bannerBlueText, marginBottom: 4 }}>
              Guardian Roles
            </Text>
            <Text style={{ fontSize: 13, color: colors.bannerBlueText, lineHeight: 19 }}>
              Primary guardian adds handlers, sets arrangements. Additional guardian can collect,
              drop off but can't add handlers
            </Text>
          </View>
        </View>

        <SectionLabel label="Guardians" />
        <ListCard items={guardians} />

        <View style={{ marginTop: 24 }}>
          <SectionLabel label="Children · from the school" />
          <ListCard items={childItems} />
        </View>

        <View style={{ marginTop: 24 }}>
          <SectionLabel label="Handlers" />
          <ListCard items={handlerItems} />
        </View>
      </ScrollView>
    </View>
  );
}
