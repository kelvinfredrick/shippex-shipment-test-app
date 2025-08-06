import { useState, useEffect } from "react";
import { User, LoginCredentials, LoginResponse } from "../types";
import apiService from "../services/api";
import { storage } from "../services/storage";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if user is logged in on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const savedUser = await storage.getItem("user");
      const savedToken = await storage.getItem("token");

      if (savedUser && savedToken) {
        setUser(JSON.parse(savedUser));
        apiService.setToken(savedToken);
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
    }
  };

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("🔐 Auth hook: Starting login process...");
      const response: LoginResponse = await apiService.login(credentials);
      console.log("🔐 Auth hook: API response received:", response);

      if (response.success && response.user) {
        console.log("🔐 Auth hook: Login successful, setting user data...");
        setUser(response.user);

        // Save user data and token to storage
        await storage.setItem("user", JSON.stringify(response.user));
        if (response.token) {
          await storage.setItem("token", response.token);
          apiService.setToken(response.token);
          console.log("🔐 Auth hook: Token saved to storage");
        }

        return true;
      } else {
        console.log("🔐 Auth hook: Login failed:", response.message);
        setError(response.message || "Login failed");
        return false;
      }
    } catch (error) {
      console.error("🔐 Auth hook: Login error:", error);
      setError("Network error. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Clear user data and token
      await storage.removeItem("user");
      await storage.removeItem("token");

      setUser(null);
      apiService.clearToken();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    login,
    logout,
    clearError,
    setUser,
  };
};
