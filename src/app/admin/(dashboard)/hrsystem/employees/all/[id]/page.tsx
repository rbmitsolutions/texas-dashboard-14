'use client'
import UserProfile from "@/components/common/forms/user";
import { useGETUserDataHooks } from "@/hooks/user/useUserDataHooks";

export default function User({ params }: { params: { id: string } }) {
    const {
        userDetails: user,
    } = useGETUserDataHooks({
        query: 'USER_COMPANY',
        defaultParams: {
            user: {
                byId: {
                    id: params?.id
                }
            }
        },
        UseQueryOptions: {
            enabled: !!params?.id
        }
    })

    if(!user) return 

    return (
        <div>
            <UserProfile user={user} isAdmin={false} onUpdate={() => {}} />
        </div>
    )
}