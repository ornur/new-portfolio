import {
  type MotionValue,
  useAnimation,
  useMotionValueEvent,
} from "motion/react";
import * as motion from "motion/react-m";
import { useMemo, useRef, useState } from "react";
import { useTranslations } from "use-intl";

import { useTheme } from "@/hooks/useTheme";

import { ExperienceHeader } from "./ExperienceHeader";
import { ExperienceHighlightChip } from "./ExperienceHighlightChip";
import { ExperienceProgressBadge } from "./ExperienceProgressBadge";

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

  // ── Hold-phase bounce + glow animation ─────────────────────────────────────

  const startHoldBounceAnimation = () => {
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
        // border and glow linger longer - gives the neon pulse room to breathe
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
        // y and scale snap quickly - feels physical
        y: {
          duration: 0.85,
          ease: [0.34, 1.56, 0.64, 1],
          times: [0, 0.3, 0.65, 1],
        },
      },
      // Subtle lift, gentle overshoot, settle
      y: [0, -8, 1, 0],
    });
  };

  // ── Scroll → phase sync ─────────────────────────────────────────────────────

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const next = Math.min(Math.floor(latest * totalPhases), totalPhases - 1);
    if (next === activeIndex) return;

    const nextPhase = timelinePhases[next];
    if (!nextPhase) return;

    const isEnteringHold =
      nextPhase.kind === "hold" && prevPhaseKind.current !== "hold";

    if (isEnteringHold) startHoldBounceAnimation();

    prevPhaseKind.current = nextPhase.kind;
    setActiveIndex(next);
  });

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
          <ExperienceProgressBadge
            total={visibleTotal}
            visibleIndex={visibleIndex}
          />
          <ExperienceHeader
            experiences={experiences}
            getAnimState={getAnimState}
            stepData={stepData}
            styles={styles}
          />
          <ExperienceHighlightChip
            activeHighlight={activeHighlight}
            experiences={experiences}
            getAnimState={getAnimState}
            styles={styles}
          />
        </motion.div>
      </div>
    </div>
  );
};
