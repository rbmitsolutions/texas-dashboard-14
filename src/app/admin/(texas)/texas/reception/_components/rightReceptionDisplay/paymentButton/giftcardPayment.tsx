import React, { useEffect, useState } from "react";
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
import InfoBadge from "@/components/common/infoBadge";
import ScanInput from "@/components/common/scanInput";
import IconText from "@/components/common/iconText";
import { Button } from "@/components/ui/button";

//utils
import { convertCentsToEuro } from "@/common/utils/convertToEuro";

//hooks
import { useGETRestaurantDataHooks } from "@/hooks/restaurant/restaurantDataHooks";
import { useGETCompanyDataHooks } from "@/hooks/company/companyDataHooks";

//interface
import { TransactionsDirection, TransactionsMethod, TransactionsType } from "@/common/types/company/transactions.interface";
import { IGiftCards } from "@/common/types/restaurant/giftcard.interface";
import { IHandlePayment } from ".";

interface GiftcardPaymentButtonProps {
    handlePayment: (data: IHandlePayment) => void
    toPay: number
}

export default function GiftcardPaymentButton({
    handlePayment,
    toPay,
}: GiftcardPaymentButtonProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [giftCard, setGiftCard] = useState<IGiftCards | undefined>(undefined)
    const [code, setCode] = useState<string>('')
    const [giftCardBalance, setGiftCardBalance] = useState<number>(0)

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

    const {
        setGETRestaurantDataParams: setGiftCardParams,
        GETRestaurantDataParams: getGiftCardParams
    } = useGETRestaurantDataHooks({
        query: 'GIFTCARD',
        defaultParams: {
            giftcards: {
                byCode: {
                    code: ''
                }
            }
        },
        UseQueryOptions: {
            refetchOnWindowFocus: false,
            refetchIntervalInBackground: false,
            refetchOnMount: false,
            keepPreviousData: false,

            onSuccess: (data) => {
                const card = data as IGiftCards
                if (card) {
                    setGiftCard(card)
                    setGiftCardBalance(card.value - card.spent)
                }
            }
        }
    })

    const onOpenChange = () => {
        setGiftCard(undefined)
        setCode('')
        setIsOpen(!isOpen)
    }

    const onPayment = async () => {
        if (!giftCard) return
        try {
            await handlePayment({
                method: TransactionsMethod.GIFT_CARD,
                direction: TransactionsDirection.VOUCHER,
                giftCard: {
                    id: giftCard?.id,
                    toPay: giftCardBalance > toPay ? toPay : giftCardBalance
                },
            })
            refetchTransactions()
            onOpenChange()
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        if (code?.length === 16) {
            setGiftCardParams({
                giftcards: {
                    byCode: {
                        code
                    }
                }
            })
        }
    }, [code, setGiftCardParams])

    return (
        <Sheet
            onOpenChange={onOpenChange}
            open={isOpen}
        >
            <SheetTrigger asChild>
                <Button
                    leftIcon="Banknote"
                    disabled={toPay < 0.01 ? true : false}
                    variant='blue'
                    className='h-14'

                >
                    Gift Card
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
                    {giftCard &&
                        <div className='flex-col-container pt-4'>
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
                        </div>
                    }
                </SheetHeader>
                <div className='flex-col-container mt-4 overflow-auto scrollbar-thin'>
                    {giftCard &&
                        <div className="flex-col-container bg-background-soft p-4 rounded-md">
                            {transactions?.data?.length === 0 &&
                                <div className='flex justify-center'>
                                    <strong>No transactions</strong>
                                </div>
                            }
                            {transactions?.data?.map(t => {
                                return (
                                    <div
                                        key={t?.id}
                                        className="flex justify-between gap-4 p-2 bg-background-soft rounded-md"
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
                                        <div className='flex flex-col items-end gap-1'>
                                            {convertCentsToEuro(t?.total)}
                                            <InfoBadge
                                                status={t?.status}
                                            />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    }
                </div>
                <SheetFooter
                    className="w-full"
                >
                    {giftCard &&
                        <div className='flex-col-container w-full'>
                            <div className='flex-container justify-between'>
                                <div className='flex flex-col gap-1'>
                                    <strong>
                                        Total
                                    </strong>
                                    <strong className='text-2xl text-foreground/50'>
                                        {convertCentsToEuro(giftCard?.value)}
                                    </strong>
                                </div>
                                <div className='flex flex-col gap-1 items-end'>
                                    <strong>
                                        Balance
                                    </strong>
                                    <strong className={cn('text-2xl', giftCardBalance > 0 ? 'text-green-500 dark:text-green-600' : 'text-red-600')}>
                                        {convertCentsToEuro(giftCardBalance)}
                                    </strong>
                                </div>
                            </div>
                            <Button
                                onClick={onPayment}
                                disabled={toPay < 0.01 ? true : false || !giftCard?.id ? true : false || giftCard?.status === 'spent'}
                                leftIcon="Banknote"
                                variant='blue'
                                className='w-full h-14'
                            >
                                Pay - {convertCentsToEuro(giftCardBalance > toPay ? toPay : giftCardBalance)}
                            </Button>
                        </div>
                    }
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}

