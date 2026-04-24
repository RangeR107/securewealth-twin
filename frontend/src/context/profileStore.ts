import { create } from 'zustand';
import type { ProfileKey, UserProfile } from '../data/mockData';
import { PROFILES } from '../data/mockData';
import { fetchProfiles } from '../data/api';

interface ProfileStore {
  activeProfile: ProfileKey;
  setProfile: (key: ProfileKey) => void;
  profile: UserProfile;
  all: Record<ProfileKey, UserProfile>;
  loaded: boolean;
  load: () => Promise<void>;
}

export const useProfileStore = create<ProfileStore>((set, get) => ({
  activeProfile: 'priya',
  profile: PROFILES['priya'],
  all: PROFILES,
  loaded: false,
  setProfile: (key: ProfileKey) => {
    const all = get().all;
    set({ activeProfile: key, profile: all[key] });
  },
  load: async () => {
    try {
      const all = await fetchProfiles();
      set({ all, profile: all[get().activeProfile], loaded: true });
    } catch (e) {
      // Backend unreachable — keep mockData fallback so the UI never breaks.
      console.warn('[profileStore] API fetch failed, using mockData fallback', e);
    }
  },
}));
