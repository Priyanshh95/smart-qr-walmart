const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

router.post("/save-product-qr", (req, res) => {
  const { userEmail, product } = req.body;
  if (!userEmail || !product) return res.status(400).send("Missing data");

  const QR_DIR = req.app.get("qrDir");
  const filePath = path.join(QR_DIR, `qr-data-${userEmail}.json`);
  let data = { userEmail, products: [] };

  if (fs.existsSync(filePath)) {
    const existing = fs.readFileSync(filePath);
    data = JSON.parse(existing);
  }

  data.products.push(product);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  res.send({ message: "Product added" });
});

module.exports = router;
