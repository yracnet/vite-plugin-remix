import { useLoaderData } from "@remix-run/react";

export const loader = () => {
  const key = Math.random();
  console.log("ChatPage Loader", key);
  return {
    key: `Random Key: ${key}`,
  };
};

const ChatPage = () => {
  const { key } = useLoaderData();
  return (
    <div>
      <h1>CHAT</h1>
      <b>Key: {key}</b>
      <p>
        Eiusmod ut sint occaecat culpa ut anim nisi reprehenderit nulla ex.
        Mollit consequat laborum officia adipisicing ut amet in adipisicing
        mollit veniam nostrud commodo. Laboris fugiat nulla culpa exercitation
        sint dolore.
      </p>
      <p>
        Sint sit officia in incididunt. Ea nulla quis laboris eiusmod deserunt
        non enim laboris anim. Commodo et ex Lorem reprehenderit minim
        incididunt non velit enim eu cillum. Magna commodo in culpa irure qui
        dolore. Culpa quif do excepteur exercitation est ut minim aliqua eu id.
        Ut enim veniam nisi minim laboris est fugiat magna tempor reprehenderit
        ut mollit exercitation. Excepteur enim pariatur ea nulla nulla officia
        sit adipisicing.d
      </p>
    </div>
  );
};
export default ChatPage;
