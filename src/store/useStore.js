import create from 'zustand'

export const useStore = create(set => ({
  tasks: [],
  notes: [],
  // Diary now stores an array of entries: { id, date, title, content, mood }
  diary: [],
  setTasks: (tasks) => set({tasks}),
  setNotes: (notes) => set({notes}),
  setDiary: (diary) => set({diary}),
}))