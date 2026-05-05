"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft, Castle, Swords, Trophy, Mountain, Flame, Snowflake, Sun, Skull,
  Zap, Star, Eye, Cpu, Globe, Atom, Lock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DUNGEONS, DUNGEON_COUNT, MAP_HEIGHT, type Dungeon, type DonjonStatus } from "@/lib/game/constants";

// Map iconName strings → Lucide components (client-only)
const ICON_MAP: Record<string, React.ElementType> = {
  Trophy, Castle, Swords, Mountain, Flame, Snowflake, Sun, Skull, Zap, Star, Eye, Cpu, Globe, Atom, Lock,
};

const BADGE_LETTERS = ["A", "B", "C", "D"];

const STARS_BG = [
  "radial-gradient(1px 1px at 10% 15%, rgba(255,255,255,0.7) 0%, transparent 100%)",
  "radial-gradient(1px 1px at 23% 42%, rgba(255,255,255,0.5) 0%, transparent 100%)",
  "radial-gradient(1px 1px at 67% 8%,  rgba(255,255,255,0.6) 0%, transparent 100%)",
  "radial-gradient(1px 1px at 81% 33%, rgba(255,255,255,0.4) 0%, transparent 100%)",
  "radial-gradient(1px 1px at 45% 72%, rgba(255,255,255,0.5) 0%, transparent 100%)",
  "radial-gradient(1px 1px at 88% 61%, rgba(255,255,255,0.6) 0%, transparent 100%)",
  "radial-gradient(1px 1px at 12% 85%, rgba(255,255,255,0.4) 0%, transparent 100%)",
  "radial-gradient(1px 1px at 55% 23%, rgba(255,255,255,0.5) 0%, transparent 100%)",
  "radial-gradient(1px 1px at 34% 57%, rgba(255,255,255,0.3) 0%, transparent 100%)",
  "radial-gradient(1px 1px at 76% 89%, rgba(255,255,255,0.6) 0%, transparent 100%)",
  "radial-gradient(1px 1px at 6%  52%, rgba(255,255,255,0.4) 0%, transparent 100%)",
  "radial-gradient(1px 1px at 93% 19%, rgba(255,255,255,0.5) 0%, transparent 100%)",
  "radial-gradient(2px 2px at 40% 38%, rgba(180,75,255,0.35) 0%, transparent 100%)",
  "radial-gradient(2px 2px at 72% 74%, rgba(34,167,255,0.30) 0%, transparent 100%)",
  "radial-gradient(2px 2px at 20% 66%, rgba(30,234,124,0.25) 0%, transparent 100%)",
].join(",");

interface QuizData {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  matiere?: string;
  source?: "gemini" | "fallback";
}

function generateOrganicPath(dungeons: Dungeon[]): string {
  if (dungeons.length < 2) return "";
  let path = `M ${dungeons[0].x} ${dungeons[0].y}`;
  for (let i = 1; i < dungeons.length; i++) {
    const prev = dungeons[i - 1];
    const curr = dungeons[i];
    const midY = (prev.y + curr.y) / 2;
    const bias = i % 2 === 0 ? 0.25 : -0.25;
    const cx = prev.x + (curr.x - prev.x) * (0.5 + bias);
    path += ` Q ${cx} ${midY} ${curr.x} ${curr.y}`;
  }
  return path;
}

function PixelSkeleton() {
  return (
    <div className="space-y-3">
      <div className="h-3 bg-[#1c1240] rounded animate-pulse w-3/4" />
      <div className="h-3 bg-[#1c1240] rounded animate-pulse w-full" />
      <div className="h-3 bg-[#1c1240] rounded animate-pulse w-5/6" />
      <div className="mt-5 space-y-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-12 bg-[#1c1240] rounded animate-pulse" style={{ animationDelay: `${i * 0.12}s` }} />
        ))}
      </div>
    </div>
  );
}

