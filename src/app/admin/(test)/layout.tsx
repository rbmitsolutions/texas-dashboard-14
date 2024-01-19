interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <main className="grid grid-cols-1 grid-rows-2 h-screen md:grid-cols-2 md:grid-rows-1 bg-blue-200">
            <h1 className='text-4xl'>Apps Layout</h1>
            <div className='flex-col-container-center relative'>
                {children}
            </div>
        </main>
    )
}