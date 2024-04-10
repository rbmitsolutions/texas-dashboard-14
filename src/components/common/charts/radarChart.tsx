import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, RadarChart as Chart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import { CustomLegend, CustomTooltip } from './customToolTip';

interface IData {
    title: string
    value: number
}

interface RadarChartProps {
    data: IData[],
    legend?: string
    children: React.ReactNode
}


export default function RadarChart({ data, legend, children }: RadarChartProps) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <div className='flex-col-container gap-0 items-center bg-background-soft p-4 min-w-8 min-h-8 h-full w-full'>
            {legend && CustomLegend(legend)}
            <ResponsiveContainer width="100%" height="100%">
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
        </div>
    )
}
