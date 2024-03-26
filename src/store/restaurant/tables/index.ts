import { OrderStatus } from '@/common/types/restaurant/order.interface';
import { ITable, TableMealStatus } from '@/common/types/restaurant/tables.interface';
import { create, } from 'zustand';

export interface TablesStateProps {
    tables: ITable[]
    setTables: (tables: ITable[]) => void
    tablesFilter: {
        client_name?: string
        is_open?: boolean | null
        section_ids?: string[]
        guests?: number[]
        meal_status?: TableMealStatus[]
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
        const { section_ids, guests, client_name, is_open, meal_status } = tablesFilter
        let tables: ITable[] = [...useTablesStore.getState().tables] || []

        if (section_ids && section_ids?.length > 0) {
            tables = tables?.filter((table) => section_ids.includes(table.section_id))
        }

        if (guests && guests?.length > 0) {
            tables = tables?.filter((table) => guests.includes(table?.guests))
        }

        if (client_name && client_name?.length > 0) {
            tables = tables?.filter((table) => client_name?.toLowerCase().includes((table?.client_name || '').toLowerCase()))
        }


        if (is_open !== undefined) {
            tables = tables?.filter((table) => is_open === table?.is_open)
        }

        if (meal_status && meal_status?.length > 0) {
            tables = tables?.filter((table) => meal_status?.includes(table.meal_status))
        }

        return tables
    },
    getTableById: (id: string) => useTablesStore.getState().tables.find((table: ITable) => table.id === id)
}));