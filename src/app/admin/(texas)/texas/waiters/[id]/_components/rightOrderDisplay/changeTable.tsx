'use client'
import { useState } from "react";
import { UseMutateFunction } from "react-query";
import { useRouter } from "next/navigation";
import { Dice4 } from "lucide-react";

//component
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import SelectTable from "../../../../bookings/_components/selectTable";
import { Button } from "@/components/ui/button";

//interface 
import { IPUTRestaurantBody } from "@/hooks/restaurant/IPutRestaurantDataHooks.interface";
import { ISection, ITable } from "@/common/types/restaurant/tables.interface";
import { RedirectTo } from "@/common/types/routers/endPoints.types";

interface ChangeTableProps {
    table: ITable
    updateTable: UseMutateFunction<any, any, IPUTRestaurantBody, unknown>
}

export default function ChangeTable({ table, updateTable }: ChangeTableProps) {
    const { push } = useRouter()
    const [tableSelected, setTableSelected] = useState<ITable | undefined>(undefined)

    const onOpenChange = () => {
        setTableSelected(undefined)
    }

    const onTableChange = async () => {
        if (!tableSelected) return

        await updateTable({
            table: {
                id: table?.id,
                change_table: {
                    to_id: tableSelected?.id
                }
            },
        },{
            onSuccess: () => {
                push(RedirectTo.WAITERS + `/${tableSelected?.id}`)
            }
        })
}

return (
    <Dialog
        onOpenChange={onOpenChange}
    >
        <DialogTrigger asChild>
            <Button
                className="h-12 w-12 p-2"
                variant='orange'
            >
                <Dice4 size={16} />
            </Button>
        </DialogTrigger>
        <DialogContent
            className="grid grid-rows-[auto,1fr,auto] h-[70vh] max-w-md"
        >
            <DialogHeader>
                Change Table
            </DialogHeader>
            <div className='flex-col-container gap-4 overflow-auto'>
                <SelectTable
                    tableSelected={tableSelected}
                    setTableSelected={setTableSelected}
                />
            </div>
            <DialogFooter
                className="w-full"
            >
                <Button
                    leftIcon="RefreshCcw"
                    variant='orange'
                    disabled={!tableSelected}
                    onClick={onTableChange}
                >
                    Change Table
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
)
}