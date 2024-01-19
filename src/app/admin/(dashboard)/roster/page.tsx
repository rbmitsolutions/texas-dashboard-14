'use client'
import Image from 'next/image';

//components
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { useAuthHooks } from '@/hooks/useAuthHooks';


export default function Roster() {
    const { user } = useAuthHooks()
    return (
        <section className='flex-col-container h-[2000px]'>
        </section>
    )
}