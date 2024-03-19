import { useState } from "react"
import { UseMutateFunction } from "react-query"

//components
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { convertCentsToEuro } from "@/common/utils/convertToEuro"
import { KeyPadDisplay } from "@/components/common/keyPadDisplay"
import GiftcardPaymentButton from "./giftcardPayment"
import { Button } from "@/components/ui/button"

//sotre
import { usePrintersStore } from "@/store/restaurant/printers"

//interface
import { TableTransactionsType, TransactionsDirection, TransactionsMethod } from "@/common/types/company/transactions.interface"
import { IPOSTCompanyBody, IPOSTCompanyDataRerturn, IPOSTTransaction } from "@/hooks/company/IPostCompanyDataHooks.interface"
import { usePOSTRestaurantDataHooks } from "@/hooks/restaurant/restaurantDataHooks"
import { IToken } from "@/common/types/auth/auth.interface"
import { IDataTable } from "../../../[id]/page"

interface PaymentButtonProps {
    dataTable: IDataTable
    payTotal?: number
    payPartial?: number
    createTransaction: UseMutateFunction<IPOSTCompanyDataRerturn, any, IPOSTCompanyBody, unknown>
    user: IToken
    onSuccessfulPayment?: () => void
    closeTable: () => {}
}

export interface IHandlePayment {
    method: TransactionsMethod
    direction: TransactionsDirection
    giftCard?: {
        id: string
        toPay: number
    }
}

