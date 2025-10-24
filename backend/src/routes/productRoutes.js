const express = require('express');
const { body } = require('express-validator');
const {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/', listProducts);
router.get('/:id', getProduct);

router.post('/', auth, adminOnly, [
  body('title').notEmpty(),
  body('price').isFloat({ gt: 0 }),
  body('category').notEmpty()
], createProduct);

router.put('/:id', auth, adminOnly, updateProduct);
router.delete('/:id', auth, adminOnly, deleteProduct);

module.exports = router;
