'use client'

import { api } from "@/common/libs/axios/api"
import { useState } from "react"

export default function HiddenPage() {
    const [data, setData] = useState()

    const fetchIps = async () => {
        try {
            const { data } = await api.get('/user/ips')
            setData(data)
        } catch (err) {
            console.log(err)
        }
    }
    return (
        <div>
            <button onClick={fetchIps}>Fetch IPs</button>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    )
}