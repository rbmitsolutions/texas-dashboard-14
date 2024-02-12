import { getRoles } from "@/common/libs/company/actions/roles";
import UserProfileAsAdmin from "./_components/userProfileAsAdmin";

export default async function User({ params }: { params: { id: string } }): Promise<JSX.Element> {
    const roles = await getRoles({
        all: {
            pagination: {
                take: 200,
                skip: 0
            },
        }
    })

    return (
        <UserProfileAsAdmin
            user_id={params?.id}
            roles={roles?.data}
        />
    )
}