import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { BOX_TYPES } from '../constants/boxTypes';
import { colors, radius, shadow, spacing, typography } from '../constants/designTokens';
import type { Box, BoxStatus } from '../types/box';
import { formatDate } from '../utils/dateHelpers';
import { getCountdownText } from '../utils/boxStatus';

interface BoxCardProps {
  box: Box;
  status: BoxStatus;
  onPress: () => void;
  onDelete: () => void;
}

export default function BoxCard({ box, status, onPress, onDelete }: BoxCardProps) {
  const meta = BOX_TYPES[box.type];
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (status === 'ready') {
      pulse.value = withRepeat(
        withTiming(1.05, { duration: 750, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    } else {
      pulse.value = withTiming(1, { duration: 200 });
    }
  }, [status, pulse]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  return (
    <View style={styles.wrapper}>
      <Swipeable
        overshootRight={false}
        renderRightActions={() => (
          <Pressable
            style={styles.deleteAction}
            onPress={onDelete}
            accessibilityRole="button"
            accessibilityLabel="Xóa hộp"
          >
            <Feather name="trash-2" size={22} color="#fff" />
          </Pressable>
        )}
      >
        <Pressable
          onPress={onPress}
          style={({ pressed }) => [
            styles.card,
            status === 'opened' && styles.cardOpened,
            pressed && styles.cardPressed,
          ]}
        >
          <View style={[styles.iconCircle, { backgroundColor: `${meta.color}1A` }]}>
            <Feather name={meta.icon} size={20} color={meta.color} />
          </View>

          <View style={styles.content}>
            <Text style={styles.title} numberOfLines={1}>
              {box.title}
            </Text>
            {status === 'locked' && (
              <Text style={styles.caption}>{getCountdownText(box.unlockAt)}</Text>
            )}
            {status === 'opened' && box.openedAt && (
              <Text style={styles.caption}>Đã mở · {formatDate(box.openedAt)}</Text>
            )}
          </View>

          {status === 'ready' && (
            <Animated.View style={[styles.readyBadge, pulseStyle]}>
              <Feather name="unlock" size={14} color={colors.primary} />
              <Text style={styles.readyBadgeText}>Sẵn sàng mở</Text>
            </Animated.View>
          )}
        </Pressable>
      </Swipeable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    borderRadius: radius.card,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    ...shadow.card,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.lg,
  },
  cardOpened: {
    opacity: 0.7,
  },
  cardPressed: {
    backgroundColor: colors.background,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    marginLeft: spacing.md,
    marginRight: spacing.sm,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  caption: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs / 2,
  },
  readyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    borderRadius: radius.button,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    gap: spacing.xs,
  },
  readyBadgeText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '500',
  },
  deleteAction: {
    width: 72,
    height: '100%',
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
