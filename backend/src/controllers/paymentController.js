const stripe = require('stripe');

let stripeClient;

const getStripe = () => {
  if (!stripeClient) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('Stripe secret key is missing');
    }
    stripeClient = stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripeClient;
};

const createPaymentIntent = async (req, res, next) => {
  try {
    const { amount, currency = 'usd' } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than zero' });
    }

    const intent = await getStripe().paymentIntents.create({
      amount,
      currency,
      metadata: {
        userId: req.user._id.toString()
      }
    });

    res.json({
      clientSecret: intent.client_secret
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPaymentIntent
};
