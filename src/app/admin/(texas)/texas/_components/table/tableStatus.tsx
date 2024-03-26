import { useState } from "react"
import { UseMutateFunction } from "react-query"

//libs
import { getTableStatusVariant } from "@/common/libs/restaurant/tables"

//components
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

//interface
import { IPUTRestaurantBody } from "@/hooks/restaurant/IPutRestaurantDataHooks.interface"
import { ITable, TableMealStatus } from "@/common/types/restaurant/tables.interface"
import { IPrinters } from "@/common/types/restaurant/printers.interface"

interface TableStatusProps {
    table: ITable
    updateTable: UseMutateFunction<any, any, IPUTRestaurantBody, unknown>
    printers: IPrinters[]
}

export default function TablesStatus({ table, updateTable, printers }: TableStatusProps) {
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
                </div>
            </DialogContent>
        </Dialog>

    )
}