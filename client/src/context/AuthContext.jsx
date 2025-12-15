import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verify user on app load/refresh
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await authService.getProfile();
        setUser(response.currentUser);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  const login = async (email, password) => {
    try {
      // 1️⃣ Login (sets cookie)
      await authService.login(email, password);

      // 2️⃣ Immediately fetch profile
      const profileRes = await authService.getProfile();

      // 3️⃣ Set user from profile (single source of truth)
      setUser(profileRes.currentUser);

      return { success: true };
    } catch (error) {
      setUser(null);
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    }
  };

  const register = async (userData) => {
    try {
      await authService.register(userData);

      const profileRes = await authService.getProfile();
      setUser(profileRes.currentUser);

      return { success: true };
    } catch (error) {
      setUser(null);
      return {
        success: false,
        error: error.response?.data?.message || "Registration failed",
      };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
    }
  };

  const isAuthenticated = !!user; // <-- ADD THIS LINE

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, loading, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
