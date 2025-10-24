const express = require('express');
const { body } = require('express-validator');
const {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/', listCategories);
router.post('/', auth, adminOnly, [body('name').notEmpty()], createCategory);
router.put('/:id', auth, adminOnly, updateCategory);
router.delete('/:id', auth, adminOnly, deleteCategory);

module.exports = router;
