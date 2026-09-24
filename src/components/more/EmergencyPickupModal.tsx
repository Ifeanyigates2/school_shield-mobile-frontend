import React, { useEffect, useState } from 'react';
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

export interface EmergencyPickupModalProps {
  visible: boolean;
  onClose: () => void;
  onAuthorize?: () => void;
  onReject?: () => void;
}

export function EmergencyPickupModal({
  visible,
  onClose,
  onAuthorize,
  onReject,
}: EmergencyPickupModalProps) {
  const [secondsLeft, setSecondsLeft] = useState(240); // 4 minutes
  const [resolvedStatus, setResolvedStatus] = useState<'pending' | 'authorized' | 'rejected'>('pending');

  const topInset = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 52;

  useEffect(() => {
    if (!visible) {
      setSecondsLeft(240);
      setResolvedStatus('pending');
      return;
    }
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [visible]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timeFormatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  const handleAuthorize = () => {
    setResolvedStatus('authorized');
    onAuthorize?.();
  };

  const handleReject = () => {
    setResolvedStatus('rejected');
    onReject?.();
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
      <View style={[styles.container, { paddingTop: topInset }]}>
        <ExpoStatusBar style="light" />

        {/* Header Area */}
        <View style={styles.header}>
          {/* Back button */}
          <Pressable
            style={styles.backButton}
            onPress={onClose}
          >
            <Feather name="arrow-left" size={20} color="#FFFFFF" />
          </Pressable>

          {/* Badges Row */}
          <View style={styles.badgeRow}>
            <View style={styles.emergencyBadge}>
              <Text style={styles.emergencyBadgeText}>EMERGENCY REQUEST</Text>
            </View>
            <View style={styles.timerBadge}>
              <Text style={styles.timerBadgeText}>Expires in {timeFormatted}</Text>
            </View>
          </View>

          <Text style={styles.title}>Emergency pickup request</Text>

          <Text style={styles.subtitle}>
            Someone is requesting permission to pick up Amara. Greenfield Academy's gate staff sent this and are waiting with her.
          </Text>
        </View>

        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Resolution Status Alert */}
          {resolvedStatus === 'authorized' ? (
            <View style={styles.resolvedSuccess}>
              <Feather name="check-circle" size={18} color="#34D399" style={{ marginTop: 2 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.resolvedSuccessTitle}>One-time pickup authorized</Text>
                <Text style={styles.resolvedSuccessText}>
                  Gate security has been informed. Emeka Nwosu is cleared for today's pickup only.
                </Text>
              </View>
            </View>
          ) : resolvedStatus === 'rejected' ? (
            <View style={styles.resolvedDanger}>
              <Feather name="x-circle" size={18} color="#F87171" style={{ marginTop: 2 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.resolvedDangerTitle}>Request rejected</Text>
                <Text style={styles.resolvedDangerText}>
                  Gate security was instructed not to release Amara to this person.
                </Text>
              </View>
            </View>
          ) : null}

          {/* Person Card */}
          <View style={styles.personCard}>
            {/* Person Row */}
            <View style={styles.personRow}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>EN</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.personName}>Emeka Nwosu</Text>
                <Text style={styles.personPhone}>+234 808 774 1120</Text>
              </View>
            </View>

            {/* Key-Value Details */}
            <View style={styles.detailsTable}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Child</Text>
                <Text style={styles.detailValue}>Amara Okafor</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>School</Text>
                <Text style={styles.detailValue}>Greenfield Academy</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Gate</Text>
                <Text style={styles.detailValue}>Main Gate</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Requested</Text>
                <Text style={styles.detailValue}>2:14 PM today</Text>
              </View>
            </View>

            {/* Reason Given */}
            <View style={styles.reasonSection}>
              <Text style={styles.reasonHeader}>REASON GIVEN</Text>
              <Text style={styles.reasonText}>
                Says he is the family driver and that you are stuck in traffic on Admiralty Way.
              </Text>
            </View>
          </View>

          {/* Notice Card */}
          <View style={styles.noticeCard}>
            <Text style={styles.noticeText}>
              Authorizing allows this person to collect Amara{' '}
              <Text style={{ fontWeight: '700', color: '#FFFFFF' }}>once</Text> during today's pickup window only. He will not be saved as a handler.
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
              <Text style={styles.authorizeButtonText}>Authorize once</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.rejectButton,
                { opacity: pressed ? 0.88 : 1 },
              ]}
              onPress={handleReject}
            >
              <Text style={styles.rejectButtonText}>Reject request</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.callSchoolButton,
                { opacity: pressed ? 0.88 : 1 },
              ]}
              onPress={handleCallSchool}
            >
              <View style={styles.callSchoolContent}>
                <Feather name="phone" size={15} color="#FFFFFF" />
                <Text style={styles.callSchoolButtonText}>Call the school</Text>
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
    backgroundColor: '#091524',
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  emergencyBadge: {
    backgroundColor: '#C25E00',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  emergencyBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  timerBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  timerBadgeText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '500',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 13,
    lineHeight: 19,
  },
  scrollArea: {
    flex: 1,
  },
  resolvedSuccess: {
    backgroundColor: 'rgba(5, 78, 56, 0.4)',
    borderColor: '#059669',
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  resolvedSuccessTitle: {
    color: '#A7F3D0',
    fontSize: 13,
    fontWeight: '700',
  },
  resolvedSuccessText: {
    color: '#D1FAE5',
    fontSize: 12,
    marginTop: 2,
    lineHeight: 16,
  },
  resolvedDanger: {
    backgroundColor: 'rgba(159, 18, 57, 0.4)',
    borderColor: '#DC2626',
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  resolvedDangerTitle: {
    color: '#FECDD3',
    fontSize: 13,
    fontWeight: '700',
  },
  resolvedDangerText: {
    color: '#FFE4E6',
    fontSize: 12,
    marginTop: 2,
    lineHeight: 16,
  },
  personCard: {
    backgroundColor: '#122338',
    borderColor: '#1F3652',
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
  },
  personRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1F3652',
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#243B58',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  personName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  personPhone: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
  detailsTable: {
    paddingVertical: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  detailLabel: {
    color: '#94A3B8',
    fontSize: 12,
  },
  detailValue: {
    color: '#F1F5F9',
    fontSize: 12,
    fontWeight: '600',
  },
  reasonSection: {
    marginTop: 4,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#1F3652',
  },
  reasonHeader: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  reasonText: {
    color: '#E2E8F0',
    fontSize: 13,
    lineHeight: 19,
  },
  noticeCard: {
    backgroundColor: '#0E1D2E',
    borderColor: '#1B314B',
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
  },
  noticeText: {
    color: '#94A3B8',
    fontSize: 12,
    lineHeight: 18,
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
  callSchoolButton: {
    backgroundColor: '#091524',
    borderWidth: 1,
    borderColor: '#243B58',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  callSchoolContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  callSchoolButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
