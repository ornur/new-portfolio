interface ExperienceProgressBadgeProps {
  total: number;
  visibleIndex: number;
}

export function ExperienceProgressBadge({
  total,
  visibleIndex,
}: ExperienceProgressBadgeProps) {
  return (
    <span className="dark:bg-neon bg-foreground text-background dark:text-background -mt-6 -mr-6 flex h-10 w-16 items-center justify-center self-end rounded-tr-xl rounded-bl-3xl px-2 text-sm font-bold md:-mt-8 md:-mr-8 md:rounded-bl-2xl md:text-base">
      {Math.max(visibleIndex, 1)}/{total}
    </span>
  );
}
