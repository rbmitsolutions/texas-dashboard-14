//libs
import { getFilesAsUser } from "@/common/libs/user/actions/filesAsUser"

//components
import ContractComponent from "./_components/contractComponent"
import RosterComponent from "./_components/rosterComponent"

//interfaces
import { IFiles } from "@/common/types/company/files.interface"

export default async function Roster() {
    // const contract = await getFilesAsUser({
    //     byKeyAs: {
    //         as: 'contract',
    //         type: 'pdf',
    //         key: ''
    //     }
    // }) as IFiles

    return (
        <>
            <RosterComponent />
            {/* {contract ?
                <ContractComponent contract={contract}/>
                :
                <RosterComponent />
            } */}
        </>
    )
}