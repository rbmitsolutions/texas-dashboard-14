import React from 'react';
import { ResponsiveContainer, YAxis, XAxis, CartesianGrid, Tooltip, AreaChart, Area } from 'recharts';
import { CustomTooltip } from './customToolTip';

interface IData {
    title: string
    value: number
}

interface LineChartProps {
    data: IData[]

}

export default function LineChart({ data }: LineChartProps) {
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <ResponsiveContainer width="100%" height="100%" className='bg-background-soft p-4 min-w-8 min-h-8 h-full w-full'>
            <AreaChart width={400} height={400} data={data}>
                <Area
                    type='monotone'
                    dataKey='value'
                    fill='#075af56a'
                    stroke='#015cb1'
                />
                <YAxis />
                <XAxis dataKey='title' fontSize={12}/>
                <CartesianGrid strokeDasharray="5 5" />
                <Tooltip
                    cursor={{ fill: 'transparent' }}
                    content={<CustomTooltip />} />
            </AreaChart>
        </ResponsiveContainer>
    )
}

