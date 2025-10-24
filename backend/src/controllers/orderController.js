const Order = require('../models/Order');
const Product = require('../models/Product');

const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentInfo } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order items are required' });
    }

    const products = await Product.find({ _id: { $in: items.map((item) => item.product) } });

    const totals = items.reduce((acc, item) => {
      const product = products.find((p) => p._id.equals(item.product));
      if (!product) {
        throw new Error(`Product ${item.product} not found`);
      }

      const lineTotal = product.price * item.quantity;
      acc.subtotal += lineTotal;
      return acc;
    }, { subtotal: 0, tax: 0, shipping: 0, grandTotal: 0 });

    totals.tax = totals.subtotal * 0.07;
    totals.shipping = totals.subtotal > 500 ? 0 : 15;
    totals.grandTotal = totals.subtotal + totals.tax + totals.shipping;

    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      paymentInfo,
      totals
    });

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

const listOrders = async (req, res, next) => {
  try {
    const filter = req.user.role === 'admin' || req.user.role === 'manager'
      ? {}
      : { user: req.user._id };

    const orders = await Order.find(filter)
      .populate('items.product')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product')
      .populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (!req.user.role || (req.user.role === 'customer' && !order.user._id.equals(req.user._id))) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = req.body.status || order.status;
    if (req.body.paymentStatus) {
      order.paymentInfo.status = req.body.paymentStatus;
    }
    await order.save();

    res.json(order);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  listOrders,
  getOrderById,
  updateOrderStatus
};
