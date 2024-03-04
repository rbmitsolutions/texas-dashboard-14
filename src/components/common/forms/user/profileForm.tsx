import { useEffect, useState } from "react";
import { UseMutateFunction } from "react-query";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ImageCropper from "@/components/common/imageCropper"
import { IUser } from "@/common/types/user/user.interface";
import { Skeleton } from "@/components/ui/skeleton";
import IconText from "../../iconText";

//hooks
import { IPUTUserBody } from "@/hooks/user/IPutUserDataHooks.interface";
import { useAuthHooks } from "@/hooks/useAuthHooks";

interface ProfileFormProps {
    user: IUser
    isAdmin: boolean
    onUpdate: UseMutateFunction<any, any, IPUTUserBody, unknown>
}

export default function ProfileForm({ user, onUpdate }: ProfileFormProps) {
    const { user: userToken, setUser } = useAuthHooks()
    const [preRendered, setPreRendered] = useState<boolean>(false);

    const onImageUpload = async (image: string): Promise<void> => {
        await onUpdate({
            details: {
                id: user?.id,
                profile_image: image
            }
        }, {
            onSuccess: (data) => {
                const user: IUser = data
                userToken && setUser({
                    ...userToken,
                    profile_image: user?.profile_image || ''
                })
            }
        })
    }

    const onImageDelete = async (): Promise<void> => {
        await onUpdate({
            details: {
                id: user?.id,
                profile_image: null
            }
        }, {
            onSuccess: (data) => {
                userToken && setUser({
                    ...userToken,
                    profile_image: ''
                })
            }
        })
    }

    useEffect(() => {
        setPreRendered(true);
    }, [])

    if (!preRendered) {
        return <ProfileForm.Skeleton />;
    }

    return (
        <div className='relative'>
            <div className='flex-col-container items-center hidden h-80 border-2 p-4 rounded-xl  bg-[url("/img/background.png")] bg-center bg-no-repeat bg-cover dark:grayscale md:block' />
            <div className='relative flex flex-col items-center gap-8 bg-background p-4 rounded-xl border-2 md:absolute md:top-32 md:left-8 md:flex-row md:items-start md:shadow-lg'>
                <div className='flex flex-col items-center r-2 max-w-40'>
                    <ImageCropper
                        cropShape="round"
                        image={user?.profile_image}
                        cropSize={{ width: 250, height: 250 }}
                        onSave={onImageUpload}
                        onRemove={onImageDelete}
                    >
                        <Avatar className='h-40 w-40 relative'>
                            <AvatarImage src={user?.profile_image} alt={user?.name} />
                            <AvatarFallback className="hover:bg-slate-800">
                                <p className='text-2xl group-hover:hidden'>
                                    {user && user?.name?.split('')[0]}
                                </p>
                            </AvatarFallback>
                        </Avatar>
                    </ImageCropper>
                    <h1 className='capitalize text-center'>{user?.name?.toLowerCase()}</h1>
                    <h1 className='capitalize text-sm text-center'>{user?.role?.title?.toLowerCase()}</h1>
                    <IconText
                        icon="Key"
                        text={`Roster: ${user?.roster_password}`}
                        className='mt-1'
                    />
                </div>
            </div>
        </div>
    )
}

ProfileForm.Skeleton = function SignInformSkeleton() {
    return (
        <div className='relative'>
            <Skeleton className='hidden h-80 border-2 p-4 rounded-xl md:block' />
            <Skeleton className="flex w-full h-56 md:absolute md:top-1/2 md:left-8 md:flex-row md:items-start md:shadow-lg md:w-80" />
        </div>
    )
}
