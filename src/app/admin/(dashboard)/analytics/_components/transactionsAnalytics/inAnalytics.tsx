'use client'
import { useCallback, useEffect } from "react"

//libs
import { convertCentsToEuro } from "@/common/utils/convertToEuro"

//components
import { InTransactionsColumnsTable } from "./inTransactionsColumns"
import { BasicTable } from "@/components/common/basicTable"
import InfoBox from "@/components/common/infoBox"
import Wrap from "@/components/common/wrap"
import WrapSelect from "../wrapSelect"

//interface
import { TransactionsType, TransactionsDirection, TransactionsStatus, TransactionsMethod } from "@/common/types/company/transactions.interface"

//hooks
import { useGETCompanyDataHooks } from "@/hooks/company/companyDataHooks"

interface InAnalyticsProps {
    date: {
        from: Date
        to: Date
    }
}

interface IInDirection {
    _sum: { total: number }
    type: TransactionsType
    method: TransactionsMethod
}

export default function InAnalytics({ date }: InAnalyticsProps) {
    const {
        companyTransactionAnalytics: inData,
        setGETCompanyDataParams: setInParams,
        isCompanyDataFetching: isFetching,
    } = useGETCompanyDataHooks({
        query: 'TRANSACTIONS',
        defaultParams: {
            transactions: {
                analytics: {
                    by: ['type', 'method'],
                    status: TransactionsStatus.CONFIRMED,
                    direction: {
                        in: [TransactionsDirection.IN]
                    },
                    created_at: {
                        gte: date?.from,
                        lte: date?.to
                    }
                }
            }
        }
    })

    const {
        companyAllTransacations: transactions,
        GETCompanyDataParams: transactionsParams,
        setGETCompanyDataParams: setTransactions,
    } = useGETCompanyDataHooks({
        query: 'TRANSACTIONS',
        defaultParams: {
            transactions: {
                all: {
                    direction: {
                        in: [TransactionsDirection.IN]
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
        }
    })

    const onDateChange = useCallback((date: { from: Date, to: Date }) => {
        setInParams({
            transactions: {
                analytics: {
                    by: ['type', 'method'],
                    status: TransactionsStatus.CONFIRMED,
                    direction: {
                        in: [TransactionsDirection.IN]
                    },
                    created_at: {
                        gte: date?.from,
                        lte: date?.to
                    }
                }
            }
        });
        setTransactions({
            transactions: {
                all: {
                    direction: {
                        in: [TransactionsDirection.IN]
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
    }, [setInParams, setTransactions]);

    const onTypeChange = useCallback((type: TransactionsType) => {
        const types = transactionsParams?.transactions?.all?.type?.in || []

        if (types.includes(type)) {
            setTransactions(prev => ({
                transactions: {
                    all: {
                        ...prev?.transactions?.all,
                        type: {
                            in: types.filter(t => t !== type)
                        },
                        pagination: {
                            take: 20,
                            skip: 0
                        }
                    }
                }
            }))
        } else {
            setTransactions(prev => ({
                transactions: {
                    all: {
                        ...prev?.transactions?.all,
                        type: {
                            in: [...types, type]
                        },
                        pagination: {
                            take: 20,
                            skip: 0
                        }
                    }
                }
            }))
        }
    }, [setTransactions, transactionsParams?.transactions?.all?.type?.in])

    const inDataSorted = inData?.sort((a: IInDirection, b: IInDirection) => {
        if (a?.type < b?.type) {
            return -1
        }
        if (a?.type > b?.type) {
            return 1
        }
        return 0
    })

    useEffect(() => {
        onDateChange(date)
    }, [date, onDateChange])

    return (
        <div className='flex-col-container gap-8'>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
                {inDataSorted?.map((data: IInDirection) => {
                    return (
                        <WrapSelect
                            key={data?.type + data?.method}
                            selected={transactionsParams?.transactions?.all?.type?.in?.includes(data?.type) || false}
                            handleSelect={() => onTypeChange(data?.type)}
                        >
                            <InfoBox
                                icon={{
                                    name: 'PieChart',
                                }}
                                title={data?.type}
                                value={convertCentsToEuro(data?._sum?.total || 0)}
                                isLoading={isFetching}
                                smallValue={data?.method}
                            />
                        </WrapSelect>
                    )
                })}
            </div>
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
        </div>
    )
}