import { IGETMenuOrderSystemResponse } from "./restaurant/IGetRestaurantDataHooks.interface";

export interface IMenuOrderSystemFilter {
    allergens?: string[]
    id?: string[]
    mn_type_id?: string
    short_title?: string
    sort?: {
        options_priority?: boolean
    }
    to_order?: boolean
}

export interface IGETFilterMenuOrderSystem {
    menuItems: IGETMenuOrderSystemResponse[]
    menuFilter: IMenuOrderSystemFilter
}
export const useOrderSystemHooks = () => {
    const getFilteredOrderSystemMenu = ({ menuItems, menuFilter }: IGETFilterMenuOrderSystem): IGETMenuOrderSystemResponse[] => {
        if (!menuFilter) return menuItems

        let menu = menuItems

        if (menuFilter?.mn_type_id) {
            menu = menu?.filter((item) => item?.mn_type_id === menuFilter?.mn_type_id);
        }

        if (menuFilter?.allergens && menuFilter?.allergens.length > 0) {
            menu = menu?.filter((item) => !menuFilter?.allergens?.some(allergen => item.allergens.includes(allergen)));
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

    return {
        getFilteredOrderSystemMenu,
    };
};
