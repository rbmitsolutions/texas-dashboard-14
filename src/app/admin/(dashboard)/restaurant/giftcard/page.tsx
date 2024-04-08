'use client'

//componets
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { giftcardsColumnsTable } from "./_components/giftcardsColumnsTable"
import { GiftCardTable } from "./_components/giftcardsTable"
import SearchInput from "@/components/common/searchInput"
import Wrap from "@/components/common/wrap"

//hooks
import { useDELETERestaurantDataHooks, useGETRestaurantDataHooks, usePUTRestaurantDataHooks } from "@/hooks/restaurant/restaurantDataHooks"
import { IGiftCardStatus } from "@/common/types/restaurant/giftcard.interface"
import { useAuthHooks } from "@/hooks/useAuthHooks"

export default function Giftcard(): JSX.Element {
    const { user } = useAuthHooks()
    const {
        restaurantAllGiftCards: giftcards,
        setGETRestaurantDataParams: setGiftcards,
        GETRestaurantDataParams: GETGiftcards,
        refetchRestaurantData: toRefetch,
    } = useGETRestaurantDataHooks({
        query: 'GIFTCARD',
        keepParmas: true,
        defaultParams: {
            giftcards: {
                all: {
                    pagination: {
                        take: 20,
                        skip: 0
                    },
                    status: 'unsent'
                }
            }
        }
    })

    const {
        updateRestaurantData: updateGiftcard
    } = usePUTRestaurantDataHooks({
        query: 'GIFTCARD',
        toRefetch
    })

    const {
        deleteRestaurantData: deleteGiftcard
    } = useDELETERestaurantDataHooks({
        query: 'GIFTCARD',
        toRefetch
    })

    return (
        <Wrap
            header={{
                title: {
                    icon: 'Gift',
                    title: 'Giftcards'
                },
                pagination: {
                    onPageChange: (pagination) => setGiftcards(prev => ({
                        giftcards: {
                            all: {
                                ...prev?.giftcards?.all,
                                pagination,
                            }
                        }
                    })),
                    pagination: giftcards?.pagination,
                    queryPagination: GETGiftcards?.giftcards?.all?.pagination!,
                }
            }}
            actions={{
                toRight: (
                    <div className='grid grid-cols-2 gap-4'>
                        <div className='space-y-2'>
                            <SearchInput
                                onSearchChange={e => setGiftcards(prev => ({
                                    giftcards: {
                                        all: {
                                            ...prev?.giftcards?.all,
                                            pagination: {
                                                take: 20,
                                                skip: 0
                                            },
                                            name: e
                                        }
                                    }
                                }))}
                                cleanSearch={() => setGiftcards(prev => ({
                                    giftcards: {
                                        all: {
                                            ...prev?.giftcards?.all,
                                            pagination: {
                                                take: 20,
                                                skip: 0
                                            },
                                            name: ''
                                        }
                                    }
                                }))}
                                value={GETGiftcards?.giftcards?.all?.name || ''}
                                placeholder='Bought by (name)'
                                custom="max-w-full"
                            />
                            <SearchInput
                                onSearchChange={e => setGiftcards(prev => ({
                                    giftcards: {
                                        all: {
                                            ...prev?.giftcards?.all,
                                            pagination: {
                                                take: 20,
                                                skip: 0
                                            },
                                            contact_number: e
                                        }
                                    }
                                }))}
                                cleanSearch={() => setGiftcards(prev => ({
                                    giftcards: {
                                        all: {
                                            ...prev?.giftcards?.all,
                                            pagination: {
                                                take: 20,
                                                skip: 0
                                            },
                                            contact_number: ''
                                        }
                                    }
                                }))}
                                value={GETGiftcards?.giftcards?.all?.contact_number || ''}
                                placeholder='Bought by (contact number)'
                                custom="max-w-full"
                            />
                        </div>
                        <div className='space-y-2'>
                            <SearchInput
                                onSearchChange={e => setGiftcards(prev => ({
                                    giftcards: {
                                        all: {
                                            ...prev?.giftcards?.all,
                                            pagination: {
                                                take: 20,
                                                skip: 0
                                            },
                                            name_to: e
                                        }
                                    }
                                }))}
                                cleanSearch={() => setGiftcards(prev => ({
                                    giftcards: {
                                        all: {
                                            ...prev?.giftcards?.all,
                                            pagination: {
                                                take: 20,
                                                skip: 0
                                            },
                                            name_to: ''
                                        }
                                    }
                                }))}
                                value={GETGiftcards?.giftcards?.all?.name_to || ''}
                                placeholder='Send to (name)'
                                custom="max-w-full"
                            />
                            <div className='grid grid-cols-[1fr,auto] gap-4'>
                                <SearchInput
                                    onSearchChange={e => setGiftcards(prev => ({
                                        giftcards: {
                                            all: {
                                                ...prev?.giftcards?.all,
                                                pagination: {
                                                    take: 20,
                                                    skip: 0
                                                },
                                                value: e === '0' ? '' : String(Number(e) * 100)
                                            }
                                        }
                                    }))}
                                    cleanSearch={() => setGiftcards(prev => ({
                                        giftcards: {
                                            all: {
                                                ...prev?.giftcards?.all,
                                                pagination: {
                                                    take: 20,
                                                    skip: 0
                                                },
                                                value: ''
                                            }
                                        }
                                    }))}
                                    value={String(Number(GETGiftcards?.giftcards?.all?.value) / 100) || ''}
                                    placeholder='Value'
                                    custom="max-w-full"
                                    inputProps={{
                                        type: 'number',
                                        step: '1',
                                    }}
                                />
                                <Select
                                    onValueChange={e => setGiftcards(prev => ({
                                        giftcards: {
                                            all: {
                                                ...prev?.giftcards?.all,
                                                pagination: {
                                                    take: 20,
                                                    skip: 0
                                                },
                                                status: e as IGiftCardStatus
                                            }
                                        }
                                    }))}
                                    value={GETGiftcards?.giftcards?.all?.status || ''}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent >
                                        <SelectItem value="sent">Sent</SelectItem>
                                        <SelectItem value="unsent">Unsent</SelectItem>
                                        <SelectItem value="spent">Spent</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                )
            }}
            className="mt-4"
        >
            <GiftCardTable
                columns={giftcardsColumnsTable({
                    updateGiftcard,
                    deleteGiftcard,
                    user
                })}
                data={giftcards?.data || []}
            />
        </Wrap>
    )
}