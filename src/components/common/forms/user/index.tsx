import { UseMutateFunction } from "react-query";

import DetailsForm from "./_components/detailsForm";
import ProfileForm from "./profileForm";

//components
import EmergencyContactForm from "./_components/emergencyContactForm";
import UpdatePasswordForm from "./_components/updatePasswordForm";
import VisaDetailsForm from "./_components/visaDetailsForm";
import BankDetailsForm from "./_components/bankDetailsForm";
import UpdateRoleForm from "./_components/updateRoleForm";
import { Button } from "@/components/ui/button";

//interface
import { IRoles } from "@/common/types/company/companyDetails.interface";
import { IPUTUserBody } from "@/hooks/user/IPutUserDataHooks.interface";
import { IUser } from "@/common/types/user/user.interface";

interface UserProfileProps {
    user: IUser
    isAdmin: boolean
    onUpdate: UseMutateFunction<any, any, IPUTUserBody, unknown>
    roles?: IRoles[]
}
export default function UserProfile({ user, isAdmin, roles, onUpdate }: UserProfileProps) {

    return (
        <div className='flex-col-container gap-4'>
            <ProfileForm user={user} isAdmin={isAdmin} onUpdate={onUpdate} />
            <div className='grid-container grid-cols-2 md:pl-64 md:grid-cols-[repeat(auto-fit,minmax(200px,200px))]'>
                <UpdatePasswordForm user={user} onUpdate={onUpdate} />
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
                            Roster Password
                        </Button>
                        {roles &&
                            <UpdateRoleForm user={user} onUpdate={onUpdate} roles={roles} />
                        }
                        <Button
                            leftIcon="FileArchive"
                            variant='destructive'
                        >File Employee</Button>
                    </>
                }
            </div>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 md:mt-4 lg:grid-cols-3'>
                <DetailsForm user={user} isAdmin={isAdmin} onUpdate={onUpdate} />
                <EmergencyContactForm user={user} isAdmin={isAdmin} onUpdate={onUpdate} />
                <BankDetailsForm user={user} isAdmin={isAdmin} onUpdate={onUpdate} />
            </div>
            <VisaDetailsForm user={user} isAdmin={isAdmin} onUpdate={onUpdate} />
        </div>
    )
}