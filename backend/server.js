const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const addProductRoute = require("./routes/addProduct");
const deleteProductRoute = require("./routes/deleteProduct");
const updatePriceRoute = require("./routes/updatePrice");

const app = express();
app.use(cors());
app.use(express.json());

const QR_DIR = path.join(__dirname, "qr-data");
if (!fs.existsSync(QR_DIR)) fs.mkdirSync(QR_DIR);
app.set("qrDir", QR_DIR);

// Routes
app.use("/api", addProductRoute);
app.use("/api", deleteProductRoute);
app.use("/api", updatePriceRoute);

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
