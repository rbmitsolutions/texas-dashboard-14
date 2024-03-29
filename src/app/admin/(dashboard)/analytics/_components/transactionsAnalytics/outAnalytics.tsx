'use client'
import { useCallback, useEffect } from "react"

//libs
import { convertCentsToEuro } from "@/common/utils/convertToEuro"
import { cn } from "@/common/libs/shadcn/utils"

//components
import { InTransactionsColumnsTable } from "./inTransactionsColumns"
import { BasicTable } from "@/components/common/basicTable"
import InfoBox from "@/components/common/infoBox"
import Wrap from "@/components/common/wrap"

//interface
import { TransactionsDirection, TransactionsStatus, PayrollTransactionsType } from "@/common/types/company/transactions.interface"

//hooks
import { useGETCompanyDataHooks } from "@/hooks/company/companyDataHooks"
import WrapSelect from "../wrapSelect"

interface OutAnalyticsProps {
    date: {
        from: Date
        to: Date
    }
}

interface IOutDirection {
    _sum: { total: number }
    type: PayrollTransactionsType
}

export default function OutAnalytics({ date }: OutAnalyticsProps) {
    const {
        companyTransactionAnalytics: outData,
        setGETCompanyDataParams: setOutParams,
        isCompanyDataFetching: isFetching,
    } = useGETCompanyDataHooks({
        query: 'TRANSACTIONS',
        defaultParams: {
            transactions: {
                analytics: {
                    by: ['type'],
                    status: TransactionsStatus.CONFIRMED,
                    direction: {
                        in: [TransactionsDirection.OUT]
                    },
                    type: {
                        in: [PayrollTransactionsType.ADJUSTMENT, PayrollTransactionsType.PAYROLL, PayrollTransactionsType.BANK_HOLIDAY_PAY, PayrollTransactionsType.PAYROLL, PayrollTransactionsType.TIPS]
                    },
                    date: {
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
                    status: TransactionsStatus.CONFIRMED,
                    direction: {
                        in: [TransactionsDirection.OUT]
                    },
                    type: {
                        in: [PayrollTransactionsType.ADJUSTMENT, PayrollTransactionsType.PAYROLL, PayrollTransactionsType.BANK_HOLIDAY_PAY, PayrollTransactionsType.PAYROLL, PayrollTransactionsType.TIPS]
                    },
                    date: {
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
        setTransactions(prev => ({
            transactions: {
                all: {
                    ...prev?.transactions?.all,
                    date: {
                        gte: date?.from,
                        lte: date?.to
                    },
                    pagination: {
                        take: 20,
                        skip: 0
                    }
                }
            }
        }));
        setOutParams(prev => ({
            transactions: {
                analytics: {
                    ...prev?.transactions?.analytics,
                    by: ['type'],
                    date: {
                        gte: date?.from,
                        lte: date?.to
                    }
                }
            }
        }))
    }, [setTransactions, setOutParams]);

    const onTypeChange = useCallback((type: PayrollTransactionsType) => {
        const types = transactionsParams?.transactions?.all?.type?.in || []
        if (types.includes(type)) {
            types.splice(types.indexOf(type), 1)
        } else {
            types.push(type)
        }

        setTransactions(prev => ({
            transactions: {
                all: {
                    ...prev?.transactions?.all,
                    type: {
                        in: types
                    }
                }
            }
        }))
    }, [setTransactions, transactionsParams?.transactions?.all?.type?.in]);

    useEffect(() => {
        onDateChange(date)
    }, [date, onDateChange])

    return (
        <div className='flex-col-container gap-8'>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
                {outData?.map((data: IOutDirection) => {
                    return (
                        <WrapSelect
                            key={data?.type}
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
                    columns={InTransactionsColumnsTable({
                        showDescription: true
                    })}
                    data={transactions?.data || []}
                />
            </Wrap>
        </div>
    )
}