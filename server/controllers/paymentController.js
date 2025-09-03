const Payment = require('../models/Transaction');
const User = require('../models/User');

const makePayment = async (req, res) => {
  const { buyerId, sellerId, productId, amount } = req.body;

  try {
    const buyer = await User.findById(buyerId);
    const seller = await User.findById(sellerId);

    if (!buyer || !seller) {
      return res.status(404).json({ error: 'Buyer or seller not found' });
    }

    if ((buyer.balance || 0) < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    buyer.balance = (buyer.balance || 0) - amount;
    seller.balance = (seller.balance || 0) + amount;

    await buyer.save();
    await seller.save();

    const payment = new Payment({
      sender: buyerId,
      receiver: sellerId,
      product: productId,
      amount,
      status: 'success',
    });

    await payment.save();

    res.status(200).json({ message: 'Payment successful', payment });
  } catch (err) {
    res.status(500).json({ error: 'Payment failed', details: err.message });
  }
};

module.exports = { makePayment };