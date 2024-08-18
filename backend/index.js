const port = 4000;
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const fs = require('fs');

const app = express();
app.use(express.json());
app.use(cors());

const uploadDir = './upload/images';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Connect to MongoDB
mongoose.connect("mongodb+srv://prudhvi:prudhvi@cluster0.cpnge7h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch(err => {
        console.error("Failed to connect to MongoDB", err);
    });

// Static files
app.use('/images', express.static(path.join(__dirname, 'upload/images')));

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage });

// Product Schema and Model
const productSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    new_price: { type: Number, required: true },
    old_price: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    available: { type: Boolean, default: true }
});

const Product = mongoose.model("Product", productSchema);

// Routes

// Root route
app.get("/", (req, res) => {
    res.send("Express is running");
});

// Upload route
app.post("/upload", upload.single('product'), (req, res) => {
    if (req.file) {
        res.json({
            success: 1,
            image_url: `http://localhost:${port}/images/${req.file.filename}`
        });
    } else {
        res.status(400).json({
            success: 0,
            message: "File upload failed"
        });
    }
});

// Add product route
app.post('/addproduct', async (req, res) => {
    try {
        const { name, image, category, new_price, old_price } = req.body;

        if (!name || !image || !category || !new_price || !old_price) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const lastProduct = await Product.findOne().sort({ id: -1 });
        const id = lastProduct ? lastProduct.id + 1 : 1;

        const product = new Product({
            id,
            name,
            image,
            category,
            new_price,
            old_price
        });

        await product.save();
        console.log("Product saved:", product);
        res.json({ success: true, message: "Product added successfully", product });
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

app.delete('/removeproduct', async (req, res) => {
    try {
        const { id } = req.body;
        const product = await Product.findOneAndDelete({ id });

        if (product) {
            console.log("Product removed:", product);
            res.json({ success: true, message: "Product removed successfully" });
        } else {
            res.status(404).json({ success: false, message: "Product not found" });
        }
    } catch (error) {
        console.error("Error removing product:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// Get all products route
app.get("/allproducts", async (req, res) => {
    try {
        const products = await Product.find({});
        console.log("All products retrieved");
        res.json(products);
    } catch (error) {
        console.error("Error retrieving products:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// User Schema and Signup Route
const Users = mongoose.model('Users', {
    name: { type: String },
    email: { type: String, unique: true },
    password: { type: String },
    cartData: { type: Object },
    date: { type: Date, default: Date.now }
});

app.post('/signup', async (req, res) => {
    try {
        let check = await Users.findOne({ email: req.body.email });
        if (check) {
            return res.status(400).json({ success: false, errors: "Existing email id found" });
        }

        let cart = {};
        for (let i = 0; i < 300; i++) {
            cart[i] = 0;
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const user = new Users({
            name: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            cartData: cart
        });

        await user.save();

        const data = { user: { id: user.id } };
        const token = jwt.sign(data, 'secret_ecom', { expiresIn: '1h' });
        res.json({ success: true, token });
    } catch (error) {
        console.error("Error signing up user:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

app.post('/login', async (req, res) => {
    try {
        let user = await Users.findOne({ email: req.body.email });
        if (user) {
            const passCompare = await bcrypt.compare(req.body.password, user.password);
            if (passCompare) {
                const data = { user: { id: user.id } };
                const token = jwt.sign(data, 'secret_ecom', { expiresIn: '1h' });
                res.json({ success: true, token });
            } else {
                res.status(400).json({ success: false, error: "Wrong Password" });
            }
        } else {
            res.status(400).json({ success: false, error: "Wrong email or password" });
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// Start the server
app.listen(port, (error) => {
    if (!error) {
        console.log("Server running on port " + port);
    } else {
        console.log("Error: " + error);
    }
});
