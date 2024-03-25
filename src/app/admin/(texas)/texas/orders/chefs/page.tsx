'use client'
import { useEffect, useState } from "react";
import { formatDate } from "@/common/libs/date-fns/dateFormat";

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

//sotre
import { useTablesStore } from "@/store/restaurant/tables";

//hooks
import { usePUTRestaurantDataHooks } from "@/hooks/restaurant/restaurantDataHooks";
import { useSocketIoHooks } from "@/hooks/useSocketIoHooks";

//interface
import { ITable, TableMealStatus } from "@/common/types/restaurant/tables.interface";
import { SocketIoEvent } from "@/common/libs/socketIo/types";
import { filteredOrderControllers } from "@/common/libs/restaurant/orderController";
import { OrderStatus } from "@/common/types/restaurant/order.interface";
import { getOrders } from "@/common/libs/restaurant/order";

interface ITablesData {
    tables: ITable[],
    preparing: ITable | null
}

export default function Chefs() {
    const { tables: allTables, getTablesFiltered } = useTablesStore()
    const { emit } = useSocketIoHooks()
    const { user } = useAuthHooks()
    const [isOpen, setIsOpen] = useState<string>('')
    const [dataTables, setDataTables] = useState<ITablesData>({
        tables: [],
        preparing: null
    })

    const onTableUpdate = async (tableId: string) => {
        if (dataTables?.preparing) {
            await updateTable({
                table: {
                    id: dataTables?.preparing?.id,
                    meal_status: TableMealStatus.DESSERT
                }
            })
        }

        await updateTable({
            table: {
                id: tableId,
                meal_status: TableMealStatus.PREPARING
            }
        })

        await emit({
            event: SocketIoEvent.TABLE
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
            event: SocketIoEvent.TABLE
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
                    event: SocketIoEvent.TABLE
                })
            }
        }
    })

    useEffect(() => {
        const tablesReady = getTablesFiltered({
            is_open: true,
            meal_status: [TableMealStatus.MAIN, TableMealStatus.ALL_TOGETHER],
        })?.filter(table => {
            const hasStarterOrder = getOrders({
                filter: {
                    status: [OrderStatus.ORDERED],
                    mn_section: 'Starters'
                },
                orderControllers: table?.order_controller || []
            })

            if (hasStarterOrder) {
                return true
            }

            return false
        })


        const preparingTable = getTablesFiltered({
            is_open: true,
            meal_status: [TableMealStatus.PREPARING]
        })

        const tablesSortedByfoodOrderedAt = tablesReady.sort((a, b) => {
            return new Date(a.food_ordered_at).getTime() - new Date(b.food_ordered_at).getTime()
        })

        setDataTables({
            tables: tablesSortedByfoodOrderedAt || [],
            preparing: preparingTable[0] || null
        })

    }, [allTables, getTablesFiltered])

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
                {dataTables?.tables?.length === 0 && <strong>No Tables</strong>}
                {dataTables?.tables?.map(table => {
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
                                    <strong className='text-3xl'>{table?.number}</strong>
                                    <Button
                                        className='capitalize'
                                        variant={getTableStatusVariant(table?.meal_status)}
                                    >
                                        {table?.meal_status}
                                    </Button>
                                    <strong>
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
        // <LayoutFrame
        //     user={user}
        //     navigation={{
        //         icon: {
        //             icon: 'Filter',
        //             title: 'Tables'
        //         },
        //         content: (
        //             <div />
        //         )
        //     }}
        // >
        //     <div className='grid grid-rows-[1fr,auto] gap-4 h-full max-h-screen'>
        //         <div className='grid grid-cols-2 h-full overflow-auto scrollbar-thin'>
        //             <div className='rounded-lg'>
        //                 {dataTables?.preparing ?
        //                     <div
        //                         key={dataTables?.preparing?.id}
        //                         className='flex-col-container justify-center items-center h-full bg-green-900 p-4 rounded-lg'
        //                     >
        //                         <strong className='text-[200px] text-white'>{dataTables?.preparing?.number}</strong>
        //                         <Button
        //                             className='h-32 w-60 text-4xl'
        //                             variant='destructive'
        //                             onClick={() => onClearTable(dataTables?.preparing?.id!)}
        //                         >
        //                             Clear
        //                         </Button>
        //                     </div>
        //                     :
        //                     <div className='flex-col-container justify-center items-center h-full p-4 rounded-lg bg-background-soft'>
        //                         <strong className='text-3xl'>...</strong>
        //                     </div>
        //                 }
        //             </div>
        //             <div className='flex-col-container gap-4 px-4 overflow-auto scrollbar-thin'>
        //                 {dataTables?.tables?.length === 0 && <strong>No Tables</strong>}
        //                 {dataTables?.tables?.map(table => {
        //                     return (
        //                         <Dialog
        //                             key={table?.id}
        //                             open={isOpen === table?.id}
        //                         >
        //                             <DialogTrigger asChild>
        //                                 <div
        //                                     className='flex-col-container justify-center items-center p-4 rounded-lg bg-background-soft w-full border-4'
        //                                     onClick={() => setIsOpen(table?.id)}
        //                                 >
        //                                     <strong className='text-3xl'>{table?.number}</strong>
        //                                     <Button
        //                                         className='capitalize'
        //                                         variant={getTableStatusVariant(table?.meal_status)}
        //                                     >
        //                                         {table?.meal_status}
        //                                     </Button>
        //                                     <strong>
        //                                         {formatDate({
        //                                             date: table?.food_ordered_at,
        //                                             f: 'HH:mm:ss',
        //                                             iso: false
        //                                         })}
        //                                     </strong>
        //                                 </div>
        //                             </DialogTrigger>

        //                             <DialogContent>
        //                                 <DialogHeader>
        //                                     <DialogTitle>
        //                                         Table {table?.number}
        //                                     </DialogTitle>
        //                                 </DialogHeader>
        //                                 <div>
        //                                     <Button
        //                                         className='h-32 w-full text-4xl'
        //                                         variant='destructive'
        //                                         onClick={() => onClearTable(table?.id)}
        //                                     >
        //                                         Clear
        //                                     </Button>
        //                                 </div>
        //                                 <DialogFooter className='grid grid-cols-2 gap-8'>
        //                                     <DialogClose asChild>
        //                                         <Button
        //                                             type="button"
        //                                             variant="secondary"
        //                                             size='sm'
        //                                             className='h-40 text-3xl'
        //                                             onClick={() => setIsOpen('')}
        //                                         >
        //                                             Cancel
        //                                         </Button>
        //                                     </DialogClose>
        //                                     <Button
        //                                         type='button'
        //                                         size='sm'
        //                                         className='h-40 text-3xl'
        //                                         variant='green'
        //                                         onClick={() => onTableUpdate(table?.id)}
        //                                     >
        //                                         To Prepare
        //                                     </Button>
        //                                 </DialogFooter>
        //                             </DialogContent>

        //                         </Dialog>
        //                     )
        //                 })}
        //             </div>
        //         </div>
        //         {/* <div className="grid grid-cols-[1fr,auto] gap-4 h-40">
        //             <div className='grid grid-cols-5 grid-rows-2 gap-2'>
        //                 {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0]?.map(n => {
        //                     return (
        //                         <Button
        //                             key={n}
        //                             className='h-full w-full text-3xl'
        //                             onClick={() => number.length < 3 && setNumber(number + n)}
        //                         >
        //                             {n}
        //                         </Button>
        //                     )
        //                 })}
        //             </div>
        //             <div className='grid grid-rows-2 gap-4'>
        //                 <div className='flex-container items-center justify-center bg-background-soft'>
        //                     <strong className='text-5xl'>
        //                         {number}
        //                     </strong>
        //                 </div>
        //                 <div className="grid grid-cols-2 gap-4 items-center">
        //                     <Button
        //                         className='h-full text-2xl'
        //                     >
        //                         Ready
        //                     </Button>
        //                     <Button
        //                         className='h-full text-2xl'
        //                         onClick={() => setNumber('')}
        //                         variant='destructive'
        //                     >
        //                         C
        //                     </Button>
        //                 </div>

        //             </div>
        //         </div> */}
        //     </div>
        // </LayoutFrame>
    )
}