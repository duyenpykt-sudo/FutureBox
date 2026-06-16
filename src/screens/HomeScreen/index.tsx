import { useCallback, useMemo, useState } from 'react';
import { Alert, FlatList, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, SlideInUp, SlideOutUp } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSQLiteContext } from 'expo-sqlite';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BoxCard from '../../components/BoxCard';
import EmptyState from '../../components/EmptyState';
import { colors, radius, shadow, spacing, typography } from '../../constants/designTokens';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import type { Box, BoxStatus } from '../../types/box';
import { useBoxStore } from '../../store/useBoxStore';
import { compareBoxes, getBoxStatus } from '../../utils/boxStatus';

const NOTIFICATION_BANNER_DISMISSED_KEY = 'hasDismissedNotificationBanner';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const db = useSQLiteContext();
  const { boxes, loadBoxes, deleteBox } = useBoxStore();

  const [isBannerVisible, setIsBannerVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadBoxes(db);

      (async () => {
        const { status } = await Notifications.getPermissionsAsync();
        const dismissed = await AsyncStorage.getItem(NOTIFICATION_BANNER_DISMISSED_KEY);
        setIsBannerVisible(status === 'denied' && dismissed !== 'true');
      })();
    }, [db, loadBoxes])
  );

  const items = useMemo(() => {
    return boxes
      .map((box) => ({ box, status: getBoxStatus(box) }))
      .sort((a, b) =>
        compareBoxes(
          { status: a.status, unlockAt: a.box.unlockAt },
          { status: b.status, unlockAt: b.box.unlockAt }
        )
      );
  }, [boxes]);

  const handleCreate = () => {
    navigation.navigate('CreateBox');
  };

  const handleBoxPress = (box: Box, status: BoxStatus) => {
    if (status === 'ready') {
      navigation.navigate('OpenBox', { boxId: box.id });
    } else {
      navigation.navigate('BoxDetail', { boxId: box.id });
    }
  };

  const handleDelete = (boxId: string) => {
    Alert.alert('Xóa hộp', 'Hành động này không thể hoàn tác', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: () => deleteBox(db, boxId),
      },
    ]);
  };

  const handleDismissBanner = async () => {
    setIsBannerVisible(false);
    await AsyncStorage.setItem(NOTIFICATION_BANNER_DISMISSED_KEY, 'true');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hộp của tôi</Text>
      </View>

      {isBannerVisible && (
        <Animated.View
          entering={SlideInUp.duration(250)}
          exiting={SlideOutUp.duration(250)}
          style={styles.banner}
        >
          <Feather name="bell" size={18} color={colors.warning} />
          <Text style={styles.bannerText}>
            Bật thông báo để không bỏ lỡ khi hộp sẵn sàng mở
          </Text>
          <Pressable onPress={() => Linking.openSettings()} hitSlop={8}>
            <Text style={styles.bannerAction}>Cài đặt</Text>
          </Pressable>
          <Pressable
            onPress={handleDismissBanner}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Đóng thông báo"
          >
            <Feather name="x" size={18} color={colors.textSecondary} />
          </Pressable>
        </Animated.View>
      )}

      {items.length === 0 ? (
        <EmptyState onCreate={handleCreate} />
      ) : (
        <Animated.View entering={FadeIn.duration(300)} style={styles.listWrapper}>
          <FlatList
            data={items}
            keyExtractor={(item) => item.box.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <BoxCard
                box={item.box}
                status={item.status}
                onPress={() => handleBoxPress(item.box, item.status)}
                onDelete={() => handleDelete(item.box.id)}
              />
            )}
          />
        </Animated.View>
      )}

      <Pressable
        onPress={handleCreate}
        style={({ pressed }) => [
          styles.fab,
          { bottom: insets.bottom + spacing.xl },
          pressed && styles.fabPressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel="Tạo hộp mới"
      >
        <Feather name="plus" size={24} color="#fff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  headerTitle: {
    ...typography.h1,
    color: colors.textPrimary,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.warning}1A`,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    padding: spacing.md,
    borderRadius: radius.card,
    gap: spacing.sm,
  },
  bannerText: {
    ...typography.caption,
    color: colors.textPrimary,
    flex: 1,
  },
  bannerAction: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  listWrapper: {
    flex: 1,
  },
  listContent: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxxl + 56,
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: radius.fab,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.card,
  },
  fabPressed: {
    transform: [{ scale: 0.95 }],
  },
});
