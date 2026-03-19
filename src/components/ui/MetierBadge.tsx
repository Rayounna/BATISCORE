import { cn } from "@/lib/utils";
import { METIERS_BTP, type MetierBTP } from "@/types";

interface MetierBadgeProps {
  metier: MetierBTP;
  className?: string;
}

export function MetierBadge({ metier, className }: MetierBadgeProps) {
  const label = METIERS_BTP.find((m) => m.value === metier)?.label ?? metier;

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-batiscore-navy/10 text-batiscore-navy",
        className
      )}
    >
      {label}
    </span>
  );
}
