import { useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { Field, InitialsAvatar, PrimaryButton } from '../components';
import { useFamily } from '../data/FamilyContext';
import { CHILDREN, Handler, childNames } from '../data/family';
import { colors } from '../theme';

type Page = 'list' | 'detail' | 'edit';

export function HandlersFlow({
  initialHandlerId,
  onBack,
  onOpenPickup,
}: {
  initialHandlerId: string;
  onBack: () => void;
  onOpenPickup: (handlerId: string) => void;
}) {
  const { handlers, setHandlers } = useFamily();
  const [page, setPage] = useState<Page>('list');
  const [id, setId] = useState(initialHandlerId);
  const current = handlers.find((h) => h.id === id) ?? handlers[0];

  const top = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 54;

  if (page === 'edit' && current) {
    return (
      <EditHandler
        handler={current}
        onCancel={() => setPage('detail')}
        onSave={(next) => {
          setHandlers((list) => list.map((h) => (h.id === next.id ? next : h)));
          setPage('detail');
        }}
      />
    );
  }

  if (page === 'detail' && current) {
    return (
      <HandlerDetail
        handler={current}
        onBack={() => setPage('list')}
        onEdit={() => setPage('edit')}
        onPause={() =>
          setHandlers((list) =>
            list.map((h) =>
              h.id === current.id
                ? {
                    ...h,
                    status: h.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE',
                    authorizedToday: h.status === 'ACTIVE' ? false : h.authorizedToday,
                  }
                : h,
            ),
          )
        }
        onRemove={() => {
          setHandlers((list) => list.filter((h) => h.id !== current.id));
          setPage('list');
        }}
      />
    );
  }

  return (
    <View style={styles.root}>
      <ExpoStatusBar style="dark" />
      <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: top }]}>
        <View style={styles.nav}>
          <Pressable onPress={onBack} hitSlop={12}><Text style={styles.back}>‹</Text></Pressable>
          <Text style={styles.navTitle}>Handlers</Text>
          <Text style={styles.navAction}>Add</Text>
        </View>
        <Text style={styles.lead}>
          People you have approved to collect Amara or David. Only these three, plus you, can be given a code.
        </Text>
        {handlers.map((h) => (
          <View key={h.id} style={styles.card}>
            <Pressable style={styles.row} onPress={() => { setId(h.id); setPage('detail'); }}>
              <InitialsAvatar name={h.name} size={48} color={h.color} />
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{h.name}</Text>
                <Text style={styles.meta}>
                  {h.relationship} · +234 {h.phone}
                </Text>
              </View>
              <View style={[styles.badge, h.status === 'PAUSED' && styles.badgePause]}>
                <Text style={[styles.badgeText, h.status === 'PAUSED' && styles.badgePauseText]}>{h.status}</Text>
              </View>
            </Pressable>
            <View style={styles.chips}>
              {h.pickup ? <Chip text={h.dropoff ? 'Pickup' : 'Pickup only'} /> : null}
              {h.dropoff ? <Chip text="Drop-off" /> : null}
              <Chip text={childNames(h.childIds) + (h.childIds.length === 1 ? ' only' : '')} />
              <Chip text={h.days} />
            </View>
            <View style={styles.actions}>
              <View style={{ flex: 1 }}>
                <PrimaryButton
                  outline
                  label="Authorize"
                  enabled={h.status === 'ACTIVE' && h.pickup}
                  onPress={() => onOpenPickup(h.id)}
                />
              </View>
              <Pressable style={styles.iconBtn} onPress={() => { setId(h.id); setPage('edit'); }}>
                <Text>✎</Text>
              </Pressable>
              <Pressable style={styles.iconDanger} onPress={() => { setId(h.id); setPage('detail'); }}>
                <Text>🗑</Text>
              </Pressable>
            </View>
          </View>
        ))}
        <View style={styles.warn}>
          <Text style={styles.warnText}>
            Chidinma has an active pickup authorization for today. Removing her will cancel it, and the Main Gate will be told immediately.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

