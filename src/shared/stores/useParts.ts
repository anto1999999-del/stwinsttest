import { create } from "zustand";

export type PartsState = {
  selectedYear: number | null;
  selectedStartYear: number | null;
  selectedEndYear: number | null;
  selectedMake: string | null;
  selectedModel: string | null;
  selectedCategory: string | null;
  selectedQuery: string | null;
  isInitializingFromURL: boolean;
};

export type PartsAction = {
  setSelectedYear: (year: number | null) => void;
  setSelectedStartYear: (year: number | null) => void;
  setSelectedEndYear: (year: number | null) => void;
  setSelectedMake: (make: string | null) => void;
  setSelectedModel: (model: string | null) => void;
  setSelectedCategory: (category: string | null) => void;
  setSelectedQuery: (query: string | null) => void;
  setIsInitializingFromURL: (isInitializing: boolean) => void;
};

const useParts = create<PartsState & PartsAction>((set) => ({
  selectedYear: null,
  selectedStartYear: null,
  selectedEndYear: null,
  selectedMake: null,
  selectedModel: null,
  selectedCategory: null,
  selectedQuery: null,
  isInitializingFromURL: false,
  setSelectedYear: (year) => set({ selectedYear: year }),
  setSelectedStartYear: (year) => set({ selectedStartYear: year }),
  setSelectedEndYear: (year) => set({ selectedEndYear: year }),
  setSelectedMake: (make) => set({ selectedMake: make }),
  setSelectedModel: (model) => set({ selectedModel: model }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSelectedQuery: (query) => set({ selectedQuery: query }),
  setIsInitializingFromURL: (isInitializing) =>
    set({ isInitializingFromURL: isInitializing }),
}));

export default useParts;
