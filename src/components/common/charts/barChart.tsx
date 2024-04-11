import React from 'react';
import { Bar, ResponsiveContainer, BarChart as Chart, YAxis, XAxis, CartesianGrid, Tooltip } from 'recharts';
import { CustomLegend, CustomTooltip } from './customToolTip';

interface IData {
    [key: string]: any
}

interface BarChartProps {
    data: IData[]
    legend?: string
    children: React.ReactNode
}

export default function BarChart({ data, legend, children }: BarChartProps) {
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <div className='flex-col-container gap-0 items-center bg-background-soft p-4 min-w-8 min-h-8 h-full w-full'>
            {legend && CustomLegend(legend)}
            <ResponsiveContainer width="100%" height="100%" className='-ml-8'>
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
        </div>
    )
}
