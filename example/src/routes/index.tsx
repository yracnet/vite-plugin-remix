import { Link } from "react-router-dom";

export const meta = () => {
  return [
    { title: "Willyams Yujra" },
    { name: "description", content: "REMIX in VITEJS" },
  ];
};

export default function Index() {
  return (
    <div className="card w-50 m-auto mt-5">
      <div className="card-header">
        <h1>Mollit fugiat aliquip sunt adipisicing qui non veniam deserunt.</h1>
      </div>
      <div className="card-body">
        <p>
          Aute eiusmod commodo incididunt duis adipisicing fugiat dolor est.
          Sunt veniam nisi sunt Lorem tempor exercitation cupidatat est. Esse eu
          ipsum adipisicing fugiat do culpa labore sint aute occaecat. Nulla
          excepteur esse labore exercitation laboris minim proident aliqua
          tempor. Sunt aliquip non commodo dolor nostrud enim et. Nulla cillum
          culpa mollit eu ipsum quis. Duis reprehenderit ad exercitation
          laborum.
        </p>
        <Link to="./app">App</Link>
        <p>
          Cillum pariatur est incididunt cupidatat veniam nostrud aute ea. In
          proident nulla laborum quis culpa id culpa cupidatat ea minim sint
          sunt aute dolor. Veniam irure enim sit laborum minim ea sunt fugiat
          adipisicing incididunt deserunt id duis. Ad esse aliquip cillum
          exercitation reprehenderit laborum consequat.
        </p>
      </div>
    </div>
  );
}
