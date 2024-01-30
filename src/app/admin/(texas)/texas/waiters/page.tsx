'use client'
import Image from 'next/image';

//components
import { ThemeToggle } from '@/common/providers/theme/toggle';
import LayoutFrame from '../../_components/layoutFrame';
import { useOrderSystemMenuStore } from '@/store/texas/menu';
import Link from 'next/link';

export default function Tables() {
    const { menu } = useOrderSystemMenuStore()
    console.log(menu)
    return (
        <LayoutFrame
            navigation={{
                content: (
                    <div>

                    </div>
                )
            }}

        >
            <Link href='/admin/texas/waiters/1'>
                Go to MENU
            </Link>
        </LayoutFrame>
    )
}