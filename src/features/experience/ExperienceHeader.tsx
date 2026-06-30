import * as motion from "motion/react-m";

import { DecryptedText } from "@/components/ui/DecryptedText";

import type {
  ElementKey,
  ExperienceData,
  ExperienceStyles,
} from "./ExperienceSection";

interface ExperienceHeaderProps {
  experiences: ExperienceData[];
  getAnimState: (key: ElementKey) => "decrypt" | "hidden" | "idle";
  phaseKey: string;
  stepData: ExperienceData;
  styles: ExperienceStyles;
}

export function ExperienceHeader({
  experiences,
  getAnimState,
  phaseKey,
  stepData,
  styles,
}: ExperienceHeaderProps) {
  const companyState = getAnimState("company");
  const locationState = getAnimState("location");
  const roleState = getAnimState("role");
  const periodState = getAnimState("period");

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
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
        <motion.div
          animate={{ opacity: 1 }}
          className="pointer-events-auto visible col-start-1 row-start-1"
          initial={{ opacity: 0.86 }}
          key={`identity-${phaseKey}`}
          transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className={`text-xl font-semibold ${styles.title} min-h-7`}>
            <DecryptedText
              animate={companyState}
              speed={15}
              text={stepData.company}
            />
          </h2>
          <p className={`mt-1 min-h-5 text-sm ${styles.muted}`}>
            <DecryptedText
              animate={locationState}
              speed={15}
              text={stepData.location}
            />
          </p>
        </motion.div>
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
        <motion.div
          animate={{ opacity: 1 }}
          className="pointer-events-auto visible col-start-1 row-start-1"
          initial={{ opacity: 0.86 }}
          key={`meta-${phaseKey}`}
          transition={{ delay: 0.04, duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className={`font-medium ${styles.role} min-h-5`}>
            <DecryptedText
              animate={roleState}
              speed={15}
              text={stepData.role}
            />
          </p>
          <p className="mt-1 min-h-5">
            <DecryptedText
              animate={periodState}
              speed={15}
              text={stepData.period}
            />
          </p>
        </motion.div>
      </div>
    </div>
  );
}
