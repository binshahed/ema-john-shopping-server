const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;

require("dotenv").config();

const bdUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;
const dbName = process.env.DB_NAME;

const uri = `mongodb+srv://${bdUser}:${dbPassword}@cluster0.o73vx.mongodb.net/${dbName}?retryWrites=true&w=majority`;

const app = express();
const port = 5000;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const products = client.db(dbName).collection("products");

  app.post("/addProduct", (req, res) => {
    const product = req.body;
    products.insertOne(product).then((result) => {
      console.log(result);
    });
  });
});

app.listen(port);
