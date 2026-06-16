import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, typography } from '../constants/designTokens';

interface PlaceholderScreenProps {
  title: string;
  description?: string;
}

/** Temporary screen used until this part of the implementation phase is built. */
export default function PlaceholderScreen({ title, description }: PlaceholderScreenProps) {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {navigation.canGoBack() && (
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Quay lại"
        >
          <Feather name="arrow-left" size={24} color={colors.textPrimary} />
        </Pressable>
      )}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description ?? 'Tính năng đang được phát triển.'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  backButton: {
    position: 'absolute',
    top: spacing.xxl,
    left: spacing.lg,
    padding: spacing.xs,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
