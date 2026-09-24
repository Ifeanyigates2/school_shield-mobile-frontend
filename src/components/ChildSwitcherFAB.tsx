import React, { useRef, useState, useEffect, useMemo } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { FigmaAvatar } from '../components';
import { Child } from '../data/family';

export interface ChildSwitcherFABProps {
  childrenList: Child[];
  activeChildId: string;
  onSelectChild: (childId: string) => void;
  topInset?: number;
}

const AVATAR_SIZE = 50;
const OVERLAP = 14;
const FAB_HEIGHT = 90;
const MARGIN = 16;
const MAX_VISIBLE_AVATARS = 4;

export function ChildSwitcherFAB({
  childrenList,
  activeChildId,
  onSelectChild,
  topInset = 48,
}: ChildSwitcherFABProps) {
  const windowDimensions = Dimensions.get('window');
  const screenWidth = windowDimensions.width;
  const screenHeight = windowDimensions.height;

  // Active child
  const activeChild =
    childrenList.find((c) => c.id === activeChildId) ?? childrenList[0];

  // Stable ordering: David first (left), Amara second (right), then any additional children
  const orderedChildren = useMemo(() => {
    const list = [...childrenList];
    list.sort((a, b) => {
      if (a.id === 'david') return -1;
      if (b.id === 'david') return 1;
      if (a.id === 'amara') return -1;
      if (b.id === 'amara') return 1;
      return 0;
    });
    return list;
  }, [childrenList]);

  // Handle multiple children: up to MAX_VISIBLE_AVATARS directly visible in the FAB row
  const hasOverflow = orderedChildren.length > MAX_VISIBLE_AVATARS;
  const visibleChildren = useMemo(
    () =>
      hasOverflow
        ? orderedChildren.slice(0, MAX_VISIBLE_AVATARS - 1)
        : orderedChildren,
    [orderedChildren, hasOverflow]
  );
  const extraCount = hasOverflow
    ? orderedChildren.length - visibleChildren.length
    : 0;
  const totalItemCount = visibleChildren.length + (extraCount > 0 ? 1 : 0);

  // Dynamic width based on the number of children
  const rowWidth =
    AVATAR_SIZE + (totalItemCount - 1) * (AVATAR_SIZE - OVERLAP);
  const fabWidth = Math.max(90, rowWidth + 6);

  // Item centers & touch boundaries
  const boundaries = useMemo(() => {
    const startX = (fabWidth - rowWidth) / 2;
    const centers: number[] = [];
    for (let i = 0; i < totalItemCount; i++) {
      centers.push(startX + i * (AVATAR_SIZE - OVERLAP) + AVATAR_SIZE / 2);
    }
    const bounds: number[] = [];
    for (let i = 0; i < centers.length - 1; i++) {
      bounds.push((centers[i] + centers[i + 1]) / 2);
    }
    return bounds;
  }, [fabWidth, rowWidth, totalItemCount]);

  // Keep refs synchronized with latest props to avoid stale closures in PanResponder
  const visibleChildrenRef = useRef(visibleChildren);
  visibleChildrenRef.current = visibleChildren;

  const childrenListRef = useRef(childrenList);
  childrenListRef.current = childrenList;

  const onSelectChildRef = useRef(onSelectChild);
  onSelectChildRef.current = onSelectChild;

  const boundariesRef = useRef(boundaries);
  boundariesRef.current = boundaries;

  const fabWidthRef = useRef(fabWidth);
  fabWidthRef.current = fabWidth;

  const [modalVisible, setModalVisible] = useState(false);

  // Position boundaries
  const minX = MARGIN;
  const maxX = screenWidth - fabWidth - MARGIN;
  const minY = topInset + 40;
  const maxY = screenHeight - FAB_HEIGHT - (Platform.OS === 'ios' ? 70 : 50);

  const boundsRef = useRef({ minX, maxX, minY, maxY, screenWidth, fabWidth });
  boundsRef.current = { minX, maxX, minY, maxY, screenWidth, fabWidth };

  // Default initial position: Left side next to hero profile matching Figma iPhone 22
  const defaultX = minX;
  const defaultY = topInset + 54;

  const pan = useRef(new Animated.ValueXY({ x: defaultX, y: defaultY })).current;
  const currentPos = useRef({ x: defaultX, y: defaultY });
  const scale = useRef(new Animated.Value(1)).current;
  const isDragging = useRef(false);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const id = pan.addListener((value) => {
      currentPos.current = value;
    });
    return () => {
      pan.removeListener(id);
    };
  }, [pan]);

  const snapToNearestEdge = (x: number, y: number) => {
    const { minX, maxX, minY, maxY, screenWidth, fabWidth } = boundsRef.current;
    const clampedY = Math.max(minY, Math.min(maxY, y));
    const snapX = x + fabWidth / 2 < screenWidth / 2 ? minX : maxX;

    Animated.spring(pan, {
      toValue: { x: snapX, y: clampedY },
      useNativeDriver: false,
      bounciness: 4,
      speed: 14,
    }).start();
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, gestureState) => {
          return Math.abs(gestureState.dx) > 3 || Math.abs(gestureState.dy) > 3;
        },
        onPanResponderGrant: () => {
          isDragging.current = false;
          pan.setOffset({
            x: currentPos.current.x,
            y: currentPos.current.y,
          });
          pan.setValue({ x: 0, y: 0 });

          Animated.spring(scale, {
            toValue: 0.94,
            useNativeDriver: false,
          }).start();

          if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
          }
          // Long press opens full selection sheet
          longPressTimer.current = setTimeout(() => {
            if (!isDragging.current) {
              setModalVisible(true);
            }
          }, 550);
        },
        onPanResponderMove: (_, gestureState) => {
          if (Math.abs(gestureState.dx) > 6 || Math.abs(gestureState.dy) > 6) {
            isDragging.current = true;
            if (longPressTimer.current) {
              clearTimeout(longPressTimer.current);
              longPressTimer.current = null;
            }
          }
          pan.setValue({ x: gestureState.dx, y: gestureState.dy });
        },
        onPanResponderRelease: (e, gestureState) => {
          if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
          }

          pan.flattenOffset();

          Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: false,
          }).start();

          const isTap =
            Math.abs(gestureState.dx) < 6 && Math.abs(gestureState.dy) < 6;

          if (isTap && !isDragging.current) {
            const currentFabWidth = fabWidthRef.current;
            let clickX = gestureState.x0 - currentPos.current.x;
            let clickY = gestureState.y0 - currentPos.current.y;

            if (isNaN(clickX) || clickX < 0 || clickX > currentFabWidth) {
              clickX = e?.nativeEvent?.locationX ?? currentFabWidth / 2;
            }
            if (isNaN(clickY) || clickY < 0 || clickY > FAB_HEIGHT) {
              clickY = e?.nativeEvent?.locationY ?? FAB_HEIGHT / 2;
            }

            // If tapped top header text area when > 2 children, open modal
            if (clickY < 36 && childrenListRef.current.length > 2) {
              setModalVisible(true);
            } else {
              // Find tapped item index by comparing clickX with boundaries
              const bounds = boundariesRef.current;
              let tappedIndex = 0;
              while (tappedIndex < bounds.length && clickX >= bounds[tappedIndex]) {
                tappedIndex++;
              }

              const currentVisible = visibleChildrenRef.current;
              if (tappedIndex < currentVisible.length) {
                // Clicked on a specific child icon!
                const targetChild = currentVisible[tappedIndex];
                if (targetChild) {
                  onSelectChildRef.current(targetChild.id);
                }
              } else {
                // Clicked on "+N" extra badge -> open full modal
                setModalVisible(true);
              }
            }
          }

          snapToNearestEdge(currentPos.current.x, currentPos.current.y);
        },
        onPanResponderTerminate: () => {
          if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
          }
          pan.flattenOffset();
          Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: false,
          }).start();
          snapToNearestEdge(currentPos.current.x, currentPos.current.y);
        },
      }),
    []
  );

  if (childrenList.length <= 1) {
    return null;
  }

  return (
    <>
      <Animated.View
        style={[
          styles.fabContainer,
          {
            transform: [
              { translateX: pan.x },
              { translateY: pan.y },
              { scale },
            ],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <View style={[styles.fabCard, { width: fabWidth }]}>
          <Text style={styles.fabTitle}>
            Switch child{'\n'}profile
          </Text>
          <View style={styles.avatarRow}>
            {visibleChildren.map((child, index) => {
              const isActive = child.id === activeChild.id;
              return (
                <View
                  key={child.id}
                  style={[
                    styles.avatarWrapper,
                    index > 0 && styles.overlappingAvatar,
                    { zIndex: index + 1 },
                  ]}
                >
                  <FigmaAvatar
                    name={child.name}
                    size={AVATAR_SIZE}
                    showStatusDot={isActive}
                  />
                </View>
              );
            })}
            {extraCount > 0 && (
              <View
                style={[
                  styles.extraBadge,
                  styles.overlappingAvatar,
                  { zIndex: visibleChildren.length + 1 },
                ]}
              >
                <Text style={styles.extraBadgeText}>+{extraCount}</Text>
              </View>
            )}
          </View>
        </View>
      </Animated.View>

      {/* FULL CHILD PICKER MODAL */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <Pressable
            style={styles.modalContent}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalHeading}>Switch child profile</Text>
                <Text style={styles.modalSubtitle}>
                  Select a child to view their details ({childrenList.length} profiles)
                </Text>
              </View>
              <Pressable
                onPress={() => setModalVisible(false)}
                hitSlop={8}
                style={styles.closeBtn}
              >
                <Feather name="x" size={20} color="#64748B" />
              </Pressable>
            </View>

            <View style={styles.childList}>
              {orderedChildren.map((child) => {
                const isSelected = child.id === activeChild.id;
                return (
                  <Pressable
                    key={child.id}
                    onPress={() => {
                      onSelectChild(child.id);
                      setModalVisible(false);
                    }}
                    style={[
                      styles.childCard,
                      isSelected && styles.childCardSelected,
                    ]}
                  >
                    <FigmaAvatar
                      name={child.name}
                      size={42}
                      showStatusDot={isSelected}
                    />
                    <View style={styles.childInfo}>
                      <Text
                        style={[
                          styles.childName,
                          isSelected && styles.childNameSelected,
                        ]}
                      >
                        {child.name}
                      </Text>
                      <Text style={styles.childClass}>
                        {child.klass} · {child.gate ?? 'Main Gate'}
                      </Text>
                    </View>
                    {isSelected ? (
                      <View style={styles.selectedBadge}>
                        <Feather name="check" size={14} color="#0B1F3D" />
                      </View>
                    ) : (
                      <Feather name="chevron-right" size={18} color="#94A3B8" />
                    )}
                  </Pressable>
                );
              })}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fabContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 999,
  },
  fabCard: {
    height: FAB_HEIGHT,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabTitle: {
    color: '#101828',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 17,
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarWrapper: {},
  overlappingAvatar: {
    marginLeft: -OVERLAP,
    borderRadius: (AVATAR_SIZE + 4) / 2,
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
  },
  extraBadge: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: '#0B1F3D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  extraBadgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  modalHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#101828',
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  childList: {
    gap: 10,
  },
  childCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  childCardSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
  },
  childInfo: {
    flex: 1,
    marginLeft: 12,
  },
  childName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#101828',
  },
  childNameSelected: {
    color: '#1E40AF',
  },
  childClass: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  selectedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
