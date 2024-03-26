import { useEffect, useState } from "react"

//libs
import { convertCentsToEuro } from "@/common/utils/convertToEuro"

//components
import InfoBox from "@/components/common/infoBox"

//interface
import { TransactionsDirection, TransactionsStatus } from "@/common/types/company/transactions.interface"

//hooks
import { useGETCompanyDataHooks } from "@/hooks/company/companyDataHooks"
import InAnalytics from "./inAnalytics"

interface DirectionAnalyticsProps {
    date: {
        from: Date
        to: Date
    }
}

interface IDataDirection {
    _sum: { total: number }
    status: TransactionsStatus
    direction: TransactionsDirection
}

export default function DirectionAnalytics({ date }: DirectionAnalyticsProps) {
    const [direction, setDirection] = useState<TransactionsDirection | undefined>(undefined)

    const {
        companyTransactionAnalytics: dataDirection,
        setGETCompanyDataParams: setDirectionParams,
        isCompanyDataFetching: isFetching,
    } = useGETCompanyDataHooks({
        query: 'TRANSACTIONS',
        defaultParams: {
            transactions: {
                analytics: {
                    by: ['status', 'direction'],
                    status: TransactionsStatus.CONFIRMED,
                    created_at: {
                        gte: date?.from,
                        lte: date?.to
                    },
                }
            }
        }
    })

    const directionSmallText = (direction: TransactionsDirection) => {
        switch (direction) {
            case TransactionsDirection.VOUCHER:
                return 'Payment with gift card'
            case TransactionsDirection.IN:
                return 'Cash + Card + Gift Card'
            case TransactionsDirection.OUT:
                return 'Payroll + Expenses'
            default:
                return direction
        }
    }


    const renderDirectionDetails = (direction: TransactionsDirection) => {
        switch (direction) {
            case TransactionsDirection.IN:
                return <InAnalytics date={date} />
            default:
                return <div></div>
        }
    }


    useEffect(() => {
        setDirectionParams({
            transactions: {
                analytics: {
                    by: ['status', 'direction'],
                    status: TransactionsStatus.CONFIRMED,
                    created_at: {
                        gte: new Date(date?.from!),
                        lte: new Date(date?.to!)
                    },
                }
            }
        })
    }, [date, setDirectionParams])

    return (
        <div className='flex-col-container'>
            <div className='grid grid-cols-1 gap-4 bg-orange sm:grid-cols-2 xl:grid-cols-4'>
                {Object.values(TransactionsDirection)?.map(direction => {
                    const dataByDirection = dataDirection?.find((data: IDataDirection) => data.direction === direction)
                    return (
                        <div
                            key={direction}
                            className='cursor-pointer'
                            onClick={() => setDirection(perv => perv === direction ? undefined : direction)}
                        >
                            <InfoBox
                                icon={{
                                    name: 'PieChart',
                                }}
                                title={direction}
                                value={convertCentsToEuro(dataByDirection?._sum?.total)}
                                isLoading={isFetching}
                                smallValue={directionSmallText(direction)}
                                 
                            />
                        </div>
                    )
                })}
            </div>
            {direction &&
                <div className='flex-col-container p-4 bg-background-soft'>
                    {renderDirectionDetails(direction)}
                </div>
            }
        </div>
    )
}