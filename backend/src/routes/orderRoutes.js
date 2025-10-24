const express = require('express');
const {
  createOrder,
  listOrders,
  getOrderById,
  updateOrderStatus
} = require('../controllers/orderController');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/', listOrders);
router.get('/:id', getOrderById);
router.post('/', createOrder);
router.put('/:id', adminOnly, updateOrderStatus);

module.exports = router;
