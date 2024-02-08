import { getDepartments } from "@/common/libs/company/actions/departaments"
import { getDuties } from "@/common/libs/company/actions/duties"
import { getShifts } from "@/common/libs/company/actions/shifts"
import RosterContainer from "./_components"
import { getForms } from "@/common/libs/company/actions/forms"

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

    const forms = await getForms({
        all: {
            pagination: {
                take: 500,
                skip: 0
            },
            orderBy: {
                key: 'title',
                order: 'asc'
            }
        }
    })

    return (
        <RosterContainer
            departaments={departaments?.data || []}
            duties={duties?.data || []}
            forms={forms?.data || []}
            shifts={shfits?.data || []}
        />
    )
}