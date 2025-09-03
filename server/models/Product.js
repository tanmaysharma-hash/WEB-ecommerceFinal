const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  image: { type: String, required: true }, // ✅ NOT imageUrl
  category: { type: String, required: true, lowercase: true, trim: true },
  stock: { type: Number, default: 0 },
  sellerId: { type: String, required: true }, // ✅ Important!
}, { timestamps: true });


module.exports = mongoose.model('Product', productSchema);
