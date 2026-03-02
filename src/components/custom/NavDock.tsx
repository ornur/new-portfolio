import { useLocation } from "@tanstack/react-router";
import {
  BriefcaseBusiness,
  Database,
  FolderCode,
  HomeIcon,
  IdCardLanyard,
  Languages,
  Moon,
  Sun,
} from "lucide-react";
import { useTranslations } from "use-intl/react";

import type { SimpleTranslator } from "@/i18n/getTranslations";

import { WaitLink } from "@/components/custom/LinkWait";
import {
  Dock,
  DockIcon,
  DockItem,
  DockLabel,
} from "@/components/motion-primitives/dock";
import useIsMobile from "@/hooks/useIsMobile";
import { useTheme } from "@/hooks/useTheme";
import { changeLocale } from "@/i18n/LocaleStore";
import { cn } from "@/lib/utils";

const links = (t: SimpleTranslator<"Nav">) => [
  {
    href: "/",
    icon: <HomeIcon className="size-full" />,
    id: "home",
    title: t("home"),
  },
  {
    href: "/about",
    icon: <IdCardLanyard className="size-full" />,
    id: "about",
    title: t("about"),
  },
  {
    href: "/tech-stack",
    icon: <Database className="size-full" />,
    id: "tech",
    title: t("techStack"),
  },
  {
    href: "/experience",
    icon: <BriefcaseBusiness className="size-full" />,
    id: "experience",
    title: t("experience"),
  },
  {
    href: "/projects",
    icon: <FolderCode className="size-full" />,
    id: "projects",
    title: t("projects"),
  },
];

export function AppleStyleDock() {
  const { pathname } = useLocation();
  const { isMobile } = useIsMobile();
  const data = links(useTranslations("Nav"));
  return (
    <div className="fixed bottom-2 left-1/2 z-10 max-w-full -translate-x-1/2">
      <Dock className="dark:border-foreground/30 cursor-pointer items-end border border-black/20 bg-transparent pb-3 backdrop-blur-[3px] dark:bg-transparent">
        {data.map((item) => (
          <WaitLink
            className="cursor-pointer"
            disabled={pathname === item.href}
            key={item.id}
            to={item.href}
          >
            <DockItem
              className={cn(
                pathname === item.href
                  ? "bg-neon dark:text-background dark:hover:bg-background dark:hover:text-neon transition-colors duration-300"
                  : "dark:bg-foreground/20 dark:hover:bg-foreground/10 bg-black/10",
                "aspect-square rounded-full backdrop-blur-[50px]",
                "active:bg-neon dark:active:bg-neon hover:bg-black/15",
              )}
              key={item.id}
            >
              <DockLabel className="hidden md:block">{item.title}</DockLabel>
              <DockIcon>{item.icon}</DockIcon>
            </DockItem>
          </WaitLink>
        ))}
        {!isMobile && (
          <>
            <ThemeDock />
            <LanguageDock />
          </>
        )}
      </Dock>
    </div>
  );
}

export function LanguageDock() {
  const t = useTranslations("Nav");
  return (
    <div>
      <DockItem
        className="dark:bg-foreground/20 dark:hover:bg-foreground/10 active:bg-neon dark:active:bg-neon aspect-square rounded-full bg-black/10 backdrop-blur-[50px] hover:bg-black/15"
        key="language"
        onClick={changeLocale}
      >
        <DockLabel>{t("language")}</DockLabel>
        <DockIcon>
          <Languages className="size-full" />
        </DockIcon>
      </DockItem>
    </div>
  );
}

export function ThemeDock() {
  const t = useTranslations("Nav");
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <DockItem
        className="dark:bg-foreground/20 dark:hover:bg-foreground/10 active:bg-neon dark:active:bg-neon aspect-square rounded-full bg-black/10 backdrop-blur-[50px] hover:bg-black/15"
        key={theme}
        onClick={toggleTheme}
      >
        <DockLabel>{t("theme")}</DockLabel>
        {theme === "dark" ? (
          <DockIcon className="animate-in fade-in" key="dark">
            <Sun className="size-full" />
          </DockIcon>
        ) : (
          <DockIcon className="animate-in fade-in" key="light">
            <Moon className="in-active:dark:text-background dark:text-foreground size-full" />
          </DockIcon>
        )}
      </DockItem>
    </div>
  );
}
