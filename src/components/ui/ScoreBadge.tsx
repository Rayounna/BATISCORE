"use client";

import { cn } from "@/lib/utils";
import { couleurScore, libelleScore } from "@/lib/score";

interface ScoreBadgeProps {
  score: number | null;
  indicatif?: boolean;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export function ScoreBadge({
  score,
  indicatif = false,
  size = "md",
  showLabel = false,
  className,
}: ScoreBadgeProps) {
  if (score === null) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50",
          size === "sm" && "w-12 h-12 text-xs",
          size === "md" && "w-16 h-16 text-sm",
          size === "lg" && "w-24 h-24 text-base",
          className
        )}
      >
        <span className="text-gray-400 font-semibold">—</span>
        <span className="text-gray-400 text-xs">Nouveau</span>
      </div>
    );
  }

  const colorClass = couleurScore(score);

  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      <div
        className={cn(
          "relative flex flex-col items-center justify-center rounded-xl border-2 font-bold",
          size === "sm" && "w-12 h-12",
          size === "md" && "w-16 h-16",
          size === "lg" && "w-24 h-24",
          score >= 80 && "border-green-400 bg-green-50",
          score >= 60 && score < 80 && "border-yellow-400 bg-yellow-50",
          score >= 40 && score < 60 && "border-orange-400 bg-orange-50",
          score < 40 && "border-red-400 bg-red-50"
        )}
      >
        <span
          className={cn(
            colorClass,
            size === "sm" && "text-lg",
            size === "md" && "text-2xl",
            size === "lg" && "text-4xl"
          )}
        >
          {score}
        </span>
        <span
          className={cn(
            "text-gray-500",
            size === "sm" && "text-[9px]",
            size === "md" && "text-xs",
            size === "lg" && "text-sm"
          )}
        >
          /100
        </span>
        {indicatif && (
          <span
            className="absolute -top-1.5 -right-1.5 bg-amber-400 text-white text-[9px] font-bold px-1 rounded-full"
            title="Score indicatif — moins de 5 avis"
          >
            ~
          </span>
        )}
      </div>
      {showLabel && (
        <span className={cn("text-xs font-semibold", colorClass)}>
          {libelleScore(score)}
        </span>
      )}
    </div>
  );
}
