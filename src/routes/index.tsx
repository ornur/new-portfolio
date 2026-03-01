import { FaGithub, FaLinkedin, FaTelegram } from "react-icons/fa6";
import { BoxReveal } from "@/components/BoxReveal";
import { createFileRoute } from "@tanstack/react-router";
import { useTheme } from "@/hooks/useTheme";
import { useTranslations } from "use-intl";
import { GridPattern } from "@/components/GridPattern";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { theme } = useTheme();
  const t = useTranslations("Home");
  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-center overflow-hidden">
      <div className="flex flex-col items-center text-center">
        <BoxReveal
          boxColor={theme === "dark" ? "var(--neon)" : "var(--foreground)"}
          duration={0.5}
        >
          <img
            src="/me.webp"
            alt="me"
            className="mx-auto mb-6 aspect-square rounded-full object-cover"
            height={300}
            width={300}
            loading="eager"
          />
        </BoxReveal>
        <div className="flex flex-col space-x-1 md:w-full">
          <BoxReveal
            boxColor={theme === "dark" ? "var(--neon)" : "var(--foreground)"}
            duration={0.5}
          >
            <h1 className="flex items-center text-4xl font-medium md:text-5xl">
              {t("name")}
            </h1>
          </BoxReveal>
        </div>
        <div className="flex items-center space-x-3">
          <BoxReveal
            boxColor={theme === "dark" ? "var(--neon)" : "var(--foreground)"}
            duration={0.5}
          >
            <h2 className="text-2xl font-medium md:text-4xl">
              Frontend Developer
            </h2>
          </BoxReveal>
        </div>
      </div>
      <BoxReveal
        boxColor={theme === "dark" ? "var(--neon)" : "var(--foreground)"}
        duration={0.5}
      >
        <ul className="mt-3 flex space-x-2">
          <li>
            <a href={"https://github.com/ornur"} target="_blank">
              <FaGithub className="size-7 md:size-8" />
            </a>
          </li>
          <li>
            <a href={"https://t.me/nurda_oryn"} target="_blank">
              <FaTelegram className="size-7 md:size-8" />
            </a>
          </li>
          <li>
            <a
              href={"https://www.linkedin.com/in/nurdaulet-orynbasarov/"}
              target="_blank"
            >
              <FaLinkedin className="size-7 md:size-8" />
            </a>
          </li>
        </ul>
      </BoxReveal>
      <GridPattern
        numSquares={30}
        maxOpacity={1}
        duration={2}
        className={cn(
          "mask-[radial-gradient(500px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-30%] -z-50 h-[200%] skew-y-12 lg:inset-y-[-30%] xl:inset-y-[-50%]",
        )}
      />
    </div>
  );
}
