import { Pressable, Text, View } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme';
import { StatusPill } from './SubscreenHeader';
import { BUS_JOURNEY, BusStage } from '../data/busJourney';

interface Props {
  childName: string;
  stage: BusStage;
  homeAt?: string;
  alertedAt?: string;
  /** Set when the guardian chose "remind me in 15 minutes" */
  remindAt?: string | null;
  onPress: () => void;
  /** Demo only: advances the journey to its next stage */
  onLongPress?: () => void;
}

const TONES = {
  green: { bg: '#ECFDF3', border: '#A6F4C5', icon: '#027A48', pillBg: '#D1FADF', pill: '#027A48' },
  amber: { bg: '#FFFAEB', border: '#FEDF89', icon: '#B54708', pillBg: '#FEF0C7', pill: '#B54708' },
  red: { bg: '#FEF3F2', border: '#FECDCA', icon: '#D92D20', pillBg: '#FEE4E2', pill: '#B42318' },
};

/** Home / Children entry point into the bus-journey flow for a child who rides a route. */
export function BusJourneyCard({ childName, stage, homeAt, alertedAt, remindAt, onPress, onLongPress }: Props) {
  const j = BUS_JOURNEY;
  const { subject: he, object: him } = j.pronoun;

  const content = {
    at_school: {
      tone: TONES.green,
      pill: 'AT SCHOOL',
      title: `${childName} is at school`,
      body: `${j.route} arrived ${j.busArrived}. ${j.gateStaff} confirmed ${him} off the bus at ${j.arrivedAtSchool}.`,
    },
    awaiting_home: {
      tone: TONES.amber,
      pill: 'NEEDS YOU',
      title: `Is ${childName} home?`,
      body: remindAt
        ? `${j.route} dropped at ${j.leftSchool}. We'll ask again at ${remindAt}.`
        : `${j.route} dropped at ${j.leftSchool}. Only you can confirm ${he} arrived.`,
    },
    closed: {
      tone: TONES.green,
      pill: 'CLOSED',
      title: `${childName}’s day is closed`,
      body: `School at ${j.arrivedAtSchool}, home at ${homeAt ?? '—'}. Nothing further is needed.`,
    },
    escalated: {
      tone: TONES.red,
      pill: 'ESCALATED',
      title: 'The school has been told',
      body: `Alerted ${alertedAt ?? '—'}. ${j.officeContact} is calling the ${j.route} supervisor.`,
    },
  }[stage];
  const { tone } = content;

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => ({
        backgroundColor: tone.bg,
        borderColor: tone.border,
        borderWidth: 1,
        borderRadius: 24,
        padding: 16,
        marginBottom: 16,
        opacity: pressed ? 0.9 : 1,
      })}
    >
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            backgroundColor: colors.white,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MaterialCommunityIcons name="bus" size={20} color={tone.icon} />
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <Text style={{ flex: 1, fontSize: 16, fontWeight: '700', color: colors.ink }}>{content.title}</Text>
            <StatusPill label={content.pill} bg={tone.pillBg} color={tone.pill} />
          </View>
          <Text style={{ fontSize: 13, lineHeight: 19, color: '#475467', marginTop: 4 }}>{content.body}</Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 4, marginTop: 10 }}>
        <Text style={{ fontSize: 13, fontWeight: '700', color: colors.navy }}>
          {stage === 'awaiting_home' ? 'Close the day' : 'View journey'}
        </Text>
        <Feather name="chevron-right" size={16} color={colors.navy} />
      </View>
    </Pressable>
  );
}

/** Status pill for the bus child's card on the Children tab. */
export function busStagePill(stage: BusStage) {
  return {
    at_school: { label: 'AT SCHOOL', bg: '#E7F6EC', color: '#027A48' },
    awaiting_home: { label: 'ON THE WAY HOME', bg: '#FFFAEB', color: '#B54708' },
    closed: { label: 'HOME', bg: '#E7F6EC', color: '#027A48' },
    escalated: { label: 'NOT HOME', bg: '#FEF3F2', color: '#B42318' },
  }[stage];
}
