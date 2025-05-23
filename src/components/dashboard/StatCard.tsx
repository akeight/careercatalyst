import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";


type StatCardProps = {
    title: string;
    value: number;
};

export default function StatCard({ title, value }: StatCardProps) {
    return (
        <Card className="w-[200px]">
            <CardHeader>
            </CardHeader>
            <CardTitle className="text-center items-center">
                {title}
            </CardTitle>
            <CardContent className="text-center items-center">
                <p className="">
                    {value}
                </p>
            </CardContent>
            <CardFooter>
            </CardFooter>
        </Card>
    );
}
