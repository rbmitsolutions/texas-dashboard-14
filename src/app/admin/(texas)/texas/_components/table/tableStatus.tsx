import { useState } from "react"
import { UseMutateFunction } from "react-query"

//libs
import { getTableStatusVariant } from "@/common/libs/restaurant/tables"

//components
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import FullOrderController from "../orderSummary/fullOrderController"
import { Button } from "@/components/ui/button"

//interface
import { IPUTRestaurantBody } from "@/hooks/restaurant/IPutRestaurantDataHooks.interface"
import { ITable, TableMealStatus } from "@/common/types/restaurant/tables.interface"
import { IOrderController } from "@/common/types/restaurant/order.interface"
import { IMenuSection } from "@/common/types/restaurant/menu.interface"
import { IPrinters } from "@/common/types/restaurant/printers.interface"
import { ICreateNewOrder } from "@/store/restaurant/order"

interface TableStatusProps {
    table: ITable
    updateTable: UseMutateFunction<any, any, IPUTRestaurantBody, unknown>
    orderControllers: IOrderController[]
    getOneOrderTotal: (order: ICreateNewOrder) => number
    menuSections: IMenuSection[]
    updateOrder: UseMutateFunction<any, any, IPUTRestaurantBody, unknown>
    printers: IPrinters[]
}

export default function TablesStatus({ table, updateTable, orderControllers, updateOrder, getOneOrderTotal, menuSections, printers }: TableStatusProps) {
    const [isOpen, setIsOpen] = useState(false)

    const isStatusDisabled = (status: TableMealStatus): boolean => {
        const tableMealStatus = table.meal_status;

        switch (tableMealStatus) {
            case 'waiting':
                return false
            case 'starters':
                return status === 'starters';
            case 'main':
                return status !== 'main' && status !== 'all together';
            case 'all together':
                return status !== 'main'
            default:
                return false
        }
    };

    const handleUpdateTable = async (meal_status: TableMealStatus) => {
        await updateTable(
            {
                table: {
                    id: table?.id,
                    meal_status,
                    food_ordered_at: new Date()
                }
            },
            {
                onSuccess: () => {
                    setIsOpen(false)
                },
            }
        );
    }

    return (
        <Dialog
            open={isOpen}
            onOpenChange={setIsOpen}
        >
            <DialogTrigger asChild>
                <Button
                    className='capitalize'
                    variant={getTableStatusVariant(table?.meal_status)}
                    disabled={table?.meal_status === TableMealStatus?.WAITING || table?.meal_status === TableMealStatus?.PREPARING}
                >
                    {table?.meal_status}
                </Button>
            </DialogTrigger>
            <DialogContent className=''>
                <DialogHeader>
                    <DialogTitle>Update Table Status</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1fr gap-2">
                    <Button
                        disabled={isStatusDisabled(TableMealStatus.STARTERS)}
                        className='capitalize h-24 text-2xl'
                        variant={getTableStatusVariant(TableMealStatus.STARTERS)}
                        onClick={() => handleUpdateTable(TableMealStatus.STARTERS)}
                    >
                        {TableMealStatus.STARTERS}
                    </Button>
                    <Button
                        disabled={isStatusDisabled(TableMealStatus.MAIN)}
                        className='capitalize h-24 text-2xl'
                        variant={getTableStatusVariant(TableMealStatus.MAIN)}
                        onClick={() => handleUpdateTable(TableMealStatus.MAIN)}
                    >
                        {TableMealStatus.MAIN}
                    </Button>
                    <Button
                        disabled={isStatusDisabled(TableMealStatus.ALL_TOGETHER)}
                        className='capitalize h-24 text-2xl'
                        variant={getTableStatusVariant(TableMealStatus.ALL_TOGETHER)}
                        onClick={() => handleUpdateTable(TableMealStatus.ALL_TOGETHER)}
                    >
                        {TableMealStatus.ALL_TOGETHER}
                    </Button>
                    <Button
                        className='capitalize h-24 text-2xl'
                        variant={getTableStatusVariant(TableMealStatus.DESSERT)}
                        onClick={() => handleUpdateTable(TableMealStatus.DESSERT)}
                    >
                        {TableMealStatus.DESSERT}
                    </Button>
                    {/* <div className='min-h-[600px] max-h-[600px] space-y-4 overflow-auto'>
                        {orderControllers?.length === 0 &&
                            <DialogDescription>
                                No Orders
                            </DialogDescription>
                        }
                        {orderControllers?.map(oc => {
                            return (
                                <FullOrderController
                                    key={oc?.id}
                                    orderController={{
                                        ...oc,
                                        table
                                    }}
                                    orderSumary={{
                                        getOneOrderTotal,
                                        menuSections,
                                        order: oc?.orders,
                                        updateOrderStatus: {
                                            onUpdate: updateOrder
                                        },
                                    }}
                                    onOrdersUpdate={updateOrder}
                                    printers={printers}
                                />
                            )
                        })}
                    </div> */}
                    {/* <div className='flex-col-container'>
                        {
                            Object.values(TableMealStatus).map(status => {
                                return (
                                    <Button
                                        key={status}
                                        disabled={isStatusDisabled(status)}
                                        className='capitalize h-12'
                                        variant={getTableStatusVariant(status)}
                                        onClick={() => handleUpdateTable(status)}
                                    >
                                        {status}
                                    </Button>
                                )
                            })
                        }
                    </div> */}
                </div>
            </DialogContent>
        </Dialog>

    )
}