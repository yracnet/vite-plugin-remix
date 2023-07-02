export const getProduct = async () => {
  let resp = await fetch("https://reqres.in/api/products/3");
  return await resp.json();
};
