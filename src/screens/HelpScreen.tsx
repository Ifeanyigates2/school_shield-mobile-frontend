import { ScrollView, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme';
import { PrimaryButton } from '../components';
import { ListCard, NoteCard, SectionLabel } from '../components/ListCard';
import { SubscreenHeader } from '../components/SubscreenHeader';
import { useAndroidBack } from '../useAndroidBack';

interface Props {
  onBack: () => void;
  onContactSchool: () => void;
}

const FAQS = [
  { id: 'pickup-code', q: 'How does a pickup code work?', a: 'Four digits, one child, one window, then it expires' },
  { id: 'change-collector', q: 'How do I change who collects today?', a: 'Child page → Manage pickup' },
  { id: 'lost-phone', q: 'What if I lose my phone?', a: 'Call the office to suspend access' },
  { id: 'no-code', q: 'Someone arrived without a code', a: 'The gate refuses and calls you' },
  { id: 'exceptions', q: 'How do exceptions work?', a: 'The office approves early and late requests' },
];

export function HelpScreen({ onBack, onContactSchool }: Props) {
  useAndroidBack(onBack);

  return (
    <View style={{ flex: 1, backgroundColor: colors.canvas }}>
      <SubscreenHeader title="Help" onBack={onBack} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Placeholder for the 3D question-bubble illustration */}
        <View style={{ alignItems: 'center', marginVertical: 20 }}>
          <View
            style={{
              width: 128,
              height: 128,
              borderRadius: 32,
              borderBottomLeftRadius: 8,
              backgroundColor: '#BFDBFE',
              borderWidth: 6,
              borderColor: '#DBEAFE',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Feather name="help-circle" size={64} color="#1D4ED8" />
          </View>
        </View>

        <SectionLabel label="Answers to common questions" />
        <ListCard
          items={FAQS.map((f) => ({ id: f.id, icon: 'help-circle', title: f.q, subtitle: f.a }))}
        />

        <View style={{ marginTop: 16 }}>
          <NoteCard tone="red">
            Got more questions or concerns? We're happy to help, reach out today.
          </NoteCard>
        </View>
      </ScrollView>

      <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 28, backgroundColor: colors.canvas }}>
        <PrimaryButton label="Contact the school" onPress={onContactSchool} />
      </View>
    </View>
  );
}
