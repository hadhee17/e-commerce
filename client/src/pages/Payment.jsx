// src/pages/Payment.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Shield, Lock, CreditCard } from "lucide-react";
import { createCheckoutSession } from "../services/paymentService";
import { loadStripe } from "@stripe/stripe-js";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { useAuth } from "../context/AuthContext";

const { user } = useAuth();

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Payment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [processing, setProcessing] = useState(false);

  const { product, quantity } = location.state || {};

  useEffect(() => {
    // Redirect back if no product data
    if (!product) {
      navigate(`/product/${id}`);
    }
  }, [product, id, navigate]);
  const handleStripePayment = async () => {
    console.log("PRODUCT:", product);

    try {
      setProcessing(true);

      // Build line items
      const lineItems = [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: product.title,
              description: product.description,
              images: [product.image],
              metadata: {
                productId: product._id,
              },
            },
            unit_amount: Math.round(product.price * 100), // cents
          },
          quantity: quantity,
        },
      ];

      const checkoutData = {
        line_items: lineItems,
        mode: "payment",

        success_url: `${window.location.origin}/buy-now/${id}?session_id={CHECKOUT_SESSION_ID}&type=direct`,

        cancel_url: `${window.location.origin}/buy-now/${id}`,
        customer_email: user.email,
        metadata: {
          productId: product._id,
          quantity: quantity.toString(),
          type: "direct_purchase",
        },
      };

      const sessionData = await createCheckoutSession(checkoutData);

      console.log("Redirecting to Stripe Checkout:", sessionData.url);
      window.location.href = sessionData.url;
    } catch (error) {
      console.error("Payment error:", error);
      alert("Frontend error: " + (error?.message || "unknown"));
      setProcessing(false);
    }
  };

  const subtotal = product ? product.price * quantity : 0;
  const shipping = 0;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Confirmation</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Payment</h1>
          <div className="w-20"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Select Payment Method
              </h2>

              <div className="border-2 border-blue-500 rounded-lg p-4 bg-blue-50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-6 w-6 text-blue-600" />
                    <span className="font-semibold text-gray-800">
                      Credit/Debit Card
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Lock className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">Secure</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Pay securely with your credit or debit card through Stripe.
                </p>
                <button
                  onClick={handleStripePayment}
                  disabled={processing}
                  className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${
                    processing ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {processing ? (
                    <>
                      <LoadingSpinner size="small" />
                      <span>Redirecting to Payment...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="h-5 w-5" />
                      <span>Pay with Stripe</span>
                    </>
                  )}
                </button>
              </div>

              {/* Other payment methods can be added here */}
              <div className="mt-4 text-center">
                <p className="text-gray-500 text-sm">
                  More payment options coming soon...
                </p>
              </div>
            </div>

            {/* Security Assurance */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Security & Privacy
              </h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-green-600">
                  <Shield className="h-5 w-5" />
                  <span>PCI DSS Compliant</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <Lock className="h-5 w-5" />
                  <span>256-bit SSL encryption</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <span>🔒</span>
                  <span>Your payment details are secure and encrypted</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Order Summary
              </h2>

              {/* Product Preview */}
              <div className="flex items-center space-x-3 mb-4 p-3 bg-gray-50 rounded-lg">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-12 h-12 object-contain rounded"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 text-sm truncate">
                    {product.title}
                  </p>
                  <p className="text-gray-600 text-sm">
                    Qty: {quantity} × ${product.price}
                  </p>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total</span>
                    <span className="text-lg font-bold text-blue-600">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Security Badge */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-center space-x-2 text-gray-500 text-sm">
                  <Lock className="h-4 w-4" />
                  <span>Secure payment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
