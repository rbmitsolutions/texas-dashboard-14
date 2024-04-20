'use client'
import { useEffect, useState } from "react"

//components
import { BasicTable } from "@/components/common/basicTable"
import Wrap from "@/components/common/wrap"

//hooks
import { useGETStockDataHooks } from "@/hooks/stock/stockDataHooks"
import { useAuthHooks } from "@/hooks/useAuthHooks"
import { isUserAuthorized } from "@/common/libs/user/isUserAuthorized"
import { Permissions } from "@/common/types/auth/auth.interface"
import StockOrderAuthorizedTable from "./_components/stockOrderAuthorizedTable"


export default function StockOrderControllerPage({ params }: { params: { id: string } }) {
    const [isAuthorized, setIsAuthorized] = useState<boolean>(false)
    const { user } = useAuthHooks()
    const {
        stockOrderController: ordersController,
        GETStockDataParams: ordersControllerParams,
        setGETStockDataParams: setOrdersControllerParams,
    } = useGETStockDataHooks({
        query: 'ORDER_CONTROLLER',
        defaultParams: {
            order_controller: {
                byId: {
                    id: params.id,
                    include: {
                        orders: '1',
                        supplier: '1',
                    }
                }
            }
        },
        UseQueryOptions: {
            enabled: !!params.id
        }
    })

    useEffect(() => {
        if (user) {
            setIsAuthorized(isUserAuthorized(user, [Permissions.ADMIN, Permissions.STOCK_MANAGER]))
        }
    }, [user])

    return (
        <div className='flex-col-container items-center'>
            <h3 className='text-2xl font-bold'>{ordersController?.supplier?.title}</h3>

            {isAuthorized ?
                <div className='bg-orange-500 w-full'>
                    <StockOrderAuthorizedTable 
                        orders={ordersController?.orders || []}
                        supplier={ordersController?.supplier || {}}
                    />
                </div>
                :
                'not adming'
            }
        </div>
    )
}