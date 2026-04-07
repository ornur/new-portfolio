import type { SVGProps } from "react";
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    height="1em"
    viewBox="0 0 34 12"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M12.838 0 6.12 11.989H0l5.245-9.361C6.059 1.176 8.088 0 9.778 0Zm15.008 2.997c0-1.655 1.37-2.997 3.06-2.997s3.06 1.342 3.06 2.997c0 1.656-1.37 2.998-3.06 2.998s-3.06-1.342-3.06-2.998ZM13.985 0h6.12l-6.718 11.989h-6.12Zm7.229 0h6.12l-5.246 9.362c-.813 1.451-2.842 2.627-4.532 2.627h-3.06Z"
      fill="var(--token-04d93255-d6ab-4bbc-a194-71e004214fb0, rgb(12, 16, 18))"
    />
  </svg>
);
export { SvgComponent as MotionSVG };
