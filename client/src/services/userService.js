import api from "./api";

export const userService = {
  getUserById: async (userId) => {
    const res = await api.get(`/${userId}`);
    return res.data;
  },

  getCurrentUser: async () => {
    const res = await api.get("/profile");
    return res.data;
  },

  updateProfile: async (userData) => {
    const res = await api.put("/profile", userData);
    return res.data;
  },

  getUsersByIds: async (userIds) => {
    const res = await api.get(`/users/batch?ids=${userIds.join(",")}`);
    return res.data;
  },
};
