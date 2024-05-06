'use client'
import { cn } from "@/common/libs/shadcn/utils";
import routers from "@/routes";
import { useEffect, useState } from "react";
import Image from "next/image";

//components
import UpdatePasswordForm from "@/components/common/forms/user/_components/updatePasswordForm";
import { NavbarButton } from "./_components/navBarButtons";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Icon from "@/common/libs/lucida-icon";

//hooks
import { useAuthHooks } from "@/hooks/useAuthHooks";

//store
import { useGETUserDataHooks, usePOSTUserDataHooks, usePUTUserDataHooks } from "@/hooks/user/useUserDataHooks";
import { useSideBarStore } from "@/store/sideBar";

//interface
import { IUser } from "@/common/types/user/user.interface";
import { IUserProfileCompletedResponse } from "@/hooks/user/IGetUserDataHooks.interface";
import UploadImportantDocument from "./_components/uploadImportantDocument";
import { IFilesAs } from "@/common/types/company/files.interface";

interface SidebarProps {
    alwaysFixed?: boolean
}
export function Sidebar({ alwaysFixed = false }: SidebarProps) {
    const { user } = useAuthHooks()
    const { isOpen, toggleSideBar } = useSideBarStore()
    const [preRendered, setPreRendered] = useState<boolean>(false);
    const [userProfileCompleted, setUserProfileCompleted] = useState<IUserProfileCompletedResponse>({
        id: '',
        passport_uploaded: true,
        password_updated: true,
        poa_uploaded: true,
        pps_uploaded: true,
    });

    useEffect(() => {
        setPreRendered(true);
    }, [])

    //todo: remove it and use it on the token
    const {
        refetchUserData: toRefetch
    } = useGETUserDataHooks({
        query: 'DETAILS',
        defaultParams: {
            user: {
                profileCompleted: {
                    id: ''
                }
            }
        },
        UseQueryOptions: {
            onSuccess: (data) => {
                const response: IUserProfileCompletedResponse = data as any
                setUserProfileCompleted(response)
            }
        }
    })

    const {
        updateuserData: updateDetails,
    } = usePUTUserDataHooks({
        query: 'DETAILS',
        toRefetch
    })

    const {
        createUserData: uploadFile,
        isCreateUserDataLoading: isUploadFileLoading
    } = usePOSTUserDataHooks({
        query: 'USER_FILES',
        toRefetch
    })

    if (!preRendered) {
        return <Sidebar.Skeleton toggleSidebar={toggleSideBar} isOpen={isOpen} />;
    }

    return (
        <>
            {!userProfileCompleted?.password_updated &&
                <UpdatePasswordForm
                    user={{
                        id: user?.user_id
                    } as IUser}
                    onUpdate={updateDetails}
                    alwaysOpen={!userProfileCompleted?.password_updated}
                />
            }

            {!userProfileCompleted?.passport_uploaded &&
                <UploadImportantDocument
                    user={user}
                    docAs={IFilesAs.USER_PASSPORT}
                    uploadFile={uploadFile}
                    isLoading={isUploadFileLoading}
                />
            }
            {!userProfileCompleted?.poa_uploaded &&
                <UploadImportantDocument
                    user={user}
                    docAs={IFilesAs.USER_POA}
                    uploadFile={uploadFile}
                    isLoading={isUploadFileLoading}
                />
            }

            {!userProfileCompleted?.pps_uploaded &&
                <UploadImportantDocument
                    user={user}
                    docAs={IFilesAs.USER_PPS}
                    uploadFile={uploadFile}
                    isLoading={isUploadFileLoading}
                />
            }

            <div className={cn('fixed top-0 h-screen w-full z-40 bg-[rgba(0,0,0,0.15)] duration-75', isOpen ? "left-0" : 'left-[-100%]', alwaysFixed ? 'xl:fixed' : 'xl:hidden')} onClick={toggleSideBar} />
            <nav className={cn('fixed flex-col-container top-0 z-50 h-screen w-[80%] max-w-72 gap-10 py-8 px-4 transition-[left] bg-background duration-500 border-r-2 md:duration-300 xl:sticky xl:flex-col-container xl:w-full xl:gap-10', isOpen ? "left-0" : 'left-[-100%]', alwaysFixed && 'xl:fixed')}>
                <div className='flex-container-center'>
                    <Button size='icon' variant='outline' className='h-8 w-8 xl:hidden' onClick={toggleSideBar}>
                        <Icon name='List' size={14} />
                    </Button>
                    <Image src='/logo/bull-white.png' className='block invert dark:invert-0' alt='logo' width={40} height={40} />
                    <h4 className='text-xs'>Texas Steakout</h4>
                </div>
                <ScrollArea className='h-full overflow-auto'>
                    {routers?.map(r => {
                        return <div key={r.name} className='my-2'>
                            <NavbarButton key={r.name} router={r} />
                        </div>
                    })}
                </ScrollArea>
            </nav>
        </>
    )
}

interface SidebarSkeleton {
    toggleSidebar: () => void;
    isOpen: boolean
}

Sidebar.Skeleton = function SidebarSkeleton({ toggleSidebar, isOpen }: SidebarSkeleton) {
    return (
        <nav className={cn('absolute top-0 h-screen z-20 bg-background w-[80%] p-4 border-r-2 transition-[left] duration-500 xl:sticky xl:w-52 xl:left-[-100%]', isOpen ? "left-0" : 'left-[-100%]')}>
            <Button size='icon' variant='outline' className='h-8 w-8 xl:hidden' onClick={toggleSidebar}>
                <Icon name='List' size={14} />
            </Button>
            <Skeleton className="w-full h-20 mb-8 mt-8" />
            <Skeleton className="w-full h-8 mt-4" />
            <Skeleton className="w-full h-8 mt-4" />
            <Skeleton className="w-full h-8 mt-4" />
            <Skeleton className="w-full h-8 mt-4" />
            <Skeleton className="w-full h-8 mt-4" />
            <Skeleton className="w-full h-8 mt-4" />
            <Skeleton className="w-full h-8 mt-4" />
            <Skeleton className="w-full h-8 mt-4" />
            <Skeleton className="w-full h-8 mt-4" />
            <Skeleton className="w-full h-8 mt-4" />
        </nav>
    )
}