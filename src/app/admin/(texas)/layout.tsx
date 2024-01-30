'use client'
import { cn } from "@/common/libs/shadcn/utils";
import { TexasHooksContextProvider } from "@/context/texasContext/TexasContext";

interface TexasLayoutProps {
    children: React.ReactNode;
}

export default function TexasLayout({ children }: TexasLayoutProps) {
    return (
        <main>
            <main className={cn("relative min-h-screen")}>
                <TexasHooksContextProvider>
                    {children}
                </TexasHooksContextProvider>
            </main>
        </main>
    )
}