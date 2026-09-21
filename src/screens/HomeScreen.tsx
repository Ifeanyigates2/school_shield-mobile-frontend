import { useState } from 'react';
import { Platform, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { InitialsAvatar, PrimaryButton } from '../components';
import { CHILDREN, HANDLERS } from '../data/family';
import { colors } from '../theme';
import { HandlersFlow } from './HandlersFlow';
import { PickupFlow } from './PickupFlow';

export type GuardianPage =
  | 'home'
  | 'handlers'
  | 'pickup';

export function HomeScreen() {
  const [page, setPage] = useState<GuardianPage>('home');
  const [childId, setChildId] = useState('amara');
  const [handlerId, setHandlerId] = useState('chidinma');

  if (page === 'handlers') {
    return (
      <HandlersFlow
        initialHandlerId={handlerId}
        onBack={() => setPage('home')}
        onOpenPickup={() => setPage('pickup')}
      />
    );
  }

  if (page === 'pickup') {
    return (
      <PickupFlow
        childId={childId}
        onBack={() => setPage('home')}
        onHandlers={() => setPage('handlers')}
      />
    );
  }

  const top = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) + 12 : 56;
  return (
    <View style={styles.root}>
      <ExpoStatusBar style="dark" />
      <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: top }]}>
        <Text style={styles.greet}>Good morning,</Text>
        <Text style={styles.name}>Zara</Text>
        <Text style={styles.body}>Your children and approved handlers are ready for pickup.</Text>

        {CHILDREN.map((child) => (
          <Pressable
            key={child.id}
            style={styles.card}
            onPress={() => {
              setChildId(child.id);
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
            {HANDLERS.filter((h) => h.status === 'ACTIVE').length} active · {HANDLERS.length} saved
          </Text>
          <View style={{ height: 14 }} />
          <PrimaryButton
            label="View handlers"
            onPress={() => {
              setHandlerId('chidinma');
              setPage('handlers');
            }}
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
