'use client'
import Wrap from "@/components/common/wrap"
import { useGETRestaurantDataHooks } from "@/hooks/restaurant/restaurantDataHooks"
import { ClientReviewsColumnsTable } from "./_components/clientReviewsTable"
import { clientReviewsColumnsTable } from "./_components/clientReviewsColumnsTable"
import { IQueryPagination } from "@/common/types/settings.interface"

export default function ClientReviewPage({ params }: { params: { id: string } }): JSX.Element {
    const {
        restaurantAllReviews: reviews,
        isRestaurantDataLoading: isReviewsLoading,
        setGETRestaurantDataParams: setReviewsParams,
        GETRestaurantDataParams: reviewsParams,
        restaurantDataError: error
    } = useGETRestaurantDataHooks({
        query: 'REVIEWS',
        keepParmas: true,
        defaultParams: {
            reviews: {
                all: {
                    client_id: params?.id,
                    pagination: {
                        take: 50,
                        skip: 0
                    },
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
                                pagination
                            }
                        }
                    })),
                    pagination: reviews?.pagination,
                    queryPagination: reviewsParams?.reviews?.all?.pagination!
                }
            }}

            isLoading={isReviewsLoading}
            error={error}
        >
            <ClientReviewsColumnsTable
                columns={clientReviewsColumnsTable}
                data={reviews?.data}
            />
        </Wrap>
    )
}
