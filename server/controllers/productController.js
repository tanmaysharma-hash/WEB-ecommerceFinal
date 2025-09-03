const Product = require('../models/Product');

// GET all products (optionally filtered by sellerId or category)
const getAllProducts = async (req, res) => {
  try {
    const { category, sellerId } = req.query;

    let query = {};

    if (category && category !== 'All') {
      query.category = new RegExp(`^${category}$`, 'i'); // case-insensitive
    }

    if (sellerId) {
      query.sellerId = sellerId; // ✅ filter by sellerId
    }

    const products = await Product.find(query);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET products by category (not used in your code but kept for completeness)
const getProductsByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const products = await Product.find({ category });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch category products' });
  }
};

// POST a new product
const addProduct = async (req, res) => {
  const { name, description, price, image, category, sellerId } = req.body;

  if (!sellerId) return res.status(400).json({ error: "Seller ID is required" });

  try {
    const product = new Product({ name, description, price, image, category, sellerId });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add product', details: err.message });
  }
};

module.exports = {
  getAllProducts,
  getProductsByCategory,
  addProduct
};
