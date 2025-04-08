// store/useFilterStore.ts
import { create } from "zustand";

type FilterState = {
  category: string[];
  materialType: string[];
  price: { min: number; max: number };
  style: string[];
  rating: string[];
  resetAll: () => void;
  setCategory: (value: string[]) => void;
  setMaterialType: (value: string[]) => void;
  setPrice: (value: { min: number; max: number }) => void;
  setStyle: (value: string[]) => void;
  setRating: (value: string[]) => void;
  resetExceptPrice: () => void;
};

export const useFilterStore = create<FilterState>((set) => ({
  category: [],
  materialType: [],
  price: { min: 0, max: 1000000 },
  style: [],
  rating: [],
  setCategory: (category) => set({ category }),
  setMaterialType: (materialType) => set({ materialType }),
  setPrice: (price) => set({ price }),
  setStyle: (style) => set({ style }),
  setRating: (rating) => set({ rating }),
  resetAll: () =>
    set({
      category: [],
      materialType: [],
      price: { min: 0, max: 1000000 },
      style: [],
      rating: [],
    }),
  resetExceptPrice: () =>
    set((state) => ({
      category: [],
      materialType: [],
      style: [],
      rating: [],
      price: state.price,
    })),
}));
