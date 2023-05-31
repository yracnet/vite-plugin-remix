import { Outlet } from "react-router";
import { Link } from "react-router-dom";

// export const meta = () => {
//   return [
//     { title: "AboutPage" },
//     { name: "description", content: "REMIX in VITEJS" },
//   ];
// };

// export const loader = () => {
//   console.log("AboutPage Loader ", Date.now());
//   return {};
// };

// export const errorElement = () => {
//   return <h1>Error1</h1>;
// };

const AboutPage = () => {
  return (
    <div>
      <h2>ABOUT</h2>
      <ul>
        <li>
          <Link to="./">Index</Link>
        </li>
        <li>
          <Link to="./company">comany</Link>
        </li>
        <li>
          <Link to="./reseller">reseller</Link>
        </li>
      </ul>
      <Outlet />
    </div>
  );
};
export default AboutPage;
