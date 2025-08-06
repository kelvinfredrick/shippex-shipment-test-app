import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
} from "react-native";
import { COLORS } from "../constants/theme";
// @ts-ignore
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import BoxIcon from "../assets/icons/box.svg";
import ArrowExpandIcon from "../assets/icons/arrow-expand-04.svg";
import BellIcon from "../assets/icons/bell.svg";
import SearchIcon from "../assets/icons/search.svg";
import FilterIcon from "../assets/icons/filter-icon.svg";
import ScanIcon from "../assets/icons/scan-icon.svg";
import LogoIcon from "../assets/icons/logo-icon.svg";
import FilterBottomSheet from "../components/FilterBottomSheet";

// Types
interface Shipment {
  id: string;
  awb: string;
  route: string;
  status: "RECEIVED" | "CANCELED";
}

interface ShipmentCardProps {
  item: Shipment;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
}

// Mock data for shipments
const shipments: Shipment[] = [
  {
    id: "1",
    awb: "41785691423",
    route: "Cairo → Alexandria",
    status: "RECEIVED",
  },
  {
    id: "2",
    awb: "41785691424",
    route: "Cairo → Alexandria",
    status: "CANCELED",
  },
  {
    id: "3",
    awb: "41785691425",
    route: "Cairo → Alexandria",
    status: "CANCELED",
  },
  {
    id: "4",
    awb: "41785691426",
    route: "Cairo → Alexandria",
    status: "CANCELED",
  },
  {
    id: "5",
    awb: "41785691427",
    route: "Cairo → Alexandria",
    status: "CANCELED",
  },
];

const ShipmentCard: React.FC<ShipmentCardProps> = ({
  item,
  isSelected,
  onToggleSelect,
}) => {
  const isReceived = item.status === "RECEIVED";

  return (
    <View style={styles.shipmentCard}>
      <TouchableOpacity
        style={styles.checkbox}
        onPress={() => onToggleSelect(item.id)}>
        <View
          style={[styles.checkboxInner, isSelected && styles.checkboxSelected]}>
          {isSelected && (
            <MaterialIcons name="check" size={16} color={COLORS.white} />
          )}
        </View>
      </TouchableOpacity>

      <View style={styles.boxIcon}>
        <BoxIcon width={24} height={24} />
      </View>

      <View style={styles.shipmentInfo}>
        <Text style={styles.awbLabel}>AWB</Text>
        <Text style={styles.awbNumber}>{item.awb}</Text>
        <Text style={styles.routeText}>{item.route}</Text>
      </View>

      <View
        style={[
          styles.statusBadge,
          isReceived ? styles.receivedBadge : styles.canceledBadge,
        ]}>
        <Text
          style={[
            styles.statusText,
            isReceived ? styles.receivedText : styles.canceledText,
          ]}>
          {item.status}
        </Text>
      </View>

      <TouchableOpacity style={styles.expandButton}>
        <ArrowExpandIcon width={16} height={16} fill={COLORS.gray} />
      </TouchableOpacity>
    </View>
  );
};

