import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { reviewService } from "../services/reviewService";

const SimpleReviewSection = ({ productId }) => {
  const { user, isAuthenticated } = useAuth();

  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadReviews();
  }, [productId]);

  const loadReviews = async () => {
    try {
      setLoading(true);

      // YOUR API RETURNS AN ARRAY DIRECTLY
      const res = await reviewService.getReviewsByProductId(productId);

      console.log("Reviews =>", res); // array of objects
      const data = Array.isArray(res) ? res : [];

      setReviews(data);
    } catch (err) {
      console.error("Error loading reviews:", err);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.trim()) return;

    try {
      setError("");

      await reviewService.createReview(productId, {
        review: newReview,
        rating,
      });

      // After creating — reload list
      loadReviews();

      // Reset form
      setNewReview("");
      setRating(5);
    } catch (err) {
      const msg = err.response?.data?.message || "Error submitting review";
      setError(msg);
    }
  };

  if (loading) return <p className="text-center mt-6">Loading reviews...</p>;

  return (
    <div className="mt-12 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>

      {/* Error Message */}
      {error && <p className="text-red-500 mb-4 font-medium">{error}</p>}

      {/* Review Form */}
      {isAuthenticated && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 p-4 border rounded-lg bg-gray-50"
        >
          <h3 className="font-semibold mb-2">Write a Review</h3>

          <textarea
            className="w-full p-2 border rounded-md mb-3"
            placeholder="Share your thoughts..."
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            required
          />

          <div className="flex items-center gap-3">
            <label>Rating:</label>

            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="p-1 border rounded"
            >
              {[1, 2, 3, 4, 5].map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="ml-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Post
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 && (
          <p className="text-gray-600 text-center">No reviews yet.</p>
        )}

        {reviews.map((r) => (
          <div key={r._id} className="p-4 border rounded-lg bg-white shadow-sm">
            <p className="font-medium">{r.user?.username || "User"}</p>

            <p className="text-yellow-500 font-semibold">⭐ {r.rating}/5</p>

            <p className="text-gray-800 mt-1">{r.review}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimpleReviewSection;
