'use client'
//components
import { clientsColumnsTable } from "./_components/clientsColumnsTable"
import { ClientsTable } from "./_components/clientsTable"
import Wrap from "@/components/common/wrap"

//hooks
import { useGETRestaurantDataHooks } from "@/hooks/restaurant/restaurantDataHooks"

//interface
import { IQueryPagination } from "@/common/types/settings.interface"
import { FormLabel } from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"

export default function Clients() {
    const {
        restaurantAllClients: allClients,
        setGETRestaurantDataParams: setAllClients,
        isRestaurantDataFetching: isClientsFetching,
        GETRestaurantDataParams: allClientsParams
    } = useGETRestaurantDataHooks({
        query: 'CLIENTS',
        keepParmas: true,
        defaultParams: {
            clients: {
                all: {
                    pagination: {
                        take: 50,
                        skip: 0
                    },
                    orderBy: {
                        key: 'name',
                        order: 'asc'
                    }
                }
            }
        }
    })



    return (
        <div>
            <Wrap
                header={{
                    title: {
                        title: 'Clients',
                        icon: 'Users'
                    },
                    pagination: {
                        onPageChange: (pagination: IQueryPagination) => setAllClients(prev => ({
                            clients: {
                                all: {
                                    pagination
                                }
                            }
                        })),
                        pagination: allClients?.pagination,
                        queryPagination: allClientsParams?.clients?.all?.pagination!,
                        isFetching: isClientsFetching
                    }
                }}
                actions={{
                    searchInput: {
                        onSearchChange: (e: string) => setAllClients(prev => ({
                            clients: {
                                all: {
                                    ...prev,
                                    name: e,
                                    pagination: {
                                        take: 50,
                                        skip: 0
                                    }
                                }
                            }
                        })),
                        value: allClientsParams?.clients?.all?.name || '',
                    },
                    optionsPopover: {
                        options: [
                            {
                                label: 'Sort by',
                                value: `${allClientsParams?.clients?.all?.orderBy?.key}/${allClientsParams?.clients?.all?.orderBy?.order}` || '',
                                onChange: (e: string) => setAllClients(prev => ({
                                    clients: {
                                        all: {
                                            ...prev?.clients?.all,
                                            pagination: {
                                                take: 50,
                                                skip: 0
                                            },
                                            orderBy: {
                                                key: e?.split('/')[0] as any,
                                                order: e?.split('/')[1] as 'asc' | 'desc'
                                            }
                                        }
                                    }
                                })),
                                placeholder: 'Sort by',
                                options: [
                                    {
                                        label: 'Name A-Z',
                                        value: 'name/asc'
                                    },
                                    {
                                        label: 'Name Z-A',
                                        value: 'name/desc'
                                    },
                                    {
                                        label: 'Email A-Z',
                                        value: 'email/asc'
                                    },
                                    {
                                        label: 'Email Z-A',
                                        value: 'email/desc'
                                    },
                                    {
                                        label: 'Valid Number A-Z',
                                        value: 'valid_number/asc'
                                    },
                                    {
                                        label: 'Valid Number Z-A',
                                        value: 'valid_number/desc'
                                    },
                                    {
                                        label: 'Qnt Bookings A-Z',
                                        value: 'qnt_of_bookings/asc'
                                    },
                                    {
                                        label: 'Qnt Bookings Z-A',
                                        value: 'qnt_of_bookings/desc'
                                    },
                                    {
                                        label: 'Restaurant Review A-Z',
                                        value: 'restaurant_review/asc'
                                    },
                                    {
                                        label: 'Restaurant Review Z-A',
                                        value: 'restaurant_review/desc'
                                    },
                                    {
                                        label: 'Staff Review A-Z',
                                        value: 'staff_review/asc'
                                    },
                                    {
                                        label: 'Staff Review Z-A',
                                        value: 'staff_review/desc'
                                    },
                                ],
                            },
                        ]
                    },
                    toRight: (
                        <label className='flex items-center gap-2 cursor-pointer'>
                            <small>Blocked</small>
                            <Switch
                                checked={allClientsParams?.clients?.all?.blocked}
                                onCheckedChange={e => setAllClients(prev => ({
                                    clients: {
                                        all: {
                                            ...prev?.clients?.all,
                                            blocked: !prev?.clients?.all?.blocked,
                                            pagination: {
                                                take: 50,
                                                skip: 0
                                            }
                                        }
                                    }
                                }))}
                            />
                        </label>
                    ),
                    className: 'grid grid-cols-[1fr,auto,auto] gap-4 items-center'
                }}
            >
                <ClientsTable
                    columns={clientsColumnsTable}
                    data={allClients?.data || []}
                />
            </Wrap>
        </div>
    )
}