import { Linking, ScrollView, Text, View } from 'react-native';
import { colors } from '../theme';
import { ListCard, NoteCard, SectionLabel } from '../components/ListCard';
import { SubscreenHeader } from '../components/SubscreenHeader';
import { SCHOOL, telUrl } from '../data/school';
import { useAndroidBack } from '../useAndroidBack';

interface Props {
  onBack: () => void;
}

export function ContactSchoolScreen({ onBack }: Props) {
  useAndroidBack(onBack);

  return (
    <View style={{ flex: 1, backgroundColor: colors.canvas }}>
      <SubscreenHeader title="Contact the school office" onBack={onBack} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={{ fontSize: 14, color: colors.mute, lineHeight: 20, textAlign: 'center', marginBottom: 24 }}
        >
          {SCHOOL.officeHours}
        </Text>

        <ListCard
          items={[
            {
              id: 'call',
              icon: 'phone',
              tone: 'green',
              title: 'Call the front office',
              subtitle: SCHOOL.officePhone,
              onPress: () => Linking.openURL(telUrl(SCHOOL.officePhone)),
            },
            {
              id: 'email',
              icon: 'mail',
              title: 'Email the office',
              subtitle: SCHOOL.officeEmail,
              onPress: () => Linking.openURL(`mailto:${SCHOOL.officeEmail}`),
            },
          ]}
        />

        <View style={{ marginTop: 28 }}>
          <SectionLabel label="Urgent, outside hours" />
          <ListCard
            items={[
              {
                id: 'emergency',
                icon: 'alert-triangle',
                tone: 'red',
                title: 'School emergency line',
                subtitle: `${SCHOOL.emergencyPhone} · for a child still on site`,
                onPress: () => Linking.openURL(telUrl(SCHOOL.emergencyPhone)),
              },
            ]}
          />
        </View>

        <View style={{ marginTop: 16 }}>
          <NoteCard>
            SchoolShield never shows teachers' or gate staff's personal numbers. The office reaches
            them for you.
          </NoteCard>
        </View>
      </ScrollView>
    </View>
  );
}
