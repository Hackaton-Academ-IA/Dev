"use client";

import React, { useState, useEffect, useRef } from "react";
import { Castle, Swords, Trophy, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Dungeon {
  id: string;
  name: string;
  x: number; // Percentage (20 to 80)
  y: number; // Pixels
  type: "dungeon" | "boss" | "start";
  completed: boolean;
}

const DUNGEONS: Dungeon[] = [
  { id: "1", name: "Le Commencement", x: 50, y: 100, type: "start", completed: true },
  { id: "2", name: "Forêt des Murmures", x: 30, y: 350, type: "dungeon", completed: false },
  { id: "3", name: "Grottes de Cristal", x: 70, y: 600, type: "dungeon", completed: false },
  { id: "4", name: "Marais Toxique", x: 40, y: 850, type: "dungeon", completed: false },
  { id: "5", name: "Temple du Soleil", x: 60, y: 1100, type: "dungeon", completed: false },
  { id: "6", name: "Forteresse de Fer", x: 50, y: 1350, type: "boss", completed: false },
  // Adding more for "infinite" feel
  { id: "7", name: "Pics Glacés", x: 35, y: 1600, type: "dungeon", completed: false },
  { id: "8", name: "Ruines du Désert", x: 65, y: 1850, type: "dungeon", completed: false },
  { id: "9", name: "Abîme Oubliée", x: 45, y: 2100, type: "boss", completed: false },
];

export default function QuizzPage() {
  const [selectedDungeon, setSelectedDungeon] = useState<Dungeon | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate the SVG path data
  const generatePath = () => {
    if (DUNGEONS.length < 2) return "";
    
    return DUNGEONS.map((d, i) => {
      const xPos = `${d.x}%`;
      const yPos = d.y;
      return i === 0 ? `M ${xPos} ${yPos}` : `L ${xPos} ${yPos}`;
    }).join(" ");
  };

  return (
    <div className="relative min-h-screen bg-zinc-950 overflow-x-hidden">
      {/* Dungeon Floor Background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(to right, #18181b 1px, transparent 1px),
            linear-gradient(to bottom, #18181b 1px, transparent 1px),
            radial-gradient(circle at center, #27272a 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px, 80px 80px, 40px 40px',
          backgroundAttachment: 'fixed',
          backgroundColor: '#09090b'
        }}
      />
      
      {/* Texture overlay for more "stone" feel */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundAttachment: 'fixed'
        }}
      />

      {/* Map Content Container */}
      <div 
        ref={containerRef}
        className="relative w-full max-w-2xl mx-auto py-20 px-4 min-h-[2500px]"
      >
        {/* SVG Path connecting dungeons */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <motion.path
            d={generatePath()}
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeDasharray="12 8"
            className="text-zinc-800 dark:text-zinc-700"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        </svg>

        {/* Dungeons Nodes */}
        {DUNGEONS.map((dungeon) => (
          <div
            key={dungeon.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 group"
            style={{ left: `${dungeon.x}%`, top: dungeon.y }}
          >
            <button
              onClick={() => setSelectedDungeon(dungeon)}
              className={`
                relative flex items-center justify-center w-16 h-16 rounded-2xl 
                border-4 transition-all duration-300 transform group-hover:scale-110 group-active:scale-95
                ${dungeon.completed 
                  ? "bg-emerald-500/20 border-emerald-500 text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]" 
                  : "bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200"
                }
              `}
            >
              {dungeon.type === "start" && <Trophy className="w-8 h-8" />}
              {dungeon.type === "dungeon" && <Castle className="w-8 h-8" />}
              {dungeon.type === "boss" && <Swords className="w-8 h-8" />}
              
              {/* Tooltip/Label */}
              <div className="absolute top-full mt-3 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                <p className="text-xs font-bold text-zinc-200">{dungeon.name}</p>
              </div>
            </button>
          </div>
        ))}
      </div>

      {/* Quiz Modal */}
      <AnimatePresence>
        {selectedDungeon && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDungeon(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 rounded-xl">
                    <Castle className="w-6 h-6 text-emerald-500" />
                  </div>
                  <h2 className="text-xl font-bold text-zinc-100">
                    {selectedDungeon.name}
                  </h2>
                </div>
                <button 
                  onClick={() => setSelectedDungeon(null)}
                  className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-zinc-100"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-8">
                <div className="aspect-video w-full bg-zinc-800/50 rounded-2xl mb-6 flex items-center justify-center border border-dashed border-zinc-700">
                  <p className="text-zinc-500 text-sm">Contenu du Quiz pour {selectedDungeon.name}</p>
                </div>
                
                <button className="w-full py-4 bg-zinc-100 hover:bg-white text-zinc-950 font-bold rounded-2xl transition-all active:scale-[0.98]">
                  Commencer le défi
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
