import { UseMutateFunction } from "react-query"
import { Dispatch, SetStateAction } from "react"

//libs
import { formatDate } from "@/common/libs/date-fns/dateFormat"

//components
import { OrderSummary } from "../../../_components/orderSummary"
import PaymentButton from "./paymentButton"

//interface
import { IPOSTCompanyBody, IPOSTCompanyDataRerturn } from "@/hooks/company/IPostCompanyDataHooks.interface"
import { IGETRestaurantDataQuery } from "@/hooks/restaurant/IGetRestaurantDataHooks.interface"
import { IGiftCards } from "@/common/types/restaurant/giftcard.interface"
import { IOrderController } from "@/common/types/restaurant/order.interface"
import { IMenuSection } from "@/common/types/restaurant/menu.interface"
import { ITable } from "@/common/types/restaurant/tables.interface"
import { ISocketMessage } from "@/common/libs/socketIo/types"
import { ICreateNewOrder } from "@/store/texas/order"
import { IToken } from "@/common/types/auth/auth.interface"

interface RightReceptionDisplayProps {
    orderController: IOrderController[]
    table: ITable
    getOneOrderTotal: (order: ICreateNewOrder) => number
    sections: IMenuSection[]
    values: {
        total: number
        paid: number
        remaining: number
    }
    createTransaction: UseMutateFunction<IPOSTCompanyDataRerturn, any, IPOSTCompanyBody, unknown>
    emit: (message: ISocketMessage) => void
    user: IToken
    giftCard: {
        card: IGiftCards | null,
        setCardParams: Dispatch<SetStateAction<IGETRestaurantDataQuery>>
        getCardParams: IGETRestaurantDataQuery
    }
}

export default function RightReceptionDisplay({ orderController, table, getOneOrderTotal, sections, values, createTransaction, emit, user, giftCard}: RightReceptionDisplayProps) {

    return (
        <div className='flex-col-container justify-between h-full scrollbar-thin overflow-auto'>
            <div className='flex-col-container gap-4 justify-start h-full p-2 rounded-lg overflow-auto scrollbar-thin -mt-2'>
                {orderController?.map(oc => {
                    return (
                        <div
                            key={oc?.id}
                            className='p-3 rounded-lg bg-background-soft'
                        >
                            <div className='flex items-center justify-between mb-2'>
                                <div>
                                    <small className="line-clamp-1">{oc?.waiter}</small>
                                    <small className="text-end">{formatDate({
                                        date: oc?.created_at,
                                        f: 'HH:mm:ss'
                                    })}</small>
                                </div>

                                <div className="bg-primary w-16 p-1 rounded-xl text-center">
                                    <small>
                                        {oc?.number}
                                    </small>
                                </div>
                            </div>

                            {OrderSummary({
                                order: oc?.orders || [],
                                getOneOrderTotal,
                                sections
                            })}
                        </div>
                    )
                })}
            </div>
            <PaymentButton
                orderController={orderController}
                table={table}
                values={values}
                createTransaction={createTransaction}
                emit={emit}
                user={user}
                giftCard={giftCard}
            />
        </div>
    )
}