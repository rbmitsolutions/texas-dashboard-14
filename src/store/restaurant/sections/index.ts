import { ISection } from "@/common/types/restaurant/tables.interface";
import { create } from "zustand";

interface SectionsStateProps {
    sections: ISection[]
    setSections: (sections: ISection[]) => void
}


export const useSectionsStore = create<SectionsStateProps>((set): SectionsStateProps => ({
    sections: [],
    setSections: (sections: ISection[]) => set({ sections })
}));
