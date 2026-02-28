import { forwardRef } from "react";
import {
  createLink,
  useNavigate,
  type LinkComponent,
} from "@tanstack/react-router";
import { transitionStore } from "@/contexts/TransitionContext";

interface BasicLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  waitTime?: number;
}

const BasicLinkComponent = forwardRef<HTMLAnchorElement, BasicLinkProps>(
  (props, ref) => {
    const { href, waitTime = 0, ...rest } = props;
    const navigate = useNavigate();

    const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      transitionStore.start();
      setTimeout(() => {
        navigate({ to: href });
      }, waitTime);
    };

    return <a ref={ref} {...rest} onClick={handleClick} />;
  },
);

const CreatedLinkComponent = createLink(BasicLinkComponent);

export const WaitLink: LinkComponent<typeof BasicLinkComponent> = (props) => {
  return <CreatedLinkComponent preload={"intent"} {...props} />;
};
