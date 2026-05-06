export type BadgeKind = "book" | "sword" | "potion" | "skull" | "crown" | "atom" | "lock" | "heart";

const ICONE_KIND_MAP: Record<string, BadgeKind> = {
  "📚": "book",   "livre": "book",   "book": "book",
  "⚔":  "sword",  "⚔️":  "sword",  "sword": "sword",  "épée": "sword",
  "🧪": "potion", "potion": "potion", "alchimie": "potion",
  "💀": "skull",  "skull": "skull",  "crâne": "skull",
  "👑": "crown",  "crown": "crown",  "couronne": "crown",
  "⚛":  "atom",   "⚛️":  "atom",   "atom": "atom",    "science": "atom",
  "❤":  "heart",  "❤️":  "heart",  "heart": "heart",  "coeur": "heart",
};

export function iconeToKind(icone: string): BadgeKind {
  const trimmed = icone.trim();
  if (ICONE_KIND_MAP[trimmed]) return ICONE_KIND_MAP[trimmed];
  const key = trimmed.toLowerCase();
  for (const [k, v] of Object.entries(ICONE_KIND_MAP)) {
    if (key.includes(k.toLowerCase())) return v;
  }
  return "lock";
}

export function badgeImageSrc(kind: BadgeKind): string | null {
  if (kind === "crown") return "/images/icon-star.jpg";
  if (kind === "book" || kind === "atom") return "/images/icon-brain.jpg";
  if (kind === "sword" || kind === "skull") return "/images/icon-target.jpg";
  if (kind === "potion" || kind === "heart") return "/images/icon-shield.jpg";
  return null; // "lock" → falls back to PixelBadge SVG
}