export default function PaymentButton({
    dataTable,
    payTotal,
    payPartial,
    createTransaction,
    user,
    onSuccessfulPayment,
    closeTable
}: PaymentButtonProps) {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [toPay, setToPay] = useState<number>(payTotal || payPartial || 0)
    const { defaultPrinter } = usePrintersStore()
    const {
        createRestaurantData: toPrint
    } = usePOSTRestaurantDataHooks({
        query: 'TO_PRINT',
    })

    const onValueChange = (number: number, remove?: boolean) => {
        if (remove) {
            if (payPartial) {
                setToPay(payPartial)
                return
            }
            setToPay(0)
            return
        }

        if (toPay?.toString().length === 5) {
            return
        }

        const value = toPay?.toString()?.toString().split('')
        const valueNumber = parseInt(value?.join('') + number)

        setToPay(valueNumber)
    }

    const onOpenChange = () => {
        setToPay(payTotal || payPartial || 0)
        setIsOpen(!isOpen)
    }


    const handlePayment = async ({
        method,
        direction,
        giftCard
    }: IHandlePayment
    ) => {
        setIsLoading(true)
        let ordersToUpdate: { id: string, paid: number }[] = []

        if (toPay >= (dataTable?.values?.total - dataTable?.values?.paid) || payPartial) {
            ordersToUpdate = dataTable?.orders?.unpaid?.map(o => {
                return {
                    id: o?.id,
                    paid: o?.paid
                }
            }) || []
        }

        if (giftCard) {
            if (giftCard.toPay < toPay) {
                ordersToUpdate = []
            }
        }

        const total = giftCard?.toPay ? giftCard.toPay : toPay

        let transactions: IPOSTTransaction[] = []
        let remaining = dataTable?.values?.remaining > 0 ? dataTable?.values?.remaining : 0
        let tip = total - remaining

        if (tip > 0) {
            transactions.push({
                total: tip,
                type: TableTransactionsType.OPEN_TABLE,
                date: new Date(),

                valid_by: user?.name,
                valid_by_id: user?.user_id,

                client_id: dataTable?.table?.client_id || undefined,

                payee: dataTable?.table?.client_name || 'Walk In',
                payee_key: dataTable?.table?.id,

                direction: TransactionsDirection.TIP,
                method,
            })
        }

        if (total > remaining && remaining > 0) {
            transactions.push({
                total: remaining,
                type: TableTransactionsType.OPEN_TABLE,
                date: new Date(),

                valid_by: user?.name,
                valid_by_id: user?.user_id,

                client_id: dataTable?.table?.client_id || undefined,

                payee: dataTable?.table?.client_name || 'Walk In',
                payee_key: dataTable?.table?.id,

                gift_card_id: giftCard?.id || undefined,

                direction,
                method,
                orders: ordersToUpdate
            })
        } else if (total <= remaining) {
            transactions.push({
                total,
                type: TableTransactionsType.OPEN_TABLE,
                date: new Date(),

                valid_by: user?.name,
                valid_by_id: user?.user_id,

                client_id: dataTable?.table?.client_id || undefined,

                payee: dataTable?.table?.client_name || 'Walk In',
                payee_key: dataTable?.table?.id,

                gift_card_id: giftCard?.id || undefined,

                direction,
                method,
                orders: ordersToUpdate
            })
        }

        await createTransaction(
            {
                transaction: {
                    many: transactions
                }
            },
            {
                onSuccess: async () => {
                    if (defaultPrinter) {
                        await toPrint({
                            toPrint: {
                                bill: {
                                    ip: defaultPrinter?.ip,
                                    tableId: dataTable?.table?.id!
                                }
                            }
                        })
                    }
                    if (total >= remaining) {
                        await closeTable()
                    }
                    onSuccessfulPayment && onSuccessfulPayment()
                    onOpenChange();

                },
                onSettled: () => {
                    setIsLoading(false)
                }

            },
        );
    }

    return (
        <Sheet
            open={isOpen}
            onOpenChange={onOpenChange}
        >
            <SheetTrigger asChild>
                {payPartial ?
                    <Button
                        className='h-14'
                        variant='blue'
                        leftIcon="Banknote"
                        onClick={onOpenChange}
                        disabled={payPartial === 0}
                    >
                        {convertCentsToEuro(payPartial)}
                    </Button>
                    :
                    payTotal ?
                        <Button
                            className='h-14'
                            variant='green'
                            leftIcon="Banknote"
                            onClick={onOpenChange}
                            disabled={payTotal === 0}
                        >
                            {convertCentsToEuro(payTotal)}
                        </Button>
                        :
                        <Button
                            className='h-14'
                            variant='yellow'
                            leftIcon="Banknote"
                            onClick={onOpenChange}
                        >
                            Tip
                        </Button>
                }

            </SheetTrigger>
            <SheetContent
                className="grid grid-rows-[auto,1fr,auto] w-[400px] sm:w-[540px]"
            >
                <SheetHeader>
                    <SheetTitle>Total: {convertCentsToEuro(dataTable?.values?.total || 0)}</SheetTitle>
                    <SheetTitle>Paid {convertCentsToEuro(dataTable?.values?.paid || 0)}</SheetTitle>
                </SheetHeader>
                <div className='flex-col-container overflow-auto scrollbar-thin bg-background-soft p-2 rounded-lg'>
                    <KeyPadDisplay
                        displayValue={convertCentsToEuro(toPay || 0)}
                        onChange={onValueChange}
                        isDisabled={payPartial ? true : false}
                    />
                    <div className='grid grid-cols-3 gap-2'>
                        <Button
                            variant='outline'
                            className='h-14'
                            onClick={() => setToPay(Number(((payTotal || 0) / (dataTable?.table?.guests || 2)).toFixed(0)))}
                            disabled={payTotal ? false : true}
                        >
                            {dataTable?.table?.guests} Guests
                        </Button>
                        <Button
                            variant='outline'
                            className='h-14'
                            onClick={() => setToPay((payTotal || 0) / 2)}
                            disabled={payTotal ? false : true}
                        >
                            50%
                        </Button>
                        <Button
                            variant='outline'
                            className='h-14'
                            onClick={() => setToPay((payTotal || 0))}
                            disabled={payTotal ? false : true}
                        >
                            Total
                        </Button>
                    </div>
                </div>
                <SheetFooter

                >
                    <div className='flex-col-container w-full'>
                        <Button
                            leftIcon="Banknote"
                            onClick={() => handlePayment({
                                method: TransactionsMethod.CARD,
                                direction: TransactionsDirection.IN,
                            })}
                            disabled={isLoading ? true : toPay < 0.01 ? true : false}
                            variant='purple'
                            className='h-20'
                        >
                            Card
                        </Button>
                        <div className='grid grid-cols-2 gap-2'>
                            <GiftcardPaymentButton
                                handlePayment={handlePayment}
                                toPay={toPay}
                            />
                            <Button
                                leftIcon="Banknote"
                                onClick={() => handlePayment({
                                    method: TransactionsMethod.CASH,
                                    direction: TransactionsDirection.IN
                                })}
                                disabled={isLoading ? true : toPay < 0.01 ? true : false}
                                variant='green'
                                className='h-14'
                            >
                                Cash
                            </Button>
                        </div>
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet >
    )
}