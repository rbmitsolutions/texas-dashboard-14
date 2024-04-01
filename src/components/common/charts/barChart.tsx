import React from 'react';
import { Bar, ResponsiveContainer, BarChart as Chart, YAxis, XAxis, CartesianGrid, Tooltip } from 'recharts';
import { CustomTooltip } from './customToolTip';

interface IData {
    [key: string]: string | number
}

interface BarChartProps {
    data: IData[]
    children: React.ReactNode
}

export default function BarChart({ data, children }: BarChartProps) {
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <ResponsiveContainer width="100%" height="100%" className='bg-background-soft p-4 min-w-8 min-h-8 h-full w-full'>
            <Chart width={300} height={40} data={data}>
                {children}
                <YAxis />
                <XAxis dataKey='name' />
                <CartesianGrid strokeDasharray="5 5" />
                <Tooltip
                    cursor={{ fill: 'transparent' }}
                    content={<CustomTooltip />} />
            </Chart>
        </ResponsiveContainer>
    )
}
