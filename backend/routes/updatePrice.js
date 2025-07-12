const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

router.put("/update-price/:email/:id", (req, res) => {
  const { email, id } = req.params;
  const { newPrice } = req.body;
  const QR_DIR = req.app.get("qrDir");
  const filePath = path.join(QR_DIR, `qr-data-${email}.json`);

  if (!fs.existsSync(filePath)) return res.status(404).send("File not found");

  const raw = fs.readFileSync(filePath);
  const data = JSON.parse(raw);
  data.products = data.products.map(p =>
    p.id === parseInt(id) ? { ...p, price: newPrice } : p
  );

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  res.send({ message: "Price updated" });
});

module.exports = router;
