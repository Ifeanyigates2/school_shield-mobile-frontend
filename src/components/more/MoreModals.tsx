import React, { useState } from 'react';
import {
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

// -------------------------------------------------------------
// 1. Profile Modal
// -------------------------------------------------------------
export interface ProfileModalProps {
  visible: boolean;
  onClose: () => void;
}

export function ProfileModal({ visible, onClose }: ProfileModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        <Pressable style={styles.backdropDismiss} onPress={onClose} />
        <View style={styles.sheetContainer}>
          <View style={styles.sheetHandle} />

          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Parent Profile</Text>
            <Pressable
              style={styles.closeIcon}
              onPress={onClose}
            >
              <Feather name="x" size={18} color="#101828" />
            </Pressable>
          </View>

          {/* User Card */}
          <View style={styles.profileBox}>
            <View style={styles.profileAvatar}>
              <Text style={styles.profileAvatarText}>ZO</Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.profileNameRow}>
                <Text style={styles.profileNameText}>Zara Okafor</Text>
                <View style={styles.primaryBadge}>
                  <Text style={styles.primaryBadgeText}>PRIMARY</Text>
                </View>
              </View>
              <Text style={styles.profileRoleText}>Parent & Primary Guardian</Text>
            </View>
          </View>

          {/* Detail Rows */}
          <View style={styles.detailsGroup}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Phone</Text>
              <Text style={styles.detailVal}>+234 803 456 7890</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Email</Text>
              <Text style={styles.detailVal}>zara.okafor@schoolshield.ng</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Children</Text>
              <Text style={styles.detailVal}>Amara (P4A) & David (P1B)</Text>
            </View>
            <View style={[styles.detailItem, { borderBottomWidth: 0 }]}>
              <Text style={styles.detailLabel}>Address</Text>
              <Text style={styles.detailVal}>Lekki Phase 1, Lagos</Text>
            </View>
          </View>

          <Pressable
            style={styles.primaryButton}
            onPress={onClose}
          >
            <Text style={styles.primaryButtonText}>Done</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

// -------------------------------------------------------------
// 2. School Details Modal
// -------------------------------------------------------------
export interface SchoolDetailsModalProps {
  visible: boolean;
  onClose: () => void;
}

export function SchoolDetailsModal({ visible, onClose }: SchoolDetailsModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        <Pressable style={styles.backdropDismiss} onPress={onClose} />
        <View style={styles.sheetContainer}>
          <View style={styles.sheetHandle} />

          <View style={styles.sheetHeader}>
            <View>
              <Text style={styles.sheetTitle}>Greenfield Academy</Text>
              <Text style={styles.sheetSub}>Lekki Phase 1 Campus</Text>
            </View>
            <Pressable
              style={styles.closeIcon}
              onPress={onClose}
            >
              <Feather name="x" size={18} color="#101828" />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={{ marginBottom: 16 }}>
            {/* Gates */}
            <View style={styles.sectionWrap}>
              <Text style={styles.sectionTitle}>Campus Gates</Text>
              <View style={styles.infoCard}>
                <View style={styles.gateRow}>
                  <Text style={styles.gateName}>Main Gate (Gate A)</Text>
                  <View style={styles.activeTag}>
                    <Text style={styles.activeTagText}>Active</Text>
                  </View>
                </View>
                <Text style={styles.infoCardText}>
                  Primary 1 to 6 drop-off & pickup point. Guarded by Chief Okon.
                </Text>
                <View style={styles.separator} />
                <View style={styles.gateRow}>
                  <Text style={styles.gateName}>Secondary Gate (Gate B)</Text>
                  <Text style={styles.gateSub}>Nursery & Staff</Text>
                </View>
              </View>
            </View>

            {/* Operating Windows */}
            <View style={styles.sectionWrap}>
              <Text style={styles.sectionTitle}>Daily Operating Windows</Text>
              <View style={styles.infoCard}>
                <View style={styles.windowRow}>
                  <Text style={styles.windowLabel}>Morning Drop-off</Text>
                  <Text style={styles.windowVal}>6:45 AM – 8:30 AM</Text>
                </View>
                <View style={styles.windowRow}>
                  <Text style={styles.windowLabel}>School Hours</Text>
                  <Text style={styles.windowVal}>8:30 AM – 2:30 PM</Text>
                </View>
                <View style={styles.windowRow}>
                  <Text style={styles.windowLabel}>Afternoon Dismissal</Text>
                  <Text style={styles.windowVal}>2:30 PM – 3:30 PM</Text>
                </View>
                <View style={styles.windowRow}>
                  <Text style={styles.windowLabel}>Late Pickup Holding</Text>
                  <Text style={styles.windowVal}>3:30 PM – 5:00 PM</Text>
                </View>
              </View>
            </View>

            {/* Term Calendar */}
            <View style={styles.sectionWrap}>
              <Text style={styles.sectionTitle}>Term Calendar</Text>
              <View style={styles.infoCard}>
                <Text style={styles.termTitle}>First Term 2026/2027</Text>
                <Text style={styles.termBody}>
                  Mid-term break: Oct 26 – Oct 30. Friday dismissal adjusts to 1:00 PM on assembly days.
                </Text>
              </View>
            </View>
          </ScrollView>

          <Pressable
            style={styles.primaryButton}
            onPress={onClose}
          >
            <Text style={styles.primaryButtonText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

// -------------------------------------------------------------
// 3. Contact School Modal
// -------------------------------------------------------------
export interface ContactSchoolModalProps {
  visible: boolean;
  onClose: () => void;
}

export function ContactSchoolModal({ visible, onClose }: ContactSchoolModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        <Pressable style={styles.backdropDismiss} onPress={onClose} />
        <View style={styles.sheetContainer}>
          <View style={styles.sheetHandle} />

          <View style={styles.sheetHeader}>
            <View>
              <Text style={styles.sheetTitle}>Contact School</Text>
              <Text style={styles.sheetSub}>Greenfield Academy Help & Security</Text>
            </View>
            <Pressable
              style={styles.closeIcon}
              onPress={onClose}
            >
              <Feather name="x" size={18} color="#101828" />
            </Pressable>
          </View>

          <View style={{ gap: 12, marginBottom: 20 }}>
            {/* Call Main Office */}
            <Pressable
              style={styles.contactItem}
              onPress={() => Linking.openURL('tel:+23412345678')}
            >
              <View style={[styles.contactIconCircle, { backgroundColor: '#0B1F3D' }]}>
                <Feather name="phone-call" size={18} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.contactTitle}>Front Desk / Administration</Text>
                <Text style={styles.contactSub}>+234 1 234 5678 • Office hours</Text>
              </View>
              <Feather name="arrow-up-right" size={18} color="#98A2B3" />
            </Pressable>

            {/* Call Gate House */}
            <Pressable
              style={styles.contactItem}
              onPress={() => Linking.openURL('tel:+23412345679')}
            >
              <View style={[styles.contactIconCircle, { backgroundColor: '#0F6647' }]}>
                <Feather name="shield" size={18} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.contactTitle}>Main Gate Security Post</Text>
                <Text style={styles.contactSub}>+234 1 234 5679 • Immediate gate help</Text>
              </View>
              <Feather name="arrow-up-right" size={18} color="#98A2B3" />
            </Pressable>

            {/* Email Administration */}
            <Pressable
              style={styles.contactItem}
              onPress={() => Linking.openURL('mailto:safeguarding@greenfieldacademy.ng')}
            >
              <View style={[styles.contactIconCircle, { backgroundColor: '#0D47A1' }]}>
                <Feather name="mail" size={18} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.contactTitle}>Safeguarding Office</Text>
                <Text style={styles.contactSub}>safeguarding@greenfieldacademy.ng</Text>
              </View>
              <Feather name="arrow-up-right" size={18} color="#98A2B3" />
            </Pressable>
          </View>

          <Pressable
            style={styles.outlineButton}
            onPress={onClose}
          >
            <Text style={styles.outlineButtonText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

// -------------------------------------------------------------
// 4. Help / FAQ Modal (Six common questions)
// -------------------------------------------------------------
export interface HelpModalProps {
  visible: boolean;
  onClose: () => void;
}

const FAQ_ITEMS = [
  {
    q: 'How does pickup authorization work?',
    a: 'Only assigned handlers with an active QR code or authorization pin can collect a child. Gate staff scan the pass or verify the single-use code against your family roster.',
  },
  {
    q: 'What if my designated handler is delayed?',
    a: 'You can flag a delay directly on the Home or Children screen, or grant a temporary pickup window extension so gate staff keep your child in the safe waiting room.',
  },
  {
    q: 'Can an unauthorized person collect my child?',
    a: 'No. School policy prohibits releasing any child to anyone not authorized. Any attempt triggers an immediate Security Alert on your phone requiring your live approval.',
  },
  {
    q: 'How are incident codes (e.g. SG-0907-014) tracked?',
    a: 'Every gate event, scan, or unauthorized attempt is cryptographically logged and stored in Greenfield Academy safeguarding records for audit compliance.',
  },
  {
    q: 'How do I add or remove a family handler?',
    a: 'Navigate to "Family settings" in the More tab or use "Manage Handlers" from the Home screen to invite trusted drivers, guardians, or domestic staff.',
  },
  {
    q: 'What happens during bad weather or early dismissal?',
    a: 'Greenfield Academy pushes an emergency broadcast notice to SchoolShield. Pickup windows automatically adjust and real-time SMS notifications are sent to primary parents.',
  },
];

export function HelpModal({ visible, onClose }: HelpModalProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        <Pressable style={styles.backdropDismiss} onPress={onClose} />
        <View style={styles.sheetContainer}>
          <View style={styles.sheetHandle} />

          <View style={styles.sheetHeader}>
            <View>
              <Text style={styles.sheetTitle}>Help & FAQ</Text>
              <Text style={styles.sheetSub}>Six common questions</Text>
            </View>
            <Pressable
              style={styles.closeIcon}
              onPress={onClose}
            >
              <Feather name="x" size={18} color="#101828" />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={{ marginBottom: 16 }}>
            <View style={{ gap: 10 }}>
              {FAQ_ITEMS.map((item, index) => {
                const isExpanded = expandedIndex === index;
                return (
                  <Pressable
                    key={index}
                    style={styles.faqCard}
                    onPress={() => setExpandedIndex(isExpanded ? null : index)}
                  >
                    <View style={styles.faqHeader}>
                      <Text style={styles.faqQuestion}>
                        {item.q}
                      </Text>
                      <Feather
                        name={isExpanded ? 'chevron-up' : 'chevron-down'}
                        size={16}
                        color="#667085"
                      />
                    </View>
                    {isExpanded && (
                      <Text style={styles.faqAnswer}>
                        {item.a}
                      </Text>
                    )}
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>

          <Pressable
            style={styles.primaryButton}
            onPress={onClose}
          >
            <Text style={styles.primaryButtonText}>Got It</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  backdropDismiss: {
    flex: 1,
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    maxHeight: '85%',
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 16,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#101828',
  },
  sheetSub: {
    fontSize: 12,
    color: '#667085',
    marginTop: 2,
  },
  closeIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F2F4F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderColor: '#E4E7EC',
    borderWidth: 1,
    borderRadius: 18,
    marginBottom: 18,
  },
  profileAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#EAECF0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileAvatarText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#344054',
  },
  profileNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  profileNameText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#101828',
  },
  primaryBadge: {
    backgroundColor: '#ECFDF3',
    borderColor: '#A6F4C5',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  primaryBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#027A48',
  },
  profileRoleText: {
    fontSize: 12,
    color: '#667085',
    marginTop: 2,
  },
  detailsGroup: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E4E7EC',
    borderWidth: 1,
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 20,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F4F7',
  },
  detailLabel: {
    fontSize: 12.5,
    color: '#667085',
  },
  detailVal: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#101828',
  },
  primaryButton: {
    backgroundColor: '#0B1F3D',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  outlineButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D0D5DD',
    borderWidth: 1,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineButtonText: {
    color: '#344054',
    fontSize: 14,
    fontWeight: '700',
  },
  sectionWrap: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475467',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  infoCard: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E4E7EC',
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    gap: 8,
  },
  gateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gateName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#101828',
  },
  activeTag: {
    backgroundColor: '#ECFDF3',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  activeTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#027A48',
  },
  infoCardText: {
    fontSize: 12,
    color: '#475467',
    lineHeight: 17,
  },
  separator: {
    height: 1,
    backgroundColor: '#E4E7EC',
    marginVertical: 4,
  },
  gateSub: {
    fontSize: 11,
    color: '#667085',
  },
  windowRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  windowLabel: {
    fontSize: 12,
    color: '#475467',
  },
  windowVal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#101828',
  },
  termTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#101828',
  },
  termBody: {
    fontSize: 12,
    color: '#475467',
    lineHeight: 18,
  },
  contactItem: {
    padding: 14,
    backgroundColor: '#F8FAFC',
    borderColor: '#E4E7EC',
    borderWidth: 1,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  contactIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#101828',
  },
  contactSub: {
    fontSize: 11.5,
    color: '#667085',
    marginTop: 2,
  },
  faqCard: {
    padding: 14,
    backgroundColor: '#F8FAFC',
    borderColor: '#E4E7EC',
    borderWidth: 1,
    borderRadius: 16,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  faqQuestion: {
    fontSize: 13,
    fontWeight: '700',
    color: '#101828',
    flex: 1,
    paddingRight: 8,
  },
  faqAnswer: {
    fontSize: 12.5,
    color: '#475467',
    marginTop: 10,
    lineHeight: 18,
    borderTopWidth: 1,
    borderTopColor: '#E4E7EC',
    paddingTop: 8,
  },
});
