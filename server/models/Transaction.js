// backend/models/payments.js

const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },

  amount: {
    type: Number,
    required: true,
  },

  status: {
    type: String,
    enum: ['success', 'failed'],
    default: 'success',
  }

}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
