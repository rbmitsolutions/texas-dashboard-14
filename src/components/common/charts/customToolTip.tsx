export const CustomTooltip = ({ active, payload, label }: any) => {
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