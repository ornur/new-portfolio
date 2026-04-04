import {
  type MotionValue,
  useAnimation,
  useMotionValueEvent,
} from "motion/react";
import * as motion from "motion/react-m";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "use-intl";

import { useTheme } from "@/hooks/useTheme";

import { DecryptedText } from "../ui/DecryptedText";

// ─── Types ────────────────────────────────────────────────────────────────────

type ElementKey =
  | "company"
  | "highlight-name"
  | "highlight-summary"
  | "location"
  | "period"
  | "role";

interface ExperienceCardProps {
  scrollYProgress: MotionValue<number>;
}

interface Phase {
  experienceIndex: number;
  highlightIndex: number;
  kind: PhaseKind;
  revealedKeys: ElementKey[];
}

type PhaseKind =
  | "hold" // All keys revealed, resting
  | "reveal"; // Revealing keys one-by-one

// ─── Constants ────────────────────────────────────────────────────────────────

const ALL_KEYS: ElementKey[] = [
  "company",
  "location",
  "role",
  "period",
  "highlight-name",
  "highlight-summary",
];

const META_KEYS: ElementKey[] = ["company", "location", "role", "period"];
const HIGHLIGHT_KEYS: ElementKey[] = ["highlight-name", "highlight-summary"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildTimelinePhases(
  experiences: { highlights: { name: string; summary: string }[] }[],
): Phase[] {
  const phases: Phase[] = [];

  experiences.forEach((exp, expIdx) => {
    exp.highlights.forEach((_, hIdx) => {
      const isFirstHighlight = hIdx === 0;
      const keysToReveal = isFirstHighlight ? ALL_KEYS : HIGHLIGHT_KEYS;
      const baseRevealed: ElementKey[] = isFirstHighlight ? [] : META_KEYS;
      const accumulated = [...baseRevealed];

      for (const key of keysToReveal) {
        accumulated.push(key);
        phases.push({
          experienceIndex: expIdx,
          highlightIndex: hIdx,
          kind: "reveal",
          revealedKeys: [...accumulated],
        });
      }

      phases.push({
        experienceIndex: expIdx,
        highlightIndex: hIdx,
        kind: "hold",
        revealedKeys: ALL_KEYS,
      });
    });
  });

  return phases;
}

// ─── Component ────────────────────────────────────────────────────────────────

const ExperienceCard = ({ scrollYProgress }: ExperienceCardProps) => {
  const { theme } = useTheme();
  const t = useTranslations("Experience");

  // ── Theme tokens ────────────────────────────────────────────────────────────

  const isDark = theme === "dark";

  const styles = {
    body: isDark ? "text-zinc-300" : "text-zinc-600",
    chipBorder: isDark ? "border-white/10" : "border-zinc-900/10",
    muted: isDark ? "text-zinc-400" : "text-zinc-500",
    role: isDark ? "text-zinc-200" : "text-zinc-800",
    title: isDark ? "text-neon" : "text-zinc-900",
  };

  // ── Data ────────────────────────────────────────────────────────────────────

  const { experiences, timelinePhases } = useMemo(() => {
    const experiences = [
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

    return { experiences, timelinePhases: buildTimelinePhases(experiences) };
  }, [t]);

  // ── State & derived values ──────────────────────────────────────────────────

  const [activeIndex, setActiveIndex] = useState(0);
  const bounceControls = useAnimation();
  const prevPhaseKind = useRef<PhaseKind>("reveal");

  const totalPhases = timelinePhases.length;

  const phase = timelinePhases[activeIndex] ?? timelinePhases[0];
  const stepData = experiences[phase.experienceIndex];
  const activeHighlight = stepData.highlights[phase.highlightIndex];

  const visibleTotal = useMemo(
    () => timelinePhases.filter((p) => p.kind !== "hold").length,
    [timelinePhases],
  );

  const visibleIndex = useMemo(() => {
    let count = 0;
    for (let i = 0; i <= activeIndex && i < timelinePhases.length; i++) {
      if (timelinePhases[i].kind !== "hold") count++;
    }
    return count;
  }, [timelinePhases, activeIndex]);

  // ── Scroll → phase sync ─────────────────────────────────────────────────────

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const next = Math.min(Math.floor(latest * totalPhases), totalPhases - 1);
    if (next !== activeIndex) setActiveIndex(next);
  });

  // ── Hold-phase bounce + glow animation ─────────────────────────────────────

  useEffect(() => {
    const isEnteringHold =
      phase.kind === "hold" && prevPhaseKind.current !== "hold";

    if (isEnteringHold) {
      void bounceControls.start({
        // Border sweeps neon then fades
        borderColor: isDark
          ? [
              "rgba(255,255,255,0.08)",
              "var(--neon)",
              "var(--neon)",
              "rgba(255,255,255,0.08)",
            ]
          : [
              "rgba(0,0,0,0.08)",
              "rgba(0,0,0,0.45)",
              "rgba(0,0,0,0.45)",
              "rgba(0,0,0,0.08)",
            ],
        borderWidth: [1, 1.5, 1.5, 1],

        // Glow blooms then dissolves
        boxShadow: isDark
          ? [
              "0 0 0px 0px rgba(0,0,0,0), 0 8px 32px rgba(0,0,0,0.4)",
              "0 0 28px 8px var(--neon), 0 0 60px 16px color-mix(in srgb, var(--neon) 30%, transparent), 0 12px 40px rgba(0,0,0,0.5)",
              "0 0 14px 3px var(--neon), 0 10px 36px rgba(0,0,0,0.45)",
              "0 0 0px 0px rgba(0,0,0,0), 0 8px 32px rgba(0,0,0,0.4)",
            ]
          : [
              "0 4px 16px rgba(0,0,0,0.06)",
              "0 12px 48px rgba(0,0,0,0.16), 0 2px 8px rgba(0,0,0,0.08)",
              "0 8px 36px rgba(0,0,0,0.12)",
              "0 4px 16px rgba(0,0,0,0.06)",
            ],

        scale: [1, 1.025, 0.995, 1],
        transition: {
          // border and glow linger longer — gives the neon pulse room to breathe
          borderColor: {
            duration: 1.2,
            ease: "easeInOut",
            times: [0, 0.25, 0.6, 1],
          },
          borderWidth: {
            duration: 1.2,
            ease: "easeInOut",
            times: [0, 0.25, 0.6, 1],
          },
          boxShadow: {
            duration: 1.4,
            ease: [0.16, 1, 0.3, 1],
            times: [0, 0.3, 0.55, 1],
          },
          scale: {
            duration: 0.55,
            ease: [0.34, 1.56, 0.64, 1],
            times: [0, 0.3, 0.65, 1],
          },
          // y and scale snap quickly — feels physical
          y: {
            duration: 0.85,
            ease: [0.34, 1.56, 0.64, 1],
            times: [0, 0.3, 0.65, 1],
          },
        },
        // Subtle lift → gentle overshoot → settle
        y: [0, -8, 1, 0],
      });
    }

    prevPhaseKind.current = phase.kind;
  }, [phase.kind, bounceControls, isDark]);

  // ── Reveal animation state ──────────────────────────────────────────────────

  const getAnimState = (key: ElementKey): "decrypt" | "hidden" | "idle" => {
    if (phase.kind === "hold") return "idle";
    return phase.revealedKeys.includes(key) ? "decrypt" : "hidden";
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div style={{ height: `${totalPhases * 50}vh`, width: "100%" }}>
      <div className="pointer-events-none sticky top-1/2 flex w-full -translate-y-1/2 items-center justify-center px-4">
        <motion.div
          animate={bounceControls}
          className="border-foreground/20 pointer-events-auto flex w-full max-w-3xl flex-col gap-4 overflow-hidden rounded-3xl border p-6 shadow-2xl backdrop-blur-xl transition-colors duration-300 md:p-8"
          initial={false}
          style={{ borderColor: "var(--border)" }}
        >
          {/* ── Progress badge ─────────────────────────────────────────────── */}
          <span className="dark:bg-neon bg-foreground text-background dark:text-background -mt-6 -mr-6 flex h-10 w-16 items-center justify-center self-end rounded-tr-xl rounded-bl-3xl px-2 text-sm font-bold md:-mt-8 md:-mr-8 md:rounded-bl-2xl md:text-base">
            {Math.max(visibleIndex, 1)}/{visibleTotal}
          </span>

          {/* ── Header: company / location / role / period ─────────────────── */}
          <div className="-mt-8 flex flex-col gap-2 md:mt-0 md:flex-row md:items-start md:justify-between">
            {/* Company & Location */}
            <div className="grid">
              {/* Invisible spacers stabilise layout width across all experiences */}
              {experiences.map((exp, i) => (
                <div
                  aria-hidden
                  className="pointer-events-none invisible col-start-1 row-start-1"
                  key={i}
                >
                  <h2
                    className={`text-xl font-semibold ${styles.title} min-h-7`}
                  >
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

            {/* Role & Period */}
            <div
              className={`grid text-sm ${styles.muted} text-left md:text-right`}
            >
              {experiences.map((exp, i) => (
                <div
                  aria-hidden
                  className="pointer-events-none invisible col-start-1 row-start-1"
                  key={i}
                >
                  <p className={`font-medium ${styles.role} min-h-5`}>
                    {exp.role}
                  </p>
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

          {/* ── Highlight chip ──────────────────────────────────────────────── */}
          <div className="mt-2 grid gap-4">
            <div
              className={`rounded-2xl border p-4 shadow-sm ${styles.chipBorder}`}
            >
              {/* Highlight name */}
              <div className="grid">
                {experiences.flatMap((exp, ei) =>
                  exp.highlights.map((h, hi) => (
                    <p
                      aria-hidden
                      className={`col-start-1 row-start-1 min-h-5 text-sm font-semibold ${styles.title} pointer-events-none invisible`}
                      key={`${ei}-${hi}`}
                    >
                      {h.name}
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

              {/* Highlight summary */}
              <div className="mt-2 grid">
                {experiences.flatMap((exp, ei) =>
                  exp.highlights.map((h, hi) => (
                    <p
                      aria-hidden
                      className={`col-start-1 row-start-1 min-h-10 text-sm leading-relaxed ${styles.body} pointer-events-none invisible`}
                      key={`${ei}-${hi}`}
                    >
                      {h.summary}
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
        </motion.div>
      </div>
    </div>
  );
};

export default ExperienceCard;
