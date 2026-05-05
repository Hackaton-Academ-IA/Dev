"use client";
import type { Question } from "@/lib/game/types";

type CardStatus = "loading" | "playing" | "explaining";

interface Props {
  status: CardStatus;
  question: Question | null;
  onAnswer: (index: number) => void;
  lastAnswerCorrect: boolean | null;
  lastChosenIndex: number | null;
  correctIndex: number | null;
  disabled: boolean;
}

const LETTERS = ["A", "B", "C", "D"];
const BADGE_TONES = ["", "b-blue", "b-emerald", "b-gold"] as const;

function Skeleton() {
  return (
    <div className="crt-screen p-5 sm:p-7 space-y-5 animate-pulse">
      <div className="flex gap-3 mb-1">
        <div className="h-4 w-24 bg-[#1a1233] rounded" />
        <div className="h-4 w-16 bg-[#1a1233] rounded" />
      </div>
      <div className="space-y-3 min-h-[88px]">
        <div className="h-4 bg-[#1a1233] rounded w-full" />
        <div className="h-4 bg-[#1a1233] rounded w-4/5" />
        <div className="h-4 bg-[#1a1233] rounded w-2/3" />
      </div>
      <div className="grid sm:grid-cols-2 gap-3 mt-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-14 bg-[#1a1233] border-4 border-black rounded" />
        ))}
      </div>
      <div className="font-mono-pixel text-[14px] text-[var(--ink-dim)] text-center pt-2">
        IA EN RÉFLEXION<span className="caret">&nbsp;</span>
      </div>
    </div>
  );
}

export default function QuestionCard({
  status,
  question,
  onAnswer,
  lastAnswerCorrect,
  lastChosenIndex,
  correctIndex,
  disabled,
}: Props) {
  // Critical guard: only leave skeleton when question is fully valid
  if (status === "loading" || !question || question.choix.length !== 4 || !question.contenu) {
    return <Skeleton />;
  }

  return (
    <div className="crt-screen p-5 sm:p-7 space-y-5">
      <div className="flex items-center gap-2 font-mono-pixel text-[14px]">
        <span
          className="font-pixel text-[10px] text-[var(--neon-violet)]"
          style={{ textShadow: "0 0 4px var(--neon-violet)" }}
        >
          {question.matiere.toUpperCase()}
        </span>
        <span className="text-[var(--ink-dim)]">·</span>
        <span className="font-pixel text-[10px] text-[var(--gold)]">
          {question.difficulte.toUpperCase()}
        </span>
      </div>

      <div
        className="font-pixel text-[14px] sm:text-[16px] leading-[1.7] text-white min-h-[88px]"
        style={{ textShadow: "2px 2px 0 #000" }}
      >
        <span style={{ color: "#1eea7c" }}>&gt; </span>
        {question.contenu}
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {question.choix.map((choice, i) => {
          let cls = "qcm";
          if (status === "explaining" && correctIndex !== null) {
            if (i === correctIndex) cls += " correct";
            else if (i === lastChosenIndex) cls += " wrong";
            else cls += " muted";
          }
          return (
            <button
              key={i}
              className={cls}
              disabled={disabled || status === "explaining"}
              onClick={() => onAnswer(i)}
            >
              <span className={`badge-letter ${BADGE_TONES[i]}`}>{LETTERS[i]}</span>
              <span
                className="text-[12px] sm:text-[13px] leading-[1.5]"
                style={{ textShadow: "2px 2px 0 #000" }}
              >
                {choice}
              </span>
              {status === "explaining" && i === correctIndex && (
                <span className="ml-auto font-pixel text-[10px] text-[var(--emerald)]">✔</span>
              )}
              {status === "explaining" && i === lastChosenIndex && i !== correctIndex && (
                <span className="ml-auto font-pixel text-[10px] text-[var(--danger)]">✘</span>
              )}
            </button>
          );
        })}
      </div>

      {status === "explaining" && (
        <div className="border-4 border-black bg-[#0a0720] p-4 font-mono-pixel text-[16px] leading-snug">
          {lastAnswerCorrect ? (
            <span className="text-[var(--emerald)]">★ CORRECT — </span>
          ) : (
            <span className="text-[var(--danger)]">✘ INCORRECT — </span>
          )}
          <span className="text-white/80">{question.explication}</span>
        </div>
      )}
    </div>
  );
}
