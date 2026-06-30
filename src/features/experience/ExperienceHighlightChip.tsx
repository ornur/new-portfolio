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
  styles: ExperienceStyles;
}

export function ExperienceHighlightChip({
  activeHighlight,
  experiences,
  getAnimState,
  styles,
}: ExperienceHighlightChipProps) {
  return (
    <div className="mt-2 grid gap-4">
      <div className={`rounded-2xl border p-4 shadow-sm ${styles.chipBorder}`}>
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
              animate={getAnimState("highlight-name")}
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
              animate={getAnimState("highlight-summary")}
              speed={2}
              text={activeHighlight.summary}
            />
          </p>
        </div>
      </div>
    </div>
  );
}
