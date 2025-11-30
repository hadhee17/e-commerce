import api from "./api";

export const reviewService = {
  getReviewsByProductId: async (productId) => {
    const res = await api.get(`/review/get-review/${productId}`);
    return res.data.review;
  },

  createReview: async (productId, reviewData) => {
    const res = await api.post(`/product/${productId}/create-review`, {
      review: reviewData.review,
      rating: reviewData.rating,
    });
    return res.data.review;
  },

  updateReview: async (reviewId, reviewData) => {
    const res = await api.patch(
      `/review/update-review/${reviewId}`,
      reviewData
    );
    return res.data.review;
  },

  deleteReview: async (reviewId) => {
    const res = await api.delete(`/review/delete-review/${reviewId}`);
    return res.data;
  },
};
