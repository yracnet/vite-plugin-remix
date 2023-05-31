import { useLoaderData } from "@remix-run/react";

export const meta = () => {
  return [
    { title: "IndexPage" },
    { name: "description", content: "REMIX in VITEJS" },
  ];
};

export const loader = () => {
  const key = Math.random();
  console.log("IndexPage Loader", key);
  return {
    key,
  };
};

const IndexPage = () => {
  const { key } = useLoaderData();
  return (
    <div>
      <h1>INDEX</h1>
      <b>Key: {key}</b>
      <p>
        Pariatur labore in minim eiusmod aliquip mollit minim irure. Adipisicing
        et culpa consequat amet. Labore cillum dolore laborum nulla qui amet
        incididunt esse aliquip laborum. Aliquip duis qui excepteur tempor
        veniam cupidatat dolore magna. Veniam culpa ex adipisicing pariatur anim
        occaecat incididunt voluptate adipisicing Lorem voluptate nisi mollit
        deserunt.
      </p>
      <p>
        Minim excepteur officia tempor aliqua nulla velit occaecat deserunt et
        exercitation adipisicing mollit pariatur. Et dolor dolor veniam est
        Lorem enim ut aute proident adipisicing aliqua labore enim.
      </p>
      <p>
        Excepteur eu in ut irure non aliquip ullamco aliquip sunt labore non est
        reprehenderit in. Dolore incididunt Lorem veniam adipisicing deserunt
        proident. Id velit qui nulla sint voluptate anim consectetur. Esse nulla
        consequat occaecat dolor.
      </p>
    </div>
  );
};

export default IndexPage;
