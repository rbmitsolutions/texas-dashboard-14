export default function Task ({ params }: { params: { task: string, roster_id: string } }) {
    return (
        <div>
            <h1>Task: {params.task}</h1>
            <h1>Roster ID: {params.roster_id}</h1>
        </div>
    )
}