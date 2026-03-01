import { forwardRef } from "react";
import {
  createLink,
  useNavigate,
  type LinkComponent,
} from "@tanstack/react-router";
import { transitionStore } from "../loader/TransitionStore";

type BasicLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement>;

const BasicLinkComponent = forwardRef<HTMLAnchorElement, BasicLinkProps>(
  (props, ref) => {
    const { href, ...rest } = props;
    const navigate = useNavigate();

    const handleClick = async (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
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
