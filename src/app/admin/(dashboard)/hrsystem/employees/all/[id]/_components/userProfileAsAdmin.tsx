'use client'

//libs
import { isUserAuthorized } from "@/common/libs/user/isUserAuthorized"

//components
import UserProfile from "@/components/common/forms/user";

//hooks
import { useGETUserDataHooks, usePUTUserDataHooks } from "@/hooks/user/useUserDataHooks";
import { useAuthHooks } from "@/hooks/useAuthHooks"

//interfaces
import { IRoles } from "@/common/types/company/companyDetails.interface";
import { Permissions } from "@/common/types/auth/auth.interface"

interface UserProfileAsAdminProps {
    user_id: string,
    roles: IRoles[]
}
export default function UserProfileAsAdmin({ user_id, roles }: UserProfileAsAdminProps): JSX.Element {
    const { user: userToken } = useAuthHooks()

    const {
        userDetails: user,
        refetchUserData: toRefetch
    } = useGETUserDataHooks({
        query: 'USER_COMPANY',
        defaultParams: {
            user: {
                byId: {
                    id: user_id
                }
            }
        },
        UseQueryOptions: {
            enabled: !!user_id
        }
    })

    const {
        updateuserData: updateUserDetails,
    } = usePUTUserDataHooks({
        query: 'USER_COMPANY',
        toRefetch
    })

    if (!user) return <div />

    return (
        <div>
            <UserProfile 
            user={user} 
            isAdmin={isUserAuthorized(
                userToken,
                [Permissions.ADMIN, Permissions.ADMIN_GHOST]
            )} 
            roles={roles}
            onUpdate={updateUserDetails} />
        </div>
    )
}