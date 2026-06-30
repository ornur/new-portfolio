import { DecryptedText } from "@/components/ui/DecryptedText";

import type {
  ElementKey,
  ExperienceData,
  ExperienceStyles,
} from "./ExperienceSection";

interface ExperienceHeaderProps {
  experiences: ExperienceData[];
  getAnimState: (key: ElementKey) => "decrypt" | "hidden" | "idle";
  stepData: ExperienceData;
  styles: ExperienceStyles;
}

export function ExperienceHeader({
  experiences,
  getAnimState,
  stepData,
  styles,
}: ExperienceHeaderProps) {
  return (
    <div className="-mt-8 flex flex-col gap-2 md:mt-0 md:flex-row md:items-start md:justify-between">
      <div className="grid">
        {experiences.map((exp) => (
          <div
            aria-hidden
            className="pointer-events-none invisible col-start-1 row-start-1"
            key={`${exp.company}-${exp.location}`}
          >
            <h2 className={`text-xl font-semibold ${styles.title} min-h-7`}>
              {exp.company}
            </h2>
            <p className={`mt-1 min-h-5 text-sm ${styles.muted}`}>
              {exp.location}
            </p>
          </div>
        ))}
        <div className="pointer-events-auto visible col-start-1 row-start-1">
          <h2 className={`text-xl font-semibold ${styles.title} min-h-7`}>
            <DecryptedText
              animate={getAnimState("company")}
              speed={15}
              text={stepData.company}
            />
          </h2>
          <p className={`mt-1 min-h-5 text-sm ${styles.muted}`}>
            <DecryptedText
              animate={getAnimState("location")}
              speed={15}
              text={stepData.location}
            />
          </p>
        </div>
      </div>

      <div className={`grid text-sm ${styles.muted} text-left md:text-right`}>
        {experiences.map((exp) => (
          <div
            aria-hidden
            className="pointer-events-none invisible col-start-1 row-start-1"
            key={`${exp.role}-${exp.period}`}
          >
            <p className={`font-medium ${styles.role} min-h-5`}>{exp.role}</p>
            <p className="mt-1 min-h-5">{exp.period}</p>
          </div>
        ))}
        <div className="pointer-events-auto visible col-start-1 row-start-1">
          <p className={`font-medium ${styles.role} min-h-5`}>
            <DecryptedText
              animate={getAnimState("role")}
              speed={15}
              text={stepData.role}
            />
          </p>
          <p className="mt-1 min-h-5">
            <DecryptedText
              animate={getAnimState("period")}
              speed={15}
              text={stepData.period}
            />
          </p>
        </div>
      </div>
    </div>
  );
}
