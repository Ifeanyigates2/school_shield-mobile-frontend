import { ReactNode } from 'react';
import { Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme';
import { PrimaryButton } from '../components';
import { PILL_TONES, PillTone } from '../components/ListCard';
import { StatusPill, SUBSCREEN_TOP_INSET } from '../components/SubscreenHeader';
import { BUS_JOURNEY, BusStage } from '../data/busJourney';
import { SCHOOL, telUrl } from '../data/school';
import { useAndroidBack } from '../useAndroidBack';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  /** Child's first name, e.g. "David" */
  childName: string;
  stage: BusStage;
  /** Time the guardian confirmed home, e.g. "3:13 PM" */
  homeAt?: string;
  /** Time the guardian reported the child missing */
  alertedAt?: string;
  onBack: () => void;
  onConfirmHome: () => void;
  onRemindLater: () => void;
  onReportNotArrived: () => void;
  onViewRecord: () => void;
}

type CalloutTone = 'green' | 'amber' | 'red';

const CALLOUT: Record<CalloutTone, { bg: string; border: string; dot: string; title: string; body: string }> = {
  green: { bg: '#ECFDF3', border: '#A6F4C5', dot: '#027A48', title: '#05603A', body: '#05603A' },
  amber: { bg: '#FFFAEB', border: '#FEDF89', dot: '#B54708', title: '#93370D', body: '#B54708' },
  red: { bg: '#FEF3F2', border: '#FECDCA', dot: '#D92D20', title: '#B42318', body: '#B42318' },
};

const PILLS = {
  closed: { label: 'CLOSED', bg: '#ECFDF3', color: '#027A48' },
  confirmed: { label: 'CONFIRMED', bg: '#ECFDF3', color: '#027A48' },
  open: { label: 'OPEN', bg: '#FFFAEB', color: '#B54708' },
  pending: { label: 'PENDING', bg: colors.soft, color: '#475467' },
  inProgress: { label: 'IN PROGRESS', bg: '#FFFAEB', color: '#B54708' },
};

// ─── Building blocks ──────────────────────────────────────────────────────────

function FlowHeader({ backLabel, context, onBack }: { backLabel: string; context: string; onBack: () => void }) {
  return (
    <View
      style={{
        paddingTop: SUBSCREEN_TOP_INSET + 8,
        paddingHorizontal: 12,
        paddingBottom: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.canvas,
      }}
    >
      <ExpoStatusBar style="dark" />
      <Pressable
        onPress={onBack}
        hitSlop={8}
        style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 4, opacity: pressed ? 0.6 : 1 })}
      >
        <Feather name="chevron-left" size={22} color={colors.navy} />
        <Text style={{ fontSize: 16, fontWeight: '600', color: colors.navy }}>{backLabel}</Text>
      </Pressable>
      <Text style={{ fontSize: 13, fontWeight: '600', color: '#475467', letterSpacing: 0.6, marginRight: 4 }}>
        {context}
      </Text>
    </View>
  );
}

function Callout({ tone, title, children }: { tone: CalloutTone; title: string; children: ReactNode }) {
  const t = CALLOUT[tone];
  return (
    <View
      style={{
        flexDirection: 'row',
        gap: 12,
        backgroundColor: t.bg,
        borderColor: t.border,
        borderWidth: 1,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
      }}
    >
      <View
        style={{
          width: 26,
          height: 26,
          borderRadius: 13,
          backgroundColor: t.dot,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {tone === 'green' ? (
          <Feather name="check" size={14} color={colors.white} />
        ) : (
          <Text style={{ color: colors.white, fontSize: 14, fontWeight: '800' }}>!</Text>
        )}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 15, fontWeight: '700', color: t.title, marginBottom: 4 }}>{title}</Text>
        <Text style={{ fontSize: 13, lineHeight: 20, color: t.body }}>{children}</Text>
      </View>
    </View>
  );
}

interface Row {
  id: string;
  icon: React.ComponentProps<typeof Feather>['name'] | 'bus';
  tone: PillTone;
  title: string;
  subtitle: string;
  pill?: { label: string; bg: string; color: string };
}

