import { UseMutateFunction } from "react-query"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

//libs
import { convertCentsToEuro } from "@/common/utils/convertToEuro"
import { useState } from "react"

//components
import { OrderSummary } from "../../../../_components/orderSummary"
import AuthDialog from "@/components/common/authDialog"
import { Button } from "@/components/ui/button"
import ChangeTable from "./changeTable"
import LastOrders from "./lastOrders"

//interface
import { IGETMenuOrderSystemResponse } from "@/hooks/restaurant/IGetRestaurantDataHooks.interface"
import { ISection, ITable, TableMealStatus } from "@/common/types/restaurant/tables.interface"
import { IPOSTRestaurantBody, IPOSTRestaurantDataRerturn } from "@/hooks/restaurant/IPostRestaurantDataHooks.interface"
import { IPUTRestaurantBody } from "@/hooks/restaurant/IPutRestaurantDataHooks.interface"
import { IOrder, IOrderController } from "@/common/types/restaurant/order.interface"
import { hasOrdersWithOrderedStatus } from "@/common/libs/restaurant/order"
import { IPrinters } from "@/common/types/restaurant/printers.interface"
import { IToken, Permissions } from "@/common/types/auth/auth.interface"
import { IMenuSection } from "@/common/types/restaurant/menu.interface"
import { ICreateNewOrder } from "@/store/restaurant/order"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface RightOrderDisplayProps {
    order: ICreateNewOrder[]
    resetOrder: () => void
    updateOrderQuantity: (order: ICreateNewOrder, incrise: boolean) => void
    deleteOrder: (orderId: string) => void
    getOneOrderTotal: (order: ICreateNewOrder) => number
    getOrderTotal: (orders: ICreateNewOrder[]) => number
    menu: IGETMenuOrderSystemResponse[]
    replaceOrder: (order: ICreateNewOrder) => void
    table: ITable
    createOrder: UseMutateFunction<IPOSTRestaurantDataRerturn, any, IPOSTRestaurantBody, unknown>
    menuSections: IMenuSection[]
    orderControllers: IOrderController[]
    updateOrder: UseMutateFunction<any, any, IPUTRestaurantBody, unknown>
    printers: IPrinters[]
    sections: ISection[]
    updateTable: UseMutateFunction<any, any, IPUTRestaurantBody, unknown>
}

export default function RightOrderDisplay({ order, resetOrder, menu, getOrderTotal, updateOrderQuantity, getOneOrderTotal, deleteOrder, replaceOrder, table, createOrder, menuSections, orderControllers, updateOrder, printers, sections, updateTable }: RightOrderDisplayProps) {
    const [toPrint, setToPrint] = useState<boolean>(true)
    const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false)
    const { back } = useRouter()
    const [status, setStatus] = useState<TableMealStatus>()

    const toggleAuthDialog = () => {
        setIsAuthDialogOpen(!isAuthDialogOpen)
    }


    const handleAuthDialogResponse = async (token: IToken) => {
        if (token) {
            await handleCreateOrder(token, order);
        }
    }

    const handleCreateOrder = async (taken: IToken, order: ICreateNewOrder[]) => {
        const coordinates = hasOrdersWithOrderedStatus(order as IOrder[], menuSections)

        let meal_status: TableMealStatus = table?.meal_status

        if ((meal_status === TableMealStatus.DESSERT) && coordinates?.hasfood) {
            meal_status = TableMealStatus.MAIN
        }

        if (coordinates?.hasfood && !status) {
            if (meal_status === TableMealStatus.WAITING) {
                if (coordinates?.starters) {
                    meal_status = TableMealStatus.STARTERS
                }

                if (coordinates?.maincourse && !coordinates?.starters) {
                    meal_status = TableMealStatus.MAIN
                }
            }
        }

        if (status) {
            meal_status = status
        }

        if (table?.meal_status === TableMealStatus.PREPARING) {
            meal_status = TableMealStatus.PREPARING
        }

        await createOrder(
            {
                order: {
                    many: {
                        orders: order,
                        order_controller: {
                            waiter: taken?.name,
                            waiter_id: taken?.user_id,
                            client_id: table?.client_id as string || 'walk_in',
                            table_id: table?.id,
                        },
                        update_table: {
                            id: table?.id,
                            meal_status,
                            food_ordered_at: coordinates?.hasfood ? new Date() : undefined,
                        },
                        toPrint: toPrint ? '1' : undefined
                    }
                }
            },
            {
                onSuccess: async () => {
                    setToPrint(true)
                    resetOrder()
                    back()
                },
                onError: (err) => {
                    toast.error('Something went wrong')
                },
            }
        );
    }


    return (
        <>
            <AuthDialog
                isOpen={isAuthDialogOpen}
                toggleAuthDialog={toggleAuthDialog}
                handleAuthResponse={handleAuthDialogResponse}
                permissions={[Permissions.WAITERS]}
                save={false}
                titleDom={
                    <div className='m-auto'>
                        <Label
                            className='flex-container items-center bg-orange-300 p-2 bg-background-soft'
                        >
                            PRINT ORDER
                            <Switch
                                className='m-auto'
                                checked={toPrint}
                                onCheckedChange={(checked) => setToPrint(checked)}
                            />
                        </Label>
                    </div>
                }
            />

            <div className='flex-col-container h-full'>
                <div className='grid grid-cols-[auto,auto,auto] gap-2'>
                    <ChangeTable
                        sections={sections}
                        updateTable={updateTable}
                        table={table}
                    />
                    <LastOrders
                        ordersController={orderControllers}
                        menu={menu}
                        getOneOrderTotal={getOneOrderTotal}
                        menuSections={menuSections}
                        updateOrder={updateOrder}
                        printers={printers}
                    />
                    <Button
                        variant={status === TableMealStatus.ALL_TOGETHER ? 'orange' : 'outline'}
                        className='w-full h-12'
                        onClick={() => setStatus(prev => prev === TableMealStatus.ALL_TOGETHER ? undefined : TableMealStatus.ALL_TOGETHER)}
                    >
                        All Together
                    </Button>
                </div>
                <strong className='text-center'>Table: {table?.number}</strong>
                <div
                    id='order-summary-container'
                    className='flex-col-container justify-start direction-reverse h-full p-2 rounded-lg overflow-auto   scrollbar-thin -mt-2'>
                    <OrderSummary
                        order={order?.map(o => {
                            const menuItem = menu?.find(m => m.id === o.menu_id)
                            return {
                                ...o,
                                menu: menuItem?.title,
                                menu_id: menuItem?.id,
                                menu_short_title: menuItem?.short_title,
                            }
                        }) as unknown as IOrder[]}
                        updateOrder={{
                            deleteOrder,
                            updateOrderQuantity,
                            replaceOrder,
                            menu
                        }}
                        getOneOrderTotal={getOneOrderTotal}
                        menuSections={menuSections}
                    />
                </div>
                <Button
                    leftIcon="ShoppingCart"
                    className='h-14'
                    variant={order?.length === 0 ? 'destructive' : 'green'}
                    disabled={order?.length === 0}
                    onClick={() => toggleAuthDialog()}
                >
                    {convertCentsToEuro(getOrderTotal(order))}
                </Button>
            </div>
        </>
    )
}

