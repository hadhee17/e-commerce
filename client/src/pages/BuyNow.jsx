import { useRef, useState, useEffect } from "react";
import { createOrder } from "../services/orderServices";

import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Shield,
  Truck,
  Check,
  CreditCard,
  CheckCircle,
} from "lucide-react";
import { getProductById } from "../services/productService";
import { useCart } from "../context/CartContext";
import { createCheckoutSession } from "../services/paymentService";
import { loadStripe } from "@stripe/stripe-js";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { useAuth } from "../context/AuthContext";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const BuyNow = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const { user } = useAuth();

  // Check for success callback from Stripe
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const sessionId = queryParams.get("session_id");

    if (sessionId) {
      handlePurchaseSuccess(sessionId);
    }
  }, [location.search]);

  // Get quantity from location state if coming from product detail page
  useEffect(() => {
    if (location.state?.quantity) {
      setQuantity(location.state.quantity);
    }
  }, [location.state]);

  useEffect(() => {
    fetchProduct();
  }, [id]);
  const hasCreatedOrderRef = useRef(false);
  const fetchProduct = async () => {
    try {
      setLoading(true);
      const productData = await getProductById(id);
      setProduct(productData);
    } catch (error) {
      console.error("Error fetching product:", error);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handlePurchaseSuccess = async (sessionId) => {
    try {
      if (purchaseSuccess) return;

      await createOrder({
        product: id,
      });

      // ✅ Mark success FIRST (prevents double run)
      setPurchaseSuccess(true);

      // ✅ Use SAFE values (no product dependency)
      setOrderDetails({
        orderNumber: `ORD-${Date.now()}`,
        totalAmount: "Paid",
        estimatedDelivery: new Date(
          Date.now() + 5 * 24 * 60 * 60 * 1000
        ).toLocaleDateString(),
      });

      // ✅ Clean URL
      window.history.replaceState({}, "", window.location.pathname);
    } catch (error) {
      console.error("Order creation failed:", error);
      alert("Order creation failed. Please contact support.");
    }
  };

  const handleConfirmPurchase = async () => {
    try {
      setProcessing(true);

      const lineItems = [
        {
          price_data: {
            currency: "usd", // use same currency as backend
            product_data: {
              name: product.title,
              description: product.description,
              images: [product.image],
              metadata: {
                productId: product._id,
              },
            },
            unit_amount: Math.round(product.price * 100), // Convert to paise
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

      console.log("Redirecting to:", sessionData.url);
      window.location.href = sessionData.url;
    } catch (error) {
      console.error("Payment error:", error);
      alert("Failed to process payment. Please try again.");
      setProcessing(false);
    }
  };

  const handleAddToCartInstead = () => {
    addToCart(id, quantity);
    navigate("/cart");
  };

  const handleContinueShopping = () => {
    navigate("/");
  };

  const handleViewOrders = () => {
    navigate("/orders");
  };

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Product not found
          </h2>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const subtotal = product.price * quantity;
  const shipping = 0; // Free shipping
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + shipping + tax;

  // Success View
  if (purchaseSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Success Header */}
          <div className="text-center mb-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Purchase Successful!
            </h1>
            <p className="text-gray-600 text-lg">
              Thank you for your purchase. Your order has been confirmed.
            </p>
          </div>

          {/* Order Summary Card */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">
                  Order Information
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Number:</span>
                    <span className="font-medium">
                      {orderDetails?.orderNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Date:</span>
                    <span className="font-medium">
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-medium text-green-600">
                      ${orderDetails?.totalAmount}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-3">
                  Delivery Information
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estimated Delivery:</span>
                    <span className="font-medium">
                      {orderDetails?.estimatedDelivery}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping Method:</span>
                    <span className="font-medium">Standard Delivery</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Summary */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-semibold text-gray-800 mb-3">
                Product Details
              </h3>
              <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-16 h-16 object-contain rounded-lg"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">
                    {product.title}
                  </h4>
                  <p className="text-gray-600 text-sm">Quantity: {quantity}</p>
                  <p className="text-gray-600 text-sm">
                    Price: ${product.price} each
                  </p>
                </div>
                <span className="font-semibold text-blue-600">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons for Success */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleContinueShopping}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
            >
              Continue Shopping
            </button>
            <button
              onClick={handleViewOrders}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
            >
              View My Orders
            </button>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 rounded-lg p-6 mt-6">
            <h3 className="font-semibold text-blue-800 mb-3">What's Next?</h3>
            <div className="space-y-2 text-blue-700">
              <p>• You will receive an order confirmation email shortly</p>
              <p>• We'll notify you when your order ships</p>
              <p>• Expected delivery: 3-5 business days</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Normal Purchase Confirmation View
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
            <span>Back to Product</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            Confirm Your Purchase
          </h1>
          <div className="w-20"></div> {/* Spacer for alignment */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Summary & Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Product Details
              </h2>
              <div className="flex items-start space-x-4">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-20 h-20 object-contain rounded-lg border border-gray-200"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">
                    {product.title}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-4">
                      <span className="text-lg font-bold text-blue-600">
                        ${product.price}
                      </span>
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={decreaseQuantity}
                          disabled={quantity <= 1}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-colors"
                        >
                          -
                        </button>
                        <span className="px-4 py-1 min-w-12 text-center font-medium">
                          {quantity}
                        </span>
                        <button
                          onClick={increaseQuantity}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <span className="text-lg font-semibold">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Shipping Information
              </h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-green-600">
                  <Truck className="h-5 w-5" />
                  <span className="font-medium">Free Shipping</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <Shield className="h-5 w-5" />
                  <span>Secure transaction</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <Check className="h-5 w-5" />
                  <span>Delivery in 3-5 business days</span>
                </div>
              </div>
            </div>

            {/* Return Policy */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Return Policy
              </h2>
              <div className="text-gray-600 space-y-2">
                <p>• 30-day easy return</p>
                <p>• Full refund if items are in original condition</p>
                <p>• Free return shipping</p>
              </div>
            </div>
          </div>

          {/* Order Summary & Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Order Summary
              </h2>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({quantity} items)</span>
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
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-lg">Total</span>
                    <span className="text-xl font-bold text-blue-600">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {/* Confirm Purchase Button */}
                <button
                  onClick={handleConfirmPurchase}
                  disabled={processing}
                  className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
                    processing ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {processing ? (
                    <>
                      <LoadingSpinner size="small" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-5 w-5" />
                      <span>Proceed to Payment</span>
                    </>
                  )}
                </button>

                {/* Add to Cart Instead Button */}
                <button
                  onClick={handleAddToCartInstead}
                  className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 py-3 px-6 rounded-lg font-semibold transition-colors"
                >
                  Add to Cart Instead
                </button>
              </div>

              {/* Security Badge */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center space-x-2 text-gray-500 text-sm">
                  <Shield className="h-4 w-4" />
                  <span>Secure payment encrypted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyNow;
