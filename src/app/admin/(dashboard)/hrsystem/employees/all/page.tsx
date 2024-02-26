'use client'

//components
import { userColumnsTable } from "./_components/userColumnsTable"
import SearchInput from "@/components/common/searchInput"
import SendEmail from "@/components/common/sendEmail"
import IconText from "@/components/common/iconText"
import { UserTable } from "./_components/userTable"
import SendSms from "@/components/common/sendSms"
import Wrap from "@/components/common/wrap"

//hooks
import { useGETCompanyDataHooks } from "@/hooks/company/companyDataHooks"
import { useGETUserDataHooks } from "@/hooks/user/useUserDataHooks"

export default function Employees() {
    const {
        allUsers,
        setGETUserDataParams,
        GETUserDataParams,
        isUserDataLoading
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
        isCompanyDataLoading: isDepartamentsLoading
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

    return (
        <div className='flex flex-col'>
            <div>
                <IconText
                    icon="Users"
                    text='Group actions'
                />
                <div className='grid grid-cols-[1fr,auto,auto] gap-2 border-2 p-4 rounded-lg mt-2 bg-background-soft'>
                    <SearchInput
                        onSearchChange={e => setGETUserDataParams(prev => ({
                            user: {
                                all: {
                                    ...prev.user?.all,
                                    name: e
                                }
                            }
                        }))}
                        value={GETUserDataParams?.user?.all?.name || ''}
                        placeholder="Search by name"
                        custom="max-w-sm"
                    />
                    <SendEmail
                        contacts={allUsers?.data?.filter(u => {
                            return {
                                id: u?.id,
                                name: u?.name,
                                email: u?.email
                            }
                        })}
                    />
                    <SendSms
                        contacts={allUsers?.data?.map(u => {
                            return {
                                id: u?.id,
                                name: u?.name,
                                contact_number: u?.contact_number || ''
                            }
                        }).filter(u => u.contact_number)}
                    />
                </div>
            </div>
            <Wrap
                isLoading={isDepartamentsLoading || isUserDataLoading}
            >
                {allDepartaments?.data?.map(d => {
                    const users = allUsers?.data?.filter(u => u?.role?.departament_id === d.id)
                    return (
                        <UserTable
                            key={d.id}
                            departament={d}
                            columns={userColumnsTable}
                            data={users || []}
                        />
                    )
                })}
            </Wrap>

        </div>
    )
}