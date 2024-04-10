import Icon from "@/common/libs/lucida-icon"
import { UseMutateFunction } from "react-query"
import { useEffect, useState } from "react"

//libs
import { convertCentsToEuro } from "@/common/utils/convertToEuro"

//components
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import IconText from "@/components/common/iconText"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

//hooks
import { useGETRestaurantDataHooks } from "@/hooks/restaurant/restaurantDataHooks"

//interfaces
import { IPUTRestaurantBody } from "@/hooks/restaurant/IPutRestaurantDataHooks.interface"
import { IGiftCards } from "@/common/types/restaurant/giftcard.interface"
import { IToken } from "@/common/types/auth/auth.interface"

interface GiftCardDialogProps {
    giftcardId?: string
    giftcard?: IGiftCards
    updateGiftcard?: UseMutateFunction<any, any, IPUTRestaurantBody, unknown>
    user: IToken
}

export default function GiftcardDialog({ giftcardId, giftcard, updateGiftcard, user }: GiftCardDialogProps) {
    const [card, setCard] = useState<IGiftCards | null>(giftcard || null)
    const [isOpen, setIsOpen] = useState(false)
    const [code, setCode] = useState('')

    useGETRestaurantDataHooks({
        query: 'GIFTCARD',
        defaultParams: {
            giftcards: {
                byId: {
                    id: giftcardId!
                }
            }
        },
        UseQueryOptions: {
            onSuccess: (data) => {
                console.log('fetch')
                console.log(data)
                setCard(data as IGiftCards)
            },
            enabled: (isOpen && giftcardId) ? true : false,
        }
    })

    const onOpenChange = () => {
        setIsOpen(!isOpen)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!updateGiftcard || !giftcard || !user) return

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
                        {card?.code ?
                            <IconText
                                icon='CreditCard'
                                text={card?.code || 'N/A'}
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
                            text={`${card?.name} ${card?.last_name}` || 'N/A'}
                        />
                        <IconText
                            icon='Phone'
                            text={card?.contact_number || 'N/A'}
                        />
                        <IconText
                            icon='Mail'
                            text={card?.email || 'N/A'}
                        />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <strong>To</strong>
                        <IconText
                            icon='User'
                            text={card?.name_to || 'N/A'}
                        />
                        <IconText
                            icon='MapPin'
                            text={card?.address_to || 'N/A'}
                        />
                        <IconText
                            icon='MapPin'
                            text={card?.address_2_to || 'N/A'}
                        />
                        <IconText
                            icon='MapPin'
                            text={card?.city_to || 'N/A'}
                        />
                        <IconText
                            icon='MapPin'
                            text={card?.country_to || 'N/A'}
                        />
                        <IconText
                            icon='MapPin'
                            text={card?.eircode_to || 'N/A'}
                        />
                    </div>
                    <Textarea
                        defaultValue={card?.message || 'N/A'}
                        readOnly
                        className='h-40 resize-none'
                    />
                    <div className='flex flex-col gap-1'>
                        <strong>Total</strong>
                        {convertCentsToEuro(card?.value || 0)}
                        <strong className='mt-4'>Spent</strong>
                        {convertCentsToEuro(card?.spent || 0)}

                        <div className='flex-col-container items-center w-full'>
                            <strong className='mt-4 text-xl'>Remain</strong>
                            <strong className='text-3xl'>
                                {convertCentsToEuro(Number(card?.value || 0) - Number(card?.spent || 0))}
                            </strong>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}


