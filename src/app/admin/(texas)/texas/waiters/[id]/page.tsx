'use client'
import { useEffect, useState } from "react";

//libs
import sortMenuSections from "@/common/libs/restaurant/menuSections";

//components
import RightOrderDisplay from "./_components/rightOrderDisplay";
import { MenuOrderItem } from "./_components/menuOrderItem";
import LayoutFrame from "../../../_components/layoutFrame";
import SearchInput from "@/components/common/searchInput";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

//store
import { useOrderControllerStore } from "@/store/restaurant/orderController";
import { useTablesStore } from "@/store/restaurant/tables";
import { useOrderStore } from "@/store/restaurant/order";

//hooks
import { useGETRestaurantDataHooks, usePOSTRestaurantDataHooks, usePUTRestaurantDataHooks } from "@/hooks/restaurant/restaurantDataHooks";
import { useSocketIoHooks } from "@/hooks/useSocketIoHooks";
import { useAuthHooks } from "@/hooks/useAuthHooks";

//interfaces
import { IMenuOrderSystemFilter, useOrderSystemHooks } from "@/hooks/useOrderSystemHooks";
import { Allergens } from "@/common/types/restaurant/menu.interface";
import { ITable } from "@/common/types/restaurant/tables.interface";
import { SocketIoEvent } from "@/common/libs/socketIo/types";
import { useRouter } from "next/navigation";
import { usePrintersStore } from "@/store/restaurant/printers";

export default function Table({ params }: { params: { id: string } }) {
    const { push } = useRouter()
    const { getOrderControllers } = useOrderControllerStore()
    const { setOrder, order, resetOrder, updateOrderQuantity, deleteOrder, getOrderTotal, getOneOrderTotal, replaceOrder } = useOrderStore()
    const { emit } = useSocketIoHooks()
    const { getTableById } = useTablesStore()
    const { printers } = usePrintersStore()
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
        restaurantAllMenuSections: menuSections
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
        query: 'ORDER',
        UseMutationOptions: {
            onSuccess: async () => {
                await emit({
                    event: SocketIoEvent.ORDER,
                    message: params?.id
                })
                await emit({
                    event: SocketIoEvent.TABLE,
                    message: params?.id
                })
            }
        }
    })

    const {
        updateRestaurantData: updateOrder
    } = usePUTRestaurantDataHooks({
        query: 'ORDER',
        UseMutationOptions: {
            onSuccess: async () => {
                await emit({
                    event: SocketIoEvent.ORDER,
                    message: params?.id
                })
            }
        }
    })

    useEffect(()=> {
        const table = getTableById(params?.id)
        if(!table) {
            push('/admin/texas/waiters')
        }
    }, [getTableById, params?.id, push])
    
    return (
        <LayoutFrame
            user={user}
            navigation={{
                icon: {
                    title: 'Menu',
                    icon: 'Filter'
                },
                content: (
                    <div className='flex flex-col justify-between gap-2 h-full'>
                        <div className='overflow-auto scrollbar-thin'>
                            {sortMenuSections(menuSections?.data)?.map(s => {
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
                        <div>
                            <div className='grid grid-cols-2 gap-4 py-2 scrollbar-thin'>
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
                                            <span className='line-clamp-1'>{a}</span>
                                        </label>
                                    )
                                })}
                            </div>
                            <SearchInput
                                value={filter?.short_title || ''}
                                placeholder="Search..."
                                onSearchChange={(e) => setFilter({
                                    ...filter,
                                    short_title: e
                                })}
                                debounceDelay={0}
                                custom="min-w-full my-4"
                            />
                        </div>
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
                        menuSections={menuSections?.data}
                        orderControllers={getOrderControllers({ table_id: params?.id })}
                        updateOrder={updateOrder}
                        printers={printers}
                    />
                ),
                icon: {
                    title: 'Order',
                    icon: 'ShoppingCart',
                    extraIcon: order?.length > 0 && (
                        <div className='absolute flex items-center justify-center -top-2 -right-2 rounded-full text-xs w-5 h-5 bg-red-600 dark:bg-red-500'>
                            {order?.length > 0 &&
                                order?.length
                            }
                        </div>
                    )
                }
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
                        printers={printers}
                    />
                ))}
            </div>
        </LayoutFrame>
    )
}
