import { useState } from 'react';
import { Platform, Pressable, ScrollView, StatusBar, Text, View } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { BottomTabBar } from '../components';
import { Child } from '../data/family';
import { colors } from '../theme';
import {
  HomeChildrenSection,
  HomeCodeModal,
  HomeCompletedView,
  HomeHeader,
  HomeNotificationsModal,
  HomePlanModal,
  HomeQuickActions,
  HomeRecentActivity,
  HomeStatusBanner,
  OperationalState,
} from '../components/home';
import { ChildrenScreen } from './ChildrenScreen';
import { HandlersFlow } from './HandlersFlow';
import { PickupFlow } from './PickupFlow';

export { OperationalState };

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
        <HomeCompletedView
          topInset={topInset}
          onManagePickup={() => {
            setSelectedChildId('amara');
            setSubflow('pickup');
          }}
          onGoHome={() => setOperationalState('active')}
          onViewActivity={() => setActiveTab('activity')}
        />
      ) : (
        /* HOME ACTIVE, UPCOMING, & NO SCHOOL STATES */
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        >
          {/* HEADER COMPONENT */}
          <HomeHeader
            topInset={topInset}
            operationalState={operationalState}
            onSelectState={(state) => setOperationalState(state)}
            onPressNotifications={() => setShowNotifications(true)}
          />

          {/* MAIN BODY CONTENT */}
          <View className="px-4 pt-4">
            {/* STATUS BANNER COMPONENT */}
            <HomeStatusBanner
              operationalState={operationalState}
              onActionPress={() => {
                setSelectedChildId('amara');
                setSubflow('pickup');
              }}
            />

            {/* CHILDREN CARDS SECTION COMPONENT */}
            <HomeChildrenSection
              operationalState={operationalState}
              onShowCode={(child) => {
                setCodeModalChild(child);
                setCodeOverlayMode('qr');
              }}
              onSelectChild={(childId) => {
                setSelectedChildId(childId);
                setActiveTab('children');
              }}
              onViewPlan={(childId) => {
                setSelectedChildId(childId);
                setShowPlanModal(true);
              }}
            />

            {/* QUICK ACTIONS COMPONENT */}
            <HomeQuickActions
              onOpenHandlers={() => setSubflow('handlers')}
              onOpenException={() => {
                setSelectedChildId('amara');
                setSubflow('pickup');
              }}
              onOpenPlan={() => setShowPlanModal(true)}
            />

            {/* RECENT ACTIVITY COMPONENT */}
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

      {/* OVERLAY MODAL (QR CODE & 4-DIGIT PIN) */}
      <HomeCodeModal
        child={codeModalChild}
        mode={codeOverlayMode}
        onToggleMode={() => setCodeOverlayMode(codeOverlayMode === 'qr' ? 'digits' : 'qr')}
        onClose={() => setCodeModalChild(null)}
        topInset={topInset}
      />

      {/* NOTIFICATIONS MODAL */}
      <HomeNotificationsModal
        visible={showNotifications}
        onClose={() => setShowNotifications(false)}
      />

      {/* TODAY'S PLAN MODAL */}
      <HomePlanModal
        visible={showPlanModal}
        onClose={() => setShowPlanModal(false)}
      />
    </View>
  );
}
