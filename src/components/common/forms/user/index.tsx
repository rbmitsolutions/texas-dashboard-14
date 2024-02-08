import { UseMutateFunction } from "react-query";

import DetailsForm from "./_components/detailsForm";
import ProfileForm from "./profileForm";

//components
import EmergencyContactForm from "./_components/emergencyContactForm";
import BankDetailsForm from "./_components/bankDetailsForm";
import VisaDetailsForm from "./_components/visaDetailsForm";
import UpdatePasswordForm from "./_components/updatePasswordForm";
import { Button } from "@/components/ui/button";
import UpdateRoleForm from "./_components/updateRoleForm";

//interface
import { IRoles } from "@/common/types/company/companyDetails.interface";
import { IPUTUserBody } from "@/hooks/user/IPutUserDataHooks.interface";
import { IUser } from "@/common/types/user/user.interface";
import IconText from "../../iconText";

interface UserProfileProps {
    user: IUser
    isAdmin: boolean
    onUpdate: UseMutateFunction<any, any, IPUTUserBody, unknown>
    roles?: IRoles[]
}
export default function UserProfile({ user, isAdmin, roles, onUpdate }: UserProfileProps) {
    return (
        <div className='flex-col-container gap-4'>
            <ProfileForm user={user} isAdmin={isAdmin} onUpdate={onUpdate} roles={roles} />
            <div className='md:h-20 md:pl-64'>
                <div className='flex-col-container'>
                    <IconText
                        icon="Key"
                        text={`Roster: ${user?.roster_password}`}
                    />
                    <UpdatePasswordForm user={user} onUpdate={onUpdate} />
                </div>
                {isAdmin &&
                    <>
                        <Button
                            leftIcon='Key'
                            onClick={async () => await onUpdate({
                                details: {
                                    id: user?.id,
                                    roster_password: '1'
                                }
                            })}
                        >
                            Update Roster Password
                        </Button>
                        {roles &&
                            <UpdateRoleForm user={user} onUpdate={onUpdate} roles={roles} />
                        }
                    </>
                }
            </div>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                <DetailsForm user={user} isAdmin={isAdmin} onUpdate={onUpdate} />
                <EmergencyContactForm user={user} isAdmin={isAdmin} onUpdate={onUpdate} />
                <BankDetailsForm user={user} isAdmin={isAdmin} onUpdate={onUpdate} />
            </div>
            <VisaDetailsForm user={user} isAdmin={isAdmin} onUpdate={onUpdate} />
        </div>
    )
}