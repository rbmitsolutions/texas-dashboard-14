import TablesStatus from "./tableStatus"
import { UseMutateFunction } from "react-query"
import Link from "next/link"

//libs
import { convertCentsToEuro } from "@/common/utils/convertToEuro"
import { formatDate } from "@/common/libs/date-fns/dateFormat"
import { cn } from "@/common/libs/shadcn/utils"

//components
import IconText from "@/components/common/iconText"
import OpenTableDialog from "./openTable"

//store
import { TransactionsState } from "@/store/company/transactions"

//interfaces
import { IPOSTRestaurantBody, IPOSTRestaurantDataRerturn } from "@/hooks/restaurant/IPostRestaurantDataHooks.interface"
import { IPUTRestaurantBody } from "@/hooks/restaurant/IPutRestaurantDataHooks.interface"
import { TransactionsStatus } from "@/common/types/company/transactions.interface"
import { IOrderController } from "@/common/types/restaurant/order.interface"
import { ITimesOpen } from "@/common/types/restaurant/config.interface"
import { IMenuSection } from "@/common/types/restaurant/menu.interface"
import { IPrinters } from "@/common/types/restaurant/printers.interface"
import { ITable } from "@/common/types/restaurant/tables.interface"
import { ICreateNewOrder } from "@/store/restaurant/order"

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
    reception?: {
        getTotalOfOrdersByTableId: (table_id: string) => number
        getTransactionsTotalByFilter: (data: TransactionsState['transactionFilter']) => number

    }
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
                    />

            )}

            {reception && table?.is_open &&
                <Link className='flex flex-col justify-between gap-1 h-full w-full p-2' href={`/admin/texas/reception/${table?.id}`}>
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
                        <small>{convertCentsToEuro(reception?.getTotalOfOrdersByTableId(table?.id))} - Total</small>
                        <small>{convertCentsToEuro(reception?.getTransactionsTotalByFilter({
                            payee_key: table?.id,
                            status: TransactionsStatus.CONFIRMED
                        }))} - Paid</small>
                    </div>
                    <div className='flex flex-col'>
                        <small>Remain</small>
                        <strong className='text-xl'>
                            {convertCentsToEuro(reception?.getTotalOfOrdersByTableId(table?.id) - reception?.getTransactionsTotalByFilter({
                                payee_key: table?.id,
                                status: TransactionsStatus.CONFIRMED
                            }))}</strong>
                    </div>
                </Link>
            }

            {reception && !table?.is_open &&
                <div className='flex-container items-center justify-center w-full'>
                    <small className='text-foreground/30'>
                        <i >Table is Close</i>
                    </small>
                </div>
            }

        </div>
    )
}