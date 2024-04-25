'use client'

//components
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DeleteDialogButton } from "@/components/common/deleteDialogButton";
import { convertCentsToEuro } from "@/common/utils/convertToEuro";
import MenuItemToMakeQuantity from "./menuItemToMakeQuantity";
import SearchInput from "@/components/common/searchInput";
import IconText from "@/components/common/iconText";
import { Button } from "@/components/ui/button";
import Wrap from "@/components/common/wrap";

//hooks
import { useDELETERestaurantDataHooks, useGETRestaurantDataHooks, usePOSTRestaurantDataHooks, usePUTRestaurantDataHooks } from "@/hooks/restaurant/restaurantDataHooks";
import { useGETStockDataHooks } from "@/hooks/stock/stockDataHooks";

//interface
import { IMenu } from "@/common/types/restaurant/menu.interface";

interface MenuItemsToMakeProps {
    menu: IMenu
}

export default function MenuItemsToMake({ menu }: MenuItemsToMakeProps) {

    const {
        restaurantAllMenuToMake: menuToMake,
        refetchRestaurantData: toRefetch
    } = useGETRestaurantDataHooks({
        query: 'MENU_TO_MAKE',
        defaultParams: {
            menu_to_make: {
                all: {
                    in: {
                        menu_id: [menu?.id]
                    },
                    pagination: {
                        take: 40,
                        skip: 0
                    },
                    includes: {
                        item: '1',
                    }
                }
            }
        },
        UseQueryOptions: {
            enabled: !!menu?.id
        }
    })

    const {
        createRestaurantData: createMenuToMake,
    } = usePOSTRestaurantDataHooks({
        query: 'MENU_TO_MAKE',
        toRefetch
    })

    const {
        stockAllItem: stockItems,
        setGETStockDataParams: setStockItems,
        GETStockDataParams: GETStockItems,
    } = useGETStockDataHooks({
        query: 'ITEM',
        defaultParams: {
            item: {
                all: {
                    pagination: {
                        take: 20,
                        skip: 0
                    }
                }
            }
        }
    })

    const {
        deleteRestaurantData: deleteMenuToMake
    } = useDELETERestaurantDataHooks({
        query: 'MENU_TO_MAKE',
        toRefetch
    })

    const {
        updateRestaurantData: updateMenuToMake
    } = usePUTRestaurantDataHooks({
        query: 'MENU_TO_MAKE',
        toRefetch
    })

    const onCreateMenuToMake = async (item_id: string) => {
        await createMenuToMake({
            menu_to_make: {
                item_id,
                menu_id: menu?.id,
                quantity: 0
            }
        })
    }

    return (
        <Wrap
            header={{
                title: {
                    title: 'Items To Make',
                    icon: 'SquareStack'
                }
            }}
            className='p-4 border-2 rounded-lg'
        >
            <div className='grid grid-cols-2 gap-4 mt-4'>
                {menuToMake?.data?.map(item => {
                    return (
                        <div
                            key={item?.id}
                            className='flex-col-container gap-4 p-2 border-2 rounded-sm bg-background-soft'
                        >
                            <div className='flex justify-between'>
                                <strong>
                                    {item?.item?.title}
                                </strong>
                                <DeleteDialogButton
                                    onDelete={async () => await deleteMenuToMake({
                                        menu_to_make: {
                                            id: item?.id
                                        }
                                    })}
                                />
                            </div>
                            <div className='flex-col-container gap-4'>
                                <MenuItemToMakeQuantity
                                    menuToMake={item}
                                    updateMenuToMake={(value) => updateMenuToMake({
                                        menu_to_make: {
                                            id: item?.id,
                                            quantity: value
                                        }
                                    })}
                                />
                                <IconText
                                    icon="PackageOpen"
                                    text={(item?.quantity / item?.item?.volume).toFixed(2) + ' Items'}
                                />
                                <IconText
                                    icon="Euro"
                                    text={convertCentsToEuro(Number((item?.quantity * (item?.item?.last_order_one_vol_price || 0)).toFixed(2) || 0))}
                                />
                            </div>
                        </div>
                    )
                })}
            </div>
            <div className='flex-col-container mt-4'>
                <IconText
                    icon='Euro'
                    text={'Sale Price ' + convertCentsToEuro(menu?.value || 0)}

                />
                <IconText
                    icon='Euro'
                    text={'Cost Price ' + convertCentsToEuro(menuToMake?.data?.reduce((acc, item) => acc + (item?.quantity * (item?.item?.last_order_one_vol_price || 0)), 0) || 0)}

                />
            </div>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        className="mt-4"
                    >
                        Select Item
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[250px] p-2">
                    <div className='p-2'>
                        <SearchInput
                            onSearchChange={(e) => setStockItems(prev => ({
                                item: {
                                    all: {
                                        ...prev?.item?.all,
                                        title: e
                                    }
                                }
                            }))}
                            value={GETStockItems?.item?.all?.title || ''}
                        />
                        <div className='h-40 overflow-auto mt-2'>
                            {stockItems?.data?.map(item => {
                                return (
                                    <div
                                        key={item?.id}
                                        className='bg-background-soft p-1 line-clamp-1 cursor-pointer hover:opacity-50 border-2 rounded-sm'
                                        onClick={() => onCreateMenuToMake(item?.id)}
                                    >
                                        <small>
                                            {item?.title}
                                        </small>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </Wrap>
    )
}