const mariadb = require("mariadb");
const pool = mariadb.createPool({
  host: "localhost",
  port: "3306",
  user: "root",
  password: "root",
  database: "Shopping",
  connectionLimit: 5,
});


async function getMyShoppingList() {
  let connection;
  let rows;
  try {
    connection = await getConnection();
    rows = await connection.query(
      "SELECT ShoppingList.Id, Product.Name FROM ShoppingList JOIN Product ON ProductId = Product.Id;"
    );
  } catch (err) {
    throw err;
  } finally {
    if (connection) {
      connection.end();
    }
    return rows;
  }
}

async function checkIfProductExists(productName) {
  let connection;
  let result = null;
  try {
    connection = await getConnection();
    result = await connection.query(
      "SELECT * FROM Shopping.Product WHERE Name = (?)",
      [productName]
    );
  } catch (err) {
    connection.rollback();
    console.error(err);
    throw err;
  } finally {
    if (connection) {
      connection.end();
    }
    if (result !== null || result[0] === undefined) {
      return null;
    } else {
      return result[0].Id;
    }
  }
}

async function insertProduct(productName) {
  let connection;
  let result = -1;
  try {
    connection = await getConnection();
    const res = await connection.query(
      "INSERT INTO Shopping.Product (name) value (?)",
      [productName]
    );

    const inserted = await connection.query(
      "SELECT * FROM Shopping.Product WHERE id = (?)",
      res.insertId
    );
    result = inserted[0].Id;
    connection.commit();
  } catch (err) {
    connection.rollback();
    console.error(err);
    throw err;
  } finally {
    if (connection) {
      connection.end();
    }
    return result;
  }
}

async function removeProduct(productShoppingListId) {
  let connection;
  try {
    connection = await getConnection();
    await connection.query("DELETE FROM Shopping.ShoppingList WHERE Id = (?)", [
      productShoppingListId,
    ]);
    connection.commit();
  } catch (err) {
    connection.rollback();
    console.error(err);
    throw err;
  } finally {
    if (connection) {
      connection.end();
    }
  }
}

async function addProductToShoppingList(productId) {
  let connection;
  try {
    connection = await getConnection();
    await connection.query(
      "INSERT INTO Shopping.ShoppingList (ProductId) value (?)",
      [productId]
    );
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    if (connection) return connection.end();
  }
}

async function getConnection() {
  var connection = await pool.getConnection();
  console.log(connection)
  return connection
}

module.exports = {
  getMyShoppingList,
  insertProduct,
  removeProduct,
  addProductToShoppingList,
  checkIfProductExists,
};
