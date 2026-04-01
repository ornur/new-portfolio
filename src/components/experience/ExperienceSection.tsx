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
  isEncryptingAll: boolean;
  isEncryptingHighlight: boolean;
  revealedKeys: ElementKey[];
}

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

    const generatedPhases: Phase[] = [];

    rawExperiences.forEach((exp, expIndex) => {
      exp.highlights.forEach((_, hIndex) => {
        const keysToReveal: ElementKey[] = [];
        if (hIndex === 0) {
          keysToReveal.push(
            "company",
            "location",
            "role",
            "period",
            "highlight-name",
            "highlight-summary",
          );
        } else {
          keysToReveal.push("highlight-name", "highlight-summary");
        }

        const baseRevealed: ElementKey[] =
          hIndex === 0 ? [] : ["company", "location", "role", "period"];

        const currentRevealed = [...baseRevealed];

        keysToReveal.forEach((key) => {
          currentRevealed.push(key);
          generatedPhases.push({
            experienceIndex: expIndex,
            highlightIndex: hIndex,
            isEncryptingAll: false,
            isEncryptingHighlight: false,
            revealedKeys: [...currentRevealed],
          });
        });

        const hasNextHighlight = hIndex < exp.highlights.length - 1;
        const hasNextExperience = expIndex < rawExperiences.length - 1;

        if (hasNextHighlight) {
          generatedPhases.push({
            experienceIndex: expIndex,
            highlightIndex: hIndex,
            isEncryptingAll: false,
            isEncryptingHighlight: true,
            revealedKeys: [
              "company",
              "location",
              "role",
              "period",
              "highlight-name",
              "highlight-summary",
            ],
          });
        } else if (hasNextExperience) {
          generatedPhases.push({
            experienceIndex: expIndex,
            highlightIndex: hIndex,
            isEncryptingAll: true,
            isEncryptingHighlight: false,
            revealedKeys: [
              "company",
              "location",
              "role",
              "period",
              "highlight-name",
              "highlight-summary",
            ],
          });
        }
      });
    });

    return { experiences: rawExperiences, timelinePhases: generatedPhases };
  }, [t]);

  const [activeIndex, setActiveIndex] = useState(0);

  const totalPhases = timelinePhases.length;
  // Use slightly shorter scroll units since text is always visible.
  const sectionHeight = `${totalPhases * 50}vh`;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    let index = Math.floor(latest * totalPhases);
    if (index >= totalPhases) index = totalPhases - 1;
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  });

  const currentPhase = timelinePhases[activeIndex] || timelinePhases[0];
  const stepData = experiences[currentPhase.experienceIndex];
  const activeHighlight = stepData.highlights[currentPhase.highlightIndex];

  const getAnimState = (key: ElementKey) => {
    if (currentPhase.isEncryptingAll) return "encrypt";
    if (
      currentPhase.isEncryptingHighlight &&
      (key === "highlight-name" || key === "highlight-summary")
    )
      return "encrypt";
    if (currentPhase.revealedKeys.includes(key)) return "decrypt";
    return "encrypt";
  };

  return (
    <div style={{ height: sectionHeight, width: "100%" }}>
      <div className="pointer-events-none sticky top-1/2 flex w-full -translate-y-1/2 items-center justify-center overflow-hidden px-4">
        <div className="border-foreground/20 pointer-events-auto flex w-full max-w-3xl flex-col gap-4 rounded-3xl border p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 md:p-8">
          <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
            <div className="grid">
              {experiences.map((exp, expIdx) => (
                <div
                  className="aria-hidden pointer-events-none invisible col-start-1 row-start-1"
                  key={expIdx}
                >
                  <h2
                    className={`text-xl font-semibold ${titleText} min-h-[28px]`}
                  >
                    {exp.company}
                  </h2>
                  <p className={`text-sm ${mutedText} mt-1 min-h-[20px]`}>
                    {exp.location}
                  </p>
                </div>
              ))}
              <div className="pointer-events-auto visible col-start-1 row-start-1">
                <h2
                  className={`text-xl font-semibold ${titleText} min-h-[28px]`}
                >
                  <DecryptedText
                    animate={getAnimState("company")}
                    text={stepData.company}
                  />
                </h2>
                <p className={`text-sm ${mutedText} mt-1 min-h-[20px]`}>
                  <DecryptedText
                    animate={getAnimState("location")}
                    text={stepData.location}
                  />
                </p>
              </div>
            </div>

            <div
              className={`text-sm ${mutedText} grid text-left md:text-right`}
            >
              {experiences.map((exp, expIdx) => (
                <div
                  className="aria-hidden pointer-events-none invisible col-start-1 row-start-1"
                  key={expIdx}
                >
                  <p
                    className={`font-medium ${isDark ? "text-zinc-200" : "text-zinc-800"} min-h-[20px]`}
                  >
                    {exp.role}
                  </p>
                  <p className="mt-1 min-h-[20px]">{exp.period}</p>
                </div>
              ))}
              <div className="pointer-events-auto visible col-start-1 row-start-1">
                <p
                  className={`font-medium ${isDark ? "text-zinc-200" : "text-zinc-800"} min-h-[20px]`}
                >
                  <DecryptedText
                    animate={getAnimState("role")}
                    text={stepData.role}
                  />
                </p>
                <p className="mt-1 min-h-[20px]">
                  <DecryptedText
                    animate={getAnimState("period")}
                    text={stepData.period}
                  />
                </p>
              </div>
            </div>
          </div>

          <div className="mt-2 grid gap-4">
            <div className={`rounded-2xl border p-4 shadow-sm ${chipBorder}`}>
              <div className="grid">
                {experiences.flatMap((exp, expIdx) =>
                  exp.highlights.map((hlt, hIndex) => (
                    <p
                      className={`col-start-1 row-start-1 text-sm font-semibold ${titleText} aria-hidden pointer-events-none invisible min-h-[20px]`}
                      key={`${expIdx}-${hIndex}`}
                    >
                      {hlt.name}
                    </p>
                  )),
                )}
                <p
                  className={`col-start-1 row-start-1 text-sm font-semibold ${titleText} pointer-events-auto visible min-h-[20px]`}
                >
                  <DecryptedText
                    animate={getAnimState("highlight-name")}
                    text={activeHighlight.name}
                  />
                </p>
              </div>
              <div className="mt-2 grid">
                {experiences.flatMap((exp, expIdx) =>
                  exp.highlights.map((hlt, hIndex) => (
                    <p
                      className={`col-start-1 row-start-1 text-sm leading-relaxed ${bodyText} aria-hidden pointer-events-none invisible min-h-[40px]`}
                      key={`${expIdx}-${hIndex}`}
                    >
                      {hlt.summary}
                    </p>
                  )),
                )}
                <p
                  className={`col-start-1 row-start-1 text-sm leading-relaxed ${bodyText} pointer-events-auto visible min-h-[40px]`}
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
