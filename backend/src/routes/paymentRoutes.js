const express = require('express');
const { createPaymentIntent } = require('../controllers/paymentController');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.post('/intent', auth, createPaymentIntent);

module.exports = router;
