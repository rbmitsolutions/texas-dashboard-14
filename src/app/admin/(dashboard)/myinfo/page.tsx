'use client'
import { useGETUserDataHooks, usePUTUserDataHooks } from "@/hooks/user/useUserDataHooks"
import UserProfile from "@/components/common/forms/user"

export default function MyInfo() {
    const {
        userDetails: user,
        refetchUserData
    } = useGETUserDataHooks({
        query: 'DETAILS',
        defaultParams: {
            user: {
                byId: {
                    id: 'id'
                }
            }
        },
    })

    const {
        updateuserData,
    } = usePUTUserDataHooks({
        query: 'DETAILS',
        toRefetch: refetchUserData
    })

    if(!user) return 

    return (
        <div>
            <UserProfile user={user} isAdmin={false} onUpdate={updateuserData} />
        </div>
    )
}

