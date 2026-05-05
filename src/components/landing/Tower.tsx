import { CoinIcon, PixelGrid } from "@/components/ui/PixelIcons";

export default function Tower() {
  return (
    <div className="panel panel-blue relative overflow-hidden min-h-[340px] sm:min-h-[420px]">
      <div className="titlebar titlebar-blue flex items-center justify-between">
        <div className="font-pixel text-[10px] text-white" style={{ textShadow: "2px 2px 0 #000" }}>
          ▣ TOWER OF KNOWLEDGE
        </div>
        <div className="font-mono-pixel text-[14px] text-white/80">INFINITE</div>
      </div>

      <div className="relative w-full h-full min-h-[300px]">
        {/* Moon */}
        <div
          className="absolute right-6 top-8 w-[64px] h-[64px] border-4 border-black"
          style={{ background: "radial-gradient(circle at 35% 35%, #fff3c2 0%, #ffd23a 55%, #a87a00 100%)", boxShadow: "0 0 32px rgba(255,210,58,0.4), 0 4px 0 #000" }}
        />

        {/* Mountains */}
        <svg className="absolute bottom-0 left-0 w-full" height="80" viewBox="0 0 320 40" preserveAspectRatio="none" shapeRendering="crispEdges">
          {Array.from({ length: 32 }).map((_, i) => {
            const h = 8 + ((i * 7) % 14);
            return <rect key={i} x={i * 10} y={40 - h} width="10" height={h} fill="#1a1530" />;
          })}
        </svg>

        {/* Tower body */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[140px] sm:w-[180px] h-full">
          <div className="absolute inset-x-0 bottom-0 top-[40px] border-l-4 border-r-4 border-black overflow-hidden" style={{ background: "#1a1233" }}>
            <div className="absolute inset-x-0 top-0 tower-scroll" style={{ height: "calc(100% + 320px)" }}>
              {Array.from({ length: 40 }).map((_, i) => (
                <div key={i} className="flex" style={{ height: 20 }}>
                  {Array.from({ length: 8 }).map((__, j) => (
                    <div key={j} className="flex-1 border border-black" style={{ background: (i + j) % 2 ? "#2a1c5e" : "#3a2585" }} />
                  ))}
                </div>
              ))}
            </div>
            {[20, 40, 60, 80].map(p => (
              <div key={p} className="absolute left-1/2 -translate-x-1/2 w-[40px] h-[20px] border-2 border-black" style={{ top: p + "%", background: "linear-gradient(180deg, #b14bff, #22a7ff)", boxShadow: "0 0 12px rgba(177,75,255,0.7)" }} />
            ))}
          </div>

          {/* Crenellations */}
          <div className="absolute left-0 right-0 top-[28px] h-[16px] flex">
            {[0,1,2,3,4,5,6].map(i => (
              <div key={i} className="flex-1 border-x-2 border-t-4 border-black" style={{ background: i % 2 ? "#2a1c5e" : "#3a2585", borderBottom: "none", marginTop: i % 2 ? 0 : 8 }} />
            ))}
          </div>

          {/* Flag */}
          <div className="absolute left-1/2 top-[6px] -translate-x-1/2">
            <div className="w-[3px] h-[28px] bg-black" />
            <div className="absolute left-[3px] top-0 w-[20px] h-[14px] border-2 border-black" style={{ background: "#ff3aa3", boxShadow: "0 0 8px #ff3aa3" }} />
          </div>

          {/* Platforms */}
          {[0.30, 0.50, 0.72].map((p, i) => (
            <div key={i} className="absolute h-[8px] border-2 border-black" style={{ top: (p * 100) + "%", left: i % 2 === 0 ? -28 : "100%", width: 36, background: "#0d8f4a" }} />
          ))}

          {/* Climber */}
          <div className="absolute left-[-22px] climber-bob" style={{ top: "45%" }}>
            <PixelGrid size={64}
              palette={{ K:"#000", s:"#ffd6a8", h:"#3a2585", v:"#b14bff", w:"#fff", b:"#22a7ff", g:"#1eea7c" }}
              rows={["................","......KKKK......",".....KhhhhK.....",".....KsKsKK.....",".....KsssKK.....","  ...KKKKK......","....KvvvvvK.....","...KvKvvvKvK....","...KvKvvvKvK....","...KvvvvvvvK....","...KvvgggvvK.....","  ...KKvvvKK.....","  ...KsKKsK......","  ...KsK.KsK.....",  "...KKK..KKK.....","................"]}
            />
          </div>

          {/* Coins */}
          {[0.62, 0.38, 0.18].map((p, i) => (
            <div key={i} className="absolute left-[120%] climber-bob" style={{ top: (p * 100) + "%", animationDelay: (i * 0.3) + "s" }}>
              <CoinIcon size={20} />
            </div>
          ))}
        </div>

        <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: "inset 0 0 80px rgba(0,0,0,0.7)" }} />
      </div>
    </div>
  );
}
