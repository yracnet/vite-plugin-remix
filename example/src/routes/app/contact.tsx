import { Outlet } from "react-router";
import { Link } from "react-router-dom";
export const meta = () => {
  return [
    { title: "ContactPage" },
    { name: "description", content: "REMIX in VITEJS" },
  ];
};

export const loader = () => {
  console.log("ContactPage Loader", Date.now());
  return {};
};

const ContactPage = () => {
  return (
    <div>
      <h2>CONTACT</h2>
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
