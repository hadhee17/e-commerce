import api from "./api";

export const createCheckoutSession = async (checkoutData) => {
  const response = await api.post(
    "/payment/create-checkout-session",
    checkoutData
  );
  return response.data;
};
