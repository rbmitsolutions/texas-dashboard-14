import { cn } from "@/common/libs/shadcn/utils";
import { Header } from "./_components/header";
import { Sidebar } from "./_components/sideBar";

interface TexasLayoutProps {
    children: React.ReactNode;
}

export default function TexasLayout({ children }: TexasLayoutProps) {
    return (
        <main>
            <main className={cn("relative min-h-screen")}>
                {children}
            </main>
        </main>
    )
}