/** White card with an uppercase label inside its top edge, then icon rows. */
function RecordCard({ label, rows }: { label: string; rows: Row[] }) {
  return (
    <View
      style={{
        backgroundColor: colors.white,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.line,
        overflow: 'hidden',
        marginBottom: 16,
      }}
    >
      <Text
        style={{
          fontSize: 11,
          fontWeight: '700',
          color: colors.mute,
          letterSpacing: 1.2,
          textTransform: 'uppercase',
          paddingHorizontal: 16,
          paddingTop: 14,
          paddingBottom: 12,
        }}
      >
        {label}
      </Text>
      {rows.map((row) => {
        const tone = PILL_TONES[row.tone];
        return (
          <View key={row.id}>
            <View style={{ height: 1, backgroundColor: colors.line }} />
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 12 }}>
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
                {row.icon === 'bus' ? (
                  <MaterialCommunityIcons name="bus" size={18} color={tone.icon} />
                ) : (
                  <Feather name={row.icon} size={16} color={tone.icon} />
                )}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: colors.ink, marginBottom: 2 }}>{row.title}</Text>
                <Text style={{ fontSize: 12, color: colors.mute, lineHeight: 17 }}>{row.subtitle}</Text>
              </View>
              {row.pill && <StatusPill {...row.pill} />}
            </View>
          </View>
        );
      })}
    </View>
  );
}

function Hero({ title, body }: { title: string; body: string }) {
  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={{ fontSize: 26, fontWeight: '700', color: colors.ink, letterSpacing: -0.5, marginBottom: 8 }}>
        {title}
      </Text>
      <Text style={{ fontSize: 15, lineHeight: 22, color: '#475467' }}>{body}</Text>
    </View>
  );
}

function Shell({ header, children }: { header: ReactNode; children: ReactNode }) {
  return (
    <View style={{ flex: 1, backgroundColor: colors.canvas }}>
      {header}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </View>
  );
}

const buttonGap = { marginTop: 12 };

// ─── Main Flow ────────────────────────────────────────────────────────────────

