import { UseMutateFunction } from "react-query"
import { useState } from "react"

//libs
import { getOrderStatusVariant } from "@/common/libs/restaurant/order"

//components
import FullOrderController from "../../../_components/orderSummary/fullOrderController"
import SplitBillPaymentButton from "./splitBillPaymentButton"
import { Button } from "@/components/ui/button"
import PaymentButton from "./paymentButton"
import PrintBill from "./printBillButton"

//interface
import { IPOSTCompanyBody, IPOSTCompanyDataRerturn } from "@/hooks/company/IPostCompanyDataHooks.interface"
import { IOrderController, OrderStatus } from "@/common/types/restaurant/order.interface"
import { IPUTRestaurantBody } from "@/hooks/restaurant/IPutRestaurantDataHooks.interface"
import { OrderControllerFilterProps } from "@/store/restaurant/orderController"
import { IPrinters } from "@/common/types/restaurant/printers.interface"
import { IMenuSection } from "@/common/types/restaurant/menu.interface"
import { IToken } from "@/common/types/auth/auth.interface"
import { ICreateNewOrder } from "@/store/restaurant/order"
import { IDataTable } from "../../[id]/page"

interface RightReceptionDisplayProps {
    dataTable: IDataTable
    getOrderControllers: (filter: OrderControllerFilterProps) => IOrderController[]
    getOneOrderTotal: (order: ICreateNewOrder) => number
    menuSections: IMenuSection[]
    createTransaction: UseMutateFunction<IPOSTCompanyDataRerturn, any, IPOSTCompanyBody, unknown>
    user: IToken
    updateOrder: UseMutateFunction<any, any, IPUTRestaurantBody, unknown>
    printers: IPrinters[]
    closeTable: () => {}
}

export default function RightReceptionDisplay({
    dataTable,
    getOrderControllers,
    getOneOrderTotal,
    menuSections,
    createTransaction,
    user,
    updateOrder,
    printers,
    closeTable
}: RightReceptionDisplayProps) {
    const [status, setStatus] = useState<OrderStatus[]>([OrderStatus.ORDERED, OrderStatus.DELIVERED])

    const filteredOrderController = getOrderControllers({
        table_id: dataTable?.table?.id!,
        orders: {
            status
        }
    })

    return (
        <div className='flex-col-container justify-between h-full scrollbar-thin overflow-auto'>
            <div className='flex-container items-center justify-between'>
                <strong>Table {dataTable?.table?.number}</strong>
                <PrintBill
                    tableId={dataTable?.table?.id!}
                />
            </div>
            <div className='grid grid-cols-5 gap-2 pb-2'>
                {Object.values(OrderStatus).map(s => {
                    return (
                        <Button
                            key={s}
                            variant={status?.includes(s) ? getOrderStatusVariant(s) : 'outline'}
                            className='capitalize text-[10px]'
                            onClick={() => {
                                if (status?.includes(s)) {
                                    setStatus(status?.filter(st => st !== s))
                                } else {
                                    setStatus([...status, s])
                                }
                            }}
                        >
                            {s}
                        </Button>
                    )
                })}
            </div>
            <div className='flex-col-container gap-4 justify-start h-full p-2 rounded-lg overflow-auto scrollbar-thin -mt-2'>
                {filteredOrderController?.length === 0 && (
                    <div className='flex-col-container justify-center items-center h-full'>
                        <p>No orders</p>
                    </div>
                )}
                {filteredOrderController?.map(oc => {
                    return (
                        <FullOrderController
                            key={oc?.id}
                            orderController={oc}
                            orderSumary={{
                                menuSections,
                                getOneOrderTotal,
                                order: oc?.orders,
                                updateOrderStatus: {
                                    onUpdate: updateOrder,
                                }
                            }}
                            onOrdersUpdate={updateOrder}
                            printers={printers}
                        />
                    )
                })}
            </div>
            <div className='grid grid-cols-2 gap-4'>
                <SplitBillPaymentButton
                    dataTable={dataTable}
                    menuSections={menuSections}
                    getOneOrderTotal={getOneOrderTotal}
                    createTransaction={createTransaction}
                    user={user}
                    closeTable={closeTable}
                />
                <PaymentButton
                    dataTable={dataTable}
                    payTotal={dataTable?.values?.remaining}
                    createTransaction={createTransaction}
                    user={user}
                    closeTable={closeTable}
                />
            </div>
        </div>
    )
}