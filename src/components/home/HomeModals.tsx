import React from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { PrimaryButton } from '../../components';

export interface NotificationsModalProps {
  visible: boolean;
  onClose: () => void;
}

export function NotificationsModal({ visible, onClose }: NotificationsModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <Pressable className="flex-1" onPress={onClose} />
        <View className="bg-white rounded-t-[32px] p-6 max-h-[85%]">
          <View className="w-10 h-1 rounded-full bg-slate-300 self-center mb-4" />
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-ink">Notifications (2)</Text>
            <Pressable
              className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center"
              onPress={onClose}
            >
              <Feather name="x" size={18} color="#101828" />
            </Pressable>
          </View>

          <View className="flex-row gap-3 py-3 border-b border-slate-100">
            <View className="w-9 h-9 rounded-full bg-sky-100 items-center justify-center mt-0.5">
              <Feather name="bell" size={16} color="#0D47A1" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-bold text-ink">Main Gate opens at 6:45 AM</Text>
              <Text className="text-xs text-slate-600 mt-0.5 leading-4">
                Early arrival gate check-in has been enabled for Primary 1 to 6 students.
              </Text>
              <Text className="text-[11px] text-mute mt-1">15 mins ago</Text>
            </View>
          </View>

          <View className="flex-row gap-3 py-3 border-b border-slate-100">
            <View className="w-9 h-9 rounded-full bg-emerald-100 items-center justify-center mt-0.5">
              <Feather name="check-circle" size={16} color="#027A48" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-bold text-ink">Chidinma accepted David's drop-off</Text>
              <Text className="text-xs text-slate-600 mt-0.5 leading-4">
                Assigned handler confirmed today's morning schedule.
              </Text>
              <Text className="text-[11px] text-mute mt-1">1 hour ago</Text>
            </View>
          </View>

          <View className="mt-6">
            <PrimaryButton
              label="Close"
              outline
              onPress={onClose}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

export interface TodaysPlanModalProps {
  visible: boolean;
  onClose: () => void;
}

export function TodaysPlanModal({ visible, onClose }: TodaysPlanModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <Pressable className="flex-1" onPress={onClose} />
        <View className="bg-white rounded-t-[32px] p-6 max-h-[85%]">
          <View className="w-10 h-1 rounded-full bg-slate-300 self-center mb-4" />
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-ink">Today's Plan</Text>
            <Pressable
              className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center"
              onPress={onClose}
            >
              <Feather name="x" size={18} color="#101828" />
            </Pressable>
          </View>

          <View className="gap-4 my-2">
            <View className="flex-row gap-3">
              <View className="w-3 h-3 rounded-full bg-navy mt-1" />
              <View className="flex-1">
                <Text className="text-xs font-bold text-navy">6:45 AM – 8:30 AM</Text>
                <Text className="text-sm font-bold text-ink mt-0.5">Drop-off at Main Gate</Text>
                <Text className="text-xs text-mute mt-0.5">Amara with You · David with Chidinma</Text>
              </View>
            </View>

            <View className="flex-row gap-3">
              <View className="w-3 h-3 rounded-full bg-slate-400 mt-1" />
              <View className="flex-1">
                <Text className="text-xs font-bold text-slate-500">8:30 AM – 2:30 PM</Text>
                <Text className="text-sm font-bold text-ink mt-0.5">School Hours</Text>
                <Text className="text-xs text-mute mt-0.5">Primary 4A & Primary 1B in session</Text>
              </View>
            </View>

            <View className="flex-row gap-3">
              <View className="w-3 h-3 rounded-full bg-success mt-1" />
              <View className="flex-1">
                <Text className="text-xs font-bold text-success">2:30 PM – 3:30 PM</Text>
                <Text className="text-sm font-bold text-ink mt-0.5">Afternoon Dismissal & Pickup</Text>
                <Text className="text-xs text-mute mt-0.5">Amara with You · David with Chidinma</Text>
              </View>
            </View>
          </View>

          <View className="mt-6">
            <PrimaryButton
              label="Done"
              onPress={onClose}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

export interface HomeModalsProps {
  showNotifications: boolean;
  onCloseNotifications: () => void;
  showPlanModal: boolean;
  onClosePlanModal: () => void;
}

export function HomeModals({
  showNotifications,
  onCloseNotifications,
  showPlanModal,
  onClosePlanModal,
}: HomeModalsProps) {
  return (
    <>
      <NotificationsModal
        visible={showNotifications}
        onClose={onCloseNotifications}
      />
      <TodaysPlanModal
        visible={showPlanModal}
        onClose={onClosePlanModal}
      />
    </>
  );
}
