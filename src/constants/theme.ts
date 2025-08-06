export const COLORS = {
  primary: "#2F50C1", // Deep blue from logo
  white: "#FFFFFF",
  black: "#000000",
  background: "#F5F5F5",
  gray: "#6B7280",
  lightGray: "#E5E7EB",
  success: "#10B981",
  error: "#EF4444",
  warning: "#F59E0B",
  inputBackground: "#F4F2F8",
};

export const SIZES = {
  base: 8,
  small: 12,
  font: 14,
  medium: 16,
  large: 18,
  extraLarge: 24,
  padding: 16,
  radius: 8,
};

export const FONTS = {
  regular: {
    fontWeight: "400" as const,
  },
  medium: {
    fontWeight: "500" as const,
  },
  bold: {
    fontWeight: "700" as const,
  },
  semiBold: {
    fontWeight: "600" as const,
  },
};

export const SHADOWS = {
  light: {
    shadowColor: COLORS.gray,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  medium: {
    shadowColor: COLORS.gray,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  dark: {
    shadowColor: COLORS.gray,
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    elevation: 14,
  },
};
