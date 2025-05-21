type CalendarProps = {
    title: string;
    value: number;
};

export default function StatCard({ title, value }: CalendarProps) {
    return (
        <div>
            <h2>{title}</h2>
            <p>{value}</p>
        </div>
    );
}