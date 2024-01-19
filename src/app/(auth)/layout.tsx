import { ThemeToggle } from "@/common/providers/theme/toggle";
import Image from "next/image";

interface AuthLayoutProps {
    children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <main className="grid grid-cols-1 grid-rows-2 h-screen md:grid-cols-2 md:grid-rows-1">
            <aside className='flex-col-container-center shadow-2xl bg-[url("/img/background.png")] bg-center bg-no-repeat bg-cover dark:grayscale md:border-r-4' />
            <div className='flex-col-container-center justify-center relative'>
                <section className='flex-col-container relative space-y-6 p-6 w-full max-w-sm bg-background mt-[-300px] rounded-2xl md:mt-0'>
                    <div className='absolute top-4 right-4 rounded-md'>
                        <ThemeToggle />
                    </div>
                    <div className='flex-col-container-center'>
                        <Image
                            src="/logo/bull-white.png"
                            alt="Texas Logo"
                            width={140}
                            height={140}
                            className='invert dark:invert-0'
                        />
                        <h1 className='text-2xl'>Texas Steakout</h1>
                        <h3 className='mt-[-8px]'>Painel Control</h3>
                    </div>
                    {children}
                </section>
            </div>
        </main>
    )
}