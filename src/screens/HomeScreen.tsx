import { useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { Feather, Ionicons } from '@expo/vector-icons';
import { BottomTabBar, FigmaAvatar, PrimaryButton } from '../components';
import { CHILDREN, Child } from '../data/family';
import { colors } from '../theme';
import { ChildrenScreen } from './ChildrenScreen';
import { HandlersFlow } from './HandlersFlow';
import { PickupFlow } from './PickupFlow';

export type OperationalState = 'no_school' | 'upcoming' | 'active' | 'completed';

export function HomeScreen() {
  const [activeTab, setActiveTab] = useState<'home' | 'children' | 'activity' | 'more'>('home');
  const [operationalState, setOperationalState] = useState<OperationalState>('active');
  const [subflow, setSubflow] = useState<'none' | 'handlers' | 'pickup'>('none');
  const [selectedChildId, setSelectedChildId] = useState<string>('amara');
  const [codeModalChild, setCodeModalChild] = useState<Child | null>(null);
  const [codeOverlayMode, setCodeOverlayMode] = useState<'qr' | 'digits'>('qr');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);

  // Subflow navigation
  if (subflow === 'handlers') {
    return (
      <HandlersFlow
        initialHandlerId="chidinma"
        onBack={() => setSubflow('none')}
        onOpenPickup={() => setSubflow('pickup')}
      />
    );
  }

  if (subflow === 'pickup') {
    return (
      <PickupFlow
        childId={selectedChildId}
        onBack={() => setSubflow('none')}
        onHandlers={() => setSubflow('handlers')}
      />
    );
  }

  const topInset = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 48;

  return (
    <View className="flex-1 bg-canvas">
      <ExpoStatusBar style="light" />

      {activeTab === 'children' ? (
        <View className="flex-1">
          <ChildrenScreen
            initialChildId={selectedChildId}
            onSelectChild={(id) => setSelectedChildId(id)}
            onOpenHandlers={() => setSubflow('handlers')}
            onOpenPickup={(id) => {
              setSelectedChildId(id);
              setSubflow('pickup');
            }}
          />
        </View>
      ) : activeTab === 'activity' ? (
        <View className="flex-1 items-center justify-center px-8 bg-canvas" style={{ paddingTop: topInset }}>
          <Feather name="calendar" size={48} color={colors.navy} />
          <Text className="text-2xl font-bold text-ink mt-4 mb-2">Activity & History</Text>
          <Text className="text-sm text-mute text-center leading-6 mb-6">
            Past pickup logs, gate check-in confirmations, and handler audits will be listed here.
          </Text>
          <Pressable
            className="bg-navy py-3 px-6 rounded-2xl"
            onPress={() => setActiveTab('home')}
          >
            <Text className="text-white text-sm font-semibold">Back to Home</Text>
          </Pressable>
        </View>
      ) : activeTab === 'more' ? (
        <View className="flex-1 items-center justify-center px-8 bg-canvas" style={{ paddingTop: topInset }}>
          <Feather name="settings" size={48} color={colors.navy} />
          <Text className="text-2xl font-bold text-ink mt-4 mb-2">School Settings</Text>
          <Text className="text-sm text-mute text-center leading-6 mb-6">
            Greenfield Academy parent preferences, emergency broadcast settings, and profile details.
          </Text>
          <Pressable
            className="bg-navy py-3 px-6 rounded-2xl"
            onPress={() => setActiveTab('home')}
          >
            <Text className="text-white text-sm font-semibold">Back to Home</Text>
          </Pressable>
        </View>
      ) : operationalState === 'completed' ? (
        /* DROP-OFF COMPLETED STATE (RIGHTMOST FIGMA FRAME) */
        <View className="flex-1 bg-navyDeep px-6 justify-between pb-8" style={{ paddingTop: topInset + 20 }}>
          <View className="items-center">
            <View className="w-16 h-16 rounded-full bg-emerald-950 items-center justify-center mb-6 border border-emerald-500/30">
              <View className="w-10 h-10 rounded-full bg-success items-center justify-center">
                <Feather name="check" size={22} color="#FFFFFF" />
              </View>
            </View>

            <Text className="text-white text-2xl font-bold tracking-tight">Drop-off Completed</Text>
            <Text className="text-slate-400 text-sm mt-2 text-center">
              Both Amara and David are in school.
            </Text>

            {/* Attendance Status Card */}
            <View className="w-full bg-slate-800/60 rounded-3xl p-5 mt-8 border border-slate-700/60">
              <View className="flex-row justify-between items-center py-3 border-b border-slate-700/40">
                <View className="flex-row items-center gap-3">
                  <FigmaAvatar name="Amara Okafor" size={36} />
                  <Text className="text-white font-semibold text-base">Amara</Text>
                </View>
                <Text className="text-slate-300 font-medium text-sm">7:48 AM | Mrs Sam</Text>
              </View>

              <View className="flex-row justify-between items-center py-3">
                <View className="flex-row items-center gap-3">
                  <FigmaAvatar name="David Okafor" size={36} />
                  <Text className="text-white font-semibold text-base">David</Text>
                </View>
                <Text className="text-slate-300 font-medium text-sm">7:52 AM | Mrs Sam</Text>
              </View>

              <Pressable
                className="mt-4 pt-3 border-t border-slate-700/40 items-center"
                onPress={() => setActiveTab('activity')}
              >
                <Text className="text-sky-400 font-bold text-sm">View Activity</Text>
              </Pressable>
            </View>
          </View>

          <View className="w-full gap-3">
            <Pressable
              className="w-full bg-white h-14 rounded-2xl items-center justify-center shadow-lg"
              onPress={() => {
                setSelectedChildId('amara');
                setSubflow('pickup');
              }}
            >
              <Text className="text-navy font-bold text-base">Manage Pickup</Text>
            </Pressable>

            <Pressable
              className="w-full h-12 rounded-2xl items-center justify-center"
              onPress={() => setOperationalState('active')}
            >
              <Text className="text-slate-300 font-semibold text-sm">Go to Home</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        /* HOME ACTIVE, UPCOMING, & NO SCHOOL STATES */
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        >
          {/* FIGMA TOP NAV / HEADER */}
          <View
            className="bg-navy p-8 py-12"
            style={{ paddingTop: topInset + 20 }}
          >
            <View className="flex-row justify-between items-center">
              {/* Profile & School Info */}
              <View className="flex-row items-center gap-3">
                <FigmaAvatar name="Zara" size={50} />
                <View className="justify-center">
                  <Text className="text-primaryLight text-sm">Good morning, Zara</Text>
                  <Text className="text-white text-2xl font-bold tracking-tight ">Greenfield Academy</Text>
                </View>
              </View>

              {/* Notification Bell Button */}
              <Pressable
                className="w-12 h-12 rounded-xl bg-white items-center justify-center relative shadow-sm"
                onPress={() => setShowNotifications(true)}
                hitSlop={8}
              >
                <Feather name="bell" size={20} color="#101828" />
                <View className="absolute top-1 right-1 bg-[#B93A3A] w-5 h-5 rounded-full items-center justify-center border-2 border-white">
                  <Text className="text-white text-[10px] font-extrabold">2</Text>
                </View>
              </Pressable>
            </View>

            {/* State Preview Switcher */}
            <View className="flex-row bg-white/10 rounded-2xl p-1 mt-4">
              {(['no_school', 'upcoming', 'active', 'completed'] as OperationalState[]).map((stateKey) => {
                const isActive = operationalState === stateKey;
                const label =
                  stateKey === 'no_school'
                    ? 'No School'
                    : stateKey === 'upcoming'
                    ? 'At 6:45'
                    : stateKey === 'active'
                    ? 'Codes Live'
                    : 'Completed';
                return (
                  <Pressable
                    key={stateKey}
                    className={`flex-1 py-1.5 rounded-xl items-center justify-center ${
                      isActive ? 'bg-white' : ''
                    }`}
                    onPress={() => setOperationalState(stateKey)}
                  >
                    <Text
                      className={`text-[11px] font-semibold ${
                        isActive ? 'text-navy font-bold' : 'text-slate-300'
                      }`}
                    >
                      {label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* BODY CONTENT */}
          <View className="px-4 pt-4">
            {/* STATUS BANNER */}
            {operationalState === 'no_school' ? (
              <View className="bg-bannerBlue rounded-3xl p-4 border border-bannerBlueBorder mb-4">
                <View className="flex-row items-start gap-3">
                  <View className="w-6 h-6 rounded-full bg-[#1C5A85] items-center justify-center mt-0.5">
                    <Text className="text-white text-xs font-bold italic">i</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-bold text-[#1C5A85]">No school today</Text>
                    <Text className="text-sm text-[#1C5A85] leading-5 mt-1">
                      Next school day is Monday 7 September.{'\n'}Drop-off opens 7:00 AM at Main Gate.
                    </Text>
                  </View>
                </View>
                <Pressable
                  className="bg-navy rounded-xl h-12 items-center justify-center mt-3.5"
                  onPress={() => {
                    setSelectedChildId('amara');
                    setSubflow('pickup');
                  }}
                >
                  <Text className="text-white text-sm font-semibold">Plan Monday's drop-off</Text>
                </Pressable>
              </View>
            ) : operationalState === 'upcoming' ? (
              <View className="bg-bannerBlue rounded-3xl p-4 border border-bannerBlueBorder mb-4">
                <View className="flex-row items-start gap-3">
                  <View className="w-6 h-6 rounded-full bg-navy items-center justify-center mt-0.5">
                    <Text className="text-white text-xs font-bold italic">i</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-bold text-ink">Drop-off opens at 6:45AM</Text>
                    <Text className="text-xs text-slate-600 leading-5 mt-1">
                      Both children are assigned. Codes are issued automatically at 6:40 AM
                    </Text>
                  </View>
                </View>
                <Pressable
                  className="bg-navy rounded-xl h-12 items-center justify-center mt-3.5"
                  onPress={() => {
                    setSelectedChildId('amara');
                    setSubflow('pickup');
                  }}
                >
                  <Text className="text-white text-sm font-semibold">Manage Drop-off</Text>
                </Pressable>
              </View>
            ) : (
              /* State 3: Active Drop-off / Codes Live */
              <View className="bg-bannerGreen rounded-3xl p-4 border border-bannerGreenBorder mb-4">
                <View className="flex-row items-start gap-3">
                  <View className="w-6 h-6 rounded-full bg-success items-center justify-center mt-0.5">
                    <Feather name="check" size={14} color="#FFFFFF" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-bold text-bannerGreenText">
                      Drop-off is open until 8:30 AM
                    </Text>
                    <Text className="text-xs text-emerald-900 leading-5 mt-1">
                      Amara's code is on this phone. David's sent to Chidinma by SMS.
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* CHILDREN SECTION */}
            <View className="mb-4">
              {operationalState === 'active' ? (
                /* EXPANDED CARDS FOR CODES LIVE (IPHONE 19 / 27) */
                <View className="gap-3">
                  {CHILDREN.map((child) => {
                    const isAmara = child.id === 'amara';
                    const pickingPerson = isAmara ? 'You' : 'Chidinma';

                    return (
                      <View
                        key={child.id}
                        className="bg-white rounded-[24px] p-4 border border-line shadow-sm"
                      >
                        <View className="flex-row items-center justify-between">
                          <View className="flex-row items-center gap-3 flex-1">
                            <FigmaAvatar name={child.name} size={48} showStatusDot />
                            <View className="flex-1">
                              <Text className="text-base font-bold text-ink">{child.name}</Text>
                              <Text className="text-xs text-mute mt-0.5">
                                {child.klass} · {child.gate ?? 'Main Gate'}
                              </Text>
                            </View>
                          </View>
                          {/* Chevron Action Pill */}
                          <Pressable
                            className="w-8 h-8 rounded-xl bg-slate-50 items-center justify-center border border-slate-200"
                            onPress={() => {
                              setSelectedChildId(child.id);
                              setActiveTab('children');
                            }}
                          >
                            <Feather name="chevron-right" size={18} color="#667085" />
                          </Pressable>
                        </View>

                        <View className="flex-row justify-between items-end my-3 pt-1">
                          <View>
                            <Text className="text-xs text-mute font-medium">Picking up</Text>
                            <Text className="text-base font-bold text-ink mt-0.5">{pickingPerson}</Text>
                          </View>
                          <Pressable
                            onPress={() => {
                              setSelectedChildId(child.id);
                              setShowPlanModal(true);
                            }}
                          >
                            <Text className="text-xs font-bold text-navy underline">
                              View Today's plan
                            </Text>
                          </Pressable>
                        </View>

                        <Pressable
                          className="bg-navy h-12 rounded-xl items-center justify-center active:opacity-90"
                          onPress={() => {
                            setCodeModalChild(child);
                            setCodeOverlayMode('qr');
                          }}
                        >
                          <Text className="text-white text-sm font-semibold">Show Code</Text>
                        </Pressable>
                      </View>
                    );
                  })}

                  {/* Carousel Page Indicator (as seen in iPhone 19 / 27) */}
                  <View className="flex-row items-center justify-center gap-2 mt-1 mb-1">
                    <View className="w-2 h-2 rounded-full bg-navy" />
                    <View className="w-2 h-2 rounded-full bg-slate-300" />
                  </View>
                </View>
              ) : (
                /* COMPACT CARDS (IPHONE 13 BEFORE DROP-OFF) */
                <View className="gap-3">
                  {CHILDREN.map((child) => {
                    const isAmara = child.id === 'amara';
                    const dropPerson = isAmara ? 'You' : 'Chidinma';
                    const badgeLabel = operationalState === 'no_school' ? 'NO SCHOOL' : 'AT HOME';

                    return (
                      <Pressable
                        key={child.id}
                        className="flex-row items-center bg-white rounded-3xl p-3.5 border border-line shadow-sm"
                        onPress={() => {
                          setSelectedChildId(child.id);
                          setActiveTab('children');
                        }}
                      >
                        <FigmaAvatar name={child.name} size={46} />
                        <View className="flex-1 ml-3">
                          <Text className="text-base font-bold text-ink">{child.name}</Text>
                          <Text className="text-xs text-mute mt-0.5">
                            {child.klass} · {child.gate ?? 'Main Gate'}
                          </Text>
                          {operationalState === 'upcoming' && (
                            <Text className="text-xs text-ink mt-1">
                              Dropping off: <Text className="font-bold">{dropPerson}</Text>
                            </Text>
                          )}
                        </View>
                        <View className="bg-slate-100 px-2.5 py-1 rounded-xl mr-2">
                          <Text className="text-[11px] font-bold text-slate-600 tracking-wider">
                            {badgeLabel}
                          </Text>
                        </View>
                        <Feather name="chevron-right" size={18} color="#98A2B3" />
                      </Pressable>
                    );
                  })}
                </View>
              )}
            </View>

            {/* QUICK ACTIONS */}
            <View className="mb-2">
              <Text className="text-base font-bold text-ink mb-3">Quick Actions</Text>
              <View className="flex-row gap-3">
                {/* Handlers Tile */}
                <Pressable
                  className="flex-1 bg-[#E8F7F0] rounded-3xl py-4 items-center border border-actionGreenBorder"
                  onPress={() => setSubflow('handlers')}
                >
                  <View className="w-11 h-11 rounded-lg bg-[#0F6647] items-center justify-center mb-2 shadow-xs">
                    <Ionicons name="person-outline" size={20} color="#fff" />
                  </View>
                  <Text className="text-xs font-bold text-ink">Handlers</Text>
                </Pressable>

                {/* Exception Tile */}
                <Pressable
                  className="flex-1 bg-actionOrange rounded-3xl py-4 items-center border border-actionOrangeBorder"
                  onPress={() => {
                    setSelectedChildId('amara');
                    setSubflow('pickup');
                  }}
                >
                  <View className="w-11 h-11 rounded-lg bg-[#D9822B] items-center justify-center mb-2 shadow-xs">
                    <Feather name="clock" size={20} color="#fff" />
                  </View>
                  <Text className="text-xs font-bold text-ink">Exception</Text>
                </Pressable>

                {/* Today's plan Tile */}
                <Pressable
                  className="flex-1 bg-actionBlue rounded-3xl py-4 items-center border border-actionBlueBorder"
                  onPress={() => setShowPlanModal(true)}
                >
                  <View className="w-11 h-11 rounded-lg bg-navy items-center justify-center mb-2 shadow-xs">
                    <Feather name="calendar" size={20} color="#fff" />
                  </View>
                  <Text className="text-xs font-bold text-ink">Today's plan</Text>
                </Pressable>
              </View>
            </View>

            {/* RECENT ACTIVITY */}
            <View className="mt-4">
              <View className="flex-row justify-between items-center mb-2.5">
                <Text className="text-[11px] font-extrabold text-mute tracking-widest">
                  RECENT ACTIVITY
                </Text>
                <Pressable onPress={() => setActiveTab('activity')}>
                  <Text className="text-xs font-bold text-navy">See all</Text>
                </Pressable>
              </View>

              {operationalState === 'active' ? (
                /* Dynamic Activity Items for Active Codes State (Figma iPhone 19/27) */
                <View className="bg-white rounded-3xl p-3 border border-line gap-2">
                  <View className="flex-row items-center justify-between p-2 rounded-2xl bg-emerald-50/50">
                    <View className="flex-row items-center gap-3 flex-1">
                      <View className="w-9 h-9 rounded-xl bg-emerald-100 items-center justify-center">
                        <Feather name="file-text" size={16} color="#027A48" />
                      </View>
                      <View className="flex-1">
                        <Text className="text-xs font-bold text-ink">Code issued for Amara</Text>
                        <Text className="text-[11px] text-mute mt-0.5">Drop-off · expires 8:30 AM</Text>
                      </View>
                    </View>
                    <Text className="text-[11px] font-semibold text-mute">6:45 AM</Text>
                  </View>

                  <View className="flex-row items-center justify-between p-2 rounded-2xl bg-sky-50/50">
                    <View className="flex-row items-center gap-3 flex-1">
                      <View className="w-9 h-9 rounded-xl bg-sky-100 items-center justify-center">
                        <Feather name="message-square" size={16} color="#026AA2" />
                      </View>
                      <View className="flex-1">
                        <Text className="text-xs font-bold text-ink">Code sent to Chidinma</Text>
                        <Text className="text-[11px] text-mute mt-0.5">SMS · +234 805 221 4478</Text>
                      </View>
                    </View>
                    <Text className="text-[11px] font-semibold text-mute">6:45 AM</Text>
                  </View>
                </View>
              ) : (
                /* Quiet State Activity Card (Figma iPhone 13) */
                <View className="bg-white rounded-3xl p-5 border border-line">
                  <Text className="text-sm font-bold text-ink">Nothing since Friday</Text>
                  <Text className="text-xs text-mute mt-1 leading-5">
                    Friday's pickups are in Activity if you need them.
                  </Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      )}

      {/* FIXED BOTTOM NAVIGATION BAR */}
      <BottomTabBar
        activeTab={activeTab}
        onTabPress={(tab) => setActiveTab(tab)}
      />

      {/* FIGMA OVERLAYS (IPHONE 21: QR SCAN & IPHONE 20: 4-DIGIT CODE) */}
      <Modal
        visible={codeModalChild !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setCodeModalChild(null)}
      >
        <View className="flex-1 bg-navyDeep/95 justify-between px-6 pb-10" style={{ paddingTop: topInset + 20 }}>
          {/* Top Bar with Close */}
          <View className="flex-row justify-end">
            <Pressable
              className="w-10 h-10 rounded-full bg-white/10 items-center justify-center"
              onPress={() => setCodeModalChild(null)}
            >
              <Feather name="x" size={20} color="#FFFFFF" />
            </Pressable>
          </View>

          {codeOverlayMode === 'qr' ? (
            /* IPHONE 21: QR CODE OVERLAY */
            <View className="items-center flex-1 justify-center -mt-6">
              <Text className="text-white text-2xl font-bold tracking-tight">QR Code Scan</Text>
              <Text className="text-slate-400 text-xs mt-2 text-center max-w-[280px]">
                {codeModalChild?.name} · {codeModalChild?.klass}. Staff scans this QR, then she is checked in.
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
                {codeModalChild?.name} · {codeModalChild?.klass}. Staff scans or types the four digits, then she is checked in.
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
              onPress={() => setCodeOverlayMode(codeOverlayMode === 'qr' ? 'digits' : 'qr')}
            >
              <Text className="text-white font-semibold text-sm">
                {codeOverlayMode === 'qr' ? 'Use Code Instead' : 'Scan QR Code Instead'}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* NOTIFICATIONS MODAL */}
      <Modal
        visible={showNotifications}
        transparent
        animationType="fade"
        onRequestClose={() => setShowNotifications(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <Pressable className="flex-1" onPress={() => setShowNotifications(false)} />
          <View className="bg-white rounded-t-[32px] p-6 max-h-[85%]">
            <View className="w-10 h-1 rounded-full bg-slate-300 self-center mb-4" />
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold text-ink">Notifications (2)</Text>
              <Pressable
                className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center"
                onPress={() => setShowNotifications(false)}
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
                onPress={() => setShowNotifications(false)}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* TODAY'S PLAN MODAL */}
      <Modal
        visible={showPlanModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPlanModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <Pressable className="flex-1" onPress={() => setShowPlanModal(false)} />
          <View className="bg-white rounded-t-[32px] p-6 max-h-[85%]">
            <View className="w-10 h-1 rounded-full bg-slate-300 self-center mb-4" />
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold text-ink">Today's Plan</Text>
              <Pressable
                className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center"
                onPress={() => setShowPlanModal(false)}
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
                onPress={() => setShowPlanModal(false)}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
