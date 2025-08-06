// User related types
export interface User {
  id: string;
  email: string;
  name: string;
  token?: string;
}

export interface LoginCredentials {
  url: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  user?: User;
  token?: string;
}

// Shipment related types
export interface Shipment {
  name: string;
  awb_number?: string;
  status?: string;
  origin?: string;
  destination?: string;
  created?: string;
  modified?: string;
  owner?: string;
  docstatus?: number;
  parent?: string;
  parentfield?: string;
  parenttype?: string;
  idx?: number;
  [key: string]: any; // For additional fields from API
}

export interface ShipmentStatus {
  name: string;
  status_name?: string;
  color?: string;
  description?: string;
  created?: string;
  modified?: string;
  [key: string]: any;
}

// API Response types
export interface ApiResponse<T> {
  message: string;
  data?: T;
  success: boolean;
}

export interface ShipmentListResponse {
  message: string;
  data?: Shipment[];
  success: boolean;
}

export interface ShipmentStatusListResponse {
  message: string;
  data?: ShipmentStatus[];
  success: boolean;
}

// Navigation types
export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Main: undefined;
};

export type MainTabParamList = {
  Shipments: undefined;
  Profile: undefined;
};

// App state types
export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
