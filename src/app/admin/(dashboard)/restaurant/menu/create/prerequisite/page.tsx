'use client'

//components
import { menuAddOnsColumnsTable } from "./_components/menuAddOnsColumns";
import { MenuAddOnsTables } from "./_components/menuAddOnsTable";
import Wrap from "@/components/common/wrap";

//hooks
import { IMenuAddOns } from "@/common/types/restaurant/menu.interface";
import { useDELETERestaurantDataHooks, useGETRestaurantDataHooks, usePOSTRestaurantDataHooks, usePUTRestaurantDataHooks } from "@/hooks/restaurant/restaurantDataHooks";
import { useState } from "react";
import CreateUpdateMenuAddOnsForm from "./_components/createUpdateAddOnsForm";

export default function MenuPrerequisite() {
    const [menuAddOnsToEdit, setMenuAddOnsToEdit] = useState<IMenuAddOns | undefined>(undefined)
    const {
        restaurantAllMenu: menu,
        refetchRestaurantData: toRefetchMenu,
        isRestaurantDataLoading: isMenuLoading,
        setGETRestaurantDataParams: setGETMenu,
        GETRestaurantDataParams: GETMenu
    } = useGETRestaurantDataHooks({
        query: 'MENU',
        defaultParams: {
            menu: {
                all: {
                    pagination: {
                        take: 20,
                        skip: 0
                    },
                }
            }
        }
    })

    const {
        restaurantAllMenuTypes: menuTypes,
        isRestaurantDataLoading: isMenuTypesLoading,
    } = useGETRestaurantDataHooks({
        query: 'MENU_TYPE',
        defaultParams: {
            menu_types: {
                all: {
                    pagination: {
                        take: 200,
                        skip: 0
                    },
                }
            }
        }
    })

    const {
        restaurantAllMenuAddOns: addOns,
        refetchRestaurantData: toRefetchAddOns,
        isRestaurantDataLoading: isMenuAddOnsLoading,
        setGETRestaurantDataParams: setMenuAddOns,
        GETRestaurantDataParams: GETMenuAddOns
    } = useGETRestaurantDataHooks({
        query: 'MENU_ADD_ONS',
        defaultParams: {
            menu_add_ons: {
                all: {
                    pagination: {
                        take: 10,
                        skip: 0
                    },
                    includes: {
                        menu: '1',
                    }
                }
            }
        }
    })

    const toRefetch = () => {
        toRefetchAddOns()
        toRefetchMenu()
    }


    const { createRestaurantData: createAddOns, isCreateRestaurantDataLoading: isCreateAddOnsLoading } = usePOSTRestaurantDataHooks({
        query: 'MENU_ADD_ONS',
        toRefetch
    })

    const { updateRestaurantData: updateAddOns, isUpdateRestaurantDataLoading: isUpdateAddOnsLoading } = usePUTRestaurantDataHooks({
        query: 'MENU_ADD_ONS',
        toRefetch
    })

    const { deleteRestaurantData: deleteAddOns } = useDELETERestaurantDataHooks({
        query: 'MENU_ADD_ONS',
        toRefetch
    })

    return (
        <div>
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
                <Wrap
                    header={{
                        title: {
                            title: 'Prerequisite',
                            icon: 'Utensils'
                        },
                        pagination: {
                            onPageChange: (pagination) => setMenuAddOns(prev => ({
                                ...prev,
                                menu_add_ons: {
                                    all: {
                                        ...prev.menu_add_ons?.all,
                                        pagination
                                    }
                                }
                            })),
                            pagination: addOns?.pagination,
                            queryPagination: GETMenuAddOns?.menu_add_ons?.all?.pagination!,
                            isFetching: isMenuAddOnsLoading
                        }
                    }}
                    actions={{
                        searchInput: {
                            value: GETMenuAddOns?.menu_add_ons?.all?.title || '',
                            onSearchChange: (title) => setMenuAddOns(prev => ({
                                menu_add_ons: {
                                    all: {
                                        ...prev.menu_add_ons?.all,
                                        title
                                    }
                                }
                            })),
                            placeholder: 'Search by title . . .',
                            isFetching: isMenuAddOnsLoading
                        },
                        className: 'flex justify-between gap-4'
                    }}
                    isLoading={isMenuLoading || isMenuAddOnsLoading || isMenuTypesLoading}
                    className='rounded-xl border-2 p-4'
                >
                    <MenuAddOnsTables columns={menuAddOnsColumnsTable({
                        onDelete: (id: string) => deleteAddOns({
                            menu_add_ons: {
                                id
                            }
                        }),
                        setToEdit: (data: IMenuAddOns) => setMenuAddOnsToEdit(data)
                    })} data={addOns?.data} />
                </Wrap>
                <CreateUpdateMenuAddOnsForm
                    createAddOns={createAddOns}
                    updateAddOns={updateAddOns}
                    menu={{
                        data: menu,
                        GETMenu,
                        isLoading: isMenuLoading,
                        setGETMenu
                    }}
                    menuTypes={{
                        data: menuTypes?.data,
                        isLoading: isMenuTypesLoading
                    }}
                    actions={{
                        setToEdit: setMenuAddOnsToEdit
                    }}
                    isLoading={isCreateAddOnsLoading || isUpdateAddOnsLoading}
                    menuAddOns={menuAddOnsToEdit}
                />
            </div>
        </div>
    )
}