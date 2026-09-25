import { useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { BottomTabBar } from '../components';
import { useFamily } from '../data/FamilyContext';
import { Child, eligibleHandlers, firstChildForHandler } from '../data/family';
import { colors } from '../theme';
import { ChildrenScreen } from './ChildrenScreen';
import { ChildDetailsScreen } from './ChildDetailsScreen';
import { TodaysPlanScreen } from './TodaysPlanScreen';
import { HandlersFlow } from './HandlersFlow';
import { PickupFlow } from './PickupFlow';
import { ActivityScreen } from './ActivityScreen';
import { HandoverRecordScreen } from './HandoverRecordScreen';
import { MoreScreen } from './MoreScreen';
import {
  HomeHeader,
  HomeStatusBanner,
  HomeChildrenSection,
  HomeQuickActions,
  HomeRecentActivity,
  HomeCompletedView,
  HomeCodeModal,
  HomeModals,
  OperationalState,
} from '../components/home';

export type { OperationalState };

export function HomeScreen() {
  const { guardianName, children, handlers } = useFamily();
  const [activeTab, setActiveTab] = useState<'home' | 'children' | 'activity' | 'more'>('home');
  const [operationalState, setOperationalState] = useState<OperationalState>('active');
  const [subflow, setSubflow] = useState<'none' | 'handlers' | 'pickup' | 'child-details' | 'todays-plan' | 'handover-record'>('none');
  const [selectedActivityId, setSelectedActivityId] = useState<string>('amara-picked-up');
  const [selectedChildId, setSelectedChildId] = useState<string>(children[0]?.id ?? 'amara');
  const sessionChildIds = children.map((c) => c.id);
  const [handlerId, setHandlerId] = useState('chidinma');
  const [pickupStart, setPickupStart] = useState<'week' | 'choose'>('week');
  const [pickupKey, setPickupKey] = useState(0);
  const [codeModalChild, setCodeModalChild] = useState<Child | null>(null);
  const [codeOverlayMode, setCodeOverlayMode] = useState<'qr' | 'digits'>('qr');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);

  // Subflow navigation
  if (subflow === 'child-details') {
    return (
      <ChildDetailsScreen
        initialChildId={selectedChildId}
        operationalState={operationalState}
        onBack={() => setSubflow('none')}
        onSelectChild={(childId) => setSelectedChildId(childId)}
        onOpenPickup={(childId) => {
          const next = eligibleHandlers(handlers, childId, 'pickup')[0];
          setSelectedChildId(childId);
          if (next) setHandlerId(next.id);
          setPickupStart('week');
          setPickupKey((n) => n + 1);
          setSubflow('pickup');
        }}
        onOpenDropoff={(childId) => {
          const next = eligibleHandlers(handlers, childId, 'dropoff')[0] ?? eligibleHandlers(handlers, childId, 'pickup')[0];
          setSelectedChildId(childId);
          if (next) setHandlerId(next.id);
          setPickupStart('week');
          setPickupKey((n) => n + 1);
          setSubflow('pickup');
        }}
        onOpenHandlers={() => setSubflow('handlers')}
        onViewPlan={(childId) => {
          setSelectedChildId(childId);
          setSubflow('todays-plan');
        }}
        onViewActivity={() => {
          setSubflow('none');
          setActiveTab('activity');
        }}
      />
    );
  }

  if (subflow === 'todays-plan') {
    return (
      <TodaysPlanScreen
        childId={selectedChildId}
        onBack={() => setSubflow('none')}
        onOpenDropoff={() => handlePlanDropoff()}
        onOpenPickup={() => {
          const next = eligibleHandlers(handlers, selectedChildId, 'pickup')[0];
          if (next) setHandlerId(next.id);
          setPickupStart('week');
          setPickupKey((n) => n + 1);
          setSubflow('pickup');
        }}
      />
    );
  }

  if (subflow === 'handlers') {
    return (
      <HandlersFlow
        initialHandlerId={handlerId}
        onBack={() => setSubflow('none')}
        onOpenPickup={(id) => {
          const handler = handlers.find((h) => h.id === id);
          setHandlerId(id);
          setSelectedChildId(firstChildForHandler(handler, children[0]?.id ?? selectedChildId, sessionChildIds));
          setPickupStart('choose');
          setPickupKey((n) => n + 1);
          setSubflow('pickup');
        }}
      />
    );
  }

  if (subflow === 'pickup') {
    return (
      <PickupFlow
        key={pickupKey}
        childId={selectedChildId}
        handlerId={handlerId}
        startAt={pickupStart}
        onSelectHandler={setHandlerId}
        onBack={() => setSubflow('none')}
        onHandlers={() => setSubflow('handlers')}
      />
    );
  }

  if (subflow === 'handover-record') {
    return (
      <HandoverRecordScreen
        activityId={selectedActivityId}
        onBack={() => setSubflow('none')}
      />
    );
  }

  const topInset = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 48;

  const handlePlanDropoff = () => {
    const next = eligibleHandlers(handlers, selectedChildId, 'dropoff')[0] ?? eligibleHandlers(handlers, selectedChildId, 'pickup')[0];
    if (next) setHandlerId(next.id);
    setPickupStart('week');
    setPickupKey((n) => n + 1);
    setSubflow('pickup');
  };

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
              const next = eligibleHandlers(handlers, id, 'pickup')[0];
              setSelectedChildId(id);
              if (next) setHandlerId(next.id);
              setPickupStart('week');
              setPickupKey((n) => n + 1);
              setSubflow('pickup');
            }}
          />
        </View>
      ) : activeTab === 'activity' ? (
        <View className="flex-1">
          <ActivityScreen
            onSelectActivity={(activity) => {
              setSelectedActivityId(activity.id);
              setSubflow('handover-record');
            }}
          />
        </View>
      ) : activeTab === 'more' ? (
        <View style={{ flex: 1 }}>
          <MoreScreen />
        </View>
      ) : operationalState === 'completed' ? (
        /* DROP-OFF COMPLETED STATE */
        <HomeCompletedView
          topInset={topInset}
          onViewActivity={() => setActiveTab('activity')}
          onManagePickup={() => {
            const next = eligibleHandlers(handlers, selectedChildId, 'pickup')[0];
            if (next) setHandlerId(next.id);
            setPickupStart('week');
            setPickupKey((n) => n + 1);
            setSubflow('pickup');
          }}
          onGoHome={() => setOperationalState('active')}
        />
      ) : (
        /* HOME ACTIVE, UPCOMING, & NO SCHOOL STATES */
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        >
          {/* HEADER */}
          <HomeHeader
            topInset={topInset}
            operationalState={operationalState}
            onSelectOperationalState={(state) => setOperationalState(state)}
            onOpenNotifications={() => setShowNotifications(true)}
          />

          {/* BODY CONTENT */}
          <View className="px-4 pt-4">
            <HomeStatusBanner
              operationalState={operationalState}
              onManageDropoff={handlePlanDropoff}
            />

            <HomeChildrenSection
              operationalState={operationalState}
              childrenList={children}
              onSelectChild={(childId) => {
                setSelectedChildId(childId);
                setSubflow('child-details');
              }}
              onViewPlan={(childId) => {
                setSelectedChildId(childId);
                setSubflow('todays-plan');
              }}
              onShowCode={(child) => {
                setCodeModalChild(child);
                setCodeOverlayMode('qr');
              }}
            />

            <HomeQuickActions
              onOpenHandlers={() => setSubflow('handlers')}
              onOpenException={() => {
                const next = eligibleHandlers(handlers, selectedChildId, 'pickup')[0];
                if (next) setHandlerId(next.id);
                setPickupStart('choose');
                setPickupKey((n) => n + 1);
                setSubflow('pickup');
              }}
              onOpenPlan={() => setSubflow('todays-plan')}
            />

            <HomeRecentActivity
              operationalState={operationalState}
              onSeeAll={() => setActiveTab('activity')}
            />
          </View>
        </ScrollView>
      )}

      {/* FIXED BOTTOM NAVIGATION BAR */}
      <BottomTabBar
        activeTab={activeTab}
        onTabPress={(tab) => setActiveTab(tab)}
      />

      {/* CODE OVERLAY MODAL */}
      <HomeCodeModal
        visible={codeModalChild !== null}
        child={codeModalChild}
        mode={codeOverlayMode}
        topInset={topInset}
        onClose={() => setCodeModalChild(null)}
        onToggleMode={() => setCodeOverlayMode((prev) => (prev === 'qr' ? 'digits' : 'qr'))}
      />

      {/* NOTIFICATIONS & PLAN MODALS */}
      <HomeModals
        showNotifications={showNotifications}
        onCloseNotifications={() => setShowNotifications(false)}
        showPlanModal={showPlanModal}
        onClosePlanModal={() => setShowPlanModal(false)}
      />
    </View>
  );
}
