import { cn } from "@/common/libs/shadcn/utils"

interface ErrorProps {
    className?: string
}

export default function Error({ className = '' }: ErrorProps): JSX.Element {
    return (
        <p data-testid='error-component' className={cn("text-xl", className)} >&#128557;</p>
    )
}