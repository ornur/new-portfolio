import * as motion from "motion/react-m";

import { DecryptedText } from "@/components/ui/DecryptedText";

import type {
  ElementKey,
  ExperienceData,
  ExperienceHighlight,
  ExperienceStyles,
} from "./ExperienceSection";

interface ExperienceHighlightChipProps {
  activeHighlight: ExperienceHighlight;
  experiences: ExperienceData[];
  getAnimState: (key: ElementKey) => "decrypt" | "hidden" | "idle";
  isComplete: boolean;
  phaseKey: string;
  styles: ExperienceStyles;
}

export function ExperienceHighlightChip({
  activeHighlight,
  experiences,
  getAnimState,
  isComplete,
  phaseKey,
  styles,
}: ExperienceHighlightChipProps) {
  const highlightNameState = getAnimState("highlight-name");
  const highlightSummaryState = getAnimState("highlight-summary");

  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="grid gap-4"
      initial={{ opacity: 0.9 }}
      key={`highlight-${phaseKey}`}
      transition={{ delay: 0.08, duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className={`relative overflow-hidden rounded-2xl border p-4 shadow-sm ${styles.chipBorder}`}
      >
        {isComplete && (
          <motion.span
            animate={{ opacity: [0, 0.45, 0], x: ["-120%", "120%"] }}
            aria-hidden
            className="dark:via-neon/35 pointer-events-none absolute inset-y-0 left-0 w-1/2 skew-x-[-18deg] bg-linear-to-r from-transparent via-white/40 to-transparent"
            initial={{ opacity: 0, x: "-120%" }}
            key={`shimmer-${phaseKey}`}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          />
        )}
        <div className="grid">
          {experiences.flatMap((exp) =>
            exp.highlights.map((highlight) => (
              <p
                aria-hidden
                className={`col-start-1 row-start-1 min-h-5 text-sm font-semibold ${styles.title} pointer-events-none invisible`}
                key={`${exp.company}-${highlight.name}`}
              >
                {highlight.name}
              </p>
            )),
          )}
          <p
            className={`col-start-1 row-start-1 min-h-5 text-sm font-semibold ${styles.title} pointer-events-auto visible`}
          >
            <DecryptedText
              animate={highlightNameState}
              speed={15}
              text={activeHighlight.name}
            />
          </p>
        </div>

        <div className="mt-2 grid">
          {experiences.flatMap((exp) =>
            exp.highlights.map((highlight) => (
              <p
                aria-hidden
                className={`col-start-1 row-start-1 min-h-10 text-sm leading-relaxed ${styles.body} pointer-events-none invisible`}
                key={`${exp.company}-${highlight.summary}`}
              >
                {highlight.summary}
              </p>
            )),
          )}
          <p
            className={`col-start-1 row-start-1 min-h-10 text-sm leading-relaxed ${styles.body} pointer-events-auto visible`}
          >
            <DecryptedText
              animate={highlightSummaryState}
              speed={2}
              text={activeHighlight.summary}
            />
          </p>
        </div>
      </div>
    </motion.div>
  );
}
