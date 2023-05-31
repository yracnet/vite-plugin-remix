import { useLoaderData } from "@remix-run/react";
import { Outlet } from "react-router";
import { Link } from "react-router-dom";

// export const meta = () => {
//   return [
//     { title: "AboutPage" },
//     { name: "description", content: "REMIX in VITEJS" },
//   ];
// };

// export const errorElement = () => {
//   return <h1>Error1</h1>;
// };

export const loader = () => {
  const key = Math.random();
  console.log("AboutPage Loader", key);
  return {
    key,
  };
};

const AboutPage = () => {
  const { key } = useLoaderData();
  return (
    <div>
      <h2>ABOUT</h2>
      <b>Key: {key}</b>
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
