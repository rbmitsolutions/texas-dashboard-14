import { getRequests } from "@/common/libs/company/actions/requests"
import { IRequests } from "@/common/types/company/requests.interface"
import RequestDisplay from "./_components/requestDisplay"

export default async function RequestPage({ params }: { params: { id: string } }) {
    const request = await getRequests({
        byId: {
            id: params?.id,
            include:{
                user: '1'
            }
        }
    }) as IRequests

    return (
        <RequestDisplay request={request} />
    )
}