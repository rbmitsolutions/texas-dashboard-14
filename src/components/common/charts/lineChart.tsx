import React from 'react';
import { ResponsiveContainer, YAxis, XAxis, CartesianGrid, Tooltip, AreaChart } from 'recharts';
import { CustomTooltip } from './customToolTip';

export interface ILineChartData {
    [key: string]: number | string
}

interface LineChartProps {
    data: ILineChartData[]
    children?: React.ReactNode
}

export default function LineChart({ data, children }: LineChartProps) {
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <ResponsiveContainer width="100%" height="100%" className='bg-background-soft p-4 min-w-8 min-h-8 h-full w-full'>
            <AreaChart width={400} height={400} data={data}>
                {children}
                <YAxis />
                <XAxis dataKey='name' fontSize={12} />
                <CartesianGrid strokeDasharray="5 5" />
                <Tooltip
                    cursor={{ fill: 'transparent' }}
                    content={<CustomTooltip />} />
            </AreaChart>
        </ResponsiveContainer>
    )
}

