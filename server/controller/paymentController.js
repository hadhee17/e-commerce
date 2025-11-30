const AppError = require("../utils/appError");
const Stripe = require("stripe");

// Make sure your .env has STRIPE_SECRET_KEY
console.log("STRIPE_SECRET_KEY:", process.env.STRIPE_SECRET_KEY);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

exports.createCheckoutSession = async (req, res, next) => {
  try {
    const {
      line_items,
      mode,
      success_url,
      cancel_url,
      customer_email,
      metadata,
    } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode,
      success_url,
      cancel_url,
      customer_email,
      metadata,
    });

    res.status(200).json({ id: session.id, url: session.url });
  } catch (error) {
    console.error("Stripe Error:", error);
    next(new AppError("Failed to create checkout session", 500));
  }
};
