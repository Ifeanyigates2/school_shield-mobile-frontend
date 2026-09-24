import { useState } from 'react';
import {
  Platform,
  ScrollView,
  StatusBar,
  View,
} from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Child } from '@/src/data/family';
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
} from '@/src/components/home';

export default function HomeScreen() {
  const router = useRouter();
  const [operationalState, setOperationalState] = useState<OperationalState>('active');
  const [codeModalChild, setCodeModalChild] = useState<Child | null>(null);
  const [codeOverlayMode, setCodeOverlayMode] = useState<'qr' | 'digits'>('qr');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);

  const topInset = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 48;

  const handlePlanDropoff = () => {
    router.push({ pathname: '/pickup', params: { childId: 'amara' } });
  };

  return (
    <View className="flex-1 bg-canvas">
      <ExpoStatusBar style="light" />

      {operationalState === 'completed' ? (
        /* DROP-OFF COMPLETED STATE */
        <HomeCompletedView
          topInset={topInset}
          onViewActivity={() => router.push('/(tabs)/activity')}
          onManagePickup={() => router.push({ pathname: '/pickup', params: { childId: 'amara' } })}
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
                router.push({ pathname: '/child-details', params: { childId, state: operationalState } });
              }}
              onViewPlan={(childId) => {
                router.push({ pathname: '/todays-plan', params: { childId } });
              }}
              onShowCode={(child) => {
                setCodeModalChild(child);
                setCodeOverlayMode('qr');
              }}
            />

            <HomeQuickActions
              onOpenHandlers={() => router.push('/handlers')}
              onOpenException={() => {
                router.push({ pathname: '/pickup', params: { childId: 'amara' } });
              }}
              onOpenPlan={() => router.push({ pathname: '/todays-plan', params: { childId: 'amara' } })}
            />

            <HomeRecentActivity
              operationalState={operationalState}
              onSeeAll={() => router.push('/(tabs)/activity')}
            />
          </View>
        </ScrollView>
      )}

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
