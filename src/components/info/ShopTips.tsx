// "Shop smarter with FoodCast": three tips on using a forecast, coloured like the direction badges.
import Card from "@/components/ui/Card";
import DirectionBadge from "@/components/ui/DirectionBadge";

// Same arrows and colours as the rest of the site: rising is red, falling is green, uncertainty is grey
const TIPS = [
  {
    icon: "↑",
    tone: "bg-rise/10 text-rise",
    title: "Price rising",
    text: "If something you buy often is expected to rise, consider buying it earlier, especially foods that keep well, like rice, beans and garri.",
    badge: <DirectionBadge direction="UP" />,
  },
  {
    icon: "↓",
    tone: "bg-fall/10 text-fall",
    title: "Price falling",
    text: "If a price is expected to drop, you may save by waiting a little before buying.",
    badge: <DirectionBadge direction="DOWN" />,
  },
  {
    icon: "↔",
    tone: "bg-flat/15 text-flat",
    title: "Wide price range",
    text: "A wide range means we're less sure. Check prices at your local market before making a big purchase.",
    badge: <span className="inline-block rounded-full bg-flat/15 px-2.5 py-1 text-xs font-bold text-flat">↔ Wide range</span>,
  },
];

export default function ShopTips() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {TIPS.map((tip) => (
        <Card key={tip.title} className="animate-fade-up flex flex-col">
          <span className={`flex h-10 w-10 items-center justify-center rounded-full font-display text-lg font-bold ${tip.tone}`} aria-hidden="true">
            {tip.icon}
          </span>
          <h3 className="mt-3 font-display text-lg font-bold">{tip.title}</h3>
          <p className="mt-1 text-sm text-muted">{tip.text}</p>
          <div className="mt-auto pt-4">{tip.badge}</div>
        </Card>
      ))}
    </div>
  );
}