export function BusJourneyFlow({
  childName,
  stage,
  homeAt = '3:13 PM',
  alertedAt = '3:29 PM',
  onBack,
  onConfirmHome,
  onRemindLater,
  onReportNotArrived,
  onViewRecord,
}: Props) {
  useAndroidBack(onBack);

  const j = BUS_JOURNEY;
  const { subject: he, object: him } = j.pronoun;
  const He = he[0].toUpperCase() + he.slice(1);
  const possessive = `${childName}’s`;

  if (stage === 'at_school') {
    return (
      <Shell header={<FlowHeader backLabel="Home" context="THIS MORNING" onBack={onBack} />}>
        <Hero
          title={`${childName} is at school`}
          body={`${j.route} pulled in at ${j.busArrived} and ${j.gateStaff} confirmed ${him} off the bus three minutes later.`}
        />
        <Callout tone="green" title={`Recorded at ${j.gate} · ${j.arrivedAtSchool}`}>
          No adult presented a code. The gate issued {j.gateCode} and matched it to {childName} as {he} stepped down.
        </Callout>
        <RecordCard
          label="The record"
          rows={[
            { id: 'bus', icon: 'bus', tone: 'neutral', title: `${j.route} · seat ${j.seat}`, subtitle: `Arrived ${j.busArrived}` },
            {
              id: 'sighted',
              icon: 'eye',
              tone: 'green',
              title: `Sighted by ${j.gateStaff}`,
              subtitle: `Gate duty staff · ${j.arrivedAtSchool}`,
              pill: PILLS.confirmed,
            },
            { id: 'code', icon: 'grid', tone: 'neutral', title: `Code ${j.gateCode}`, subtitle: 'Issued by the gate device, never sent to anyone' },
          ]}
        />
        <View style={{ backgroundColor: '#EAECF0', borderRadius: 14, padding: 16, marginBottom: 20 }}>
          <Text style={{ fontSize: 13, lineHeight: 20, color: '#475467' }}>
            You will be asked to confirm {he} is home this afternoon. That closes the day.
          </Text>
        </View>
        <PrimaryButton label="See the full record" onPress={onViewRecord} />
        <PrimaryButton label="Back to Home" outline onPress={onBack} style={buttonGap} />
      </Shell>
    );
  }

  if (stage === 'awaiting_home') {
    return (
      <Shell header={<FlowHeader backLabel="Home" context="NEEDS YOU" onBack={onBack} />}>
        <Hero
          title={`Is ${childName} home?`}
          body={`The bus dropped at ${j.leftSchool}. A bus or independent journey is only closed when you say they arrived.`}
        />
        <Callout tone="amber" title="The day is still open">
          The school recorded {him} leaving. Only you can record {him} arriving — nobody at the gate can see the other end
          of the journey.
        </Callout>
        <RecordCard
          label="Today, so far"
          rows={[
            {
              id: 'arrived',
              icon: 'bus',
              tone: 'green',
              title: `Arrived at school ${j.arrivedAtSchool}`,
              subtitle: `${j.route} · confirmed by ${j.gateStaff}`,
              pill: PILLS.closed,
            },
            {
              id: 'left',
              icon: 'bus',
              tone: 'amber',
              title: `Left school ${j.leftSchool}`,
              subtitle: `${j.route} · confirmed by ${j.gateStaff}`,
              pill: PILLS.open,
            },
            { id: 'home', icon: 'home', tone: 'neutral', title: 'Home', subtitle: 'Waiting on you', pill: PILLS.pending },
          ]}
        />
        <PrimaryButton label={`Yes, ${he} is home`} onPress={onConfirmHome} style={{ marginTop: 4 }} />
        <PrimaryButton label="Not yet — remind me in 15 minutes" outline onPress={onRemindLater} style={buttonGap} />
        <PrimaryButton label={`${He} has not arrived`} dangerOutline onPress={onReportNotArrived} style={buttonGap} />
      </Shell>
    );
  }

  if (stage === 'closed') {
    return (
      <Shell header={<FlowHeader backLabel="Home" context="CLOSED" onBack={onBack} />}>
        <Hero
          title={`${possessive} day is closed`}
          body={`School at ${j.arrivedAtSchool}, home at ${homeAt}. Both ends recorded, by two different people.`}
        />
        <Callout tone="green" title="Nothing further is needed">
          This record cannot be edited, by you or by the school. It sits in Activity permanently.
        </Callout>
        <RecordCard
          label="The complete day"
          rows={[
            {
              id: 'arrived',
              icon: 'bus',
              tone: 'green',
              title: `Arrived at school ${j.arrivedAtSchool}`,
              subtitle: `Confirmed by ${j.gateStaff} at the gate`,
              pill: PILLS.closed,
            },
            {
              id: 'left',
              icon: 'bus',
              tone: 'green',
              title: `Left school ${j.leftSchool}`,
              subtitle: `Confirmed by ${j.gateStaff} at the gate`,
              pill: PILLS.closed,
            },
            { id: 'home', icon: 'home', tone: 'green', title: `Home ${homeAt}`, subtitle: 'Confirmed by you', pill: PILLS.closed },
          ]}
        />
        <PrimaryButton label="Done" onPress={onBack} style={{ marginTop: 4 }} />
        <PrimaryButton label={`See ${possessive} record`} outline onPress={onViewRecord} style={buttonGap} />
      </Shell>
    );
  }

  // escalated
  return (
    <Shell header={<FlowHeader backLabel="Back" context="ESCALATED" onBack={onBack} />}>
      <Hero
        title="The school has been told"
        body={`${childName} left on ${j.route} at ${j.leftSchool} and has not reached you. The office and the bus supervisor were alerted the moment you tapped.`}
      />
      <Callout tone="red" title={`Alerted ${alertedAt}`}>
        {j.officeContact} is calling the {j.route} supervisor now. Keep this screen open — you will see updates here.
      </Callout>
      <RecordCard
        label="What the school knows"
        rows={[
          {
            id: 'boarded',
            icon: 'bus',
            tone: 'green',
            title: `Boarded ${j.route} at ${j.leftSchool}`,
            subtitle: `Confirmed by ${j.gateStaff}`,
          },
          {
            id: 'supervisor',
            icon: 'phone',
            tone: 'amber',
            title: 'Supervisor being called',
            subtitle: `${j.route} · ${j.supervisor}`,
            pill: PILLS.inProgress,
          },
          {
            id: 'reported',
            icon: 'shield',
            tone: 'red',
            title: 'Guardian reported not home',
            subtitle: `${alertedAt} · by you`,
            pill: PILLS.open,
          },
        ]}
      />
      <PrimaryButton
        label="Call the school office"
        onPress={() => Linking.openURL(telUrl(SCHOOL.officePhone))}
        style={{ marginTop: 4 }}
      />
      <PrimaryButton label={`${He} has arrived after all`} outline onPress={onConfirmHome} style={buttonGap} />
    </Shell>
  );
}
