const express = require("express");
const app = express();
const bodyParser = require("body-parser");
require('dotenv').config();

const mysql = require("mysql");
function sqlConnection() {
  return mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });
}

function getCustomers(id) {
  return new Promise((res, rej) => {
    //Connection to database
    const connection = sqlConnection();
    connection.connect();
    //query
    connection.query(
      "SELECT * FROM customer WHERE productid = " + id,
      function (error, results, fields) {
        res(results);
      }
    );
    connection.end();
  });
}

app.set("view engine", "ejs");

app.use(express.static("public"));

//GET
app.get("/", (req, res) => {
  res.render("index");
});

//GET CREATE
app.get("/create", (req, res) => {
  res.render("create");
});

//GET /PRODUCTS
app.get("/products", (req, res) => {
  const connection = sqlConnection();
  connection.connect();

  connection.query("SELECT * FROM products", async function (
    err,
    results,
    fields
  ) {
    for (let result of results) {
      result.customer = await getCustomers(result.id);
    }
    res.render("products", { results: results });
  });

  connection.end();
});

//GET BY ID
app.get("/products/:id", (req, res) => {
  const connection = sqlConnection();
  connection.connect();

  connection.query(
    `SELECT * FROM products WHERE id = ?`,
    [req.params.id],
    (err, result, fields) => {
      if (!result[0]) {
        res.status(404);
        res.send({ error: "Invalid Id" });
        return;
      }
      res.send(result[0]);
    }
  );
  connection.end();
});

//DELETE BY ID
app.delete("/products/:id", (req, res) => {
  const connection = sqlConnection();
  connection.connect();

  connection.query(
    `DELETE FROM products WHERE id = ?`,
    [req.params.id],
    (err, result, fields) => {
      if (!result.affectedRows) {
        res.status(404);
        res.send({ error: "Invalid Id" });
        return;
      }
      res.send({ id: req.params.id });
    }
  );
  connection.end();
});

//UPDATE PRODUCT BY ID
app.put("/products/:id", bodyParser.json(), (req, res) => {
  const updatedProduct = {
    name: req.body.name,
    isInStock: req.body.isInStock,
    price: req.body.price,
  };

  const connection = sqlConnection();
  connection.connect();

  connection.query(
    `UPDATE products SET name=?, isInStock=?, price=? WHERE id =?`,
    [
      updatedProduct.name,
      updatedProduct.isInStock,
      updatedProduct.price,
      req.params.id,
    ],
    (err, result, fields) => {
      if (!result.affectedRows) {
        res.status(404);
        res.send({ error: "It can not inserted!" });
        return;
      }
      updatedProduct.id = req.params.id;
      res.send(updatedProduct);
    }
  );
  connection.end();
});

//POST PRODUCT
app.post("/products", bodyParser.json(), (req, res) => {
  const newProduct = {
    name: req.body.name,
    isInStock: req.body.isInStock,
    price: req.body.price,
  };

  const connection = sqlConnection();
  connection.connect();

  connection.query(
    `INSERT INTO products (name,isInStock,Price) VALUES (?,?,?)`,
    [newProduct.name, newProduct.isInStock, newProduct.price],
    (err, result, fields) => {
      if (!result.affectedRows) {
        res.status(404);
        res.send({ error: "It can not inserted!" });
        return;
      }
      newProduct.id = result.insertId;
      res.send(newProduct);
    }
  );
  connection.end();
});

//POST CUSTOMER
app.post("/customer", bodyParser.json(), (req, res) => {
  const newCustomer = {
    date: req.body.date,
    productid: req.body.productid,
  };

  const connection = sqlConnection();
  connection.connect();

  connection.query(
    `INSERT INTO customer (date,productid) VALUES (?,?)`,
    [newCustomer.date, newCustomer.productid],
    (err, result, fields) => {
      if (!result.affectedRows) {
        res.status(404);
        res.send({ error: "It can not inserted!" });
        return;
      }
      newCustomer.id = result.insertId;
      res.send(newCustomer);
    }
  );
  connection.end();
});

//UPDATE CUSTOMER BY ID
app.put("/customer/:id", bodyParser.json(), (req, res) => {
  const updatedCustomer = {
    date: req.body.date,
    productid: req.body.productid,
  };

  const connection = sqlConnection();
  connection.connect();

  connection.query(
    `UPDATE customer SET date=?, productid= ? WHERE id =?`,
    [updatedCustomer.date, updatedCustomer.productid, req.params.id],
    (err, result, fields) => {
      if (!result.affectedRows) {
        res.status(404);
        res.send({ error: "It can not inserted!" });
        return;
      }
      updatedCustomer.id = req.params.id;
      res.send(updatedCustomer);
    }
  );
  connection.end();
});

app.listen(3000, () => console.log("Server started listening at 3000 port"));
