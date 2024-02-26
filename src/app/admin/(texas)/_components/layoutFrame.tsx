import { cn } from "@/common/libs/shadcn/utils";

//libs
import Icon from "@/common/libs/lucida-icon";

//components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/common/providers/theme/toggle";
import SignOut from "../../../../components/common/signOut";
import LinkButton from "@/components/common/linkButton";
import { Button } from "@/components/ui/button";
import { Sidebar } from "./sideBar";

//store
import { useSideBarStore } from "@/store/sideBar";

//hooks
import { useAuthHooks } from "@/hooks/useAuthHooks";
import { IToken } from "@/common/types/auth/auth.interface";
import { useRouter } from "next/navigation";
interface LayoutFrameProps {
    navigation: {
        icon?: {
            title: string
            icon: React.ReactElement
        }
        return?: {
            path?: string
            action?: () => void
        }
        placement?: 'left' | 'right' | 'top' | 'bottom'
        content: React.ReactNode
    }
    rightNavigation?: {
        icon: React.ReactElement
        title: string
        placement?: 'left' | 'right' | 'top' | 'bottom'

        content: React.ReactNode
    }
    main?: {
        header: React.ReactNode
    }
    children: React.ReactNode;
    user: IToken
}

export default function LayoutFrame({ navigation, user, rightNavigation, children, main }: LayoutFrameProps) {
    const { push } = useRouter()
    const gridFrame = rightNavigation ? 'grid-cols-1 md:grid-cols-[200px,1fr,340px]' : 'grid-cols-1 md:grid-cols-[200px,1fr]'
    const defaultCss = 'h-screen p-4 scrollbar-thin overflow-auto'
    const { isOpen, toggleSideBar } = useSideBarStore()

    return (
        <div className={cn("grid", gridFrame)}>
            <div className={cn('hidden bg-background-soft md:block', defaultCss)}>
                <header className='flex items-center justify-between'>
                    <Button size='icon' variant='outline' className='h-8 w-8' onClick={toggleSideBar}>
                        <Icon name='List' size={14} />
                    </Button>
                    <Sidebar />
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
                {main?.header &&
                    <div className='h-[120px] px-4 pt-4'>{main?.header}</div>
                }
                <div className={cn(main?.header ? 'h-[calc(100vh-140px)] scrollbar-thin overflow-auto p-4' : defaultCss)}>
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