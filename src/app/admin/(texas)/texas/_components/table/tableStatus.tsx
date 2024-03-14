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
        if (!table || orderControllers?.length) {
            return true;
        }
        const tableMealStatus = table.meal_status;

        switch (tableMealStatus) {
            case 'waiting':
                return status !== 'waiting';
            case 'starters':
                return status === 'starters';
            case 'main':
                return status !== 'main' && status !== 'all together' && status !== 'clean table';
            case 'all together':
                return status !== 'clean table';
            case 'clean table':
                return status !== 'main'
            default:
                return true
        }
    };

    const handleUpdateTable = async (meal_status: TableMealStatus) => {
        await updateTable(
            {
                table: {
                    id: table?.id,
                    meal_status
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
                >
                    {table?.meal_status}
                </Button>
            </DialogTrigger>
            <DialogContent className=''>
                <DialogHeader>
                    <DialogTitle>Update Table Status</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-[1fr,auto] gap-2">
                    <div className='max-h-[400px] overflow-auto'>
                        {orderControllers?.length === 0 &&
                            <DialogDescription>
                                No Orders
                            </DialogDescription>
                        }
                        {orderControllers?.map(oc => {
                            return (
                                <FullOrderController
                                    key={oc?.id}
                                    orderController={oc}
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
                    </div>
                    <div className='flex-col-container'>
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
                    </div>
                </div>
            </DialogContent>
        </Dialog>

    )
}