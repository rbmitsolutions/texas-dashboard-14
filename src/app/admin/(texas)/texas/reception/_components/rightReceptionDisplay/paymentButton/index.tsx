import { Dispatch, SetStateAction, useState } from "react"
import { UseMutateFunction } from "react-query"

//components
import { KeyPadDisplay } from "@/components/common/keyPadDisplay"
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { convertCentsToEuro } from "@/common/utils/convertToEuro"
import GiftcardPaymentButton from "./giftcardPayment"
import { Button } from "@/components/ui/button"

//interface
import { TableTransactionsType, TransactionsDirection, TransactionsMethod } from "@/common/types/company/transactions.interface"
import { IPOSTCompanyBody, IPOSTCompanyDataRerturn } from "@/hooks/company/IPostCompanyDataHooks.interface"
import { IGETRestaurantDataQuery } from "@/hooks/restaurant/IGetRestaurantDataHooks.interface"
import { ISocketMessage, SocketIoEvent } from "@/common/libs/socketIo/types"
import { IOrderController } from "@/common/types/restaurant/order.interface"
import { IGiftCards } from "@/common/types/restaurant/giftcard.interface"
import { ITable } from "@/common/types/restaurant/tables.interface"
import { IToken } from "@/common/types/auth/auth.interface"

interface PaymentButtonProps {
    orderController: IOrderController[]
    table: ITable
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

export default function PaymentButton({
    orderController,
    table,
    values,
    createTransaction,
    emit,
    user,
    giftCard
}: PaymentButtonProps) {
    const [toPay, setToPay] = useState<number>(values?.remaining)

    const onOpenChange = () => {
        setToPay(0)
    }

    const onValueChange = (number: number, remove?: boolean) => {
        if (remove) {
            setToPay(0)
            return
        }

        if (toPay?.toString().length === 5) {
            return
        }

        const value = toPay?.toString()?.toString().split('')
        const valueNumber = parseInt(value?.join('') + number)

        if (valueNumber > values?.remaining) {
            setToPay(values?.remaining)
            return
        }

        setToPay(valueNumber)
    }

    const handlePayByCardOrCash = async (type: TableTransactionsType, method: TransactionsMethod) => {
        await createTransaction(
            {
                transaction: {
                    one: {
                        total: toPay,
                        type,

                        valid_by: user?.name,
                        valid_by_id: user?.user_id,

                        client_id: table?.client_id || undefined,

                        payee: table?.client_name || 'Walk In',
                        payee_key: table?.id,

                        direction: TransactionsDirection.IN,
                        method,
                    }
                }
            },
            {
                onSuccess: async () => {
                    await emit({
                        event: SocketIoEvent.TABLE_PAYMENT,
                        message: table?.id
                    })
                    onOpenChange();
                },
            }
        );
    }

    return (
        <Sheet
            onOpenChange={onOpenChange}
        >
            <SheetTrigger asChild>
                <Button
                    className='h-14'
                    variant='green'
                    leftIcon="Banknote"
                    disabled={values?.remaining === 0}
                >
                    Pay
                </Button>
            </SheetTrigger>
            <SheetContent
                className="w-[400px] sm:w-[540px]"
            >
                <SheetHeader>
                    <SheetTitle>Total: {convertCentsToEuro(values?.total)}</SheetTitle>
                    <SheetTitle>Paid {convertCentsToEuro(values?.paid)}</SheetTitle>
                    <SheetTitle>Remaining: {convertCentsToEuro(values?.remaining)}</SheetTitle>
                </SheetHeader>
                <div className='flex-col-container overflow-auto scrollbar-thin'>
                    <KeyPadDisplay
                        displayValue={convertCentsToEuro(toPay || 0)}
                        onChange={onValueChange}
                    />
                </div>
                <SheetFooter
                    className="w-full"
                >
                    <div className='flex-col-container gap-4 w-full'>
                        <Button
                            className='h-20'
                            leftIcon="Banknote"
                            onClick={() => handlePayByCardOrCash(TableTransactionsType.OPEN_TABLE, TransactionsMethod.CARD)}
                            disabled={toPay < 0.01 ? true : false}
                            variant='purple'
                        >
                            Card - {convertCentsToEuro(toPay)}
                        </Button>
                        <GiftcardPaymentButton
                            value={toPay}
                            closeDrawer={onOpenChange}
                            createTransaction={createTransaction}
                            transactionInfo={{
                                payee: table?.client_name || 'Walk In',
                                payee_key: table?.id,
                                table_id: table?.id,
                                type: TableTransactionsType.OPEN_TABLE,
                                client_id: table?.client_id!
                            }}
                            emit={emit}
                            user={user}
                            giftCard={giftCard}
                        />
                        <Button
                            className='h-16'
                            leftIcon="Banknote"
                            onClick={() => handlePayByCardOrCash(TableTransactionsType.OPEN_TABLE, TransactionsMethod.CASH)}
                            disabled={toPay < 0.01 ? true : false}
                            variant='green'
                        >
                            Cash - {convertCentsToEuro(toPay)}
                        </Button>
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}