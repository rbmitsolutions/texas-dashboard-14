import { cn } from "@/common/libs/shadcn/utils";
import { Sidebar } from "./sideBar";
import { useSideBarStore } from "@/store/sideBar";
import { Button } from "@/components/ui/button";
import Icon from "@/common/libs/lucida-icon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthHooks } from "@/hooks/useAuthHooks";
import { ThemeToggle } from "@/common/providers/theme/toggle";
import SignOut from "../../../../components/common/signOut";


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
}

export default function LayoutFrame({ navigation, rightNavigation, children, main }: LayoutFrameProps) {
    const { user } = useAuthHooks()
    const gridFrame = rightNavigation ? 'grid-cols-1 md:grid-cols-[240px,1fr,240px]' : 'grid-cols-1 md:grid-cols-[240px,1fr]'
    const defaultCss = 'h-screen p-4 scrollbar-thin overflow-auto'
    const { isOpen, toggleSideBar } = useSideBarStore()
    return (
        <div className={cn("grid", gridFrame)}>
            <div className={cn('hidden bg-background-soft md:block', defaultCss)}>
                <header>
                    <Button size='icon' variant='outline' className='h-8 w-8' onClick={toggleSideBar}>
                        <Icon name='List' size={14} />
                    </Button>
                    <Sidebar />
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
                    <h1>right</h1>
                </div>
            }
        </div>
    )
}