const DashboardScreen: React.FC = () => {
  const [selectedShipments, setSelectedShipments] = useState<Set<string>>(
    new Set()
  );
  const [searchText, setSearchText] = useState("");
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const toggleShipmentSelection = (shipmentId: string) => {
    const newSelected = new Set(selectedShipments);
    if (newSelected.has(shipmentId)) {
      newSelected.delete(shipmentId);
    } else {
      newSelected.add(shipmentId);
    }
    setSelectedShipments(newSelected);
  };

  const markAllShipments = () => {
    if (selectedShipments.size === shipments.length) {
      setSelectedShipments(new Set());
    } else {
      setSelectedShipments(new Set(shipments.map((s) => s.id)));
    }
  };

  const handleFilterPress = () => {
    console.log("Filter button pressed");
    setIsFilterVisible(true);
    console.log("isFilterVisible set to:", true);
  };

  const handleFilterClose = () => {
    setIsFilterVisible(false);
  };

  const handleFilterApply = (selectedStatuses: string[]) => {
    setSelectedFilters(selectedStatuses);
    setIsFilterVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Scrollable Content Area */}
      <View style={styles.scrollableContainer}>
        <ScrollView
          style={styles.shipmentsList}
          contentContainerStyle={styles.shipmentsListContent}
          showsVerticalScrollIndicator={false}>
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Image
                source={require("../assets/icons/avatar.png")}
                style={styles.profileImage}
              />
            </View>

            <View style={styles.headerCenter}>
              <LogoIcon width={100} height={100} />
            </View>

            <TouchableOpacity style={styles.notificationButton}>
              <BellIcon width={24} height={24} />
            </TouchableOpacity>
          </View>
          <View style={styles.greetingContainer}>
            <Text style={styles.greeting}>Hello,</Text>
          </View>
          {/* User Name */}
          <Text style={styles.userName}>Ibrahim Shaker</Text>

          {/* Search and Action Bar */}
          <View style={styles.searchSection}>
            <View style={styles.searchBar}>
              <SearchIcon width={20} height={20} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search"
                placeholderTextColor={COLORS.gray}
                value={searchText}
                onChangeText={setSearchText}
              />
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.filterButton}
                onPress={handleFilterPress}>
                <FilterIcon width={18} height={18} />
                <Text style={styles.filterText}>Filters</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.scanButton}>
                <ScanIcon width={20} height={20} />
                <Text style={styles.scanText}>Add Scan</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Shipments Header */}
          <View style={styles.shipmentsHeader}>
            <Text style={styles.shipmentsTitle}>Shipments</Text>
            <TouchableOpacity
              style={styles.markAllContainer}
              onPress={markAllShipments}>
              <View
                style={[
                  styles.markAllCheckbox,
                  selectedShipments.size === shipments.length &&
                    styles.checkboxSelected,
                ]}>
                {selectedShipments.size === shipments.length && (
                  <MaterialIcons name="check" size={14} color={COLORS.white} />
                )}
              </View>
              <Text style={styles.markAllText}>Mark All</Text>
            </TouchableOpacity>
          </View>

          {/* Shipments List */}
          {shipments.map((item) => (
            <ShipmentCard
              key={item.id}
              item={item}
              isSelected={selectedShipments.has(item.id)}
              onToggleSelect={toggleShipmentSelection}
            />
          ))}
        </ScrollView>
      </View>

      <FilterBottomSheet
        isVisible={isFilterVisible}
        onClose={handleFilterClose}
        onApply={handleFilterApply}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 0,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  greeting: {
    fontSize: 16,
    color: COLORS.gray,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  logoText: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  notificationButton: {
    borderRadius: 20,
    backgroundColor: COLORS.inputBackground,
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.black,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.inputBackground,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 5,
    marginBottom: 12,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.1,
    // shadowRadius: 2,
    // elevation: 0,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: COLORS.white,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  filterButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.inputBackground,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // elevation: 1,
  },
  filterText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "400",
    color: COLORS.gray,
  },
  scanButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  scanText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "400",
    color: COLORS.white,
  },
  shipmentsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  shipmentsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.black,
  },
  markAllText: {
    fontSize: 14,
    fontWeight: "400",
    color: COLORS.primary,
  },
  markAllContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  markAllCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.gray,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollableContainer: {
    flex: 1,
  },
  shipmentsList: {
    flex: 1,
  },
  shipmentsListContent: {
    paddingBottom: 20,
  },
  shipmentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.inputBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 20,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // elevation: 1,
  },
  checkbox: {
    marginRight: 12,
    borderWidth: 0.8,
    borderColor: COLORS.gray,
    borderRadius: 8,
    padding: 1,
  },
  checkboxInner: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  boxIcon: {
    marginRight: 12,
  },
  shipmentInfo: {
    flex: 1,
  },
  awbLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.gray,
    marginBottom: 2,
  },
  awbNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: 4,
  },
  routeText: {
    fontSize: 12,
    color: COLORS.gray,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 12,
  },
  receivedBadge: {
    backgroundColor: "#E3F2FD",
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },
  canceledBadge: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
  },
  receivedText: {
    color: COLORS.primary,
  },
  canceledText: {
    color: COLORS.gray,
  },
  expandButton: {
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
  },
  greetingContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
});

export default DashboardScreen;
