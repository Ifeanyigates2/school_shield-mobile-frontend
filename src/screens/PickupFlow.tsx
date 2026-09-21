import { useState } from 'react';
import { Platform, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { Field, InitialsAvatar, PrimaryButton } from '../components';
import { CHILDREN, HANDLERS, WEEK } from '../data/family';
import { colors } from '../theme';

type Page = 'week' | 'choose' | 'onetime' | 'review' | 'authorized' | 'change' | 'states';

export function PickupFlow({
  childId,
  onBack,
}: {
  childId: string;
  onBack: () => void;
  onHandlers?: () => void;
}) {
  const child = CHILDREN.find((c) => c.id === childId) ?? CHILDREN[0];
  const [page, setPage] = useState<Page>('week');
  const [tab, setTab] = useState<'pickup' | 'dropoff'>('pickup');
  const [handlerId, setHandlerId] = useState('chidinma');
  const [oneName, setOneName] = useState('Daniel Adeyemi');
  const [onePhone, setOnePhone] = useState('809 553 2210');
  const [oneRel, setOneRel] = useState('Uncle');
  const [onePhoto, setOnePhoto] = useState(false);
  const handler = HANDLERS.find((h) => h.id === handlerId) ?? HANDLERS[0];
  const top = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 54;

  if (page === 'choose') {
    return (
      <View style={styles.root}>
        <ExpoStatusBar style="dark" />
        <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: top }]}>
          <Nav title="Choose a handler" onBack={() => setPage('week')} />
          <Text style={styles.h1}>Your saved handlers</Text>
          <Text style={styles.lead}>Ordered by how often they collect. Only people you have approved appear here.</Text>
          {HANDLERS.map((h) => {
            const on = handlerId === h.id;
            return (
              <Pressable key={h.id} onPress={() => setHandlerId(h.id)} style={[styles.card, on && styles.cardOn]}>
                <View style={styles.row}>
                  <InitialsAvatar name={h.name} size={48} color={h.color} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.name}>{h.name}</Text>
                    <Text style={styles.meta}>
                      {h.relationship} · +234 {h.phone}
                    </Text>
                    <Text style={styles.meta}>
                      {h.id === 'chidinma' ? 'Recurring · Amara and David · 14 pickups' : h.id === 'emeka' ? 'Verified ID · Amara only · 9 pickups' : 'Priority · Amara and David · Fridays'}
                    </Text>
                  </View>
                  <View style={[styles.radio, on && styles.radioOn]} />
                </View>
              </Pressable>
            );
          })}
          <Pressable style={styles.card} onPress={() => setPage('onetime')}>
            <Text style={styles.name}>+  Someone else, once</Text>
            <Text style={styles.meta}>Creates a one-time authorization</Text>
          </Pressable>
          <PrimaryButton label={`Continue with ${handler.name.split(' ')[0]}`} onPress={() => setPage('review')} />
        </ScrollView>
      </View>
    );
  }

  if (page === 'onetime') {
    return (
      <View style={styles.root}>
        <ExpoStatusBar style="dark" />
        <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: top }]}>
          <Nav title="One-time handler" right="3 of 4" onBack={() => setPage('choose')} />
          <View style={styles.amber}>
            <Text style={styles.amberText}>This person will only be authorized for this pickup. They are not added to your saved handlers.</Text>
          </View>
          <Field label="Full name" value={oneName} onChangeText={setOneName} autoCapitalize="words" />
          <Text style={styles.meta}>As written on the ID he will show at the gates.</Text>
          <View style={{ height: 14 }} />
          <Field label="Phone number" value={onePhone} onChangeText={setOnePhone} keyboardType="phone-pad" prefix="+234" />
          <Text style={styles.meta}>The code is sent here and only works from this number.</Text>
          <View style={{ height: 16 }} />
          <Text style={styles.kicker}>Relationship</Text>
          <View style={styles.chips}>
            {['Uncle', 'Driver', 'Family friend', 'Other'].map((item) => (
              <Pressable key={item} onPress={() => setOneRel(item)} style={[styles.pill, oneRel === item && styles.pillOn]}>
                <Text style={[styles.pillText, oneRel === item && styles.pillTextOn]}>{item}</Text>
              </Pressable>
            ))}
          </View>
          <Pressable onPress={() => setOnePhoto(true)} style={styles.photo}>
            <Text style={styles.name}>{onePhoto ? 'Photo added' : 'Take his photo · required'}</Text>
            <Text style={styles.meta}>Required — staff match this face</Text>
          </Pressable>
          <PrimaryButton label="Continue" enabled={oneName.trim().length > 0 && onePhoto} onPress={() => setPage('review')} />
        </ScrollView>
      </View>
    );
  }

  if (page === 'review') {
    return (
      <View style={styles.root}>
        <ExpoStatusBar style="dark" />
        <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: top }]}>
          <Nav title="Review" right="4 of 4" onBack={() => setPage('choose')} />
          <Text style={styles.h1}>Check this before you confirm</Text>
          <Text style={styles.lead}>Once confirmed, {handler.name.split(' ')[0]} gets a code that works only at this gate, in this window.</Text>
          <View style={styles.card}>
            <Text style={styles.kicker}>CHILD</Text>
            <Text style={styles.name}>{child.name}</Text>
            <Text style={styles.meta}>{child.klass} · Greenfield Academy</Text>
            <Text style={[styles.kicker, { marginTop: 14 }]}>PICKUP PERSON</Text>
            <Text style={styles.name}>{handler.name}</Text>
            <Text style={styles.meta}>
              {handler.relationship} · +234 {handler.phone}
            </Text>
            <Text style={[styles.kicker, { marginTop: 14 }]}>DATE</Text>
            <Text style={styles.name}>Monday, 7 September</Text>
            <Text style={styles.meta}>Today</Text>
            <Text style={[styles.kicker, { marginTop: 14 }]}>TIME</Text>
            <Text style={styles.name}>2:30 PM – 3:30 PM</Text>
            <Text style={styles.meta}>Standard dismissal window</Text>
            <Text style={[styles.kicker, { marginTop: 14 }]}>GATE</Text>
            <Text style={styles.name}>Main Gate</Text>
            <Text style={styles.meta}>Primary 1–6</Text>
            <View style={styles.oneTime}><Text style={styles.oneTimeText}>ONE TIME · usable only during the selected window</Text></View>
          </View>
          <PrimaryButton label="Confirm pickup" onPress={() => setPage('authorized')} />
          <View style={{ height: 10 }} />
          <PrimaryButton outline label="Go back" onPress={() => setPage('choose')} />
        </ScrollView>
      </View>
    );
  }

  if (page === 'authorized') {
    return (
      <View style={styles.darkRoot}>
        <ExpoStatusBar style="light" />
        <View style={{ height: top }} />
        <View style={styles.doneCheck}><Text style={{ color: colors.white, fontSize: 28 }}>✓</Text></View>
        <Text style={styles.darkTitle}>Pickup authorized</Text>
        <Text style={styles.darkSub}>
          {handler.name} can pick up {child.name.split(' ')[0]} today. She has been sent the code by SMS.
        </Text>
        <View style={styles.darkCard}>
          <View style={styles.row}>
            <InitialsAvatar name={handler.name} size={44} color={handler.color} />
            <View style={{ flex: 1 }}>
              <Text style={styles.darkName}>{handler.name}</Text>
              <Text style={styles.darkMeta}>{handler.relationship}</Text>
            </View>
            <View style={styles.notActive}><Text style={styles.notActiveText}>NOT YET ACTIVE</Text></View>
          </View>
          <DarkRow label="Date" value="Monday, 7 September" />
          <DarkRow label="Pickup window" value="2:30 PM – 3:30 PM" />
          <DarkRow label="Gate" value="Main Gate" />
          <Text style={styles.darkMeta}>Amara has pickup assigned. Codes are issued automatically at 2:15 PM.</Text>
        </View>
        <View style={{ flex: 1 }} />
        <PrimaryButton inverted label="View pickup details" onPress={() => setPage('states')} />
        <View style={{ height: 10 }} />
        <PrimaryButton ghost label={`Share with ${handler.name.split(' ')[0]} again`} onPress={() => {}} />
      </View>
    );
  }

  if (page === 'states') {
    const states = [
      { tag: 'NOT YET ACTIVE', name: 'Chidinma Okafor', time: '2:30-3:30', body: 'Becomes active at 2:30 PM', tone: 'neutral' },
      { tag: 'ACTIVE', name: 'Chidinma Okafor', time: '2:30-3:30', body: 'Code is live at the Main Gate now', tone: 'ok' },
      { tag: 'EXPIRING SOON', name: 'Chidinma Okafor', time: '2:30-3:30', body: 'Window closes in 12 minutes', tone: 'warn' },
      { tag: 'EXPIRED', name: 'Chidinma Okafor', time: '2:30-3:30', body: 'Window closed at 3:30 PM · issue a new one', tone: 'neutral' },
      { tag: 'CANCELLED', name: 'Chidinma Okafor', time: '2:30-3:30', body: 'You cancelled this at 1:14 PM', tone: 'neutral' },
      { tag: 'ALREADY USED', name: 'Chidinma Okafor', time: '2:30-3:30', body: 'Used at 2:52 PM · handover complete', tone: 'neutral' },
    ];
    return (
      <View style={styles.root}>
        <ExpoStatusBar style="dark" />
        <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: top }]}>
          <Nav title="Authorization states" onBack={() => setPage('authorized')} />
          <Text style={styles.lead}>The same card, six states. Each is named in words, never colour alone.</Text>
          {states.map((s) => (
            <View key={s.tag} style={[styles.stateCard, s.tone === 'ok' && styles.stateOk, s.tone === 'warn' && styles.stateWarn]}>
              <View style={styles.row}>
                <Text style={styles.stateTag}>{s.tag}</Text>
                <Text style={styles.name}>{s.name}</Text>
                <Text style={styles.meta}>{s.time}</Text>
              </View>
              <Text style={styles.meta}>{s.body}</Text>
            </View>
          ))}
          <PrimaryButton label="Change pickup" onPress={() => setPage('change')} />
        </ScrollView>
      </View>
    );
  }

  if (page === 'change') {
    return (
      <View style={styles.root}>
        <ExpoStatusBar style="dark" />
        <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: top }]}>
          <Nav title="Change pickup" onBack={() => setPage('week')} />
          <Text style={styles.kicker}>CURRENT PICKUP</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <InitialsAvatar name={handler.name} size={48} color={handler.color} />
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{handler.name}</Text>
                <Text style={styles.meta}>{handler.relationship} · 2:30 PM · Main Gate</Text>
              </View>
              <View style={styles.badge}><Text style={styles.badgeText}>ACTIVE</Text></View>
            </View>
            <Text style={styles.meta}>Created 6:40 AM · code delivered by SMS · not yet used</Text>
          </View>
          <View style={styles.red}>
            <Text style={styles.redText}>
              Changing the pickup person will cancel the current authorization. Chidinma’s code stops working immediately and she is told. Greenfield Academy and the Main Gate are updated at the same time.
            </Text>
          </View>
          <Text style={styles.kicker}>WHAT HAPPENS NEXT</Text>
          {['Chidinma’s authorization is cancelled', 'She and the Main Gate are notified', 'You choose the new pickup person', 'A fresh code is issued to them'].map((item, i) => (
            <View key={item} style={styles.nextRow}>
              <View style={[styles.num, i < 2 && styles.numOn]}><Text style={styles.numText}>{i + 1}</Text></View>
              <Text style={styles.name}>{item}</Text>
            </View>
          ))}
          <PrimaryButton danger label="Cancel and choose someone else" onPress={() => setPage('choose')} />
          <View style={{ height: 10 }} />
          <PrimaryButton outline label={`Keep ${handler.name.split(' ')[0]}`} onPress={() => setPage('week')} />
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <ExpoStatusBar style="dark" />
      <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: top }]}>
        <View style={styles.nav}>
          <Pressable onPress={onBack} hitSlop={12}><Text style={styles.back}>‹</Text></Pressable>
          <Text style={styles.navTitle}>Manage Pickup</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.childHead}>
          <InitialsAvatar name={child.name} size={56} color={child.color} />
          <View>
            <Text style={styles.h1}>{child.name}</Text>
            <Text style={styles.meta}>{child.klass}</Text>
          </View>
        </View>
        <View style={styles.tabs}>
          <Pressable onPress={() => setTab('pickup')} style={[styles.tab, tab === 'pickup' && styles.tabOn]}>
            <Text style={[styles.tabText, tab === 'pickup' && styles.tabTextOn]}>Manage Pickup</Text>
          </Pressable>
          <Pressable onPress={() => setTab('dropoff')} style={[styles.tab, tab === 'dropoff' && styles.tabOn]}>
            <Text style={[styles.tabText, tab === 'dropoff' && styles.tabTextOn]}>Manage Drop-off</Text>
          </Pressable>
        </View>
        <View style={styles.weekHead}>
          <Text style={styles.name}>This Week ▾</Text>
          <View style={styles.avatars}>
            {HANDLERS.map((h) => (
              <InitialsAvatar key={h.id} name={h.name} size={28} color={h.color} />
            ))}
          </View>
        </View>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHead]}>
            <Text style={[styles.meta, { flex: 1 }]}>Day</Text>
            <Text style={[styles.meta, { flex: 2 }]}>Handler</Text>
          </View>
          {WEEK.map((row) => {
            const h = HANDLERS.find((x) => x.id === row.handlerId);
            return (
              <View key={row.day} style={styles.tableRow}>
                <Text style={[styles.name, { flex: 1 }]}>{row.day}</Text>
                <View style={[styles.row, { flex: 2 }]}>
                  <InitialsAvatar name={h?.name ?? ''} size={28} color={h?.color} />
                  <Text style={styles.meta}>{h?.name.split(' ').join('\n')}</Text>
                </View>
                <Pressable onPress={() => setPage('change')}><Text>✎</Text></Pressable>
              </View>
            );
          })}
        </View>
        <PrimaryButton label="Authorize today’s pickup" onPress={() => setPage('choose')} />
      </ScrollView>
    </View>
  );
}

