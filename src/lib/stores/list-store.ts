import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export type ListItem = {
  id: string;
  emoji: string;
  text: string;
  checked: boolean;
};

export type List = {
  id: string;
  title: string;
  items: ListItem[];
  createdAt: Date;
  updatedAt: Date;
};

interface ListStoreState {
  lists: Record<string, List>;
  listOrder: string[];
  loading: boolean;
  error: string | null;
}

interface ListStoreActions {
  createList: (title: string) => string;
  addSharedList: (list: List) => string;
  deleteList: (id: string) => void;
  addItem: (listId: string, item: Omit<ListItem, 'id' | 'checked'>) => void;
  removeItem: (listId: string, itemId: string) => void;
  toggleItem: (listId: string, itemId: string) => void;
  updateTitle: (listId: string, title: string) => void;
  syncWithAPI: () => Promise<void>;
}

type ListStore = ListStoreState & ListStoreActions;

export const useListStore = create<ListStore>()(
    persist(
    (set) => ({
      lists: {},
      listOrder: [],
      loading: false,
      error: null,
      createList: (title) => {
        const newList = {
          id: uuidv4(),
          title,
          items: [],
          createdAt: new Date(),
          updatedAt: new Date()
        };
        set((state) => ({ 
          lists: { ...state.lists, [newList.id]: newList }
        }));
        return newList.id;
      },
      addSharedList: (list) => {
        set((state) => ({
          lists: {
            ...state.lists,
            [list.id]: list
          },
          listOrder: [list.id, ...state.listOrder.filter((id: string) => id !== list.id)]
        }));
        return list.id;
      },
      deleteList: (id) => set((state) => ({
        lists: Object.fromEntries(
          Object.entries(state.lists).filter(([key]) => key !== id)
        )
      })),
      addItem: (listId, item) => set((state) => {
        const newItem = { ...item, id: uuidv4(), checked: false };
        return {
          lists: {
            ...state.lists,
            [listId]: {
              ...state.lists[listId],
              items: [...state.lists[listId].items, newItem],
              updatedAt: new Date()
            }
          }
        };
      }),
      removeItem: (listId, itemId) => set((state) => ({
        lists: {
          ...state.lists,
          [listId]: {
            ...state.lists[listId],
            items: state.lists[listId].items.filter(item => item.id !== itemId),
            updatedAt: new Date()
          }
        }
      })),
      toggleItem: (listId, itemId) => set((state) => {
        const list = state.lists[listId];
        return {
          lists: {
            ...state.lists,
            [listId]: {
              ...list,
              items: list.items.map(item => 
                item.id === itemId ? {...item, checked: !item.checked} : item
              ),
              updatedAt: new Date()
            }
          }
        };
      }),
      updateTitle: (listId, title) => set((state) => ({
        lists: {
          ...state.lists,
          [listId]: {
            ...state.lists[listId],
            title,
            updatedAt: new Date()
          }
        }
      })),
      syncWithAPI: async () => {
        set({ loading: true, error: null });
        try {
          // TODO: Implement actual API sync
          set({ loading: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Sync failed', loading: false });
        }
      }
    }),
    {
      name: 'shopping-list-storage',
      version: 1,
      migrate: (persistedState: unknown, version: number) => {
        // Migration for adding emojis to existing items
        if (version < 1) {
          const state = persistedState as {
            lists?: Record<string, List>;
            listOrder?: string[];
          };
          
          return {
            ...state,
            lists: Object.fromEntries(
              Object.entries(state?.lists || {}).map(([id, list]) => [
                id,
                {
                  ...list,
                  items: list.items.map((item) => ({
                    ...item,
                    emoji: item.emoji || '🛒' // Default to shopping cart emoji
                  }))
                }
              ])
            ),
            listOrder: state?.listOrder || []
          };
        }
        return persistedState;
      }
    }
  )
);
