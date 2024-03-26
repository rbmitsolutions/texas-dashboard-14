'use client'
import { useEffect, useState } from "react";
import { addDaysToDate, getFirstTimeOfTheDay } from "@/common/libs/date-fns/dateFormat";
import { RedirectTo } from "@/common/types/routers/endPoints.types";
import { useRouter } from "next/navigation";
import { io } from "socket.io-client";

//libs
import sortMenuSections from "@/common/libs/restaurant/menuSections";

//components
import RightOrderDisplay from "./_components/rightOrderDisplay";
import AllergensButton from "./_components/allergensButton";
import { MenuOrderItem } from "./_components/menuOrderItem";
import LayoutFrame from "../../../_components/layoutFrame";
import SearchInput from "@/components/common/searchInput";
import { Button } from "@/components/ui/button";

//store
import { useTablesStore } from "@/store/restaurant/tables";
import { useOrderStore } from "@/store/restaurant/order";

//hooks
import { useGETRestaurantDataHooks, usePOSTRestaurantDataHooks, usePUTRestaurantDataHooks } from "@/hooks/restaurant/restaurantDataHooks";
import { useSocketIoHooks } from "@/hooks/useSocketIoHooks";
import { useAuthHooks } from "@/hooks/useAuthHooks";

//store
import { usePrintersStore } from "@/store/restaurant/printers";

//interfaces
import { IMenuOrderSystemFilter, useOrderSystemHooks } from "@/hooks/useOrderSystemHooks";
import { ISocketMessage, SocketIoEvent } from "@/common/libs/socketIo/types";
import { ITable } from "@/common/types/restaurant/tables.interface";

const socket = io(process.env.NEXT_PUBLIC_URL! as string);

export default function Table({ params }: { params: { id: string } }) {
    const { setOrder, order, resetOrder, updateOrderQuantity, deleteOrder, replaceOrder } = useOrderStore()
    const { getFilteredOrderSystemMenu } = useOrderSystemHooks()
    const { getTableById } = useTablesStore()
    const { printers } = usePrintersStore()
    const { emit } = useSocketIoHooks()
    const { user } = useAuthHooks()
    const { push } = useRouter()
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
        restaurantAllOrderController: orderControllers,
        refetchRestaurantData: refetchOrdersController
    } = useGETRestaurantDataHooks({
        query: 'ORDER_CONTROLLER',
        defaultParams: {
            orderController: {
                all: {
                    pagination: {
                        take: 500,
                        skip: 0
                    },
                    includes: {
                        orders: '1'
                    },
                    date: {
                        gte: getFirstTimeOfTheDay(new Date()),
                        lte: addDaysToDate(new Date(), 1)
                    },
                    finished_table_id: null,
                    table_id: params?.id
                }
            }
        },
        UseQueryOptions: {
            enabled: !!params?.id
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

    const {
        updateRestaurantData: updateTable
    } = usePUTRestaurantDataHooks({
        query: 'TABLES',
        UseMutationOptions: {
            onSuccess: async () => {
                //used only to change to another table
                await emit({
                    event: SocketIoEvent.TABLE,
                    message: params?.id
                })
                await emit({
                    event: SocketIoEvent.ORDER,
                    message: params?.id
                })
                await emit({
                    event: SocketIoEvent.TABLE_PAYMENT,
                    message: params?.id
                })
            }
        }
    })

    useEffect(() => {
        const table = getTableById(params?.id)
        if (!table || !table?.is_open) {
            push('/admin/texas/waiters')
        }
    }, [getTableById, params?.id, push])

    useEffect(() => {
        socket.on("message", (message: ISocketMessage) => {
            if (message?.event === SocketIoEvent.TABLE && message?.message === params?.id) {
                refetchOrdersController()
            }
        });
        () => {
            socket.off("message");
        }
    }, [params?.id, refetchOrdersController]);

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
                                                        variant={filter?.mn_type_id === t?.id ? 'default' : 'outline'}
                                                        className='h-12 rounded-lg justify-start text-xs'
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
                        <div className="space-y-2">
                            <AllergensButton
                                filter={filter}
                                setFilter={setFilter}
                            />
                            <SearchInput
                                value={filter?.short_title || ''}
                                placeholder="Search..."
                                onSearchChange={(e) => setFilter({
                                    ...filter,
                                    short_title: e
                                })}
                                debounceDelay={0}
                                custom="min-w-full my-2"
                            />
                        </div>
                    </div>
                ),
                return: {
                    action() {
                        resetOrder()
                        push(RedirectTo.WAITERS)
                    },
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
                        replaceOrder={replaceOrder}
                        table={getTableById(params?.id) || {} as ITable}
                        createOrder={createOrder}
                        menuSections={menuSections?.data}
                        orderControllers={orderControllers?.data || []}
                        updateOrder={updateOrder}
                        printers={printers}
                        updateTable={updateTable}
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
            <div className='grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-5'>
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
                        printers={printers}
                        menuSections={menuSections?.data || []}
                    />
                ))}
            </div>
        </LayoutFrame>
    )
}
