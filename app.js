const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const rateLimiter = require("./rateLimiter");
const analyzeSTL = require("./stlAnalyzer");
const calculatePrice = require("./pricingEngine");
const auth = require("./auth");

const app = express();
app.use(express.json());
app.use(rateLimiter);
app.use(express.static("public"));

const upload = multer({
  dest: "server/uploads/",
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    if (!file.originalname.toLowerCase().endsWith(".stl")) {
      return cb(new Error("Only STL files allowed"));
    }
    cb(null, true);
  }
});

const pricingPath = path.join(__dirname, "data/pricing.json");

app.post("/api/quote", upload.single("stl"), (req, res) => {
  try {
    const pricing = JSON.parse(fs.readFileSync(pricingPath));
    const { material, layerHeight, infill, quantity } = req.body;

    const analysis = analyzeSTL(
      req.file.path,
      pricing.materials[material].density
    );

    const result = calculatePrice(
      analysis,
      pricing,
      {
        material,
        layerHeight,
        infill,
        quantity: Number(quantity)
      }
    );

    fs.unlinkSync(req.file.path);

    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/api/admin/pricing", auth, (req, res) => {
  res.json(JSON.parse(fs.readFileSync(pricingPath)));
});

app.post("/api/admin/pricing", auth, (req, res) => {
  fs.writeFileSync(pricingPath, JSON.stringify(req.body, null, 2));
  res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));
