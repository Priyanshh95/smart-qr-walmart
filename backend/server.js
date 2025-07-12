const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path"); 

const app = express();
app.use(cors());
app.use(express.json());

// Directories
const QR_DIR = path.join(__dirname, "qr-data");
const PRODUCT_DIR = path.join(__dirname, "product-data");

if (!fs.existsSync(QR_DIR)) fs.mkdirSync(QR_DIR);
if (!fs.existsSync(PRODUCT_DIR)) fs.mkdirSync(PRODUCT_DIR);
app.post("/api/save-product-qr", (req, res) => {
  const { userEmail, product } = req.body;
  if (!userEmail || !product) return res.status(400).send("Missing data");

  const filePath = path.join(QR_DIR, `qr-data-${userEmail}.json`);
  let data = { userEmail, products: [] };

  if (fs.existsSync(filePath)) {
    data = JSON.parse(fs.readFileSync(filePath));
  }

  data.products.push(product);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  res.send({ message: "QR data saved" });
});

// Fetch all QR entries for a user
app.get("/api/get-user-products/:email", (req, res) => {
  const filePath = path.join(QR_DIR, `qr-data-${req.params.email}.json`);
  if (!fs.existsSync(filePath)) return res.json({ products: [] });

  const raw = fs.readFileSync(filePath);
  res.json(JSON.parse(raw));
});

app.post("/api/add-product", (req, res) => {
  const { userEmail, product } = req.body;
  if (!userEmail || !product) return res.status(400).send("Missing data");

  const filePath = path.join(PRODUCT_DIR, `product-${userEmail}.json`);
  let data = { userEmail, products: [] };

  if (fs.existsSync(filePath)) {
    data = JSON.parse(fs.readFileSync(filePath));
  }

  const duplicate = data.products.find(p => p.trackingId === product.trackingId);
  if (duplicate) return res.status(409).send("Product with same trackingId already exists");

  const newProduct = {
    id: Date.now(),
    name: product.name,
    ingredients: product.ingredients,
    price: parseFloat(product.price),
    trackingId: product.trackingId,
    timestamp: new Date().toISOString()
  };

  data.products.push(newProduct);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  res.send({ message: "Product added", product: newProduct });
});

// Get products (non-QR)
app.get("/api/get-products/:email", (req, res) => {
  const filePath = path.join(PRODUCT_DIR, `product-${req.params.email}.json`);
  if (!fs.existsSync(filePath)) return res.json({ products: [] });

  const raw = fs.readFileSync(filePath);
  res.json(JSON.parse(raw));
});

// Delete product by ID
app.delete("/api/delete-product/:email/:id", (req, res) => {
  const filePath = path.join(PRODUCT_DIR, `product-${req.params.email}.json`);
  if (!fs.existsSync(filePath)) return res.status(404).send("No product file");

  const raw = fs.readFileSync(filePath);
  const data = JSON.parse(raw);
  const initialLength = data.products.length;

  data.products = data.products.filter(p => p.id !== parseInt(req.params.id));
  if (data.products.length === initialLength) return res.status(404).send("Product not found");

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  res.send({ message: "Product deleted" });
});

// Update price
app.put("/api/update-price/:email/:id", (req, res) => {
  const filePath = path.join(PRODUCT_DIR, `product-${req.params.email}.json`);
  const { newPrice } = req.body;
  if (!fs.existsSync(filePath)) return res.status(404).send("No product file");

  const raw = fs.readFileSync(filePath);
  const data = JSON.parse(raw);

  let updated = false;
  data.products = data.products.map(p => {
    if (p.id === parseInt(req.params.id)) {
      updated = true;
      return { ...p, price: parseFloat(newPrice) };
    }
    return p;
  });

  if (!updated) return res.status(404).send("Product not found");

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  res.send({ message: "Price updated" });
});


//
// ------------------- START SERVER --------------------
app.listen(5000, () => {
  console.log("✅ Backend running at http://localhost:5000");
});
