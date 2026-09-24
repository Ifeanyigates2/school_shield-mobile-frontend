import React, { useState, useEffect } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import { FigmaAvatar } from "../components";
import { useFamily } from "../data/FamilyContext";
import { Child, CHILDREN } from "../data/family";
import { useAndroidBack } from "../useAndroidBack";
import { RecentActivity } from "../components/RecentActivity";
import { OperationalState } from "../components/home";
import { ChildSwitcherFAB } from "../components/ChildSwitcherFAB";

export interface ChildDetailsScreenProps {
  initialChildId?: string;
  operationalState?: OperationalState;
  onBack: () => void;
  onOpenPickup?: (childId: string) => void;
  onOpenDropoff?: (childId: string) => void;
  onOpenHandlers?: () => void;
  onViewPlan?: (childId: string) => void;
  onViewActivity?: () => void;
  onSelectChild?: (childId: string) => void;
}

export function ChildDetailsScreen({
  initialChildId = "amara",
  operationalState = "active",
  onBack,
  onOpenPickup,
  onOpenDropoff,
  onOpenHandlers,
  onViewPlan,
  onViewActivity,
  onSelectChild,
}: ChildDetailsScreenProps) {
  useAndroidBack(onBack);

  const { children = CHILDREN, handlers, guardianName } = useFamily();
  const [selectedChildId, setSelectedChildId] =
    useState<string>(initialChildId);
  const [currentOperationalState, setCurrentOperationalState] =
    useState<OperationalState>(operationalState);

  useEffect(() => {
    if (initialChildId) {
      setSelectedChildId(initialChildId);
    }
  }, [initialChildId]);

  useEffect(() => {
    setCurrentOperationalState(operationalState);
  }, [operationalState]);

  const handleSelectChild = (childId: string) => {
    setSelectedChildId(childId);
    onSelectChild?.(childId);
  };

  const activeChild: Child =
    children.find((c) => c.id === selectedChildId) ??
    children[0] ??
    CHILDREN[0];

  const isAtSchool = currentOperationalState === "active";
  const isAmara = activeChild.id === "amara";
  const checkInTime = isAmara ? "7:48 AM" : "7:52 AM";
  const childFirstName = activeChild.name.split(" ")[0];

  // Handlers authorized for this specific child
  const childHandlers = handlers.filter((h) =>
    h.childIds.includes(activeChild.id),
  );

  const topInset =
    Platform.OS === "android" ? (StatusBar.currentHeight ?? 24) : 48;
  const guardianInitial = (guardianName?.[0] ?? "Z").toUpperCase();

  return (
    <View className="flex-1 bg-canvas">
      <ExpoStatusBar style="dark" />

      {/* HEADER BAR */}
      <View
        className="bg-canvas px-4 pb-3 flex-row items-center justify-between"
        style={{ paddingTop: topInset + 4 }}
      >
        <View className="flex-row items-center gap-2">
          {/* Back button */}
          <Pressable
            onPress={onBack}
            className="w-10 h-10 rounded-full items-center justify-center active:bg-slate-200/70"
            hitSlop={8}
          >
            <Feather name="chevron-left" size={24} color="#101828" />
          </Pressable>
        </View>

        {/* Center title */}
        <Text className="text-base font-bold text-ink tracking-tight">
          Child details
        </Text>

        {/* Balance layout */}
        <View className="w-16" />
      </View>

      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 90 }}
        showsVerticalScrollIndicator={false}
      >
        {/* MAIN CHILD HERO PROFILE */}
        <View className="items-center mt-1 mb-5">
          {/* Large Avatar */}
          <View className="relative">
            <FigmaAvatar
              name={activeChild.name}
              size={88}
              showStatusDot={isAtSchool}
            />
          </View>

          {/* Child Name */}
          <Text className="text-3xl font-bold text-ink mt-3 text-center">
            {activeChild.name}
          </Text>

          {/* Class and Campus */}
          <Text className="text-md text-slate-500 mt-1 text-center">
            {activeChild.klass} · Greenfield Academy, Lekki Phase 1
          </Text>

          {/* Status Pill Badge (Tap to toggle state for testing: At school / Pickup vs At home / Drop-off) */}
          <Pressable
            onPress={() =>
              setCurrentOperationalState((prev) =>
                prev === "active" ? "upcoming" : "active"
              )
            }
            hitSlop={8}
            className="active:opacity-75"
          >
            {isAtSchool ? (
              <View className="flex-row items-center gap-1.5 bg-[#E8F7F0] px-4 py-2 rounded-full border border-emerald-200 mt-3">
                <View className="w-6 h-6 rounded-full bg-success items-center justify-center mt-0.5">
                  <Feather name="check" size={14} color="#FFFFFF" />
                </View>
                <Text className="text-sm font-semibold text-emerald-800">
                  At school · checked in {checkInTime}
                </Text>
              </View>
            ) : (
              <View className="bg-slate-100 px-3.5 py-1.5 rounded-xl border border-slate-200 mt-3">
                <Text className="text-[11px] font-bold text-slate-600 tracking-wider">
                  AT HOME
                </Text>
              </View>
            )}
          </Pressable>
        </View>

        {/* ACTION BUTTON(S) */}
        <View className="mb-6">
          {isAtSchool ? (
            /* AT SCHOOL STATE: Single Navy Manage Pickup Button (iPhone 23) */
            <Pressable
              className="bg-navy h-14 rounded-2xl items-center justify-center active:opacity-90 shadow-sm"
              onPress={() => onOpenPickup?.(activeChild.id)}
            >
              <Text className="text-white text-lg font-semibold">
                Manage pickup
              </Text>
            </Pressable>
          ) : (
            /* AT HOME STATE: Manage Drop-off & Manage Pickup (iPhone 22) */
            <View className="flex-row gap-3">
              <Pressable
                className="flex-1 bg-navy h-14 rounded-2xl items-center justify-center active:opacity-90 shadow-sm"
                onPress={() => onOpenDropoff?.(activeChild.id)}
              >
                <Text className="text-white text-md font-semibold">
                  Manage Drop-off
                </Text>
              </Pressable>
              <Pressable
                className="flex-1 bg-white border border-slate-300 h-14 rounded-2xl  items-center justify-center active:opacity-90 shadow-xs"
                onPress={() => onOpenPickup?.(activeChild.id)}
              >
                <Text className="text-navy text-md font-semibold">
                  Manage Pickup
                </Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* CHILD'S DAY SCHEDULE CARD */}

        <View className="bg-[#EAF2F8] rounded-3xl p-5 border border-line shadow-xs">
          <View className="mb-6">
            <View className="flex-row justify-between items-center mb-2 px-1">
              <Text className="text-sm font-bold text-slate-700 tracking-wider">
                {childFirstName.toUpperCase()}'S DAY
              </Text>
              <Pressable onPress={() => onViewPlan?.(activeChild.id)}>
                <Text className="text-sm font-bold text-navy underline">
                  View Today's plan
                </Text>
              </Pressable>
            </View>
            {/* Drop-off window */}
            <View className="flex-row justify-between items-center py-2.5  border-slate-100">
              <Text className="text-md text-slate-500 ">Drop-off window</Text>
              <Text className="text-sm font-bold text-ink">6:45 – 8:30 AM</Text>
            </View>

            {/* Pickup window */}
            <View className="flex-row justify-between items-center py-2.5  border-slate-100">
              <Text className="text-md text-slate-500 ">Pickup window</Text>
              <Text className="text-sm font-bold text-ink">2:30 – 3:30 PM</Text>
            </View>

            {isAtSchool ? (
              <>
                {/* Dropped-off */}
                <View className="flex-row justify-between items-center py-2.5  border-slate-100">
                  <Text className="text-md text-slate-500 ">Dropped-off</Text>
                  <Text className="text-sm font-bold text-ink">
                    {activeChild.droppingOff ?? "You"}
                  </Text>
                </View>

                {/* Checked In */}
                <View className="flex-row justify-between items-center py-2.5  border-slate-100">
                  <Text className="text-md text-slate-500 ">Checked In</Text>
                  <Text className="text-sm font-bold text-ink">
                    {checkInTime}
                  </Text>
                </View>

                {/* Authorized */}
                <View className="flex-row justify-between items-center py-2.5  border-slate-100">
                  <Text className="text-md text-slate-500 ">Authorized</Text>
                  <Text className="text-sm font-bold text-ink">Mrs Sam</Text>
                </View>

                {/* Picking up */}
                <View className="flex-row justify-between items-center pt-2.5">
                  <Text className="text-md text-slate-500 ">Picking up</Text>
                  <Text className="text-sm font-bold text-ink">
                    {activeChild.pickingUp ??
                      (isAmara ? "Chidinma Okafor" : "You")}
                  </Text>
                </View>
              </>
            ) : (
              <>
                {/* Assigned Drop-off */}
                <View className="flex-row justify-between items-center py-2.5  border-slate-100">
                  <Text className="text-md text-slate-500 ">
                    Assigned Drop-off
                  </Text>
                  <Text className="text-sm font-bold text-ink">
                    {activeChild.droppingOff ?? "You"}
                  </Text>
                </View>

                {/* Assigned Pickup */}
                <View className="flex-row justify-between items-center pt-2.5">
                  <Text className="text-md text-slate-500 ">
                    Assigned Pickup
                  </Text>
                  <Text className="text-sm font-bold text-ink">
                    {activeChild.pickingUp ??
                      (isAmara ? "Chidinma Okafor" : "You")}
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>

        {/* AUTHORIZED HANDLERS SECTION */}
        <View className="mb-6 mt-6">
          <View className="bg-white rounded-3xl p-4 border border-line shadow-xs">
            <View className="flex-row justify-between items-center mb-2 px-1">
              <Text className="text-md text-slate-700 tracking-wider">
                AUTHORIZED HANDLERS
              </Text>
              <Pressable onPress={onOpenHandlers}>
                <Text className="text-md text-ink">Manage</Text>
              </Pressable>
            </View>
            {childHandlers.length > 0 ? (
              childHandlers.map((handler, idx) => (
                <Pressable
                  key={handler.id}
                  className={`flex-row items-center py-3 ${
                    idx !== childHandlers.length - 1 ? " border-slate-100" : ""
                  } active:opacity-70`}
                  onPress={onOpenHandlers}
                >
                  <FigmaAvatar name={handler.name} size={42} />
                  <View className="flex-1 ml-3">
                    <Text className="text-md font-bold text-ink">
                      {handler.name}
                    </Text>
                    <Text className="text-md text-slate-500 mt-0.5">
                      {handler.relationship} · {handler.days}
                    </Text>
                  </View>
                  <Feather name="chevron-right" size={16} color="#98A2B3" />
                </Pressable>
              ))
            ) : (
              <Text className="text-xs text-slate-500 py-3 text-center">
                No handlers assigned yet.
              </Text>
            )}
          </View>
        </View>

        {/* RECENT ACTIVITY SECTION */}
        <RecentActivity
          childName={childFirstName}
          operationalState={currentOperationalState}
          onSeeAll={onViewActivity}
          className="mb-4"
        />
      </ScrollView>

      {/* DRAGGABLE CHILD SWITCHER FAB */}
      <ChildSwitcherFAB
        childrenList={children}
        activeChildId={activeChild.id}
        onSelectChild={handleSelectChild}
        topInset={topInset}
      />
    </View>
  );
}
