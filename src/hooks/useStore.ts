//import { create } from 'zustand'

//const useStore = create((set) => ({
//    bears: 0,
//    increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
//    removeAllBears: () => set({ bears: 0 }),
//    updateBears: (newBears) => set({ bears: newBears }),
//}))

// HOW TO USE HOOKS
//function BearCounter() {
//    const bears = useStore((state) => state.bears)
//    return <h1>{bears} bears around here...</h1>
//}

//function Controls() {
//    const increasePopulation = useStore((state) => state.increasePopulation)
//    return <button onClick={increasePopulation}>one up</button>
//}
import { create } from "zustand";
import { Application } from "@prisma/client"; // or your extended type

type TrackerStore = {
  favoriteApplications: Application[]; // type accordingly
  setFavoriteApplications: (apps: Application[]) => void;
};

export const useTrackerStore = create<TrackerStore>((set) => ({
  favoriteApplications: [],
  setFavoriteApplications: (apps) => set({ favoriteApplications: apps }),
}));
