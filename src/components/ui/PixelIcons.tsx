import Image from "next/image";

interface PixelGridProps {
  rows: string[];
  palette: Record<string, string>;
  size?: number;
  cellsW?: number;
  cellsH?: number;
}

export function PixelGrid({ rows, palette, size = 64, cellsW, cellsH }: PixelGridProps) {
  const w = cellsW ?? rows[0].length;
  const h = cellsH ?? rows.length;
  return (
    <svg width={size} height={(size * h) / w} viewBox={`0 0 ${w} ${h}`} shapeRendering="crispEdges">
      {rows.map((row, y) =>
        row.split("").map((ch, x) => {
          const fill = palette[ch];
          if (!fill) return null;
          return <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={fill} />;
        })
      )}
    </svg>
  );
}

export function BrainIcon({ size = 64 }: { size?: number }) {
  return (
    <PixelGrid size={size} palette={{ K: "#000", v: "#b14bff", w: "#e6c5ff", b: "#22a7ff" }} rows={[
      "................","....KKKKKKKK....","...KvvKvvKvvK...","..KvwwKvwwKvvK..",
      ".KvwwwwwwwwwwvK.",".KvwwKwwwKwwvvK.",".KvwwwKwKwwwvvK.",".KvwwKwwwKwwvvK.",
      ".KvwwwwwwwwwwvK.","..KvwwKvwwKvvK..","..KvvvKvvvKvvK...","...KvvKvvKvvK...",
      "....KbbKbbK.....","  ...KbKbK......","......KKK.......","................",
    ]} />
  );
}

export function TrophyIcon({ size = 64 }: { size?: number }) {
  return (
    <PixelGrid size={size} palette={{ K: "#000", g: "#ffd23a", o: "#a87a00", w: "#fff3c2" }} rows={[
      "................",".KKKKKKKKKKKK...",".KggggggggggK...",".KgwwgggwwggK...",
      "KKgggggggggggKK.","KogggggggggggoK.","KogggggggggggoK.","KKgggggggggggKK.",
      ".KgggggggggggK..",".KKgggggggggKK..","...KgggggggK....","....KgggggK.....",
      "...KKKKKKKKK....","..KooooooooK....",".KKKKKKKKKKKK...","................",
    ]} />
  );
}

export function CoinIcon({ size = 32 }: { size?: number }) {
  return (
    <PixelGrid size={size} palette={{ K: "#000", g: "#ffd23a", o: "#a87a00", w: "#fff3c2" }} rows={[
      "....KKKKKK....","..KKgggggggKK.",".KggggwwgggggK",".KggwgggggggK.",
      "KgggwggKgggggK","KggggggKgggggK","KggggggKgggggK",".KggggggKggggK",
      ".KgggggggwggK.","..KKgggggggKK.","....KKKKKK....","...............",
    ]} />
  );
}

export function ChipIcon({ size = 64 }: { size?: number }) {
  return (
    <PixelGrid size={size} palette={{ K: "#000", v: "#b14bff", b: "#22a7ff", w: "#fff", g: "#1eea7c" }} rows={[
      "................","..K.K.K.KK.K.K..",".KKKKKKKKKKKKKK.",".KvvvvvvvvvvvvK.",
      "KKvKKKKKKKKKKvKK","KvvKwwwwwwwwKvvK","KvvKwgggggwwKvvK","KvvKwgKvKgwwKvvK",
      "KvvKwgKvKgwwKvvK","KvvKwgggggwwKvvK","KvvKwwwwwwwwKvvK","KKvKKKKKKKKKKvKK",
      ".KvvvvvvvvvvvvK.",".KKKKKKKKKKKKKK.","..K.K.K.KK.K.K..","................",
    ]} />
  );
}

export function DialIcon({ size = 64 }: { size?: number }) {
  return (
    <PixelGrid size={size} palette={{ K: "#000", b: "#22a7ff", w: "#bfe5ff", r: "#ff4d4d", g: "#1eea7c" }} rows={[
      "................","....KKKKKKKK....","...KbbbbbbbbK...","..KbwwwwwwwwbK..",
      ".KbwwgwwwwrwbK..",".KbwgwwKwwwrwbK.",".KbwwwKKKwwwwbK.",".KbwwKKwKKwwwbK.",
      ".KbwwwwKwwwwwbK.",".KbwwwwwwwwwwbK.","..KbwwwwwwwwbK...","...KbbbbbbbbK...",
      "....KKKKKKKK....","  ...K....K.....","  ...K....K.....","................",
    ]} />
  );
}

