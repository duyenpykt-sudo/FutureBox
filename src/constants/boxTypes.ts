import type { ComponentProps } from 'react';
import type { Feather } from '@expo/vector-icons';
import type { BoxType } from '../types/box';

type FeatherIconName = ComponentProps<typeof Feather>['name'];

export interface BoxTypeMeta {
  type: BoxType;
  label: string;
  description: string;
  color: string;
  icon: FeatherIconName;
}

export const BOX_TYPES: Record<BoxType, BoxTypeMeta> = {
  letter: {
    type: 'letter',
    label: 'Hộp Tâm Sự',
    description: 'Ghi lại cảm xúc, suy nghĩ hiện tại của bạn',
    color: '#4F46E5',
    icon: 'edit-3',
  },
  goal: {
    type: 'goal',
    label: 'Hộp Mục Tiêu',
    description: 'Đặt mục tiêu và hẹn ngày đánh giá lại',
    color: '#818CF8',
    icon: 'target',
  },
  memory: {
    type: 'memory',
    label: 'Hộp Kỷ Niệm',
    description: 'Lưu giữ một khoảnh khắc đáng nhớ',
    color: '#64748B',
    icon: 'image',
  },
  decision: {
    type: 'decision',
    label: 'Hộp Nhật Ký Quyết Định',
    description: 'Ghi lại quyết định để đánh giá lại sau này',
    color: '#334155',
    icon: 'compass',
  },
};

export const BOX_TYPE_LIST: BoxTypeMeta[] = [
  BOX_TYPES.letter,
  BOX_TYPES.goal,
  BOX_TYPES.memory,
  BOX_TYPES.decision,
];

export const DEFAULT_LETTER_FOLLOW_UP_QUESTION = 'Mọi chuyện ổn chứ?';

export function getGoalFollowUpQuestion(goalName: string): string {
  return `Bạn đã đạt được mục tiêu "${goalName}" chưa?`;
}
