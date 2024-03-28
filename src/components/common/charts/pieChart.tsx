import React, { useEffect, useState } from 'react';
import {  ResponsiveContainer, PieChart as Chart, Pie } from 'recharts';

interface IData {
    title: string
    fill: string
    value: number
}

interface PieChartProps {
    data: IData[]
    
}

export default function PieChart({ data }:PieChartProps) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <ResponsiveContainer width="100%" height="100%" className='bg-background-soft p-4 min-w-8 min-h-8 h-full w-full'>
             <Chart width={400} height={400}>
                <Pie
                    dataKey="value"
                    startAngle={360}
                    endAngle={0}
                    data={data}
                    outerRadius={80}
                    label
                />
            </Chart>
        </ResponsiveContainer>
    )
}

     {/* <Chart width={300} height={40} data={data}>
                <Bar 
                    dataKey='value' 
                />
                <YAxis />
                <XAxis dataKey='title'/>
                <CartesianGrid strokeDasharray="5 5" />
                <Tooltip content={<CustomTooltip />}/>
            </Chart>  */}
            
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="flex-col-container gap-2 p-4 shadow-sm rounded-md bg-slate-50 dark:bg-slate-900">
                <p className="capitalize text-primary font-bold">{label}</p>
                <p className="">{payload[0].value}</p>
            </div>
        );
    }

    return null;
}

// export default class Example extends PureComponent {

//     render() {
//         return (
      
//     );
//     }
// }