export function HeartIcon({ size = 32 }: { size?: number }) {
  return (
    <PixelGrid size={size} palette={{ K: "#000", r: "#ff3aa3", w: "#ffd0e6" }} rows={[
      "..KKK....KKK..",".KrrrK..KrrrK.","KrwwrrKKrrrrrK","KrwwrrrrrrrrrK",
      "KrrrrrrrrrrrrK",".KrrrrrrrrrrK.","..KrrrrrrrrK..","...KrrrrrrK...",
      "....KrrrrK....","  ...KrrK.....","......KK......","...............",
    ]} />
  );
}

export function SwordIcon({ size = 32 }: { size?: number }) {
  return (
    <PixelGrid size={size} palette={{ K: "#000", b: "#22a7ff", g: "#ffd23a" }} rows={[
      "............KKK","...........KbbK","..........KbbK.",".........KbbK..",
      "........KbbK...","  .......KbbK....","......KbbK.....","  ...KbbK......","....KbbK.......",
      "...KbbK........","..KbbK.........","KKKKK..........","KggK...........",
      "KggKKK.........","  .KKKgK..........","....KK..........",
    ]} />
  );
}

export function ShieldIcon({ size = 64 }: { size?: number }) {
  return (
    <PixelGrid size={size} palette={{ K: "#000", b: "#22a7ff", w: "#bfe5ff", v: "#b14bff" }} rows={[
      "................",".KKKKKKKKKKKKKK.",".KbbbbbbbbbbbbK.",".KbwwwwwwwwwwbK.",
      ".KbwvvvvvvvvwbK.",".KbwvKwwwwKvwbK.",".KbwvwKwwKwvwbK.",".KbwvwwKKwwvwbK.",
      ".KbwvwKwwKwvwbK.",".KbwvKwwwwKvwbK.",".KbwvvvvvvvvwbK.","..KbwwwwwwwwbK..",
      "...KbbbbbbbbK...","....KbbbbbbK.....","  ...KbbbbK.....","......KKKK......",
    ]} />
  );
}

export function FlagIcon({ size = 64 }: { size?: number }) {
  return (
    <PixelGrid size={size} palette={{ K: "#000", v: "#b14bff", w: "#fff", g: "#ffd23a" }} rows={[
      "..KK............","..KvKKKKKKKKK...","..KvvvvvvvvvK...","..KvwwwwwwvvK...",
      "..KvwgKKgwvvK...","..KvwKwwKwvvK...","..KvwwwwwwvvK...","..KvwgKKgwvvK...",
      "..KvwKwwKwvvK...","..KvwwwwwwvvK...","..KvvvvvvvvvK...","..KKKKKKKKKKK...",
      "..K.............","..K.............","..K.............","..K.............",
    ]} />
  );
}

export function ChartIcon({ size = 64 }: { size?: number }) {
  return (
    <PixelGrid size={size} palette={{ K: "#000", g: "#1eea7c", b: "#22a7ff", v: "#b14bff", w: "#fff" }} rows={[
      "................",".K..............",".K..........gK..",".K........ggKK..",
      ".K......bbgKK...",".K.....bbKKK....",".K...vvbKK......",".K..vvKK........",
      ".K..vK..........","  .K...............",".KKKKKKKKKKKKKK.","................",
      "................","................","................","................",
    ]} />
  );
}

export function StarIcon({ size = 24 }: { size?: number }) {
  return (
    <PixelGrid size={size} palette={{ K: "#000", g: "#ffd23a", w: "#fff3c2" }} rows={[
      "......KK......","......KgK.....","  ...KgwgK....","KKKKKKgwggKKKK",
      "KggggggwgggggK",".KggggwgggggK.","..KgggwgggK...","...KgggggK....",
      "...KggKggK....","..KggK.KggK...",".KKK.....KKK..","...............",
    ]} />
  );
}

/* ── Login / shared icons ── */

