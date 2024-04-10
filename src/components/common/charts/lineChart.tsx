import React from 'react';
import { ResponsiveContainer, YAxis, XAxis, CartesianGrid, Tooltip, AreaChart } from 'recharts';
import { CustomLegend, CustomTooltip } from './customToolTip';

export interface ILineChartData {
    [key: string]: any
}

interface LineChartProps {
    data: ILineChartData[]
    legend?: string
    children?: React.ReactNode
}

export default function LineChart({ data, legend, children }: LineChartProps) {
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <div className='flex-col-container gap-0 items-center bg-background-soft p-4 min-w-8 min-h-8 h-full w-full'>
             {legend && CustomLegend(legend)}
            <ResponsiveContainer width="100%" height="100%" className='-ml-8'>
                <AreaChart width={400} height={400} data={data}>
                    {children}
                    <YAxis />
                    <XAxis dataKey='name' fontSize={12} />
                    <CartesianGrid strokeDasharray="5 5" />
                    <Tooltip
                        cursor={{ fill: 'transparent' }}
                        content={<CustomTooltip />}
                    />
                    <strong>oi</strong>
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}

