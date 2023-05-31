import { Link, Outlet } from "react-router-dom";
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
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <Link className="nav-link" to="./">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="./about">
              About+
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="./contact">
              Contact
            </Link>
          </li>
        </ul>
      </nav>
      <hr />
      <Outlet />
    </div>
  );
};

export default AppLayout;
