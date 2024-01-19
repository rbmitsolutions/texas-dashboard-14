import Link from 'next/link';

//components
import { SignInForm } from './_components/signInForm';

export default function SignIn() {
    return (
        <div>
            <SignInForm />
            <Link href="/forgot" className="text-sm text-primary font-semibold">
                Forgot your password?
            </Link>
        </div>
    )
}