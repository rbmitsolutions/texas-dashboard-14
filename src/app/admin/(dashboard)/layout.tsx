//components
import { Sidebar } from "./_components/sideBar";
import { Header } from "./_components/header";

//libs
import { cn } from "@/common/libs/shadcn/utils";

interface IDashboardLayout {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: IDashboardLayout) {
    return (
        <main>
            <main className={cn("relative min-h-screen")}>
                <div className='grid grid-cols-1 max-w-7xl m-auto sm:grid-cols-[200px,1fr]'>
                    <Sidebar  />
                    <div className='flex-col-container overflow-auto'>
                        <Header />
                        <div className='p-4 pb-20'>
                            {children}
                        </div>
                    </div>
                </div>
            </main>
        </main>
    )
}