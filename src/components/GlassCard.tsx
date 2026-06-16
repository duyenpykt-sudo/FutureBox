import { type ReactNode } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { Feather } from '@expo/vector-icons';
import { animation, colors, glass, radius, shadow, spacing } from '../constants/theme';

type GlassVariant = 'default' | 'strong';

interface GlassCardProps {
  children: ReactNode;
  /** 'strong' = card nổi bật / modal (blur & nền đậm hơn). */
  variant?: GlassVariant;
  /** Hộp "Sẵn sàng mở": viền accent + glow. */
  highlighted?: boolean;
  /** Hộp "Đã mở": làm mờ. */
  muted?: boolean;
  /** Empty/placeholder: viền đứt nét, nền trong suốt. */
  dashed?: boolean;
  /** Nếu truyền, card có thể nhấn (kèm hiệu ứng scale). */
  onPress?: () => void;
  /** Hiện nút expand ↗ góc trên-phải. */
  onExpand?: () => void;
  padding?: number;
  style?: StyleProp<ViewStyle>;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function GlassCard({
  children,
  variant = 'default',
  highlighted = false,
  muted = false,
  dashed = false,
  onPress,
  onExpand,
  padding = spacing.lg,
  style,
}: GlassCardProps) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const onPressIn = () => {
    scale.value = withTiming(0.98, { duration: animation.press });
  };
  const onPressOut = () => {
    scale.value = withTiming(1, { duration: animation.press });
  };

  const surfaceColor = variant === 'strong' ? glass.surfaceStrong : glass.surface;
  const blurIntensity = variant === 'strong' ? glass.blurIntensityStrong : glass.blurIntensity;

  const containerStyle: StyleProp<ViewStyle> = [
    styles.container,
    !dashed && shadow.card,
    highlighted && styles.highlighted,
    muted && styles.muted,
    style,
  ];

  const inner = (
    <>
      {/* Lớp kính: blur + nền + viền */}
      {dashed ? (
        <View style={[styles.fill, styles.dashed]} />
      ) : (
        <>
          <BlurView
            tint={glass.blurTint}
            intensity={blurIntensity}
            style={styles.fill}
            pointerEvents="none"
          />
          <View
            style={[
              styles.fill,
              { backgroundColor: surfaceColor, borderColor: glass.border },
            ]}
            pointerEvents="none"
          />
        </>
      )}

      <View style={{ padding }}>{children}</View>

      {onExpand && (
        <Pressable
          onPress={onExpand}
          hitSlop={12}
          style={styles.expandBtn}
          accessibilityRole="button"
          accessibilityLabel="Mở rộng"
        >
          <Feather name="maximize-2" size={16} color={colors.textPrimary} />
        </Pressable>
      )}
    </>
  );

  if (onPress) {
    return (
      <AnimatedPressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={[containerStyle, animatedStyle]}
        accessibilityRole="button"
      >
        {inner}
      </AnimatedPressable>
    );
  }

  return <View style={containerStyle}>{inner}</View>;
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.card,
    overflow: 'hidden',
  },
  fill: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: radius.card,
    borderWidth: glass.borderWidth,
    borderColor: 'transparent',
  },
  dashed: {
    borderStyle: 'dashed',
    borderColor: colors.glassBorder,
    backgroundColor: 'transparent',
  },
  highlighted: {
    borderWidth: 1.5,
    borderColor: colors.accent,
    shadowColor: colors.accent,
    shadowOpacity: 0.45,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
  muted: {
    opacity: 0.6,
  },
  expandBtn: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.glassSurface,
    borderWidth: glass.borderWidth,
    borderColor: colors.glassBorder,
  },
});
