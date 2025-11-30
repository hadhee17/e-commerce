import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Truck, Shield, RefreshCw, Star } from "lucide-react";
import { getProducts } from "../services/productService";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ProductCard from "../components/ProductCard";

const Home = () => {
  // -------- INITIAL LOADING --------
  const [initialLoading, setInitialLoading] = useState(true);

  const [products, setProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  // ---------- FILTER STATES ----------
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("default");

  // -------- FETCH INITIAL PRODUCTS --------
  useEffect(() => {
    const load = async () => {
      const data = await getProducts();
      setProducts(data);
      setInitialLoading(false);
    };
    load();
  }, []);

  // ---------- APPLY FILTERS ON CHANGE ----------
  useEffect(() => {
    applyFilters();
  }, [selectedCategory, priceRange, sortBy]);

  const applyFilters = async () => {
    try {
      const filters = {};

      // CATEGORY
      if (selectedCategory !== "all") filters.category = selectedCategory;

      // PRICE RANGE
      if (priceRange === "under25") filters["price[lte]"] = 25;
      if (priceRange === "25to50") {
        filters["price[gte]"] = 25;
        filters["price[lte]"] = 50;
      }
      if (priceRange === "50to100") {
        filters["price[gte]"] = 50;
        filters["price[lte]"] = 100;
      }
      if (priceRange === "over100") filters["price[gte]"] = 100;

      // SORT
      if (sortBy === "price-low") filters.sort = "price";
      if (sortBy === "price-high") filters.sort = "-price";
      if (sortBy === "rating") filters.sort = "-rating";
      if (sortBy === "name") filters.sort = "title";

      // fetch filtered products (NO LOADING UI)
      const data = await getProducts(filters);
      setProducts(data);
    } catch (error) {
      console.error("Error applying filters:", error);
    }
  };

  const clearFilters = () => {
    setSelectedCategory("all");
    setPriceRange("all");
    setSortBy("default");
  };

  // ---------- SLIDES ----------
  const slides = [
    {
      id: 1,
      title: "Summer Collection 2025",
      subtitle: "Discover the latest trends in fashion",
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop",
      cta: "Shop Now",
      bg: "bg-gradient-to-r from-primary-500 to-secondary-500",
    },
    {
      id: 2,
      title: "Electronics Sale",
      subtitle: "Up to 50% off on all gadgets",
      image:
        "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&h=600&fit=crop",
      cta: "Explore Deals",
      bg: "bg-gradient-to-r from-secondary-500 to-primary-500",
    },
    {
      id: 3,
      title: "New Arrivals",
      subtitle: "Fresh styles added daily",
      image:
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=600&fit=crop",
      cta: "View Collection",
      bg: "bg-gradient-to-r from-primary-600 to-secondary-600",
    },
  ];

  // ---------- FEATURES ----------
  const features = [
    {
      icon: <Truck className="h-8 w-8" />,
      title: "Free Shipping",
      description: "Free shipping on orders over $50",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Secure Payment",
      description: "100% secure payment processing",
    },
    {
      icon: <RefreshCw className="h-8 w-8" />,
      title: "Easy Returns",
      description: "30-day return policy",
    },
    {
      icon: <Star className="h-8 w-8" />,
      title: "Quality Products",
      description: "Curated selection of premium items",
    },
  ];

  // ---------- HERO SLIDE AUTO ----------
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // -------- SHOW INITIAL LOADING ONLY --------
  if (initialLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* ---------- HERO SECTION ---------- */}
      <section className="relative h-96 md:h-[500px] overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className={`${slide.bg} absolute inset-0 opacity-90`}></div>
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white px-4 max-w-4xl">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  {slide.title}
                </h1>
                <p className="text-xl md:text-2xl mb-8">{slide.subtitle}</p>

                <button
                  onClick={() => {
                    const section = document.getElementById("products");
                    if (section) {
                      section.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="inline-block bg-black text-primary-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
                >
                  {slide.cta}
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </section>

      {/* ---------- FEATURES SECTION ---------- */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
              Why Choose ShopEase?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              We provide the best shopping experience with premium services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="text-primary-500 dark:text-primary-400 mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- FILTER SECTION ---------- */}
      <section className="py-10 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Category */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Categories</option>
                <option value="electronics">Electronics</option>
                <option value="jewelery">Jewelery</option>
                <option value="men clothing">Men Clothing</option>
                <option value="women clothing">Women Clothing</option>
              </select>

              {/* Price Range */}
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Prices</option>
                <option value="under25">Under $25</option>
                <option value="25to50">$25 - $50</option>
                <option value="50to100">$50 - $100</option>
                <option value="over100">Over $100</option>
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              >
                <option value="default">Sort By</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="name">Name</option>
              </select>

              {/* Clear */}
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- PRODUCTS SECTION ---------- */}
      <section id="products" className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
              Our Products
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {products.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400 py-12 text-lg">
              No products available.
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
