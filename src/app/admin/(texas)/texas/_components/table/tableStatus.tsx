import { UseMutateFunction } from "react-query"

//libs
import { cn } from "@/common/libs/shadcn/utils"

//components
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

//interface
import { IPUTRestaurantBody } from "@/hooks/restaurant/IPutRestaurantDataHooks.interface"
import { ITable } from "@/common/types/restaurant/tables.interface"
import { ISocketMessage } from "@/common/libs/socketIo/types"

interface TableStatusProps {
    table: ITable
    updateTable: UseMutateFunction<any, any, IPUTRestaurantBody, unknown>
    emit: (data: ISocketMessage) => void
}

export default function TablesStatus({ table }: TableStatusProps) {

    const tableStatusBg = (): string => {
        switch (table?.meal_status) {
            case 'waiting':
                return 'bg-orange-300 hover:bg-orange-400 dark:bg-orange-300 dark:hover:bg-orange-400'
            case 'starters':
                return 'bg-orange-300 hover:bg-orange-400 dark:bg-orange-300 dark:hover:bg-orange-400'
            case 'main':
                return 'bg-orange-300 hover:bg-orange-400 dark:bg-orange-300 dark:hover:bg-orange-400'
            case 'all together':
                return 'bg-orange-300 hover:bg-orange-400 dark:bg-orange-300 dark:hover:bg-orange-400'
            case 'clean table':
                return 'bg-orange-300 hover:bg-orange-400 dark:bg-orange-300 dark:hover:bg-orange-400'
            default:
                return 'bg-orange-300 hover:bg-orange-400 dark:bg-orange-300 dark:hover:bg-orange-400'
        }
    }

    // const isStatusDisabled = (status: ITableMealStatus): boolean => {
    //     if (!table || controllers?.length) {
    //         return true;
    //     }

    //     const tableMealStatus = table.meal_status;

    //     switch (tableMealStatus) {
    //         case 'waiting':
    //             return status !== 'waiting';
    //         case 'starters':
    //             return status === 'starters';
    //         case 'main':
    //             return status !== 'main' && status !== 'all together' && status !== 'clean table';
    //         case 'all together':
    //             return status !== 'clean table';
    //         case 'clean table':
    //             return status !== 'main'
    //         default:
    //             return true
    //     }
    // };

    // const handleOptionSelected = async (option: ITableMealStatus) => {
    //     await updateTable(
    //         {
    //             table: {
    //                 id: table?.id,
    //                 data: {
    //                     meal_status: option,
    //                 }
    //             }
    //         },
    //         {
    //             onSuccess: () => {
    //                 emit({
    //                     event: 'table'
    //                 })
    //                 onClose()
    //             },
    //         }
    //     );
    // }

    // const handleOrderUpdateStatus = async (orders: IOrder[]) => {
    //     await updateOrder(
    //       {
    //         order: {
    //           many: {
    //             orders: {
    //               id: {
    //                 in: orders?.map(o => o?.id)
    //               },
    //               data: {
    //                 status: 'delivered'
    //               }
    //             },
    //           }
    //         }
    //       },
    //       {
    //         onSuccess: () => {
    //           emit({
    //             event: 'order',
    //           })
    //         },
    //       }
    //     );
    //   }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    className={cn('w-full capitalize text-black', tableStatusBg())}
                >
                    {table?.meal_status}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>

    )
}