import { Outlet } from "@remix-run/react";
import { Menu } from "../ui/Menu";
export const links = () => {
  return [
    {
      rel: "stylesheet",
      href: "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css",
    },
  ];
};

const AppLayout = () => {
  return (
    <div className="container">
      <h1>Data Router Server Rendering Example</h1>
      <Menu />
      <hr />
      <Outlet />
    </div>
  );
};

export default AppLayout;