function Nav({ title, onBack, right }: { title: string; onBack: () => void; right?: string }) {
  return (
    <View style={styles.nav}>
      <Pressable onPress={onBack} hitSlop={12}><Text style={styles.back}>‹</Text></Pressable>
      <Text style={styles.navTitle}>{title}</Text>
      <Text style={[styles.meta, { width: 56, textAlign: 'right' }]}>{right ?? ''}</Text>
    </View>
  );
}

function DarkRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={[styles.row, { justifyContent: 'space-between', marginTop: 10 }]}>
      <Text style={styles.darkMeta}>{label}</Text>
      <Text style={styles.darkName}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.canvas },
  darkRoot: { flex: 1, backgroundColor: colors.navyDeep, paddingHorizontal: 24, paddingBottom: 28 },
  scroll: { paddingHorizontal: 24, paddingBottom: 36 },
  nav: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  back: { fontSize: 32, color: colors.ink, width: 40, marginTop: -6 },
  navTitle: { flex: 1, textAlign: 'center', fontWeight: '600', fontSize: 16 },
  h1: { fontSize: 22, fontWeight: '700', color: colors.ink, marginBottom: 6 },
  lead: { color: colors.mute, fontSize: 14, lineHeight: 21, marginBottom: 16 },
  card: { backgroundColor: colors.white, borderRadius: 20, padding: 14, marginBottom: 10 },
  cardOn: { borderWidth: 1.5, borderColor: colors.navy },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  name: { fontWeight: '700', color: colors.ink },
  meta: { color: colors.mute, fontSize: 12, marginTop: 2 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.line },
  radioOn: { backgroundColor: colors.navy, borderColor: colors.navy },
  amber: { backgroundColor: '#FFF6E5', borderRadius: 14, padding: 12, marginBottom: 16 },
  amberText: { color: '#B54708', fontSize: 13, lineHeight: 18 },
  kicker: { color: colors.mute, fontSize: 11, fontWeight: '700', letterSpacing: 1.1, marginBottom: 8 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, backgroundColor: colors.white },
  pillOn: { backgroundColor: colors.navy },
  pillText: { fontWeight: '600', color: colors.ink, fontSize: 13 },
  pillTextOn: { color: colors.white },
  photo: { backgroundColor: colors.white, borderRadius: 18, padding: 14, marginVertical: 18, borderWidth: 1, borderStyle: 'dashed', borderColor: colors.line },
  oneTime: { alignSelf: 'flex-start', backgroundColor: colors.navy, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4, marginTop: 14 },
  oneTimeText: { color: colors.white, fontSize: 10, fontWeight: '700' },
  doneCheck: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#157A4B', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 16 },
  darkTitle: { color: colors.white, fontSize: 28, fontWeight: '700', textAlign: 'center' },
  darkSub: { color: 'rgba(255,255,255,0.72)', textAlign: 'center', marginTop: 8, marginBottom: 20, lineHeight: 21 },
  darkCard: { backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 20, padding: 16 },
  darkName: { color: colors.white, fontWeight: '700' },
  darkMeta: { color: 'rgba(255,255,255,0.65)', fontSize: 13, marginTop: 8 },
  notActive: { backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 999, paddingHorizontal: 8, paddingVertical: 4 },
  notActiveText: { color: colors.white, fontSize: 9, fontWeight: '700' },
  stateCard: { backgroundColor: colors.white, borderRadius: 16, padding: 12, marginBottom: 8 },
  stateOk: { backgroundColor: '#ECFDF3' },
  stateWarn: { backgroundColor: '#ECFDF3' },
  stateTag: { fontSize: 10, fontWeight: '700', color: colors.mute, marginRight: 8 },
  childHead: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  tabs: { flexDirection: 'row', gap: 16, borderBottomWidth: 1, borderBottomColor: colors.line, marginBottom: 14 },
  tab: { paddingBottom: 10 },
  tabOn: { borderBottomWidth: 2, borderBottomColor: colors.navy },
  tabText: { color: colors.mute, fontWeight: '600' },
  tabTextOn: { color: colors.navy },
  weekHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  avatars: { flexDirection: 'row', gap: 4 },
  table: { backgroundColor: colors.white, borderRadius: 20, padding: 12, marginBottom: 20 },
  tableRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.soft },
  tableHead: { borderBottomColor: colors.line },
  badge: { backgroundColor: '#ECFDF3', borderRadius: 999, paddingHorizontal: 8, paddingVertical: 4 },
  badgeText: { color: '#027A48', fontSize: 10, fontWeight: '700' },
  red: { backgroundColor: '#FEF3F2', borderRadius: 14, padding: 12, marginVertical: 14 },
  redText: { color: '#B42318', fontSize: 13, lineHeight: 18 },
  nextRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  num: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.soft, alignItems: 'center', justifyContent: 'center' },
  numOn: { backgroundColor: colors.danger },
  numText: { color: colors.ink, fontWeight: '700', fontSize: 12 },
});
