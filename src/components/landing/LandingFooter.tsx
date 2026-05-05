import Link from "next/link";
import { CoinIcon } from "@/components/ui/PixelIcons";

function Ticker() {
  return (
    <div className="panel mt-2">
      <div className="overflow-hidden bg-black border-b-4 border-black">
        <div className="marquee-track py-2 font-mono-pixel text-[16px]">
          {[0, 1].map(i => (
            <div key={i} className="flex items-center gap-12 px-6">
              <span className="text-[var(--emerald)]">◆ ILS NOUS FONT CONFIANCE :</span>
              <span>NEXT-EDU</span><span>SKILL-FORGE</span><span>LYCÉE GAMMA</span>
              <span>OPCO ATLAS</span><span>PRÉPA HARMONIA</span>
              <span className="text-[var(--neon-violet)]">◆ +120 ÉCOLES & CFA</span>
              <span className="text-[var(--gold)]">◆ NOTÉ 4.9/5 SUR 12K AVIS</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FAQ() {
  const items = [
    { q: "Comment l'IA adapte-t-elle la difficulté ?", a: "Elle observe votre précision, vitesse et streak. Si vous explosez 3 quêtes d'affilée, le tier monte. Si vous chutez, l'IA propose un mini-boss de récupération avec indices dégressifs." },
    { q: "Mes données sont-elles partagées ?", a: "Non. Stockage chiffré, hébergement en UE, pas de revente, pas de pub. Vous pouvez exporter ou supprimer votre historique à tout moment." },
    { q: "Ça marche pour quel niveau ?", a: "Du collège à la formation pro. La même boucle s'adapte du brevet à la certification métier — c'est l'IA qui calibre, pas vous." },
    { q: "Je peux annuler quand ?", a: "À tout moment, sans justification. Vos badges et progrès restent accessibles en lecture seule via le mode Starter." },
  ];
  return (
    <section id="faq" className="space-y-3">
      <div>
        <div className="font-pixel text-[10px] text-[var(--hot-pink)] mb-2">▶ STAGE 05</div>
        <h2 className="font-pixel text-[20px] sm:text-[26px] glow-pink">FAQ · NPC INFO</h2>
      </div>
      <div className="panel">
        <div className="divide-y-4 divide-black">
          {items.map((it, i) => (
            <details key={i} className="group">
              <summary className="flex items-center justify-between p-4 hover:bg-[#0e0a22]">
                <div className="font-pixel text-[12px] text-white" style={{ textShadow: "2px 2px 0 #000" }}>{it.q}</div>
                <div className="font-pixel text-[14px] text-[var(--emerald)] group-open:rotate-90 transition-transform">▶</div>
              </summary>
              <div className="px-4 pb-4 font-mono-pixel text-[18px] text-[var(--ink-dim)] leading-snug">
                <span className="text-[var(--emerald)]">&gt; </span>{it.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="panel panel-violet">
      <div className="titlebar titlebar-violet font-pixel text-[10px] text-white" style={{ textShadow: "2px 2px 0 #000" }}>
        ★ READY PLAYER ONE ★
      </div>
      <div className="p-6 sm:p-10 grid lg:grid-cols-[1.2fr_1fr] gap-6 items-center">
        <div className="space-y-3">
          <h3 className="font-pixel text-[20px] sm:text-[26px]">
            <span className="glow-emerald">PRESS START</span> <span className="text-white" style={{ textShadow: "2px 2px 0 #000" }}>POUR ENTRER</span><br />
            <span className="glow-violet">DANS LE DONJON.</span>
          </h3>
          <p className="font-mono-pixel text-[20px] text-[var(--ink-dim)] max-w-[55ch]">
            Inscription en 30 secondes, première quête en 60. Pas de CB pour le free play.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link href="/login" className="arcade arcade-emerald arcade-glow text-[12px]">▶ INSERT COIN</Link>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="relative">
            <CoinIcon size={120} />
            <div className="absolute inset-0 flex items-center justify-center font-pixel text-[8px] text-black">1UP</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FooterLinks() {
  const colorMap: Record<string, string> = { v: "#1a1233", K: "#fff", b: "#b14bff", e: "#1eea7c" };
  return (
    <footer className="panel mt-2">
      <div className="grid sm:grid-cols-[1.2fr_1fr_1fr_1fr] gap-5 p-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-[28px] h-[28px] grid grid-cols-8 grid-rows-8 border-2 border-black">
              {["vvvvvvvv","vKKKvKKv","vKbKvKvv","vKKKvKvv","vKbKvKvv","vKbKvKvv","vvvvvvvv","eeeeeeee"].map((row, y) =>
                row.split("").map((ch, x) => <div key={`${x}-${y}`} style={{ background: colorMap[ch] }} />)
              )}
            </div>
            <div className="font-pixel text-[12px] glow-violet">ACADEM<span style={{ color: "#1eea7c" }}>&apos;</span>IA</div>
          </div>
          <p className="font-mono-pixel text-[16px] text-[var(--ink-dim)] mt-3 max-w-[36ch]">
            L&apos;apprentissage en mode arcade. Une IA, mille quêtes, votre niveau.
          </p>
        </div>
        {[
          { h: "PRODUIT", links: [
            { l: "Concept",         href: "#concept" },
            { l: "Tarifs",          href: "#tarifs"  },
            { l: "Modules",         href: "#tarifs"  },
            { l: "Roadmap",         href: "#"        },
          ]},
          { h: "SOCIÉTÉ", links: [
            { l: "À propos",        href: "#"        },
            { l: "Carrières",       href: "#"        },
            { l: "Presse",          href: "#"        },
            { l: "Contact",         href: "#"        },
          ]},
          { h: "LÉGAL", links: [
            { l: "CGU",             href: "/legal/cgu"             },
            { l: "Confidentialité", href: "/legal/confidentialite" },
            { l: "Mentions",        href: "/legal/mentions"        },
            { l: "Cookies",         href: "/legal/cookies"         },
          ]},
        ].map((col, i) => (
          <div key={i}>
            <div className="font-pixel text-[10px] text-[var(--emerald)] mb-2">{col.h}</div>
            <ul className="font-mono-pixel text-[18px] space-y-1 text-[var(--ink-dim)]">
              {col.links.map((item, j) => (
                <li key={j}><Link href={item.href} className="hover:text-white">{item.l}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="pix-div" />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 font-mono-pixel text-[14px] text-[var(--ink-dim)]">
        <div>© 2026 ACADEM&apos;IA · PIXEL EDITION · CART v1.16-bit</div>
        <div className="flex gap-3"><span>FR · 🇫🇷</span><span>FPS 60 · LATENCY 4ms</span></div>
      </div>
    </footer>
  );
}

export default function LandingFooter() {
  return (
    <>
      <Ticker />
      <FAQ />
      <FinalCTA />
      <FooterLinks />
    </>
  );
}
