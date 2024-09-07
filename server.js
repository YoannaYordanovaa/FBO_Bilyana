require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const multer = require("multer");
const upload = multer();
const app = express();

app.use(express.static(__dirname));

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to database");
});

app.use(cors());

app.get("/getProducts", (req, res) => {
  let sql = "SELECT * FROM forever_table";
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

app.get("/getProductDetails/:productId", (req, res) => {
  const productId = req.params.productId;
  let sql = "SELECT forever_name FROM forever_table WHERE id = ?";
  db.query(sql, [productId], (err, result) => {
    if (err) throw err;
    res.send(result[0]); 
  });
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/products.html");
});

app.get("/:page", (req, res, next) => {
  const fileName = path.join(__dirname, `${req.params.page}.html`);
  res.sendFile(fileName, (err) => {
    if (err) {
      next();
    }
  });
});

app.listen(3002, () => {
  console.log("Server started on port 3002");
});
