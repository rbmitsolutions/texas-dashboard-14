import Icon from "@/common/libs/lucida-icon"
import { UseMutateFunction } from "react-query"
import { useState } from "react"

//components
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import IconText from "@/components/common/iconText"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

//hooks
import { convertCentsToEuro } from "@/common/utils/convertToEuro"
import { Textarea } from "@/components/ui/textarea"

//interfaces
import { IPUTRestaurantBody } from "@/hooks/restaurant/IPutRestaurantDataHooks.interface"
import { IGiftCards } from "@/common/types/restaurant/giftcard.interface"
import { IToken } from "@/common/types/auth/auth.interface"

interface GiftCardDialogProps {
    giftcard: IGiftCards
    updateGiftcard: UseMutateFunction<any, any, IPUTRestaurantBody, unknown>
    user: IToken
}

export default function GiftcardDialog({ giftcard, updateGiftcard, user }: GiftCardDialogProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [code, setCode] = useState('')

    // const {
    //     companyAllTransacations: transactions
    // } = useGETCompanyDataHooks({
    //     query: 'TRANSACTIONS',
    //     defaultParams: {
    //         transactions: {
    //             all: {
    //                 direction: {
    //                     in: [TransactionsDirection.VOUCHER]
    //                 },
    //                 gift_card_id: giftcard.id,
    //                 pagination: {
    //                     take: 50,
    //                     skip: 0
    //                 }
    //             }
    //         },
    //     },
    //     UseQueryOptions: {
    //         enabled: isOpen
    //     }
    // })

    const onOpenChange = () => {
        setIsOpen(!isOpen)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        await updateGiftcard({
            giftcard: {
                one: {
                    id: giftcard?.id,
                    code,
                    status: "sent",
                    sent_date: new Date(),
                    sent_by: user?.name
                }
            }
        }, {
            onSuccess: () => {
                setCode('')
                onOpenChange()
            }
        })
    }

    return (
        <Sheet
            onOpenChange={onOpenChange}
        >
            <SheetTrigger asChild>
                <Button size='iconExSm'>
                    <Icon name="Gift" />
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>GiftCard</SheetTitle>
                </SheetHeader>

                <div className="flex-col-container">
                    <div className='flex flex-col gap-1'>
                        <strong>Code</strong>
                        {giftcard?.code ?
                            <IconText
                                icon='CreditCard'
                                text={giftcard?.code || 'N/A'}
                            />
                            :
                            <form 
                            onSubmit={(e) => handleSubmit(e)}
                            className='flex items-center gap-4'
                            >
                                <Input
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    placeholder='Enter code'
                                    maxLength={16}
                                    minLength={16}
                                />
                                <Button
                                    type='submit'
                                    leftIcon="Send"
                                    variant='purple'
                                >
                                    Sent
                                </Button>
                            </form>
                        }
                    </div>
                    <div className='flex flex-col gap-1'>
                        <strong>From</strong>
                        <IconText
                            icon='User'
                            text={`${giftcard?.name} ${giftcard?.last_name}` || 'N/A'}
                        />
                        <IconText
                            icon='Phone'
                            text={giftcard?.contact_number || 'N/A'}
                        />
                        <IconText
                            icon='Mail'
                            text={giftcard?.email || 'N/A'}
                        />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <strong>To</strong>
                        <IconText
                            icon='User'
                            text={giftcard?.name_to || 'N/A'}
                        />
                        <IconText
                            icon='MapPin'
                            text={giftcard?.address_to || 'N/A'}
                        />
                        <IconText
                            icon='MapPin'
                            text={giftcard?.address_2_to || 'N/A'}
                        />
                        <IconText
                            icon='MapPin'
                            text={giftcard?.city_to || 'N/A'}
                        />
                        <IconText
                            icon='MapPin'
                            text={giftcard?.country_to || 'N/A'}
                        />
                        <IconText
                            icon='MapPin'
                            text={giftcard?.eircode_to || 'N/A'}
                        />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <strong>Total</strong>
                        {convertCentsToEuro(giftcard?.value || 0)}
                    </div>
                    <Textarea
                        defaultValue={giftcard?.message || 'N/A'}
                        readOnly
                        className='h-40 resize-none'
                    />
                </div>
            </SheetContent>
        </Sheet>
    )
}


