import { ScrollView, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme';
import { ListCard, ListItem, SectionLabel } from '../components/ListCard';
import { StatusPill, SubscreenHeader } from '../components/SubscreenHeader';
import { useFamily } from '../data/FamilyContext';
import { firstName } from '../data/family';
import { SCHOOL } from '../data/school';
import { useAndroidBack } from '../useAndroidBack';

interface Props {
  onBack: () => void;
}

/** Placeholder crest until the school's real crest image is added to assets. */
function SchoolCrest() {
  return (
    <View style={{ alignItems: 'center', marginVertical: 24 }}>
      <Text style={{ color: colors.gold, fontSize: 16, letterSpacing: 6, marginBottom: 6 }}>★★★★★</Text>
      <View
        style={{
          width: 110,
          height: 124,
          backgroundColor: colors.navy,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          borderBottomLeftRadius: 55,
          borderBottomRightRadius: 55,
          borderWidth: 4,
          borderColor: '#1E3A64',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Feather name="book-open" size={40} color={colors.white} />
      </View>
      <View
        style={{
          marginTop: -14,
          backgroundColor: colors.navy,
          borderRadius: 6,
          paddingHorizontal: 16,
          paddingVertical: 6,
          borderWidth: 2,
          borderColor: colors.gold,
        }}
      >
        <Text style={{ color: colors.white, fontSize: 10, fontWeight: '700', letterSpacing: 1 }}>
          {SCHOOL.name.toUpperCase()}
        </Text>
      </View>
    </View>
  );
}

function joinNames(names: string[]) {
  if (names.length <= 1) return names.join('');
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
}

export function SchoolDetailsScreen({ onBack }: Props) {
  useAndroidBack(onBack);
  const { children } = useFamily();

  // Group the family's children by the gate the school assigned them.
  const gates = new Map<string, string[]>();
  children.forEach((child) => {
    const gate = child.gate ?? 'Main Gate';
    gates.set(gate, [...(gates.get(gate) ?? []), firstName(child.name)]);
  });

  const gateItems: ListItem[] = [
    ...[...gates.entries()].map(([gate, names]) => ({
      id: gate,
      icon: 'home' as const,
      title: gate,
      subtitle: joinNames(names),
    })),
    {
      id: 'route-b',
      icon: 'truck',
      tone: 'amber',
      title: 'Route B · Lekki Phase 1 Bus',
      subtitle: 'Assigned by the school',
      trailing: <StatusPill label="SYNCED" bg="#ECFDF3" color="#027A48" />,
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.canvas }}>
      <SubscreenHeader title={SCHOOL.name} onBack={onBack} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={{ fontSize: 14, color: colors.mute, lineHeight: 20, textAlign: 'center' }}>
          {SCHOOL.address}
        </Text>

        <SchoolCrest />

        <SectionLabel label="Windows" />
        <ListCard
          items={[
            {
              id: 'dropoff',
              icon: 'clock',
              tone: 'green',
              title: 'Drop-off 7:00 – 8:00 AM',
              subtitle: 'Monday to Friday',
            },
            {
              id: 'pickup',
              icon: 'clock',
              tone: 'red',
              title: 'Pickup 2:30 – 3:30 PM',
              subtitle: 'Friday 1:30 – 2:30 PM this term',
            },
          ]}
        />

        <View style={{ marginTop: 24 }}>
          <SectionLabel label="Your children's gates and routes" />
          <ListCard items={gateItems} />
        </View>

        <View style={{ marginTop: 24 }}>
          <SectionLabel label="This term" />
          <ListCard
            items={[
              {
                id: 'midterm',
                icon: 'info',
                tone: 'red',
                title: 'Mid-term break',
                subtitle: 'Thu 22 – Fri 23 October · no school',
              },
            ]}
          />
        </View>
      </ScrollView>
    </View>
  );
}
