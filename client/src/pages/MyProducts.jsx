import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Eye,
  Package,
  Search,
  Loader,
  CheckCircle,
  Image as ImageIcon,
} from "lucide-react";
import { createProduct, getMyProduct } from "../services/productService";

const MyProducts = () => {
  const navigate = useNavigate();
  const isMounted = useRef(true);
  const hasFetched = useRef(false);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    image: "",
  });

  useEffect(() => {
    isMounted.current = true;

    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchProducts();
    }

    return () => {
      isMounted.current = false;
    };
  }, []);

  const fetchProducts = async () => {
    if (!isMounted.current) return;

    try {
      setLoading(true);
      setError("");

      const productsData = await getMyProduct();

      if (isMounted.current) {
        if (Array.isArray(productsData)) {
          setProducts(productsData);
          if (productsData.length === 0) {
            setError(
              "You haven't added any products yet. Add your first product!"
            );
          }
        } else {
          setProducts([]);
          setError("No products found.");
        }
      }
    } catch (err) {
      if (isMounted.current) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again.");
        setProducts([]);
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  const handleAddProduct = () => {
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setNewProduct({
      title: "",
      description: "",
      price: "",
      category: "",
      image: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newProduct.title.trim()) {
      alert("Please enter product title");
      return;
    }
    if (!newProduct.description.trim()) {
      alert("Please enter product description");
      return;
    }
    if (!newProduct.price || newProduct.price <= 0) {
      alert("Please enter a valid price");
      return;
    }
    if (!newProduct.category) {
      alert("Please select a category");
      return;
    }

    try {
      setSubmitting(true);

      const productData = {
        title: newProduct.title,
        description: newProduct.description,
        price: newProduct.price,
        category: newProduct.category,
        image: newProduct.image || "",
      };

      await createProduct(productData);

      // Show success
      setSuccess("Product added successfully!");
      handleCloseModal();

      setTimeout(() => {
        fetchProducts();
        setSuccess("");
      }, 1500);
    } catch (err) {
      console.error("Error creating product:", err);
      alert(err.response?.data?.message || "Failed to create product.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  const getProductImage = (product) => {
    // If no image or empty string, show placeholder
    if (!product.image || product.image.trim() === "") {
      return (
        <div className="h-48 w-full bg-gray-200 dark:bg-gray-700 flex flex-col items-center justify-center">
          <ImageIcon className="h-12 w-12 text-gray-400 mb-2" />
          <span className="text-gray-500 dark:text-gray-400 text-sm">
            No image
          </span>
        </div>
      );
    }

    return (
      <div className="h-48 overflow-hidden">
        <img
          src={product.image}
          alt={product.title || "Product"}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.style.display = "none";
            e.target.parentElement.innerHTML = `
              <div class="h-48 w-full bg-gray-200 dark:bg-gray-700 flex flex-col items-center justify-center">
                <svg class="h-12 w-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span class="text-gray-500 dark:text-gray-400 text-sm">Image failed to load</span>
              </div>
            `;
          }}
        />
      </div>
    );
  };

  const filteredProducts = products.filter(
    (product) =>
      product?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product?.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product?.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price || 0);
  };

  const getCategoryColor = (category) => {
    const colors = {
      electronics:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      fashion: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
      home: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      books:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      sports:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      general: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    };
    return colors[category] || colors.general;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Loading products...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg flex items-center space-x-3">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            <span className="text-green-800 dark:text-green-300 font-medium">
              {success}
            </span>
          </div>
        )}

        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                My Products
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage your product listings
              </p>
            </div>
            <button
              onClick={handleAddProduct}
              className="mt-4 md:mt-0 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold flex items-center gap-2 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Add New Product
            </button>
          </div>
        </div>

        {/* Error or No Products Message */}
        {error && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center mb-6">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No Products Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
            <button
              onClick={handleAddProduct}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              Add Your First Product
            </button>
          </div>
        )}

        {/* Show products if we have any */}
        {products.length > 0 && (
          <>
            {/* Search Bar */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products by name, description or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
                <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  No products match your search
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Try a different search term
                </p>
                <button
                  onClick={() => setSearchTerm("")}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Clear Search
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product._id || product.id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {/* Product Image - Uses getProductImage function */}
                    {getProductImage(product)}

                    {/* Product Info */}
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-800 dark:text-white text-lg line-clamp-1">
                          {product.title || "Untitled Product"}
                        </h3>
                        <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                          {formatPrice(product.price)}
                        </span>
                      </div>

                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                        {product.description || "No description available"}
                      </p>

                      <div className="flex items-center justify-between mb-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                            product.category
                          )}`}
                        >
                          {product.category || "general"}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          ID: {(product._id || product.id)?.substring(0, 8)}...
                        </span>
                      </div>

                      {/* View Button Only */}
                      <button
                        onClick={() =>
                          handleViewProduct(product._id || product.id)
                        }
                        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        View Product Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Stats Summary */}
            {products.length > 0 && (
              <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 text-center">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {products.length}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Total Products
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 text-center">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {new Set(products.map((p) => p.category)).size}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Categories
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 text-center">
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {products.length > 0
                      ? formatPrice(
                          products.reduce((sum, p) => sum + p.price, 0) /
                            products.length
                        )
                      : "$0.00"}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Avg Price
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 text-center">
                  <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                    {
                      products.filter((p) => !p.image || p.image.trim() === "")
                        .length
                    }
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Without Images
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  Add New Product
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  disabled={submitting}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">
                      Product Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={newProduct.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Enter product title"
                      required
                      disabled={submitting}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={newProduct.description}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Enter product description"
                      required
                      disabled={submitting}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 mb-2">
                        Price ($) *
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={newProduct.price}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="0.00"
                        required
                        disabled={submitting}
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 mb-2">
                        Category *
                      </label>
                      <select
                        name="category"
                        value={newProduct.category}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                        disabled={submitting}
                      >
                        <option value="">Select Category</option>
                        <option value="electronics">Electronics</option>
                        <option value="fashion">Fashion</option>
                        <option value="home">Home & Kitchen</option>
                        <option value="books">Books</option>
                        <option value="sports">Sports</option>
                        <option value="general">General</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">
                      Image URL (Optional)
                    </label>
                    <input
                      type="url"
                      name="image"
                      value={newProduct.image}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="https://example.com/image.jpg"
                      disabled={submitting}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Leave empty if no image available
                    </p>
                  </div>

                  {/* Image Preview */}
                  {newProduct.image ? (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Preview:
                      </p>
                      <div className="border border-gray-300 dark:border-gray-600 rounded p-2">
                        <img
                          src={newProduct.image}
                          alt="Preview"
                          className="h-32 w-32 object-cover rounded mx-auto"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = "none";
                            e.target.parentElement.innerHTML = `
                              <div class="h-32 w-32 bg-gray-200 dark:bg-gray-700 flex flex-col items-center justify-center rounded">
                                <svg class="h-8 w-8 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span class="text-gray-500 dark:text-gray-400 text-xs">Invalid image URL</span>
                              </div>
                            `;
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-700">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <ImageIcon className="inline h-4 w-4 mr-1" />
                        Product will be displayed without an image
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                    disabled={submitting}
                  >
                    {submitting ? "Adding..." : "Add Product"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProducts;
