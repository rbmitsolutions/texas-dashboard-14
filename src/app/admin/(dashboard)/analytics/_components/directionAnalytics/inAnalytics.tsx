import { useEffect } from "react"

//libs
import { dateFormatIso } from "@/common/libs/date-fns/dateFormat"

//components
import InfoBox from "@/components/common/infoBox"

//interface
import { TableTransactionsType, TransactionsType, TransactionsDirection, TransactionsStatus, TransactionsMethod } from "@/common/types/company/transactions.interface"

//hooks
import { useGETCompanyDataHooks } from "@/hooks/company/companyDataHooks"
import { convertCentsToEuro } from "@/common/utils/convertToEuro"

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
    // const {
    //     companyAllTransacations: inTransactions,
    //     setGETCompanyDataParams: setTransactions,
    // } = useGETCompanyDataHooks({
    //     query: 'TRANSACTIONS',
    //     defaultParams: {
    //         transactions: {
    //             all: {
    //                 status: TransactionsStatus.CONFIRMED,
    //                 direction: {
    //                     in: [TransactionsDirection.IN]
    //                 },
    //                 created_at: {
    //                     gte: date?.from,
    //                     lte: date?.to
    //                 },
    //                 pagination: {
    //                     take: 50,
    //                     skip: 0
    //                 }
    //             }
    //         }
    //     }
    // })

    // const directionSmallText = (direction: TransactionsDirection) => {
    //     switch (direction) {
    //         case TransactionsDirection.VOUCHER:
    //             return 'Payment with gift card'
    //         case TransactionsDirection.IN:
    //             return 'Cash + Card + Gift Card'
    //         case TransactionsDirection.OUT:
    //             return 'Payroll + Expenses'
    //         default:
    //             return direction
    //     }
    // }


    useEffect(() => {
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
        })
    }, [date, setInParams])

    console.log(inData)

    return (
        <div>
            <div className='grid grid-cols-1 gap-4 bg-orange sm:grid-cols-2 xl:grid-cols-4'>
                {inData?.sort((a: IInDirection, b: IInDirection) => {
                    if (a?.type < b?.type) {
                        return -1
                    }
                    if (a?.type > b?.type) {
                        return 1
                    }
                    return 0
                })?.map((data: IInDirection) => {
                    return (
                        <div
                            key={data?.type + data?.method}
                        >
                            <InfoBox
                                icon={{
                                    name: 'PieChart',
                                }}
                                title={data?.type}
                                value={convertCentsToEuro(data?._sum?.total)}
                                isLoading={isFetching}
                                smallValue={data?.method}
                            />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}