export function UserIcon({ color = "#1eea7c" }: { color?: string }) {
  return (
    <PixelGrid size={20} palette={{ K: "#000", g: color, w: "#fff" }} rows={[
      "....KKKK....","...KggggK...","..KgwwwwgK..","..KgwwwwgK..",
      "..KggggggK..","...KKKKKK...","  .KK......KK.","KggKKKKKKggK",
      "KggggggggggK","KggggggggggK","KKKKKKKKKKKK","............",
    ]} />
  );
}

export function LockIcon({ color = "#b14bff" }: { color?: string }) {
  return (
    <PixelGrid size={20} palette={{ K: "#000", v: color, d: "#3a1c66" }} rows={[
      "............","...KKKKKK...","..KK....KK..","..K......K..",
      "..K......K..",".KKKKKKKKKK.",".KvvvvvvvvK.",".KvvKKKKvvK.",
      ".KvvKddKvvK.",".KvvKddKvvK.",".KvvvvvvvvK.",".KKKKKKKKKK.",
    ]} />
  );
}

export function EyeIcon({ open = true }: { open?: boolean }) {
  return (
    <PixelGrid size={20} palette={{ K: "#000", w: "#fff", b: "#22a7ff" }} rows={open ? [
      "............","............","..KKKKKKKK..","  .KwwwwwwwwK.",".KwwKKKKwwK.",
      "KwwKbbbbKwwK","KwwKbKKbKwwK","KwwKbbbbKwwK",".KwwKKKKwwK.",".KwwwwwwwwK.",
      "..KKKKKKKK..","............",
    ] : [
      "............","............","............",".K.........K",
      "..KK.....KK.","...KKKKKKK..","..KKKKKKKKK.",".KK.......KK",
      "K...........","............","............","............",
    ]} />
  );
}

export function GoogleG() {
  return (
    <PixelGrid size={28} palette={{ K: "#000", r: "#ea4335", b: "#4285f4", g: "#34a853", y: "#fbbc05", w: "#fff" }} rows={[
      "................","....KKKKKKKK....","...KKrrrrrrKK...","..KKrrrrryyyKK..",
      ".KKrrrrwwwyyyKK.",".KrrrwwwwwwyyyK.",".Kbwwwwwwwwwwgg.",".KbbbwwwKKKKwgg.",
      ".KbbbwwwwwwwwggK",".KbbbwwKwwwwwggK",".KbbbwwKwwwwwggK",".KKbbbbwwwwwggK.",
      "..KKbbbbbbbbggK.","...KKKbbbbbggK..","....KKKKKKKKK...","................",
    ]} />
  );
}

export function GitHubCat() {
  return (
    <PixelGrid size={28} palette={{ K: "#000", w: "#fff", d: "#0d1117" }} rows={[
      "................","....KKKKKKKK....","..KKwwwwwwwwKK..",".KwwwwwwwwwwwwK.",
      ".KwwKKwwwwKKwwK.","KwwwKwwwwwwKwwwK","KwwwwwwKKwwwwwwK","KwwwwwKKKKwwwwwK",
      "KwwwwwwwwwwwwwK.",".KwwKwwwwwwKwK..","  .KKwKKwwwwKKKK..","...KK.KKKK..KK..",
      "................","................","................","................",
    ]} />
  );
}

export function HeroLogo() {
  return (
    <div className="mx-auto" style={{ width: 80, height: 80, filter: "drop-shadow(0 6px 0 #000) drop-shadow(0 0 16px #b14bff88)" }}>
      <Image
        src="/images/logo-blanc.png"
        alt="Logo ACADEM'IA"
        width={80}
        height={80}
        className="object-contain"
        style={{ imageRendering: "pixelated" }}
        priority
      />
    </div>
  );
}

/* ── Dashboard badge icons ── */

type BadgeKind = "book" | "sword" | "potion" | "skull" | "crown" | "atom" | "lock" | "heart";

