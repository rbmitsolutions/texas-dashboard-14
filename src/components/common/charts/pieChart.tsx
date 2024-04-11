import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, PieChart as Chart, Pie, Tooltip } from 'recharts';
import { CustomLegend, CustomTooltip } from './customToolTip';

interface PieChartProps {
    legend?: string
    children: React.ReactNode
}

export default function PieChart({ legend, children }: PieChartProps) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <div className='flex-col-container gap-0 items-center bg-background-soft p-4 min-w-8 min-h-8 h-full w-full'>
            {legend && CustomLegend(legend)}
            <ResponsiveContainer width="100%" height="100%" className='-ml-8'>
                <Chart width={600} height={600}>

                    {children}
                    <Tooltip
                        active
                        content={<CustomTooltip />}
                    />
                </Chart>
            </ResponsiveContainer>
        </div>
    )
}
