import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { UseMutateFunction } from "react-query";
import { cn } from "@/common/libs/shadcn/utils";
import Image from "next/image";

//libs
import { formatDate } from "@/common/libs/date-fns/dateFormat";

//components
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTrigger,
} from "@/components/ui/sheet"
import ScanInput from "@/components/common/scanInput";
import IconText from "@/components/common/iconText";
import { Button } from "@/components/ui/button";

//utils
import { convertCentsToEuro } from "@/common/utils/convertToEuro";

//hooks
import { useGETCompanyDataHooks } from "@/hooks/company/companyDataHooks";

//interface
import { TransactionsDirection, TransactionsMethod, TransactionsType } from "@/common/types/company/transactions.interface";
import { IPOSTCompanyBody, IPOSTCompanyDataRerturn } from "@/hooks/company/IPostCompanyDataHooks.interface";
import { IGETRestaurantDataQuery } from "@/hooks/restaurant/IGetRestaurantDataHooks.interface";
import { IGiftCards } from "@/common/types/restaurant/giftcard.interface";
import { ISocketMessage, SocketIoEvent } from "@/common/libs/socketIo/types";
import { IToken } from "@/common/types/auth/auth.interface";

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
    const [isOpen, setIsOpen] = useState(false)
    const [giftCard, setGiftCard] = useState<IGiftCards | undefined>(undefined)
    const [code, setCode] = useState<string>('')
    const giftCardBalance = (giftCard?.value || 0) - (giftCard?.spent || 0)

    const onOpenChange = () => {
        setGiftCard(undefined)
        setCode('')
        setIsOpen(!isOpen)
    }
    const {
        companyAllTransacations: transactions,
        refetchCompanyData: refetchTransactions
    } = useGETCompanyDataHooks({
        query: 'TRANSACTIONS',
        defaultParams: {
            transactions: {
                all: {
                    direction: {
                        in: [TransactionsDirection.VOUCHER]
                    },
                    gift_card_id: giftCard?.id,
                    pagination: {
                        skip: 0,
                        take: 500
                    }
                }
            }
        },
        UseQueryOptions: {
            enabled: giftCard !== undefined
        }
    })

    const handlePayByGiftCard = async () => {
        await createTransaction(
            {
                transaction: {
                    one: {
                        total: value,
                        type: transactionInfo?.type,
                        date: new Date(),

                        valid_by: user?.name,
                        valid_by_id: user?.user_id,

                        client_id: transactionInfo?.client_id || undefined,

                        payee: transactionInfo?.payee || 'Walk In',
                        payee_key: transactionInfo?.payee_key,

                        gift_card_id: giftCard?.id,

                        direction: TransactionsDirection.VOUCHER,
                        method: TransactionsMethod.GIFT_CARD,
                    }
                }
            },
            {
                onSuccess: async () => {
                    await emit({
                        event: SocketIoEvent.TABLE_PAYMENT,
                        message: transactionInfo?.table_id
                    })
                    refetchTransactions()
                    onOpenChange();
                    closeDrawer();
                },
            }
        );
    }

    useEffect(() => {
        if (code?.length === 16) {
            card?.setCardParams({
                giftcards: {
                    byCode: {
                        code
                    }
                }
            })
        }
    }, [code])

    useEffect(() => {
        if (card?.card) {
            setGiftCard(card?.card)
        }
    }, [card])

    return (
        <Sheet
            onOpenChange={onOpenChange}
            open={isOpen}
        >
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
                <SheetHeader
                    className='mt-6'
                >
                    <ScanInput
                        onSearchChange={value => {
                            if (value?.length < 16) {
                                setGiftCard(undefined)
                            }
                            setCode(value)
                        }}
                        debounceDelay={0}
                        value={code}
                        inputProps={{
                            maxLength: 16
                        }}
                        cleanSearch={() => {
                            setCode('')
                            setGiftCard(undefined)
                        }}
                    />
                </SheetHeader>
                <div className='flex-col-container mt-4 overflow-auto scrollbar-thin'>

                    {giftCard &&
                        <div className="flex-col-container bg-background-soft p-4 rounded-md">
                            <div className='flex items-center'>
                                <Image
                                    alt="Gift Card"
                                    src='/logo/bull-white.png'
                                    width={80}
                                    height={80}
                                    className='invert dark:invert-0'
                                />
                                <strong>Texas Steakout</strong>
                            </div>
                            <div className='grid grid-cols-2 gap-4'>
                                <div>
                                    <strong>From</strong>
                                    <IconText
                                        icon='User'
                                        text={`${giftCard?.name} ${giftCard?.last_name}` || 'N/A'}
                                    />
                                </div>
                                <div>
                                    <strong>To</strong>
                                    <IconText
                                        icon='User'
                                        text={`To ${giftCard?.name_to}` || 'N/A'}
                                    />
                                </div>
                            </div>
                            <IconText
                                icon='CreditCard'
                                text={giftCard?.code || 'N/A'}
                            />

                            {transactions?.data?.map(t => {
                                return (
                                    <div
                                        key={t?.id}
                                        className="flex justify-between gap-4 mt-4 p-2 bg-background-soft rounded-md"
                                    >
                                        <div className='space-y-1'>
                                            <IconText
                                                icon='Calendar'
                                                text={formatDate({
                                                    date: new Date(t?.date!),
                                                    f: 'LLL dd, yy'
                                                })}
                                            />
                                            <IconText
                                                icon="User"
                                                text={t?.valid_by || 'N/A'}
                                            />
                                        </div>
                                        {convertCentsToEuro(t?.total)}
                                    </div>
                                )
                            })}
                            <div className='flex flex-col gap-1'>
                                <strong>
                                    Balance
                                </strong>
                                <strong className={cn('text-2xl', giftCardBalance > 0 ? 'text-green-500 dark:text-green-600' : 'text-red-600')}>
                                    {convertCentsToEuro(giftCardBalance)}
                                </strong>
                            </div>
                        </div>
                    }
                </div>
                <SheetFooter
                    className="w-full"
                >
                    {giftCard &&
                        <Button
                            onClick={handlePayByGiftCard}
                            disabled={value < 0.01 ? true : false || !giftCard?.id ? true : false || giftCard?.status === 'spent'}
                            leftIcon="Banknote"
                            variant='blue'
                            className='w-full h-14'
                        >
                            Pay - {convertCentsToEuro(giftCardBalance > value ? value : giftCardBalance)}
                        </Button>
                    }
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}

