import React, { useState } from 'react';
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
import { Feather } from '@expo/vector-icons';
import { UnauthorizedPickupModal } from './UnauthorizedPickupModal';
import { EmergencyPickupModal } from './EmergencyPickupModal';

export interface AlertsViewProps {
  onBack: () => void;
  onAlertsCountChange?: (count: number) => void;
}

export function AlertsView({ onBack, onAlertsCountChange }: AlertsViewProps) {
  const [showUnauthorizedModal, setShowUnauthorizedModal] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

  const topInset = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 48;

  const handleMarkAllRead = () => {
    setHasUnread(false);
    onAlertsCountChange?.(0);
  };

  return (
    <View style={styles.container}>
      <ExpoStatusBar style="dark" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: topInset + 8 }]}>
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <Pressable
              style={({ pressed }) => [
                styles.backButton,
                { backgroundColor: pressed ? '#E2E8F0' : '#F2F4F7' },
              ]}
              onPress={onBack}
            >
              <Feather name="arrow-left" size={18} color="#101828" />
            </Pressable>
            <Text style={styles.headerTitle}>Alerts</Text>
          </View>

          {hasUnread ? (
            <Pressable onPress={handleMarkAllRead} style={styles.markReadButton}>
              <Text style={styles.markReadText}>Mark all read</Text>
            </Pressable>
          ) : (
            <Text style={styles.allReadText}>All read</Text>
          )}
        </View>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 20, paddingTop: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Incoming Emergency Gate Request Banner */}
        <Pressable
          style={({ pressed }) => [
            styles.emergencyBanner,
            { opacity: pressed ? 0.9 : 1 },
          ]}
          onPress={() => setShowEmergencyModal(true)}
        >
          <View style={styles.emergencyBannerContent}>
            <View style={styles.emergencyIconWrap}>
              <Feather name="alert-circle" size={16} color="#F59E0B" />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.emergencyHeaderRow}>
                <Text style={styles.emergencyBannerTitle}>Incoming Gate Request</Text>
                <View style={styles.emergencyPill}>
                  <Text style={styles.emergencyPillText}>EMERGENCY</Text>
                </View>
              </View>
              <Text style={styles.emergencyBannerSub}>
                Emeka Nwosu requested pickup for Amara
              </Text>
            </View>
          </View>
          <Feather name="chevron-right" size={16} color="#94A3B8" />
        </Pressable>

        {/* SECTION: SECURITY */}
        <View style={styles.sectionWrap}>
          <Text style={styles.sectionHeader}>Security</Text>

          <Pressable
            style={({ pressed }) => [
              styles.card,
              { backgroundColor: pressed ? '#F8FAFC' : '#FFFFFF' },
            ]}
            onPress={() => setShowUnauthorizedModal(true)}
          >
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardTitleRow}>
                {hasUnread && <View style={styles.redDot} />}
                <Text style={styles.cardTitle}>Unauthorized pickup attempt</Text>
              </View>
              <Text style={styles.cardTime}>2:12 PM</Text>
            </View>

            <Text style={styles.cardBody}>
              Someone tried to collect Amara at 2:12 PM. She was not released.
            </Text>

            <View style={styles.cardFooter}>
              <View style={styles.actionNeededBadge}>
                <Text style={styles.actionNeededText}>ACTION NEEDED</Text>
              </View>
              <View style={styles.reviewLink}>
                <Text style={styles.reviewLinkText}>Review</Text>
                <Feather name="chevron-right" size={14} color="#D92D20" />
              </View>
            </View>
          </Pressable>
        </View>

        {/* SECTION: PICKUP */}
        <View style={styles.sectionWrap}>
          <Text style={styles.sectionHeader}>Pickup</Text>

          <View style={{ gap: 10 }}>
            {/* Pickup reminder card */}
            <View style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.cardTitleRow}>
                  {hasUnread && <View style={styles.orangeDot} />}
                  <Text style={styles.cardTitle}>Pickup window opens in 30 minutes</Text>
                </View>
                <Text style={styles.cardTime}>2:00 PM</Text>
              </View>

              <Text style={styles.cardBody}>
                Chidinma Okafor collects Amara at the Main Gate.
              </Text>

              <View style={{ flexDirection: 'row' }}>
                <View style={styles.reminderBadge}>
                  <Text style={styles.reminderBadgeText}>REMINDER</Text>
                </View>
              </View>
            </View>

            {/* Authorization created card */}
            <View style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.cardTitleRow}>
                  <View style={styles.grayDot} />
                  <Text style={styles.cardTitle}>Authorization created</Text>
                </View>
                <Text style={styles.cardTime}>6:40 AM</Text>
              </View>

              <Text style={styles.cardBody}>
                Chidinma Okafor • valid until 3:30 PM today.
              </Text>
            </View>
          </View>
        </View>

        {/* SECTION: CHILD */}
        <View style={styles.sectionWrap}>
          <Text style={styles.sectionHeader}>Child</Text>

          <View style={{ gap: 10 }}>
            {/* David picked up */}
            <View style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.cardTitleRow}>
                  <View style={styles.grayDot} />
                  <Text style={styles.cardTitle}>David picked up</Text>
                </View>
                <Text style={styles.cardTime}>2:41 PM</Text>
              </View>

              <Text style={styles.cardBody}>
                Chidinma Okafor collected David at 2:41 PM, Main Gate.
              </Text>
            </View>

            {/* Amara checked in */}
            <View style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.cardTitleRow}>
                  <View style={styles.grayDot} />
                  <Text style={styles.cardTitle}>Amara checked in</Text>
                </View>
                <Text style={styles.cardTime}>7:48 AM</Text>
              </View>

              <Text style={styles.cardBody}>
                Arrived at the Main Gate at 7:48 AM.
              </Text>
            </View>
          </View>
        </View>

        {/* SECTION: SCHOOL */}
        <View style={[styles.sectionWrap, { marginBottom: 20 }]}>
          <Text style={styles.sectionHeader}>School</Text>

          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardTitleRow}>
                <View style={styles.grayDot} />
                <Text style={styles.cardTitle}>Dismissal moves to 1:00 PM on Friday</Text>
              </View>
              <Text style={styles.cardTime}>Yesterday</Text>
            </View>

            <Text style={styles.cardBody}>
              End-of-term assembly. Pickup windows shift automatically.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Unauthorized Pickup Modal */}
      <UnauthorizedPickupModal
        visible={showUnauthorizedModal}
        onClose={() => setShowUnauthorizedModal(false)}
        onAuthorized={() => onAlertsCountChange?.(1)}
        onRejected={() => onAlertsCountChange?.(1)}
      />

      {/* Emergency Pickup Modal */}
      <EmergencyPickupModal
        visible={showEmergencyModal}
        onClose={() => setShowEmergencyModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F5F8',
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E4E7EC',
    paddingHorizontal: 20,
    paddingBottom: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F2F4F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#101828',
    letterSpacing: -0.3,
  },
  markReadButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  markReadText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0B1F3D',
  },
  allReadText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#98A2B3',
  },
  scrollArea: {
    flex: 1,
  },
  emergencyBanner: {
    backgroundColor: '#091524',
    borderWidth: 1,
    borderColor: '#1F3652',
    borderRadius: 18,
    padding: 14,
    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  emergencyBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  emergencyIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emergencyHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emergencyBannerTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  emergencyPill: {
    backgroundColor: '#D97706',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  emergencyPillText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  emergencyBannerSub: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2,
  },
  sectionWrap: {
    marginBottom: 18,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475467',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E4E7EC',
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  redDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D92D20',
  },
  orangeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F79009',
  },
  grayDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#CBD5E1',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#101828',
    flex: 1,
  },
  cardTime: {
    fontSize: 12,
    color: '#667085',
    marginLeft: 6,
  },
  cardBody: {
    fontSize: 13,
    color: '#344054',
    lineHeight: 18,
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionNeededBadge: {
    backgroundColor: '#FEE4E2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  actionNeededText: {
    color: '#D92D20',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  reviewLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  reviewLinkText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#D92D20',
  },
  reminderBadge: {
    backgroundColor: '#FEF0C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  reminderBadgeText: {
    color: '#B54708',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
