import type { BaseBox, BoxStatus } from '../types/box';
import { daysUntil } from './dateHelpers';

const MS_PER_HOUR = 60 * 60 * 1000;
const EDIT_WINDOW_HOURS = 24;

/**
 * status (locked/ready/opened) is computed at runtime, never stored:
 * - opened_at IS NOT NULL -> opened
 * - opened_at IS NULL AND unlock_at <= now() -> ready
 * - otherwise -> locked
 */
export function getBoxStatus(box: Pick<BaseBox, 'openedAt' | 'unlockAt'>): BoxStatus {
  if (box.openedAt) return 'opened';
  if (new Date(box.unlockAt).getTime() <= Date.now()) return 'ready';
  return 'locked';
}

/**
 * canEdit = (now <= created_at + 24h) AND status == 'locked'
 */
export function canEditBox(box: Pick<BaseBox, 'createdAt'>, status: BoxStatus): boolean {
  if (status !== 'locked') return false;
  const createdAt = new Date(box.createdAt).getTime();
  return Date.now() <= createdAt + EDIT_WINDOW_HOURS * MS_PER_HOUR;
}

/** "Còn X ngày" countdown text for a locked box. */
export function getCountdownText(unlockAt: string): string {
  const days = daysUntil(unlockAt);
  if (days <= 0) return 'Còn dưới 1 ngày';
  return `Còn ${days} ngày`;
}

/**
 * Sort order: ready first -> locked (nearest unlock_at first) -> opened (nearest unlock_at first).
 */
export function compareBoxes(
  a: { status: BoxStatus; unlockAt: string },
  b: { status: BoxStatus; unlockAt: string }
): number {
  const statusOrder: Record<BoxStatus, number> = { ready: 0, locked: 1, opened: 2 };
  const orderDiff = statusOrder[a.status] - statusOrder[b.status];
  if (orderDiff !== 0) return orderDiff;
  return new Date(a.unlockAt).getTime() - new Date(b.unlockAt).getTime();
}
