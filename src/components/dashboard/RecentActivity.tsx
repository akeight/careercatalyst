type RecentActivityProps = {
    title: string;
    value: number;
};

export default function RecentActivity({ title, value }: RecentActivityProps) {
    return (
        <div>
            <h2>{title}</h2>
            <p>{value}</p>
        </div>
    );
}