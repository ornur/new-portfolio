import React, { useEffect, useRef, useState } from "react";

const CHARACTERS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+{}|:\"<>?~`-=[];',./0123456789";

interface DecryptedTextProps {
  animate: "decrypt" | "encrypt" | "hidden" | "idle";
  className?: string;
  delay?: number; // Delay in milliseconds before starting animation
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
  const prevText = useRef(text);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    let intervalId: ReturnType<typeof setInterval>;

    const isAnimateChange = prevAnimate.current !== animate;
    const wasDecrypt = prevAnimate.current === "decrypt";

    prevAnimate.current = animate;
    prevText.current = text;

    if (animate === "hidden") {
      setDisplayText("");
      return;
    }

    if (animate === "idle") {
      setDisplayText(text);
      return;
    }

    if (animate === "encrypt") {
      if (
        !isAnimateChange ||
        (!wasDecrypt && prevText.current !== text) ||
        !wasDecrypt
      ) {
        // Scramble instantly if text changed during encrypt or mounted as encrypt
        setDisplayText(
          text
            .split("")
            .map((c) =>
              c === " "
                ? " "
                : CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)],
            )
            .join(""),
        );
        return;
      }

      let iteration = text.length;
      const startAnimation = () => {
        intervalId = setInterval(() => {
          setDisplayText((currentStr) =>
            text
              .split("")
              .map((char, index) => {
                if (char === " ") return " ";
                if (index < iteration) {
                  return text[index];
                }
                const existing = currentStr[index];
                return existing && existing !== text[index] && existing !== " "
                  ? existing
                  : CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
              })
              .join(""),
          );

          if (iteration <= 0) {
            clearInterval(intervalId);
          }

          iteration -= 1 / 2;
        }, speed);
      };

      if (delay > 0) {
        timeoutId = setTimeout(startAnimation, delay);
      } else {
        startAnimation();
      }
    } else if (animate === "decrypt") {
      let iteration = 0;
      const startAnimation = () => {
        intervalId = setInterval(() => {
          setDisplayText((currentStr) =>
            text
              .split("")
              .map((char, index) => {
                if (char === " ") return " ";
                if (index < iteration) {
                  return text[index];
                }
                const existing = currentStr[index];
                return existing && existing !== text[index] && existing !== " "
                  ? existing
                  : CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
              })
              .join(""),
          );

          if (iteration >= text.length) {
            clearInterval(intervalId);
          }

          iteration += 1 / 2; // Speed multiplier per interval
        }, speed);
      };

      if (delay > 0) {
        timeoutId = setTimeout(startAnimation, delay);
      } else {
        startAnimation();
      }
    }

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [text, animate, speed, delay]);

  return <span className={className}>{displayText}</span>;
};
