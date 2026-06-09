import { FaGithub } from "react-icons/fa6";

import { Card, CardContent } from "@/components/ui/card";
import { CarouselItem } from "@/components/ui/carousel";
import Folder from "@/components/ui/Folder";
import { useTheme } from "@/hooks/useTheme";

const projectsData = [
  {
    codeUrl: "https://github.com/ornur/neohome",
    demoUrl: "https://neohouse.vercel.app/",
    id: "neo-home",
    ReactNode: [
      <FaGithub
        className="dark:text-background size-full p-3"
        key="github-1"
        size={48}
      />,
      <img
        alt="Neo Home"
        className="size-full object-contain"
        key="image-1"
        src="/projects/neohome.png"
      />,
    ],
    title: "Neo Home",
  },
  {
    codeUrl: "https://github.com/ornur/alibi-portfolio",
    demoUrl: "https://alibialisher.kz/",
    id: "alibi-portfolio",
    ReactNode: [
      <FaGithub
        className="dark:text-background size-full p-3"
        key="github-2"
        size={48}
      />,
      <img
        alt="Alibi Portfolio"
        className="size-full object-contain"
        key="image-2"
        src="/projects/alibi-portfolio.png"
      />,
    ],
    title: "Alibi Portfolio",
  },
  {
    codeUrl: "https://github.com/ornur/creative-lab",
    demoUrl: "https://www.creative-hub.kz/",
    id: "creative-lab",
    ReactNode: [
      <FaGithub
        className="dark:text-background size-full p-3"
        key="github-3"
        size={48}
      />,
      <img
        alt="Creative Lab"
        className="size-full object-contain"
        key="image-3"
        src="/projects/creative-lab.png"
      />,
    ],
    title: "Creative Lab",
  },
  {
    codeUrl: "https://github.com/ornur/saasNextFramerMotion",
    demoUrl: "https://saas-next-framer-motion.vercel.app/",
    id: "saas-project",
    ReactNode: [
      <FaGithub
        className="dark:text-background size-full p-3"
        key="github-4"
        size={48}
      />,
      <img
        alt="SAAS Project"
        className="size-full object-contain"
        key="image-4"
        src="/projects/saas-project.png"
      />,
    ],
    title: "SAAS Project",
  },
  {
    codeUrl: "https://github.com/ornur/lets_car_frontend",
    demoUrl: "https://lets-car.vercel.app/",
    id: "lets-car",
    ReactNode: [
      <FaGithub
        className="dark:text-background size-full p-3"
        key="github-5"
        size={48}
      />,
      <img
        alt="Lets Car"
        className="size-full object-contain"
        key="image-5"
        src="/projects/lets-car.png"
      />,
    ],
    title: "Lets Car",
  },
];

export function Projects() {
  const { theme } = useTheme();
  return projectsData.map((project) => (
    <CarouselItem className="basis-1/3 cursor-grab pt-1" key={project.id}>
      <Card className="flex h-full w-full items-center justify-center bg-transparent backdrop-blur-sm">
        <CardContent>
          <Folder
            codeUrl={project.codeUrl}
            color={theme === "dark" ? "var(--neon)" : "var(--foreground)"}
            demoUrl={project.demoUrl}
            folderBackColor={
              theme === "dark" ? "var(--neon-foreground)" : "var(--neon)"
            }
            items={project.ReactNode}
            size={2}
            title={project.title}
          />
        </CardContent>
      </Card>
    </CarouselItem>
  ));
}
