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
import { Child } from '../data/family';
import { colors } from '../theme';
import { ChildrenScreen } from './ChildrenScreen';
import { HandlersFlow } from './HandlersFlow';
import { PickupFlow } from './PickupFlow';
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

  const handlePlanDropoff = () => {
    setSelectedChildId('amara');
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
        /* DROP-OFF COMPLETED STATE */
        <HomeCompletedView
          topInset={topInset}
          onViewActivity={() => setActiveTab('activity')}
          onManagePickup={() => {
            setSelectedChildId('amara');
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
              onSelectChild={(childId) => {
                setSelectedChildId(childId);
                setActiveTab('children');
              }}
              onViewPlan={(childId) => {
                setSelectedChildId(childId);
                setShowPlanModal(true);
              }}
              onShowCode={(child) => {
                setCodeModalChild(child);
                setCodeOverlayMode('qr');
              }}
            />

            <HomeQuickActions
              onOpenHandlers={() => setSubflow('handlers')}
              onOpenException={() => {
                setSelectedChildId('amara');
                setSubflow('pickup');
              }}
              onOpenPlan={() => setShowPlanModal(true)}
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
