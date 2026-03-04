import type { LucideIcon } from "lucide-react";

import { Baby, Rocket, School, Star, University } from "lucide-react";

export interface TimelineItem {
  date: string;
  desc: string;
  icon: LucideIcon;
  title: string;
}

export const timelineData: TimelineItem[] = [
  {
    date: "2004",
    desc: "I was born 1 of January 2004 in Kentau, Kazakhstan. I knew I am connected with engineering and technology things, but I don't expect choice of my future profession will be related to software development.",
    icon: Baby,
    title: "The Beginning",
  },
  {
    date: "2016",
    desc: "In 2016 I entered Nazarbayev Intellectual School in Shymkent. It was a great experience for me, because I had an opportunity to learn programming and other technical subjects.",
    icon: School,
    title: "School - NIS",
  },
  {
    date: "2022",
    desc: "In 2022 I entered Astana IT University. I chose Software Engineering as my major, because I wanted to learn more about software development and become a developer. Still, choosing my programming language.",
    icon: University,
    title: "University - AITU",
  },
  {
    date: "2023",
    desc: "After internship at outsourcing company, I got an offer to work as a frontend developer at ZIZ INC. I worked on various projects, including e-commerce and corporate websites. Of course, working with other developers and learning from them was a great experience for me.",
    icon: Rocket,
    title: "First Career Step - ZIZ INC.",
  },
  {
    date: "Today",
    desc: "I am currently working as a frontend developer at LLP Digital Bridge, where I continue to grow my skills and contribute to exciting projects.",
    icon: Star,
    title: "Present Day - LLP Digital Bridge",
  },
];
