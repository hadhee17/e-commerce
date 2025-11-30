import api from "./api";

export const authService = {
  // Login user
  login: async (email, password) => {
    const res = await api.post("/login", { email, password });
    return res.data;
  },

  // Register user
  register: async (userData) => {
    const res = await api.post("/signup", userData);
    return res.data;
  },

  // Get current user profile
  getProfile: async () => {
    const res = await api.get("/profile");
    return res.data;
  },

  // Logout user
  logout: async () => {
    const res = await api.post("/logout");
    return res.data;
  },
};
