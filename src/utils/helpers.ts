// Date formatting utilities
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (error) {
    return "Invalid Date";
  }
};

export const formatDateTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    return "Invalid Date";
  }
};

// String utilities
export const capitalizeFirst = (str: string): string => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

// Validation utilities
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url.startsWith("http") ? url : `https://${url}`);
    return true;
  } catch {
    return false;
  }
};

// Status utilities
export const getStatusColor = (status: string): string => {
  const statusColors: { [key: string]: string } = {
    received: "#10B981",
    in_transit: "#3B82F6",
    delivered: "#059669",
    cancelled: "#EF4444",
    pending: "#F59E0B",
  };

  return statusColors[status.toLowerCase()] || "#6B7280";
};

export const getStatusText = (status: string): string => {
  const statusTexts: { [key: string]: string } = {
    received: "Received",
    in_transit: "In Transit",
    delivered: "Delivered",
    cancelled: "Cancelled",
    pending: "Pending",
  };

  return statusTexts[status.toLowerCase()] || capitalizeFirst(status);
};

// Network utilities
export const isNetworkError = (error: any): boolean => {
  return (
    error?.message?.includes("Network") ||
    error?.message?.includes("fetch") ||
    error?.code === "NETWORK_ERROR"
  );
};

// Storage utilities
export const generateUniqueId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
