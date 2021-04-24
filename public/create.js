const form = document.querySelector("#createForm");
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = event.target.elements.name.value;
  const price = event.target.elements.price.value;
  let isInStock = "";
  event.target.elements.isInStock.value === "yes"
    ? (isInStock = 1)
    : (isInStock = 0);

  const body = {
    name: name,
    price: price,
    isInStock: isInStock,
  };

  const response = await fetch("/products", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-type": "application/json",
    },
  });

  if (!response.ok) {
    console.log("Server Error");
    return;
  }
  const data = await response.json();
  console.log(data);
  form.reset();
});
