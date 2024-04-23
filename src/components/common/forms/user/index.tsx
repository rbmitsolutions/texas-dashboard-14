import { UseMutateFunction } from "react-query";

import DetailsForm from "./_components/detailsForm";
import ProfileForm from "./profileForm";

//components
import EmergencyContactForm from "./_components/emergencyContactForm";
import UpdatePasswordForm from "./_components/updatePasswordForm";
import { DeleteDialogButton } from "../../deleteDialogButton";
import NewContractForm from "./_components/newContractForm";
import VisaDetailsForm from "./_components/visaDetailsForm";
import BankDetailsForm from "./_components/bankDetailsForm";
import UpdateRoleForm from "./_components/updateRoleForm";
import PaymentDetails from "./_components/paymentDetails";
import { Button } from "@/components/ui/button";

//interface
import { IRoles } from "@/common/types/company/companyDetails.interface";
import { IPUTUserBody } from "@/hooks/user/IPutUserDataHooks.interface";
import { IUser } from "@/common/types/user/user.interface";
import UserAnalytics from "./_components/analytics";
import RosterAnalytics from "./_components/analytics/rosterAnalytics";

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
            <div className='grid-container grid-cols-1 sm:grid-cols-2 md:pl-64 md:grid-cols-[repeat(auto-fit,minmax(200px,200px))] md:mb-6'>
                <UpdatePasswordForm
                    user={user}
                    onUpdate={onUpdate}
                    isAdmin={isAdmin}
                />
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
                            <>

                                <UpdateRoleForm user={user} onUpdate={onUpdate} roles={roles} />
                                <NewContractForm
                                    user={user}
                                    roles={roles}
                                />
                            </>
                        }

                        <DeleteDialogButton
                            buttonText="File"
                            onDelete={async () => await onUpdate({
                                details: {
                                    id: user?.id,
                                    status: 'Filled'
                                }
                            })}
                            undo={user?.status === 'Filled' ? {
                                buttonText: 'Unfile',
                                onUndo: async () => await onUpdate({
                                    details: {
                                        id: user?.id,
                                        status: 'Working'
                                    }
                                }),
                                description: 'This user will be unfiled and will be able to log in again, his password will be the default when you first log in.'
                            } : undefined}
                        >
                            <Button
                                leftIcon={user?.status === 'Filled' ? 'Undo' : 'FileArchive'}
                                variant={user?.status === 'Filled' ? 'green' : 'destructive'}
                            >
                                {user?.status === 'Filled' ? 'Unfile' : 'File Employee'}
                            </Button>
                        </DeleteDialogButton>
                    </>
                }
            </div>
            {isAdmin &&
                <>
                    <UserAnalytics user={user} isAdmin={isAdmin} />
                    <RosterAnalytics user={user} />
                    <PaymentDetails user={user} isAdmin={isAdmin} onUpdate={onUpdate} />
                </>
            }
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                <DetailsForm user={user} isAdmin={isAdmin} onUpdate={onUpdate} />
                <EmergencyContactForm user={user} isAdmin={isAdmin} onUpdate={onUpdate} />
                <BankDetailsForm user={user} isAdmin={isAdmin} onUpdate={onUpdate} />
            </div>
            <VisaDetailsForm user={user} isAdmin={isAdmin} onUpdate={onUpdate} />
        </div>
    )
}