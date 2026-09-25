import { useState } from 'react';
import {
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { FigmaAvatar } from '../components';
import { CHILDREN, HANDLERS } from '../data/family';
import { useFamily } from '../data/FamilyContext';

export interface ChildrenScreenProps {
  onSelectChild?: (childId: string) => void;
  onOpenHandlers: () => void;
  onOpenPickup: (childId: string) => void;
  initialChildId?: string;
  initialMode?: 'pickup' | 'delayed';
}

export function ChildrenScreen({
  onSelectChild,
  onOpenHandlers,
  onOpenPickup,
  initialChildId,
  initialMode = 'pickup',
}: ChildrenScreenProps) {
  let family;
  try {
    family = useFamily();
  } catch {
    family = { children: CHILDREN, handlers: HANDLERS };
  }

  const { children = CHILDREN, handlers = HANDLERS } = family;
  const [mode, setMode] = useState<'pickup' | 'delayed'>(initialMode);

  const topInset = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 48;

  return (
    <View className="flex-1 bg-canvas">
      <ExpoStatusBar style="light" />

      {/* Navy Header matching Figma P03a (iPhone 18 & 24) */}
      <View
        className="bg-navy px-5 pb-5 p-6"
        style={{ paddingTop: topInset + 15 }}
      >
        <View className="flex-row justify-between items-center">
          <View className="flex-1">
            <Text className="text-white text-2xl font-bold tracking-tight">
              Your children ({children.length})
            </Text>
            <Text className="text-slate-400 text-lg mt-1">
              Greenfield Academy · Lekki Phase 1
            </Text>
          </View>

          {/* Status Badge: Tappable to toggle between standard and alert state for demo/testing */}
          <Pressable
            onPress={() => setMode((prev) => (prev === 'pickup' ? 'delayed' : 'pickup'))}
            hitSlop={8}
            className={`px-2.5 py-1 rounded-full border ${
              mode === 'pickup'
                ? 'bg-emerald-500/20 border-emerald-500/40'
                : 'bg-amber-500/20 border-amber-500/40'
            }`}
          >
            <Text
              className={`text-[10px] font-extrabold tracking-wider ${
                mode === 'pickup' ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {mode === 'pickup' ? 'ACTIVE' : 'DELAYED'}
            </Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-4 pt-4"
        contentContainerStyle={{ paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ACTION / ALERT BANNER */}
        {mode === 'pickup' ? (
          /* iPhone 18: Pickup window banner */
          <View
            style={{
              backgroundColor: '#EAF2F8',
              borderColor: '#D0E4FA',
              borderWidth: 1,
              borderRadius: 24,
              padding: 16,
              marginBottom: 16,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
              <View
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 11,
                  backgroundColor: '#0B1F3D',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 2,
                }}
              >
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontSize: 12,
                    fontWeight: '700',
                    fontStyle: 'italic',
                    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
                  }}
                >
                  i
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: '#0B1F3D' }}>
                  Pickup starts at 2:30PM
                </Text>
                <Text style={{ fontSize: 12, color: '#475467', lineHeight: 18, marginTop: 3 }}>
                  Pickup runs from 2:30–3:30 PM at Main Gate. Verify and confirm pickup before time.
                </Text>
              </View>
            </View>

            <Pressable
              style={{
                backgroundColor: '#0B1F3D',
                height: 48,
                borderRadius: 16,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 12,
              }}
              onPress={() => onOpenPickup(children[0]?.id ?? 'amara')}
            >
              <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '600' }}>
                Manage Pickup
              </Text>
            </Pressable>
          </View>
        ) : (
          /* iPhone 24: Amara still at school alert */
          <View
            style={{
              backgroundColor: '#FEF3F2',
              borderColor: '#FECDCA',
              borderWidth: 1,
              borderRadius: 24,
              padding: 16,
              marginBottom: 16,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
              <View
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 11,
                  backgroundColor: '#D92D20',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 2,
                }}
              >
                <Feather name="alert-circle" size={13} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: '#B42318' }}>
                  Amara is still at school
                </Text>
                <Text style={{ fontSize: 12, color: '#475467', lineHeight: 18, marginTop: 3 }}>
                  Her code stopped working at 3:30 PM. She is with the front office, not at the gate.
                </Text>
              </View>
            </View>

            <Pressable
              style={{
                backgroundColor: '#D92D20',
                height: 48,
                borderRadius: 16,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 12,
              }}
              onPress={() => Linking.openURL('tel:+2348000000000')}
            >
              <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '600' }}>
                Call the school office
              </Text>
            </Pressable>
          </View>
        )}

        {/* CHILDREN CARDS LIST */}
        {/* Child 1: Amara Okafor */}
        {children.find((c) => c.id === 'amara') && (
          <Pressable
            onPress={() => onSelectChild?.('amara')}
            className="bg-white rounded-3xl p-5 mb-4 border border-line shadow-sm active:opacity-90"
          >
            {/* Status Pill Badge at Top-Left */}
            <View className="flex-row justify-start mb-2">
              <View
                style={{
                  backgroundColor: mode === 'pickup' ? '#E7F6EC' : '#FEF3F2',
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 999,
                }}
              >
                <Text
                  style={{
                    color: mode === 'pickup' ? '#027A48' : '#B42318',
                    fontSize: 10,
                    fontWeight: '800',
                    letterSpacing: 0.5,
                  }}
                >
                  {mode === 'pickup' ? 'AT SCHOOL' : 'STILL AT SCHOOL'}
                </Text>
              </View>
            </View>

            {/* Centered Profile Hero */}
            <View className="items-center">
              <FigmaAvatar name="Amara Okafor" size={84} />

              <Text className="text-xl font-bold text-ink mt-3 text-center">
                Amara Okafor
              </Text>
              <Text className="text-sm text-slate-500 mt-0.5 text-center">
                Primary 4A ·{' '}
              </Text>

              {/* Handlers Row */}
              <View className="items-center mt-2.5">
                <View className="flex-row items-center justify-center">
                  <View style={{ zIndex: 3, borderWidth: 2, borderColor: '#FFFFFF', borderRadius: 999 }}>
                    <FigmaAvatar name="Chidinma Okafor" size={30} />
                  </View>
                  <View style={{ zIndex: 2, marginLeft: -8, borderWidth: 2, borderColor: '#FFFFFF', borderRadius: 999 }}>
                    <FigmaAvatar name="Emeka Nwosu" size={30} />
                  </View>
                  <View style={{ zIndex: 1, marginLeft: -8, borderWidth: 2, borderColor: '#FFFFFF', borderRadius: 999 }}>
                    <FigmaAvatar name="Aisha Bello" size={30} />
                  </View>
                </View>
                <Text className="text-sm text-slate-500 font-medium mt-1 text-center">
                  Chidinma +2 handlers
                </Text>
              </View>
            </View>
          </Pressable>
        )}

        {/* Child 2: David Okafor */}
        {children.find((c) => c.id === 'david') && (
          <Pressable
            onPress={() => onSelectChild?.('david')}
            className="bg-white rounded-3xl p-5 mb-4 border border-line shadow-sm active:opacity-90"
          >
            {/* Status Pill Badge at Top-Left */}
            <View className="flex-row justify-start mb-2">
              <View
                style={{
                  backgroundColor: mode === 'pickup' ? '#E7F6EC' : '#EBF3FA',
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 999,
                }}
              >
                <Text
                  style={{
                    color: mode === 'pickup' ? '#027A48' : '#026AA2',
                    fontSize: 10,
                    fontWeight: '800',
                    letterSpacing: 0.5,
                  }}
                >
                  {mode === 'pickup' ? 'AT SCHOOL' : 'COLLECTED'}
                </Text>
              </View>
            </View>

            {/* Centered Profile Hero */}
            <View className="items-center">
              <FigmaAvatar name="David Okafor" size={84} />

              <Text className="text-xl font-bold text-ink mt-3 text-center">
                David Okafor
              </Text>
              <Text className="text-sm text-slate-500 mt-0.5 text-center">
                Primary 1B ·{' '}
              </Text>

              {/* Handlers Row */}
              <View className="items-center mt-2.5">
                <View style={{ borderWidth: 2, borderColor: '#FFFFFF', borderRadius: 999 }}>
                  <FigmaAvatar name="Chidinma Okafor" size={30} />
                </View>
                <Text className="text-sm text-slate-500 font-medium mt-1 text-center">
                  Chidinma
                </Text>
              </View>
            </View>
          </Pressable>
        )}

        {/* Fallback for other children if added dynamically */}
        {children
          .filter((c) => c.id !== 'amara' && c.id !== 'david')
          .map((child) => {
            const childHandlers = handlers.filter((h) => h.childIds.includes(child.id));
            const firstHandler = childHandlers[0]?.name.split(' ')[0] ?? 'You';
            const extraCount = childHandlers.length > 1 ? ` +${childHandlers.length - 1} handlers` : '';

            return (
              <Pressable
                key={child.id}
                onPress={() => onSelectChild?.(child.id)}
                className="bg-white rounded-3xl p-5 mb-4 border border-line shadow-sm active:opacity-90"
              >
                <View className="flex-row justify-start mb-2">
                  <View
                    style={{
                      backgroundColor: '#E7F6EC',
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      borderRadius: 999,
                    }}
                  >
                    <Text
                      style={{
                        color: '#027A48',
                        fontSize: 10,
                        fontWeight: '800',
                        letterSpacing: 0.5,
                      }}
                    >
                      AT SCHOOL
                    </Text>
                  </View>
                </View>

                <View className="items-center">
                  <FigmaAvatar name={child.name} size={84} />
                  <Text className="text-xl font-bold text-ink mt-3 text-center">
                    {child.name}
                  </Text>
                  <Text className="text-sm text-slate-500 mt-0.5 text-center">
                    {child.klass} ·{' '}
                  </Text>

                  <View className="items-center mt-2.5">
                    {childHandlers[0] && (
                      <View style={{ borderWidth: 2, borderColor: '#FFFFFF', borderRadius: 999 }}>
                        <FigmaAvatar name={childHandlers[0].name} size={24} />
                      </View>
                    )}
                    <Text className="text-sm text-slate-500 font-medium mt-1 text-center">
                      {firstHandler}{extraCount}
                    </Text>
                  </View>
                </View>
              </Pressable>
            );
          })}

        {/* INFORMATION BANNER matching Figma P03a */}
        <View
          style={{
            backgroundColor: '#EAF2F8',
            borderColor: '#D0E4FA',
            borderWidth: 1,
            borderRadius: 24,
            padding: 16,
            marginBottom: 16,
          }}
        >
          <Text style={{ fontSize: 13, color: '#344054', lineHeight: 20 }}>
            Each child has their own code, window and collector. Only Greenfield Academy can add or remove a child.
          </Text>
        </View>

        {/* AUTHORIZED HANDLERS CARD matching Figma P03a */}
        <View className="bg-white rounded-3xl p-4 mb-4 border border-line shadow-sm">
          <View className="flex-row justify-between items-center mb-2 px-1">
            <Text className="text-sm font-bold text-slate-600 tracking-wider">
              AUTHORIZED HANDLERS
            </Text>
            <Pressable onPress={onOpenHandlers} hitSlop={8}>
              <Text className="text-sm font-bold text-navy">Manage</Text>
            </Pressable>
          </View>

          {handlers.map((handler, idx) => (
            <Pressable
              key={handler.id}
              className={`flex-row items-center py-3 ${
                idx !== handlers.length - 1 ? 'border-b border-slate-100' : ''
              } active:opacity-70`}
              onPress={onOpenHandlers}
            >
              <FigmaAvatar name={handler.name} size={40} />
              <View className="flex-1 ml-3">
                <Text className="text-sm font-bold text-ink">
                  {handler.name}
                </Text>
                <Text className="text-sm text-slate-500 mt-0.5">
                  {handler.relationship} · {handler.days}
                </Text>
              </View>
              <Feather name="chevron-right" size={16} color="#98A2B3" />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

