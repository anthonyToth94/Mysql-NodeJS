let product = {
  editedId: "",
};
const deleteB = document.querySelectorAll(".delete");
for (const delB of deleteB) {
  delB.onclick = async function (event) {
    const id = event.target.dataset.productid;

    const response = await fetch(`/products/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      console.log("Server Error");
      return;
    }
    window.location.replace("/products");
  };
}

const edit = document.querySelectorAll(".edit");
for (const editB of edit) {
  editB.onclick = async function (event) {
    const id = event.target.dataset.productid;
    product.editedId = id;

    const response = await fetch(`/products/${id}`);
    if (!response.ok) {
      console.log("Server Error");
      return;
    }

    const data = await response.json();

    const section = document.querySelector("section");

    section.innerHTML = `<h4>Update!</h4>
    <form action="" id="update">
      <input
        type="text"
        name="name"
        autocomplete="off"
        required
        value="${data.name}"
      />

      <input
        type="text"
        name="price"
        autocomplete="off"
        required
        value="${data.price}"
      />

      <div class="inputs">
        <label for="yes">Yes</label
        ><input type="radio" id="yes" name="isInStock" value="yes" ${
          data.isInStock === 1 ? "checked" : ""
        } />
        <label for="no">No</label
        ><input type="radio" id="no" name="isInStock" value="no" ${
          data.isInStock === 0 ? "checked" : ""
        }/>
      </div>

      <input type="submit" name="submit" value="Update" />
    </form>`;

    const formUpdate = document.querySelector("#update");

    formUpdate.onsubmit = async (event) => {
      event.preventDefault();

      const name = event.target.elements.name.value;
      const price = event.target.elements.price.value;
      let isInStock = "";
      event.target.elements.isInStock.value === "yes"
        ? (isInStock = "1")
        : (isInStock = "0");

      const response = await fetch(`/products/${product.editedId}`, {
        method: "PUT",
        body: JSON.stringify({
          name: name,
          price: price,
          isInStock: isInStock,
        }),
        headers: {
          "Content-type": "application/json",
        },
      });

      if (!response.ok) {
        console.log("Server Error");
        return;
      }
      editedId = "";

      window.location.replace("/products");
    };
  };
}
