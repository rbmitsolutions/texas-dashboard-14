import React from 'react';
import { Bar, ResponsiveContainer, BarChart as Chart, YAxis, XAxis, CartesianGrid, Tooltip } from 'recharts';
import { CustomTooltip } from './customToolTip';

interface IData {
    title: string
    fill: string
    value: number
}

interface BarChartProps {
    data: IData[]
    
}

export default function BarChart({ data }:BarChartProps) {
    const [mounted, setMounted] = React.useState(false)
    
    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <ResponsiveContainer width="100%" height="100%" className='bg-background-soft p-4 min-w-8 min-h-8 h-full w-full'>
          <Chart width={300} height={40} data={data}>
                <Bar 
                    dataKey='value' 
                    fill='fill'
                />
                <YAxis />
                <XAxis dataKey='title'/>
                <CartesianGrid strokeDasharray="5 5" />
                <Tooltip 
                cursor={{ fill: 'transparent' }}
                content={<CustomTooltip />}/>
            </Chart> 
        </ResponsiveContainer>
    )
}
