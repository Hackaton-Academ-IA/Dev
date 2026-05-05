"use client";

import React, { useState, useEffect, useRef } from "react";
import { Castle, Swords, Trophy, X, ChevronRight, BrainCircuit } from "lucide-react";
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
  { id: "7", name: "Pics Glacés", x: 35, y: 1600, type: "dungeon", completed: false },
  { id: "8", name: "Ruines du Désert", x: 65, y: 1850, type: "dungeon", completed: false },
  { id: "9", name: "Abîme Oubliée", x: 45, y: 2100, type: "boss", completed: false },
];

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  source?: "gemini" | "fallback";
}

export default function QuizzPage() {
  const [selectedDungeon, setSelectedDungeon] = useState<Dungeon | null>(null);
  const [quizQuestion, setQuizQuestion] = useState<QuizQuestion | null>(null);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [userAnswer, setUserAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const startQuiz = async (dungeon: Dungeon) => {
    setLoadingQuiz(true);
    setQuizQuestion(null);
    setUserAnswer(null);
    setShowExplanation(false);
    
    try {
      const response = await fetch("/api/quiz/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          theme: dungeon.name, 
          difficulty: dungeon.type === "boss" ? 8 : 5 
        }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setQuizQuestion(data);
    } catch (error) {
      console.error("Error starting quiz:", error);
    } finally {
      setLoadingQuiz(false);
    }
  };

  useEffect(() => {
    if (!selectedDungeon) {
      setQuizQuestion(null);
      setUserAnswer(null);
      setShowExplanation(false);
    }
  }, [selectedDungeon]);

  const handleAnswer = (index: number) => {
    if (userAnswer !== null) return;
    setUserAnswer(index);
    setShowExplanation(true);
  };

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
              className="relative w-full max-w-xl max-h-[90vh] bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50 backdrop-blur-md shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-emerald-500/10 rounded-lg">
                    {selectedDungeon.type === "boss" ? <Swords className="w-5 h-5 text-emerald-500" /> : <Castle className="w-5 h-5 text-emerald-500" />}
                  </div>
                  <h2 className="text-lg font-bold text-zinc-100">
                    {selectedDungeon.name}
                  </h2>
                </div>
                <button 
                  onClick={() => setSelectedDungeon(null)}
                  className="p-1.5 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-zinc-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-5 overflow-y-auto flex-1 scrollbar-hide">
                {!quizQuestion && !loadingQuiz && (
                  <div className="flex flex-col gap-4">
                    <div className="aspect-[21/9] w-full bg-zinc-800/50 rounded-xl flex flex-col items-center justify-center border border-dashed border-zinc-700 p-4 text-center">
                      <div className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center mb-2 border border-zinc-700">
                        <BrainCircuit className="w-5 h-5 text-zinc-400" />
                      </div>
                      <p className="text-zinc-300 text-sm font-medium">Prêt pour l'épreuve ?</p>
                    </div>
                    
                    <button 
                      onClick={() => startQuiz(selectedDungeon)}
                      className="w-full py-3 bg-zinc-100 hover:bg-white text-zinc-950 font-bold rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 group text-sm"
                    >
                      Commencer le défi
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                )}

                {loadingQuiz && (
                  <div className="py-10 flex flex-col items-center justify-center gap-4">
                    <div className="w-10 h-10 border-4 border-zinc-800 border-t-emerald-500 rounded-full animate-spin" />
                    <p className="text-zinc-500 text-xs animate-pulse">Génération de l'épreuve...</p>
                  </div>
                )}

                {quizQuestion && (
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <div className="inline-flex px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-500">Question</span>
                      </div>
                      <h3 className="text-base font-bold text-zinc-100 leading-snug">
                        {quizQuestion.question}
                      </h3>
                    </div>

                    <div className="grid gap-2">
                      {quizQuestion.options.map((option, index) => (
                        <button
                          key={index}
                          disabled={userAnswer !== null}
                          onClick={() => handleAnswer(index)}
                          className={`
                            w-full p-3 rounded-xl text-left transition-all border-2 text-sm
                            ${userAnswer === null 
                              ? "bg-zinc-800/30 border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800/50" 
                              : index === quizQuestion.correctAnswer
                                ? "bg-emerald-500/10 border-emerald-500 text-emerald-400"
                                : userAnswer === index
                                  ? "bg-red-500/10 border-red-500 text-red-400"
                                  : "bg-zinc-900 border-zinc-800 opacity-40"
                            }
                          `}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`
                              w-7 h-7 rounded-lg border-2 flex items-center justify-center text-xs font-black shrink-0 transition-colors
                              ${userAnswer === null 
                                ? "bg-zinc-900 border-zinc-700 text-zinc-500" 
                                : index === quizQuestion.correctAnswer
                                  ? "bg-emerald-500 border-emerald-400 text-emerald-950"
                                  : userAnswer === index
                                    ? "bg-red-500 border-red-400 text-red-950"
                                    : "bg-zinc-950 border-zinc-800 text-zinc-700"
                              }
                            `}>
                              {String.fromCharCode(65 + index)}
                            </span>
                            <span className="font-medium">{option}</span>
                          </div>
                        </button>
                      ))}
                    </div>

                    <AnimatePresence>
                      {showExplanation && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 bg-zinc-800/30 border border-zinc-800 rounded-xl relative overflow-hidden"
                        >
                          <p className="text-xs text-zinc-400 leading-relaxed italic">
                            {quizQuestion.explanation}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {userAnswer !== null && (
                      <button 
                        onClick={() => setSelectedDungeon(null)}
                        className="w-full py-3 bg-zinc-100 hover:bg-white text-zinc-950 font-black rounded-xl transition-all text-sm"
                      >
                        QUITTER
                      </button>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
