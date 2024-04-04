'use client'
import { useEffect, useState } from "react";
import { formatDate } from "@/common/libs/date-fns/dateFormat";
import { io } from "socket.io-client";

//libs
import { getTableStatusVariant } from "@/common/libs/restaurant/tables";

//components
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import LayoutFrame from "../../../_components/layoutFrame";
import { Button } from "@/components/ui/button";

//hooks
import { useAuthHooks } from "@/hooks/useAuthHooks";

//hooks
import { useGETRestaurantDataHooks, usePUTRestaurantDataHooks } from "@/hooks/restaurant/restaurantDataHooks";
import { useSocketIoHooks } from "@/hooks/useSocketIoHooks";

//interface
import { IGETTablesAllResponse } from "@/hooks/restaurant/IGetRestaurantDataHooks.interface";
import { ITable, TableMealStatus } from "@/common/types/restaurant/tables.interface";
import { ISocketMessage, SocketIoEvent } from "@/common/libs/socketIo/types";
import { OrderStatus } from "@/common/types/restaurant/order.interface";

const socket = io(process.env.NEXT_PUBLIC_URL! as string);

export default function Chefs() {
    const [tables, setTables] = useState<ITable[]>([])
    const { emit, isMessageToMe } = useSocketIoHooks()
    const { user } = useAuthHooks()
    const [isOpen, setIsOpen] = useState<string>('')

    const onTableUpdate = async (tableId: string) => {
        await updateTable({
            table: {
                id: tableId,
                meal_status: TableMealStatus.PREPARING
            }
        }, {
            onSuccess: async () => {
                await emit({
                    event: [SocketIoEvent.TABLE]
                })
            }
        })


        setIsOpen('')
    }

    const onClearTable = async (tableId: string) => {
        await updateTable({
            table: {
                id: tableId,
                meal_status: TableMealStatus.DESSERT
            }
        })

        await emit({
            event: [SocketIoEvent.TABLE]
        })

        setIsOpen('')
    }

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
        refetchRestaurantData: refetchTables
    } = useGETRestaurantDataHooks({
        query: 'TABLES',
        defaultParams: {
            tables: {
                all: {
                    meal_status: {
                        in: [TableMealStatus.MAIN, TableMealStatus.STARTERS, TableMealStatus.PREPARING]
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
        UseQueryOptions: {
            onSuccess: async (data) => {
                const tablesData = data as IGETTablesAllResponse

                let table: ITable[] = []

                tablesData?.data?.filter(t => t?.meal_status !== TableMealStatus.STARTERS)?.map(t => {
                    t?.order_controller?.map(oc => {
                        let hasStarter = false
                        let hasMainCourse = false

                        oc?.orders?.map(order => {
                            if (order?.mn_section === 'Starters') {
                                hasStarter = true
                            }

                            if (order?.mn_section === 'Main Course') {
                                hasMainCourse = true
                            }
                        })

                        if (hasStarter && hasMainCourse) {
                            table.push(t)
                        }
                    })

                })

                setTables(table)
            }
        }
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
                    <div />
                )
            }}
        >
            <div className='grid grid-cols-[repeat(auto-fit,minmax(150px,150px))] gap-4 px-4 overflow-auto scrollbar-thin'>
                {tables?.length === 0 && <strong>No Tables</strong>}
                {tables?.map(table => {
                    return (
                        <Dialog
                            key={table?.id}
                            open={isOpen === table?.id}
                        >
                            <DialogTrigger asChild>
                                <div
                                    className='flex-col-container justify-center items-center p-4 rounded-lg bg-background-soft w-full border-4'
                                    onClick={() => setIsOpen(table?.id)}
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
                            </DialogTrigger>

                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        Table {table?.number}
                                    </DialogTitle>
                                </DialogHeader>
                                <div>
                                    <Button
                                        className='h-32 w-full text-4xl'
                                        variant='destructive'
                                        onClick={() => onClearTable(table?.id)}
                                    >
                                        Clear
                                    </Button>
                                </div>
                                <DialogFooter className='grid grid-cols-2 gap-8'>
                                    <DialogClose asChild>
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            size='sm'
                                            className='h-40 text-3xl'
                                            onClick={() => setIsOpen('')}
                                        >
                                            Cancel
                                        </Button>
                                    </DialogClose>
                                    <Button
                                        type='button'
                                        size='sm'
                                        className='h-40 text-3xl'
                                        variant='green'
                                        onClick={() => onTableUpdate(table?.id)}
                                    >
                                        To Prepare
                                    </Button>
                                </DialogFooter>
                            </DialogContent>

                        </Dialog>
                    )
                })}
            </div>
        </LayoutFrame>
    )
}