'use client'
import { Calendar } from "@/components/ui/calendar"
import * as React from "react"
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";

export function AppCalendar() {
    const [date, setDate] = React.useState<Date | undefined>(new Date())

    return (
        <Card>
            <CardHeader>
            </CardHeader>
            <CardTitle className="text-center items-center">
                Important Deadlines
            </CardTitle>
            <CardContent className="flex justify-center">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                />
            </CardContent>
            <CardFooter>

            </CardFooter>
        </Card>

    )
}