"use client"
import { ColumnDef } from "@tanstack/react-table"
import { formatDate } from "@/common/libs/date-fns/dateFormat"
import { ITransactions, TransactionsMethod, TransactionsStatus } from "@/common/types/company/transactions.interface";
import IconText from "@/components/common/iconText";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { UseMutateFunction } from "react-query";
import { IPUTCompanyBody } from "@/hooks/company/IPutCompanyDataHooks.interface";
import { ISocketMessage, SocketIoEvent } from "@/common/libs/socketIo/types";

interface TransactionsColumnsTableProps {
    updateTransaction: UseMutateFunction<any, any, IPUTCompanyBody, unknown>
    emit: (message: ISocketMessage) => void
}

export const transactionsColumnsTable = ({
    updateTransaction,
    emit
}: TransactionsColumnsTableProps): ColumnDef<ITransactions>[] => {
    return [
        {
            accessorKey: "day",
            header: () => <div className="text-left max-w-48">Day</div>,
            size: 100,
            cell: ({ row }) => {
                return <div className="text-left max-w-48">
                    {formatDate({
                        date: row?.original?.created_at,
                        f: 'dd, LLL, yy'
                    })}
                </div>
            }
        },
        {
            accessorKey: "method",
            header: () => <div className="text-left max-w-48">Method</div>,
            size: 60,
            cell: ({ row }) => {
                return (
                    <div className="text-left max-w-48">
                        <IconText
                            icon={row?.original?.method === TransactionsMethod.CARD ? 'CreditCard' : TransactionsMethod.CASH ? 'Banknote' : 'Gift'}
                            text={row?.original?.method}
                            pclass="capitalize"
                        />
                    </div>
                )
            }
        },
        {
            accessorKey: "valid_by",
            header: () => <div className="text-left max-w-48">Authorized By</div>,
            size: 60,
            cell: ({ row }) => {
                return (
                    <div >
                        {row?.original?.valid_by}
                    </div>
                )
            }
        },
        {
            accessorKey: "status",
            header: () => <div className="text-left max-w-48">Status</div>,
            size: 60,
            cell: ({ row }) => {
                return (
                    <>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={row?.original?.status === TransactionsStatus.CONFIRMED ? "green" : row?.original?.status === TransactionsStatus.CANCELLED ? "yellow" : "destructive"}
                                    className='capitalize'
                                    size='sm'
                                >
                                    {row?.original?.status?.toLocaleLowerCase()}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="flex-col-container w-auto p-4" align="end">
                                <div className='flex-col-container'>
                                    <strong>Cancel Transaction</strong>
                                    <Button
                                        variant="yellow"
                                        size="sm"
                                        className="mt-2"
                                        leftIcon="XCircle"
                                        onClick={() => {
                                            updateTransaction({
                                                transaction: {
                                                    one: {
                                                        id: row?.original?.id,
                                                        total: row?.original?.total,
                                                        status: TransactionsStatus.CANCELLED
                                                    }
                                                }
                                            }, {
                                                onSuccess: async () => {
                                                    await emit({
                                                        event: SocketIoEvent.TABLE_PAYMENT,
                                                        message: row?.original?.payee_key
                                                    })
                                                }
                                            })
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </PopoverContent>
                        </Popover >
                    </>
                )
            }
        },
    ]
}