'use client'
import { Dispatch, SetStateAction, useState } from "react"
import { UseMutateFunction } from "react-query"

//components
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from "@/components/ui/dialog"
import FullOrderController from "../../../../_components/orderSummary/fullOrderController"
import { OrderSummary } from "../../../../_components/orderSummary"
import { Button } from "@/components/ui/button"
import PaymentButton from "../paymentButton"

//interface
import { IPOSTCompanyBody, IPOSTCompanyDataRerturn } from "@/hooks/company/IPostCompanyDataHooks.interface"
import { IGETRestaurantDataQuery } from "@/hooks/restaurant/IGetRestaurantDataHooks.interface"
import { IOrder, IOrderController } from "@/common/types/restaurant/order.interface"
import { IGiftCards } from "@/common/types/restaurant/giftcard.interface"
import { IMenuSection } from "@/common/types/restaurant/menu.interface"
import { ITable } from "@/common/types/restaurant/tables.interface"
import { ISocketMessage } from "@/common/libs/socketIo/types"
import { IToken } from "@/common/types/auth/auth.interface"
import { ICreateNewOrder } from "@/store/restaurant/order"
import { IDataTable } from "../../../[id]/page"

interface SplitBillPaymentButtonButtonProps {
    dataTable: IDataTable
    menuSections: IMenuSection[]
    getOneOrderTotal: (order: ICreateNewOrder) => number
    createTransaction: UseMutateFunction<IPOSTCompanyDataRerturn, any, IPOSTCompanyBody, unknown>
    emit: (message: ISocketMessage) => void
    user: IToken
}

export default function SplitBillPaymentButton({
    dataTable,
    menuSections,
    getOneOrderTotal,
    createTransaction,
    emit,
    user,
}: SplitBillPaymentButtonButtonProps) {
    const [orders, setOrders] = useState<IOrder[]>([])

    const onOpenChange = () => {
        setOrders([])
    }

    const handleAddToBill = (order: IOrder) => {
        const isOrderIn = orders?.find(o => o?.id === order?.id)

        if (isOrderIn) {
            if (isOrderIn?.quantity < order?.quantity) {
                setOrders(prev => prev.map(o => {
                    if (o?.id === order?.id) {
                        return {
                            ...o,
                            quantity: o?.quantity + 1,
                            paid: o?.paid + 1
                        }
                    }
                    return o
                }))
            } else {
                return
            }
        } else {
            setOrders(prev => [...prev, {
                ...order,
                quantity: 1,
                paid: 1
            }])
        }

    }
    const handleRemoveFromBill = (orderId: string) => {
        const order = orders?.find(o => o?.id === orderId)

        if (!order) return

        if (order?.quantity > 1) {
            setOrders(prev => prev.map(o => {
                if (o?.id === orderId) {
                    return {
                        ...o,
                        quantity: o?.quantity - 1,
                        paid: o?.paid - 1
                    }
                }
                return o
            }))
        } else {
            setOrders(prev => prev.filter(o => o?.id !== orderId))
        }
    }

    return (
        <Dialog
            onOpenChange={onOpenChange}
        >
            <DialogTrigger asChild>
                <Button
                    className='h-14'
                    variant='blue'
                    leftIcon="Banknote"
                    disabled={dataTable?.values?.remaining === 0}
                >
                    Parcial
                </Button>
            </DialogTrigger>
            <DialogContent
                className="grid grid-rows-[auto,1fr,auto] h-[90vh] max-w-[70vw]"
            >
                <DialogHeader>
                    Split Bill
                </DialogHeader>
                <div className='grid grid-cols-2 gap-8 min-h-full overflow-auto'>
                    <div className='flex-col-container overflow-auto scrollbar-thin p-4'>
                        {dataTable?.orderControllers?.unpaid?.map(oc => {
                            const filteredOrders = oc?.orders?.filter(o => {
                                const order = orders?.find(or => or?.id === o?.id)
                                if (order?.quantity === (o?.quantity - o?.paid)) {
                                    return false
                                }
                                return true
                            })

                            return (
                                <FullOrderController
                                    key={oc?.id}
                                    orderController={oc}
                                    orderSumary={{
                                        order: filteredOrders || [],
                                        getOneOrderTotal,
                                        menuSections,
                                        splitBill: {
                                            handleAddToBill
                                        }
                                    }}
                                />
                            )
                        })}
                    </div>
                    <div className='flex-col-container overflow-auto scrollbar-thin bg-background-soft p-4 rounded-lg'>
                        <OrderSummary
                            order={orders || []}
                            getOneOrderTotal={getOneOrderTotal}
                            menuSections={menuSections}
                            splitBill={{
                                handleRemoveFromBill
                            }}
                        />
                    </div>
                </div>
                <DialogFooter
                    className="w-full"
                >
                    <PaymentButton
                        dataTable={{
                            ...dataTable,
                            orders: {
                                unpaid: orders
                            }
                        }}
                        payPartial={orders?.map(o => getOneOrderTotal({
                            ...o,
                            paid: 0
                        })).reduce((a, b) => a + b, 0)}
                        createTransaction={createTransaction}
                        user={user}
                        getOneOrderTotal={getOneOrderTotal}
                        menuSections={menuSections}
                        onSuccessfulPayment={onOpenChange}
                        //todo: remove it
                        payTotal={0}
                    />
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}