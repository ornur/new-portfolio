import type { LucideIcon } from "lucide-react";

import { Baby, Rocket, School, Star, University } from "lucide-react";

import { getTranslations } from "@/i18n/getTranslations";

export interface TimelineItem {
  date: string;
  desc: string;
  icon: LucideIcon;
  title: string;
}

export const timelineData = (): TimelineItem[] => {
  const t = getTranslations("About");
  return [
    {
      date: t("data.2004.date"),
      desc: t("data.2004.desc"),
      icon: Baby,
      title: t("data.2004.title"),
    },
    {
      date: t("data.2016.date"),
      desc: t("data.2016.desc"),
      icon: School,
      title: t("data.2016.title"),
    },
    {
      date: t("data.2022.date"),
      desc: t("data.2022.desc"),
      icon: University,
      title: t("data.2022.title"),
    },
    {
      date: t("data.2023.date"),
      desc: t("data.2023.desc"),
      icon: Rocket,
      title: t("data.2023.title"),
    },
    {
      date: t("data.Today.date"),
      desc: t("data.Today.desc"),
      icon: Star,
      title: t("data.Today.title"),
    },
  ];
};
