import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, PieChart as Chart, Pie, Tooltip } from 'recharts';
import { CustomTooltip } from './customToolTip';

interface IData {
    name: string
    fill: string
    value: number
}

interface PieChartProps {
    data: IData[]
    children: React.ReactNode
}

export default function PieChart({ data, children }: PieChartProps) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <ResponsiveContainer width="100%" height="100%" className='bg-background-soft p-4 min-w-8 min-h-8 h-full w-full'>
            <Chart width={600} height={600}>
               
                {children}
                <Tooltip
                    active
                    content={<CustomTooltip/>}
                />
            </Chart>
        </ResponsiveContainer>
    )
}
