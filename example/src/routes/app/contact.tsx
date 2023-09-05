import { Link, useLoaderData } from "@remix-run/react";
import { Outlet } from "react-router";
import { getProduct } from "../../api/client";

export const meta = () => {
  return [
    { title: "ContactPage" },
    { name: "description", content: "REMIX in VITEJS" },
  ];
};

export const loader = async () => {
  const key = await getProduct();
  console.log("ContactPage Loader", key);
  return {
    key: JSON.stringify(key, null, 2),
  };
};

const ContactPage = () => {
  const { key } = useLoaderData();
  return (
    <div>
      <h2>CONTACT</h2>
      <pre>Key: {key}</pre>
      <ul>
        <li>
          <Link to="./">Index</Link>
        </li>
        <li>
          <Link to="./chat">chat</Link>
        </li>
        <li>
          <Link to="./email">email</Link>
        </li>
      </ul>
      <Outlet />
    </div>
  );
};
export default ContactPage;
