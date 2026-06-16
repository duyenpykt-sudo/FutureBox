import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../constants/designTokens';

interface EmptyStateProps {
  onCreate: () => void;
}

export default function EmptyState({ onCreate }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.illustration}>
        <Feather name="package" size={64} color={colors.border} />
      </View>
      <Text style={styles.title}>Chưa có hộp nào</Text>
      <Text style={styles.description}>
        Tạo hộp đầu tiên để gửi điều gì đó cho tương lai của bạn
      </Text>
      <Pressable
        style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
        onPress={onCreate}
        accessibilityRole="button"
        accessibilityLabel="Tạo hộp mới"
      >
        <Text style={styles.ctaText}>Tạo hộp mới</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
  },
  illustration: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  cta: {
    backgroundColor: colors.primary,
    borderRadius: radius.button,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  ctaPressed: {
    backgroundColor: colors.primaryDark,
  },
  ctaText: {
    ...typography.bodyMedium,
    color: '#fff',
  },
});
