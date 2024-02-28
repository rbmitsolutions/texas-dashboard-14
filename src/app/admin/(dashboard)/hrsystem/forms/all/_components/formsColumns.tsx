"use client"
import { ColumnDef } from "@tanstack/react-table"
import Image from "next/image"

import InfoBadge from "@/components/common/infoBadge"
import LinkButton from "@/components/common/linkButton"
import { IForm } from "@/common/types/company/form.interface"
import { IToken } from "@/common/types/auth/auth.interface"
import { DeleteDialogButton } from "@/components/common/deleteDialogButton"
import { UseMutateFunction } from "react-query"
import { IDELETECompanyDataBody } from "@/hooks/company/IDeleteCompanyDataHooks.interface"
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

interface FormsColumnsTableProps {
    deleteForm: UseMutateFunction<void, any, IDELETECompanyDataBody, unknown>
    user: IToken
}

export const formsColumnsTable = ({
    deleteForm,
    user
}: FormsColumnsTableProps): ColumnDef<IForm>[] => {
    return [
        {
            id: 'title',
            accessorKey: 'Title',
            cell: ({ row }) => {
                return (
                    <div className="flex-container-center">
                        {row?.original?.title}
                    </div>
                )
            },
            size: 200,
        },
        {
            id: 'section',
            accessorKey: 'Section',
            cell: ({ row }) => {
                return (
                    <div className="flex-container-center">
                        {row?.original?.section?.title}
                    </div>
                )
            },
            size: 150,
        },
        {
            id: 'created_by',
            accessorKey: 'Created By',
            cell: ({ row }) => {
                return (
                    <div className="flex-container-center">
                        {row?.original?.created_by}
                    </div>
                )
            },
            size: 600,
        },
        {
            accessorKey: "actions",
            header: "Actions",
            cell: ({ row }) => {
                return (
                    <div className="flex-container-center">
                        <LinkButton
                            href={`/admin/hrsystem/forms/all/${row?.original?.id}`}
                            icon="Pencil"
                            className="bg-orange-300 dark:!bg-orange-400"
                        />

                        <DeleteDialogButton
                            onDelete={async () => await deleteForm({
                                form: {
                                    id: row?.original?.id
                                }
                            })}
                            buttonProps={{
                                size: 'iconSm'
                            }}
                            isDisabled={row?.original?.created_by_id !== user?.user_id}
                        />
                    </div>
                )
            },
            size: 120,
        },

    ]
}