'use client'
import { cn } from "@/common/libs/shadcn/utils"
import Wrap from "@/components/common/wrap"
import RequestComponent from "./_components/requestComponent"
import RequestForm from "./_components/requestForm"
import { useDELETEUserDataHooks, useGETUserDataHooks, usePOSTUserDataHooks } from "@/hooks/user/useUserDataHooks"

export default function Request() {
    const {
        userAllRequests: requests,
        refetchUserData: refetchRequests,
    } = useGETUserDataHooks({
        query: 'USER_REQUESTS',
        defaultParams: {
            requests: {
                all: {
                    pagination: {
                        take: 20,
                        skip: 0
                    },
                    user_id: ''
                }
            }
        },
    })

    const {
        createUserData: createRequest,
        isCreateUserDataLoading: isCreateRequestLoading,
    } = usePOSTUserDataHooks({
        query: 'USER_REQUESTS',
        toRefetch: refetchRequests
    })

    const {
        deleteUserData: deleteRequest,
        isDeleteUserDataLoading: isDeleteRequestLoading,
    } = useDELETEUserDataHooks({
        query: "USER_REQUESTS",
        toRefetch: refetchRequests
    })

    return (
        <div className='flex-col-container-center'>
            <div className={cn('h-80 w-full rounded-2xl bg-[url("/img/background.png")] bg-center bg-no-repeat bg-cover dark:grayscale ',)} />
            <RequestForm createRequest={createRequest} isCreateRequestLoading={isCreateRequestLoading} />
            <Wrap
                header={{
                    title: {
                        title: 'Requests',
                        icon: 'MessageCircleMore'
                    }

                }}
                className='w-full mt-8'
            >
                <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
                    {requests?.data?.map(request => {
                        return (
                            <RequestComponent key={request?.id} request={request}
                                deleteRequest={deleteRequest}
                                isDeleteRequestLoading={isDeleteRequestLoading}
                            />
                        )
                    })}
                </div>
            </Wrap>
        </div>
    )
}