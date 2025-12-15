import api from "./api";

export const cartService = {
  addToCart: async (productId, quantity = 1) => {
    const res = await api.post("/cart/add", { productId, quantity });
    return res.data;
  },

  getCart: async () => {
    try {
      const res = await api.get("/cart/getCart");
      return res.data;
    } catch (error) {
      if (error.response?.status === 401) {
        return { cart: [] };
      }
      throw error;
    }
  },

  removeFromCart: async (itemId) => {
    const res = await api.delete(`/cart/${itemId}`);
    return res.data;
  },
};
