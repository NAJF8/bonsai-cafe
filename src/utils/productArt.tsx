import type { CSSProperties, JSX } from "react";

/** Honest placeholder art: since no real Bonsai product photography exists
 *  yet (see DESIGN_SYSTEM.md), every product gets a brand-colored gradient
 *  tile with a simple line-art glyph for its category — never a real
 *  photo of someone else's product passed off as Bonsai's own. */

function CupIcon() {
  return (
    <path
      d="M7 9h11v6a5 5 0 0 1-5 5H12a5 5 0 0 1-5-5V9Z M18 11h1.5a2 2 0 0 1 0 4H18 M9 5.5c0-1 .6-1.3.6-2.2 M12 5.5c0-1 .6-1.3.6-2.2"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  );
}

function IcedGlassIcon() {
  return (
    <path
      d="M8 7h9l-1 12a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2L8 7Z M8 7l9 0 M9.5 10l7 0M10 13l6 0M10 16l6 0 M15 6V3"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  );
}

function BlenderIcon() {
  return (
    <path
      d="M9 4h7l1 6-1.5 9a1.5 1.5 0 0 1-1.5 1.3h-3A1.5 1.5 0 0 1 9.5 19L8 10 9 4Z M8.3 9h8.4 M10 4V2.5h5V4"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  );
}

function TeaGlassIcon() {
  return (
    <path
      d="M7.5 6h9l-1 13.3a1.7 1.7 0 0 1-1.7 1.6H10.2a1.7 1.7 0 0 1-1.7-1.6L7.5 6Z M9.5 2.5c.6.9-.6 1.3 0 2.2M12 2.5c.6.9-.6 1.3 0 2.2M14.5 2.5c.6.9-.6 1.3 0 2.2"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  );
}

function CocktailIcon() {
  return (
    <path
      d="M5 5h14l-7 8v6M9.5 19h5 M5 5l3.4 3.9M19 5l-3.4 3.9"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  );
}

function DripperIcon() {
  return (
    <path
      d="M7 5h10l-4.5 7v6h-1v-6L7 5Z M10 18h4"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  );
}

function PastryIcon() {
  return (
    <path
      d="M4 11c0-3.3 3.6-6 8-6s8 2.7 8 6H4Z M4 11h16l-1.2 7a2 2 0 0 1-2 1.8H7.2a2 2 0 0 1-2-1.8L4 11Z"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  );
}

const CATEGORY_ICON: Record<string, () => JSX.Element> = {
  "healthy": BlenderIcon,
  "tiramisu": PastryIcon,
  "hot-drinks": CupIcon,
  "iced-coffee": IcedGlassIcon,
  "specialty-coffee": DripperIcon,
  "smoothie": BlenderIcon,
  "matcha": TeaGlassIcon,
  "mojito": CocktailIcon,
  "iced-tea": TeaGlassIcon,
  "mocktail": CocktailIcon,
  "fresh-juice": IcedGlassIcon,
  "filter-coffee": DripperIcon,
  "milkshake": IcedGlassIcon,
  "desserts": PastryIcon,
};

export function ProductGlyph({ categoryId }: { categoryId: string }) {
  const Icon = CATEGORY_ICON[categoryId] ?? CupIcon;
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <Icon />
    </svg>
  );
}

/** A richer, layered brand-tone gradient: a diagonal base + a soft glossy
 *  highlight + a faint diagonal sheen, instead of one flat linear gradient. */
export function productArtStyle(seed: string): CSSProperties {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  const spread = hash % 30;
  const green = 150 + (spread % 15);
  const terracotta = 16 + (spread % 12);

  return {
    backgroundImage: [
      "radial-gradient(120% 90% at 18% 12%, rgba(255,255,255,0.22), rgba(255,255,255,0) 55%)",
      `linear-gradient(155deg, hsl(${green} 32% 30%) 0%, hsl(${green} 24% 22%) 45%, hsl(${terracotta} 48% 40%) 100%)`,
    ].join(", "),
  };
}
