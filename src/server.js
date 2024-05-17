const path = require("path");

const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const { createHandler } = require("graphql-http/lib/use/http");
const { ruruHTML } = require("ruru/server");

const { loadFilesSync } = require("@graphql-tools/load-files");
const { makeExecutableSchema } = require("@graphql-tools/schema");

const products = require("./products/products.model");
const orders = require("./orders/orders.model");

const PORT = process.env.PORT;

const app = express();

const typesArray = loadFilesSync(path.join(__dirname, "**/*.graphql"));
const resolversArray = loadFilesSync(path.join(__dirname, "**/*.resolvers.js"));

const schema = makeExecutableSchema({
  typeDefs: typesArray,
  resolvers: resolversArray,
  // resolvers:{
  //   Query: {
  //     products: async (parent, args, conext, info) => {
  //       console.log("Getting Products...");
  //       return Promise.resolve(parent.products);
  //     },
  //     orders: (parent) => {
  //       console.log("Getting Orders...");
  //       return parent.orders;
  //     },
  //   },
  // },
});

const rootValue = {
  products,
  orders,
};

app.use("/graphql", createHandler({ schema, rootValue }));

app.use("/", (_req, res) => {
  res.type("html");
  res.end(ruruHTML({ endpoint: "/graphql" }));
});

app.listen(PORT, () => {
  console.log(`[Server]: server running on port ${PORT}`);
});
