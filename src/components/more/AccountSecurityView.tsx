import React, { useState } from 'react';
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export interface AccountSecurityViewProps {
  onBack: () => void;
}

export function AccountSecurityView({ onBack }: AccountSecurityViewProps) {
  const router = useRouter();
  const topInset = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 48;

  const [activeModal, setActiveModal] = useState<
    'none' | 'password' | 'phone' | 'sessions' | 'securityAlerts' | 'loginAttempts' | 'logout' | 'delete'
  >('none');

  // Delete account confirmation
  const [deleteInput, setDeleteInput] = useState('');
  const [deleteError, setDeleteError] = useState(false);

  // Password reset inside modal
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [passSaved, setPassSaved] = useState(false);

  const handleDeleteConfirm = () => {
    if (deleteInput.trim().toUpperCase() === 'DELETE') {
      setActiveModal('none');
      setDeleteInput('');
      Alert.alert(
        'Account Removed',
        'Your profile and preferences have been cleared. Greenfield Academy retains historical handover records.',
        [{ text: 'OK', onPress: () => router.replace('/welcome') }]
      );
    } else {
      setDeleteError(true);
    }
  };

  const handleLogout = () => {
    setActiveModal('none');
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <ExpoStatusBar style="dark" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: topInset + 8 }]}>
        <View style={styles.headerTitleRow}>
          <Pressable
            style={({ pressed }) => [
              styles.backButton,
              { backgroundColor: pressed ? '#E2E8F0' : '#F2F4F7' },
            ]}
            onPress={onBack}
          >
            <Feather name="arrow-left" size={18} color="#101828" />
          </Pressable>
          <Text style={styles.headerTitle}>Account & security</Text>
        </View>

        <Text style={styles.headerSubtitle}>
          Destructive actions sit at the bottom and each one is confirmed by typing.
        </Text>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 20, paddingTop: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* SECTION: SIGNING IN */}
        <View style={styles.sectionWrap}>
          <Text style={styles.sectionHeader}>Signing In</Text>

          <View style={styles.cardGroup}>
            {/* Change password */}
            <Pressable
              style={({ pressed }) => [
                styles.rowItem,
                { backgroundColor: pressed ? '#F8FAFC' : '#FFFFFF' },
              ]}
              onPress={() => setActiveModal('password')}
            >
              <View style={styles.rowLeft}>
                <Feather name="key" size={18} color="#475467" />
                <View style={styles.rowTextWrap}>
                  <Text style={styles.rowTitle}>Change password</Text>
                  <Text style={styles.rowSubtitle}>Last changed 3 weeks ago</Text>
                </View>
              </View>
              <Feather name="chevron-right" size={18} color="#98A2B3" />
            </Pressable>

            {/* Phone verification */}
            <Pressable
              style={({ pressed }) => [
                styles.rowItem,
                { backgroundColor: pressed ? '#F8FAFC' : '#FFFFFF' },
              ]}
              onPress={() => setActiveModal('phone')}
            >
              <View style={styles.rowLeft}>
                <Feather name="phone" size={18} color="#475467" />
                <View style={styles.rowTextWrap}>
                  <Text style={styles.rowTitle}>Phone verification</Text>
                  <Text style={styles.rowSubtitle}>+234 803 456 7890 • verified</Text>
                </View>
              </View>
              <Feather name="chevron-right" size={18} color="#98A2B3" />
            </Pressable>

            {/* Active sessions */}
            <Pressable
              style={({ pressed }) => [
                styles.rowItem,
                { borderBottomWidth: 0, backgroundColor: pressed ? '#F8FAFC' : '#FFFFFF' },
              ]}
              onPress={() => setActiveModal('sessions')}
            >
              <View style={styles.rowLeft}>
                <Feather name="clock" size={18} color="#475467" />
                <View style={styles.rowTextWrap}>
                  <Text style={styles.rowTitle}>Active sessions</Text>
                  <Text style={styles.rowSubtitle}>This phone, and a tablet in Lekki</Text>
                </View>
              </View>
              <View style={styles.rowRight}>
                <View style={styles.sessionBadge}>
                  <Text style={styles.sessionBadgeText}>2</Text>
                </View>
                <Feather name="chevron-right" size={18} color="#98A2B3" />
              </View>
            </Pressable>
          </View>
        </View>

        {/* SECTION: SECURITY */}
        <View style={styles.sectionWrap}>
          <Text style={styles.sectionHeader}>Security</Text>

          <View style={styles.cardGroup}>
            {/* Security alerts */}
            <Pressable
              style={({ pressed }) => [
                styles.rowItem,
                { backgroundColor: pressed ? '#F8FAFC' : '#FFFFFF' },
              ]}
              onPress={() => setActiveModal('securityAlerts')}
            >
              <View style={styles.rowLeft}>
                <Feather name="shield" size={18} color="#475467" />
                <View style={styles.rowTextWrap}>
                  <Text style={styles.rowTitle}>Security alerts</Text>
                  <Text style={styles.rowSubtitle}>Always on, cannot be muted</Text>
                </View>
              </View>
              <View style={styles.rowRight}>
                <View style={styles.lockedBadge}>
                  <Text style={styles.lockedBadgeText}>LOCKED</Text>
                </View>
                <Feather name="chevron-right" size={18} color="#98A2B3" />
              </View>
            </Pressable>

            {/* Login attempts */}
            <Pressable
              style={({ pressed }) => [
                styles.rowItem,
                { borderBottomWidth: 0, backgroundColor: pressed ? '#F8FAFC' : '#FFFFFF' },
              ]}
              onPress={() => setActiveModal('loginAttempts')}
            >
              <View style={styles.rowLeft}>
                <Feather name="alert-triangle" size={18} color="#475467" />
                <View style={styles.rowTextWrap}>
                  <Text style={styles.rowTitle}>Login attempts</Text>
                  <Text style={styles.rowSubtitle}>One failed attempt, Fri 4 Sep</Text>
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
            {/* Log out */}
            <Pressable
              style={({ pressed }) => [
                styles.rowItem,
                { backgroundColor: pressed ? '#FEF2F2' : '#FFFFFF' },
              ]}
              onPress={() => setActiveModal('logout')}
            >
              <View style={styles.rowLeft}>
                <Feather name="log-out" size={18} color="#D92D20" />
                <View style={styles.rowTextWrap}>
                  <Text style={[styles.rowTitle, { color: '#D92D20' }]}>Log out</Text>
                  <Text style={styles.rowSubtitle}>SMS alerts continue</Text>
                </View>
              </View>
              <Feather name="chevron-right" size={18} color="#98A2B3" />
            </Pressable>

            {/* Delete account */}
            <Pressable
              style={({ pressed }) => [
                styles.rowItem,
                { borderBottomWidth: 0, backgroundColor: pressed ? '#FEF2F2' : '#FFFFFF' },
              ]}
              onPress={() => {
                setDeleteInput('');
                setDeleteError(false);
                setActiveModal('delete');
              }}
            >
              <View style={styles.rowLeft}>
                <Feather name="trash-2" size={18} color="#D92D20" />
                <View style={styles.rowTextWrap}>
                  <Text style={[styles.rowTitle, { color: '#D92D20' }]}>Delete account</Text>
                  <Text style={styles.rowSubtitle}>Handover records stay with the school</Text>
                </View>
              </View>
              <Feather name="chevron-right" size={18} color="#98A2B3" />
            </Pressable>
          </View>
        </View>

        {/* Safeguarding Policy Callout Card */}
        <View style={styles.policyCard}>
          <Text style={styles.policyText}>
            Deleting your account removes your handlers and preferences. Greenfield Academy keeps handover records as their safeguarding policy requires.
          </Text>
        </View>
      </ScrollView>

      {/* Delete Account Modal */}
      <Modal
        visible={activeModal === 'delete'}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveModal('none')}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.dangerIconWrap}>
              <Feather name="alert-triangle" size={24} color="#D92D20" />
            </View>

            <Text style={styles.modalTitle}>Delete your account?</Text>
            <Text style={styles.modalBody}>
              This action removes your handlers, authorizations, and preferences. Historical gate logs will remain archived at Greenfield Academy for safety audits.
            </Text>

            <Text style={styles.inputPrompt}>
              Type <Text style={{ fontWeight: '800', color: '#D92D20' }}>DELETE</Text> to confirm:
            </Text>
            <TextInput
              value={deleteInput}
              onChangeText={(text) => {
                setDeleteInput(text);
                setDeleteError(false);
              }}
              placeholder="DELETE"
              placeholderTextColor="#98A2B3"
              autoCapitalize="characters"
              style={[
                styles.textInput,
                deleteError && { borderColor: '#D92D20', borderWidth: 1.5 },
              ]}
            />
            {deleteError && (
              <Text style={styles.errorText}>Please type DELETE exactly to confirm.</Text>
            )}

            <View style={styles.modalButtonsRow}>
              <Pressable
                style={({ pressed }) => [
                  styles.cancelButton,
                  { backgroundColor: pressed ? '#F2F4F7' : '#FFFFFF' },
                ]}
                onPress={() => setActiveModal('none')}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  styles.dangerConfirmButton,
                  { opacity: pressed ? 0.88 : 1 },
                ]}
                onPress={handleDeleteConfirm}
              >
                <Text style={styles.dangerConfirmText}>Delete</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Logout Confirmation Modal */}
      <Modal
        visible={activeModal === 'logout'}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveModal('none')}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Log out of SchoolShield?</Text>
            <Text style={styles.modalBody}>
              You will need to verify your phone number to sign back in. Real-time emergency SMS alerts will continue to be sent to your phone.
            </Text>
            <View style={styles.modalButtonsRow}>
              <Pressable
                style={({ pressed }) => [
                  styles.cancelButton,
                  { backgroundColor: pressed ? '#F2F4F7' : '#FFFFFF' },
                ]}
                onPress={() => setActiveModal('none')}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  styles.primaryConfirmButton,
                  { opacity: pressed ? 0.88 : 1 },
                ]}
                onPress={handleLogout}
              >
                <Text style={styles.primaryConfirmText}>Log Out</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Active Sessions Modal */}
      <Modal
        visible={activeModal === 'sessions'}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveModal('none')}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalSheetTitle}>Active Sessions</Text>
              <Pressable
                style={styles.modalCloseIcon}
                onPress={() => setActiveModal('none')}
              >
                <Feather name="x" size={16} color="#101828" />
              </Pressable>
            </View>

            <View style={styles.sessionItem}>
              <Feather name="smartphone" size={18} color="#027A48" />
              <View style={{ flex: 1 }}>
                <Text style={styles.sessionTitle}>iPhone 15 Pro • This device</Text>
                <Text style={styles.sessionSub}>Active now • Lekki, Lagos</Text>
              </View>
            </View>

            <View style={[styles.sessionItem, { borderBottomWidth: 0, marginBottom: 16 }]}>
              <Feather name="tablet" size={18} color="#475467" />
              <View style={{ flex: 1 }}>
                <Text style={styles.sessionTitle}>iPad Air • Safari Browser</Text>
                <Text style={styles.sessionSub}>Last active 4 hours ago • Lekki Phase 1</Text>
              </View>
            </View>

            <Pressable
              style={styles.fullWidthButton}
              onPress={() => setActiveModal('none')}
            >
              <Text style={styles.fullWidthButtonText}>Done</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Security Alerts Policy Modal */}
      <Modal
        visible={activeModal === 'securityAlerts'}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveModal('none')}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Feather name="lock" size={16} color="#0B1F3D" />
                <Text style={styles.modalSheetTitle}>Mandatory Safeguard Policy</Text>
              </View>
              <Pressable
                style={styles.modalCloseIcon}
                onPress={() => setActiveModal('none')}
              >
                <Feather name="x" size={16} color="#101828" />
              </Pressable>
            </View>
            <Text style={styles.policyModalBody}>
              Under Greenfield Academy child protection regulations, high-priority gate alerts (such as unauthorized collection attempts or emergency handover requests) cannot be muted or turned off.
            </Text>
            <Pressable
              style={styles.fullWidthButton}
              onPress={() => setActiveModal('none')}
            >
              <Text style={styles.fullWidthButtonText}>Understood</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Login Attempts Modal */}
      <Modal
        visible={activeModal === 'loginAttempts'}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveModal('none')}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalSheetTitle}>Recent Login Attempts</Text>
              <Pressable
                style={styles.modalCloseIcon}
                onPress={() => setActiveModal('none')}
              >
                <Feather name="x" size={16} color="#101828" />
              </Pressable>
            </View>
            <View style={styles.attemptBox}>
              <Text style={styles.attemptTitle}>1 Failed OTP attempt</Text>
              <Text style={styles.attemptSub}>
                Friday 4 Sep, 10:14 PM • IP 102.89.44.12 (Lagos, NG)
              </Text>
            </View>
            <Text style={styles.policyModalBody}>
              If this was not you, we recommend re-verifying your registered phone number or contacting school security immediately.
            </Text>
            <Pressable
              style={styles.fullWidthButton}
              onPress={() => setActiveModal('none')}
            >
              <Text style={styles.fullWidthButtonText}>Dismiss</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        visible={activeModal === 'password'}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveModal('none')}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalSheetTitle}>Change Password</Text>
              <Pressable
                style={styles.modalCloseIcon}
                onPress={() => setActiveModal('none')}
              >
                <Feather name="x" size={16} color="#101828" />
              </Pressable>
            </View>

            {passSaved ? (
              <View style={{ alignItems: 'center', paddingVertical: 16 }}>
                <Feather name="check-circle" size={36} color="#027A48" />
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#101828', marginTop: 8 }}>
                  Password Updated!
                </Text>
                <Pressable
                  style={[styles.fullWidthButton, { marginTop: 16, width: '100%' }]}
                  onPress={() => {
                    setPassSaved(false);
                    setActiveModal('none');
                  }}
                >
                  <Text style={styles.fullWidthButtonText}>Done</Text>
                </Pressable>
              </View>
            ) : (
              <>
                <Text style={styles.formLabel}>Current Password</Text>
                <TextInput
                  value={currentPass}
                  onChangeText={setCurrentPass}
                  secureTextEntry
                  placeholder="Enter current password"
                  placeholderTextColor="#98A2B3"
                  style={styles.formInput}
                />

                <Text style={styles.formLabel}>New Password</Text>
                <TextInput
                  value={newPass}
                  onChangeText={setNewPass}
                  secureTextEntry
                  placeholder="At least 8 characters"
                  placeholderTextColor="#98A2B3"
                  style={[styles.formInput, { marginBottom: 18 }]}
                />

                <View style={styles.modalButtonsRow}>
                  <Pressable
                    style={styles.cancelButton}
                    onPress={() => setActiveModal('none')}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </Pressable>
                  <Pressable
                    style={styles.primaryConfirmButton}
                    onPress={() => setPassSaved(true)}
                  >
                    <Text style={styles.primaryConfirmText}>Save</Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Phone Verification Modal */}
      <Modal
        visible={activeModal === 'phone'}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveModal('none')}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalSheetTitle}>Verified Phone</Text>
              <Pressable
                style={styles.modalCloseIcon}
                onPress={() => setActiveModal('none')}
              >
                <Feather name="x" size={16} color="#101828" />
              </Pressable>
            </View>

            <View style={styles.verifiedPhoneBox}>
              <Feather name="check" size={16} color="#027A48" />
              <Text style={styles.verifiedPhoneText}>+234 803 456 7890 (Verified via SMS)</Text>
            </View>

            <Text style={styles.policyModalBody}>
              This number receives gate authorizations, check-in pins, and emergency safeguarding updates. To update your number, please contact Greenfield Academy's admin desk.
            </Text>

            <Pressable
              style={styles.fullWidthButton}
              onPress={() => setActiveModal('none')}
            >
              <Text style={styles.fullWidthButtonText}>Done</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 6,
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
  headerSubtitle: {
    fontSize: 12.5,
    color: '#667085',
    lineHeight: 18,
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
  rowTextWrap: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#101828',
  },
  rowSubtitle: {
    fontSize: 12,
    color: '#667085',
    marginTop: 2,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sessionBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FEF0C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sessionBadgeText: {
    color: '#B54708',
    fontSize: 11,
    fontWeight: '800',
  },
  lockedBadge: {
    backgroundColor: '#F2F4F7',
    borderColor: '#E4E7EC',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  lockedBadgeText: {
    color: '#475467',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  policyCard: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },
  policyText: {
    fontSize: 12,
    color: '#1E40AF',
    lineHeight: 18,
    fontWeight: '500',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  dangerIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FEE4E2',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#101828',
    textAlign: 'center',
    marginBottom: 6,
  },
  modalBody: {
    fontSize: 12.5,
    color: '#667085',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 18,
  },
  inputPrompt: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#344054',
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderColor: '#D0D5DD',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    fontWeight: '700',
    color: '#101828',
    marginBottom: 4,
  },
  errorText: {
    fontSize: 12,
    color: '#D92D20',
    fontWeight: '600',
    marginBottom: 10,
  },
  modalButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D0D5DD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#344054',
  },
  dangerConfirmButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#D92D20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dangerConfirmText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  primaryConfirmButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#0B1F3D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryConfirmText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  modalSheetTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#101828',
  },
  modalCloseIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F2F4F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sessionItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F4F7',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sessionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#101828',
  },
  sessionSub: {
    fontSize: 11,
    color: '#667085',
    marginTop: 2,
  },
  fullWidthButton: {
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#0B1F3D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidthButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  policyModalBody: {
    fontSize: 12.5,
    color: '#475467',
    lineHeight: 18,
    marginBottom: 18,
  },
  attemptBox: {
    padding: 12,
    backgroundColor: '#FEF0C7',
    borderColor: '#FDB022',
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 14,
  },
  attemptTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#7A2E0E',
  },
  attemptSub: {
    fontSize: 11,
    color: '#93370D',
    marginTop: 2,
  },
  formLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475467',
    marginBottom: 4,
  },
  formInput: {
    backgroundColor: '#F8FAFC',
    borderColor: '#D0D5DD',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    color: '#101828',
    marginBottom: 12,
  },
  verifiedPhoneBox: {
    padding: 12,
    backgroundColor: '#ECFDF3',
    borderColor: '#A6F4C5',
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  verifiedPhoneText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#027A48',
  },
});
