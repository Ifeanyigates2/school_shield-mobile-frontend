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

export interface NotificationsViewProps {
  onBack: () => void;
  onOpenUnauthorizedDetail?: () => void;
}

export function NotificationsView({
  onBack,
  onOpenUnauthorizedDetail,
}: NotificationsViewProps) {
  const [allRead, setAllRead] = useState(false);
  const topInset = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 48;

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
            <Text style={styles.headerTitle}>Notifications</Text>
          </View>

          {!allRead ? (
            <Pressable onPress={() => setAllRead(true)} style={styles.markReadButton}>
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
        {/* SECTION: TODAY */}
        <View style={styles.sectionWrap}>
          <Text style={styles.sectionHeader}>Today</Text>

          <View style={styles.cardGroup}>
            {/* Item 1: Unauthorized pickup attempt */}
            <Pressable
              style={({ pressed }) => [
                styles.rowItem,
                { backgroundColor: pressed ? '#F8FAFC' : '#FFFFFF' },
              ]}
              onPress={onOpenUnauthorizedDetail}
            >
              <View style={[styles.iconCircle, { backgroundColor: '#B42318' }]}>
                <Feather name="alert-triangle" size={15} color="#FFFFFF" />
              </View>
              <View style={styles.rowContent}>
                <View style={styles.rowHeader}>
                  <Text style={styles.rowTitle}>Unauthorized pickup attempt</Text>
                  <Text style={styles.rowTime}>2:12 PM</Text>
                </View>
                <Text style={styles.rowSubtitle}>
                  Amara was not released. The office has the incident.
                </Text>
              </View>
            </Pressable>

            {/* Item 2: Pickup reminder */}
            <View style={styles.rowItem}>
              <View style={[styles.iconCircle, { backgroundColor: '#B54708' }]}>
                <Feather name="clock" size={15} color="#FFFFFF" />
              </View>
              <View style={styles.rowContent}>
                <View style={styles.rowHeader}>
                  <Text style={styles.rowTitle}>Pickup reminder</Text>
                  <Text style={styles.rowTime}>2:00 PM</Text>
                </View>
                <Text style={styles.rowSubtitle}>
                  Chidinma collects Amara at 2:30 PM, Main Gate.
                </Text>
              </View>
            </View>

            {/* Item 3: Amara checked in */}
            <View style={styles.rowItem}>
              <View style={[styles.iconCircle, { backgroundColor: '#027A48' }]}>
                <Feather name="check" size={15} color="#FFFFFF" />
              </View>
              <View style={styles.rowContent}>
                <View style={styles.rowHeader}>
                  <Text style={styles.rowTitle}>Amara checked in</Text>
                  <Text style={styles.rowTime}>7:48 AM</Text>
                </View>
                <Text style={styles.rowSubtitle}>
                  Arrived at the Main Gate.
                </Text>
              </View>
            </View>

            {/* Item 4: Authorization updated */}
            <View style={[styles.rowItem, { borderBottomWidth: 0 }]}>
              <View style={[styles.iconCircle, { backgroundColor: '#0B1F3D' }]}>
                <Feather name="info" size={15} color="#FFFFFF" />
              </View>
              <View style={styles.rowContent}>
                <View style={styles.rowHeader}>
                  <Text style={styles.rowTitle}>Authorization updated</Text>
                  <Text style={styles.rowTime}>6:40 AM</Text>
                </View>
                <Text style={styles.rowSubtitle}>
                  Chidinma Okafor • valid until 3:30 PM.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* SECTION: YESTERDAY */}
        <View style={styles.sectionWrap}>
          <Text style={styles.sectionHeader}>Yesterday</Text>

          <View style={styles.cardGroup}>
            {/* Item 1: School announcement */}
            <View style={styles.rowItem}>
              <View style={[styles.iconCircle, { backgroundColor: '#0B1F3D' }]}>
                <Feather name="info" size={15} color="#FFFFFF" />
              </View>
              <View style={styles.rowContent}>
                <View style={styles.rowHeader}>
                  <Text style={styles.rowTitle}>School announcement</Text>
                  <Text style={styles.rowTime}>4:10 PM</Text>
                </View>
                <Text style={styles.rowSubtitle}>
                  Dismissal moves to 1:00 PM on Friday for assembly.
                </Text>
              </View>
            </View>

            {/* Item 2: David picked up */}
            <View style={[styles.rowItem, { borderBottomWidth: 0 }]}>
              <View style={[styles.iconCircle, { backgroundColor: '#027A48' }]}>
                <Feather name="check" size={15} color="#FFFFFF" />
              </View>
              <View style={styles.rowContent}>
                <View style={styles.rowHeader}>
                  <Text style={styles.rowTitle}>David picked up</Text>
                  <Text style={styles.rowTime}>2:41 PM</Text>
                </View>
                <Text style={styles.rowSubtitle}>
                  Chidinma Okafor • Main Gate.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Safeguard Disclaimer Notice */}
        <View style={styles.disclaimerCard}>
          <Text style={styles.disclaimerText}>
            Clearing notifications does not delete security records. Every incident stays in Activity and with the school.
          </Text>
        </View>
      </ScrollView>
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
  sectionWrap: {
    marginBottom: 20,
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
    alignItems: 'flex-start',
    gap: 12,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F4F7',
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  rowContent: {
    flex: 1,
  },
  rowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#101828',
    flex: 1,
  },
  rowTime: {
    fontSize: 12,
    color: '#667085',
    marginLeft: 6,
  },
  rowSubtitle: {
    fontSize: 12.5,
    color: '#475467',
    lineHeight: 17,
  },
  disclaimerCard: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },
  disclaimerText: {
    fontSize: 12,
    color: '#1E40AF',
    lineHeight: 18,
    fontWeight: '500',
  },
});
