import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faStars } from "@awesome.me/kit-3cb9aa7d8b/icons/duotone/regular";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";

export default function MotivationCard() {
    const quotes = [
        "You’ve applied to 223 jobs—don’t stop now.",
        "Every ‘no’ brings you closer to your ‘yes’.",
        "Refresh your resume today. Future you will thank you.",
        "Only takes one yes to change everything. Keep pushing.",
        "Drink water. Breathe deep. You’re building an empire.",
    ];

    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

    return (
         <Card className="w-[425px]">
            <CardHeader>
            </CardHeader>
             <CardTitle className="text-center items-center">
                <FontAwesomeIcon icon={faStars} size="xl" />
                    Daily Motivation
                <FontAwesomeIcon icon={faStars} size="xl" />
            </CardTitle>
            <CardContent className="text-center items-center">
                <p className="text-md italic text-muted-foreground">{randomQuote}</p>
            </CardContent>
             <CardFooter>

             </CardFooter>
        </Card>
    );
}
