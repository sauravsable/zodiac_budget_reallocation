import { create } from "zustand";

type PlatformStore = {
  platform: string;
  setPlatform: (newPlatform: string) => void;
};

type BrandStore = {
  selectedBrand: string;
  setSelectedBrand: (brand: string) => void;
};
type CityStore = {
  selectedCity: string;
  setSelectedCity: (brand: string) => void;
};

export const usePlatformStore = create<PlatformStore>((set) => ({
  platform: "Blinkit",
  setPlatform: (newPlatform: string) => set({ platform: newPlatform }),
}));

export const useBrandStore = create<BrandStore>((set) => ({
  selectedBrand: "",
  setSelectedBrand: (brand: string) => set({ selectedBrand: brand }),
}));

export const useCityStore = create<CityStore>((set) => ({
  selectedCity: "All Cities",
  setSelectedCity: (city: string) => set({ selectedCity: city }),
}));
