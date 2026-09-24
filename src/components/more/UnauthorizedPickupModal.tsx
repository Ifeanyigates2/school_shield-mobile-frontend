import React, { useState } from 'react';
import {
  Linking,
  Modal,
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

export interface UnauthorizedPickupModalProps {
  visible: boolean;
  onClose: () => void;
  onAuthorized?: () => void;
  onRejected?: () => void;
}

export function UnauthorizedPickupModal({
  visible,
  onClose,
  onAuthorized,
  onRejected,
}: UnauthorizedPickupModalProps) {
  const [resolutionStatus, setResolutionStatus] = useState<'pending' | 'authorized' | 'rejected'>('pending');

  const topInset = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 52;

  const handleAuthorize = () => {
    setResolutionStatus('authorized');
    onAuthorized?.();
  };

  const handleReject = () => {
    setResolutionStatus('rejected');
    onRejected?.();
  };

  const handleCallSchool = () => {
    Linking.openURL('tel:+23412345678');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <ExpoStatusBar style="light" />

        {/* Crimson Header Banner */}
        <View style={[styles.headerBanner, { paddingTop: topInset + 6 }]}>
          {/* Back button */}
          <Pressable
            style={styles.backButton}
            onPress={onClose}
          >
            <Feather name="arrow-left" size={20} color="#FFFFFF" />
          </Pressable>

          <View style={styles.alertTagRow}>
            <Feather name="shield" size={13} color="#FEE4E2" />
            <Text style={styles.alertTagText}>
              Security Alert • Action Needed
            </Text>
          </View>

          <Text style={styles.headerTitle}>
            Unauthorized pickup attempt
          </Text>

          <Text style={styles.headerSubtitle}>
            Someone attempted to collect Amara without an active authorization. She was not released and is safe at school.
          </Text>
        </View>

        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 20, paddingTop: 16 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Resolution status banner */}
          {resolutionStatus === 'authorized' ? (
            <View style={styles.resolvedSuccess}>
              <Feather name="check-circle" size={18} color="#027A48" style={{ marginTop: 2 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.resolvedSuccessTitle}>One-time pickup authorized</Text>
                <Text style={styles.resolvedSuccessText}>
                  Gate security has been notified that Emeka Nwosu is permitted for today's pickup window only.
                </Text>
              </View>
            </View>
          ) : resolutionStatus === 'rejected' ? (
            <View style={styles.resolvedDanger}>
              <Feather name="alert-octagon" size={18} color="#B42318" style={{ marginTop: 2 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.resolvedDangerTitle}>Pickup attempt rejected</Text>
                <Text style={styles.resolvedDangerText}>
                  Gate security has been instructed to turn away this individual and hold safeguarding review.
                </Text>
              </View>
            </View>
          ) : null}

          {/* Details Table Card */}
          <View style={styles.detailsCard}>
            <View style={styles.tableRow}>
              <Text style={styles.rowLabel}>Child</Text>
              <Text style={styles.rowValue}>Amara Okafor • Primary 4A</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={styles.rowLabel}>Time</Text>
              <Text style={styles.rowValue}>2:12 PM today</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={styles.rowLabel}>Gate</Text>
              <Text style={styles.rowValue}>Main Gate</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={styles.rowLabel}>Person</Text>
              <Text style={styles.rowValue}>Gave name: Emeka Nwosu</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={styles.rowLabel}>Outcome</Text>
              <View style={styles.outcomeRow}>
                <View style={styles.outcomeDot} />
                <Text style={styles.outcomeText}>Not released</Text>
              </View>
            </View>

            <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.rowLabel}>Incident</Text>
              <Text style={styles.rowValue}>SG-0907-014 • open</Text>
            </View>
          </View>

          {/* Green Safeguard Alert Box */}
          <View style={styles.safeBox}>
            <Feather name="shield" size={18} color="#027A48" style={{ marginTop: 2 }} />
            <Text style={styles.safeBoxText}>
              Amara is still at school and safe. Greenfield Academy's office has the incident and a photo of the person.
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsGroup}>
            <Pressable
              style={({ pressed }) => [
                styles.authorizeButton,
                { opacity: pressed ? 0.88 : 1 },
              ]}
              onPress={handleAuthorize}
            >
              <Text style={styles.authorizeButtonText}>Authorize this person once</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.rejectButton,
                { opacity: pressed ? 0.88 : 1 },
              ]}
              onPress={handleReject}
            >
              <Text style={styles.rejectButtonText}>Reject this person</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.callButton,
                { opacity: pressed ? 0.88 : 1 },
              ]}
              onPress={handleCallSchool}
            >
              <View style={styles.callButtonContent}>
                <Feather name="phone" size={15} color="#344054" />
                <Text style={styles.callButtonText}>Call Greenfield Academy</Text>
              </View>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F5F8',
  },
  headerBanner: {
    backgroundColor: '#BA1A1A',
    paddingHorizontal: 20,
    paddingBottom: 22,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  alertTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  alertTagText: {
    color: '#FEE4E2',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    color: '#FEE4E2',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 8,
  },
  scrollArea: {
    flex: 1,
  },
  resolvedSuccess: {
    backgroundColor: '#ECFDF3',
    borderColor: '#A6F4C5',
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  resolvedSuccessTitle: {
    color: '#027A48',
    fontSize: 13,
    fontWeight: '700',
  },
  resolvedSuccessText: {
    color: '#054F31',
    fontSize: 12,
    marginTop: 2,
    lineHeight: 16,
  },
  resolvedDanger: {
    backgroundColor: '#FEE4E2',
    borderColor: '#FDA29B',
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  resolvedDangerTitle: {
    color: '#B42318',
    fontSize: 13,
    fontWeight: '700',
  },
  resolvedDangerText: {
    color: '#912018',
    fontSize: 12,
    marginTop: 2,
    lineHeight: 16,
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E4E7EC',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F4F7',
  },
  rowLabel: {
    color: '#667085',
    fontSize: 13,
  },
  rowValue: {
    color: '#101828',
    fontSize: 13,
    fontWeight: '700',
  },
  outcomeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  outcomeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D92D20',
  },
  outcomeText: {
    color: '#D92D20',
    fontSize: 13,
    fontWeight: '700',
  },
  safeBox: {
    backgroundColor: '#ECFDF3',
    borderColor: '#A6F4C5',
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  safeBoxText: {
    color: '#027A48',
    fontSize: 12.5,
    lineHeight: 18,
    flex: 1,
    fontWeight: '500',
  },
  actionsGroup: {
    gap: 10,
  },
  authorizeButton: {
    backgroundColor: '#0F6647',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  authorizeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  rejectButton: {
    backgroundColor: '#C92A2A',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rejectButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  callButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D0D5DD',
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  callButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  callButtonText: {
    color: '#344054',
    fontSize: 14,
    fontWeight: '700',
  },
});
