import { Tracker, columns } from "./columns"
import { DataTable } from "./data-table"
import {
    Card,
    CardContent, CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"


async function getData(): Promise<Tracker[]> {
    // Fetch data from your API here.
    return [
        {
            id: "m5gr84i9",
            amount: 316,
            status: "wishlist",
            company: "Amazon",
        },
        {
            id: "3u1reuv4",
            amount: 242,
            status: "interview scheduled",
            company: "Google",
        },
        {
            id: "derv1ws0",
            amount: 837,
            status: "applied",
            company: "Bloomberg",
        },
        {
            id: "5kma53ae",
            amount: 874,
            status: "offer pending",
            company: "Uber",
        },
        {
            id: "bhqecj4p",
            amount: 721,
            status: "rejected",
            company: "CapitalOne",
        },
    ]
}

export default async function DemoPage() {
    const data = await getData()

    return (
        <Card className="w-full max-w-5xl mx-auto">

            <CardTitle className="text-center items-center">
                Applications Tracker
            </CardTitle>
            <CardContent className="overflow-x-auto">
                <DataTable columns={columns} data={data} />
            </CardContent>

        </Card>
    )
}
