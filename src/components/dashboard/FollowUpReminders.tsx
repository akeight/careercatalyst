type RemindersProps = {
    title: string;
    value: number;
};

export default function StatCard({ title, value }: RemindersProps) {
    return (
        <div>
            <h2>{title}</h2>
            <p>{value}</p>
        </div>
    );
}