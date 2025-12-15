// src/services/orderService.js
import api from "./api";

/* 🔹 Create New Order */
export async function createOrder(orderData) {
  const res = await api.post("/order/create", orderData);
  return res.data.data.order;
}

/* 🔹 Get User's Orders */
export async function getMyOrders() {
  const res = await api.get("/order/my-orders");
  return res.data.data.orders;
}

/* 🔹 Delete Order */
export async function deleteOrder(orderId) {
  const res = await api.delete(`/order/${orderId}`);
  return res.data;
}

// Optional: Export all functions together
export default {
  createOrder,
  getMyOrders,
  deleteOrder,
};
