'use client'
import { useEffect, useState } from "react"

//components
import ContractComponent from "./_components/contractComponent"
import RosterComponent from "./_components/rosterComponent"

//hooks
import { useAuthHooks } from "@/hooks/useAuthHooks"

//api
import { api } from "@/common/libs/axios/api"

//interfaces
import { EndPointsTypes } from "@/common/types/routers/endPoints.types"
import { IFiles } from "@/common/types/company/files.interface"

export default function Roster() {
    const [contract, setContract] = useState<IFiles | null>(null)
    const { user } = useAuthHooks()

    const getContract = async (id: string) => {

        if (!id) return
        const paramsUrl = new URLSearchParams({
            files: JSON.stringify({
                byKeyAs: {
                    as: 'contract',
                    type: 'pdf',
                    key: id
                }
            })
        })

        try {
            const { data } = await api.get(`${EndPointsTypes['USER_FILES_ENDPOINT']}?${paramsUrl}`)
            setContract(data)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getContract(user?.user_id)
    }, [user])
    
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
