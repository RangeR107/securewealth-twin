import { create } from 'zustand';
import type { ProfileKey } from '../data/mockData';
import { PROFILES } from '../data/mockData';

interface ProfileStore {
  activeProfile: ProfileKey;
  setProfile: (key: ProfileKey) => void;
  profile: typeof PROFILES[ProfileKey];
}

export const useProfileStore = create<ProfileStore>((set) => ({
  activeProfile: 'priya',
  profile: PROFILES['priya'],
  setProfile: (key: ProfileKey) =>
    set({ activeProfile: key, profile: PROFILES[key] }),
}));
