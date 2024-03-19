import { cn } from "@/common/libs/shadcn/utils";
import { icons } from "lucide-react";

//libs
import Icon from "@/common/libs/lucida-icon";

//components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sidebar } from "../../(dashboard)/_components/sideBar";
import { ThemeToggle } from "@/common/providers/theme/toggle";
import SignOut from "../../../../components/common/signOut";
import { Button } from "@/components/ui/button";
import ExtraSideBar from "./extraSideBar";

//store
import { useSideBarStore } from "@/store/sideBar";

//hooks
import { IToken } from "@/common/types/auth/auth.interface";
import { useRouter } from "next/navigation";
import DefaultPrinter from "./defaultPrinter";
import { IPrinters } from "@/common/types/restaurant/printers.interface";
interface LayoutFrameProps {
    navigation: {
        defaultPrinter?: IPrinters[]
        icon: {
            title: string
            icon: keyof typeof icons
            extraIcon?: React.ReactNode
        }
        return?: {
            path?: string
            action?: () => void
        }
        content: React.ReactNode
    }
    rightNavigation?: {
        icon: {
            title: string
            icon: keyof typeof icons
            extraIcon?: React.ReactNode
        }
        content: React.ReactNode
    }
    children: React.ReactNode;
    user: IToken
}

export default function LayoutFrame({ navigation, user, rightNavigation, children }: LayoutFrameProps) {
    const { push } = useRouter()
    const gridFrame = rightNavigation ? 'grid-cols-1 md:grid-cols-[200px,1fr,340px]' : 'grid-cols-1 md:grid-cols-[200px,1fr]'
    const defaultCss = 'h-screen p-4 scrollbar-thin overflow-auto'
    const { toggleSideBar } = useSideBarStore()

    return (
        <div className={cn("grid", gridFrame)}>
            <Sidebar alwaysFixed={true} />
            <div className={cn('hidden bg-background-soft md:block', defaultCss)}>
                <header className='flex items-center justify-between'>
                    <div className='space-x-2'>
                        <Button size='icon' variant='outline' className='h-8 w-8' onClick={toggleSideBar}>
                            <Icon name='List' size={14} />
                        </Button>
                        {navigation?.defaultPrinter &&
                            <DefaultPrinter
                                printers={navigation?.defaultPrinter}
                            />
                        }
                    </div>
                    {navigation?.return &&
                        <Button
                            onClick={() => {
                                navigation?.return?.action && navigation?.return?.action()
                                navigation?.return?.path && push(navigation?.return?.path)
                            }}
                            size='iconExSm'
                        >
                            <Icon name='ChevronLeft' size={14} />
                        </Button>
                    }
                </header>
                <main className='max-h-[calc(100vh-140px)] scrollbar-thin h-full mt-4 overflow-auto '>
                    {navigation?.content}
                </main>
                <footer>
                    <div className='flex-container-center justify-end mt-4'>
                        <Avatar className='h-9 w-9'>
                            <AvatarImage src={user?.profile_image} alt={user?.name} />
                            <AvatarFallback>
                                {user && user?.name?.split('')[0]}
                            </AvatarFallback>
                        </Avatar>
                        <ThemeToggle />
                        <SignOut />
                    </div>
                </footer>
            </div>

            <div>
                <div className={cn(defaultCss, '')}>
                    <div className='flex justify-between items-center sticky mb-4 shadow-lg -top-4 h-16 px-4 bg-background  md:hidden'>
                        <div className='flex-container-center'>
                            <Button size='icon' variant='outline' className='h-8 w-8' onClick={toggleSideBar}>
                                <Icon name='List' size={14} />
                            </Button>
                            <ExtraSideBar
                                content={navigation?.content}
                                icon={navigation?.icon.icon}
                                title={navigation?.icon.title}
                                side='left'
                                extraIcon={navigation?.icon.extraIcon}
                            />
                            {navigation?.return &&
                                <Button
                                    onClick={() => {
                                        navigation?.return?.action && navigation?.return?.action()
                                        navigation?.return?.path && push(navigation?.return?.path)
                                    }}
                                    size='iconExSm'
                                >
                                    <Icon name='ChevronLeft' size={14} />
                                </Button>
                            }
                        </div>
                        <div className='flex-container-center'>
                            <SignOut />
                            <Avatar className='h-9 w-9'>
                                <AvatarImage src={user?.profile_image} alt={user?.name} />
                                <AvatarFallback>
                                    {user && user?.name?.split('')[0]}
                                </AvatarFallback>
                            </Avatar>
                            {rightNavigation?.content && rightNavigation?.icon &&
                                <ExtraSideBar
                                    content={rightNavigation?.content}
                                    icon={rightNavigation?.icon.icon}
                                    title={rightNavigation?.icon.title}
                                    extraIcon={rightNavigation?.icon.extraIcon}
                                />
                            }

                        </div>
                    </div>
                    {children}
                </div>
            </div>
            {rightNavigation &&
                <div className={cn('hidden bg-background-soft md:block', defaultCss)}>
                    {rightNavigation?.content}
                </div>
            }
        </div>
    )
}