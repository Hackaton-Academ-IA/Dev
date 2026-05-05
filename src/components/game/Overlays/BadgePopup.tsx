"use client";
import { useEffect, useState } from "react";
import { PixelBadge } from "@/components/ui/PixelIcons";

interface Props {
  queue: string[]; // badge names, shown one at a time
  onDismiss: (name: string) => void;
}

export default function BadgePopup({ queue, onDismiss }: Props) {
  const current = queue[0] ?? null;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!current) return;
    // Enter
    const t1 = setTimeout(() => setVisible(true), 50);
    // Exit after 3s display
    const t2 = setTimeout(() => setVisible(false), 3200);
    // Dismiss after exit animation
    const t3 = setTimeout(() => onDismiss(current), 3600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  if (!current) return null;

  return (
    <div
      className="fixed top-6 right-6 z-[2000]"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(-16px) scale(0.95)",
        transition: "opacity 0.35s, transform 0.35s",
      }}
    >
      <div
        className="panel panel-gold max-w-[280px]"
        style={{ boxShadow: "0 0 24px var(--gold), 0 8px 0 #000" }}
      >
        <div
          className="titlebar titlebar-gold font-pixel text-[10px] text-[#241a00]"
          style={{ textShadow: "1px 1px 0 #6e5300" }}
        >
          ✦ BADGE DÉBLOQUÉ !
        </div>
        <div className="flex items-center gap-4 p-4">
          <PixelBadge kind="crown" size={44} />
          <div>
            <div
              className="font-pixel text-[10px] text-[var(--gold)]"
              style={{ textShadow: "1px 1px 0 #000" }}
            >
              {current.toUpperCase()}
            </div>
            <div className="font-mono-pixel text-[14px] text-[var(--ink-dim)] mt-1">
              + Ajouté à l&apos;inventaire
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
