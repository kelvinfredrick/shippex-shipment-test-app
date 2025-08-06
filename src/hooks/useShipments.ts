import { useState, useEffect } from "react";
import { Shipment, ShipmentStatus } from "../types";
import apiService from "../services/api";

export const useShipments = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [shipmentStatuses, setShipmentStatuses] = useState<ShipmentStatus[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Load shipment statuses on mount
  useEffect(() => {
    loadShipmentStatuses();
  }, []);

  // Load shipments when search term changes
  useEffect(() => {
    loadShipments();
  }, [searchTerm]);

  const loadShipmentStatuses = async () => {
    try {
      const response = await apiService.getShipmentStatusList();
      if (response.success && response.data) {
        setShipmentStatuses(response.data);
      }
    } catch (error) {
      console.error("Error loading shipment statuses:", error);
    }
  };

  const loadShipments = async (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const response = await apiService.getShipmentList(searchTerm);

      if (response.success && response.data) {
        setShipments(response.data);
      } else {
        setError(response.message || "Failed to load shipments");
      }
    } catch (error) {
      console.error("Error loading shipments:", error);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const refreshShipments = () => {
    loadShipments(true);
  };

  const clearError = () => {
    setError(null);
  };

  const getStatusColor = (status: string) => {
    const statusItem = shipmentStatuses.find((s) => s.name === status);
    return statusItem?.color || "#6B7280";
  };

  const getStatusName = (status: string) => {
    const statusItem = shipmentStatuses.find((s) => s.name === status);
    return statusItem?.status_name || status;
  };

  return {
    shipments,
    shipmentStatuses,
    isLoading,
    isRefreshing,
    error,
    searchTerm,
    setSearchTerm,
    loadShipments,
    refreshShipments,
    clearError,
    getStatusColor,
    getStatusName,
  };
};
