import {
  type MotionValue,
  useAnimation,
  useMotionValueEvent,
  useReducedMotion,
} from "motion/react";
import * as motion from "motion/react-m";
import { useCallback, useMemo, useRef, useState } from "react";
import { useTranslations } from "use-intl";
import { useWebHaptics } from "web-haptics/react";

import { useTheme } from "@/hooks/useTheme";

import { ExperienceHeader } from "./ExperienceHeader";
import { ExperienceHighlightChip } from "./ExperienceHighlightChip";
import { ExperienceTimelineRail } from "./ExperienceTimelineRail";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ElementKey =
  | "company"
  | "highlight-name"
  | "highlight-summary"
  | "location"
  | "period"
  | "role";

export interface ExperienceData {
  company: string;
  highlights: ExperienceHighlight[];
  location: string;
  period: string;
  role: string;
}

export interface ExperienceHighlight {
  name: string;
  summary: string;
}

export interface ExperienceStyles {
  body: string;
  chipBorder: string;
  muted: string;
  role: string;
  title: string;
}

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
const CARD_SHADOW_DARK =
  "0 18px 70px rgba(0,0,0,0.48), 0 0 0 1px rgba(255,255,255,0.08)";
const CARD_SHADOW_LIGHT =
  "0 18px 60px rgba(0,0,0,0.14), 0 0 0 1px rgba(0,0,0,0.06)";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildTimelinePhases(experiences: ExperienceData[]): Phase[] {
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

export const ExperienceCard = ({ scrollYProgress }: ExperienceCardProps) => {
  const { theme } = useTheme();
  const t = useTranslations("Experience");
  const { trigger } = useWebHaptics();
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);

  // ── Theme tokens ────────────────────────────────────────────────────────────

  const isDark = theme === "dark";

  const styles: ExperienceStyles = {
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
  const cardControls = useAnimation();
  const prevPhaseKind = useRef<PhaseKind>("reveal");
  const prevVisibleIndex = useRef(0);

  const totalPhases = timelinePhases.length;

  const phase = timelinePhases[activeIndex] ?? timelinePhases[0];
  const stepData = experiences[phase.experienceIndex];
  const activeHighlight = stepData.highlights[phase.highlightIndex];

  const visibleTotal = useMemo(
    () => timelinePhases.filter((p) => p.kind !== "hold").length,
    [timelinePhases],
  );

  const visiblePhaseIndexes = useMemo(
    () =>
      timelinePhases.reduce<number[]>((indexes, currentPhase, index) => {
        if (currentPhase.kind !== "hold") indexes.push(index);
        return indexes;
      }, []),
    [timelinePhases],
  );

  const visibleIndex = useMemo(() => {
    let count = 0;
    for (let i = 0; i <= activeIndex && i < timelinePhases.length; i++) {
      if (timelinePhases[i].kind !== "hold") count++;
    }
    return count;
  }, [timelinePhases, activeIndex]);

  const activeMilestoneIndex = Math.max(visibleIndex - 1, 0);

  const scrollToMilestone = useCallback(
    (milestoneIndex: number) => {
      const targetPhaseIndex = visiblePhaseIndexes[milestoneIndex];
      const section = sectionRef.current;
      if (targetPhaseIndex === undefined || !section) return;

      void trigger("selection");

      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      const scrollableHeight = Math.max(
        section.offsetHeight - window.innerHeight,
        0,
      );
      const targetProgress = Math.min(
        (targetPhaseIndex + 0.15) / totalPhases,
        1,
      );

      window.scrollTo({
        behavior: shouldReduceMotion ? "auto" : "smooth",
        top: sectionTop + scrollableHeight * targetProgress,
      });
    },
    [shouldReduceMotion, totalPhases, trigger, visiblePhaseIndexes],
  );

  // ── Phase feedback animation ───────────────────────────────────────────────

  const startPhaseFeedback = useCallback(
    (kind: PhaseKind) => {
      if (shouldReduceMotion) {
        void cardControls.start({
          borderColor: "var(--border)",
          boxShadow: isDark ? CARD_SHADOW_DARK : CARD_SHADOW_LIGHT,
        });
        return;
      }

      const isHold = kind === "hold";
      void cardControls.start({
        borderColor: isDark
          ? [
              "rgba(255,255,255,0.08)",
              isHold ? "var(--neon)" : "rgba(255,255,255,0.22)",
              isHold ? "var(--neon)" : "rgba(255,255,255,0.14)",
              "rgba(255,255,255,0.08)",
            ]
          : [
              "rgba(0,0,0,0.08)",
              isHold ? "rgba(0,0,0,0.45)" : "rgba(0,0,0,0.2)",
              isHold ? "rgba(0,0,0,0.38)" : "rgba(0,0,0,0.12)",
              "rgba(0,0,0,0.08)",
            ],
        boxShadow: isDark
          ? [
              CARD_SHADOW_DARK,
              isHold
                ? "0 0 30px 8px var(--neon), 0 18px 72px rgba(0,0,0,0.55)"
                : "0 0 18px 2px color-mix(in srgb, var(--neon) 22%, transparent), 0 18px 64px rgba(0,0,0,0.48)",
              CARD_SHADOW_DARK,
            ]
          : [
              CARD_SHADOW_LIGHT,
              isHold
                ? "0 22px 70px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.12)"
                : "0 18px 56px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.08)",
              CARD_SHADOW_LIGHT,
            ],

        transition: {
          borderColor: {
            duration: isHold ? 1.1 : 0.55,
            ease: "easeInOut",
            times: [0, 0.35, 0.75, 1],
          },
          boxShadow: {
            duration: isHold ? 1.2 : 0.65,
            ease: [0.16, 1, 0.3, 1],
          },
        },
      });
    },
    [cardControls, isDark, shouldReduceMotion],
  );

  // ── Scroll → phase sync ─────────────────────────────────────────────────────

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const next = Math.min(Math.floor(latest * totalPhases), totalPhases - 1);
    if (next === activeIndex) return;

    const nextPhase = timelinePhases[next];
    if (!nextPhase) return;

    const isEnteringHold =
      nextPhase.kind === "hold" && prevPhaseKind.current !== "hold";
    const nextVisibleIndex = timelinePhases
      .slice(0, next + 1)
      .filter((p) => p.kind !== "hold").length;

    if (isEnteringHold) {
      void trigger("light");
      startPhaseFeedback("hold");
    } else if (nextVisibleIndex !== prevVisibleIndex.current) {
      void trigger("selection");
      startPhaseFeedback("reveal");
    }

    prevPhaseKind.current = nextPhase.kind;
    prevVisibleIndex.current = nextVisibleIndex;
    setActiveIndex(next);
  });

  // ── Reveal animation state ──────────────────────────────────────────────────

  const getAnimState = (key: ElementKey): "decrypt" | "hidden" | "idle" => {
    const latestKey = phase.revealedKeys.at(-1);
    if (!phase.revealedKeys.includes(key)) return "hidden";
    if (phase.kind === "hold") return "idle";
    return key === latestKey ? "decrypt" : "idle";
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div
      ref={sectionRef}
      style={{ height: `${totalPhases * 50}vh`, width: "100%" }}
    >
      <div className="pointer-events-none sticky top-1/2 flex w-full -translate-y-1/2 items-center justify-center px-4">
        <div className="flex w-full max-w-5xl items-center justify-center gap-5">
          <ExperienceTimelineRail
            activeIndex={activeMilestoneIndex}
            className="hidden h-80 w-12 shrink-0 md:block"
            onSelect={scrollToMilestone}
            progress={scrollYProgress}
            total={visibleTotal}
          />
          <motion.div
            animate={cardControls}
            className="border-foreground/20 bg-background/70 pointer-events-auto flex w-full max-w-3xl flex-col gap-5 overflow-hidden rounded-3xl border p-5 shadow-2xl backdrop-blur-xl transition-colors duration-300 md:p-8"
            initial={false}
            style={{
              borderColor: "var(--border)",
              boxShadow: isDark ? CARD_SHADOW_DARK : CARD_SHADOW_LIGHT,
            }}
          >
            <div className="flex items-center">
              <ExperienceTimelineRail
                activeIndex={activeMilestoneIndex}
                className="h-8 w-full md:hidden"
                onSelect={scrollToMilestone}
                progress={scrollYProgress}
                total={visibleTotal}
              />
            </div>
            <ExperienceHeader
              experiences={experiences}
              getAnimState={getAnimState}
              phaseKey={`${phase.experienceIndex}-${phase.highlightIndex}-${activeIndex}`}
              stepData={stepData}
              styles={styles}
            />
            <ExperienceHighlightChip
              activeHighlight={activeHighlight}
              experiences={experiences}
              getAnimState={getAnimState}
              isComplete={phase.kind === "hold"}
              phaseKey={`${phase.experienceIndex}-${phase.highlightIndex}-${activeIndex}`}
              styles={styles}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};
