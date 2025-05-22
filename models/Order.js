
const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  totalAmount: Number,
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

orderSchema.pre('save', async function (next) {
  let total = 0;
  for (const item of this.items) {
    const product = await mongoose.model('Product').findById(item.product);
    if (!product) throw new Error('Product not found');
    total += product.price * item.quantity;
  }
  this.totalAmount = total;
  next();
});

module.exports = mongoose.model('Order', orderSchema);
