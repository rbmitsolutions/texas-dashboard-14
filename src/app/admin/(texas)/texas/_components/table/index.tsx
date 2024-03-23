import TablesStatus from "./tableStatus"
import { UseMutateFunction } from "react-query"
import Link from "next/link"

//libs
import { formatDate } from "@/common/libs/date-fns/dateFormat"
import { cn } from "@/common/libs/shadcn/utils"

//components
import PrintBill from "../../reception/_components/rightReceptionDisplay/printBillButton"
import IconText from "@/components/common/iconText"
import { Button } from "@/components/ui/button"
import OpenTableDialog from "./openTable"

//interfaces
import { IPOSTRestaurantBody, IPOSTRestaurantDataRerturn } from "@/hooks/restaurant/IPostRestaurantDataHooks.interface"
import { IPUTRestaurantBody } from "@/hooks/restaurant/IPutRestaurantDataHooks.interface"
import { IOrderController } from "@/common/types/restaurant/order.interface"
import { ITimesOpen } from "@/common/types/restaurant/config.interface"
import { IMenuSection } from "@/common/types/restaurant/menu.interface"
import { IPrinters } from "@/common/types/restaurant/printers.interface"
import { getTableStatusVariant } from "@/common/libs/restaurant/tables"
import { ITable } from "@/common/types/restaurant/tables.interface"
import { RedirectTo } from "@/common/types/routers/endPoints.types"
import { ICreateNewOrder } from "@/store/restaurant/order"
import FinishedTables from "./finishedTable"

interface TableProps {
    table: ITable
    waitres?: {
        createBooking: UseMutateFunction<IPOSTRestaurantDataRerturn, any, IPOSTRestaurantBody, unknown>
        timesOpen: ITimesOpen[],
        orderControllers: IOrderController[]
        getOneOrderTotal: (order: ICreateNewOrder) => number
        menuSections: IMenuSection[]
        updateOrder: UseMutateFunction<any, any, IPUTRestaurantBody, unknown>
        updateTable: UseMutateFunction<any, any, IPUTRestaurantBody, unknown>
        printers: IPrinters[]
    }
    reception?: '1'
}

export default function Table({ table, waitres, reception }: TableProps) {
    return (
        <div className='flex gap-2 min-h-40 bg-background-soft rounded-lg'>
            <div className={cn('flex-col-container w-10 py-1 items-center justify-between rounded-l-lg', table?.is_open ? 'bg-green-500 dark:bg-green-700' : 'bg-red-400 dark:bg-red-800')}>
                <small>{table?.number}</small>
                <IconText
                    icon="Users"
                    text={table?.guests}
                    className="flex flex-col-reverse gap-1 mb-1"
                />
            </div>
            {waitres && (
                table?.is_open ?
                    <div className='flex-col-container justify-between gap-2 p-2 w-full'>
                        <Link className='flex flex-col gap-1 h-full w-full' href={`/admin/texas/waiters/${table?.id}`}>
                            <strong className='capitalize text-sm'>{table?.client_name?.toLowerCase() || 'Walk In'}</strong>
                            <IconText
                                icon="Clock"
                                text={formatDate({
                                    date: table?.start_time,
                                    f: 'HH:mm:ss',
                                    iso: false
                                })}
                                iconSize={14}
                            />
                            <IconText
                                icon="Utensils"
                                text={`Pass ${table?.pass}`}
                                iconSize={14}
                            />
                        </Link>
                        {/* <Button
                            className='capitalize'
                            variant={getTableStatusVariant(table?.meal_status)}
                        >
                            {table?.meal_status}
                        </Button> */}
                        <TablesStatus
                            table={table}
                            updateTable={waitres?.updateTable}
                            orderControllers={waitres?.orderControllers}
                            getOneOrderTotal={waitres?.getOneOrderTotal}
                            menuSections={waitres?.menuSections}
                            updateOrder={waitres?.updateOrder}
                            printers={waitres?.printers}
                        />
                    </div>
                    :
                    <OpenTableDialog
                        table={table}
                        timesOpen={waitres.timesOpen}
                        createBooking={waitres.createBooking}
                        updateTable={waitres.updateTable}
                    />

            )}

            {reception && table?.is_open &&
                <div className='flex flex-col justify-between p-1 w-full'>
                    <Link className='flex flex-col justify-between gap-1 h-full w-full p-2' href={`${RedirectTo.RECEPTION}/${table?.id}`}>
                        <div className='flex flex-col gap-1'>
                            <strong className='capitalize text-sm'>{table?.client_name?.toLowerCase() || 'Walk In'}</strong>
                            <IconText
                                icon="Clock"
                                text={formatDate({
                                    date: table?.start_time,
                                    f: 'HH:mm:ss',
                                    iso: false
                                })}
                                iconSize={14}
                            />
                            <IconText
                                icon="Utensils"
                                text={`Pass ${table?.pass}`}
                                iconSize={14}
                            />
                        </div>
                    </Link>
                    <div className='grid grid-cols-[auto,1fr,auto] gap-2 ='>
                        <PrintBill
                            tableId={table?.id}
                        />
                        <Button
                            className='w-full capitalize'
                            variant={getTableStatusVariant(table?.meal_status)}
                            size='sm'
                        >
                            {table?.meal_status}
                        </Button>
                        <FinishedTables
                            tableId={table?.id}
                        />
                    </div>
                </div>
            }

            {reception && !table?.is_open &&
                <div className='grid grid-rows-[1fr,auto] w-full'>
                    <small className='flex-container items-center justify-center h-fulltext-foreground/30'>
                        <i >Table is Close</i>
                    </small>
                    <div className='flex-container justify-end p-1 w-full'>
                        <FinishedTables
                            tableId={table?.id}
                        />
                    </div>
                </div>
            }
        </div>
    )
}