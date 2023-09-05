import { Link, useLoaderData } from "@remix-run/react";
import { Outlet } from "react-router";
//@ts-ignore
import { getProduct } from "@apiClient";

// export const meta = () => {
//   return [
//     { title: "AboutPage" },
//     { name: "description", content: "REMIX in VITEJS" },
//   ];
// };

// export const errorElement = () => {
//   return <h1>Error1</h1>;
// };

export const loader = async () => {
  const key = await getProduct();
  console.log("AboutPage Loader", key);
  return {
    key: JSON.stringify(key, null, 2),
  };
};

const AboutPage = () => {
  const { key } = useLoaderData();
  return (
    <div>
      <h2>ABOUT</h2>
      <pre>Key: {key}</pre>
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
