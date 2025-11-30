import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { ShoppingBag, Heart, Star } from "lucide-react";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [isWishlisted, setIsWishlisted] = React.useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product._id,
      name: product.title,
      price: product.price,
      image: product.thumbnail,
      rating: product.rating,
      category: product.category,
      brand: product.brand,
      stock: product.stock,
    });
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
      <Link to={`/product/${product._id}`} className="block">
        {/* Product Image */}
        <div className="relative overflow-hidden">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-48 object-contain group-hover:scale-105 transition-transform duration-300"
          />

          {/* Stock Status */}
          {product.stock === 0 && (
            <span className="absolute top-2 right-2 bg-gray-500 text-white px-2 py-1 rounded text-sm font-semibold">
              Out of Stock
            </span>
          )}

          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className={`absolute top-2 right-2 p-2 rounded-full transition-all ${
              isWishlisted
                ? "bg-red-500 text-white"
                : "bg-white/90 text-gray-600 hover:bg-red-500 hover:text-white"
            }`}
          >
            <Heart
              className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`}
            />
          </button>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-white line-clamp-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            {product.title}
          </h3>

          {/* Brand and Category */}
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-1">
            {product.brand} • {product.category}
          </p>

          {/* Rating */}
          <div className="flex items-center mb-2">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
              ({product.rating})
            </span>
          </div>

          {/* Price and Add to Cart */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                ${product.price}
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              className="bg-primary-500 text-white p-2 rounded-full hover:bg-primary-600 transition-all transform group-hover:scale-110 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={product.stock === 0}
              title={product.stock === 0 ? "Out of stock" : "Add to cart"}
            >
              <ShoppingBag className="h-5 w-5" />
            </button>
          </div>

          {/* Stock Info */}
          {product.stock > 0 && product.stock < 10 && (
            <p className="text-orange-500 text-sm mt-2">
              Only {product.stock} left in stock
            </p>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
