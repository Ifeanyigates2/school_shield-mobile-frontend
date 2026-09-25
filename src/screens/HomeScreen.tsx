import { useState } from 'react';
import { Platform, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { InitialsAvatar, PrimaryButton } from '../components';
import { useFamily } from '../data/FamilyContext';
import { eligibleHandlers, firstChildForHandler } from '../data/family';
import { colors } from '../theme';
import { HandlersFlow } from './HandlersFlow';
import { PickupFlow } from './PickupFlow';

export type GuardianPage =
  | 'home'
  | 'handlers'
  | 'pickup';

export function HomeScreen() {
  const { guardianName, children, handlers } = useFamily();
  const [page, setPage] = useState<GuardianPage>('home');
  const [childId, setChildId] = useState(children[0]?.id ?? 'amara');
  const sessionChildIds = children.map((c) => c.id);
  const [handlerId, setHandlerId] = useState('chidinma');
  const [pickupStart, setPickupStart] = useState<'week' | 'choose'>('week');
  const [pickupKey, setPickupKey] = useState(0);

  if (page === 'handlers') {
    return (
      <HandlersFlow
        initialHandlerId={handlerId}
        onBack={() => setPage('home')}
        onOpenPickup={(id) => {
          const handler = handlers.find((h) => h.id === id);
          setHandlerId(id);
          setChildId(firstChildForHandler(handler, children[0]?.id ?? childId, sessionChildIds));
          setPickupStart('choose');
          setPickupKey((n) => n + 1);
          setPage('pickup');
        }}
      />
    );
  }

  if (page === 'pickup') {
    return (
      <PickupFlow
        key={pickupKey}
        childId={childId}
        handlerId={handlerId}
        startAt={pickupStart}
        onSelectHandler={setHandlerId}
        onBack={() => setPage('home')}
        onHandlers={() => setPage('handlers')}
      />
    );
  }

  const top = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) + 12 : 56;
  const activeCount = handlers.filter((h) => h.status === 'ACTIVE').length;
  return (
    <View style={styles.root}>
      <ExpoStatusBar style="dark" />
      <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: top }]}>
        <Text style={styles.greet}>Good morning,</Text>
        <Text style={styles.name}>{guardianName}</Text>
        <Text style={styles.body}>Your children and approved handlers are ready for pickup.</Text>

        {children.map((child) => (
          <Pressable
            key={child.id}
            style={styles.card}
            onPress={() => {
              const next = eligibleHandlers(handlers, child.id, 'pickup')[0];
              setChildId(child.id);
              if (next) setHandlerId(next.id);
              setPickupStart('week');
              setPickupKey((n) => n + 1);
              setPage('pickup');
            }}
          >
            <InitialsAvatar name={child.name} size={52} color={child.color} />
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{child.name}</Text>
              <Text style={styles.meta}>{child.klass} · Greenfield Academy</Text>
            </View>
            <Text style={styles.link}>Pickup</Text>
          </Pressable>
        ))}

        <View style={styles.cardCol}>
          <Text style={styles.kicker}>HANDLERS</Text>
          <Text style={styles.cardTitle}>People who may collect</Text>
          <Text style={styles.meta}>
            {activeCount} active · {handlers.length} saved
          </Text>
          <View style={{ height: 14 }} />
          <PrimaryButton
            label="View handlers"
            onPress={() => setPage('handlers')}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.canvas },
  scroll: { paddingHorizontal: 24, paddingBottom: 36 },
  greet: { color: colors.mute, fontSize: 14 },
  name: { fontSize: 32, fontWeight: '700', color: colors.ink, marginTop: 4, marginBottom: 8 },
  body: { color: colors.mute, fontSize: 14, lineHeight: 21, marginBottom: 20 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 14,
    marginBottom: 10,
  },
  cardCol: { backgroundColor: colors.white, borderRadius: 20, padding: 16, marginTop: 8 },
  cardTitle: { fontWeight: '700', color: colors.ink, fontSize: 16 },
  meta: { color: colors.mute, fontSize: 13, marginTop: 2 },
  kicker: { color: colors.mute, fontSize: 11, fontWeight: '700', letterSpacing: 1.1, marginBottom: 6 },
  link: { color: colors.navy, fontWeight: '700', fontSize: 13 },
});
