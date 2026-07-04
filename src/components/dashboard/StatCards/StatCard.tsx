import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cssColorForStatus, type AppStatus } from "@/lib/colors";

type StatCardProps = {
  title: string;
  value: number;
  status?: AppStatus;
};

export function StatCard({ title, value, status }: StatCardProps) {
  return (
    <Card
      className="@container/card w-full h-full"
      style={
        status
          ? { borderLeft: `6px solid ${cssColorForStatus(status)}` }
          : undefined
      }
    >
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {value}
        </CardTitle>
      </CardHeader>
    </Card>
  );
}
