import { create } from 'zustand';

type PlatformStore = {
    platform: string;
    setPlatform: (newPlatform: string) => void;
}

export const usePlatformStore = create<PlatformStore>((set) => ({
    platform: "Blinkit",
    setPlatform: (newPlatform: string) => set({ platform: newPlatform }),
}));
