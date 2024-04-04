'use client'
//libs

//components
import ContractComponent from "./_components/contractComponent"
import RosterComponent from "./_components/rosterComponent"

//interfaces
import { useGETUserDataHooks } from "@/hooks/user/useUserDataHooks"

export default function Roster() {
    const {
        userFile: contract
    } = useGETUserDataHooks({
        query: 'USER_FILES',
        defaultParams: {
            files: {
                byKeyAs: {
                    as: 'contract',
                    type: 'pdf',
                    key: ''
                }
            }
        },
    })

    return (
        <>
            {contract ?
                <ContractComponent contract={contract}/>
                :
                <RosterComponent />
            }
        </>
    )
}
