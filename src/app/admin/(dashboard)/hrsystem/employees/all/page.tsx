'use client'
import { useGETCompanyDataHooks } from "@/hooks/company/companyDataHooks"
import { useGETUserDataHooks } from "@/hooks/user/useUserDataHooks"
import { userColumnsTable } from "./_components/userColumnsTable"
import { UserTable } from "./_components/userTable"

export default function Employees() {
    const {
        allUsers
    } = useGETUserDataHooks({
        query: "USER_COMPANY",
        keepParmas: true,
        defaultParams: {
            user: {
                all: {
                    status: 'Working',
                    include: {
                        role: '1'
                    },
                    pagination: {
                        take: 100,
                        skip: 0
                    }
                }
            }
        }
    })

    const {
        companyAllDepartaments: allDepartaments,
    } = useGETCompanyDataHooks({
        query: 'DEPARTAMENTS',
        defaultParams: {
            departments: {
                all: {
                    pagination: {
                        take: 100,
                        skip: 0
                    },
                    includes: {
                        roles: '1'
                    
                    }
                }
            }
        }
    })

    if (!allUsers || !allDepartaments) return null

    return (
        <div className='flex-col-container gap-8'>
            {allDepartaments?.data?.map(d => {
                const users = allUsers?.data?.filter(u => u?.role?.departament_id === d.id)
                return (
                    <UserTable
                        key={d.id}
                        departament={d}
                        columns={userColumnsTable}
                        data={users}
                    />
                )
            })}

        </div>
    )
}