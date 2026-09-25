import React from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Child } from '../../data/family';

export interface HomeCodeModalProps {
  visible: boolean;
  child: Child | null;
  mode: 'qr' | 'digits';
  topInset: number;
  onClose: () => void;
  onToggleMode: () => void;
}

export function HomeCodeModal({
  visible,
  child,
  mode,
  topInset,
  onClose,
  onToggleMode,
}: HomeCodeModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        className="flex-1 bg-navyDeep/95 justify-between px-6 pb-10"
        style={{ paddingTop: topInset + 20 }}
      >
        {/* Top Bar with Close */}
        <View className="flex-row justify-end">
          <Pressable
            className="w-10 h-10 rounded-full bg-white/10 items-center justify-center"
            onPress={onClose}
          >
            <Feather name="x" size={20} color="#FFFFFF" />
          </Pressable>
        </View>

        {mode === 'qr' ? (
          /* IPHONE 21: QR CODE OVERLAY */
          <View className="items-center flex-1 justify-center -mt-6">
            <Text className="text-white text-2xl font-bold tracking-tight">QR Code Scan</Text>
            <Text className="text-slate-400 text-xs mt-2 text-center max-w-[280px]">
              {child?.name} · {child?.klass}. Staff scans this QR, then she is checked in.
            </Text>

            {/* High Fidelity QR Code Frame matching Figma iPhone 21 */}
            <View className="w-64 h-64 rounded-3xl bg-slate-900 border border-slate-700/80 items-center justify-center my-8 p-6 shadow-2xl">
              <View className="w-full h-full justify-between">
                <View className="flex-row justify-between">
                  <View className="w-14 h-14 rounded-xl border-4 border-white items-center justify-center">
                    <View className="w-6 h-6 rounded-md bg-white" />
                  </View>
                  <View className="w-14 h-14 rounded-xl border-4 border-white items-center justify-center">
                    <View className="w-6 h-6 rounded-md bg-white" />
                  </View>
                </View>

                <View className="flex-row justify-center gap-3">
                  <View className="w-4 h-4 rounded-sm bg-white" />
                  <View className="w-5 h-5 rounded-md bg-white" />
                  <View className="w-4 h-4 rounded-sm bg-white" />
                </View>

                <View className="flex-row justify-between items-end">
                  <View className="w-14 h-14 rounded-xl border-4 border-white items-center justify-center">
                    <View className="w-6 h-6 rounded-md bg-white" />
                  </View>
                  <View className="flex-row gap-2">
                    <View className="w-4 h-4 rounded-sm bg-white" />
                    <View className="w-5 h-5 rounded-md bg-white" />
                  </View>
                </View>
              </View>
            </View>
          </View>
        ) : (
          /* IPHONE 20: 4-DIGIT CODE OVERLAY */
          <View className="items-center flex-1 justify-center -mt-6">
            <Text className="text-white text-2xl font-bold tracking-tight text-center">
              Show this at the Main Gate
            </Text>
            <Text className="text-slate-400 text-xs mt-2 text-center max-w-[280px]">
              {child?.name} · {child?.klass}. Staff scans or types the four digits, then she is checked in.
            </Text>

            <View className="mt-8 mb-3">
              <Text className="text-slate-400 text-[11px] font-bold tracking-widest text-center">
                DROP-OFF · EXPIRES 8:30 AM
              </Text>
            </View>

            {/* 4 Large Digit Boxes [3] [6] [0] [2] */}
            <View className="flex-row gap-3 my-4">
              {['3', '6', '0', '2'].map((digit, idx) => (
                <View
                  key={idx}
                  className="w-16 h-20 rounded-2xl bg-slate-900 border border-slate-700 items-center justify-center shadow-lg"
                >
                  <Text className="text-white text-3xl font-extrabold">{digit}</Text>
                </View>
              ))}
            </View>

            <Text className="text-slate-400 text-xs mt-3">
              Expires in 9:41 · works offline
            </Text>
          </View>
        )}

        {/* Switcher Button at Bottom */}
        <View className="w-full">
          <Pressable
            className="w-full bg-slate-800/80 border border-slate-700 h-14 rounded-2xl items-center justify-center"
            onPress={onToggleMode}
          >
            <Text className="text-white font-semibold text-sm">
              {mode === 'qr' ? 'Use Code Instead' : 'Scan QR Code Instead'}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
