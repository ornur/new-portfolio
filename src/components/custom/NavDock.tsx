import {
  Activity,
  Component,
  HomeIcon,
  Languages,
  Mail,
  Moon,
  ScrollText,
  Sun,
} from "lucide-react";

import {
  Dock,
  DockIcon,
  DockItem,
  DockLabel,
} from "@/components/motion-primitives/dock";

import { useTheme } from "@/hooks/useTheme";

import { WaitLink } from "@/components/custom/LinkWait";
import { changeLocale } from "@/i18n/LocaleStore";
import { useLocation } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

const data = [
  {
    href: "/",
    icon: <HomeIcon className="h-full w-full" />,
    title: "Home",
  },
  {
    href: "/components",
    icon: <Component className="h-full w-full" />,
    title: "Components",
  },
  {
    href: "/activities",
    icon: <Activity className="h-full w-full" />,
    title: "Activity",
  },
  {
    href: "/changelog",
    icon: <ScrollText className="h-full w-full" />,
    title: "Change Log",
  },
  {
    href: "mailto:contact@example.com",
    icon: (
      <Mail className="in-active:dark:text-background dark:text-foreground h-full w-full" />
    ),
    title: "Email",
  },
  {
    href: "",
    icon: (
      <Moon className="in-active:dark:text-background dark:text-foreground h-full w-full" />
    ),
    icon2: <Sun className="h-full w-full" />,
    title: "Theme",
  },
  {
    href: "",
    icon: <Languages className="h-full w-full" />,
    title: "Language",
  },
];

export function AppleStyleDock() {
  const { pathname } = useLocation();
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="fixed bottom-2 left-1/2 z-10 max-w-full -translate-x-1/2">
      <Dock className="dark:border-foreground/30 cursor-pointer items-end border border-black/20 bg-transparent pb-3 backdrop-blur-[3px] dark:bg-transparent">
        {data.map((item, idx) =>
          item.title === "Theme" ? (
            <DockItem
              key={idx}
              className="dark:bg-foreground/20 dark:hover:bg-foreground/10 active:bg-neon dark:active:bg-neon aspect-square rounded-full bg-black/10 backdrop-blur-[50px] hover:bg-black/15"
              onClick={toggleTheme}
            >
              <DockLabel>{item.title}</DockLabel>
              {theme === "dark" ? (
                <DockIcon key="dark" className="animate-in fade-in">
                  {item.icon2}
                </DockIcon>
              ) : (
                <DockIcon key="light" className="animate-in fade-in">
                  {item.icon}
                </DockIcon>
              )}
            </DockItem>
          ) : item.title === "Language" ? (
            <DockItem
              key={idx}
              className="dark:bg-foreground/20 dark:hover:bg-foreground/10 active:bg-neon dark:active:bg-neon aspect-square rounded-full bg-black/10 backdrop-blur-[50px] hover:bg-black/15"
              onClick={changeLocale}
            >
              <DockLabel>{item.title}</DockLabel>
              <DockIcon>{item.icon}</DockIcon>
            </DockItem>
          ) : (
            <WaitLink key={idx} to={item.href} className="cursor-pointer">
              <DockItem
                key={idx}
                className={cn(
                  pathname === item.href
                    ? "bg-neon dark:text-background"
                    : "dark:bg-foreground/20 bg-black/10",
                  "dark:hover:bg-foreground/10 dark:active:bg-neon",
                  "aspect-square rounded-full backdrop-blur-[50px]",
                  "active:bg-neon hover:bg-black/15",
                )}
              >
                <DockLabel>{item.title}</DockLabel>
                <DockIcon>{item.icon}</DockIcon>
              </DockItem>
            </WaitLink>
          ),
        )}
      </Dock>
    </div>
  );
}