function HandlerDetail({
  handler,
  onBack,
  onEdit,
  onPause,
  onRemove,
}: {
  handler: Handler;
  onBack: () => void;
  onEdit: () => void;
  onPause: () => void;
  onRemove: () => void;
}) {
  const top = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 54;
  return (
    <View style={styles.root}>
      <ExpoStatusBar style="dark" />
      <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: top }]}>
        <View style={styles.nav}>
          <Pressable onPress={onBack} hitSlop={12}><Text style={styles.back}>‹</Text></Pressable>
          <Text style={styles.navTitle}>Handler</Text>
          <Pressable onPress={onEdit}><Text style={styles.navAction}>Edit</Text></Pressable>
        </View>
        <View style={styles.profile}>
          <InitialsAvatar name={handler.name} size={56} color={handler.color} />
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{handler.name}</Text>
            <Text style={styles.meta}>
              {handler.relationship} · +234 {handler.phone}
            </Text>
            <View style={[styles.live, handler.status !== 'ACTIVE' && { backgroundColor: '#FEEEF0' }]}>
              <Text style={[styles.liveText, handler.status !== 'ACTIVE' && { color: '#B42318' }]}>
                ● {handler.status}{handler.authorizedToday ? ' · authorized today' : ''}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.card}>
          <Text style={styles.kicker}>WHAT SHE MAY DO</Text>
          <Perm ok={handler.pickup} title="Collect at pickup" right={handler.pickup ? 'Allowed' : 'Off'} />
          <Perm ok={handler.dropoff} title="Bring in at drop-off" right={handler.dropoff ? 'Allowed' : 'Off'} />
          <Perm ok={handler.childIds.length > 0} title={childNames(handler.childIds)} right={handler.childIds.length === 2 ? 'Both children' : 'One child'} />
          <Perm ok={false} title="Recurring authorization" right="Off" />
        </View>
        <View style={styles.card}>
          <Text style={styles.kicker}>RECENT PICKUPS</Text>
          <Perm ok title="Amara Okafor" right="" body="Fri 4 Sep · 2:52 PM · Main Gate" />
          <Perm ok title="Amara and David Okafor" right="" body="Wed 2 Sep · 2:47 PM · Main Gate" />
        </View>
        <View style={styles.note}>
          <Text style={styles.noteText}>
            Authorizing happens where you choose the day's collector — on Home or the child's screen. This page is for who she is and whether she stays on the list.
          </Text>
        </View>
        <PrimaryButton label={handler.status === 'ACTIVE' ? 'Pause Activity' : 'Resume Activity'} onPress={onPause} />
        <View style={{ height: 10 }} />
        <PrimaryButton dangerOutline label="Remove handler" onPress={onRemove} />
      </ScrollView>
    </View>
  );
}

