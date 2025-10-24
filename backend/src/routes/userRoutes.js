const express = require('express');
const { listUsers, updateUserRole } = require('../controllers/userController');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.use(auth, adminOnly);

router.get('/', listUsers);
router.put('/:id/role', updateUserRole);

module.exports = router;
