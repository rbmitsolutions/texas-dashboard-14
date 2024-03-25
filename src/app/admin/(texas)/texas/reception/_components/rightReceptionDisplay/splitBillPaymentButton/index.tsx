'use client'
import { useState } from "react"
import { UseMutateFunction } from "react-query"

//libs
import { getOrderTotal } from "@/common/libs/restaurant/order"

//components
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from "@/components/ui/dialog"
import FullOrderController from "../../../../_components/orderSummary/fullOrderController"
import { OrderSummary } from "../../../../_components/orderSummary"
import { Button } from "@/components/ui/button"
import PaymentButton from "../paymentButton"

//interface
import { IPOSTCompanyBody, IPOSTCompanyDataRerturn } from "@/hooks/company/IPostCompanyDataHooks.interface"
import { IMenuSection } from "@/common/types/restaurant/menu.interface"
import { IOrder, OrderStatus } from "@/common/types/restaurant/order.interface"
import { IToken } from "@/common/types/auth/auth.interface"
import { IDataTable } from "../../../[id]/page"

interface SplitBillPaymentButtonButtonProps {
    dataTable: IDataTable
    menuSections: IMenuSection[]
    createTransaction: UseMutateFunction<IPOSTCompanyDataRerturn, any, IPOSTCompanyBody, unknown>
    user: IToken
    closeTable: () => {}
    remaining: number
}

export default function SplitBillPaymentButton({
    dataTable,
    menuSections,
    createTransaction,
    user,
    closeTable,
    remaining
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
                >
                    Split Bill
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
                        {dataTable?.orderControllers?.map(oc => {
                            const filteredOrders = oc?.orders?.filter(o => {
                                const order = orders?.find(or => or?.id === o?.id)
                                if (order?.quantity === (o?.quantity - o?.paid) || o?.status === OrderStatus.CANCELLED || o?.status === OrderStatus.RETURNED || o?.status === OrderStatus.PAID) {
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
                            orderControllers: dataTable?.orderControllers?.map(oc => {
                                return {
                                    ...oc,
                                    orders: oc?.orders?.map(o => {
                                        const order = orders?.find(or => or?.id === o?.id)
                                        if (order) {
                                            return {
                                                ...o,
                                                paid: order?.paid
                                            }
                                        }
                                        return o
                                    })
                                }
                            })
                        }}
                        remaining={remaining}
                        payPartial={orders?.map(o => getOrderTotal({
                            ...o,
                            paid: 0
                        })).reduce((a, b) => a + b, 0)}
                        createTransaction={createTransaction}
                        user={user}
                        onSuccessfulPayment={onOpenChange}
                        closeTable={closeTable}
                    />
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}