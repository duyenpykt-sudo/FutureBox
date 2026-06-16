import { create } from 'zustand';
import type { SQLiteDatabase } from 'expo-sqlite';
import type { Box } from '../types/box';
import { deleteBoxById, getAllBoxes } from '../services/database';

interface BoxStoreState {
  boxes: Box[];
  isLoading: boolean;
  error: string | null;
  loadBoxes: (db: SQLiteDatabase) => Promise<void>;
  deleteBox: (db: SQLiteDatabase, id: string) => Promise<void>;
}

export const useBoxStore = create<BoxStoreState>((set, get) => ({
  boxes: [],
  isLoading: false,
  error: null,

  loadBoxes: async (db) => {
    set({ isLoading: true, error: null });
    try {
      const boxes = await getAllBoxes(db);
      set({ boxes, isLoading: false });
    } catch {
      set({ error: 'Không thể tải danh sách hộp', isLoading: false });
    }
  },

  deleteBox: async (db, id) => {
    await deleteBoxById(db, id);
    set({ boxes: get().boxes.filter((box) => box.id !== id) });
  },
}));
