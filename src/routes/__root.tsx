import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { WaitLink } from "../components/custom/LinkWait";

const RootLayout = () => (
  <>
    <div className="flex gap-2 p-2">
      <WaitLink to="/" waitTime={700} className="[&.active]:font-bold">
        Home
      </WaitLink>{" "}
      <WaitLink to="/about" waitTime={700} className="[&.active]:font-bold">
        About
      </WaitLink>
    </div>
    <hr />
    <Outlet />
    <TanStackRouterDevtools />
  </>
);

export const Route = createRootRoute({ component: RootLayout });
