import { IGETMenuOrderSystemResponse } from '@/hooks/restaurant/IGetRestaurantDataHooks.interface';
import { create } from 'zustand';

export interface IMenuOrderSystemFilter {
    allergens?: string[]
    mn_type_id?: string
    id?: string[]
    sort?: {
        options_priority?: boolean
    },
    short_title?: string
    to_order?: boolean
}

interface OrderSystemMenuState {
    menu: IGETMenuOrderSystemResponse[]
    setMenu: ({
        menu,
        menuFilter
    }: {
        menu: IGETMenuOrderSystemResponse[]
        menuFilter?: IMenuOrderSystemFilter
    }) => void
}

export const getFilteredOrderSystemMenu = ({ menuItems, menuFilter }: {
    menuItems: IGETMenuOrderSystemResponse[]
    menuFilter?: IMenuOrderSystemFilter
}): IGETMenuOrderSystemResponse[] => {
    if (!menuFilter) return menuItems

    let menu = menuItems

    if (menuFilter?.mn_type_id) {
        menu = menu?.filter((item) => item?.mn_type_id === menuFilter?.mn_type_id);
    }

    if (menuFilter?.allergens && menuFilter?.allergens.length > 0) {
        menu = menu?.filter((item) => item?.allergens?.some((allergen) => menuFilter?.allergens?.includes(allergen)));
    }

    if (menuFilter?.id && menuFilter?.id.length > 0) {
        menu = menu?.filter((item) => menuFilter?.id?.includes(item?.id));
    }

    if (menuFilter?.sort?.options_priority) {
        menu = menu?.sort((a, b) => {
            if (a?.options_priority === b?.options_priority) {
                return 0;
            }
            return a?.options_priority > b?.options_priority ? -1 : 1;
        });
    }

    if (menuFilter?.short_title) {
        menu = menu?.filter((item) => item?.short_title?.toLowerCase().includes(menuFilter?.short_title?.toLowerCase() || ''));
    }

    if (menuFilter?.to_order) {
        menu = menu?.filter((item) => item?.to_order === menuFilter?.to_order);
    }

    return menu
}

export const useOrderSystemMenuStore = create<OrderSystemMenuState>((set) => ({
    menu: [],
    setMenu: ({
        menu,
        menuFilter
    }) => {
        set({ menu: getFilteredOrderSystemMenu({ menuItems: menu, menuFilter }) })
    },
}));
