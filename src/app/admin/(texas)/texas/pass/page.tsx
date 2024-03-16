'use client'
import { useEffect } from "react"
import { io } from "socket.io-client"

//libs
import { addDaysToDate, getFirstTimeOfTheDay } from "@/common/libs/date-fns/dateFormat"
import sortMenuSections from "@/common/libs/restaurant/menuSections"

//components
import FullOrderController from "../_components/orderSummary/fullOrderController"
import LayoutFrame from "../../_components/layoutFrame"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"

//hooks
import { useGETRestaurantDataHooks, usePUTRestaurantDataHooks } from "@/hooks/restaurant/restaurantDataHooks"
import { useSocketIoHooks } from "@/hooks/useSocketIoHooks"
import { useAuthHooks } from "@/hooks/useAuthHooks"

//store
import { useOrderStore } from "@/store/restaurant/order"

//interface
import { ISocketMessage, SocketIoEvent } from "@/common/libs/socketIo/types"
import { OrderStatus } from "@/common/types/restaurant/order.interface"

const socket = io(process.env.NEXT_PUBLIC_URL! as string);

export default function PassPage() {
    const { getOneOrderTotal } = useOrderStore()
    const { emit } = useSocketIoHooks()
    const { user } = useAuthHooks()

    const {
        restaurantAllPrinters: printers
    } = useGETRestaurantDataHooks({
        query: 'PRINTERS',
        defaultParams: {
            printers: {
                all: {
                    pagination: {
                        take: 50,
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
        restaurantAllOrderController: orderControllers,
        GETRestaurantDataParams: params,
        setGETRestaurantDataParams: setParams,
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
                    pass: [],
                    where: {
                        orders: {
                            mn_type: ['Dqwerwgwg'],
                            status: [OrderStatus.ORDERED],
                        },
                    },
                    includes: {
                        orders: '1',
                        table: '1'
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
        },
        keepParmas: true
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
        updateRestaurantData: updateOrder
    } = usePUTRestaurantDataHooks({
        query: 'ORDER',
        UseMutationOptions: {
            onSuccess: async () => {
                await emit({
                    event: SocketIoEvent.ORDER,
                })
            }
        }
    })

    const handlePassChange = (pass: number) => {
        const currentPass = params?.orderController?.all?.pass || []

        const newPass = currentPass.includes(pass) ? currentPass.filter(p => p !== pass) : [...currentPass, pass]

        setParams(prev => ({
            orderController: {
                all: {
                    ...prev?.orderController?.all,
                    pass: newPass,

                }
            }
        }))
    }

    const handleTypeChange = (type: string) => {
        const currentType = params?.orderController?.all?.where?.orders?.mn_type || []

        const newType = currentType.includes(type) ? currentType.filter(t => t !== type) : [...currentType, type]

        setParams(prev => ({
            orderController: {
                all: {
                    ...prev?.orderController?.all,
                    where: {
                        orders: {
                            mn_type: newType,
                            status: [OrderStatus.ORDERED],
                        }
                    }
                }
            }
        }))
    }

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
                            {[1, 2, 3, 4, 5]?.map(p => {
                                return (
                                    <Button
                                        key={p}
                                        className='h-12'
                                        variant={params?.orderController?.all?.pass?.includes(p) ? 'default' : 'outline'}
                                        onClick={() => handlePassChange(p)}
                                    >
                                        {p}
                                    </Button>
                                )
                            })}
                        </div>
                        {sortMenuSections(menuSections?.data || [])?.map(sec => {
                            return (
                                <div key={sec?.id}>
                                    <strong>{sec?.title}</strong>
                                    <div className='grid grid-cols-2 gap-2 py-2 scrollbar-thin'>
                                        {sec?.types?.map(t => {
                                            return (
                                                <label key={t?.id}
                                                    htmlFor={t?.id}
                                                    className='flex items-center gap-2 text-xs'
                                                >
                                                    <Checkbox
                                                        id={t?.id}
                                                        checked={params?.orderController?.all?.where?.orders?.mn_type?.includes(t?.title)}
                                                        onCheckedChange={(e) => handleTypeChange(t?.title)}
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
            <div className='flex flex-col gap-4 md:flex-row md:max-w-[calc(100vw_-_240px)] md:overflow-auto md:scrollbar-thin'>
                {orderControllers?.data?.map(oc => {
                    return (
                        <div key={oc?.id} className='min-w-64'>
                            <FullOrderController
                                orderController={oc}
                                orderSumary={{
                                    menuSections: menuSections?.data,
                                    order: oc?.orders,
                                    getOneOrderTotal,
                                    showPrice: false,
                                    updateOrderStatus: {
                                        onUpdate: updateOrder
                                    }
                                }}
                                printers={printers?.data || []}
                                onOrdersUpdate={updateOrder}
                            />
                        </div>
                    )
                })}
            </div>
        </LayoutFrame>
    )
}