// backend/routes/productRoutes.js

const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductsByCategory,
  addProduct,
} = require('../controllers/productController');

// GET /api/products - fetch all products
router.get('/', getAllProducts);

// POST /api/products - add new product (seller use)
router.post('/', addProduct);
// productRoutes.js
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch product' });
  }
});

// ADD THIS IN routes/productRoutes.js

const Product = require('../models/Product');

router.put('/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // return the updated product
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(updatedProduct);
  } catch (error) {
    console.error('Update failed:', error);
    res.status(500).json({ message: 'Failed to update product' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete failed:', error);
    res.status(500).json({ message: 'Failed to delete product' });
  }
});




module.exports = router;
