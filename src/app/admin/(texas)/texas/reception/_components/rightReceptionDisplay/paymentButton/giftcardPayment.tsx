import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { UseMutateFunction } from "react-query";

//components
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button";

//utils
import { convertCentsToEuro } from "@/common/utils/convertToEuro";

//interface
import { TransactionsDirection, TransactionsMethod, TransactionsType } from "@/common/types/company/transactions.interface";
import { IPOSTCompanyBody, IPOSTCompanyDataRerturn } from "@/hooks/company/IPostCompanyDataHooks.interface";
import { IGETRestaurantDataQuery } from "@/hooks/restaurant/IGetRestaurantDataHooks.interface";
import { IGiftCards } from "@/common/types/restaurant/giftcard.interface";
import { ISocketMessage, SocketIoEvent } from "@/common/libs/socketIo/types";
import { IToken } from "@/common/types/auth/auth.interface";
import ScanInput from "@/components/common/scanInput";

interface GiftcardPaymentButtonProps {
    value: number
    closeDrawer: () => void
    transactionInfo: {
        type: TransactionsType
        payee: string
        payee_key: string
        client_id?: string
        table_id: string
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

export default function GiftcardPaymentButton({
    value,
    closeDrawer,
    transactionInfo,
    createTransaction,
    emit,
    user,
    giftCard: card
}: GiftcardPaymentButtonProps) {
    const [giftCard, setGiftCard] = useState<IGiftCards | null>(null)
    const [code, setCode] = useState<string>('')

    const handlePayByCash = async () => {
        await createTransaction(
            {
                transaction: {
                    one: {
                        total: value,
                        type: transactionInfo?.type,

                        valid_by: user?.name,
                        valid_by_id: user?.user_id,

                        client_id: transactionInfo?.client_id || undefined,

                        payee: transactionInfo?.payee || 'Walk In',
                        payee_key: transactionInfo?.payee_key,

                        direction: TransactionsDirection.IN,
                        method: TransactionsMethod.CASH,
                    }
                }
            },
            {
                onSuccess: async () => {
                    await emit({
                        event: SocketIoEvent.TABLE_PAYMENT,
                        message: transactionInfo?.table_id
                    })
                    closeDrawer();
                },
            }
        );
    }

    useEffect(() => {
        if(code?.length === 16) {
            card?.setCardParams({
                giftcards: {
                    byCode: {
                        code
                    }
                }
            })
        }
    }, [code])

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    className='h-14'
                    leftIcon="Banknote"
                    disabled={value < 0.01 ? true : false}
                    variant='blue'
                >
                    Gift Card - {convertCentsToEuro(value)}
                </Button>
            </SheetTrigger>
            <SheetContent
                className="w-[400px] sm:w-[540px]"
                side='left'
            >
                <SheetHeader>
                </SheetHeader>
                <div className='flex-col-container overflow-auto scrollbar-thin'>
                    <ScanInput 
                        onSearchChange={value => setCode(value)}
                        value={code}
                        inputProps={{
                            maxLength: 16
                        }}
                    />
                    {card?.card && 
                        <div>
                            {card?.card?.value}
                            {card?.card?.spent}
                        </div>
                    }
                </div>
                <SheetFooter
                    className="w-full"
                >

                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}

