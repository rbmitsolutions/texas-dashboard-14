import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, RadarChart as Chart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import { CustomTooltip } from './customToolTip';

interface IData {
    title: string
    value: number
}

interface RadarChartProps {
    data: IData[],
    children: React.ReactNode
}


export default function RadarChart({ data, children }: RadarChartProps) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <ResponsiveContainer width="100%" height="100%" className='bg-background-soft p-4 min-w-8 min-h-8 h-full w-full'>
            <Chart cx="50%" cy="50%" outerRadius="80%" data={data}>
                <PolarGrid />
                <PolarAngleAxis dataKey="title" />
                <PolarRadiusAxis />
                {children}
                <Tooltip
                    cursor={{ fill: 'transparent' }}
                    content={<CustomTooltip />} />
            </Chart>
        </ResponsiveContainer>
    )
}
