import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { UseMutateFunction } from "react-query"

//libs
import { GiftCardFormSchemaType } from "@/common/libs/zod/forms/restaurant/createGiftCardForm"
import { convertCentsToEuro } from "@/common/utils/convertToEuro"
import { getWalkInClient } from "../../_components/table/utils"
import { cn } from "@/common/libs/shadcn/utils"
import Icon from "@/common/libs/lucida-icon"

//components
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { KeyPadDisplay } from "@/components/common/keyPadDisplay"
import SearchInput from "@/components/common/searchInput"
import AuthDialog from "@/components/common/authDialog"
import ScanInput from "@/components/common/scanInput"
import { Button } from "@/components/ui/button"

//interface
import { GiftCardPaymentsType, TransactionsDirection, TransactionsMethod } from "@/common/types/company/transactions.interface"
import { IPOSTRestaurantBody, IPOSTRestaurantDataRerturn } from "@/hooks/restaurant/IPostRestaurantDataHooks.interface"
import { IGETRestaurantDataQuery } from "@/hooks/restaurant/IGetRestaurantDataHooks.interface"
import { IToken, Permissions } from "@/common/types/auth/auth.interface"
import { IClient } from "@/common/types/restaurant/client.interface"

interface BuyGiftCardProps {
    clients: IClient[],
    setClientsParams: Dispatch<SetStateAction<IGETRestaurantDataQuery>>,
    clientsParams: IGETRestaurantDataQuery,
    createGiftCard: UseMutateFunction<IPOSTRestaurantDataRerturn, any, IPOSTRestaurantBody, unknown>
}

