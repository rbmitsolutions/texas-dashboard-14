'use client'
import { useCallback, useEffect, useState } from "react"

//libs
import { convertCentsToEuro } from "@/common/utils/convertToEuro"

//components
import OrdersControllerTable from "@/app/admin/(dashboard)/stock/_components/ordersControllerTable/ordersControllerTable"
import PayrollOutAnalytics from "./payrollOutAnalytics"
import InfoBox from "@/components/common/infoBox"
import WrapSelect from "../../wrapSelect"

//interface
import { PayrollTransactionsType } from "@/common/types/company/transactions.interface"

//hooks
import { useDELETEStockDataHooks, useGETStockDataHooks, usePUTStockDataHooks } from "@/hooks/stock/stockDataHooks"

interface OutAnalyticsProps {
    date: {
        from: Date
        to: Date
    }
    totals: {
        payroll: number
        orders: number
    }
}

type IOptions = 'payroll' | 'orders'

export default function OutAnalytics({ date, totals }: OutAnalyticsProps) {
    const [selected, setSelected] = useState<IOptions | undefined>(undefined)

    const {
        stockAllOrderController: ordersController,
        GETStockDataParams: ordersControllerParams,
        setGETStockDataParams: setOrdersControllerParams,
        refetchStockData: toRefetchOrderController
    } = useGETStockDataHooks({
        query: 'ORDER_CONTROLLER',
        defaultParams: {
            order_controller: {
                all: {
                    pagination: {
                        skip: 0,
                        take: 20
                    },
                    include: {
                        orders: '1',
                        supplier: '1',
                    },
                    date: {
                        gte: date?.from,
                        lte: date?.to
                    }
                }
            }
        },
    })

    const {
        updateStockData: updateOrderController
    } = usePUTStockDataHooks({
        query: 'ORDER_CONTROLLER',
        toRefetch: toRefetchOrderController
    })

    const {
        deleteStockData: deleteOrderController
    } = useDELETEStockDataHooks({
        query: 'ORDER_CONTROLLER',
        toRefetch: toRefetchOrderController

    })

    const onDateChange = useCallback((date: { from: Date, to: Date }) => {
        setOrdersControllerParams(prev => ({
            order_controller: {
                all: {
                    ...prev?.order_controller?.all,
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
    }, [setOrdersControllerParams]);

    const renderOption = (option: IOptions) => {
        switch (option) {
            case 'payroll':
                return <PayrollOutAnalytics date={date} />
            case 'orders':
                return <OrdersControllerTable
                    ordersController={ordersController}
                    setOrdersControllerParams={setOrdersControllerParams}
                    ordersControllerParams={ordersControllerParams}
                    updateOrderController={updateOrderController}
                    deleteOrderController={deleteOrderController}
                />
            default:
                return null
        }
    }

    useEffect(() => {
        onDateChange(date)
    }, [onDateChange, date])

    return (
        <div className='flex-col-container gap-8'>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
                <WrapSelect
                    selected={selected === 'payroll'}
                    handleSelect={() => setSelected(selected === 'payroll' ? undefined : 'payroll')}
                >
                    <InfoBox
                        icon={{
                            name: 'Euro',
                        }}
                        title='Payroll'
                        value={convertCentsToEuro(totals?.payroll || 0)}
                    />
                </WrapSelect>
                <WrapSelect
                    selected={selected === 'orders'}
                    handleSelect={() => setSelected(selected === 'orders' ? undefined : 'orders')}
                >
                    <InfoBox
                        icon={{
                            name: 'Euro',
                        }}
                        title='Stock Orders'
                        value={convertCentsToEuro(totals?.orders || 0)}
                    />
                </WrapSelect>
            </div>
            {selected && renderOption(selected)}
        </div>
    )
}