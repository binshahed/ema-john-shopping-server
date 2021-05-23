const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;

require("dotenv").config();

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;
const dbName = process.env.DB_NAME;
const uri = `mongodb+srv://${dbUser}:${dbPassword}@cluster0.o73vx.mongodb.net/${dbName}?retryWrites=true&w=majority`;

const app = express();
app.use(bodyParser.json());
app.use(cors());
const port = 5000;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const productsCollection = client
    .db("emaJohnShopping")
    .collection("products");

  const ordersCollection = client.db("emaJohnShopping").collection("order");

  //db Post

  app.post("/addProduct", (req, res) => {
    const products = req.body;
    productsCollection.insertOne(products).then((result) => {
      console.log(result.insertedCount);
      res.send(result.insertedCount);
    });
  });

  //db get all products

  app.get("/products", (req, res) => {
    productsCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  //db get single product

  app.get("/product/:key", (req, res) => {
    productsCollection
      .find({ key: req.params.key })
      .toArray((err, documents) => {
        res.send(documents[0]);
      });
  });

  //db post cart product keys

  app.post("/productsByKeys", (req, res) => {
    const productKey = req.body;
    productsCollection
      .find({ key: { $in: productKey } })
      .toArray((err, documents) => {
        res.send(documents);
      });
  });

  //db Order Detail
  app.post("/addOrder", (req, res) => {
    const order = req.body;
    ordersCollection.insertOne(order).then((result) => {
      console.log(result.insertedCount);
      res.send(result.insertedCount > 0);
    });
  });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port);
