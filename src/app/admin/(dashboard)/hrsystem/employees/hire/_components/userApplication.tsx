
//components
import { userApplicationColumnsTable } from "./utils/userApplicationColumnsTable";
import { UserApplicationTable } from "./utils/userApplicationTable";
import Wrap from "@/components/common/wrap";

//interface
import { IUser } from "@/common/types/user/user.interface";

//hooks
import { useGETUserDataHooks } from "@/hooks/user/useUserDataHooks";

interface UserApplicationProps {
    selectUser: (user: IUser) => void
}

export default function UserApplication({ selectUser }: UserApplicationProps) {

    const {
        allUsers,
        setGETUserDataParams,
        GETUserDataParams,
    } = useGETUserDataHooks({
        query: "USER_COMPANY",
        keepParmas: true,
        defaultParams: {
            user: {
                all: {
                    status: 'Application',
                    include: {
                        role: '1',
                        job_application: "1",
                    },
                    pagination: {
                        take: 10,
                        skip: 0
                    },
                    orderBy: {
                        key: 'created_at',
                        order: 'desc'
                    }
                }
            }
        }
    })

    return (
        <Wrap
            header={{
                title: {
                    icon: 'Users',
                    title: 'User Applications'
                },
                pagination:{
                    onPageChange: (pagination) => setGETUserDataParams(prev => ({
                        user: {
                            all: {
                                ...prev?.user?.all,
                                pagination
                            
                            }
                        }
                    })),
                    pagination: allUsers?.pagination,
                    queryPagination: GETUserDataParams?.user?.all?.pagination!
                }
            }}
            actions={{
                searchInput: {
                    onSearchChange: (e) => setGETUserDataParams(prev => ({
                        user: {
                            all: {
                                ...prev?.user?.all,
                                where: {
                                    ...prev?.user?.all,
                                    name: e
                                }
                            }
                        }
                    })),
                    placeholder: "Search by name...",
                    value: GETUserDataParams?.user?.all?.name || '',
                    custom: 'max-w-sm relative'
                },
            }}
        >
            <UserApplicationTable
                columns={userApplicationColumnsTable({
                    selectUser
                })}
                data={allUsers?.data || []}
            />
        </Wrap>
    )
}