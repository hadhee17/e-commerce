import apiCall from "./api";

export const orderService = {
  // Get user orders
  getOrders: async () => {
    return await apiCall("/orders");
  },

  // Get order by ID
  getOrder: async (orderId) => {
    return await apiCall(`/orders/${orderId}`);
  },

  // Create new order
  createOrder: async (orderData) => {
    return await apiCall("/orders", {
      method: "POST",
      body: orderData,
    });
  },

  // Update order status (admin/seller)
  updateOrderStatus: async (orderId, status) => {
    return await apiCall(`/orders/${orderId}/status`, {
      method: "PUT",
      body: { status },
    });
  },

  // Cancel order
  cancelOrder: async (orderId) => {
    return await apiCall(`/orders/${orderId}/cancel`, {
      method: "PUT",
    });
  },

  // Get orders for admin/seller
  getAllOrders: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters);
    const queryString = queryParams.toString();
    const endpoint = queryString
      ? `/orders/admin?${queryString}`
      : "/orders/admin";

    return await apiCall(endpoint);
  },
};
