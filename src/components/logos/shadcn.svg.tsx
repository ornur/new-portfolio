import type { SVGProps } from "react";
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    fill="none"
    height="1em"
    viewBox="0 0 256 256"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M0 0h256v256H0z" />
    <path
      d="m208 128-80 80M192 40 40 192"
      style={{
        fill: "none",
        stroke: "currentColor",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: "32px",
      }}
    />
  </svg>
);
export { SvgComponent as ShadcnSVG };
