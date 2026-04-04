import { useEffect, useRef, useState } from "react";

const CHARACTERS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+{}|:\"<>?~`-=[];',./0123456789";

interface DecryptedTextProps {
  animate: "decrypt" | "hidden" | "idle";
  className?: string;
  delay?: number;
  speed?: number;
  text: string;
}

export const DecryptedText: React.FC<DecryptedTextProps> = ({
  animate,
  className = "",
  delay = 0,
  speed = 30,
  text,
}) => {
  const [displayText, setDisplayText] = useState("");
  const prevAnimate = useRef(animate);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    let intervalId: ReturnType<typeof setInterval>;

    prevAnimate.current = animate;

    const scramble = () =>
      text
        .split("")
        .map((c) =>
          c === " "
            ? " "
            : CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)],
        )
        .join("");

    if (animate === "hidden") {
      setDisplayText(scramble());
      return;
    }

    if (animate === "idle") {
      setDisplayText(text);
      return;
    }

    // animate === "decrypt"
    let iteration = 0;
    const start = () => {
      intervalId = setInterval(() => {
        setDisplayText((cur) =>
          text
            .split("")
            .map((char, i) => {
              if (char === " ") return " ";
              if (i < iteration) return text[i];
              const ex = cur[i];
              return ex && ex !== text[i] && ex !== " "
                ? ex
                : CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
            })
            .join(""),
        );
        iteration += 0.5;
        if (iteration >= text.length) clearInterval(intervalId);
      }, speed);
    };

    if (delay > 0) timeoutId = setTimeout(start, delay);
    else start();

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [text, animate, speed, delay]);

  return <span className={className}>{displayText}</span>;
};
