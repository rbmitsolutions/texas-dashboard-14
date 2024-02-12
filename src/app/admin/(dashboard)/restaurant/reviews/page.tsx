'use client'

import { reviewsColumnsTable } from "./_components/reviewsColumnsTable"
import { ReviewsColumnsTable } from "./_components/reviewsTable"
import SearchInput from "@/components/common/searchInput"
import Wrap from "@/components/common/wrap"

//hooks
import { useGETRestaurantDataHooks } from "@/hooks/restaurant/restaurantDataHooks"

//interface
import { IQueryPagination } from "@/common/types/settings.interface"

export default function ReviewsPage() {

    const {
        restaurantAllReviews: reviews,
        setGETRestaurantDataParams: setReviewsParams,
        GETRestaurantDataParams: reviewsParams,
        isRestaurantDataFetching: isFetching,
        restaurantDataError: error
    } = useGETRestaurantDataHooks({
        query: 'REVIEWS',
        keepParmas: true,
        defaultParams: {
            reviews: {
                all: {
                    pagination: {
                        take: 50,
                        skip: 0
                    },
                    include: {
                        client: '1'
                    },
                    orderBy: {
                        key: 'created_at',
                        order: 'desc'
                    }
                }
            }
        }
    })

    return (
        <Wrap
            header={{
                title: {
                    title: 'Reviews',
                    icon: 'Star'
                },
                pagination: {
                    onPageChange: (pagination: IQueryPagination) => setReviewsParams(prev => ({
                        reviews: {
                            all: {
                                ...prev?.reviews?.all,
                                pagination,
                            }
                        }
                    })),
                    pagination: reviews?.pagination,
                    queryPagination: reviewsParams?.reviews?.all?.pagination!,
                    isFetching,
                }
            }}
            actions={{
                toLeft: (
                    <div className='flex gap-4'>
                        <SearchInput
                            onSearchChange={(e: string) => setReviewsParams(prev => ({
                                reviews: {
                                    all: {
                                        ...prev?.reviews?.all,
                                        client: {
                                            ...prev?.reviews?.all?.client,
                                            contact_number: e
                                        },
                                        pagination: {
                                            take: 50,
                                            skip: 0
                                        }
                                    }
                                }
                            }))}
                            value={reviewsParams?.reviews?.all?.client?.contact_number || ''}
                            placeholder='Contact number'
                        />
                        <SearchInput
                            onSearchChange={(e: string) => setReviewsParams(prev => ({
                                reviews: {
                                    all: {
                                        ...prev?.reviews?.all,
                                        client: {
                                            ...prev?.reviews?.all?.client,
                                            email: e
                                        },
                                        pagination: {
                                            take: 50,
                                            skip: 0
                                        }
                                    }
                                }
                            }))}
                            value={reviewsParams?.reviews?.all?.client?.email || ''}
                            placeholder='Email'
                        />
                    </div>
                ),
                searchInput: {
                    onSearchChange: (e: string) => setReviewsParams(prev => ({
                        reviews: {
                            all: {
                                ...prev?.reviews?.all,
                                client: {
                                    ...prev?.reviews?.all?.client,
                                    name: e
                                },
                                pagination: {
                                    take: 50,
                                    skip: 0
                                }
                            }
                        }
                    })),
                    value: reviewsParams?.reviews?.all?.client?.name || '',
                    placeholder: 'Name'
                },
                optionsPopover: {
                    options: [
                        {
                            label: 'Sort by',
                            value: `${reviewsParams?.reviews?.all?.orderBy?.key}/${reviewsParams?.reviews?.all?.orderBy?.order}` || '',
                            onChange: (e: string) => setReviewsParams(prev => ({
                                reviews: {
                                    all: {
                                        ...prev?.reviews?.all,
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
                                    label: 'Type A-Z',
                                    value: 'type/asc'
                                },
                                {
                                    label: 'Type Z-A',
                                    value: 'type/desc'
                                },
                                {
                                    label: 'Date A-Z',
                                    value: 'created_at/asc'
                                },
                                {
                                    label: 'Date Z-A',
                                    value: 'created_at/desc'
                                },
                                {
                                    label: 'Total A-Z',
                                    value: 'total/asc'
                                },
                                {
                                    label: 'Total Z-A',
                                    value: 'total/desc'
                                },
                            ],
                        },
                    ]
                },
                className: 'grid grid-cols-1 gap-4 md:grid-cols-[2fr,1fr,auto]',
            }}
            error={error}
        >
            <ReviewsColumnsTable
                columns={reviewsColumnsTable}
                data={reviews?.data || []}
            />
        </Wrap>
    )
}