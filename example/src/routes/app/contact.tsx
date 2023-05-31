import { useLoaderData } from "@remix-run/react";
import { Outlet } from "react-router";
import { Link } from "react-router-dom";

export const meta = () => {
  return [
    { title: "ContactPage" },
    { name: "description", content: "REMIX in VITEJS" },
  ];
};

export const loader = () => {
  const key = Math.random();
  console.log("ContactPage Loader", key);
  return {
    key,
  };
};

const ContactPage = () => {
  const { key } = useLoaderData();
  return (
    <div>
      <h2>CONTACT</h2>
      <b>Key: {key}</b>
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
