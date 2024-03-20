import { IMenuSection } from "@/common/types/restaurant/menu.interface";
import { create } from "zustand";

interface MenuSectionsStateProps {
    menuSections: IMenuSection[]
    setMenuSections: (menuSections: IMenuSection[]) => void
}


export const useMenuSectionsStore = create<MenuSectionsStateProps>((set): MenuSectionsStateProps => ({
    menuSections: [],
    setMenuSections: (menuSections) => set({ menuSections }),
}));
