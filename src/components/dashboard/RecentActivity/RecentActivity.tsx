import { Tracker, columns } from "./columns";
import { DataTable } from "./data-table";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMemoPad } from "@awesome.me/kit-3cb9aa7d8b/icons/duotone/solid";

async function getData(): Promise<Tracker[]> {
  // Fetch data from your API here.
  return [
    {
      id: "m5gr84i9",
      date: "N/A",
      status: "saved",
      company: "Amazon",
    },
    {
      id: "3u1reuv4",
      date: "2/2/25",
      status: "interview scheduled",
      company: "Google",
    },
    {
      id: "derv1ws0",
      date: "8/30/24",
      status: "applied",
      company: "Bloomberg",
    },
    {
      id: "5kma53ae",
      date: "8/4/24",
      status: "offer",
      company: "Uber",
    },
    {
      id: "bhqecj4p",
      date: "1/21/25",
      status: "rejected",
      company: "CapitalOne",
    },
  ];
}

export default async function DemoPage() {
  const data = await getData();

  return (
    <Card className="w-full max-w-5xl mx-auto">
      <CardTitle className="text-center items-center">
        <FontAwesomeIcon icon={faMemoPad} size="lg" />{" "}
        <span> Recent Activity</span>
      </CardTitle>
      <CardContent className="overflow-x-auto">
        <DataTable columns={columns} data={data} />
      </CardContent>
    </Card>
  );
}
