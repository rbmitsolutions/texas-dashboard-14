//fetch
import { getRosterTask } from "@/common/libs/company/actions/rosterTask"
import FormContainer from "./_components/formContainer"


export default async function Task({ params }: { params: { task_id: string } }) {
    const data = await getRosterTask({
        rosterTask: {
            id: params.task_id
        }
    })

    return (
        <FormContainer form={data?.form} rosterTask={data?.task} />
    )
}