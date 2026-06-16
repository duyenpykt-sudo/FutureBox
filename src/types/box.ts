export type BoxType = 'letter' | 'goal' | 'memory' | 'decision';

export type BoxStatus = 'locked' | 'ready' | 'opened';

export type FollowUpAnswer = 'yes' | 'no';

export interface BaseBox {
  id: string;
  title: string;
  createdAt: string; // ISO8601
  unlockAt: string; // ISO8601
  openedAt: string | null; // ISO8601, null = chưa mở
  notificationId: string | null;
  userId: string | null;
  syncStatus: string | null;
}

export interface BoxLetterContent {
  type: 'letter';
  content: string;
  followUpQuestion: string;
  answer: FollowUpAnswer | null;
}

export interface BoxGoalContent {
  type: 'goal';
  goalName: string;
  description: string | null;
  followUpQuestion: string;
  answer: FollowUpAnswer | null;
}

export interface BoxMemoryContent {
  type: 'memory';
  imageUri: string;
  note: string | null;
  message: string;
}

export interface BoxDecisionContent {
  type: 'decision';
  decisionName: string;
  context: string;
  rating: number | null;
  reflection: string | null;
}

export type BoxContent =
  | BoxLetterContent
  | BoxGoalContent
  | BoxMemoryContent
  | BoxDecisionContent;

export type Box = BaseBox & BoxContent;
