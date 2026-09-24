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

const FAB_WIDTH = 168;
const FAB_HEIGHT = 48;
const MARGIN = 16;

export function ChildSwitcherFAB({
  childrenList,
  activeChildId,
  onSelectChild,
  topInset = 48,
}: ChildSwitcherFABProps) {
  const windowDimensions = Dimensions.get('window');
  const screenWidth = windowDimensions.width;
  const screenHeight = windowDimensions.height;

  // Active child and next / other children
  const activeChild =
    childrenList.find((c) => c.id === activeChildId) ?? childrenList[0];
  const otherChildren = childrenList.filter((c) => c.id !== activeChild?.id);
  const nextChild = otherChildren[0] ?? activeChild;

  // Keep refs synchronized with latest props and computed values to avoid stale closures in PanResponder
  const activeChildRef = useRef(activeChild);
  activeChildRef.current = activeChild;

  const nextChildRef = useRef(nextChild);
  nextChildRef.current = nextChild;

  const childrenListRef = useRef(childrenList);
  childrenListRef.current = childrenList;

  const onSelectChildRef = useRef(onSelectChild);
  onSelectChildRef.current = onSelectChild;

  const [modalVisible, setModalVisible] = useState(false);

  // Position boundaries
  const minX = MARGIN;
  const maxX = screenWidth - FAB_WIDTH - MARGIN;
  const minY = topInset + 54;
  const maxY = screenHeight - FAB_HEIGHT - (Platform.OS === 'ios' ? 70 : 50);

  const boundsRef = useRef({ minX, maxX, minY, maxY, screenWidth });
  boundsRef.current = { minX, maxX, minY, maxY, screenWidth };

  // Default initial position: Bottom right
  const defaultX = maxX;
  const defaultY = screenHeight - 160;

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
    const { minX, maxX, minY, maxY, screenWidth } = boundsRef.current;
    const clampedY = Math.max(minY, Math.min(maxY, y));
    const snapX = x + FAB_WIDTH / 2 < screenWidth / 2 ? minX : maxX;

    Animated.spring(pan, {
      toValue: { x: snapX, y: clampedY },
      useNativeDriver: false,
      bounciness: 4,
      speed: 14,
    }).start();
  };

  const handleSwitchAction = () => {
    const currentList = childrenListRef.current;
    const targetNext = nextChildRef.current;
    if (currentList.length === 2 && targetNext) {
      // Direct instant toggle if 2 children
      onSelectChildRef.current(targetNext.id);
    } else {
      // Open selector sheet if > 2 children
      setModalVisible(true);
    }
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
          // Optional long press to open full selector
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
        onPanResponderRelease: (_, gestureState) => {
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
            handleSwitchAction();
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

  const nextChildFirstName = nextChild?.name.split(' ')[0] ?? 'Child';

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
        <View style={styles.fabPill}>
          <FigmaAvatar
            name={nextChild.name}
            size={32}
            showStatusDot={false}
          />
          <View style={styles.fabTextContainer}>
            <Text style={styles.fabPrimaryText} numberOfLines={1}>
              {childrenList.length === 2 ? nextChildFirstName : 'Switch child'}
            </Text>
            <Text style={styles.fabSubText} numberOfLines={1}>
              {childrenList.length === 2 ? 'Switch profile' : `${childrenList.length} profiles`}
            </Text>
          </View>
          <View style={styles.iconCircle}>
            <Feather name="repeat" size={12} color="#F5A524" />
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
                <Text style={styles.modalTitle}>Switch child profile</Text>
                <Text style={styles.modalSubtitle}>
                  Select a child to view their details
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
              {childrenList.map((child) => {
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
    elevation: 12,
  },
  fabPill: {
    width: FAB_WIDTH,
    height: FAB_HEIGHT,
    backgroundColor: '#0B1F3D',
    borderRadius: FAB_HEIGHT / 2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 8,
  },
  fabTextContainer: {
    flex: 1,
    marginLeft: 8,
    marginRight: 4,
    justifyContent: 'center',
  },
  fabPrimaryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  fabSubText: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '500',
  },
  iconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
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
  modalTitle: {
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
