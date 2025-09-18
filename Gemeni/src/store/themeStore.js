import {create} from 'zustand';

const useThemeStore = create((set) => ({
  theme: 'light',
  toggle: () => set((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),
  setTheme: (t) => set({ theme: t }),
}));

export default useThemeStore;
