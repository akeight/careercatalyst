import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faStars } from "@awesome.me/kit-3cb9aa7d8b/icons/duotone/regular";

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
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
            <div className="flex items-center justify-center w-full">
                <FontAwesomeIcon icon={faStars} size="2xl" />
                <h3 className="text-lg font-semibold mb-2">Daily Motivation</h3>
                <FontAwesomeIcon icon={faStars} size="2xl" />
            </div>
            <p className="flex items-center justify-center w-full text-sm text-muted-foreground">{randomQuote}</p>
        </div>
    );
}
