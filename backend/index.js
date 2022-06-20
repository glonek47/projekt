const express = require("express");
const cors = require("cors");
const {
  getMyShoppingList,
  insertProduct,
  addProductToShoppingList,
  checkIfProductExists,
  removeProduct,
} = require("./database/db");

const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());

app.get("/", async (req, res) => {
  const result = await getMyShoppingList();
  res.send(result);
});

app.delete("/product/:id", async (req, res) => {
  const shoppingListElementId = req.params.id;
  await removeProduct(shoppingListElementId);
  const result = await getMyShoppingList();
  res.send(result);
});

app.post("/product", async (req, res) => {
  const productName = req.body.name;
  const productCheck = await checkIfProductExists(productName);
  if (productCheck === null) {
    const insertedId = await insertProduct(productName);
    await addProductToShoppingList(insertedId);
    const result = await getMyShoppingList();
    res.send(result);
    return;
  }
  await addProductToShoppingList(productCheck);
  const result = await getMyShoppingList();
  res.send(result);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
