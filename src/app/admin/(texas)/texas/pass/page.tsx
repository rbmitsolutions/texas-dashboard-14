'use client'
import { useEffect } from "react"
import { io } from "socket.io-client"

import { addDaysToDate, getFirstTimeOfTheDay } from "@/common/libs/date-fns/dateFormat"
//components
import LayoutFrame from "../../_components/layoutFrame"
import { Button } from "@/components/ui/button"
import { useGETRestaurantDataHooks } from "@/hooks/restaurant/restaurantDataHooks"

//hooks
import { useAuthHooks } from "@/hooks/useAuthHooks"

//store
import { useOrderControllerStore } from "@/store/restaurant/orderController"

//interface
import { IAllOrderControllerResponse } from "@/hooks/restaurant/IGetRestaurantDataHooks.interface"
import { ISocketMessage, SocketIoEvent } from "@/common/libs/socketIo/types"
import { Checkbox } from "@/components/ui/checkbox"
import sortMenuSections from "@/common/libs/restaurant/menuSections"
import FullOrderController from "../_components/orderSummary/fullOrderController"
import { useOrderStore } from "@/store/restaurant/order"

const socket = io(process.env.NEXT_PUBLIC_URL! as string);

export default function PassPage() {
    const { getOneOrderTotal } = useOrderStore()
    const { user } = useAuthHooks()

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
                        orders: '1',
                    },
                    date: {
                        gte: getFirstTimeOfTheDay(new Date()),
                        lte: addDaysToDate(new Date(), 1)
                    },
                    finished_table_id: null,
                    orderBy: {
                        key: 'created_at',
                        order: 'asc'
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

    useEffect(() => {
        socket.on("message", (message: ISocketMessage) => {
            if (message?.event === SocketIoEvent.ORDER) {
                refetchOrdersController()
            }
        });
        () => {
            socket.off("message");
        }
    }, [refetchOrdersController]);

    return (
        <LayoutFrame
            user={user}
            navigation={{
                icon: {
                    icon: 'Filter',
                    title: 'Tables'
                },
                content: (
                    <div className='flex-col-container overflow-auto'>

                        <small className='-mb-2'>Pass</small>
                        <div className='grid grid-cols-2 gap-2'>
                            {[1, 2, 3, 4, 5]?.map(g => {
                                return (
                                    <Button
                                        key={g}
                                        className='h-12'
                                        variant='outline'
                                    // variant={tablesFilter?.guests?.includes(g) ? 'default' : 'outline'}
                                    // onClick={() => {
                                    //     setTablesFilter({
                                    //         ...tablesFilter,
                                    //         guests: tablesFilter?.guests?.includes(g) ? tablesFilter?.guests?.filter(guest => guest !== g) : [...tablesFilter?.guests || [], g]
                                    //     })
                                    // }}

                                    >
                                        {g}
                                    </Button>
                                )
                            })}
                        </div>
                        {sortMenuSections(menuSections?.data || [])?.map(sec => {
                            return (
                                <div key={sec?.id}>
                                    <strong>{sec?.title}</strong>
                                    <div className='grid grid-cols-2 gap-1 py-2 scrollbar-thin'>
                                        {sec?.types?.map(t => {
                                            return (
                                                <label key={t?.id}
                                                    htmlFor={t?.id}
                                                    className='flex items-center gap-2 text-xs'
                                                >
                                                    <Checkbox
                                                        id={t?.id}
                                                    // checked={filter?.allergens?.includes(a)}
                                                    // onCheckedChange={(e) => setFilter(prev => {
                                                    //     if (e) {
                                                    //         return {
                                                    //             allergens: [...prev?.allergens || [], a]
                                                    //         }
                                                    //     } else {
                                                    //         return {
                                                    //             allergens: prev?.allergens?.filter((al) => al !== a)
                                                    //         }
                                                    //     }
                                                    // })}
                                                    />
                                                    <span className='line-clamp-1'>{t?.title}</span>
                                                </label>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )
            }}

        >
            <div className='flex-container'>
                {orderControllers?.data?.map(oc => {
                    return (
                        <div key={oc?.id} className='min-w-64'>
                            <FullOrderController
                                orderController={oc}
                                orderSumary={{
                                    menuSections: menuSections?.data,
                                    order: oc?.orders,
                                    getOneOrderTotal,
                                    showPrice: false
                                }}
                            />
                        </div>
                    )
                })}
            </div>
            {/* <div className='grid-container grid-cols-[repeat(auto-fit,minmax(200px,1fr))] sm:grid-cols-[repeat(auto-fit,minmax(200px,222px))]'> */}
            {/* {
                    getTablesFiltered(tablesFilter)?.map((table) => {
                        return (
                            <Table
                                key={table?.id}
                                table={table}
                                waitres={{
                                    createBooking,
                                    timesOpen: openDay?.times_open,
                                    orderControllers: getOrderControllers({
                                        table_id: table?.id,
                                        orders: {
                                            status: [OrderStatus.ORDERED]
                                        }
                                    }),
                                    getOneOrderTotal,
                                    menuSections: menuSections?.data,
                                    updateOrder,
                                    updateTable
                                }}
                            />
                        )
                    })
                } */}
            {/* </div> */}
        </LayoutFrame>
    )
}