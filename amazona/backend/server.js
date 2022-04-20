import express from "express";
import res from "express/lib/response.js";
import data from "./data.js";

const app = express();

app.get("/api/products", (req, res) => {
  res.send(data.products);
});

const port = process.env.PORT || 1234;
app.listen(port, () => {
  console.log(`serve at http://localhost:${port}`);
});
