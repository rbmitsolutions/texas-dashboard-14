import { Area } from "recharts"

//libs
import { addDaysToDate, formatDate, getMonth, subDaysToDate } from "@/common/libs/date-fns/dateFormat"
import { convertCentsToEuro } from "@/common/utils/convertToEuro"
import Icon from "@/common/libs/lucida-icon"

//components
import LineChart, { ILineChartData } from "@/components/common/charts/lineChart"
import InfoBox from "@/components/common/infoBox"
import { Button } from "@/components/ui/button"

//hooks
import { useGETUserDataHooks } from "@/hooks/user/useUserDataHooks"

//interface
import { IUser } from "@/common/types/user/user.interface"
import { PayrollTransactionsType } from "@/common/types/company/transactions.interface"

interface UserAnalyticsProps {
    user: IUser
    isAdmin: boolean
}

interface YearlyAnalytics {
    month: number
    total: {
        type: string,
        _sum: {
            total: number
        }
    }[]
}

interface ITotalDataReturn {
    name: PayrollTransactionsType
    value: number
}

interface TotalByType {
    [type: string]: any;
}

export default function UserAnalytics({ user, isAdmin }: UserAnalyticsProps) {

    const {
        analytics: year,
        GETUserDataParams: yearParams,
        setGETUserDataParams: setYearParams,
    } = useGETUserDataHooks({
        query: 'ANALYTICS',
        defaultParams: {
            analytics: {
                transactions: {
                    year: new Date(),
                    filter: {
                        by: ['type'],
                        payee_key: user?.id
                    }
                }
            }
        }
    })

    const holidayTotal = (): number => {
        const totalPayRollPaid = year?.filter((item: YearlyAnalytics) => item?.total?.find((curr) => curr.type === 'payroll'))?.map((item: YearlyAnalytics) => item?.total?.find((curr) => curr.type === 'payroll')?._sum.total)?.reduce((acc: number, curr: YearlyAnalytics['month']) => acc + curr, 0) || 0

        return totalPayRollPaid * 0.08
    }


    const lineChart: ILineChartData[] = year?.map((item: YearlyAnalytics) => {
        const chartDataItem: ILineChartData = { name: getMonth(item?.month) };

        item?.total?.forEach((curr) => {
            chartDataItem[curr.type] = curr._sum.total / 100;
        });

        return chartDataItem;
    })

    const totalData = (yearlyAnalytics: YearlyAnalytics[]): ITotalDataReturn[] => {
        const totalByType: TotalByType = {};

        yearlyAnalytics?.forEach((yearlyData) => {
            yearlyData?.total?.forEach((monthlyData) => {
                const { type, _sum: { total } } = monthlyData;
                if (totalByType[type]) {
                    totalByType[type] += total;
                } else {
                    totalByType[type] = total;
                }
            });
        });

        if (!totalByType.hasOwnProperty('holiday')) {
            totalByType['holiday'] = 0;
        }

        const result = Object.keys(totalByType).map((type) => ({
            name: type as PayrollTransactionsType,
            value: (totalByType[type]),
        }));

        return result;
    }

    const data = totalData(year) || []
    return (
        <div className='flex-col-container gap-4 mt-4'>
            <div className='flex justify-end gap-4'>
                <Button
                    size='icon'
                    className='h-7 w-7'
                    onClick={() => setYearParams(prev => {
                        return {
                            ...prev,
                            analytics: {
                                transactions: {
                                    year: subDaysToDate(prev?.analytics?.transactions?.year!, 365),
                                    filter: {
                                        by: ['type'],
                                        payee_key: user?.id
                                    }
                                }
                            }
                        }
                    })}
                >
                    <Icon name='ChevronLeft' size={14} />
                </Button>
                <Button size='icon' variant='outline' className='h-8 min-w-16 text-xs'>
                    {formatDate({
                        date: yearParams?.analytics?.transactions?.year!,
                        f: 'yyy'
                    })}
                </Button>
                <Button
                    size='icon'
                    className='h-7 w-7'
                    onClick={() => setYearParams(prev => {
                        return {
                            ...prev,
                            analytics: {
                                transactions: {
                                    year: addDaysToDate(prev?.analytics?.transactions?.year!, 365),
                                    filter: {
                                        by: ['type'],
                                        payee_key: user?.id
                                    }
                                }
                            }
                        }
                    })}
                >
                    <Icon name='ChevronRight' size={14} />
                </Button>
            </div>
            <div className='h-80 lg:h-[500px]'>
                <LineChart
                    data={lineChart}
                >
                    <Area
                        type='monotone'
                        dataKey='payroll'
                        fill='#075af539'
                        stroke='#015cb1'
                    />
                    <Area
                        type='monotone'
                        dataKey='adjustment'
                        fill='#07f51337'
                        stroke='#01b110'
                    />
                    <Area
                        type='monotone'
                        dataKey='tips'
                        fill='#f58e0732'
                        stroke='#b19701'
                    />
                    <Area
                        type='monotone'
                        dataKey='holiday'
                        fill='#f9a8a830'
                        stroke='#f9a8a8'
                    />
                    <Area
                        type='monotone'
                        dataKey='bank holiday pay'
                        fill='#e107f52f'
                        stroke='#a201b1'
                    />
                </LineChart>
            </div>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6'>
                {Object.values(PayrollTransactionsType).map(type => {
                    const t = data.find((d) => d.name === type)

                    if (t) {
                        return <InfoBox
                            key={t?.name}
                            title={t?.name === 'holiday' ? 'Holiday Paid' : t?.name}
                            icon={{
                                name: 'DollarSign',
                            }}
                            value={convertCentsToEuro(t?.value)}
                        />
                    }
                })}
                <InfoBox
                    title='Holiday Due'
                    icon={{
                        name: 'DollarSign',
                    }}
                    value={convertCentsToEuro(holidayTotal())}
                    smallValue="8% of P. - Holiday"
                />
            </div>
        </div>
    )
}
