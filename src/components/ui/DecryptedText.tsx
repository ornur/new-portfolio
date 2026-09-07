import { useEffect, useState } from "react";

const CHARACTERS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+{}|:\"<>?~`-=[];',./0123456789";

interface DecryptedTextProps {
  animate: "decrypt" | "hidden" | "idle";
  className?: string;
  delay?: number;
  speed?: number;
  text: string;
}

function getScrambledCharacter(text: string, index: number) {
  let hash = 0;

  for (let i = 0; i < text.length; i++) {
    hash = (hash * 31 + text.charCodeAt(i) + index * 17) >>> 0;
  }

  return CHARACTERS[hash % CHARACTERS.length];
}

function getStableScramble(text: string) {
  return text
    .split("")
    .map((char, index) =>
      char === " " ? " " : getScrambledCharacter(text, index),
    )
    .join("");
}

export const DecryptedText: React.FC<DecryptedTextProps> = ({
  animate,
  className = "",
  delay = 0,
  speed = 30,
  text,
}) => {
  return (
    <span className={className}>
      {animate === "decrypt" ? (
        <DecryptingText
          delay={delay}
          key={JSON.stringify([text, speed, delay])}
          speed={speed}
          text={text}
        />
      ) : animate === "hidden" ? (
        getStableScramble(text)
      ) : (
        text
      )}
    </span>
  );
};

function DecryptingText({
  delay,
  speed,
  text,
}: Required<Pick<DecryptedTextProps, "delay" | "speed" | "text">>) {
  const [displayText, setDisplayText] = useState(() => getStableScramble(text));

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    let intervalId: ReturnType<typeof setInterval>;

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
  }, [text, speed, delay]);

  return displayText;
}