export default function QuizzPage() {
  const [donjonStatuses, setDonjonStatuses] = useState<Record<number, DonjonStatus>>({ 1: "UNLOCKED" });
  const [progressionLoaded, setProgressionLoaded] = useState(false);

  const [selectedDungeon, setSelectedDungeon] = useState<Dungeon | null>(null);
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<number | null>(null);
  const [xpGained, setXpGained] = useState(0);
  const [showXpFloat, setShowXpFloat] = useState(false);
  const [playerStats, setPlayerStats] = useState<{ xp: number; niveau: number; xpSeuil: number } | null>(null);

  // Scroll to bottom so start node is visible
  useEffect(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" });
  }, []);

  // Fetch initial XP state for the HUD bar
  useEffect(() => {
    fetch("/api/game/answer")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { if (data && !data.error) setPlayerStats(data); })
      .catch(() => {});
  }, []);

  // Load real dunjon progression from DB
  useEffect(() => {
    fetch("/api/game/progression")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.statuses) {
          const s: Record<number, DonjonStatus> = { ...data.statuses };
          if (!s[1]) s[1] = "UNLOCKED"; // dunjon 1 always accessible
          setDonjonStatuses(s);
        }
      })
      .catch(() => {})
      .finally(() => setProgressionLoaded(true));
  }, []);

  const fullPath = useMemo(() => generateOrganicPath(DUNGEONS), []);

  const completedPath = useMemo(() => {
    const lastIdx = DUNGEONS.reduce((acc, d, i) =>
      donjonStatuses[d.id] === "COMPLETED" ? i : acc, -1);
    return lastIdx >= 1 ? generateOrganicPath(DUNGEONS.slice(0, lastIdx + 1)) : "";
  }, [donjonStatuses]);

  const heroPos = useMemo(() => {
    for (let i = DUNGEONS.length - 1; i >= 0; i--) {
      if (donjonStatuses[DUNGEONS[i].id] === "COMPLETED") return DUNGEONS[i];
    }
    return DUNGEONS[0];
  }, [donjonStatuses]);

  const openDungeon = (dungeon: Dungeon) => {
    if ((donjonStatuses[dungeon.id] ?? "LOCKED") === "LOCKED") return;
    setSelectedDungeon(dungeon);
    setQuiz(null);
    setAnswer(null);
    setLoading(false);
    setXpGained(0);
  };

  const closeModal = () => {
    setSelectedDungeon(null);
    setQuiz(null);
    setAnswer(null);
    setLoading(false);
    setXpGained(0);
  };

  const continueToNext = () => {
    if (!selectedDungeon) return;
    const currentIdx = DUNGEONS.findIndex((d) => d.id === selectedDungeon.id);
    const next = currentIdx >= 0 && currentIdx < DUNGEONS.length - 1 ? DUNGEONS[currentIdx + 1] : null;
    closeModal();
    if (next) setTimeout(() => openDungeon(next), 350);
  };

  const startQuiz = async () => {
    if (!selectedDungeon) return;
    setLoading(true);
    setQuiz(null);
    setAnswer(null);
    setXpGained(0);
    try {
      const res = await fetch("/api/quiz/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: selectedDungeon.name, difficulty: selectedDungeon.difficulty }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setQuiz(data);
    } catch {
      // keep loading=false so user can retry
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (index: number) => {
    if (answer !== null || !quiz || !selectedDungeon) return;
    setAnswer(index);

    if (index === quiz.correctAnswer) {
      const xp = selectedDungeon.xpReward;
      setXpGained(xp);
      setShowXpFloat(true);
      setTimeout(() => setShowXpFloat(false), 1600);

      // Persist XP + dunjon completion to DB
      fetch("/api/game/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ xpGained: xp, donjonId: selectedDungeon.id }),
      })
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => { if (data && !data.error) setPlayerStats(data); })
        .catch(() => {});

      // Optimistic update — mark COMPLETED + unlock next
      setDonjonStatuses((prev) => {
        const next = { ...prev, [selectedDungeon.id]: "COMPLETED" as DonjonStatus };
        if (selectedDungeon.id < DUNGEON_COUNT) {
          const nextId = selectedDungeon.id + 1;
          if (next[nextId] !== "COMPLETED") next[nextId] = "UNLOCKED";
        }
        return next;
      });
    }
  };

  const ModalIcon = selectedDungeon ? (ICON_MAP[selectedDungeon.iconName] ?? Trophy) : Trophy;
  const isCorrect = answer !== null && quiz !== null && answer === quiz.correctAnswer;
  const xpPercent = playerStats
    ? Math.min(100, Math.round((playerStats.xp / playerStats.xpSeuil) * 100))
    : 0;
  const completedCount = Object.values(donjonStatuses).filter((s) => s === "COMPLETED").length;

  return (
    <div className="relative overflow-x-hidden" style={{ background: "#09090b" }}>

      {/* Background layers */}
      <div className="fixed inset-0 pointer-events-none"
           style={{ background: "radial-gradient(ellipse 80% 60% at 50% 35%, #1a0838 0%, #0d0520 45%, #09090b 100%)" }} />
      <div className="fixed inset-0 pointer-events-none"
           style={{
             backgroundImage: `linear-gradient(to right, rgba(122,48,208,0.22) 1px, transparent 1px), linear-gradient(to bottom, rgba(122,48,208,0.22) 1px, transparent 1px)`,
             backgroundSize: "80px 80px",
           }} />
      <div className="fixed inset-0 pointer-events-none" style={{ backgroundImage: STARS_BG }} />

      {/* HUD */}
      <div className="fixed top-0 left-0 right-0 z-40 flex flex-col">
        <div className="h-1.5 bg-[#0d0a1a] border-b border-[#1c1240]">
          <motion.div
            className="h-full"
            style={{ background: "var(--emerald)", boxShadow: "0 0 6px var(--emerald)" }}
            animate={{ width: `${xpPercent}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
        <div className="flex items-center justify-between bg-[#080616]/90 border-b border-[#1c1240] px-3 py-1.5 backdrop-blur-sm">
          <Link href="/dashboard" className="arcade arcade-ghost font-pixel text-[7px] flex items-center gap-1.5 py-1 px-2">
            <ArrowLeft className="w-2.5 h-2.5" />
            RETOUR
          </Link>
          {playerStats ? (
            <div className="font-pixel text-[7px] flex items-center gap-2">
              <span className="text-[var(--gold)]">LVL {playerStats.niveau}</span>
              <span className="text-[var(--ink-dim)]">{playerStats.xp} / {playerStats.xpSeuil} XP</span>
            </div>
          ) : <div />}
          {progressionLoaded && (
            <div className="font-pixel text-[7px] text-[var(--ink-dim)]">
              {completedCount}/{DUNGEON_COUNT} DONJONS
            </div>
          )}
        </div>
      </div>

      {/* Map */}
      <div className="relative w-full max-w-2xl mx-auto" style={{ height: MAP_HEIGHT }}>
        <svg
          viewBox={`0 0 100 ${MAP_HEIGHT}`}
          preserveAspectRatio="none"
          className="absolute inset-0 w-full pointer-events-none"
          style={{ height: MAP_HEIGHT }}
        >
          <path d={fullPath} fill="none" stroke="#b14bff" strokeWidth="12" strokeDasharray="10 10" opacity="0.07" vectorEffect="non-scaling-stroke" />
          <motion.path d={fullPath} fill="none" stroke="#b14bff" strokeWidth="3" strokeDasharray="10 10"
            vectorEffect="non-scaling-stroke" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }} />
          <AnimatePresence>
            {completedPath && (
              <motion.path key={completedPath} d={completedPath} fill="none" stroke="#1eea7c"
                strokeWidth="3" strokeDasharray="10 10" vectorEffect="non-scaling-stroke"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }} />
            )}
          </AnimatePresence>
        </svg>

        {/* +XP float */}
        <AnimatePresence>
          {showXpFloat && (
            <motion.div
              className="absolute -translate-x-1/2 pointer-events-none z-30 font-pixel text-[11px]"
              style={{ left: `${heroPos.x}%`, top: heroPos.y - 110, color: "#1eea7c", textShadow: "0 0 10px #1eea7c, 2px 2px 0 #000" }}
              initial={{ opacity: 1, y: 0 }} animate={{ opacity: 0, y: -40 }} transition={{ duration: 1.5, ease: "easeOut" }}
            >
              +{xpGained} XP
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero */}
        <motion.div
          className="absolute -translate-x-1/2 pointer-events-none z-20 flex flex-col items-center"
          style={{ left: `${heroPos.x}%`, top: heroPos.y - 64 }}
          animate={{ y: [0, -7, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-[30px] drop-shadow-[0_3px_0_#000]">⚔️</span>
          <span className="font-pixel text-[6px] text-[var(--gold)] mt-0.5" style={{ textShadow: "1px 1px 0 #000" }}>HÉROS</span>
        </motion.div>

        {/* Dungeon nodes */}
        {DUNGEONS.map((dungeon) => {
          const DungeonIcon = ICON_MAP[dungeon.iconName] ?? Trophy;
          const status = donjonStatuses[dungeon.id] ?? "LOCKED";
          const done = status === "COMPLETED";
          const locked = status === "LOCKED";
          const isBoss = dungeon.type === "boss";

          return (
            <div key={dungeon.id} className="absolute -translate-x-1/2 -translate-y-1/2"
                 style={{ left: `${dungeon.x}%`, top: dungeon.y }}>
              <button
                onClick={() => openDungeon(dungeon)}
                disabled={locked}
                className="group flex flex-col items-center gap-2 focus:outline-none disabled:cursor-not-allowed"
              >
                <motion.div
                  whileHover={!locked ? { scale: 1.1 } : {}}
                  whileTap={!locked ? { scale: 0.92 } : {}}
                  className="relative flex items-center justify-center w-14 h-14 rounded-xl border-4"
                  style={{
                    background: locked ? "#0a0818" : done ? `${dungeon.color}1a` : "#0d0a1a",
                    borderColor: locked ? "#1a1240" : done ? dungeon.color : isBoss ? "#ff4d4d" : "#2a1c5e",
                    boxShadow: done ? `0 0 20px ${dungeon.color}55, 0 4px 0 #000`
                              : locked ? "none"
                              : isBoss ? "0 0 12px #ff4d4d44, 0 4px 0 #000"
                              : "0 4px 0 #000",
                    opacity: locked ? 0.35 : 1,
                  }}
                >
                  {locked
                    ? <Lock className="w-6 h-6" style={{ color: "#3a2c6e" }} />
                    : <DungeonIcon className="w-7 h-7" style={{ color: done ? dungeon.color : isBoss ? "#ff4d4d" : "#6a5eaa" }} />
                  }
                  {isBoss && !done && !locked && (
                    <span className="absolute -top-2.5 -right-2.5 font-pixel text-[6px] bg-[var(--danger)] text-white px-1.5 py-0.5 rounded"
                          style={{ textShadow: "1px 1px 0 #000" }}>BOSS</span>
                  )}
                  {status === "UNLOCKED" && (
                    <motion.div
                      className="absolute inset-0 rounded-xl border-2 pointer-events-none"
                      style={{ borderColor: isBoss ? "#ff4d4d" : dungeon.color }}
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </motion.div>
                <span className="font-pixel text-[7px] text-center leading-[1.6] max-w-[90px]"
                      style={{ color: locked ? "#2a1c5e" : done ? dungeon.color : "#6a5eaa", textShadow: locked ? "none" : "1px 1px 0 #000" }}>
                  {dungeon.name}
                </span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedDungeon && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closeModal} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 420, damping: 32 }}
              onClick={(e) => e.stopPropagation()}
              className="modal-pop relative w-full max-w-md flex flex-col panel panel-violet overflow-hidden"
              style={{ maxHeight: "90vh" }}
            >
              <div className="titlebar titlebar-violet flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <ModalIcon className="w-4 h-4" style={{ color: selectedDungeon.color }} />
                  <span className="font-pixel text-[8px] text-white" style={{ textShadow: "2px 2px 0 #000" }}>
                    {selectedDungeon.name.toUpperCase()}
                  </span>
                </div>
                <button onClick={closeModal} className="font-pixel text-[10px] text-white/60 hover:text-white px-1">✕</button>
              </div>

              <div className="p-5 overflow-y-auto flex-1 space-y-4">

                {/* Confirm */}
                {!loading && !quiz && (
                  <>
                    <div className="flex flex-wrap gap-2">
                      <span className={`chip ${selectedDungeon.type === "boss" ? "chip-danger" : selectedDungeon.type === "start" ? "chip-gold" : "chip-violet"}`}>
                        {selectedDungeon.type === "boss" ? "⚔ BOSS" : selectedDungeon.type === "start" ? "★ DÉPART" : "◎ DONJON"}
                      </span>
                      <span className="chip chip-blue">DIFF. {selectedDungeon.difficulty}</span>
                      <span className="chip chip-gold">+{selectedDungeon.xpReward} XP</span>
                      {donjonStatuses[selectedDungeon.id] === "COMPLETED" && (
                        <span className="chip chip-emerald">✓ TERMINÉ</span>
                      )}
                    </div>
                    <div className="bg-[#0d0a1a] border border-[#2a1c5e] rounded-lg p-4 flex gap-3 items-start">
                      <ModalIcon className="w-8 h-8 shrink-0 mt-0.5" style={{ color: selectedDungeon.color }} />
                      <p className="font-mono-pixel text-[15px] text-[var(--ink-dim)] leading-[1.5]">
                        Entrez dans <span className="text-white">{selectedDungeon.name}</span>.
                        Une épreuve unique générée par l&apos;IA vous attend.
                      </p>
                    </div>
                    <button onClick={startQuiz} className="arcade arcade-emerald arcade-glow w-full font-pixel text-[10px] py-3">
                      ▶ ENTRER DANS LE DONJON
                    </button>
                    <button onClick={closeModal} className="arcade arcade-ghost w-full font-pixel text-[9px] py-2">
                      ← RETRAITE
                    </button>
                  </>
                )}

                {/* Loading */}
                {loading && (
                  <>
                    <p className="font-mono-pixel text-[16px] text-[var(--ink-dim)]">
                      <span style={{ color: "var(--neon-violet)" }}>&gt; </span>
                      L&apos;IA génère votre quête
                      <span className="caret ml-1" style={{ color: "var(--emerald)" }} />
                    </p>
                    <PixelSkeleton />
                  </>
                )}

                {/* Quiz */}
                {quiz && !loading && (
                  <>
                    {quiz.matiere && (
                      <div className="flex items-center gap-2">
                        <span className="chip chip-blue">🎓 Défi : {quiz.matiere}</span>
                      </div>
                    )}
                    <div className="bg-[#0d0a1a] border border-[#2a1c5e] rounded-lg p-4">
                      <p className="font-mono-pixel text-[17px] text-white leading-[1.5]">{quiz.question}</p>
                    </div>
                    <div className="space-y-2">
                      {quiz.options.map((option, i) => {
                        const correct = i === quiz.correctAnswer;
                        const chosen = answer === i;
                        const answered = answer !== null;
                        let cls = "qcm w-full text-left flex items-center gap-3";
                        if (answered) {
                          if (correct) cls += " correct";
                          else if (chosen) cls += " wrong";
                          else cls += " muted";
                        }
                        return (
                          <button key={i} onClick={() => handleAnswer(i)} disabled={answered} className={cls}>
                            <span className={`badge-letter shrink-0 ${answered && correct ? "b-emerald" : "b-blue"}`}>
                              {BADGE_LETTERS[i]}
                            </span>
                            <span className="font-mono-pixel text-[16px]">{option}</span>
                          </button>
                        );
                      })}
                    </div>
                    <AnimatePresence>
                      {answer !== null && (
                        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                          className="bg-[#0d0a1a] border border-[#2a1c5e] rounded-lg p-4 space-y-3">
                          <div className="flex flex-wrap gap-2">
                            <span className={`chip ${isCorrect ? "chip-emerald" : "chip-danger"}`}>
                              {isCorrect ? "✓ CORRECT !" : "✗ RATÉ !"}
                            </span>
                            {quiz.source === "fallback" && <span className="chip chip-ghost">HORS-LIGNE</span>}
                          </div>
                          {isCorrect && (
                            <p className="font-mono-pixel text-[15px]" style={{ color: "#1eea7c", textShadow: "0 0 8px #1eea7c55" }}>
                              ★ Bravo ! Tu as gagné <strong>{xpGained} XP</strong>
                            </p>
                          )}
                          <p className="font-mono-pixel text-[15px] text-[var(--ink-dim)] leading-[1.4]">
                            {quiz.explanation}
                          </p>
                          {isCorrect ? (
                            <div className="space-y-2 pt-1">
                              {selectedDungeon.id < DUNGEON_COUNT && (
                                <button onClick={continueToNext} className="arcade arcade-emerald arcade-glow w-full font-pixel text-[9px] py-2">
                                  ↑ CONTINUER L&apos;ASCENSION
                                </button>
                              )}
                              <div className="flex gap-2">
                                <button onClick={startQuiz} className="arcade w-full font-pixel text-[8px] py-2">↺ REJOUER</button>
                                <button onClick={closeModal} className="arcade arcade-ghost w-full font-pixel text-[8px] py-2">✕ QUITTER</button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex gap-2 pt-1">
                              <button onClick={startQuiz} className="arcade w-full font-pixel text-[9px] py-2">↺ REJOUER</button>
                              <button onClick={closeModal} className="arcade arcade-ghost w-full font-pixel text-[9px] py-2">✕ QUITTER</button>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