export default function BuyGiftCard({ clients, setClientsParams, createGiftCard, clientsParams }: BuyGiftCardProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [giftCard, setGiftCard] = useState<GiftCardFormSchemaType>({
        client_key: '',
        code: '',
        status: 'confirmed',
        value: 5000,
        email: '',
        name: '',
        contact_number: '',
        method: ''
    })

    const onOpenChange = () => {
        setGiftCard({
            client_key: '',
            code: '',
            status: 'confirmed',
            value: 5000,
            email: '',
            name: '',
            contact_number: '',
            method: ''
        })
    }


    const handleSuccess = async (user: IToken) => {
        setIsOpen(false);
        await handleCreateGiftCard(user)
    }

    const onValueChange = (number: number, remove?: boolean) => {
        if (remove) {
            setGiftCard(prev => {
                return {
                    ...prev,
                    value: 0
                }
            })
            return
        }

        if (giftCard?.value?.toString().length === 5) {
            return
        }

        const value = giftCard?.value?.toString()?.toString().split('')
        setGiftCard(prev => {
            return {
                ...prev,
                value: Number(value?.join('')) === 0 ? number : Number(value?.join('')) * 10 + number
            }
        })
    }


    const handleCreateGiftCard = async (user: IToken) => {
        let clientInfo = {
            client_key: giftCard?.client_key,
            name: giftCard?.name,
            email: giftCard?.email,
            contact_number: giftCard?.contact_number,
        }


        if (!giftCard?.client_key) {
            const client = await getWalkInClient()
            clientInfo = {
                client_key: client?.id,
                name: client?.name,
                email: client?.email,
                contact_number: client?.contact_number,
            }
        }

        const method = giftCard?.method === 'card' ? TransactionsMethod.CARD : TransactionsMethod.CASH

        await createGiftCard({
            giftcard: {
                value: giftCard?.value,
                code: giftCard?.code,
                name: clientInfo?.name,
                email: clientInfo?.email,
                contact_number: clientInfo?.contact_number,
                client_key: clientInfo?.client_key,
                token: 'in restaurant',
                status: 'sent',
                sent_by: user?.name,
                sent_date: new Date(),
                address_2_to: 'in hands',
                address_to: 'in hands',
                city_to: 'in hands',
                country_to: 'in hands',
                eircode_to: 'in hands',
                transaction: {
                    direction: TransactionsDirection.IN,
                    method,
                    total: giftCard?.value,
                    type: GiftCardPaymentsType.BUY_GIFT_CARD,
                    client_id: clientInfo?.client_key,
                    payee_key: user?.user_id,
                    valid_by: user?.name,
                    valid_by_id: user?.user_id,
                }
            }
        })
    }

    return (
        <>
            <AuthDialog
                isOpen={isOpen}
                toggleAuthDialog={() => setIsOpen(!isOpen)}
                handleAuthResponse={(user) => handleSuccess(user)}
                permissions={[Permissions.RECEPTION]}
                title={`Pay ${convertCentsToEuro(giftCard?.value || 0)}`}
            />

            <Sheet
                onOpenChange={onOpenChange}
            >
                <SheetTrigger asChild>
                    <Button
                        variant='yellow'
                        className='w-full h-16'
                    >
                        <Icon name='Gift' />
                    </Button>
                </SheetTrigger>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Gift Card</SheetTitle>
                    </SheetHeader>
                    <div
                        className="flex-col-container justify-between gap-2 overflow-auto scrollbar-thin">
                        <ScanInput
                            onSearchChange={(e) => setGiftCard(prev => {
                                return {
                                    ...prev,
                                    code: e
                                }
                            })}
                            cleanSearch={() => setGiftCard(prev => { return { ...prev, code: '' } })}
                            value={giftCard?.code || ''}
                            inputClassName="h-12"
                            debounceDelay={0}
                            inputProps={{
                                maxLength: 16,
                            }}
                        />
                        <KeyPadDisplay
                            displayValue={convertCentsToEuro(giftCard?.value || 0)}
                            onChange={onValueChange}
                        />
                        <div>
                            <SearchInput
                                onSearchChange={(e) => {
                                    setGiftCard(prev => ({
                                        ...prev,
                                        client_key: ''
                                    }))
                                    setClientsParams(prev => {
                                        return {
                                            clients: {
                                                ...prev.clients,
                                                contact_number: e,
                                                pagination: {
                                                    take: 5,
                                                    skip: 0,
                                                }
                                            }
                                        }
                                    })
                                }}
                                value={clientsParams?.clients?.all?.contact_number || ''}
                                custom="mb-4"
                            />
                            <div className='min-h-24'>
                                {clients?.length === 0 && <div>No clients found</div>}
                                {clients?.map(client => {
                                    return (
                                        <div
                                            key={client?.id}
                                            className={cn('flex-col-container gap-1 p-2 bg-background-soft rounded-lg border-2', giftCard?.client_key === client?.id ? 'border-primary' : 'border-transparent')}
                                            onClick={() => giftCard?.client_key === client?.id
                                                ? setGiftCard(prev => ({
                                                    ...prev,
                                                    client_key: '',
                                                    name: '',
                                                    email: '',
                                                    contact_number: ''
                                                }))
                                                : setGiftCard(prev => ({
                                                    ...prev,
                                                    client_key: client?.id,
                                                    name: client?.name,
                                                    email: client?.email,
                                                    contact_number: client?.contact_number
                                                }))}
                                        >
                                            <strong className='capitalize line-clamp-1'>{client?.name?.toLocaleLowerCase()}</strong>
                                            <small>{client?.contact_number}</small>
                                            <small>{client?.email}</small>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        <div className='grid grid-cols-2 gap-6'>
                            <Button
                                variant='pink'
                                type='button'
                                leftIcon='CreditCard'
                                className='h-16'
                                onClick={() => {
                                    setGiftCard(prev => ({
                                        ...prev,
                                        method: 'card'
                                    }))
                                    setIsOpen(true)
                                }}
                                disabled={giftCard?.code?.length < 16 || giftCard?.value === 0}
                            >
                                Card
                            </Button>
                            <Button
                                variant='green'
                                type='button'
                                leftIcon='Banknote'
                                className='h-16'
                                onClick={() => {
                                    setGiftCard(prev => ({
                                        ...prev,
                                        method: 'cash'
                                    }))
                                    setIsOpen(true)
                                }}
                                disabled={giftCard?.code?.length < 16 || giftCard?.value === 0}
                            >
                                Cash
                            </Button>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </>
    )
}