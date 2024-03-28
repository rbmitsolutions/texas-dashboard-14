'use client'
import { useCallback, useEffect } from "react"

//components
import { InTransactionsColumnsTable } from "./inTransactionsColumns"
import { BasicTable } from "@/components/common/basicTable"
import Wrap from "@/components/common/wrap"

//interface
import { TransactionsDirection, TransactionsStatus } from "@/common/types/company/transactions.interface"

//hooks
import { useGETCompanyDataHooks } from "@/hooks/company/companyDataHooks"

interface VoucherAnalyticsProps {
    date: {
        from: Date
        to: Date
    }
}

export default function VoucherAnalytics({ date }: VoucherAnalyticsProps) {
    const {
        companyAllTransacations: transactions,
        GETCompanyDataParams: transactionsParams,
        setGETCompanyDataParams: setTransactions,
    } = useGETCompanyDataHooks({
        query: 'TRANSACTIONS',
        defaultParams: {
            transactions: {
                all: {
                    status: TransactionsStatus.CONFIRMED,
                    direction: {
                        in: [TransactionsDirection.VOUCHER]
                    },
                    created_at: {
                        gte: date?.from,
                        lte: date?.to
                    },
                    pagination: {
                        take: 20,
                        skip: 0
                    }
                }
            }
        }
    })

    const onDateChange = useCallback((date: { from: Date, to: Date }) => {
        setTransactions({
            transactions: {
                all: {
                    status: TransactionsStatus.CONFIRMED,
                    direction: {
                        in: [TransactionsDirection.VOUCHER]
                    },
                    type: {
                        in: []
                    },
                    created_at: {
                        gte: date?.from,
                        lte: date?.to
                    },
                    pagination: {
                        take: 20,
                        skip: 0
                    }
                }
            }
        });
    }, [setTransactions]);

    useEffect(() => {
        onDateChange(date)
    }, [date, onDateChange])

    return (
        <Wrap
            header={{
                title: {
                    title: 'Transactions',
                    icon: 'PiggyBank'
                },
                pagination: {
                    onPageChange: (pagination) => setTransactions(prev => ({
                        transactions: {
                            all: {
                                ...prev?.transactions?.all,
                                pagination: pagination
                            }
                        }
                    })),
                    pagination: transactions?.pagination,
                    queryPagination: transactionsParams?.transactions?.all?.pagination!,
                }
            }}
        >
            <BasicTable
                columns={InTransactionsColumnsTable({})}
                data={transactions?.data || []}
            />
        </Wrap>
    )
}