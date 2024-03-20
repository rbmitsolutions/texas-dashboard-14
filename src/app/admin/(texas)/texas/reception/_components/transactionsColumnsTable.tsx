"use client"
import { ColumnDef } from "@tanstack/react-table"
import { UseMutateFunction } from "react-query";

//libs
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { convertCentsToEuro } from "@/common/utils/convertToEuro";
import { formatDate } from "@/common/libs/date-fns/dateFormat"
import { Button } from "@/components/ui/button";

//components
import IconText from "@/components/common/iconText";

//interface
import { ITransactions, TransactionsMethod, TransactionsStatus } from "@/common/types/company/transactions.interface";
import { IPUTCompanyBody } from "@/hooks/company/IPutCompanyDataHooks.interface";

interface TransactionsColumnsTableProps {
    updateTransaction?: UseMutateFunction<any, any, IPUTCompanyBody, unknown>
}

export const transactionsColumnsTable = ({
    updateTransaction,
}: TransactionsColumnsTableProps): ColumnDef<ITransactions>[] => {
    return [
        {
            accessorKey: "day",
            header: () => <div className="text-left max-w-48">Day</div>,
            size: 70,
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
            accessorKey: "total",
            header: () => <div className="text-left max-w-48">Paid</div>,
            size: 60,
            cell: ({ row }) => {
                return (
                    <div className="text-left max-w-48">
                        {convertCentsToEuro(row?.original?.total)}
                    </div>
                )
            }
        },
        {
            accessorKey: "method",
            header: () => <div className="text-left max-w-48">Method</div>,
            size: 100,
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
                                    disabled={!updateTransaction}
                                >
                                    {row?.original?.status?.toLocaleLowerCase()}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="flex-col-container w-auto p-4" align="end">
                                <div className='flex-col-container'>
                                    <strong>Cancel</strong>
                                    <small className='w-36 text-justify'>The orders that were linked to this payment will return as unpaid</small>
                                    <Button
                                        variant="yellow"
                                        size="sm"
                                        className="mt-2"
                                        leftIcon="XCircle"
                                        disabled={!updateTransaction}
                                        onClick={async () => {
                                            const description: { id: string, paid: number }[] = row?.original?.description ? JSON.parse(row?.original?.description) : []
                                            const unpaidOrders: { id: string, unpaid: number }[] = description?.map(d => {
                                                return {
                                                    id: d.id,
                                                    unpaid: d.paid
                                                }

                                            })
                                            updateTransaction && await updateTransaction({
                                                transaction: {
                                                    one: {
                                                        id: row?.original?.id,
                                                        total: row?.original?.total,
                                                        status: TransactionsStatus.CANCELLED,
                                                        orders: unpaidOrders
                                                    }
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