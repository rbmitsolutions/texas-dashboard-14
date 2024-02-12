'use client'
import { useRouter } from "next/navigation"
import { useEffect } from "react"

//todo: fix it
export default function NotFoundPage() {
    const { push } = useRouter()
    useEffect(() => {
        push('/admin/roster')
    }, [push])
    return <div>not found</div>
}