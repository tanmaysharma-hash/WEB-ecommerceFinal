// backend/importproducts.js

require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const products = require('./data/products.json'); // JSON with real-world product data

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await Product.deleteMany();
    await Product.insertMany(products);

    console.log('✅ Product Data Imported!');
    process.exit();
  } catch (error) {
    console.error('❌ Error Importing Product Data:', error);
    process.exit(1);
  }
};

importData();
