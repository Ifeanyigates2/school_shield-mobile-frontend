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
import { useRouter } from 'expo-router';
import { useFamily } from '../data/FamilyContext';
import { AlertsView } from '../components/more/AlertsView';
import { AccountSecurityView } from '../components/more/AccountSecurityView';
import { NotificationsView } from '../components/more/NotificationsView';
import {
  ProfileModal,
  SchoolDetailsModal,
  ContactSchoolModal,
  HelpModal,
} from '../components/more/MoreModals';
import { UnauthorizedPickupModal } from '../components/more/UnauthorizedPickupModal';
import { useAndroidBack } from '../useAndroidBack';

export function MoreScreen() {
  const router = useRouter();
  let family;
  try {
    family = useFamily();
  } catch {
    family = { guardianName: 'Zara' };
  }

  const [subScreen, setSubScreen] = useState<'main' | 'alerts' | 'account-security' | 'notifications'>('main');
  const [alertsCount, setAlertsCount] = useState(2);

  // Modals
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSchoolModal, setShowSchoolModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showUnauthorizedModal, setShowUnauthorizedModal] = useState(false);

  const topInset = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 48;

  useAndroidBack(() => {
    if (subScreen !== 'main') {
      setSubScreen('main');
    }
  });

  // Sub-screens
  if (subScreen === 'alerts') {
    return (
      <AlertsView
        onBack={() => setSubScreen('main')}
        onAlertsCountChange={(count) => setAlertsCount(count)}
      />
    );
  }

  if (subScreen === 'account-security') {
    return (
      <AccountSecurityView
        onBack={() => setSubScreen('main')}
      />
    );
  }

  if (subScreen === 'notifications') {
    return (
      <NotificationsView
        onBack={() => setSubScreen('main')}
        onOpenUnauthorizedDetail={() => setShowUnauthorizedModal(true)}
      />
    );
  }

  return (
    <View style={styles.container}>
      <ExpoStatusBar style="dark" />

      <ScrollView
        style={[styles.scrollArea, { paddingTop: topInset + 10 }]}
        contentContainerStyle={{ paddingBottom: 48, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Screen Header */}
        <Text style={styles.screenTitle}>More</Text>
        <Text style={styles.screenSubtitle}>
          Everything that is not today. Pickup and drop-off are deliberately absent — they live on Home and Children, where a parent already is.
        </Text>

        {/* User Profile Card matching Figma */}
        <Pressable
          style={({ pressed }) => [
            styles.profileCard,
            { backgroundColor: pressed ? '#F8FAFC' : '#FFFFFF' },
          ]}
          onPress={() => setShowProfileModal(true)}
        >
          <View style={styles.profileLeft}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>ZO</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Zara Okafor</Text>
              <Text style={styles.profileSub}>Parent • +234 803 456 7890</Text>
            </View>
          </View>

          <View style={styles.primaryBadge}>
            <Text style={styles.primaryBadgeText}>PRIMARY</Text>
          </View>
        </Pressable>

        {/* SECTION: NEEDS YOU */}
        <View style={styles.sectionWrap}>
          <Text style={styles.sectionHeader}>Needs You</Text>

          <View style={styles.cardGroup}>
            <Pressable
              style={({ pressed }) => [
                styles.rowItem,
                { borderBottomWidth: 0, backgroundColor: pressed ? '#F8FAFC' : '#FFFFFF' },
              ]}
              onPress={() => setSubScreen('alerts')}
            >
              <View style={styles.rowLeft}>
                <Feather name="alert-triangle" size={18} color="#475467" />
                <View style={styles.rowInfo}>
                  <Text style={styles.rowTitle}>Alerts</Text>
                  <Text style={styles.rowSub}>Security, pickup, child and school</Text>
                </View>
              </View>

              <View style={styles.rowRight}>
                {alertsCount > 0 && (
                  <View style={styles.alertsPill}>
                    <Text style={styles.alertsPillText}>{alertsCount} NEW</Text>
                  </View>
                )}
                <Feather name="chevron-right" size={18} color="#98A2B3" />
              </View>
            </Pressable>
          </View>
        </View>

        {/* SECTION: YOUR FAMILY */}
        <View style={styles.sectionWrap}>
          <Text style={styles.sectionHeader}>Your Family</Text>

          <View style={styles.cardGroup}>
            {/* Profile */}
            <Pressable
              style={({ pressed }) => [
                styles.rowItem,
                { backgroundColor: pressed ? '#F8FAFC' : '#FFFFFF' },
              ]}
              onPress={() => setShowProfileModal(true)}
            >
              <View style={styles.rowLeft}>
                <Feather name="user" size={18} color="#475467" />
                <View style={styles.rowInfo}>
                  <Text style={styles.rowTitle}>Profile</Text>
                  <Text style={styles.rowSub}>Name, phone, email, photo</Text>
                </View>
              </View>
              <Feather name="chevron-right" size={18} color="#98A2B3" />
            </Pressable>

            {/* Family settings */}
            <Pressable
              style={({ pressed }) => [
                styles.rowItem,
                { borderBottomWidth: 0, backgroundColor: pressed ? '#F8FAFC' : '#FFFFFF' },
              ]}
              onPress={() => router.push('/handlers')}
            >
              <View style={styles.rowLeft}>
                <Feather name="users" size={18} color="#475467" />
                <View style={styles.rowInfo}>
                  <Text style={styles.rowTitle}>Family settings</Text>
                  <Text style={styles.rowSub}>Children, guardians, handlers</Text>
                </View>
              </View>
              <Feather name="chevron-right" size={18} color="#98A2B3" />
            </Pressable>
          </View>
        </View>

        {/* SECTION: SCHOOL */}
        <View style={styles.sectionWrap}>
          <Text style={styles.sectionHeader}>School</Text>

          <View style={styles.cardGroup}>
            {/* School details */}
            <Pressable
              style={({ pressed }) => [
                styles.rowItem,
                { backgroundColor: pressed ? '#F8FAFC' : '#FFFFFF' },
              ]}
              onPress={() => setShowSchoolModal(true)}
            >
              <View style={styles.rowLeft}>
                <Feather name="home" size={18} color="#475467" />
                <View style={styles.rowInfo}>
                  <Text style={styles.rowTitle}>School details</Text>
                  <Text style={styles.rowSub}>Gates, windows, hours, calendar</Text>
                </View>
              </View>
              <Feather name="chevron-right" size={18} color="#98A2B3" />
            </Pressable>

            {/* Contact school */}
            <Pressable
              style={({ pressed }) => [
                styles.rowItem,
                { borderBottomWidth: 0, backgroundColor: pressed ? '#F8FAFC' : '#FFFFFF' },
              ]}
              onPress={() => setShowContactModal(true)}
            >
              <View style={styles.rowLeft}>
                <Feather name="phone" size={18} color="#475467" />
                <View style={styles.rowInfo}>
                  <Text style={styles.rowTitle}>Contact school</Text>
                  <Text style={styles.rowSub}>Call or email the office</Text>
                </View>
              </View>
              <Feather name="chevron-right" size={18} color="#98A2B3" />
            </Pressable>
          </View>
        </View>

        {/* SECTION: ACCOUNT */}
        <View style={styles.sectionWrap}>
          <Text style={styles.sectionHeader}>Account</Text>

          <View style={styles.cardGroup}>
            {/* Notifications */}
            <Pressable
              style={({ pressed }) => [
                styles.rowItem,
                { backgroundColor: pressed ? '#F8FAFC' : '#FFFFFF' },
              ]}
              onPress={() => setSubScreen('notifications')}
            >
              <View style={styles.rowLeft}>
                <Feather name="bell" size={18} color="#475467" />
                <View style={styles.rowInfo}>
                  <Text style={styles.rowTitle}>Notifications</Text>
                  <Text style={styles.rowSub}>Channels and what you are told</Text>
                </View>
              </View>
              <Feather name="chevron-right" size={18} color="#98A2B3" />
            </Pressable>

            {/* Account & security */}
            <Pressable
              style={({ pressed }) => [
                styles.rowItem,
                { backgroundColor: pressed ? '#F8FAFC' : '#FFFFFF' },
              ]}
              onPress={() => setSubScreen('account-security')}
            >
              <View style={styles.rowLeft}>
                <Feather name="lock" size={18} color="#475467" />
                <View style={styles.rowInfo}>
                  <Text style={styles.rowTitle}>Account & security</Text>
                  <Text style={styles.rowSub}>Password, sessions, deletion</Text>
                </View>
              </View>
              <Feather name="chevron-right" size={18} color="#98A2B3" />
            </Pressable>

            {/* Help */}
            <Pressable
              style={({ pressed }) => [
                styles.rowItem,
                { borderBottomWidth: 0, backgroundColor: pressed ? '#F8FAFC' : '#FFFFFF' },
              ]}
              onPress={() => setShowHelpModal(true)}
            >
              <View style={styles.rowLeft}>
                <Feather name="help-circle" size={18} color="#475467" />
                <View style={styles.rowInfo}>
                  <Text style={styles.rowTitle}>Help</Text>
                  <Text style={styles.rowSub}>Six common questions</Text>
                </View>
              </View>
              <Feather name="chevron-right" size={18} color="#98A2B3" />
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Profile Modal */}
      <ProfileModal
        visible={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />

      {/* School Details Modal */}
      <SchoolDetailsModal
        visible={showSchoolModal}
        onClose={() => setShowSchoolModal(false)}
      />

      {/* Contact School Modal */}
      <ContactSchoolModal
        visible={showContactModal}
        onClose={() => setShowContactModal(false)}
      />

      {/* Help Modal */}
      <HelpModal
        visible={showHelpModal}
        onClose={() => setShowHelpModal(false)}
      />

      {/* Unauthorized Pickup Modal from Notifications */}
      <UnauthorizedPickupModal
        visible={showUnauthorizedModal}
        onClose={() => setShowUnauthorizedModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F5F8',
  },
  scrollArea: {
    flex: 1,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#101828',
    letterSpacing: -0.5,
  },
  screenSubtitle: {
    fontSize: 12.5,
    color: '#475467',
    lineHeight: 18,
    marginTop: 8,
    marginBottom: 20,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E4E7EC',
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    marginBottom: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  profileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EAECF0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#344054',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#101828',
  },
  profileSub: {
    fontSize: 12,
    color: '#667085',
    marginTop: 2,
  },
  primaryBadge: {
    backgroundColor: '#ECFDF3',
    borderColor: '#A6F4C5',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  primaryBadgeText: {
    color: '#027A48',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  sectionWrap: {
    marginBottom: 22,
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
  cardGroup: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E4E7EC',
    borderWidth: 1,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F4F7',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  rowInfo: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#101828',
  },
  rowSub: {
    fontSize: 12,
    color: '#667085',
    marginTop: 2,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  alertsPill: {
    backgroundColor: '#FEE4E2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  alertsPillText: {
    color: '#D92D20',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
