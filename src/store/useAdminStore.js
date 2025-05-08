import { create } from 'zustand';

import { localStorageKey } from 'src/constants/localStorageKey';

export const useAdminStore = create((set) => ({
  admin: JSON.parse(localStorage.getItem(localStorageKey.adminInfo)) || null,
  setAdmin: (admin) => {
    localStorage.setItem(localStorageKey.adminInfo, JSON.stringify(admin));
    set({ admin });
  },
  clearAdmin: () => {
    localStorage.removeItem(localStorageKey.adminInfo);
    set({ admin: null });
  },
}));
