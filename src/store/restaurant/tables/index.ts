import { ITable } from '@/common/types/restaurant/tables.interface';
import { create, } from 'zustand';

export interface TablesStateProps {
    tables: ITable[]
    setTables: (tables: ITable[]) => void
    tablesFilter: {
        client_name?: string
        is_open?: boolean | null
        section_ids?: string[]
        guests?: number[]
    }
    setTablesFilter: (filter: TablesStateProps['tablesFilter']) => void
    getTableById: (id: string) => ITable | undefined
    getTablesFiltered: (tablesFilter: TablesStateProps['tablesFilter']) => ITable[]
}


export const useTablesStore = create<TablesStateProps>((set): TablesStateProps => ({
    tables: [],
    setTables: (tables: ITable[]) => set({ tables }),
    tablesFilter: {},
    setTablesFilter: (tablesFilter: TablesStateProps['tablesFilter']) => set({ tablesFilter }),
    getTablesFiltered: (tablesFilter: TablesStateProps['tablesFilter']) => {
        const { section_ids, guests } = tablesFilter
        let tables: ITable[] = [...useTablesStore.getState().tables] || []

        if (section_ids && section_ids?.length > 0) {
            tables = tables?.filter((table) => section_ids.includes(table.section_id))
        }

        if (guests && guests?.length > 0) {
            tables = tables?.filter((table) => guests.includes(table?.guests ))
        }

        if (tablesFilter?.client_name && tablesFilter?.client_name?.length > 0) {
            tables = tables?.filter((table) => table.client_name?.toLowerCase().includes(tablesFilter?.client_name!.toLowerCase()))
        }

        if (tablesFilter?.is_open !== undefined) {
            tables = tables?.filter((table) => table.is_open === tablesFilter.is_open)
        }
        return tables
    },
    getTableById: (id: string) => useTablesStore.getState().tables.find((table: ITable) => table.id === id)
}));
