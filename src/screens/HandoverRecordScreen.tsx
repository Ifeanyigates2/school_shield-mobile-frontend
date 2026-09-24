import React, { useState } from 'react';
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { ACTIVITIES, ActivityItem, HandoverDetails } from '../data/activities';

interface HandoverRecordScreenProps {
  activityId?: string;
  onBack: () => void;
}

const DEFAULT_ACTIVITY = ACTIVITIES[0];

export function HandoverRecordScreen({
  activityId,
  onBack,
}: HandoverRecordScreenProps) {
  const topInset = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 48;
  const activity: ActivityItem =
    ACTIVITIES.find((a) => a.id === activityId) ?? DEFAULT_ACTIVITY;
  const details: HandoverDetails = activity.details;

  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState<string>('Incorrect handler listed');
  const [reportNotes, setReportNotes] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const reportOptions = [
    'Incorrect handler listed',
    'Time or timestamp discrepancy',
    'Gate staff or location error',
    'Unrecognized pickup authorization',
  ];

  const handleSendReport = () => {
    setReportSubmitted(true);
    setTimeout(() => {
      setReportSubmitted(false);
      setShowReportModal(false);
      Alert.alert(
        'Report Logged',
        'Your report has been forwarded to Greenfield Academy Security & Administration for immediate review.',
        [{ text: 'OK' }]
      );
    }, 600);
  };

  const isSuccess = details.bannerStatus === 'success';
  const isDanger = details.bannerStatus === 'danger';

  return (
    <View className="flex-1 bg-canvas">
      <ExpoStatusBar style="dark" />

      {/* HEADER */}
      <View
        className="px-4 pb-3 bg-white border-b border-line flex-row items-center justify-between"
        style={{ paddingTop: topInset + 8 }}
      >
        <Pressable
          onPress={onBack}
          className="w-10 h-10 rounded-full items-center justify-center active:bg-slate-100 -ml-1"
          hitSlop={8}
        >
          <Feather name="chevron-left" size={24} color="#0B1F3D" />
        </Pressable>

        <Text className="text-base font-bold text-[#0B1F3D]">
          Handover record
        </Text>

        <View className="w-10" />
      </View>

      <ScrollView
        className="flex-1 px-4 pt-4"
        contentContainerStyle={{ paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
      >
        {/* BANNER STATUS CARD */}
        <View
          className={`rounded-3xl p-5 items-center mb-4 border ${
            isSuccess
              ? 'bg-[#ECFDF3] border-[#A6F4C5]'
              : isDanger
              ? 'bg-[#FEF3F2] border-[#FECDCA]'
              : 'bg-[#EFF8FF] border-[#B2DDFF]'
          }`}
        >
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: isSuccess
                ? '#027A48'
                : isDanger
                ? '#D92D20'
                : '#0B1F3D',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 12,
            }}
          >
            {isSuccess ? (
              <Feather name="check" size={28} color="#FFFFFF" strokeWidth={3} />
            ) : isDanger ? (
              <Text style={{ color: '#FFFFFF', fontWeight: '900', fontSize: 24, lineHeight: 28 }}>!</Text>
            ) : (
              <Feather name="info" size={26} color="#FFFFFF" />
            )}
          </View>

          <Text
            className={`text-base font-bold text-center ${
              isSuccess
                ? 'text-[#027A48]'
                : isDanger
                ? 'text-[#B42318]'
                : 'text-[#175CD3]'
            }`}
          >
            {details.bannerTitle}
          </Text>

          <Text
            className={`text-xs font-semibold text-center mt-1 ${
              isSuccess
                ? 'text-[#027A48]'
                : isDanger
                ? 'text-[#B42318]'
                : 'text-[#175CD3]'
            }`}
          >
            {details.bannerDate}
          </Text>
        </View>

        {/* SPECIFICATIONS TABLE CARD */}
        <View className="bg-white rounded-3xl border border-line p-4 shadow-sm mb-4">
          <View style={{ borderBottomWidth: 1, borderBottomColor: '#F2F4F7' }} className="flex-row items-center justify-between py-3">
            <View style={{ width: 110 }}>
              <Text style={{ fontSize: 12, color: '#667085', fontWeight: '500' }}>Event</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 12, color: '#101828', fontWeight: '600', textAlign: 'right' }}>
                {details.event}
              </Text>
            </View>
          </View>

          <View style={{ borderBottomWidth: 1, borderBottomColor: '#F2F4F7' }} className="flex-row items-center justify-between py-3">
            <View style={{ width: 110 }}>
              <Text style={{ fontSize: 12, color: '#667085', fontWeight: '500' }}>Child</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 12, color: '#101828', fontWeight: '600', textAlign: 'right' }}>
                {details.child}
              </Text>
            </View>
          </View>

          <View style={{ borderBottomWidth: 1, borderBottomColor: '#F2F4F7' }} className="flex-row items-center justify-between py-3">
            <View style={{ width: 110 }}>
              <Text style={{ fontSize: 12, color: '#667085', fontWeight: '500' }}>Released to</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 12, color: '#101828', fontWeight: '600', textAlign: 'right' }}>
                {details.releasedTo}
              </Text>
            </View>
          </View>

          <View style={{ borderBottomWidth: 1, borderBottomColor: '#F2F4F7' }} className="flex-row items-center justify-between py-3">
            <View style={{ width: 110 }}>
              <Text style={{ fontSize: 12, color: '#667085', fontWeight: '500' }}>Date</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 12, color: '#101828', fontWeight: '600', textAlign: 'right' }}>
                {details.date}
              </Text>
            </View>
          </View>

          <View style={{ borderBottomWidth: 1, borderBottomColor: '#F2F4F7' }} className="flex-row items-center justify-between py-3">
            <View style={{ width: 110 }}>
              <Text style={{ fontSize: 12, color: '#667085', fontWeight: '500' }}>Time</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 12, color: '#101828', fontWeight: '600', textAlign: 'right' }}>
                {details.time}
              </Text>
            </View>
          </View>

          <View style={{ borderBottomWidth: 1, borderBottomColor: '#F2F4F7' }} className="flex-row items-center justify-between py-3">
            <View style={{ width: 110 }}>
              <Text style={{ fontSize: 12, color: '#667085', fontWeight: '500' }}>Gate</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 12, color: '#101828', fontWeight: '600', textAlign: 'right' }}>
                {details.gate}
              </Text>
            </View>
          </View>

          <View style={{ borderBottomWidth: 1, borderBottomColor: '#F2F4F7' }} className="flex-row items-center justify-between py-3">
            <View style={{ width: 110 }}>
              <Text style={{ fontSize: 12, color: '#667085', fontWeight: '500' }}>Verified by</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 12, color: '#101828', fontWeight: '600', textAlign: 'right' }}>
                {details.verifiedBy}
              </Text>
            </View>
          </View>

          <View style={{ borderBottomWidth: 1, borderBottomColor: '#F2F4F7' }} className="flex-row items-center justify-between py-3">
            <View style={{ width: 110 }}>
              <Text style={{ fontSize: 12, color: '#667085', fontWeight: '500' }}>Authorization</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 12, color: '#101828', fontWeight: '600', textAlign: 'right' }}>
                {details.authorization}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center justify-between py-3">
            <View style={{ width: 110 }}>
              <Text style={{ fontSize: 12, color: '#667085', fontWeight: '500' }}>Approved by</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 12, color: '#101828', fontWeight: '600', textAlign: 'right' }}>
                {details.approvedBy}
              </Text>
            </View>
          </View>
        </View>

        {/* AUDIT LOCK NOTICE BOX */}
        <View className="bg-[#F8FAFC] border border-line rounded-2xl p-4 mb-4">
          <Text className="text-xs text-slate-500 leading-5">
            This record cannot be edited or deleted. Greenfield Academy keeps a matching copy.
          </Text>
        </View>

        {/* REPORT PROBLEM BUTTON */}
        <Pressable
          onPress={() => setShowReportModal(true)}
          className="bg-white border border-[#D0D5DD] rounded-2xl py-3.5 items-center justify-center shadow-xs active:bg-slate-50"
        >
          <Text className="text-sm font-semibold text-slate-800">
            Report a problem with this record
          </Text>
        </Pressable>
      </ScrollView>

      {/* REPORT PROBLEM MODAL */}
      <Modal
        visible={showReportModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowReportModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-5 border-t border-line">
            <View className="flex-row items-center justify-between pb-3 border-b border-line mb-4">
              <Text className="text-base font-bold text-ink">
                Report Record Issue
              </Text>
              <Pressable
                onPress={() => setShowReportModal(false)}
                className="w-8 h-8 rounded-full items-center justify-center bg-slate-100"
              >
                <Feather name="x" size={18} color="#475467" />
              </Pressable>
            </View>

            <Text className="text-xs font-semibold text-mute uppercase tracking-wider mb-2">
              Select reason
            </Text>

            <View className="gap-2 mb-4">
              {reportOptions.map((opt) => {
                const selected = reportReason === opt;
                return (
                  <Pressable
                    key={opt}
                    onPress={() => setReportReason(opt)}
                    className={`flex-row items-center p-3 rounded-xl border ${
                      selected
                        ? 'border-navy bg-slate-50'
                        : 'border-line bg-white'
                    }`}
                  >
                    <View
                      className={`w-4 h-4 rounded-full border items-center justify-center mr-3 ${
                        selected
                          ? 'border-navy bg-navy'
                          : 'border-slate-300'
                      }`}
                    >
                      {selected && <View className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </View>
                    <Text
                      className={`text-xs flex-1 ${
                        selected ? 'font-bold text-navy' : 'font-medium text-ink'
                      }`}
                    >
                      {opt}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text className="text-xs font-semibold text-mute uppercase tracking-wider mb-2">
              Additional Details (Optional)
            </Text>
            <TextInput
              value={reportNotes}
              onChangeText={setReportNotes}
              placeholder="Explain any concerns for the gate supervisor..."
              placeholderTextColor="#98A2B3"
              className="border border-line rounded-xl p-3 text-xs text-ink mb-4 min-h-[70px]"
              multiline
              textAlignVertical="top"
            />

            <Pressable
              onPress={handleSendReport}
              disabled={reportSubmitted}
              className={`py-3.5 rounded-2xl items-center ${
                reportSubmitted ? 'bg-navy/70' : 'bg-navy active:opacity-90'
              }`}
            >
              <Text className="text-white text-sm font-bold">
                {reportSubmitted ? 'Submitting...' : 'Submit problem report'}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
