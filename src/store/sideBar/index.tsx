import { create } from 'zustand';

interface SideBarState {
    isOpen: boolean;
    toggleSideBar: () => void;
}

export const useSideBarStore = create<SideBarState>((set) => ({
    isOpen: false,
    toggleSideBar: () => set((state) => ({ isOpen: !state.isOpen })),
}));
