'use client'
import { useEffect, useState } from "react";

//components
import RightOrderDisplay from "./_components/rightOrderDisplay";
import { MenuOrderItem } from "./_components/menuOrderItem";
import LayoutFrame from "../../../_components/layoutFrame";
import SearchInput from "@/components/common/searchInput";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

//store
import { useOrderSystemOrderControllerStore } from "@/store/texas/orderController";
import { useOrderTablesNewOrderStore } from "@/store/texas/order";
import { useOrderSystemTablesStore } from "@/store/texas/tables";

//hooks
import { useGETRestaurantDataHooks, usePOSTRestaurantDataHooks } from "@/hooks/restaurant/restaurantDataHooks";
import { useSocketIoHooks } from "@/hooks/useSocketIoHooks";
import { useAuthHooks } from "@/hooks/useAuthHooks";

//interfaces
import { IGETTablesAllResponse } from "@/hooks/restaurant/IGetRestaurantDataHooks.interface";
import { IMenuOrderSystemFilter, useOrderSystemHooks } from "@/hooks/useOrderSystemHooks";
import { Allergens } from "@/common/types/restaurant/menu.interface";
import { ITable } from "@/common/types/restaurant/tables.interface";

export default function Table({ params }: { params: { id: string } }) {
    const { getFilteredOrderControllers } = useOrderSystemOrderControllerStore()
    const { setOrder, order, resetOrder, updateOrderQuantity, deleteOrder, getOrderTotal, getOneOrderTotal, replaceOrder } = useOrderTablesNewOrderStore()
    const { emit } = useSocketIoHooks()
    const { getTableById, tables, setTables } = useOrderSystemTablesStore()
    const { getFilteredOrderSystemMenu } = useOrderSystemHooks()
    const { user } = useAuthHooks()
    const [filter, setFilter] = useState<IMenuOrderSystemFilter>({
        allergens: [],
        id: [],
        sort: {
            options_priority: true
        },
        short_title: '',
        to_order: true,
        mn_type_id: ''
    })


    const {
        refetchRestaurantData: refetchTables
    } = useGETRestaurantDataHooks({
        query: 'TABLES',
        defaultParams: {
            tables: {
                all: {
                    pagination: {
                        take: 400,
                        skip: 0
                    },
                }
            }
        },
        UseQueryOptions: {
            onSuccess: (data) => {
                const tables = data as IGETTablesAllResponse
                setTables(tables?.data)
            },
            refetchOnWindowFocus: false,
            refetchIntervalInBackground: false,
            refetchOnMount: false,
            enabled: tables?.length === 0
        }
    })

    const {
        restaurantMenuOrderSystem: menuData,
    } = useGETRestaurantDataHooks({
        query: 'MENU',
        defaultParams: {
            menu: {
                order_system: '1'
            }
        },
        UseQueryOptions: {
            refetchOnWindowFocus: false,
            refetchIntervalInBackground: false,
            refetchOnMount: false,
        }
    })

    const {
        restaurantAllMenuSections: sections
    } = useGETRestaurantDataHooks({
        query: 'MENU_SECTION',
        defaultParams: {
            menu_sections: {
                all: {
                    includes: {
                        types: '1'
                    },
                    pagination: {
                        take: 200,
                        skip: 0
                    }
                }
            }
        },
        UseQueryOptions: {
            refetchOnWindowFocus: false,
            refetchIntervalInBackground: false,
            refetchOnMount: false,
        }
    })

    const {
        createRestaurantData: createOrder
    } = usePOSTRestaurantDataHooks({
        query: 'ORDER'
    })


    useEffect(() => {
        if (tables?.length === 0) {
            refetchTables()
        }
    }, [refetchTables, tables])

    return (
        <LayoutFrame
            user={user}
            navigation={{
                content: (
                    <div className='flex flex-col gap-2'>
                        {sections?.data?.map(s => {
                            return (
                                <div key={s?.id}>
                                    <small className='text-xs'>{s?.title}</small>
                                    <div className='flex flex-col gap-2 mt-1'>
                                        {s?.types?.map(t => {
                                            return (
                                                <Button
                                                    key={t?.id}
                                                    variant={filter?.mn_type_id === t?.id ? 'secondary' : 'outline'}
                                                    className='h-12 rounded-lg text-xs'
                                                    onClick={() => {
                                                        setFilter({
                                                            ...filter,
                                                            mn_type_id: t?.id
                                                        })
                                                    }}
                                                >
                                                    {t?.title}
                                                </Button>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ),
                return: {
                    path: "/admin/texas/waiters"
                }
            }}
            rightNavigation={{
                content: (
                    <RightOrderDisplay
                        menu={menuData}
                        order={order}
                        resetOrder={resetOrder}
                        updateOrderQuantity={updateOrderQuantity}
                        deleteOrder={deleteOrder}
                        getOneOrderTotal={getOneOrderTotal}
                        getOrderTotal={getOrderTotal}
                        replaceOrder={replaceOrder}
                        table={getTableById(params?.id) || {} as ITable}
                        createOrder={createOrder}
                        emit={emit}
                        sections={sections?.data}
                        orderControllers={getFilteredOrderControllers({ table_id: params?.id })}
                    />
                ),
                icon: <div />,
                title: 'Shopping Cart',

            }}
            main={{
                header: (
                    <div className='grid grid-row-2 gap-2 rounded-lg w-full h-full p-2 px-4 bg-background-soft'>
                        <div className='flex gap-4 scrollbar-thin overflow-auto'>
                            {Object.values(Allergens).map(a => {
                                return (
                                    <label key={a}
                                        htmlFor={a}
                                        className='flex items-center gap-2 text-xs'
                                    >
                                        <Checkbox
                                            id={a}
                                            checked={filter?.allergens?.includes(a)}
                                            onCheckedChange={(e) => setFilter(prev => {
                                                if (e) {
                                                    return {
                                                        allergens: [...prev?.allergens || [], a]
                                                    }
                                                } else {
                                                    return {
                                                        allergens: prev?.allergens?.filter((al) => al !== a)
                                                    }
                                                }
                                            })}
                                        />
                                        <span>{a}</span>
                                    </label>
                                )
                            })}
                        </div>
                        <SearchInput
                            value={filter?.short_title || ''}
                            placeholder="Search for a menu item"
                            onSearchChange={(e) => setFilter({
                                ...filter,
                                short_title: e
                            })}
                            debounceDelay={0}
                            custom="min-w-full"
                        />
                    </div>
                )
            }}
        >
            <div className='grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4'>
                {getFilteredOrderSystemMenu({
                    menuItems: menuData || [],
                    menuFilter: filter
                })?.map((m) => (
                    <MenuOrderItem
                        menu={m}
                        key={m?.id}
                        menuData={menuData}
                        getFilteredOrderSystemMenu={getFilteredOrderSystemMenu}
                        setOrder={setOrder}
                        updateOrderQuantity={updateOrderQuantity}
                        order={order}
                        getOneOrderTotal={getOneOrderTotal}
                    />
                ))}
            </div>
        </LayoutFrame>
    )
}
