import { Link } from "@remix-run/react";
import { Outlet } from "react-router";

const CompanyPage = () => {
  return (
    <div>
      <h1>COMPANY </h1>
      <p>
        Mollit esse nostrud cillum aute magna excepteur cillum. Proident
        consequat sit et laboris aliqua ut. Aliqua sint labore pariatur non
        laborum. Magna minim voluptate reprehenderit sint nulla excepteur. Et et
        enim adipisicing duis.
      </p>
      <ul>
        <li>
          <Link to="./">Index</Link>
        </li>
        <li>
          <Link to="./uv">uv</Link>
        </li>
        <li>
          <Link to="./argano">Argano</Link>
        </li>
      </ul>
      <Outlet />
    </div>
  );
};
export default CompanyPage;
