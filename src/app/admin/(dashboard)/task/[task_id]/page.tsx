'use client'

//components
import FormContainer from "./_components/formContainer"

//hooks
import { useGETCompanyDataHooks } from "@/hooks/company/companyDataHooks"


export default function Task({ params }: { params: { task_id: string } }) {
    const {
        companyRosterTask: rosterTask,
    } = useGETCompanyDataHooks({
        query: 'ROSTER_TASKS',
        defaultParams: {
            roster: {
                rosterTask: {
                    id: params.task_id
                }
            }
        },
        UseQueryOptions: {
            enabled: !!params.task_id
        }
    })

    return (
        <FormContainer form={rosterTask?.form} rosterTask={rosterTask?.task} />
    )
}