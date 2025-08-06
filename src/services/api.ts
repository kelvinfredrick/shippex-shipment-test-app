import {
  LoginCredentials,
  LoginResponse,
  ShipmentListResponse,
  ShipmentStatusListResponse,
} from "../types";

const BASE_URL = "https://shippex-demo.bc.brandimic.com/api/method";
const FALLBACK_URL = "https://httpbin.org/post"; // For testing purposes

class ApiService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${BASE_URL}/${endpoint}`;

    const defaultHeaders: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (this.token) {
      defaultHeaders["Authorization"] = `Bearer ${this.token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Test API connectivity
  async testApiConnection(): Promise<boolean> {
    try {
      console.log("🔍 Testing API connectivity...");
      const response = await fetch(`${BASE_URL}/login`, {
        method: "OPTIONS",
        headers: {
          Accept: "application/json",
        },
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      console.log("🔍 API test response status:", response.status);
      return response.status !== 404;
    } catch (error) {
      console.error("🔍 API connectivity test failed:", error);
      return false;
    }
  }

  // Login endpoint
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    console.log("🚀 Starting login API call...");
    console.log("📝 Login credentials:", {
      url: credentials.url,
      email: credentials.email,
      password: "***", // Don't log password
    });

    // Validate credentials before making API call
    if (!credentials.email || !credentials.password) {
      console.log("❌ Validation failed: Missing email or password");
      return {
        success: false,
        message: "Email and password are required",
      };
    }

    if (!credentials.url) {
      console.log("❌ Validation failed: Missing URL");
      return {
        success: false,
        message: "URL is required",
      };
    }

    const formData = new FormData();
    formData.append("usr", credentials.email);
    formData.append("pwd", credentials.password);

    console.log("📤 Making API request to:", `${BASE_URL}/login`);
    console.log("📋 Request method: POST");
    console.log("📋 Request body (FormData):", {
      usr: credentials.email,
      pwd: "***",
    });

    // Test API connectivity first
    const isApiAccessible = await this.testApiConnection();
    if (!isApiAccessible) {
      console.log("❌ API endpoint not accessible");
      return {
        success: false,
        message:
          "Unable to connect to server. Please check your internet connection.",
      };
    }

    try {
      console.log("🌐 Attempting to connect to:", `${BASE_URL}/login`);

      const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
        // Add timeout and additional options for better error handling
        signal: AbortSignal.timeout(30000), // 30 second timeout
      });

      console.log("📥 Response received:");
      console.log("   Status:", response.status);
      console.log("   Status Text:", response.statusText);
      console.log(
        "   Headers:",
        Object.fromEntries(response.headers.entries())
      );

      if (!response.ok) {
        console.log("❌ HTTP Error:", response.status);

        if (response.status === 401) {
          return {
            success: false,
            message: "Invalid email or password",
          };
        } else if (response.status === 404) {
          return {
            success: false,
            message: "Login endpoint not found",
          };
        } else if (response.status >= 500) {
          return {
            success: false,
            message: "Server error. Please try again later",
          };
        } else {
          return {
            success: false,
            message: `Login failed (${response.status})`,
          };
        }
      }

      const data = await response.json();
      console.log("📄 Response data:", JSON.stringify(data, null, 2));

      // Check for successful login response
      if (data.message && data.message.includes("Logged In")) {
        console.log("✅ Login successful!");

        // Extract token from cookies or response headers
        const cookies = response.headers.get("set-cookie");
        let token = null;

        if (cookies) {
          console.log("🍪 Cookies found:", cookies);
          const tokenMatch = cookies.match(/sid=([^;]+)/);
          if (tokenMatch) {
            token = tokenMatch[1];
            console.log("🔑 Token extracted:", token.substring(0, 10) + "...");
            this.setToken(token);
          }
        } else {
          console.log("🍪 No cookies found in response");
        }

        return {
          success: true,
          message: "Login successful",
          user: {
            id: credentials.email,
            email: credentials.email,
            name: credentials.email.split("@")[0],
          },
          token: token || undefined,
        };
      } else if (data.message && data.message.includes("Incorrect")) {
        console.log("❌ Login failed: Incorrect credentials");
        return {
          success: false,
          message: "Invalid email or password",
        };
      } else if (data.message && data.message.includes("Not logged in")) {
        console.log("❌ Login failed: Not logged in");
        return {
          success: false,
          message: "Login failed. Please check your credentials",
        };
      } else {
        console.log("❌ Login failed: Unknown error");
        return {
          success: false,
          message: data.message || "Login failed. Please try again",
        };
      }
    } catch (error) {
      console.error("💥 Login API error:", error);

      if (error instanceof Error) {
        console.error("💥 Error type:", error.constructor.name);
        console.error("💥 Error message:", error.message);
        console.error("💥 Error stack:", error.stack);

        // Check for various network error types
        if (error instanceof TypeError && error.message.includes("fetch")) {
          console.log("🌐 Network error detected - fetch failed");
          return {
            success: false,
            message: "Network error. Please check your internet connection",
          };
        }

        if (error.message.includes("Network request failed")) {
          console.log(
            "🌐 Network request failed - possible CORS or connectivity issue"
          );
          return {
            success: false,
            message:
              "Unable to connect to server. Please check your internet connection and try again.",
          };
        }

        if (error.message.includes("timeout")) {
          console.log("⏰ Request timeout");
          return {
            success: false,
            message: "Request timed out. Please try again.",
          };
        }
      }

      return {
        success: false,
        message: "Login failed. Please try again",
      };
    }
  }

  // Get shipment status list
  async getShipmentStatusList(): Promise<ShipmentStatusListResponse> {
    const formData = new FormData();
    formData.append("doctype", "AWB Status");
    formData.append("fields", '["*"]');

    try {
      const response = await fetch(`${BASE_URL}/frappe.client.get_list`, {
        method: "GET",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch shipment status list");
      }

      const data = await response.json();

      return {
        success: true,
        message: "Shipment status list fetched successfully",
        data: data.message || [],
      };
    } catch (error) {
      console.error("Get shipment status list error:", error);
      return {
        success: false,
        message: "Failed to fetch shipment status list",
        data: [],
      };
    }
  }

  // Get shipment list with optional search
  async getShipmentList(searchTerm?: string): Promise<ShipmentListResponse> {
    const requestBody = {
      doctype: "AWB",
      fields: ["*"],
      filters: searchTerm
        ? {
            name: ["like", `%${searchTerm}%`],
          }
        : {},
    };

    try {
      const response = await fetch(`${BASE_URL}/frappe.client.get_list`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch shipment list");
      }

      const data = await response.json();

      return {
        success: true,
        message: "Shipment list fetched successfully",
        data: data.message || [],
      };
    } catch (error) {
      console.error("Get shipment list error:", error);
      return {
        success: false,
        message: "Failed to fetch shipment list",
        data: [],
      };
    }
  }
}

export default new ApiService();
