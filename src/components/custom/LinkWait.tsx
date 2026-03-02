import {
  createLink,
  type LinkComponent,
  useNavigate,
} from "@tanstack/react-router";
import { forwardRef } from "react";

import { transitionStore } from "../loader/TransitionStore";

type BasicLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  disabled?: boolean;
};

const BasicLinkComponent = forwardRef<HTMLAnchorElement, BasicLinkProps>(
  (props, ref) => {
    const { href, disabled, ...rest } = props;
    const navigate = useNavigate();

    const handleClick = async (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      if (disabled) return;
      transitionStore.begin();
      // Wait for the draw animation to finish before changing the URL
      await transitionStore.awaitDrawComplete();
      // Navigate — TanStack Router resolves when all loaders are done
      await navigate({ to: href });
      transitionStore.startScaling();
    };

    return <a ref={ref} {...rest} onClick={handleClick} />;
  },
);

const CreatedLinkComponent = createLink(BasicLinkComponent);

export const WaitLink: LinkComponent<typeof BasicLinkComponent> = (props) => {
  return <CreatedLinkComponent preload={"intent"} {...props} />;
};
