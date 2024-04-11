'use client'
import { useCallback, useEffect } from "react"

//libs
import { formatDate } from "@/common/libs/date-fns/dateFormat"
import { api } from "@/common/libs/axios/api"

//components
import ExcelDownloadButton from "@/components/common/excelDownloadButton"
import { InTransactionsColumnsTable } from "./inTransactionsColumns"
import { BasicTable } from "@/components/common/basicTable"
import Wrap from "@/components/common/wrap"

//hooks
import { useGETCompanyDataHooks } from "@/hooks/company/companyDataHooks"
import { useAuthHooks } from "@/hooks/useAuthHooks"

//interface
import { ITransactions, TransactionsDirection, TransactionsStatus } from "@/common/types/company/transactions.interface"
import { EndPointsTypes } from "@/common/types/routers/endPoints.types"

interface VoucherAnalyticsProps {
    date: {
        from: Date
        to: Date
    }
}

export default function VoucherAnalytics({ date }: VoucherAnalyticsProps) {
    const { user } = useAuthHooks()
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
                    },
                    orderBy: {
                        key: 'created_at',
                        order: 'desc'
                    }
                }
            }
        }
    })

    const onDownload = async (): Promise<any[] | undefined> => {
        try {
            const { data } = await api.get(EndPointsTypes['COMPANY_TRANSACTIONS_ENDPOINT'], {
                params: {
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
                                take: 5000,
                                skip: 0
                            },
                            orderBy: {
                                key: 'created_at',
                                order: 'desc'
                            }
                        }
                    }
                }
            })

            const transactions: ITransactions[] = data?.data

            const finalData = transactions?.map(b => {
                return {
                    Date: formatDate({
                        date: b?.created_at,
                        f: 'dd/MM/yyyy'
                    }),
                    Method: b?.method,
                    Status: b?.status,
                    ValidBy: b?.valid_by,
                    Total: b?.total / 100,
                }
            })
            return finalData || []
        } catch (err) {
            console.error(err)
        }
    }

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
                    },
                    orderBy: {
                        key: 'created_at',
                        order: 'desc'
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
            actions={{
                searchInput: {
                    onSearchChange: (search) => setTransactions(prev => ({
                        transactions: {
                            all: {
                                ...prev?.transactions?.all,
                                valid_by: search,
                                pagination: {
                                    take: 20,
                                    skip: 0
                                }
                            }
                        }
                    })),
                    value: transactionsParams?.transactions?.all?.valid_by || '',
                    placeholder: 'Search by Valid By'
                },
                optionsPopover: {
                    options: [
                        {
                            label: 'Sort by',
                            value: `${transactionsParams?.transactions?.all?.orderBy?.key}/${transactionsParams?.transactions?.all?.orderBy?.order}` || 'created_at/desc',
                            placeholder: 'Sort by',
                            onChange: (e: string) => setTransactions(prev => ({
                                transactions: {
                                    all: {
                                        ...prev?.transactions?.all,
                                        date: {
                                            gte: date.from,
                                            lte: date.to
                                        },
                                        orderBy: {
                                            key: e.split('/')[0] as any,
                                            order: e.split('/')[1] as any
                                        }
                                    }
                                }
                            })),
                            options: [
                                {
                                    label: 'Date A-Z',
                                    value: 'created_at/asc'
                                },
                                {
                                    label: 'Date Z-A',
                                    value: 'created_at/desc'
                                },
                                {
                                    label: 'Total A-Z',
                                    value: 'total/asc'
                                },
                                {
                                    label: 'Total Z-A',
                                    value: 'total/desc'
                                },
                                {
                                    label: 'Valid By A-Z',
                                    value: 'valid_by/asc'
                                },
                                {
                                    label: 'Valid By Z-A',
                                    value: 'valid_by/desc'
                                },

                            ]
                        }
                    ]
                },
                toRight: <>
                    <ExcelDownloadButton
                        fileName='Voucher Transactions'
                        onDownload={() => onDownload()}
                    />
                </>,
                className: 'grid grid-cols-[1fr,auto,auto] items-center gap-2'
            }}
        >
            <BasicTable
                columns={InTransactionsColumnsTable({
                    user
                })}
                data={transactions?.data || []}
            />
        </Wrap>
    )
}