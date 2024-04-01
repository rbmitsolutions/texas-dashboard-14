export const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="flex-col-container gap-2 p-4 shadow-sm rounded-md bg-slate-50 dark:bg-slate-900">
                {label && <p className="capitalize text-primary font-bold">{label}</p>}
                {payload?.map((item: any, index: number) => {
                    return (
                        <div key={index}>
                            <p className="text-primary capitalize text-sm">{item?.name}</p>
                            <p className="">{item?.value}</p>
                        </div>
                    )
                })}
            </div>
        );
    }

    return null;
}

