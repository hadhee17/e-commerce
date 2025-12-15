import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  User,
  Package,
  ShoppingBag,
  Mail,
  Phone,
  MapPin,
  Calendar,
  LogOut,
} from "lucide-react";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* User Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <User className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                {user.username}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
              <div className="mt-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    user.role === "seller"
                      ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                      : "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                  }`}
                >
                  {user.role === "seller"
                    ? "Seller Account"
                    : "Customer Account"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Side Menu */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <nav className="space-y-2">
                <div className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                  <User className="h-5 w-5" />
                  <span className="font-medium">My Profile</span>
                </div>

                <button
                  onClick={() => navigate("/orders")}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <ShoppingBag className="h-5 w-5" />
                  <span>My Orders</span>
                </button>

                {/* Only show for sellers */}
                {user.role === "seller" && (
                  <button
                    onClick={() => navigate("/seller/products")}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Package className="h-5 w-5" />
                    <span>My Products</span>
                  </button>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors mt-6"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </div>

          {/* User Details */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
                User Information
              </h2>

              <div className="space-y-6">
                {/* Username */}
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-gray-600 dark:text-gray-400 text-sm mb-1">
                      Username
                    </label>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {user.username}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-gray-600 dark:text-gray-400 text-sm mb-1">
                      Email Address
                    </label>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-gray-600 dark:text-gray-400 text-sm mb-1">
                      Phone Number
                    </label>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {user.phone || "Not provided"}
                    </p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-gray-600 dark:text-gray-400 text-sm mb-1">
                      Address
                    </label>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {user.address || "No address provided"}
                    </p>
                  </div>
                </div>

                {/* Role */}
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <div className="h-5 w-5 flex items-center justify-center">
                      {user.role === "seller" ? (
                        <span className="text-green-600 dark:text-green-400 font-bold">
                          S
                        </span>
                      ) : (
                        <span className="text-blue-600 dark:text-blue-400 font-bold">
                          C
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="block text-gray-600 dark:text-gray-400 text-sm mb-1">
                      Account Type
                    </label>
                    <p
                      className={`font-medium ${
                        user.role === "seller"
                          ? "text-green-600 dark:text-green-400"
                          : "text-blue-600 dark:text-blue-400"
                      }`}
                    >
                      {user.role === "seller" ? "Seller" : "Customer"}
                    </p>
                  </div>
                </div>

                {/* Member Since */}
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-gray-600 dark:text-gray-400 text-sm mb-1">
                      Member Since
                    </label>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Account Summary */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  Account Summary
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Account Type
                    </p>
                    <p className="text-lg font-bold">
                      {user.role === "seller" ? "Seller" : "Customer"}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Status
                    </p>
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                      Active
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Email Status
                    </p>
                    <p
                      className={`text-lg font-bold ${
                        user.verified
                          ? "text-green-600 dark:text-green-400"
                          : "text-yellow-600 dark:text-yellow-400"
                      }`}
                    >
                      {user.verified ? "Verified" : "Pending"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
