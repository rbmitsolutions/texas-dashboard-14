'use client'
import { useEffect } from "react";
import { formatDate } from "@/common/libs/date-fns/dateFormat";
import { io } from "socket.io-client";

//libs
import { getTableStatusVariant } from "@/common/libs/restaurant/tables";

//components
import TablesStatus from "../../_components/table/tableStatus";
import LayoutFrame from "../../../_components/layoutFrame";
import { Button } from "@/components/ui/button";

//store
import { useSectionsStore } from "@/store/restaurant/sections";

//hooks
import { useGETRestaurantDataHooks, usePUTRestaurantDataHooks } from "@/hooks/restaurant/restaurantDataHooks";
import { useSocketIoHooks } from "@/hooks/useSocketIoHooks";
import { useAuthHooks } from "@/hooks/useAuthHooks";

//interface
import { TableMealStatus } from "@/common/types/restaurant/tables.interface";
import { ISocketMessage, SocketIoEvent, socket } from "@/common/libs/socketIo/types";
import { OrderStatus } from "@/common/types/restaurant/order.interface";

// const socket = io(process.env.NEXT_PUBLIC_URL! as string, {
//     path: '/socket.io',
//     transports: ['websocket'],
//     secure: true,
// });

export default function Pass() {
    const { emit, isMessageToMe } = useSocketIoHooks()
    const { sections } = useSectionsStore()
    const { user } = useAuthHooks()

    const {
        updateRestaurantData: updateTable
    } = usePUTRestaurantDataHooks({
        query: 'TABLES',
        UseMutationOptions: {
            onSuccess: async () => {
                await emit({
                    event: [SocketIoEvent.TABLE]
                })
            }
        }
    })

    const {
        restaurantAllTables: tables,
        GETRestaurantDataParams: tablesParams,
        setGETRestaurantDataParams: setTablesParams,
        refetchRestaurantData: refetchTables
    } = useGETRestaurantDataHooks({
        query: 'TABLES',
        defaultParams: {
            tables: {
                all: {
                    meal_status: {
                        in: []
                    },
                    include: {
                        order_controller: {
                            orders: {
                                status: OrderStatus.ORDERED
                            }
                        }
                    },
                    is_open: true,
                    pagination: {
                        take: 200,
                        skip: 0
                    },
                    orderBy: {
                        key: 'food_ordered_at',
                        order: 'asc'
                    }
                }
            }
        },
    })

    useEffect(() => {
        socket.on("message", (message: ISocketMessage) => {
            if (isMessageToMe({ event: message?.event, listemTo: [SocketIoEvent.TABLE, SocketIoEvent.ORDER] })) {
                refetchTables()
            }
        });
        () => {
            socket.off("message");
        }
    }, [isMessageToMe, refetchTables]);

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
                        <small className='-mb-2'>Section</small>
                        <div className='grid grid-cols-2 gap-2'>
                            {sections?.map(section => {
                                return (
                                    <Button
                                        key={section?.id}
                                        variant={tablesParams?.tables?.all?.section_id?.in?.includes(section?.id) ? 'default' : 'outline'}
                                        onClick={() => setTablesParams(prev => ({
                                            tables: {
                                                all: {
                                                    ...prev?.tables?.all,
                                                    pagination: {
                                                        take: 200,
                                                        skip: 0
                                                    },
                                                    section_id: {
                                                        in: prev?.tables?.all?.section_id?.in?.includes(section?.id) ? prev?.tables?.all?.section_id?.in?.filter(section_id => section_id !== section?.id) : [...prev?.tables?.all?.section_id?.in || [], section?.id]
                                                    }
                                                }
                                            }
                                        }))}
                                        className='p-1 h-14 text-sm'
                                    >
                                        {section?.title}
                                    </Button>
                                )
                            })}
                        </div>
                        <small className='-mb-2'>Status</small>
                        <div className='grid grid-cols-2 gap-2'>
                            {Object.values(TableMealStatus).map(status => {
                                return (
                                    <Button
                                        key={status}
                                        className='text-[10px] h-14 capitalize'
                                        variant={tablesParams?.tables?.all?.meal_status?.in?.includes(status) ? getTableStatusVariant(status) : 'outline'}
                                        onClick={() => setTablesParams(prev => ({
                                            tables: {
                                                all: {
                                                    ...prev?.tables?.all,
                                                    pagination: {
                                                        take: 200,
                                                        skip: 0
                                                    },
                                                    meal_status: {
                                                        in: prev?.tables?.all?.meal_status?.in?.includes(status) ? prev?.tables?.all?.meal_status?.in?.filter(meal_status => meal_status !== status) : [...prev?.tables?.all?.meal_status?.in || [], status]
                                                    }
                                                }
                                            }
                                        }))}
                                    >
                                        {status}
                                    </Button>
                                )
                            })}
                        </div>
                    </div>
                )
            }}
        >
            <div className='grid grid-cols-5 gap-4 px-4 overflow-auto scrollbar-thin'>
                {tables?.data?.length === 0 && <strong>No Tables</strong>}
                {tables?.data?.map(table => {
                    return (
                        <TablesStatus
                            key={table?.id}
                            updateTable={updateTable}
                            table={table}
                        >
                            <div
                                className='flex-col-container justify-center items-center p-4 rounded-lg bg-background-soft w-full border-4'
                            >
                                <strong className='text-5xl'>{table?.number}</strong>
                                <Button
                                    className='capitalize'
                                    variant={getTableStatusVariant(table?.meal_status)}
                                >
                                    {table?.meal_status}
                                </Button>
                                <strong className='text-lg'>
                                    {formatDate({
                                        date: table?.food_ordered_at,
                                        f: 'HH:mm:ss',
                                        iso: false
                                    })}
                                </strong>
                            </div>
                        </TablesStatus>
                    )
                })}
            </div>
        </LayoutFrame>
    )
}