import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="w-[400px]">
        <CardHeader></CardHeader>
        <CardTitle className="text-center items-center font-serif text-2xl">
          <span> Daily Motivation</span>
        </CardTitle>
        <CardContent className="text-center items-center">
          <p className="text-md italic text-muted-foreground">{randomQuote}</p>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>
  );
}
