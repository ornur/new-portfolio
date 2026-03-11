import {
  createLink,
  type LinkComponent,
  useNavigate,
} from "@tanstack/react-router";
import { forwardRef } from "react";

import { useTheme } from "@/hooks/useTheme";

import { transitionStore } from "../loader/TransitionStore";

type BasicLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  disabled?: boolean;
  href: string;
};

const BasicLinkComponent = forwardRef<HTMLAnchorElement, BasicLinkProps>(
  (props, ref) => {
    const { disabled, href, ...rest } = props;
    const navigate = useNavigate();
    const { toggleTheme } = useTheme();

    const handleClick = async (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      if (disabled) return;
      if (href === "/about") toggleTheme("dark"); // Prevent navigation if already on the target page
      transitionStore.begin();
      // Wait for the draw animation to finish before changing the URL
      await transitionStore.awaitDrawComplete();
      // Navigate — TanStack Router resolves when all loaders are done
      await navigate({ to: href });
      transitionStore.startScaling();
    };

    return (
      <a
        ref={ref}
        {...rest}
        onClick={handleClick}
        onKeyDown={(e) => e.preventDefault}
        role="link"
      />
    );
  },
);

const CreatedLinkComponent = createLink(BasicLinkComponent);

export const WaitLink: LinkComponent<typeof BasicLinkComponent> = (props) => {
  return <CreatedLinkComponent preload={"intent"} {...props} />;
};
