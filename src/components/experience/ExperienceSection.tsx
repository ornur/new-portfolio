import { type MotionValue, useMotionValueEvent } from "motion/react";
import { useMemo, useState } from "react";
import { useTranslations } from "use-intl";

import { useTheme } from "@/hooks/useTheme";

import { DecryptedText } from "../ui/DecryptedText";

type ElementKey =
  | "company"
  | "highlight-name"
  | "highlight-summary"
  | "location"
  | "period"
  | "role";

interface Phase {
  experienceIndex: number;
  highlightIndex: number;
  kind: PhaseKind;
  revealedKeys: ElementKey[];
}

type PhaseKind =
  | "encrypt-all" // Encrypting everything (between experiences)
  | "encrypt-highlight" // Encrypting only the highlight fields (between highlights of same exp)
  | "hold" // All keys revealed, resting
  | "reveal"; // Revealing keys one-by-one

const ALL_KEYS: ElementKey[] = [
  "company",
  "location",
  "role",
  "period",
  "highlight-name",
  "highlight-summary",
];
const HIGHLIGHT_KEYS: ElementKey[] = ["highlight-name", "highlight-summary"];
const META_KEYS: ElementKey[] = ["company", "location", "role", "period"];

const ExperienceCard = ({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) => {
  const { theme } = useTheme();
  const t = useTranslations("Experience");

  const isDark = theme === "dark";
  const titleText = isDark ? "text-neon" : "text-zinc-900";
  const bodyText = isDark ? "text-zinc-300" : "text-zinc-600";
  const mutedText = isDark ? "text-zinc-400" : "text-zinc-500";
  const roleText = isDark ? "text-zinc-200" : "text-zinc-800";
  const chipBorder = isDark ? "border-white/10" : "border-zinc-900/10";

  const { experiences, timelinePhases } = useMemo(() => {
    const rawExperiences = [
      {
        company: t("data.digital_bridge.company"),
        highlights: [
          {
            name: t("data.digital_bridge.highlights.0.name"),
            summary: t("data.digital_bridge.highlights.0.summary"),
          },
        ],
        location: t("data.digital_bridge.location"),
        period: t("data.digital_bridge.period"),
        role: t("data.digital_bridge.role"),
      },
      {
        company: t("data.ziz_inc.company"),
        highlights: [
          {
            name: t("data.ziz_inc.highlights.0.name"),
            summary: t("data.ziz_inc.highlights.0.summary"),
          },
          {
            name: t("data.ziz_inc.highlights.1.name"),
            summary: t("data.ziz_inc.highlights.1.summary"),
          },
        ],
        location: t("data.ziz_inc.location"),
        period: t("data.ziz_inc.period"),
        role: t("data.ziz_inc.role"),
      },
    ];

    const phases: Phase[] = [];

    rawExperiences.forEach((exp, expIdx) => {
      exp.highlights.forEach((_, hIdx) => {
        // Keys to reveal sequentially for this highlight
        const keysToReveal: ElementKey[] =
          hIdx === 0 ? ALL_KEYS : HIGHLIGHT_KEYS;

        const baseRevealed: ElementKey[] = hIdx === 0 ? [] : META_KEYS;

        const accumulated = [...baseRevealed];

        // Reveal each key as a separate phase
        for (const key of keysToReveal) {
          accumulated.push(key);
          phases.push({
            experienceIndex: expIdx,
            highlightIndex: hIdx,
            kind: "reveal",
            revealedKeys: [...accumulated],
          });
        }

        // Hold phase — all keys revealed, user rests here
        phases.push({
          experienceIndex: expIdx,
          highlightIndex: hIdx,
          kind: "hold",
          revealedKeys: ALL_KEYS,
        });

        const hasNextHighlight = hIdx < exp.highlights.length - 1;
        const hasNextExperience = expIdx < rawExperiences.length - 1;

        if (hasNextHighlight) {
          // Between highlights of the same experience: encrypt only highlight fields
          phases.push({
            experienceIndex: expIdx,
            highlightIndex: hIdx,
            kind: "encrypt-highlight",
            revealedKeys: ALL_KEYS,
          });
        } else if (hasNextExperience) {
          // Between experiences: encrypt everything
          phases.push({
            experienceIndex: expIdx,
            highlightIndex: hIdx,
            kind: "encrypt-all",
            revealedKeys: ALL_KEYS,
          });
        }
      });
    });

    return { experiences: rawExperiences, timelinePhases: phases };
  }, [t]);

  const [activeIndex, setActiveIndex] = useState(0);
  const totalPhases = timelinePhases.length;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const index = Math.min(Math.floor(latest * totalPhases), totalPhases - 1);
    if (index !== activeIndex) setActiveIndex(index);
  });

  const phase = timelinePhases[activeIndex] ?? timelinePhases[0];
  const stepData = experiences[phase.experienceIndex];
  const activeHighlight = stepData.highlights[phase.highlightIndex];

  const getAnimState = (key: ElementKey): "decrypt" | "encrypt" => {
    if (phase.kind === "encrypt-all") return "encrypt";
    if (phase.kind === "encrypt-highlight" && HIGHLIGHT_KEYS.includes(key))
      return "encrypt";
    return phase.revealedKeys.includes(key) ? "decrypt" : "encrypt";
  };

  return (
    <div style={{ height: `${totalPhases * 50}vh`, width: "100%" }}>
      <div className="pointer-events-none sticky top-1/2 flex w-full -translate-y-1/2 items-center justify-center overflow-hidden px-4">
        <div className="border-foreground/20 pointer-events-auto flex w-full max-w-3xl flex-col gap-4 overflow-hidden rounded-3xl border p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 md:p-8">
          {/* Progress indicator */}
          <span className="dark:bg-neon bg-foreground text-background dark:text-background -mt-6 -mr-6 flex h-10 w-16 items-center justify-center self-end rounded-tr-xl rounded-bl-3xl px-2 text-sm font-bold md:-mt-8 md:-mr-8 md:rounded-bl-2xl md:text-base">
            {activeIndex + 1}/{totalPhases}
          </span>
          {/* Header row: company/location + role/period */}
          <div className="-mt-8 flex flex-col gap-2 md:mt-0 md:flex-row md:items-start md:justify-between">
            {/* Company & Location */}
            <div className="grid">
              {/* Ghost spacers to stabilise layout width */}
              {experiences.map((exp, i) => (
                <div
                  aria-hidden
                  className="pointer-events-none invisible col-start-1 row-start-1"
                  key={i}
                >
                  <h2 className={`text-xl font-semibold ${titleText} min-h-7`}>
                    {exp.company}
                  </h2>
                  <p className={`text-sm ${mutedText} mt-1 min-h-5`}>
                    {exp.location}
                  </p>
                </div>
              ))}
              <div className="pointer-events-auto visible col-start-1 row-start-1">
                <h2 className={`text-xl font-semibold ${titleText} min-h-7`}>
                  <DecryptedText
                    animate={getAnimState("company")}
                    speed={15}
                    text={stepData.company}
                  />
                </h2>
                <p className={`text-sm ${mutedText} mt-1 min-h-5`}>
                  <DecryptedText
                    animate={getAnimState("location")}
                    speed={15}
                    text={stepData.location}
                  />
                </p>
              </div>
            </div>

            {/* Role & Period */}
            <div
              className={`text-sm ${mutedText} grid text-left md:text-right`}
            >
              {experiences.map((exp, i) => (
                <div
                  aria-hidden
                  className="pointer-events-none invisible col-start-1 row-start-1"
                  key={i}
                >
                  <p className={`font-medium ${roleText} min-h-5`}>
                    {exp.role}
                  </p>
                  <p className="mt-1 min-h-5">{exp.period}</p>
                </div>
              ))}
              <div className="pointer-events-auto visible col-start-1 row-start-1">
                <p className={`font-medium ${roleText} min-h-5`}>
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

          {/* Highlight chip */}
          <div className="mt-2 grid gap-4">
            <div className={`rounded-2xl border p-4 shadow-sm ${chipBorder}`}>
              {/* Highlight name */}
              <div className="grid">
                {experiences.flatMap((exp, ei) =>
                  exp.highlights.map((h, hi) => (
                    <p
                      aria-hidden
                      className={`col-start-1 row-start-1 text-sm font-semibold ${titleText} pointer-events-none invisible min-h-5`}
                      key={`${ei}-${hi}`}
                    >
                      {h.name}
                    </p>
                  )),
                )}
                <p
                  className={`col-start-1 row-start-1 text-sm font-semibold ${titleText} pointer-events-auto visible min-h-5`}
                >
                  <DecryptedText
                    animate={getAnimState("highlight-name")}
                    speed={15}
                    text={activeHighlight.name}
                  />
                </p>
              </div>

              {/* Highlight summary */}
              <div className="mt-2 grid">
                {experiences.flatMap((exp, ei) =>
                  exp.highlights.map((h, hi) => (
                    <p
                      aria-hidden
                      className={`col-start-1 row-start-1 text-sm leading-relaxed ${bodyText} pointer-events-none invisible min-h-10`}
                      key={`${ei}-${hi}`}
                    >
                      {h.summary}
                    </p>
                  )),
                )}
                <p
                  className={`col-start-1 row-start-1 text-sm leading-relaxed ${bodyText} pointer-events-auto visible min-h-10`}
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
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard;
