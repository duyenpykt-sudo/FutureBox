import type { SQLiteDatabase } from 'expo-sqlite';
import type { Box, BoxType, FollowUpAnswer } from '../types/box';

const DATABASE_VERSION = 1;

/**
 * Schema follows design/database/schema.md: 1 `boxes` table with shared fields,
 * plus one 1-1 sub-table per box type holding the type-specific content/result.
 */
export async function migrateDbIfNeeded(db: SQLiteDatabase): Promise<void> {
  const result = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  const currentVersion = result?.user_version ?? 0;
  if (currentVersion >= DATABASE_VERSION) return;

  if (currentVersion === 0) {
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      PRAGMA foreign_keys = ON;

      CREATE TABLE IF NOT EXISTS boxes (
        id TEXT PRIMARY KEY NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('letter','goal','memory','decision')),
        title TEXT NOT NULL,
        created_at TEXT NOT NULL,
        unlock_at TEXT NOT NULL,
        opened_at TEXT,
        notification_id TEXT,
        user_id TEXT,
        sync_status TEXT
      );

      CREATE TABLE IF NOT EXISTS box_letters (
        box_id TEXT PRIMARY KEY NOT NULL REFERENCES boxes(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        follow_up_question TEXT NOT NULL,
        answer TEXT CHECK (answer IN ('yes','no'))
      );

      CREATE TABLE IF NOT EXISTS box_goals (
        box_id TEXT PRIMARY KEY NOT NULL REFERENCES boxes(id) ON DELETE CASCADE,
        goal_name TEXT NOT NULL,
        description TEXT,
        follow_up_question TEXT NOT NULL,
        answer TEXT CHECK (answer IN ('yes','no'))
      );

      CREATE TABLE IF NOT EXISTS box_memories (
        box_id TEXT PRIMARY KEY NOT NULL REFERENCES boxes(id) ON DELETE CASCADE,
        image_uri TEXT NOT NULL,
        note TEXT,
        message TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS box_decisions (
        box_id TEXT PRIMARY KEY NOT NULL REFERENCES boxes(id) ON DELETE CASCADE,
        decision_name TEXT NOT NULL,
        context TEXT NOT NULL,
        rating INTEGER CHECK (rating BETWEEN 1 AND 5),
        reflection TEXT
      );

      CREATE INDEX IF NOT EXISTS idx_boxes_unlock_at ON boxes(unlock_at);
      CREATE INDEX IF NOT EXISTS idx_boxes_opened_at ON boxes(opened_at);
      CREATE INDEX IF NOT EXISTS idx_boxes_type ON boxes(type);
    `);
  }

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}

interface BoxRow {
  id: string;
  type: BoxType;
  title: string;
  created_at: string;
  unlock_at: string;
  opened_at: string | null;
  notification_id: string | null;
  user_id: string | null;
  sync_status: string | null;
}

interface LetterRow {
  content: string;
  follow_up_question: string;
  answer: FollowUpAnswer | null;
}

interface GoalRow {
  goal_name: string;
  description: string | null;
  follow_up_question: string;
  answer: FollowUpAnswer | null;
}

interface MemoryRow {
  image_uri: string;
  note: string | null;
  message: string;
}

interface DecisionRow {
  decision_name: string;
  context: string;
  rating: number | null;
  reflection: string | null;
}

// Sắp xếp: ready trước -> locked (unlock_at gần nhất trước) -> opened (unlock_at gần nhất trước)
const ORDER_BY_CLAUSE = `
  ORDER BY
    CASE WHEN opened_at IS NULL AND unlock_at <= datetime('now') THEN 0
         WHEN opened_at IS NULL THEN 1
         ELSE 2 END,
    unlock_at ASC
`;

/** Load all boxes joined with their type-specific content/result table. */
export async function getAllBoxes(db: SQLiteDatabase): Promise<Box[]> {
  const rows = await db.getAllAsync<BoxRow>(`SELECT * FROM boxes ${ORDER_BY_CLAUSE}`);

  const boxes: Box[] = [];
  for (const row of rows) {
    const base = {
      id: row.id,
      title: row.title,
      createdAt: row.created_at,
      unlockAt: row.unlock_at,
      openedAt: row.opened_at,
      notificationId: row.notification_id,
      userId: row.user_id,
      syncStatus: row.sync_status,
    };

    switch (row.type) {
      case 'letter': {
        const content = await db.getFirstAsync<LetterRow>(
          'SELECT content, follow_up_question, answer FROM box_letters WHERE box_id = ?',
          [row.id]
        );
        if (!content) continue;
        boxes.push({
          ...base,
          type: 'letter',
          content: content.content,
          followUpQuestion: content.follow_up_question,
          answer: content.answer,
        });
        break;
      }
      case 'goal': {
        const content = await db.getFirstAsync<GoalRow>(
          'SELECT goal_name, description, follow_up_question, answer FROM box_goals WHERE box_id = ?',
          [row.id]
        );
        if (!content) continue;
        boxes.push({
          ...base,
          type: 'goal',
          goalName: content.goal_name,
          description: content.description,
          followUpQuestion: content.follow_up_question,
          answer: content.answer,
        });
        break;
      }
      case 'memory': {
        const content = await db.getFirstAsync<MemoryRow>(
          'SELECT image_uri, note, message FROM box_memories WHERE box_id = ?',
          [row.id]
        );
        if (!content) continue;
        boxes.push({
          ...base,
          type: 'memory',
          imageUri: content.image_uri,
          note: content.note,
          message: content.message,
        });
        break;
      }
      case 'decision': {
        const content = await db.getFirstAsync<DecisionRow>(
          'SELECT decision_name, context, rating, reflection FROM box_decisions WHERE box_id = ?',
          [row.id]
        );
        if (!content) continue;
        boxes.push({
          ...base,
          type: 'decision',
          decisionName: content.decision_name,
          context: content.context,
          rating: content.rating,
          reflection: content.reflection,
        });
        break;
      }
    }
  }

  return boxes;
}

/** Delete a box and its type-specific row (ON DELETE CASCADE). */
export async function deleteBoxById(db: SQLiteDatabase, id: string): Promise<void> {
  await db.runAsync('DELETE FROM boxes WHERE id = ?', [id]);
}
