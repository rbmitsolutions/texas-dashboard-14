import { IPrinters } from "@/common/types/restaurant/printers.interface";
import { create } from "zustand";

interface PrintersStateProps {
    printers: IPrinters[]
    setPrinters: (printers: IPrinters[]) => void
    defaultPrinter: IPrinters | undefined
    setDefaultPrinter: (printer: IPrinters) => void
}


export const usePrintersStore = create<PrintersStateProps>((set): PrintersStateProps => ({
    printers: [],
    setPrinters: (printers) => set({ printers }),
    defaultPrinter: undefined,
    setDefaultPrinter: (printer) => set({ defaultPrinter: printer })
}));
