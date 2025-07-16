import { create } from 'zustand'

export const usePlatformStore = create((set) => ({
    platform: "Blinkit",
    setPlatform: () => set((state) => ({ platform: state.platform })),
}))