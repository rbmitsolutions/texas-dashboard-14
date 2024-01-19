import Link from "next/link";
import { ForgotPasswordForm } from "./_components/forgotPasswordForm";
import Icon from "@/common/libs/lucida-icon";

export default function Forgot() {
    return (
        <div>
            <ForgotPasswordForm />
            <Link href="/signin" className="flex items-center text-sm font-semibold">
                <Icon name='ArrowLeft' className="mr-2" />
                Back to Sign In
            </Link>
        </div>
    )
}