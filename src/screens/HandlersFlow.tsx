import { ReactNode, useState } from 'react';
import { Platform, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { Field, InitialsAvatar, PrimaryButton } from '../components';
import { useFamily } from '../data/FamilyContext';
import { Handler, cancelHandlerAuthorizations, childNames, firstName, handlerHasAuth } from '../data/family';
import { colors } from '../theme';
import { useAndroidBack } from '../useAndroidBack';

type Page = 'list' | 'detail' | 'edit' | 'add';

export function HandlersFlow({
  initialHandlerId,
  onBack,
  onOpenPickup,
}: {
  initialHandlerId: string;
  onBack: () => void;
  onOpenPickup: (handlerId: string) => void;
}) {
  const { handlers, setHandlers, children, authorizations, setAuthorizations } = useFamily();
  const [page, setPage] = useState<Page>('list');
  const [id, setId] = useState(initialHandlerId);
  const [pendingRemove, setPendingRemove] = useState<{ handler: Handler; goList: boolean } | null>(null);
  const current = handlers.find((h) => h.id === id) ?? handlers[0];
  const hardwareBack = () => {
    if (pendingRemove) {
      setPendingRemove(null);
      return;
    }
    if (page === 'edit' || page === 'add') setPage(page === 'add' ? 'list' : 'detail');
    else if (page === 'detail') setPage('list');
    else onBack();
  };
  useAndroidBack(hardwareBack);

  const confirmRemove = (handler: Handler, goList: boolean) => {
    setPendingRemove({ handler, goList });
  };

  const finishRemove = () => {
    if (!pendingRemove) return;
    setHandlers((list) => list.filter((h) => h.id !== pendingRemove.handler.id));
    setAuthorizations((list) => cancelHandlerAuthorizations(list, pendingRemove.handler.id));
    if (pendingRemove.goList) setPage('list');
    setPendingRemove(null);
  };

  const wrap = (node: ReactNode) => (
    <View style={{ flex: 1 }}>
      {node}
      {pendingRemove ? (
        <View style={styles.modalWrap}>
          <Pressable style={styles.modalDim} onPress={() => setPendingRemove(null)} />
          <View style={styles.modalCard}>
            <Text style={styles.name}>Remove handler?</Text>
            <Text style={[styles.meta, { marginTop: 8, marginBottom: 16 }]}>
              {pendingRemove.handler.name.split(' ')[0]} will be taken off your list. If they have an active pickup today, it is cancelled and the Main Gate is told immediately.
            </Text>
            <PrimaryButton outline label="Keep them" onPress={() => setPendingRemove(null)} />
            <View style={{ height: 10 }} />
            <PrimaryButton danger label="Remove" onPress={finishRemove} />
          </View>
        </View>
      ) : null}
    </View>
  );

  const top = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 54;

  if (page === 'add') {
    return wrap(
      <EditHandler
        handler={{
          id: '',
          name: '',
          relationship: '',
          phone: '',
          status: 'ACTIVE',
          pickup: true,
          dropoff: false,
          childIds: children.map((c) => c.id),
          days: 'Any school day',
          color: '#0B1F3D',
        }}
        mode="add"
        onCancel={() => setPage('list')}
        onSave={(next) => {
          const id = `handler-${Date.now()}`;
          setHandlers((list) => [{ ...next, id }, ...list]);
          setId(id);
          setPage('detail');
        }}
      />,
    );
  }

  if (page === 'edit' && current) {
    return wrap(
      <EditHandler
        handler={current}
        onCancel={() => setPage('detail')}
        onSave={(next) => {
          setHandlers((list) => list.map((h) => (h.id === next.id ? next : h)));
          setPage('detail');
        }}
      />,
    );
  }

  if (page === 'detail' && current) {
    return wrap(
      <HandlerDetail
        handler={current}
        onBack={() => setPage('list')}
        onEdit={() => setPage('edit')}
        onPause={() => {
          const pausing = current.status === 'ACTIVE';
          setHandlers((list) =>
            list.map((h) =>
              h.id === current.id ? { ...h, status: pausing ? 'PAUSED' : 'ACTIVE' } : h,
            ),
          );
          if (pausing) {
            setAuthorizations((list) => cancelHandlerAuthorizations(list, current.id));
          }
        }}
        onRemove={() => confirmRemove(current, true)}
      />,
    );
  }

  return wrap(
    <View style={styles.root}>
      <ExpoStatusBar style="dark" />
      <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: top }]}>
        <View style={styles.nav}>
          <Pressable onPress={onBack} hitSlop={12}><Text style={styles.back}>‹</Text></Pressable>
          <Text style={styles.navTitle}>Handlers</Text>
          <Pressable onPress={() => setPage('add')} hitSlop={12}>
            <Text style={styles.navAction}>Add</Text>
          </Pressable>
        </View>
        <Text style={styles.lead}>
          People you have approved to collect {childNames(children.map((c) => c.id), children) || 'your children'}. Only people on this list, plus you, can be given a code.
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
              <Chip text={childNames(h.childIds, children) + (h.childIds.filter((id) => children.some((c) => c.id === id)).length === 1 ? ' only' : '')} />
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
              <Pressable style={styles.iconDanger} onPress={() => confirmRemove(h, false)}>
                <Text>🗑</Text>
              </Pressable>
            </View>
          </View>
        ))}
        {(() => {
          const live = handlers.filter((h) => handlerHasAuth(authorizations, h.id));
          if (live.length === 0) return null;
          const names = live.map((h) => h.name.split(' ')[0]).join(', ');
          return (
            <View style={styles.warn}>
              <Text style={styles.warnText}>
                {names} {live.length === 1 ? 'has' : 'have'} an active authorization today. Removing them will cancel it, and the Main Gate will be told immediately.
              </Text>
            </View>
          );
        })()}
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
  const { children, authorizations } = useFamily();
  const allowedKids = handler.childIds.filter((id) => children.some((c) => c.id === id));
  const authorizedToday = handlerHasAuth(authorizations, handler.id);
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
                ● {handler.status}{authorizedToday ? ' · authorized today' : ''}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.card}>
          <Text style={styles.kicker}>WHAT THEY MAY DO</Text>
          <Perm ok={handler.pickup} title="Collect at pickup" right={handler.pickup ? 'Allowed' : 'Off'} />
          <Perm ok={handler.dropoff} title="Bring in at drop-off" right={handler.dropoff ? 'Allowed' : 'Off'} />
          <Perm ok={allowedKids.length > 0} title={childNames(handler.childIds, children)} right={allowedKids.length === 2 ? 'Both children' : 'One child'} />
          <Perm ok={false} title="Recurring authorization" right="Off" />
        </View>
        <View style={styles.card}>
          <Text style={styles.kicker}>RECENT PICKUPS</Text>
          <Perm ok title="Amara Okafor" right="" body="Fri 4 Sep · 2:52 PM · Main Gate" />
          <Perm ok title="Amara and David Okafor" right="" body="Wed 2 Sep · 2:47 PM · Main Gate" />
        </View>
        <View style={styles.note}>
          <Text style={styles.noteText}>
            Authorizing happens where you choose the day's collector — on Home or the child's screen. This page is for who they are and whether they stay on the list.
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
  mode = 'edit',
  onCancel,
  onSave,
}: {
  handler: Handler;
  mode?: 'edit' | 'add';
  onCancel: () => void;
  onSave: (h: Handler) => void;
}) {
  const { children, authorizations } = useFamily();
  const [name, setName] = useState(handler.name);
  const [phone, setPhone] = useState(handler.phone);
  const [rel, setRel] = useState(handler.relationship);
  const [kids, setKids] = useState(handler.childIds);
  const [photoNote, setPhotoNote] = useState('A photo is required. It cannot be removed, only replaced.');
  const phoneChanged = mode === 'edit' && phone !== handler.phone;
  const authorizedToday = handler.id ? handlerHasAuth(authorizations, handler.id) : false;
  const canSave =
    name.trim().length > 0 &&
    phone.replace(/\s/g, '').length >= 7 &&
    kids.some((id) => children.some((c) => c.id === id));
  const top = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 54;
  const who = firstName(name) || 'This person';
  const collecting = children.find((c) => kids.includes(c.id))?.name.split(' ')[0] ?? 'your child';

  return (
    <View style={styles.root}>
      <ExpoStatusBar style="dark" />
      <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: top }]}>
        <View style={styles.nav}>
          <Pressable onPress={onCancel} hitSlop={12}><Text style={styles.back}>‹</Text></Pressable>
          <Text style={styles.navTitle}>{mode === 'add' ? 'Add handler' : 'Edit handler'}</Text>
          <Pressable onPress={onCancel}><Text style={styles.navAction}>Cancel</Text></Pressable>
        </View>
        <View style={styles.photoCard}>
          <InitialsAvatar name={name || 'New handler'} size={88} color={handler.color} />
          <View style={styles.rowBtns}>
            <View style={{ flex: 1 }}>
              <PrimaryButton outline label="Replace photo" onPress={() => setPhotoNote('Photo updated. Gate staff will match this face.')} />
            </View>
            <View style={{ flex: 1 }}>
              <PrimaryButton outline label="Take new" onPress={() => setPhotoNote('New photo saved. Gate staff will match this face.')} />
            </View>
          </View>
          <Text style={styles.meta}>{photoNote}</Text>
        </View>
        <Field label="Full name" value={name} onChangeText={setName} autoCapitalize="words" />
        <Text style={styles.meta}>Gate staff read this name aloud. Spell it as on their ID.</Text>
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
          <Text style={styles.kicker}>WHICH CHILDREN THEY MAY COLLECT</Text>
          {children.map((c) => {
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
        {phoneChanged || authorizedToday ? (
          <View style={styles.amber}>
            <Text style={styles.amberText}>
              {authorizedToday
                ? `${who} is collecting ${collecting} today. Changing their phone number sends a fresh code to the new number and the old one stops working.`
                : 'Changing their phone number sends pickup codes to the new number. The old one stops working.'}
            </Text>
          </View>
        ) : (
          <View style={{ height: 16 }} />
        )}
        <PrimaryButton
          label={mode === 'add' ? 'Save handler' : 'Save changes'}
          enabled={canSave}
          onPress={() =>
            onSave({
              ...handler,
              name: name.trim(),
              phone: phone.trim(),
              relationship: rel.trim() || 'Handler',
              childIds: kids.filter((id) => children.some((c) => c.id === id)),
            })
          }
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
  modalWrap: { ...StyleSheet.absoluteFill, justifyContent: 'flex-end', zIndex: 20 },
  modalDim: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(16,24,40,0.45)' },
  modalCard: { backgroundColor: colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 36 },
});
