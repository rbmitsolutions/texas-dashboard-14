'use client'
import { useEffect } from "react"

//components
import ContractComponent from "./_components/contractComponent"
import RosterComponent from "./_components/rosterComponent"

//hooks
import { useAuthHooks } from "@/hooks/useAuthHooks"

//interfaces
import { useGETUserDataHooks } from "@/hooks/user/useUserDataHooks"

export default function Roster() {
    const { user } = useAuthHooks()
    const {
        userFile: contract,
        setGETUserDataParams: setUserData
    } = useGETUserDataHooks({
        query: 'USER_FILES',
        defaultParams: {
            files: {
                byKeyAs: {
                    as: 'contract',
                    type: 'pdf',
                    key: user?.user_id
                }
            }
        },
        UseQueryOptions: {
            enabled: !!user
        }
    })

    useEffect(() => {
        setUserData({
            files: {
                byKeyAs: {
                    as: 'contract',
                    type: 'pdf',
                    key: user?.user_id
                }
            }
        })
    }, [setUserData, user])
    return (
        <>
            {contract ?
                <ContractComponent contract={contract} />
                :
                <RosterComponent />
            }
        </>
    )
}
