import { Card, CardContent } from "@/components/ui/card";

export default function MotivationCard() {
  const quotes = [
    "You’ve applied to 223 jobs—don’t stop now.",
    "Every ‘no’ brings you closer to your ‘yes’.",
    "Refresh your resume today. Future you will thank you.",
    "Only takes one yes to change everything. Keep pushing.",
    "Drink water. Breathe deep. You’re building an empire.",
  ];

  const randomQuote = quotes[new Date().getDate() % quotes.length];

  return (
    <Card className="w-full h-full flex flex-row items-center justify-center gap-3 py-5">
      <span className="font-serif text-xl shrink-0">Daily Motivation</span>
      <span className="hidden h-6 w-px bg-border sm:block" />
      <CardContent className="p-0">
        <p className="text-md italic text-muted-foreground">{randomQuote}</p>
      </CardContent>
    </Card>
  );
}
