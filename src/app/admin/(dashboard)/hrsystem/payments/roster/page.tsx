'use server'
import { getDepartments } from "@/common/libs/company/actions/departaments"
import RosterPaymentsPageComponents from "./_components"

export default async function RosterPaymentsPage() {
    const departments = await getDepartments({
        all: {
            pagination: {
                take: 500,
                skip: 0
            }
        }
    })

    return (
        <RosterPaymentsPageComponents departments={departments?.data} />
    )
}