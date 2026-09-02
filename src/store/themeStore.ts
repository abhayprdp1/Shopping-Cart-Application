import { create } from 'zustand';

interface ThemeStore {
  isDark: boolean;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  isDark: true,
  toggleTheme: () => {
    const next = !get().isDark;
    set({ isDark: next });
    // Apply class to <html>
    if (next) {
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
    }
  },
}));
