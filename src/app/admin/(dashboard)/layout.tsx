//components
import { Sidebar } from "./_components/sideBar";
import { Header } from "./_components/header";

//libs
import { cn } from "@/common/libs/shadcn/utils";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <main>
            <main className={cn("relative min-h-screen")}>
                <div className='grid grid-cols-1 max-w-screen-2xl m-auto sm:grid-cols-[200px,1fr]'>
                    <Sidebar />
                    <div className='flex-col-container overflow-auto'>
                        <Header />
                        <div className='px-4 pb-20'>
                            {children}
                        </div>
                    </div>
                </div>
            </main>
        </main>
    )
}

