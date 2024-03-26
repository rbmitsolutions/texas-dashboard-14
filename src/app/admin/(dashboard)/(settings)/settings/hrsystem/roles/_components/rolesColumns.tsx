"use client"
import { NavigateOptions } from "next/dist/shared/lib/app-router-context.shared-runtime"
import { UseMutateFunction } from "react-query"

//components
import { DeleteDialogButton } from "@/components/common/deleteDialogButton"
import { RedirectTo } from "@/common/types/routers/endPoints.types"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import CreateRoleForm from "./createRoleForm"

//interfaces
import { IDELETECompanyDataBody } from "@/hooks/company/IDeleteCompanyDataHooks.interface"
import { IDepartments } from "@/common/types/company/departaments.interface"
import { IRoles } from "@/common/types/company/companyDetails.interface"
import { IPUTCompanyBody } from "@/hooks/company/IPutCompanyDataHooks.interface"

interface RolesColumnsTableProps {
    onDelete: UseMutateFunction<void, any, IDELETECompanyDataBody, unknown>
    redirectTo: (href: string, options?: NavigateOptions | undefined) => void
    onUpdate: UseMutateFunction<any, any, IPUTCompanyBody, unknown>
    departments: IDepartments[]
    showOnlyWorking: boolean
}

export const rolesColumnsTable = ({
    onDelete,
    redirectTo,
    onUpdate,
    departments,
}: RolesColumnsTableProps): ColumnDef<IRoles>[] => {
    return [
        {
            id: "title",
            accessorKey: "Title",
            size: 80,
            cell: ({ row }) => {
                return (
                    <h2 className='capitalize'>{row?.original?.title}</h2>
                )
            }
        },
        {
            id: "users",
            accessorKey: "Employees",
            size: 400,
            cell: ({ row }) => {
                return (
                    <div className='flex-container flex-wrap'>
                        {row?.original?.users?.map(u => {
                            return (
                                <Badge
                                    key={u.id}
                                    title={u.name}
                                    className='capitalize cursor-pointer'
                                    onClick={() => redirectTo(RedirectTo.USER_PROFILE + '/' + u.id)}
                                >{u?.name}</Badge>
                            )
                        })}
                    </div>
                )
            }
        },

        {
            accessorKey: "actions",
            header: "Actions",
            cell: ({ row }) => {
                return (
                    <div className="flex-container-center">
                        <CreateRoleForm
                            onUpdate={onUpdate}
                            departments={departments}
                            role={row?.original}
                        />
                        <DeleteDialogButton
                            onDelete={async () => await onDelete({
                                role: {
                                    id: row?.original?.id
                                }
                            })}
                            isDisabled={true}
                        />
                    </div>
                )
            },
            size: 40,
        },

    ]
}