function EditHandler({
  handler,
  onCancel,
  onSave,
}: {
  handler: Handler;
  onCancel: () => void;
  onSave: (h: Handler) => void;
}) {
  const [name, setName] = useState(handler.name);
  const [phone, setPhone] = useState(handler.phone);
  const [rel, setRel] = useState(handler.relationship);
  const [kids, setKids] = useState(handler.childIds);
  const phoneChanged = phone !== handler.phone;
  const top = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 54;

  return (
    <View style={styles.root}>
      <ExpoStatusBar style="dark" />
      <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: top }]}>
        <View style={styles.nav}>
          <Pressable onPress={onCancel} hitSlop={12}><Text style={styles.back}>‹</Text></Pressable>
          <Text style={styles.navTitle}>Edit handler</Text>
          <Pressable onPress={onCancel}><Text style={styles.navAction}>Cancel</Text></Pressable>
        </View>
        <View style={styles.photoCard}>
          <InitialsAvatar name={name} size={88} color={handler.color} />
          <View style={styles.rowBtns}>
            <View style={{ flex: 1 }}><PrimaryButton outline label="Replace photo" onPress={() => {}} /></View>
            <View style={{ flex: 1 }}><PrimaryButton outline label="Take new" onPress={() => {}} /></View>
          </View>
          <Text style={styles.meta}>A photo is required. It cannot be removed, only replaced.</Text>
        </View>
        <Field label="Full name" value={name} onChangeText={setName} autoCapitalize="words" />
        <Text style={styles.meta}>Gate staff read this name aloud. Spell it as her ID does.</Text>
        <View style={{ height: 14 }} />
        <Text style={[styles.fieldHint, phoneChanged && { color: '#B54708' }]}>
          Phone number{phoneChanged ? '   CHANGED' : ''}
        </Text>
        <Field label="" value={phone} onChangeText={setPhone} keyboardType="phone-pad" prefix="+234" error={phoneChanged} />
        <Text style={[styles.meta, phoneChanged && { color: '#B54708' }]}>
          Codes and pickup messages go here. Numeric keypad only.
        </Text>
        <View style={{ height: 14 }} />
        <Field label="Relationship" value={rel} onChangeText={setRel} autoCapitalize="words" />
        <Text style={styles.meta}>Nanny · Driver · Grandparent · Relative · Family friend</Text>
        <View style={styles.card}>
          <Text style={styles.kicker}>WHICH CHILDREN SHE MAY COLLECT</Text>
          {CHILDREN.map((c) => {
            const on = kids.includes(c.id);
            return (
              <Pressable
                key={c.id}
                style={styles.kidRow}
                onPress={() => setKids((ids) => (on ? ids.filter((x) => x !== c.id) : [...ids, c.id]))}
              >
                <View style={[styles.box, on && styles.boxOn]}>{on ? <Text style={styles.tick}>✓</Text> : null}</View>
                <View>
                  <Text style={styles.name}>{c.name}</Text>
                  <Text style={styles.meta}>{c.klass} · {on ? 'authorized' : 'not authorized'}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
        <View style={styles.amber}>
          <Text style={styles.amberText}>
            Chidinma is collecting Amara today. Changing her phone number sends a fresh code to the new number and the old one stops working.
          </Text>
        </View>
        <PrimaryButton
          label="Save changes"
          onPress={() => onSave({ ...handler, name, phone, relationship: rel, childIds: kids })}
        />
        <View style={{ height: 10 }} />
        <PrimaryButton outline label="Discard changes" onPress={onCancel} />
      </ScrollView>
    </View>
  );
}

function Chip({ text }: { text: string }) {
  return (
    <View style={styles.chip}>
      <Text style={styles.chipText}>{text}</Text>
    </View>
  );
}

function Perm({ ok, title, right, body }: { ok: boolean; title: string; right: string; body?: string }) {
  return (
    <View style={styles.perm}>
      <View style={[styles.dot, ok && styles.dotOn]}>{ok ? <Text style={styles.tick}>✓</Text> : null}</View>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{title}</Text>
        {body ? <Text style={styles.meta}>{body}</Text> : null}
      </View>
      {right ? <Text style={styles.meta}>{right}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.canvas },
  scroll: { paddingHorizontal: 24, paddingBottom: 36 },
  nav: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  back: { fontSize: 32, color: colors.ink, width: 40, marginTop: -6 },
  navTitle: { flex: 1, textAlign: 'center', fontWeight: '600', fontSize: 16 },
  navAction: { width: 64, textAlign: 'right', color: colors.navy, fontWeight: '700' },
  lead: { color: colors.mute, fontSize: 14, lineHeight: 21, marginBottom: 16 },
  card: { backgroundColor: colors.white, borderRadius: 20, padding: 14, marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  name: { fontWeight: '700', color: colors.ink },
  meta: { color: colors.mute, fontSize: 12, marginTop: 2 },
  badge: { backgroundColor: '#ECFDF3', borderRadius: 999, paddingHorizontal: 8, paddingVertical: 4 },
  badgeText: { color: '#027A48', fontSize: 10, fontWeight: '700' },
  badgePause: { backgroundColor: '#FEEEF0' },
  badgePauseText: { color: '#B42318' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 },
  chip: { backgroundColor: colors.soft, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 4 },
  chipText: { fontSize: 11, color: colors.ink },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 },
  iconBtn: { width: 48, height: 48, borderRadius: 14, backgroundColor: colors.soft, alignItems: 'center', justifyContent: 'center' },
  iconDanger: { width: 48, height: 48, borderRadius: 14, borderWidth: 1, borderColor: '#FECDCA', alignItems: 'center', justifyContent: 'center' },
  warn: { backgroundColor: '#FEF3F2', borderRadius: 14, padding: 12, marginTop: 8 },
  warnText: { color: '#B42318', fontSize: 13, lineHeight: 18 },
  profile: { flexDirection: 'row', gap: 12, backgroundColor: colors.white, borderRadius: 20, padding: 14, marginBottom: 12 },
  live: { alignSelf: 'flex-start', backgroundColor: '#ECFDF3', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4, marginTop: 8 },
  liveText: { color: '#027A48', fontSize: 11, fontWeight: '700' },
  kicker: { color: colors.mute, fontSize: 11, fontWeight: '700', letterSpacing: 1.1, marginBottom: 8 },
  perm: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 },
  dot: { width: 22, height: 22, borderRadius: 11, backgroundColor: colors.soft, alignItems: 'center', justifyContent: 'center' },
  dotOn: { backgroundColor: colors.success },
  tick: { color: colors.white, fontSize: 12, fontWeight: '700' },
  note: { backgroundColor: '#EEF4FF', borderRadius: 16, padding: 14, marginBottom: 20 },
  noteText: { color: colors.navy, fontSize: 13, lineHeight: 19 },
  photoCard: { backgroundColor: colors.white, borderRadius: 20, padding: 16, alignItems: 'center', marginBottom: 16 },
  rowBtns: { flexDirection: 'row', gap: 8, marginTop: 12, width: '100%' },
  fieldHint: { fontSize: 13, fontWeight: '500', color: colors.ink, marginBottom: 8 },
  kidRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 },
  box: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  boxOn: { backgroundColor: colors.navy, borderColor: colors.navy },
  amber: { backgroundColor: '#FFF6E5', borderRadius: 14, padding: 12, marginVertical: 16 },
  amberText: { color: '#B54708', fontSize: 13, lineHeight: 18 },
});
