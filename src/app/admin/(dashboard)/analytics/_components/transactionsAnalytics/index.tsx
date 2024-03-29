'use client'
import { useCallback, useEffect, useState } from "react"

//libs
import { convertCentsToEuro } from "@/common/utils/convertToEuro"

//components
import InfoBox from "@/components/common/infoBox"
import VoucherAnalytics from "./voucherAnalytics"
import TipsAnalytics from "./tipsAnalytics"
import OutAnalytics from "./outAnalytics"
import WrapSelect from "../wrapSelect"

//interface
import { PayrollTransactionsType, TransactionsDirection, TransactionsStatus } from "@/common/types/company/transactions.interface"

//hooks
import { useGETCompanyDataHooks } from "@/hooks/company/companyDataHooks"
import InAnalytics from "./inAnalytics"

interface TransactionsAnalyticsProps {
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

export default function TransactionsAnalytics({ date }: TransactionsAnalyticsProps) {
    const [direction, setDirection] = useState<TransactionsDirection | undefined>()

    const {
        companyTransactionAnalytics: dataDirection,
        setGETCompanyDataParams: setDirectionParams,
    } = useGETCompanyDataHooks({
        query: 'TRANSACTIONS',
        defaultParams: {
            transactions: {
                analytics: {
                    by: ['status', 'direction'],
                    direction: {
                        in: [TransactionsDirection.IN, TransactionsDirection.VOUCHER, TransactionsDirection.TIP],
                    },
                    status: TransactionsStatus.CONFIRMED,
                    created_at: {
                        gte: date?.from,
                        lte: date?.to
                    },
                }
            }
        }
    })

    // for the payroll analytics, you have to  get the data from DATE instead of CREATED_AT because the payroll is not created as the same week as payed (usually the week after)
    const {
        companyTransactionAnalytics: outData,
        setGETCompanyDataParams: setOutData,
    } = useGETCompanyDataHooks({
        query: 'TRANSACTIONS',
        defaultParams: {
            transactions: {
                analytics: {
                    by: ['status', 'direction'],
                    direction: {
                        in: [TransactionsDirection.OUT],
                    },
                    status: TransactionsStatus.CONFIRMED,
                    type: {
                        in: [PayrollTransactionsType.ADJUSTMENT, PayrollTransactionsType.PAYROLL, PayrollTransactionsType.BANK_HOLIDAY_PAY, PayrollTransactionsType.PAYROLL, PayrollTransactionsType.TIPS]
                    },
                    date: {
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
            case TransactionsDirection.VOUCHER:
                return <VoucherAnalytics date={date} />
            case TransactionsDirection.TIP:
                return <TipsAnalytics date={date} />
            case TransactionsDirection.OUT:
                return <OutAnalytics date={date} />
            default:
                return <div />
        }
    }


    const onDateChange = useCallback((date: { from: Date, to: Date }) => {
        setDirectionParams({
            transactions: {
                analytics: {
                    by: ['status', 'direction'],
                    direction: {
                        in: [TransactionsDirection.IN, TransactionsDirection.VOUCHER, TransactionsDirection.TIP],
                    },
                    status: TransactionsStatus.CONFIRMED,
                    created_at: {
                        gte: date?.from,
                        lte: date?.to
                    },
                }
            }
        })
        setOutData(prev => ({
            transactions: {
                analytics: {
                    ...prev?.transactions?.analytics,
                    by: ['status', 'direction'],
                    date: {
                        gte: date?.from,
                        lte: date?.to
                    },
                }
            }
        }))

    }, [setDirectionParams, setOutData]);

    useEffect(() => {
        onDateChange(date)
    }, [date, onDateChange])

    return (
        <div className='flex-col-container'>
            <strong>Transactions</strong>
            <div className='grid grid-cols-1 gap-4 bg-orange sm:grid-cols-2 xl:grid-cols-4'>
                {Object.values(TransactionsDirection)?.map(dir => {
                    if (dir === TransactionsDirection.OUT) return null
                    const dataByDirection = dataDirection?.find((data: IDataDirection) => data.direction === dir)
                    return (
                        <WrapSelect
                            key={dir}
                            selected={dir === direction}
                            handleSelect={() => setDirection(perv => perv === dir ? undefined : dir)}
                        >
                            <InfoBox
                                icon={{
                                    name: 'PieChart',
                                }}
                                title={dir}
                                value={convertCentsToEuro(dataByDirection?._sum?.total || 0)}
                                smallValue={directionSmallText(dir)}

                            />
                        </WrapSelect>
                    )
                })}
                <WrapSelect
                    selected={'out' === direction}
                    handleSelect={() => setDirection(perv => perv === TransactionsDirection.OUT ? undefined : TransactionsDirection.OUT)}
                >
                    <InfoBox
                        icon={{
                            name: 'PieChart',
                        }}
                        title='Out'
                        value={convertCentsToEuro(outData?.length > 0 ? outData[0]?._sum?.total : 0)}
                        smallValue={directionSmallText(TransactionsDirection.OUT)}

                    />
                </WrapSelect>
            </div>
            {
                direction &&
                <div className='flex-col-container p-4 bg-slate-100 dark:bg-slate-900'>
                    {renderDirectionDetails(direction)}
                </div>
            }
        </div >
    )
}