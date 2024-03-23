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
import Icon from "@/common/libs/lucida-icon";
import { Textarea } from "@/components/ui/textarea";
import PrintBill from "./rightReceptionDisplay/printBillButton";

interface GiftCardBalanceProps {
}

export default function GiftCardBalance({ }: GiftCardBalanceProps) {
    const [giftCard, setGiftCard] = useState<IGiftCards | undefined>(undefined)
    const [giftCardBalance, setGiftCardBalance] = useState<number>(0)
    const [code, setCode] = useState<string>('')
    const [isOpen, setIsOpen] = useState(false)

    const {
        setGETRestaurantDataParams: setGiftCardParams,
        GETRestaurantDataParams: getGiftCardParams,
        refetchRestaurantData: refetchGiftCard
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
            initialData: undefined,

            onSuccess: (data) => {
                const card = data as IGiftCards
                if (card) {
                    setGiftCard(card)
                    setGiftCardBalance(card.value - card.spent)
                }
            },
        }
    })

    const onOpenChange = () => {
        setGiftCard(undefined)
        setCode('')
        setIsOpen(!isOpen)
    }

    useEffect(() => {
        if (code?.length === 16) {
            if (code === getGiftCardParams?.giftcards?.byCode?.code) {
                refetchGiftCard()
            } else {
                setGiftCardParams({
                    giftcards: {
                        byCode: {
                            code
                        }
                    }
                })
            }
        }
    }, [code, setGiftCardParams, refetchGiftCard, getGiftCardParams?.giftcards?.byCode?.code])

    return (
        <Sheet
            onOpenChange={onOpenChange}
            open={isOpen}
        >
            <SheetTrigger asChild>
                <Button
                    leftIcon="Gift"
                    variant='green'
                    className='w-full h-16'
                    type="button"
                >
                    <Icon name='Euro' />
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
                <div className='overflow-scroll scrollbar-thin'>
                    {giftCard &&
                        <div className='flex-col-container pt-4'>
                            <div className='flex justify-between'>
                                <div className='flex-container gap-2 items-center'>
                                    <Image
                                        alt="Gift Card"
                                        src='/logo/bull-white.png'
                                        width={80}
                                        height={80}
                                        className='invert dark:invert-0'
                                    />
                                    <strong>Texas Steakout</strong>
                                </div>
                                <div>
                                    <PrintBill
                                        giftCardId={giftCard?.id}
                                    />
                                </div>
                            </div>
                            <div className='flex flex-col items-start gap-1'>
                                <strong>From</strong>
                                <IconText
                                    icon='User'
                                    text={`${giftCard?.name} ${giftCard?.last_name}` || 'N/A'}
                                />
                                <IconText
                                    icon='Phone'
                                    text={giftCard?.contact_number || 'N/A'}
                                />
                                <IconText
                                    icon='Mail'
                                    text={giftCard?.email || 'N/A'}
                                />
                            </div>
                            <div className='flex flex-col items-start gap-1'>
                                <strong>To</strong>
                                <IconText
                                    icon='User'
                                    text={giftCard?.name_to || 'N/A'}
                                />
                                <IconText
                                    icon='MapPin'
                                    text={giftCard?.address_to || 'N/A'}
                                />
                                <IconText
                                    icon='MapPin'
                                    text={giftCard?.address_2_to || 'N/A'}
                                />
                                <IconText
                                    icon='MapPin'
                                    text={giftCard?.city_to || 'N/A'}
                                />
                                <IconText
                                    icon='MapPin'
                                    text={giftCard?.country_to || 'N/A'}
                                />
                                <IconText
                                    icon='MapPin'
                                    text={giftCard?.eircode_to || 'N/A'}
                                />
                            </div>
                            <Textarea
                                defaultValue={giftCard?.message || 'N/A'}
                                readOnly
                                className='h-40 resize-none'
                            />
                            <IconText
                                icon='CreditCard'
                                text={giftCard?.code || 'N/A'}
                            />
                        </div>
                    }
                </div>
                <SheetFooter
                    className="w-full"
                >
                    {giftCard &&
                        <div className='flex-col-container w-full'>
                            <div className='flex flex-col items-center gap-1'>
                                <strong>
                                    Balance
                                </strong>
                                <strong className={cn('text-[60px]', giftCardBalance > 0 ? 'text-green-500 dark:text-green-600' : 'text-red-600')}>
                                    {convertCentsToEuro(giftCardBalance)}
                                </strong>
                            </div>
                        </div>
                    }
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}

