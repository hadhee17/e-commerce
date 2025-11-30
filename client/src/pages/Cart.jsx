import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import {
  Trash2,
  ShoppingBag,
  ArrowLeft,
  Plus,
  Minus,
  LogIn,
} from "lucide-react";
import LoadingSpinner from "../components/common/LoadingSpinner";

const Cart = () => {
  const { cartItems, removeFromCart, getCartTotal, loading, isAuthenticated } =
    useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  const showEmptyCart = !isAuthenticated || cartItems.length === 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back</span>
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
              Shopping Cart
            </h1>
          </div>
          {isAuthenticated && cartItems.length > 0 && (
            <div className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
              {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
            </div>
          )}
        </div>

        {showEmptyCart ? (
          // Empty Cart or Not Logged In State
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
            <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />

            {!isAuthenticated ? (
              // Not Logged In State
              <>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
                  Please Log In
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  You need to be logged in to view and manage your cart.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-3">
                  <button
                    onClick={() => navigate("/login")}
                    className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold flex items-center justify-center space-x-2"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Log In</span>
                  </button>
                </div>
              </>
            ) : (
              // Empty Cart State (when logged in but no items)
              <>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
                  Your cart is empty
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  No items found in your shopping cart
                </p>
              </>
            )}
          </div>
        ) : (
          // Cart with Items (only shown when logged in AND has items)
          <div className="space-y-4">
            {/* Cart Items */}
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start space-x-4">
                  {/* Product Image */}
                  <img
                    src={item.product?.image}
                    alt={item.product?.title}
                    className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg flex-shrink-0"
                  />

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 dark:text-white text-base md:text-lg mb-1 line-clamp-2">
                      {item.product?.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 capitalize">
                      {item.product?.category}
                    </p>
                    <p className="text-primary-600 dark:text-primary-400 font-bold text-lg">
                      ${item.product?.price}
                    </p>
                  </div>

                  {/* Quantity and Actions */}
                  <div className="flex items-center space-x-3">
                    {/* Quantity Control */}
                    <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                      <button className="px-2 py-1 md:px-3 md:py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <Minus className="h-3 w-3 md:h-4 md:w-4" />
                      </button>
                      <span className="px-3 py-1 text-gray-800 dark:text-white min-w-8 text-center text-sm font-medium">
                        {item.quantity || 1}
                      </span>
                      <button className="px-2 py-1 md:px-3 md:py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <Plus className="h-3 w-3 md:h-4 md:w-4" />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-600 hover:text-red-700 p-1 transition-colors"
                      title="Remove from cart"
                    >
                      <Trash2 className="h-4 w-4 md:h-5 md:w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Continue Shopping Button at Bottom */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
