import { getDepartments } from "@/common/libs/company/actions/departaments"
import { getDuties } from "@/common/libs/company/actions/duties"
import { getShifts } from "@/common/libs/company/actions/shifts"
import RosterContainer from "./_components"

export default async function RosterPage() {
    const duties = await getDuties({
        all: {
            pagination: {
                take: 500,
                skip: 0
            }
        }
    })
    const departaments = await getDepartments({
        all: {
            pagination: {
                take: 500,
                skip: 0
            }
        }
    })

    const shfits = await getShifts({
        all: {
            pagination: {
                take: 500,
                skip: 0
            },
        }
    })
    return (
        <RosterContainer
            departaments={departaments?.data || []}
            duties={duties?.data || []}
            forms={[]}
            shifts={shfits?.data || []}
        />
    )
}