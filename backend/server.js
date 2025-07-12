const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const QR_DIR = path.join(__dirname, "qr-data");
if (!fs.existsSync(QR_DIR)) fs.mkdirSync(QR_DIR);

// Save new QR
app.post("/api/save-product-qr", (req, res) => {
  const { userEmail, product } = req.body;
  if (!userEmail || !product) return res.status(400).send("Missing data");

  const filePath = path.join(QR_DIR, `qr-data-${userEmail}.json`);
  let data = { userEmail, products: [] };

  if (fs.existsSync(filePath)) {
    const existing = fs.readFileSync(filePath);
    data = JSON.parse(existing);
  }

  data.products.push(product);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  res.send({ message: "QR data saved" });
});

// Fetch saved QRs
app.get("/api/get-user-products/:email", (req, res) => {
  const filePath = path.join(QR_DIR, `qr-data-${req.params.email}.json`);
  if (!fs.existsSync(filePath)) return res.json({ products: [] });

  const raw = fs.readFileSync(filePath);
  res.json(JSON.parse(raw));
});

app.listen(5000, () => {
  console.log("✅ Backend running at http://localhost:5000");
});