export function PixelBadge({ kind, size = 40 }: { kind: BadgeKind; size?: number }) {
  const badges: Record<BadgeKind, { rows: string[]; palette: Record<string, string> }> = {
    book: {
      rows: ["................","................","..KKKKKKKKKKKK..","..KvvvvKvvvvvK..","..KvWWvKvWWWvK..","..KvWWvKvWWWvK..","..KvvvvKvvvvvK..","..KvWvvKvWvvvK..","..KvWWvKvWWvvK..","..KvvvvKvvvvvK..","..KvWvvKvWvvvK..","..KvvvvKvvvvvK..","..KKKKKKKKKKKK..","..K..........K..","..KKKKKKKKKKKK..","................"],
      palette: { K: "#000", v: "#b14bff", W: "#fff3c2" },
    },
    sword: {
      rows: ["............KKK.","...........KbbK.","..........KbbK..",".........KbbK...","........KbbK....","  .......KbbK.....","......KbbK......","  ...KbbK.......","....KbbK........","...KbbK.........","..KbbK..........","KKKKK...........","KggK............","KggKKK..........","  .KKKgK..........","....KK.........."],
      palette: { K: "#000", b: "#22a7ff", g: "#ffd23a" },
    },
    potion: {
      rows: [".....KKKK.......","  ...KWWK.......","  ...KWWK.......","  ...KKKK.......","....KggggK......","...KggeegK......","..KggeeeegK.....","  .KggeeeeegK.....",".KgeeeWWeegK....",".KgeeWWeeegK....",".KgeeeeeeegK....",".KggeeeeegK.....","..KggggggK......","...KKKKKK.......","................","................"],
      palette: { K: "#000", e: "#1eea7c", g: "#0d8f4a", W: "#dfffe9" },
    },
    skull: {
      rows: ["...KKKKKKKK.....","..KWWWWWWWWK....","  .KWWWWWWWWWWK...","  .KWKKWWKKWWWK...",".KWKbWWKbWWWK...",".KWKKWWKKWWWK...",".KWWWWWWWWWWK...",".KWWKWWKWWWWK...",".KWWWKKWWWWWK...","..KWWWWWWWWK....","...KKKKKKKK.....","................","................","................","................","................"],
      palette: { K: "#000", W: "#e8e6ff", b: "#b14bff" },
    },
    crown: {
      rows: ["K....K....K.....","Kg...Kg...Kg....","Kgg.KKgg.KKgg...","KggKKKggKKKgg...","KggggggggggK....","KggrgggrgggK....","KggrgggrgggK....","KggggggggggK....","KKKKKKKKKKKK....","................","................","................","................","................","................","................"],
      palette: { K: "#000", g: "#ffd23a", r: "#ff3aa3" },
    },
    atom: {
      rows: ["................","....KKKKKKK.....","..KKvvvvvvvKK...",".KvvvvvvvvvvvK..",".KvvvKKKvvvvvK..",".KvvKWWWKvvvvK..",".KvKWWWWWKvvvK..",".KvKWWWWWKvvvK..",".KvKWWWWWKvvvK..",".KvvKWWWKvvvvK..",".KvvvKKKvvvvvK..",".KvvvvvvvvvvvK..","..KKvvvvvvvKK...","....KKKKKKK.....","................","................"],
      palette: { K: "#000", v: "#22a7ff", W: "#b14bff" },
    },
    lock: {
      rows: ["................","....KKKKKK......","...KK....KK.....","..KK......KK....","..K........K....","..K........K....","  .KKKKKKKKKKKK...",".KdddddddddK....",".KdddKKKdddK....",".KddKddKdddK....",".KdddKKKdddK....",".KddddKddddK....",".KdddddddddK....","  .KKKKKKKKKKK....","................","................"],
      palette: { K: "#000", d: "#3a3360" },
    },
    heart: {
      rows: ["................","..KKK....KKK....","  .KrrrK..KrrrK...","KrWWrrKKrrrrrK..","KrWWrrrrrrrrrK..","KrrrrrrrrrrrrK..","KrrrrrrrrrrrrK..","  .KrrrrrrrrrrK...",  "..KrrrrrrrrK....","...KrrrrrrK.....","....KrrrrK......",".....KrrK.......","......KK........","................","................","................"],
      palette: { K: "#000", r: "#ff3aa3", W: "#ffd0e6" },
    },
  };
  const b = badges[kind];
  if (!b) return null;
  return <PixelGrid rows={b.rows} palette={b.palette} size={size} />;
}
