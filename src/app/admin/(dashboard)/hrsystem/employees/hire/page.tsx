import { getRoles } from "@/common/libs/company/actions/roles";
import HireForm from "./_components/hireForm";

export default async function HirePage () {
    const roles = await getRoles({
        all: {
            pagination: {
                take: 200,
                skip: 0
            }
        }
    })
    return (
        <div>
            <HireForm roles={roles?.data}/>
        </div>
    )
}