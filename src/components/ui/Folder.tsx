import React, { useState } from "react";

interface FolderProps {
  className?: string;
  codeUrl?: string;
  color?: string;
  demoUrl?: string;
  folderBackColor?: string;
  items?: React.ReactNode[];
  size?: number;
  title?: string;
}

const darkenColor = (hex: string, percent: number): string => {
  let color = hex.startsWith("#") ? hex.slice(1) : hex;
  if (color.length === 3) {
    color = color
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const num = parseInt(color, 16);
  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;
  r = Math.max(0, Math.min(255, Math.floor(r * (1 - percent))));
  g = Math.max(0, Math.min(255, Math.floor(g * (1 - percent))));
  b = Math.max(0, Math.min(255, Math.floor(b * (1 - percent))));
  return (
    "#" +
    ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()
  );
};

const Folder: React.FC<FolderProps> = ({
  className = "",
  codeUrl = "",
  color = "#5227FF",
  demoUrl = "",
  folderBackColor = "black",
  items = [],
  size = 1,
  title = "",
}) => {
  const maxItems = 2;
  const papers = items.slice(0, maxItems);
  while (papers.length < maxItems) {
    papers.push(null);
  }

  const [open, setOpen] = useState(false);
  const [paperOffsets, setPaperOffsets] = useState<{ x: number; y: number }[]>(
    Array.from({ length: maxItems }, () => ({ x: 0, y: 0 })),
  );

  const paper1 = "#ffffff";
  const paper2 = darkenColor("#ffffff", 0.1);

  const handleClick = () => {
    setOpen((prev) => !prev);
    if (open) {
      setPaperOffsets(Array.from({ length: maxItems }, () => ({ x: 0, y: 0 })));
    }
  };

  const handlePaperMouseClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
  ) => {
    e.stopPropagation();
    const paper = papers[index];
    if (paper) {
      const link = index === 0 ? codeUrl : demoUrl;
      if (link) {
        window.open(link, "_blank");
      }
    }
  };

  const folderStyle: React.CSSProperties = {
    "--folder-back-color": folderBackColor,
    "--folder-color": color,
    "--paper-1": paper1,
    "--paper-2": paper2,
  } as React.CSSProperties;

  const scaleStyle = { transform: `scale(${size})` };

  const getOpenTransform = (index: number) => {
    if (index === 0) return "translate(-170%, -70%) rotate(-10deg)";
    if (index === 1) return "translate(-20%, -80%) rotate(10deg)";
    if (index === 2) return "translate(-50%, -100%) rotate(5deg)";
    return "";
  };

  return (
    <div className={className} style={scaleStyle}>
      <div
        className={`group relative cursor-pointer transition-all duration-200 ease-in ${
          !open ? "hover:-translate-y-2" : "mt-40"
        }`}
        onClick={handleClick}
        style={{
          ...folderStyle,
          transform: open ? "translateY(-8px)" : undefined,
        }}
      >
        <div
          className="rounded-tl-0 relative h-20 w-25 rounded-tr-[10px] rounded-br-[10px] rounded-bl-[10px]"
          style={{ backgroundColor: folderBackColor }}
        >
          <span
            className="rounded-bl-0 rounded-br-0 absolute bottom-[98%] left-0 z-0 h-2.5 w-7.5 rounded-tl-[5px] rounded-tr-[5px]"
            style={{ backgroundColor: folderBackColor }}
          ></span>
          {papers.map((item, i) => {
            let sizeClasses = "";
            if (i === 0)
              sizeClasses = open ? "w-[50%] h-[80%]" : "w-[70%] h-[80%]";
            if (i === 1)
              sizeClasses = open ? "w-[120%] h-[75%]" : "w-[80%] h-[70%]";
            if (i === 2)
              sizeClasses = open ? "w-[90%] h-[80%]" : "w-[90%] h-[60%]";

            const transformStyle = open
              ? `${getOpenTransform(i)} translate(${paperOffsets[i].x}px, ${paperOffsets[i].y}px)`
              : undefined;

            return (
              <div
                className={`absolute bottom-[10%] left-1/2 z-20 overflow-hidden transition-all duration-300 ease-in-out ${
                  !open
                    ? "-translate-x-1/2 translate-y-[10%] transform group-hover:translate-y-0"
                    : "hover:scale-110"
                } ${sizeClasses}`}
                key={i}
                onClick={(e) => handlePaperMouseClick(e, i)}
                style={{
                  ...(!open ? {} : { transform: transformStyle }),
                  backgroundColor: i === 0 ? paper1 : paper2,
                  borderRadius: "10px",
                }}
              >
                {item}
              </div>
            );
          })}
          <div
            className={`absolute z-30 h-full w-full origin-bottom transition-all duration-300 ease-in-out ${
              !open ? "group-hover:transform-[skew(15deg)_scaleY(0.6)]" : ""
            }`}
            style={{
              backgroundColor: color,
              borderRadius: "5px 10px 10px 10px",
              ...(open && { transform: "skew(15deg) scaleY(0.6)" }),
            }}
          ></div>
          <div
            className={`absolute z-30 h-full w-full origin-bottom transition-all duration-300 ease-in-out ${
              !open ? "group-hover:transform-[skew(-15deg)_scaleY(0.6)]" : ""
            }`}
            style={{
              backgroundColor: color,
              borderRadius: "5px 10px 10px 10px",
              ...(open && { transform: "skew(-15deg) scaleY(0.6)" }),
            }}
          >
            <span
              className="dark:text-background absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform text-xs font-bold text-white transition-all group-hover:transform-[skew(9deg)_scaleY(0.8)]"
              style={{
                ...(open && { transform: "skew(10deg) scaleY(0.6)" }),
              }}
            >
              {title}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Folder;
