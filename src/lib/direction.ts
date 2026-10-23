// Price direction from a shopper's point of view: rising is bad (red), falling is good (green).
import type { Direction } from "@/types/commodity";

export interface DirectionLook {
  word: string; // shown next to the arrow so colour is never the only signal
  arrow: string;
  text: string; // Tailwind text colour class
  soft: string; // Tailwind background + text classes for badges
}

const LOOKS: Record<Direction, DirectionLook> = {
  UP: { word: "Rising", arrow: "↑", text: "text-rise", soft: "bg-rise/10 text-rise" },
  DOWN: { word: "Falling", arrow: "↓", text: "text-fall", soft: "bg-fall/10 text-fall" },
  STABLE: { word: "Steady", arrow: "→", text: "text-flat", soft: "bg-flat/15 text-flat" },
};

/** Returns the word, arrow and colours for a direction. */
export function getDirectionLook(direction: Direction): DirectionLook {
  return LOOKS[direction];
}

/** For plain numbers (like a monthly change) that have no direction label of their own. */
export function directionFromChange(change: number): Direction {
  if (change > 0.05) return "UP";
  if (change < -0.05) return "DOWN";
  return "STABLE";
}
